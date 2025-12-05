import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ClientForm } from './components/ClientForm';
import { ClientList } from './components/ClientList';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoiceList } from './components/InvoiceList';
import { Layout } from './components/Layout';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { session, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!session) return <Navigate to="/login" replace />;

  return <Layout>{children}</Layout>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<ProtectedRoute><InvoiceList /></ProtectedRoute>} />
      <Route path="/create" element={<ProtectedRoute><InvoiceForm /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><ClientList /></ProtectedRoute>} />
      <Route path="/clients/new" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />
      <Route path="/clients/edit/:id" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
      <Route path="/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
      <Route path="/products/edit/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
    </Routes>
  );
}

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
