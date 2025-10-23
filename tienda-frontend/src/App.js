import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { isAuthenticated, isAdminOrSeller } from './utils/Auth';

// Páginas
import Login from './pages/Login';
import Home from './pages/Home';
import CategoryList from './pages/Admin/Category/CategoryList';
import CategoryForm from './pages/Admin/Category/CategoryForm';
import ProductList from './pages/Admin/Product/ProductList';
import ProductForm from './pages/Admin/Product/ProductForm';
import SellerList from './pages/Admin/Seller/SellerList';
import SellerForm from './pages/Admin/Seller/SellerForm';
import ProductView from './pages/ProductView';
// import UserList from './pages/Admin/User/UserList'; // (Opcional: puedes crear esta vista)

// Componente para proteger las rutas
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  // Puedes agregar lógica de roles aquí si es necesario, por ahora asumimos que solo requiere login
  return children;
};

// Componente para proteger las rutas de ADMIN/SELLER
const AdminSellerRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdminOrSeller()) {
    return <Navigate to="/" replace />; // Redirigir a Home si no tiene el rol
  }
  return children;
};


const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          
          {/* RUTA PARA USUARIOS ESTÁNDAR (Solo Ver) */}
          <Route path="/products" element={<ProtectedRoute><ProductView /></ProtectedRoute>} /> 

          {/* Rutas Protegidas */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          
          {/* RUTAS DE GESTIÓN (ADMIN/SELLER) - ESTE BLOQUE FALTABA EN LA VERIFICACIÓN */}
          <Route path="/admin/products" element={<AdminSellerRoute><ProductList /></AdminSellerRoute>} />
          <Route path="/admin/products/create" element={<AdminSellerRoute><ProductForm /></AdminSellerRoute>} />
          <Route path="/admin/products/edit/:id" element={<AdminSellerRoute><ProductForm /></AdminSellerRoute>} />

          <Route path="/admin/categories" element={<AdminSellerRoute><CategoryList /></AdminSellerRoute>} />
          <Route path="/admin/categories/create" element={<AdminSellerRoute><CategoryForm /></AdminSellerRoute>} />
          <Route path="/admin/categories/edit/:id" element={<AdminSellerRoute><CategoryForm /></AdminSellerRoute>} />

          <Route path="/admin/sellers" element={<AdminSellerRoute><SellerList /></AdminSellerRoute>} />
          <Route path="/admin/sellers/create" element={<AdminSellerRoute><SellerForm /></AdminSellerRoute>} />
          <Route path="/admin/sellers/edit/:id" element={<AdminSellerRoute><SellerForm /></AdminSellerRoute>} />
          
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;