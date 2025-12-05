import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { query } from '../db';

dotenv.config();

// Initialize minimal Supabase client for auth verification
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env file');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: any;
      tenantId?: number;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // 1. Verify Token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // 2. Resolve Tenant
    // Check if user exists in local DB
    const userRes = await query('SELECT id, tenant_id FROM users WHERE supabase_uid = $1', [user.id]);
    
    let tenantId;

    if (userRes.rows.length === 0) {
      // Check if maybe they exist by email but haven't linked UID yet (migrating legacy users)
      const emailCheck = await query('SELECT id, tenant_id FROM users WHERE username = $1', [user.email]);
      
      if (emailCheck.rows.length > 0) {
        // Link existing legacy user to the new Supabase UID
        tenantId = emailCheck.rows[0].tenant_id;
        await query('UPDATE users SET supabase_uid = $1 WHERE id = $2', [user.id, emailCheck.rows[0].id]);
      } else {
        // STRICT MODE: If user is not in our DB, deny access.
        // This prevents random people from logging in.
        console.warn(`Unauthorized login attempt: ${user.email} (UID: ${user.id}) - No tenant assigned.`);
        return res.status(403).json({ error: 'Access Denied: No active subscription found for this user.' });
      }
    } else {
      tenantId = userRes.rows[0].tenant_id;
    }

    // Attach to request
    req.user = user;
    req.tenantId = tenantId;

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
