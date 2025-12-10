import { query } from '../db';
import { logger } from '../utils/logger';

export const getNextNCF = async (tenantId: number, typeCode: string): Promise<string> => {
  try {
    // Start transaction
    await query('BEGIN');

    // 1. Get the current sequence for this tenant and type
    const res = await query(
      `SELECT * FROM sequences 
       WHERE tenant_id = $1 AND type_code = $2 
       FOR UPDATE`, 
      [tenantId, typeCode]
    );

    if (res.rows.length === 0) {
      await query('ROLLBACK');
      throw new Error(`No sequence configured for type ${typeCode}`);
    }

    const sequence = res.rows[0];
    const currentDate = new Date();

    // 2. Validate dates
    if (sequence.start_date && new Date(sequence.start_date) > currentDate) {
      await query('ROLLBACK');
      throw new Error('Sequence not yet active');
    }
    if (sequence.end_date && new Date(sequence.end_date) < currentDate) {
      await query('ROLLBACK');
      throw new Error('Sequence expired');
    }

    // 3. Validate numeric range
    if (sequence.current_end_number && sequence.next_number > sequence.current_end_number) {
      await query('ROLLBACK');
      throw new Error('Sequence exhausted');
    }

    // 4. Generate NCF
    // Format: E + Type (2) + Sequence (10)
    // Example: E310000000001
    const seqStr = sequence.next_number.toString().padStart(10, '0');
    const ncf = `E${typeCode}${seqStr}`;

    // 5. Increment sequence
    await query(
      `UPDATE sequences 
       SET next_number = next_number + 1 
       WHERE id = $1`,
      [sequence.id]
    );

    // Commit transaction
    await query('COMMIT');
    
    return ncf;
  } catch (error) {
    // If not already rolled back (though 'BEGIN' ensures we should rollback on error if we started it)
    try {
        await query('ROLLBACK');
    } catch (e) { /* ignore rollback error if no transaction active */ }
    
    logger.error('Error generating NCF', { tenantId, typeCode, error });
    throw error;
  }
};
