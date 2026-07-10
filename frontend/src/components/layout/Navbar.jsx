import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../../assets/logo.png';
import navbar_logo from '../../assets/navbar_logo.png';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/#collections' },
  { label: 'About', to: '/#why-glowroot' },
  { label: 'Contact', to: '/#contact' },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartCount] = useState(0);
  const [wishlistCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#4B2F1F] py-2">
        <div className="mx-auto max-w-content px-4">
          <div className="flex items-center justify-center gap-4 text-xs font-medium tracking-wider text-[#F8F2E8] md:gap-8">
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
              </svg>
              Natural Ingredients
            </span>
            <span className="hidden text-[#C59B45] md:inline">|</span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Secure Payments
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : ''
        }`}
        style={{ backgroundColor: '#F8F2E8', borderBottom: scrolled ? 'none' : '1px solid rgba(197,155,69,0.25)' }}
      >
        <nav className="mx-auto max-w-content px-4">
          <div className="flex items-center justify-between py-4">
            {/* Left - Logo */}
            <div className="flex-1">
              <Link to="/" className="inline-block">
                <img
                  src={navbar_logo}
                  alt="GlowRoot"
                  className="h-20 w-auto md:h-12 rounded transition-transform duration-300 hover:scale-105"
                />
              </Link>
            </div>

            {/* Center - Navigation Links */}
            <ul className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <motion.div
                    whileHover="hover"
                    initial="rest"
                    className="relative"
                  >
                    <NavLink
                      to={link.to}
                      className="font-medium transition-colors duration-300 hover:text-[#C59B45]"
                      style={{ color: '#4B2F1F', fontSize: '0.95rem' }}
                    >
                      {link.label}
                    </NavLink>
                    <motion.span
                      className="absolute bottom-0 left-0 h-0.5 bg-[#C59B45]"
                      variants={{
                        rest: { width: 0 },
                        hover: { width: '100%' }
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </li>
              ))}
            </ul>

            {/* Right - Icons */}
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={() => setSearchOpen(true)}
                className="relative p-2 transition-colors duration-300 hover:text-[#C59B45]"
                style={{ color: '#4B2F1F' }}
                aria-label="Search"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>

              {/* Authentication - Login or Profile */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 hover:text-[#C59B45]"
                    style={{ color: '#4B2F1F', backgroundColor: 'rgba(197,155,69,0.1)' }}
                    aria-label="Profile"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-56 rounded-lg border shadow-lg"
                        style={{ backgroundColor: '#F8F2E8', borderColor: 'rgba(197,155,69,0.25)' }}
                      >
                        <ul className="py-2">
                          <li className="border-b px-4 py-3" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
                            <p
                              className="text-sm font-medium"
                              style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}
                            >
                              {user?.fullName || user?.email || 'Welcome'}
                            </p>
                          </li>
                          <li>
                            <Link
                              to="/profile"
                              className="block px-4 py-2.5 text-sm transition-colors hover:bg-[#C59B45]/10"
                              style={{ color: '#4B2F1F', fontFamily: '"Poppins", sans-serif' }}
                              onClick={() => setProfileOpen(false)}
                            >
                              My Profile
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/orders"
                              className="block px-4 py-2.5 text-sm transition-colors hover:bg-[#C59B45]/10"
                              style={{ color: '#4B2F1F', fontFamily: '"Poppins", sans-serif' }}
                              onClick={() => setProfileOpen(false)}
                            >
                              My Orders
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/wishlist"
                              className="block px-4 py-2.5 text-sm transition-colors hover:bg-[#C59B45]/10"
                              style={{ color: '#4B2F1F', fontFamily: '"Poppins", sans-serif' }}
                              onClick={() => setProfileOpen(false)}
                            >
                              Wishlist
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/addresses"
                              className="block px-4 py-2.5 text-sm transition-colors hover:bg-[#C59B45]/10"
                              style={{ color: '#4B2F1F', fontFamily: '"Poppins", sans-serif' }}
                              onClick={() => setProfileOpen(false)}
                            >
                              Saved Addresses
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/settings"
                              className="block px-4 py-2.5 text-sm transition-colors hover:bg-[#C59B45]/10"
                              style={{ color: '#4B2F1F', fontFamily: '"Poppins", sans-serif' }}
                              onClick={() => setProfileOpen(false)}
                            >
                              Settings
                            </Link>
                          </li>
                          <li className="border-t" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
                            <button
                              className="block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#C59B45]/10"
                              style={{ color: '#4B2F1F', fontFamily: '"Poppins", sans-serif' }}
                              onClick={() => {
                                logout();
                                setProfileOpen(false);
                              }}
                            >
                              Logout
                            </button>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="rounded-full px-6 py-2 text-sm font-medium tracking-wider uppercase transition-colors hover:opacity-90"
                  style={{
                    fontFamily: '"Poppins", sans-serif',
                    backgroundColor: '#6E4B2A',
                    color: '#F8F2E8'
                  }}
                >
                  Login
                </Link>
              )}

              <button
                className="relative p-2 transition-colors duration-300 hover:text-[#C59B45]"
                style={{ color: '#4B2F1F' }}
                aria-label="Wishlist"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                </svg>
                {wishlistCount > 0 && (
                  <span
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium"
                    style={{ backgroundColor: '#C59B45', color: '#F8F2E8' }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </button>

              <Link
                to="/cart"
                className="relative p-2 transition-colors duration-300 hover:text-[#C59B45]"
                style={{ color: '#4B2F1F' }}
                aria-label="Cart"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 8h12l-1 13H7L6 8Z" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                </svg>
                {cartCount > 0 && (
                  <span
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium"
                    style={{ backgroundColor: '#C59B45', color: '#F8F2E8' }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="p-2 md:hidden"
                style={{ color: '#4B2F1F' }}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 z-50 h-full w-80 overflow-y-auto"
              style={{ backgroundColor: '#F8F2E8' }}
            >
              <div className="flex items-center justify-between border-b p-4" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  <img src={logo} alt="GlowRoot" className="h-8 w-auto" />
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  style={{ color: '#4B2F1F' }}
                  aria-label="Close menu"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <ul className="p-4">
                {NAV_LINKS.map((link) => (
                  <li key={link.label} className="border-b" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
                    <NavLink
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className="block py-4 font-medium transition-colors hover:text-[#C59B45]"
                      style={{ color: '#4B2F1F' }}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-center gap-6 border-t p-4" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
                <button
                  onClick={() => {
                    setSearchOpen(true);
                    setMenuOpen(false);
                  }}
                  className="p-2 transition-colors hover:text-[#C59B45]"
                  style={{ color: '#4B2F1F' }}
                  aria-label="Search"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </button>
                <button
                  className="relative p-2 transition-colors hover:text-[#C59B45]"
                  style={{ color: '#4B2F1F' }}
                  aria-label="Wishlist"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium"
                      style={{ backgroundColor: '#C59B45', color: '#F8F2E8' }}
                    >
                      {wishlistCount}
                    </span>
                  )}
                </button>
                <Link
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="relative p-2 transition-colors hover:text-[#C59B45]"
                  style={{ color: '#4B2F1F' }}
                  aria-label="Cart"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 8h12l-1 13H7L6 8Z" />
                    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                  </svg>
                  {cartCount > 0 && (
                    <span
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium"
                      style={{ backgroundColor: '#C59B45', color: '#F8F2E8' }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="p-2 transition-colors hover:text-[#C59B45]"
                    style={{ color: '#4B2F1F' }}
                    aria-label="Logout"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full px-4 py-2 text-xs font-medium tracking-wider uppercase transition-colors hover:opacity-90"
                    style={{
                      fontFamily: '"Poppins", sans-serif',
                      backgroundColor: '#6E4B2A',
                      color: '#F8F2E8'
                    }}
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 right-0 top-0 z-50 p-4"
            >
              <div
                className="mx-auto max-w-2xl rounded-lg p-4 shadow-lg"
                style={{ backgroundColor: '#F8F2E8' }}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="flex-1 bg-transparent py-2 text-lg outline-none placeholder:text-gray-400"
                    style={{ color: '#4B2F1F' }}
                    autoFocus
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="p-2 transition-colors hover:text-[#C59B45]"
                    style={{ color: '#4B2F1F' }}
                    aria-label="Close search"
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 6l12 12M18 6 6 18" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
