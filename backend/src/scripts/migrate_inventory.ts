
import { query } from '../db';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const migrate = async () => {
    try {
        console.log('Starting migration...');
        
        // Add columns if they don't exist
        await query(`
            DO $$ 
            BEGIN 
                BEGIN
                    ALTER TABLE products ADD COLUMN type VARCHAR(20) CHECK (type IN ('product', 'service')) DEFAULT 'product';
                EXCEPTION
                    WHEN duplicate_column THEN NULL;
                END;
                
                BEGIN
                    ALTER TABLE products ADD COLUMN cost DECIMAL(12, 2) DEFAULT 0.00;
                EXCEPTION
                    WHEN duplicate_column THEN NULL;
                END;

                BEGIN
                    ALTER TABLE products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
                EXCEPTION
                    WHEN duplicate_column THEN NULL;
                END;

                BEGIN
                    ALTER TABLE products ADD COLUMN category VARCHAR(50);
                EXCEPTION
                    WHEN duplicate_column THEN NULL;
                END;
            END $$;
        `);

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
