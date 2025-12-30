import { Router } from 'express';
import { query } from '../db';
import { requireAuth } from '../middleware/auth';
import { buildECFXML } from '../services/xmlService';
import { logger } from '../utils/logger';
import { getNextNCF } from '../services/sequencesService';

const router = Router();

// Protect all routes
router.use(requireAuth);

// GET /api/invoices
router.get('/', async (req, res) => {
  // Fetch invoices with client names
  try {
    const result = await query(`
        SELECT i.*, c.name as client_name 
        FROM invoices i 
        LEFT JOIN clients c ON i.client_id = c.id 
        WHERE i.tenant_id = $1 
        ORDER BY i.created_at DESC
    `, [req.tenantId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/invoices/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const invRes = await query(`
        SELECT i.*, c.name as client_name, c.rnc_ci as client_rnc 
        FROM invoices i 
        JOIN clients c ON i.client_id = c.id 
        WHERE i.id = $1 AND i.tenant_id = $2
    `, [id, req.tenantId]);
    
    if (invRes.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
    
    const itemsRes = await query(`
        SELECT ii.*, p.description as product_description 
        FROM invoice_items ii 
        LEFT JOIN products p ON ii.product_id = p.id
        WHERE ii.invoice_id = $1
    `, [id]);

    res.json({ ...invRes.rows[0], items: itemsRes.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/invoices
router.post('/', async (req, res) => {
  const client = await query('BEGIN');
  try {
    const { client_id, items, type_code, reference_ncf } = req.body;
    // Calculate totals (simplified)
    let net_total = 0;
    let tax_total = 0;
    
    // Insert invoice
    const invRes = await query(
      'INSERT INTO invoices (tenant_id, client_id, net_total, tax_total, total, type_code, reference_ncf) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [req.tenantId, client_id, 0, 0, 0, type_code || '31', reference_ncf || null]
    );
    const invoiceId = invRes.rows[0].id;

    // Insert items and calc totals
    for (const item of items) {
      const lineAmount = item.quantity * item.unit_price;
      const lineTax = lineAmount * 0.18; // Fixed 18% for now
      net_total += lineAmount;
      tax_total += lineTax;
      
      // Verify product existence to avoid FK violations with stale frontend data
      let productId = item.product_id;
      if (productId === 0 || productId === '0') {
          productId = null;
      } else if (productId) {
         const prodCheck = await query('SELECT id FROM products WHERE id = $1', [productId]);
         if (prodCheck.rows.length === 0) {
             productId = null;
         }
      }
      
      await query(
        'INSERT INTO invoice_items (tenant_id, invoice_id, product_id, quantity, unit_price, line_amount, line_tax) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [req.tenantId, invoiceId, productId, item.quantity, item.unit_price, lineAmount, lineTax]
      );
    }
    
    const total = net_total + tax_total;
    await query('UPDATE invoices SET net_total=$1, tax_total=$2, total=$3 WHERE id=$4', [net_total, tax_total, total, invoiceId]);
    
    await query('COMMIT');
    logger.info(`Invoice created`, { invoiceId, total, tenantId: req.tenantId });
    res.json({ id: invoiceId, status: 'draft' });
  } catch (err) {
    await query('ROLLBACK');
    logger.error('Error creating invoice', { error: err });
    res.status(500).json({ error: 'Error creating invoice' });
  }
});

// POST /api/invoices/:id/sign
router.post('/:id/sign', async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch invoice data
    const invRes = await query('SELECT * FROM invoices WHERE id = $1', [id]);
    if (invRes.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
    const invoice = invRes.rows[0];
    
    // Fetch client and items
    const clientRes = await query('SELECT * FROM clients WHERE id = $1', [invoice.client_id]);
    const itemsRes = await query('SELECT * FROM invoice_items WHERE invoice_id = $1', [id]);
    
    // Fetch tenant info for Emisor
    const tenantRes = await query('SELECT name, rnc FROM tenants WHERE id = $1', [invoice.tenant_id]);
    const tenant = tenantRes.rows[0];

    // Load company config (still needed for cert path, although cert usually should be in tenant or sec storage)
    const { getCompanyConfig } = require('../services/configService');
    const config = await getCompanyConfig(invoice.tenant_id);

    // Determine NCF
    let ncf = invoice.e_ncf;
    if (!ncf) {
      ncf = await getNextNCF(invoice.tenant_id, invoice.type_code || '31');
      // Persist NCF immediately to avoid sequence gaps if signing fails later
      await query('UPDATE invoices SET e_ncf = $1 WHERE id = $2', [ncf, id]);
    }

    // Build data object for XML
    const xmlData = {
      emisor: { rnc: tenant.rnc || config.company_rnc, nombre: tenant.name || config.company_name },
      receptor: { rnc: clientRes.rows[0].rnc_ci, nombre: clientRes.rows[0].name },
      fecha: new Date().toISOString(),
      tipo: invoice.type_code || '31', 
      encf: ncf,
      items: itemsRes.rows.map((it: any) => ({
        descripcion: 'Product ' + it.product_id,
        cantidad: it.quantity,
        precio: it.unit_price,
        monto: it.line_amount,
        impuesto: it.line_tax,
        itbis_rate: '18' // Simplification
      })),
      subtotal: invoice.net_total,
      impuestototal: invoice.tax_total,
      total: invoice.total,
      fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days default
      metodo_pago: '01' // Cash
    };

    const xml = buildECFXML(xmlData as any); // Cast for now
    
    // Sign
    const { loadP12, signXml } = require('../services/signatureService');
    const { privateKeyPem, certPem } = loadP12(config.certificate_path, config.certificate_password);
    const signedXml = signXml(xml, privateKeyPem, certPem);
    
    // Update status and save XML content
    await query('UPDATE invoices SET status=$1, xml_path=$2, e_ncf=$3 WHERE id=$4', ['signed', signedXml, ncf, id]);
    
    res.json({ message: 'Invoice signed successfully', xml: signedXml });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error signing invoice' });
  }
});

// GET /api/invoices/:id/xml
router.get('/:id/xml', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT xml_path FROM invoices WHERE id = $1 AND tenant_id = $2', [id, req.tenantId]);
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });

    const xmlContent = result.rows[0].xml_path;
    
    if (!xmlContent || xmlContent === 'stored_in_db') {
       return res.status(404).json({ error: 'XML content not available for this invoice. Please sign the invoice again or create a new one.' });
    }

    if (!xmlContent.trim().startsWith('<')) {
       // If it doesn't look like XML, send as text to avoid browser parsing errors
       res.header('Content-Type', 'text/plain');
       return res.send(xmlContent);
    }

    res.header('Content-Type', 'application/xml');
    res.send(xmlContent);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching XML' });
  }
});

// POST /api/invoices/:id/send
router.post('/:id/send', async (req, res) => {
  try {
    const { id } = req.params;
    const invRes = await query('SELECT * FROM invoices WHERE id = $1 AND tenant_id = $2', [id, req.tenantId]);
    if (invRes.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
    
    const invoice = invRes.rows[0];
    if (invoice.status !== 'signed') {
       return res.status(400).json({ error: 'Invoice must be signed before sending' });
    }
    
    // Get XML content
    const xmlContent = invoice.xml_path;
    
    if (!xmlContent || !xmlContent.startsWith('<')) {
        return res.status(400).json({ error: 'Invalid or missing XML content' });
    }

    // Send to DGII
    const { sendToDGII } = require('../services/dgiiService');
    const response = await sendToDGII(xmlContent, req.tenantId);
    
    // Update status
    await query('UPDATE invoices SET status=$1 WHERE id=$2 AND tenant_id=$3', ['sent', id, req.tenantId]);
    
    res.json({ message: 'Sent to DGII successfully', trackId: response.trackId || response });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Error sending to DGII: ' + err.message });
  }
});

export default router;
