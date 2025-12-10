import { Router } from 'express';
import { query } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.use(requireAuth);
// Only Admin can access settings
router.use(requireRole(['admin']));

// GET /api/settings/company
router.get('/company', async (req, res) => {
    try {
        const result = await query(
            'SELECT name, rnc, address, phone, email, type FROM tenants WHERE id = $1',
            [req.tenantId]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Company not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching company info' });
    }
});

// PUT /api/settings/company
router.put('/company', async (req, res) => {
    try {
        const { name, address, phone, email } = req.body;
        // Note: RNC and Type are usually immutable after registration or require stronger checks
        await query(
            'UPDATE tenants SET name = $1, address = $2, phone = $3, email = $4 WHERE id = $5',
            [name, address, phone, email, req.tenantId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating company info' });
    }
});

// GET /api/settings/users
router.get('/users', async (req, res) => {
    try {
        const result = await query(
            'SELECT id, username, role, created_at FROM users WHERE tenant_id = $1 ORDER BY created_at DESC',
            [req.tenantId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// GET /api/settings/sequences
router.get('/sequences', async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM sequences WHERE tenant_id = $1 ORDER BY type_code ASC',
            [req.tenantId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching sequences' });
    }
});

// PUT /api/settings/sequences/:id
router.put('/sequences/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { next_number, end_date } = req.body;
        
        await query(
            'UPDATE sequences SET next_number = $1, end_date = $2 WHERE id = $3 AND tenant_id = $4',
            [next_number, end_date, id, req.tenantId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating sequence' });
    }
});

export default router;
