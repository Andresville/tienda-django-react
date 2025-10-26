import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { isAuthenticated, isAdminOrSeller } from './utils/Auth';
import Login from './pages/Login';
import Home from './pages/Home'; 
import CategoryList from './pages/Admin/Category/CategoryList';
import CategoryForm from './pages/Admin/Category/CategoryForm';
import ProductList from './pages/Admin/Product/ProductList';
import ProductForm from './pages/Admin/Product/ProductForm';
import SellerList from './pages/Admin/Seller/SellerList';
import SellerForm from './pages/Admin/Seller/SellerForm';
import ProductView from './pages/ProductView';
import ProductCatalogView from './pages/ProductCatalogView';
import CategoryCardsView from './pages/CategoryCardsView';


const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminSellerRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdminOrSeller()) {
    return <Navigate to="/" replace />;
  }
  return children;
};


const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute><ProductCatalogView /></ProtectedRoute>} />
          
          <Route path="/admin/dashboard" element={<AdminSellerRoute><Home /></AdminSellerRoute>} />
          
          <Route path="/catalog" element={<ProtectedRoute><CategoryCardsView /></ProtectedRoute>} /> 
          <Route path="/category/:categorySlug" element={<ProtectedRoute><ProductCatalogView /></ProtectedRoute>} />
          
          <Route path="/products/:id" element={<ProtectedRoute><ProductView /></ProtectedRoute>} /> 

          <Route path="/admin/products" element={<AdminSellerRoute><ProductList /></AdminSellerRoute>} />
          <Route path="/admin/products/create" element={<AdminSellerRoute><ProductForm /></AdminSellerRoute>} />
          <Route path="/admin/products/edit/:id" element={<AdminSellerRoute><ProductForm /></AdminSellerRoute>} />

          <Route path="/admin/categories" element={<AdminSellerRoute><CategoryList /></AdminSellerRoute>} />
          <Route path="/admin/categories/create" element={<AdminSellerRoute><CategoryForm /></AdminSellerRoute>} />
          <Route path="/admin/categories/edit/:id" element={<AdminSellerRoute><CategoryForm /></AdminSellerRoute>} />

          <Route path="/admin/sellers" element={<AdminSellerRoute><SellerList /></AdminSellerRoute>} />
          <Route path="/admin/sellers/create" element={<AdminSellerRoute><SellerForm /></AdminSellerRoute>} />
          <Route path="/admin/sellers/edit/:id" element={<AdminSellerRoute><SellerForm /></AdminSellerRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;