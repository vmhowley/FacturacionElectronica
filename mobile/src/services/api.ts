import axios from 'axios';

// Automatically detected IP from your environment
const SERVER_IP = '10.0.0.108'; 
const PORT = '3000';

const DEV_API_URL = `http://${SERVER_IP}:${PORT}/api`;

console.log('Using API URL:', DEV_API_URL);

const api = axios.create({
  baseURL: DEV_API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add logging to debug
api.interceptors.request.use(request => {
    console.log(`[API Request] ${request.method?.toUpperCase()} ${request.url}`);
    return request;
}, error => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
});

api.interceptors.response.use(response => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
}, error => {
    console.error('[API Response Error]', error.message);
    if (error.response) {
        console.error('Data:', error.response.data);
        console.error('Status:', error.response.status);
    } else if (error.request) {
        console.error('No response received (Possible Network Error)');
    }
    return Promise.reject(error);
});

export default api;
