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

app.use('/api/invoices', invoiceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Facturación Electrónica API is running');
});

import { initDb } from './db';

app.listen(port, async () => {
  await initDb();
  console.log(`Server is running on port ${port}`);
});
