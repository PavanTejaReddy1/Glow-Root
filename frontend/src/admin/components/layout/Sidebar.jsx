import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  MessageSquare,
  Ticket,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';
import { useState } from 'react';
import navbar_logo from '../../../assets/navbar_logo.png';
import { useAdminAuth } from '../../../context/AdminAuthContext.jsx';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: Users, label: 'Customers', path: '/admin/customers' },
  { icon: Warehouse, label: 'Inventory', path: '/admin/inventory' },
  { icon: Ticket, label: 'Coupons', path: '/admin/coupons' },
  { icon: MessageSquare, label: 'Reviews', path: '/admin/reviews' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? '80px' : '280px'
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed left-0 top-0 z-50 h-screen lg:static lg:z-40 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-none lg:translate-x-0'
        }`}
        style={{ backgroundColor: '#F8F2E8' }}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b p-4" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <img
                  src={navbar_logo}
                  alt="GlowRoot"
                  className="h-12 w-auto"
                />
              </motion.div>
            )}
            <button
              onClick={() => (mobileOpen ? setMobileOpen(false) : setCollapsed(!collapsed))}
              className="rounded-full p-2 transition-colors hover:bg-amber-100"
              style={{ color: '#6E4B2A' }}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : collapsed ? (
                <Menu className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-full px-4 py-3 transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                          : 'text-slate-700 hover:bg-amber-100'
                      }`}
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="font-medium"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="border-t p-4" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-full px-4 py-3 text-slate-700 transition-all hover:bg-amber-100 w-full"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="font-medium"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
