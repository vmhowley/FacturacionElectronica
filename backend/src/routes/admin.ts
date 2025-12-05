import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Router } from 'express';
import path from 'path';
import { query } from '../db';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const router = Router();

// Initialize Supabase Admin Client (Service Role)
const supabaseUrl = process.env.SUPABASE_URL || '';
// WARNING: This key allows bypassing RLS. Keep it secret!
// In a real app, ensure this key is loaded from a secure backend-only env var (SUPABASE_SERVICE_ROLE_KEY)
// For now, using what we have, but ideally you should add SUPABASE_SERVICE_ROLE_KEY to .env
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Middleware to check if requester is a SUPER ADMIN
// For simplicity MVP, we'll check for a specific header "x-admin-secret" matched against an env var
// In production, checking a specific user role 'super_admin' in DB is better.
const requireSuperAdmin = (req: any, res: any, next: any) => {
    const adminSecret = req.headers['x-admin-secret'];
    if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ error: 'Forbidden: Super Admin Access Required' });
    }
    next();
};

router.use(requireSuperAdmin);

// POST /api/admin/tenants
// Body: { name, rnc, admin_email }
router.post('/tenants', async (req, res) => {
    const client = await query('BEGIN');
    try {
        const { name, rnc, admin_email } = req.body;

        if (!name || !admin_email) {
            return res.status(400).json({ error: 'Missing required fields: name, admin_email' });
        }

        // 1. Create Tenant in DB
        const tenantRes = await query(
            'INSERT INTO tenants (name, rnc, status) VALUES ($1, $2, $3) RETURNING id',
            [name, rnc || null, 'active']
        );
        const tenantId = tenantRes.rows[0].id;

        // 2. Invite User via Supabase Auth
        // inviteUserByEmail automatically creates the user and sends an email invitation magic link
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(admin_email);
        
        if (authError) {
            console.error('Supabase Invite Error:', authError);
            throw new Error('Failed to invite user via Supabase: ' + authError.message);
        }

        const supabaseUid = authData.user.id;

        // 3. Create Admin User record in local users table linked to this tenant
        await query(
            'INSERT INTO users (tenant_id, username, password_hash, role, supabase_uid) VALUES ($1, $2, $3, $4, $5)',
            [tenantId, admin_email, 'supabase_managed', 'admin', supabaseUid]
        );
        
        // 4. Initialize Default Configs for this Tenant (Optional)
        await query(
            "INSERT INTO company_settings (tenant_id, key, value) VALUES ($1, 'company_name', $2), ($1, 'company_rnc', $3)",
            [tenantId, name, rnc || '']
        );

        await query('COMMIT');

        res.status(201).json({
            message: 'Tenant and Admin User created successfully',
            tenant: { id: tenantId, name, rnc },
            admin_user: { email: admin_email, uid: supabaseUid }
        });

    } catch (err: any) {
        await query('ROLLBACK');
        console.error('Error creating tenant:', err);
        res.status(500).json({ error: 'Failed to provision tenant', details: err.message });
    }
});

export default router;
