import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './styles/global.css';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/layout/CartDrawer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import ProductForm from './pages/admin/ProductForm';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex-center" style={{ height: '80vh' }}><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="flex-center" style={{ height: '80vh' }}><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return children;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main style={{ minHeight: 'calc(100vh - 64px)' }}>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" toastOptions={{
            style: { fontFamily: 'Nunito, sans-serif', fontSize: '0.88rem', borderRadius: '12px' },
            success: { iconTheme: { primary: '#e84393', secondary: '#fff' } },
          }} />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/products" element={<Layout><Products /></Layout>} />
            <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected */}
            <Route path="/cart" element={<PrivateRoute><Layout><Cart /></Layout></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><Layout><Checkout /></Layout></PrivateRoute>} />
            <Route path="/order-success/:id" element={<PrivateRoute><Layout><OrderSuccess /></Layout></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><Layout><Orders /></Layout></PrivateRoute>} />
            <Route path="/orders/:id" element={<PrivateRoute><Layout><OrderDetail /></Layout></PrivateRoute>} />
            <Route path="/wishlist" element={<PrivateRoute><Layout><Wishlist /></Layout></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/products/new" element={<AdminRoute><ProductForm /></AdminRoute>} />
            <Route path="/admin/products/:id/edit" element={<AdminRoute><ProductForm /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
