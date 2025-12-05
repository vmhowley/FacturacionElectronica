import { Router } from 'express';
import { query } from '../db';

const router = Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM products ORDER BY description ASC');
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
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
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
      'INSERT INTO products (sku, description, unit_price, tax_rate, unit) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [sku, description, unit_price, tax_rate || 18.00, unit]
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
      'UPDATE products SET sku=$1, description=$2, unit_price=$3, tax_rate=$4, unit=$5 WHERE id=$6 RETURNING *',
      [sku, description, unit_price, tax_rate, unit, id]
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
    const invoices = await query('SELECT id FROM invoice_items WHERE product_id = $1 LIMIT 1', [id]);
    if (invoices.rows.length > 0) {
      return res.status(400).json({ error: 'Cannot delete product used in existing invoices' });
    }

    const result = await query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
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
