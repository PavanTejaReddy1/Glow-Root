import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import NotFound from './pages/NotFound.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import AdminLayout from './admin/components/layout/AdminLayout.jsx';
import AdminLogin from './admin/pages/AdminLogin.jsx';
import Dashboard from './admin/pages/Dashboard.jsx';
import Products from './admin/pages/Products.jsx';
import AddProduct from './admin/pages/AddProduct.jsx';
import Orders from './admin/pages/Orders.jsx';
import Customers from './admin/pages/Customers.jsx';
import Inventory from './admin/pages/Inventory.jsx';
import Reviews from './admin/pages/Reviews.jsx';
import Coupons from './admin/pages/Coupons.jsx';
import Analytics from './admin/pages/Analytics.jsx';
import Settings from './admin/pages/Settings.jsx';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
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
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminLayout title="Dashboard" subtitle="Overview of your store"><Dashboard /></AdminLayout>} />
          <Route path="/admin/products" element={<AdminLayout title="Products" subtitle="Manage your products"><Products /></AdminLayout>} />
          <Route path="/admin/products/add" element={<AdminLayout title="Add Product" subtitle="Create a new product"><AddProduct /></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout title="Orders" subtitle="Manage customer orders"><Orders /></AdminLayout>} />
          <Route path="/admin/customers" element={<AdminLayout title="Customers" subtitle="Manage your customers"><Customers /></AdminLayout>} />
          <Route path="/admin/inventory" element={<AdminLayout title="Inventory" subtitle="Manage stock levels"><Inventory /></AdminLayout>} />
          <Route path="/admin/reviews" element={<AdminLayout title="Reviews" subtitle="Manage customer reviews"><Reviews /></AdminLayout>} />
          <Route path="/admin/coupons" element={<AdminLayout title="Coupons" subtitle="Manage discount coupons"><Coupons /></AdminLayout>} />
          <Route path="/admin/analytics" element={<AdminLayout title="Analytics" subtitle="View your store analytics"><Analytics /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout title="Settings" subtitle="Configure your store"><Settings /></AdminLayout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAuthPage && !isAdminPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </AuthProvider>
  );
}
