import axios from 'axios';
import toast from 'react-hot-toast';
import { supabase } from './supabaseClient';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: any) => {
    if (error.response && error.response.status === 403) {
      // Check if it's our "No tenant" error
      if (error.response.data?.error?.includes('Access Denied')) {
        toast.error(
          "¡Cuenta no activada!\nContacta a ventas para adquirir tu licencia:\nventas@tufacturard.com",
          { duration: 6000, icon: '🔒' }
        );
      }
    }
    return Promise.reject(error);
  }
);

export default api;
