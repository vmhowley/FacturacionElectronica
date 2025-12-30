import api from '../api';
import type { InvoiceFormData } from '../types';

export const createInvoice = async (data: InvoiceFormData): Promise<void> => {
    await api.post('/api/invoices', data);
};
