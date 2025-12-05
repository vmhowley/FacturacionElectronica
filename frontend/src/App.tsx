import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ClientForm } from './components/ClientForm';
import { ClientList } from './components/ClientList';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoiceList } from './components/InvoiceList';
import { Layout } from './components/Layout';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<InvoiceList />} />
          <Route path="/create" element={<InvoiceForm />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/new" element={<ClientForm />} />
          <Route path="/clients/edit/:id" element={<ClientForm />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<ProductForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
