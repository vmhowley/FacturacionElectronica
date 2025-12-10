import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

import clientRoutes from './routes/clients';
import invoiceRoutes from './routes/invoices';
import productRoutes from './routes/products';

app.use(cors());
app.use(express.json());

import adminRoutes from './routes/admin';
import authRoutes from './routes/auth';
import authPublicRoutes from './routes/auth_public'; // Add .ts extension if needed or check resolution
import settingsRoutes from './routes/settings';

app.use('/api/invoices', invoiceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth/public', authPublicRoutes); // Public endpoints
app.use('/api/auth', authRoutes); // Protected endpoints
app.use('/api/settings', settingsRoutes);

app.get('/', (req, res) => {
  res.send('Facturación Electrónica API is running');
});

import { initDb } from './db';
import reportsRoutes from './routes/reports';

app.use('/api/reports', reportsRoutes);

app.listen(port, async () => {
  await initDb();
  console.log(`Server is running on port ${port}`);
});
