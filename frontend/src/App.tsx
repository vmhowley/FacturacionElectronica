import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { GlobalLoader } from './components/GlobalLoader';

// Pages & Components
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Landing } from './pages/Landing';
import { Pricing } from './pages/Pricing';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Dashboard } from './pages/Dashboard';

import { ClientForm } from './components/ClientForm';
import { ClientList } from './components/ClientList';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoiceList } from './components/InvoiceList';
import { InvoiceDetails } from './components/InvoiceDetails';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';

// Protected Route Component
const ProtectedRoute = ({ children, roles }: { children: JSX.Element, roles?: string[] }) => {
  const { session, loading, profile } = useAuth(); // Assuming profile is loaded

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!session) return <Navigate to="/login" replace />;

  if (roles && profile && !roles.includes(profile.role)) {
     return <div className="p-10 text-center text-red-500">Acceso Denegado: Permisos insuficientes (Rol: {profile.role})</div>;
  }

  return <Layout>{children}</Layout>;
};

// Route that redirects to Dashboard if logged in, otherwise renders children (Public Page)
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { session, loading } = useAuth();
  if (loading) return null; // Or loader
  if (session) return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/pricing" element={<PublicRoute><Pricing /></PublicRoute>} />
      
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Protected Dashboard Routes - Now prefixed with /dashboard or accessible via specific paths */}
      {/* Moving Root Dashboard to /dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/invoices" element={<ProtectedRoute><InvoiceList /></ProtectedRoute>} />
      
      <Route path="/invoices/:id" element={<ProtectedRoute><InvoiceDetails /></ProtectedRoute>} />
      <Route path="/create" element={<ProtectedRoute><InvoiceForm /></ProtectedRoute>} />
      
      <Route path="/clients" element={<ProtectedRoute><ClientList /></ProtectedRoute>} />
      <Route path="/clients/new" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />
      <Route path="/clients/edit/:id" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />
      
      <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
      <Route path="/products/new" element={<ProtectedRoute roles={['admin']}><ProductForm /></ProtectedRoute>} />
      <Route path="/products/edit/:id" element={<ProtectedRoute roles={['admin']}><ProductForm /></ProtectedRoute>} />

      {/* Admin/Accountant Only */}
      <Route path="/reports" element={<ProtectedRoute roles={['admin', 'accountant']}><Reports /></ProtectedRoute>} />
      
      {/* Admin Only */}
      <Route path="/settings" element={<ProtectedRoute roles={['admin']}><Settings /></ProtectedRoute>} />
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" />
        <GlobalLoader />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
