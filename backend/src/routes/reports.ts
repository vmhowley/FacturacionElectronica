import { Router } from 'express';
import { query } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();
router.use(requireAuth);
// Only Admin and Accountant can see reports
router.use(requireRole(['admin', 'accountant']));

// GET /api/reports/inventory
// Reporte de Existencias y Valorización
router.get('/inventory', async (req, res) => {
    try {
        const result = await query(`
            SELECT 
                sku, description, unit, type, 
                stock_quantity, cost, 
                (stock_quantity * cost) as total_value
            FROM products 
            WHERE tenant_id = $1
            ORDER BY description ASC
        `, [req.tenantId]);
        
        res.json({
            generated_at: new Date(),
            items: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error generating inventory report' });
    }
});

// GET /api/reports/sales-book
// Libro de Ventas (Simplificado para 607)
router.get('/sales-book', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        // Basic valuation
        const result = await query(`
            SELECT 
                i.id, i.e_ncf, i.issue_date, c.rnc_ci as client_rnc, c.name as client_name,
                i.net_total as monto_facturado, i.tax_total as itbis_facturado, i.total
            FROM invoices i
            JOIN clients c ON i.client_id = c.id
            WHERE i.tenant_id = $1 
            AND i.issue_date BETWEEN $2 AND $3
            ORDER BY i.issue_date DESC
        `, [req.tenantId, start_date || '2024-01-01', end_date || '2025-12-31']);

        res.json({
            type: 'Libro de Ventas',
            period: { start: start_date, end: end_date },
            entries: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error generating sales book' });
    }
});

export default router;
