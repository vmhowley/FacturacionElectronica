import api from '../api';
import type { Client } from '../types';

export const getClients = async (): Promise<Client[]> => {
    const response = await api.get('/api/clients');
    return response.data;
};
