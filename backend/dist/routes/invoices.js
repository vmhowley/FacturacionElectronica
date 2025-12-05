"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const xmlService_1 = require("../services/xmlService");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
// GET /api/invoices
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, db_1.query)('SELECT * FROM invoices ORDER BY created_at DESC');
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
}));
// POST /api/invoices
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield (0, db_1.query)('BEGIN');
    try {
        const { client_id, items } = req.body;
        // Calculate totals (simplified)
        let net_total = 0;
        let tax_total = 0;
        // Insert invoice
        const invRes = yield (0, db_1.query)('INSERT INTO invoices (client_id, net_total, tax_total, total) VALUES ($1, $2, $3, $4) RETURNING id', [client_id, 0, 0, 0]);
        const invoiceId = invRes.rows[0].id;
        // Insert items and calc totals
        for (const item of items) {
            const lineAmount = item.quantity * item.unit_price;
            const lineTax = lineAmount * 0.18; // Fixed 18% for now
            net_total += lineAmount;
            tax_total += lineTax;
            yield (0, db_1.query)('INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price, line_amount, line_tax) VALUES ($1, $2, $3, $4, $5, $6)', [invoiceId, item.product_id, item.quantity, item.unit_price, lineAmount, lineTax]);
        }
        const total = net_total + tax_total;
        yield (0, db_1.query)('UPDATE invoices SET net_total=$1, tax_total=$2, total=$3 WHERE id=$4', [net_total, tax_total, total, invoiceId]);
        yield (0, db_1.query)('COMMIT');
        logger_1.logger.info(`Invoice created`, { invoiceId, total });
        res.json({ id: invoiceId, status: 'draft' });
    }
    catch (err) {
        yield (0, db_1.query)('ROLLBACK');
        logger_1.logger.error('Error creating invoice', { error: err });
        res.status(500).json({ error: 'Error creating invoice' });
    }
}));
// POST /api/invoices/:id/sign
router.post('/:id/sign', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Fetch invoice data
        const invRes = yield (0, db_1.query)('SELECT * FROM invoices WHERE id = $1', [id]);
        if (invRes.rows.length === 0)
            return res.status(404).json({ error: 'Invoice not found' });
        const invoice = invRes.rows[0];
        // Fetch client and items
        const clientRes = yield (0, db_1.query)('SELECT * FROM clients WHERE id = $1', [invoice.client_id]);
        const itemsRes = yield (0, db_1.query)('SELECT * FROM invoice_items WHERE invoice_id = $1', [id]);
        // Build data object for XML
        const xmlData = {
            emisor: { rnc: '131231231', nombre: 'Mi Empresa SRL' }, // Should come from config
            receptor: { rnc: clientRes.rows[0].rnc_ci, nombre: clientRes.rows[0].name },
            fecha: new Date().toISOString(),
            tipo: '31', // Example
            encf: 'E3100000001', // Should generate from sequence
            items: itemsRes.rows.map((it) => ({
                descripcion: 'Product ' + it.product_id,
                cantidad: it.quantity,
                precio: it.unit_price,
                monto: it.line_amount,
                impuesto: it.line_tax
            })),
            subtotal: invoice.net_total,
            impuestototal: invoice.tax_total,
            total: invoice.total
        };
        const xml = (0, xmlService_1.buildECFXML)(xmlData); // Cast for now
        // Sign
        // Ideally load cert from secure path
        // const { privateKeyPem, certPem } = loadP12('./cert.p12', 'password');
        // const signedXml = signXml(xml, privateKeyPem, certPem);
        // Save XML
        // fs.writeFileSync(`invoices/${id}.xml`, signedXml);
        // Update status
        // await query('UPDATE invoices SET status=$1, xml_path=$2 WHERE id=$3', ['signed', `invoices/${id}.xml`, id]);
        res.json({ message: 'Invoice signed (simulation)', xml });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error signing invoice' });
    }
}));
exports.default = router;
