import path from 'path';
import { query } from '../db';

interface CompanyConfig {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> parent of 0e146c6 (New modules)
    company_name: string;
    company_rnc: string;
    certificate_path: string;
    certificate_password: string;
<<<<<<< HEAD
    certificate_content?: string; // Base64 content from DB
}

export const getCompanyConfig = async (tenantId: number): Promise<CompanyConfig> => {
    try {
        const res = await query('SELECT key, value FROM company_settings WHERE tenant_id = $1', [tenantId]);
        const config: any = {};
        
        res.rows.forEach(row => {
            config[row.key] = row.value;
        });

        // Default fallback if DB is empty or missing specific keys (useful for dev)
        const defaults: any = {
            company_name: 'EMPRESA DEFAULT',
            company_rnc: '000000000',
            certificate_path: path.join(__dirname, '../../certs/test-cert.p12'),
            certificate_password: 'password'
        };

        // If certificate_path in DB is 'default' or relative, resolving it might be needed.
        // For now, if it is 'default', we override with the test cert path.
        if (config.certificate_path === 'default' || !config.certificate_path) {
            config.certificate_path = defaults.certificate_path;
        }

        // If certificate_content exists, we might want to use it instead of path.
        // We'll return it so the service can decide.

        return { ...defaults, ...config };
    } catch (err) {
        console.error('Error fetching company config', err);
        throw new Error('Failed to load company configuration');
    }
};

export const updateCompanyConfig = async (tenantId: number, key: string, value: string) => {
    await query(
        'INSERT INTO company_settings (tenant_id, key, value) VALUES ($1, $2, $3) ON CONFLICT (tenant_id, key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP',
        [tenantId, key, value]
=======
  company_name: string;
  company_rnc: string;
  certificate_path: string;
  certificate_password: string;
  electronic_invoicing: boolean;
}

export const getCompanyConfig = async (
  tenantId: number
): Promise<CompanyConfig> => {
  try {
    const res = await query(
      "SELECT key, value FROM company_settings WHERE tenant_id = $1",
      [tenantId]
>>>>>>> e13c1c56369376f9cf75487492a8655b0820a6ba
=======
}

export const getCompanyConfig = async (tenantId: number): Promise<CompanyConfig> => {
    try {
        const res = await query('SELECT key, value FROM company_settings WHERE tenant_id = $1', [tenantId]);
        const config: any = {};
        
        res.rows.forEach(row => {
            config[row.key] = row.value;
        });

        // Default fallback if DB is empty or missing specific keys (useful for dev)
        const defaults: any = {
            company_name: 'EMPRESA DEFAULT',
            company_rnc: '000000000',
            certificate_path: path.join(__dirname, '../../certs/test-cert.p12'),
            certificate_password: 'password'
        };

        // If certificate_path in DB is 'default' or relative, resolving it might be needed.
        // For now, if it is 'default', we override with the test cert path.
        if (config.certificate_path === 'default' || !config.certificate_path) {
            config.certificate_path = defaults.certificate_path;
        }

        return { ...defaults, ...config };
    } catch (err) {
        console.error('Error fetching company config', err);
        throw new Error('Failed to load company configuration');
    }
};

export const updateCompanyConfig = async (tenantId: number, key: string, value: string) => {
    await query(
        'INSERT INTO company_settings (tenant_id, key, value) VALUES ($1, $2, $3) ON CONFLICT (tenant_id, key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP',
        [tenantId, key, value]
>>>>>>> parent of 0e146c6 (New modules)
    );
};
