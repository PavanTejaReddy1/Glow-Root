import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import AdminProtectedRoute from './components/common/AdminProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Orders from './pages/Orders.jsx';
import Profile from './pages/Profile.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import NotFound from './pages/NotFound.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import AdminLayout from './admin/components/layout/AdminLayout.jsx';
import AdminLogin from './admin/pages/AdminLogin.jsx';
import Dashboard from './admin/pages/Dashboard.jsx';
import Products from './admin/pages/Products.jsx';
import AddProduct from './admin/pages/AddProduct.jsx';
import EditProduct from './admin/pages/EditProduct.jsx';
import UpdateStock from './admin/pages/UpdateStock.jsx';
import AdminOrders from './admin/pages/Orders.jsx';
import Customers from './admin/pages/Customers.jsx';
import Inventory from './admin/pages/Inventory.jsx';
import Reviews from './admin/pages/Reviews.jsx';
import Coupons from './admin/pages/Coupons.jsx';
import CreateCoupon from './admin/pages/CreateCoupon.jsx';
import Analytics from './admin/pages/Analytics.jsx';
import Settings from './admin/pages/Settings.jsx';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      {!isAuthPage && !isAdminPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminLayout title="Dashboard" subtitle="Overview of your store"><Dashboard /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/products" element={<AdminProtectedRoute><AdminLayout title="Products" subtitle="Manage your products"><Products /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/products/add" element={<AdminProtectedRoute><AdminLayout title="Add Product" subtitle="Create a new product"><AddProduct /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/products/edit/:id" element={<AdminProtectedRoute><AdminLayout title="Edit Product" subtitle="Update product information"><EditProduct /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/orders" element={<AdminProtectedRoute><AdminLayout title="Orders" subtitle="Manage customer orders"><AdminOrders /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/customers" element={<AdminProtectedRoute><AdminLayout title="Customers" subtitle="Manage your customers"><Customers /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/inventory" element={<AdminProtectedRoute><AdminLayout title="Inventory" subtitle="Manage stock levels"><Inventory /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/inventory/update/:id" element={<AdminProtectedRoute><AdminLayout title="Update Stock" subtitle="Update product inventory"><UpdateStock /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/reviews" element={<AdminProtectedRoute><AdminLayout title="Reviews" subtitle="Manage customer reviews"><Reviews /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/coupons" element={<AdminProtectedRoute><AdminLayout title="Coupons" subtitle="Manage discount coupons"><Coupons /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/coupons/create" element={<AdminProtectedRoute><AdminLayout title="Create Coupon" subtitle="Add a new discount coupon"><CreateCoupon /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/analytics" element={<AdminProtectedRoute><AdminLayout title="Analytics" subtitle="View your store analytics"><Analytics /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/settings" element={<AdminProtectedRoute><AdminLayout title="Settings" subtitle="Configure your store"><Settings /></AdminLayout></AdminProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAuthPage && !isAdminPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <SettingsProvider>
          <WishlistProvider>
            <CartProvider>
              <AdminAuthProvider>
                <Routes>
                  <Route path="/*" element={<AppContent />} />
                </Routes>
              </AdminAuthProvider>
            </CartProvider>
          </WishlistProvider>
        </SettingsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
