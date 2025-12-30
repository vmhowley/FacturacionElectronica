import api from '../api';
import type { Product } from '../types';

export const getProducts = async (): Promise<Product[]> => {
    const response = await api.get('/api/products');
    // Ensure unit_price is handled correctly if it comes as string
    return response.data.map((p: any) => ({
        ...p,
        unit_price: typeof p.unit_price === 'string' ? parseFloat(p.unit_price) : p.unit_price
    }));
};
