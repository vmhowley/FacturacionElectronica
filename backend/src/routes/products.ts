import { Router } from 'express';
import { query } from '../db';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Protect all routes
router.use(requireAuth);

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM products WHERE tenant_id = $1 ORDER BY description ASC', [req.tenantId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM products WHERE id = $1 AND tenant_id = $2', [id, req.tenantId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const { sku, description, unit_price, tax_rate, unit } = req.body;
    const result = await query(
      'INSERT INTO products (tenant_id, sku, description, unit_price, tax_rate, unit) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.tenantId, sku, description, unit_price, tax_rate || 18.00, unit]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Error creating product', details: (err as any).message });
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sku, description, unit_price, tax_rate, unit } = req.body;
    const result = await query(
      'UPDATE products SET sku=$1, description=$2, unit_price=$3, tax_rate=$4, unit=$5 WHERE id=$6 AND tenant_id=$7 RETURNING *',
      [sku, description, unit_price, tax_rate, unit, id, req.tenantId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating product' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Check if product is used in invoices
    const invoices = await query('SELECT id FROM invoice_items WHERE product_id = $1 AND tenant_id = $2 LIMIT 1', [id, req.tenantId]);
    if (invoices.rows.length > 0) {
      return res.status(400).json({ error: 'Cannot delete product used in existing invoices' });
    }

    const result = await query('DELETE FROM products WHERE id = $1 AND tenant_id = $2 RETURNING id', [id, req.tenantId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting product' });
  }
});

export default router;
