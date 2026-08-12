import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import navbar_logo from '../../assets/navbar_logo.png';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { productService } from '../../services/productService.js';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
];

/* ── Instant Search Bar ──────────────────────────────────────────── */
function SearchBar() {
  const navigate = useNavigate();
  const inputRef  = useRef(null);
  const wrapperRef = useRef(null);

  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);
  const debounceRef = useRef(null);

  /* close dropdown on outside click */
  useEffect(() => {
    const fn = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  /* debounced search — fires 280ms after user stops typing */
  const search = useCallback((q) => {
    clearTimeout(debounceRef.current);
    if (!q.trim()) { setResults([]); setOpen(false); setLoading(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await productService.getProducts({
          search: q.trim(),
          status: 'active',
          limit: 6,
        });
        const products = res.data?.products || res.products || [];
        setResults(products);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);
  }, []);

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    search(v);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    setQuery('');
  };

  const handleSelect = (slug) => {
    setOpen(false);
    setQuery('');
    navigate(`/product/${slug}`);
  };

  const clear = () => { setQuery(''); setResults([]); setOpen(false); };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="flex w-full items-center">
        {/* Input field */}
        <div
          className="flex w-full items-center gap-2 rounded-full px-4 py-2 transition-all duration-200"
          style={{
            backgroundColor: 'rgba(58,31,13,0.06)',
            border: open || query ? '1.5px solid rgba(197,155,69,0.5)' : '1.5px solid transparent',
            boxShadow: open || query ? '0 0 0 3px rgba(197,155,69,0.08)' : 'none',
          }}
        >
          {/* Search icon */}
          {loading ? (
            <div className="h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-t-amber-500 border-gray-300" />
          ) : (
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none"
              stroke="rgba(58,31,13,0.5)" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => { if (results.length > 0) setOpen(true); }}
            placeholder="Search products…"
            className="flex-1 bg-transparent text-[13px] outline-none"
            style={{ color: '#3A1F0D', fontFamily: '"Poppins",sans-serif' }}
            autoComplete="off"
          />

          {/* Clear */}
          {query && (
            <button type="button" onClick={clear}
              className="flex-shrink-0 rounded-full p-0.5 transition-colors hover:bg-black/10">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"
                stroke="rgba(58,31,13,0.5)" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* ── Results dropdown ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl shadow-2xl"
            style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.22)' }}
          >
            {results.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-[13px]" style={{ fontFamily: '"Poppins",sans-serif', color: '#9CA3AF' }}>
                  No products found for "<strong style={{ color: '#3A1F0D' }}>{query}</strong>"
                </p>
              </div>
            ) : (
              <>
                <div className="px-4 pt-3 pb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ fontFamily: '"Poppins",sans-serif', color: '#C59B45' }}>
                    {results.length} result{results.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="pb-2">
                  {results.map(product => {
                    const imgSrc = product.images?.find(i => i.isPrimary)?.url || product.images?.[0]?.url;
                    const sellingPrice = Number(product.price) || 0;
                    const discountPct  = Number(product.discount) || 0;
                    const originalPrice = discountPct > 0
                      ? Math.round(sellingPrice / (1 - discountPct / 100)) : 0;

                    return (
                      <button
                        key={product._id}
                        onClick={() => handleSelect(product.slug)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-amber-50"
                      >
                        {/* Thumbnail */}
                        <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl"
                          style={{ backgroundColor: 'rgba(197,155,69,0.08)' }}>
                          {imgSrc ? (
                            <img src={imgSrc} alt={product.name}
                              className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <svg className="h-5 w-5 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 4h16v2H4zm0 4h16v12H4z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-[13px] font-medium"
                            style={{ fontFamily: '"Cormorant Garamond",serif', color: '#3A1F0D', fontSize: '0.9rem' }}>
                            {product.name}
                          </p>
                          <p className="text-[10.5px] uppercase tracking-wider"
                            style={{ fontFamily: '"Poppins",sans-serif', color: '#C59B45' }}>
                            {product.category?.name || 'Product'}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="flex-shrink-0 text-right">
                          <p className="text-[14px] font-semibold"
                            style={{ fontFamily: '"Cormorant Garamond",serif', color: '#3A1F0D' }}>
                            ₹{sellingPrice.toLocaleString('en-IN')}
                          </p>
                          {discountPct > 0 && (
                            <p className="text-[10px] line-through"
                              style={{ fontFamily: '"Poppins",sans-serif', color: '#9CA3AF' }}>
                              ₹{originalPrice.toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>

                        {/* Arrow */}
                        <svg className="h-4 w-4 flex-shrink-0 text-gray-300" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    );
                  })}
                </div>

                {/* View all results footer */}
                <div className="border-t px-4 py-3" style={{ borderColor: 'rgba(197,155,69,0.15)' }}>
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
                      setQuery('');
                    }}
                    className="flex w-full items-center justify-between text-[12px] font-semibold transition-colors hover:text-amber-700"
                    style={{ fontFamily: '"Poppins",sans-serif', color: '#3A1F0D' }}
                  >
                    <span>See all results for "<strong>{query}</strong>"</span>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main Navbar ─────────────────────────────────────────────────── */
export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { wishlist }  = useWishlist();
  const { cartCount } = useCart();
  const { settings }  = useSettings();

  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  /* mobile search */
  const [mobileSearchOpen,  setMobileSearchOpen]  = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [mobileResults,     setMobileResults]     = useState([]);
  const [mobileLoading,     setMobileLoading]     = useState(false);
  const mobileDebounce = useRef(null);
  const mobileInputRef = useRef(null);

  const wishlistCount = wishlist?.length ?? 0;

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (!e.target.closest('[data-profile-menu]')) setProfileOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  /* mobile search debounce */
  const handleMobileSearch = (e) => {
    const v = e.target.value;
    setMobileSearchQuery(v);
    clearTimeout(mobileDebounce.current);
    if (!v.trim()) { setMobileResults([]); return; }
    setMobileLoading(true);
    mobileDebounce.current = setTimeout(async () => {
      try {
        const res = await productService.getProducts({ search: v.trim(), status: 'active', limit: 5 });
        setMobileResults(res.data?.products || res.products || []);
      } catch { setMobileResults([]); }
      finally { setMobileLoading(false); }
    }, 280);
  };

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if (!mobileSearchQuery.trim()) return;
    setMobileSearchOpen(false);
    setMobileSearchQuery('');
    setMobileResults([]);
    navigate(`/shop?search=${encodeURIComponent(mobileSearchQuery.trim())}`);
  };

  const Badge = ({ n }) => n > 0 ? (
    <span
      className="absolute -right-1 -top-1 flex h-[17px] w-[17px] items-center justify-center rounded-full text-[9px] font-bold leading-none"
      style={{ backgroundColor: '#C59B45', color: '#fff' }}
    >
      {n > 99 ? '99' : n}
    </span>
  ) : null;

  return (
    <>
      {/* ── Announcement bar ── */}
      {settings?.announcementEnabled !== false && (
        <div
          className="py-2.5 text-center text-[11px] font-medium tracking-wider"
          style={{ backgroundColor: '#3A1F0D', color: 'rgba(248,242,232,0.7)', fontFamily: '"Poppins",sans-serif' }}
        >
          <span style={{ color: '#C59B45' }}>✦</span>
          &nbsp;
          {(settings?.announcementText || 'Free shipping on orders above ₹{freeShippingAbove}')
            .replace('{freeShippingAbove}', settings?.freeShippingAbove?.toLocaleString('en-IN') || '1,999')}
          &nbsp;
          <span style={{ color: '#C59B45' }}>✦</span>
        </div>
      )}

      {/* ── Main header ── */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: '#F8F2E8',
          borderBottom: scrolled ? 'none' : '1px solid rgba(197,155,69,0.16)',
          boxShadow: scrolled ? '0 2px 20px rgba(58,31,13,0.09)' : 'none',
          transition: 'box-shadow 0.25s ease',
        }}
      >
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-4 px-5 lg:px-10">

          {/* ── Left zone: Logo + Nav ── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 mr-2">
              <img src={navbar_logo} alt="GlowRoot" className="h-10 w-auto md:h-[46px]" />
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <NavLink key={link.label} to={link.to} end={link.to === '/'}>
                  {({ isActive }) => (
                    <span
                      className="relative px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.15em] transition-colors duration-200"
                      style={{ fontFamily: '"Poppins",sans-serif', color: isActive ? '#C59B45' : '#3A1F0D' }}
                    >
                      {link.label}
                      <span
                        className="absolute bottom-0 left-4 right-4 h-[1.5px] rounded-full transition-transform duration-250 origin-left"
                        style={{ backgroundColor: '#C59B45', transform: isActive ? 'scaleX(1)' : 'scaleX(0)' }}
                      />
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* ── Centre zone: Search bar (grows to fill middle) ── */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <div className="w-full max-w-sm">
              <SearchBar />
            </div>
          </div>

          {/* ── Right zone: Icons ── */}
          <div className="flex items-center gap-0.5 flex-shrink-0">

            {/* Mobile search toggle */}
            <button
              className="icon-btn md:hidden"
              style={{ color: '#3A1F0D' }}
              aria-label="Search"
              onClick={() => { setMobileSearchOpen(o => !o); setTimeout(() => mobileInputRef.current?.focus(), 80); }}
            >
              <svg className="h-[19px] w-[19px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
              </svg>
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative" data-profile-menu>
                <button className="icon-btn" style={{ color: '#3A1F0D' }}
                  aria-label="My Account" onClick={() => setProfileOpen(p => !p)}>
                  <svg className="h-[19px] w-[19px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0,  scale: 1    }}
                      exit=  {{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl shadow-2xl"
                      style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.2)' }}
                    >
                      <div className="px-5 py-4"
                        style={{ background: 'linear-gradient(135deg,rgba(197,155,69,0.12) 0%,transparent 100%)', borderBottom: '1px solid rgba(197,155,69,0.16)' }}>
                        <p className="text-[11px] uppercase tracking-widest" style={{ fontFamily: '"Poppins",sans-serif', color: '#C59B45' }}>
                          Welcome back
                        </p>
                        <p className="mt-0.5 text-[15px] font-semibold" style={{ fontFamily: '"Cormorant Garamond",serif', color: '#3A1F0D' }}>
                          {user?.firstName ? `${user.firstName}${user.lastName ? ' ' + user.lastName[0] + '.' : ''}` : user?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        {[
                          { to: '/profile?tab=profile', label: 'My Profile',  icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z' },
                          { to: '/orders',              label: 'My Orders',   icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 12h6M9 16h4' },
                          { to: '/wishlist',            label: 'Wishlist',    icon: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z' },
                          { to: '/profile?tab=addresses', label: 'Addresses', icon: 'M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z' },
                        ].map(item => (
                          <Link key={item.to} to={item.to}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-[12.5px] transition-colors hover:bg-amber-50"
                            style={{ fontFamily: '"Poppins",sans-serif', color: '#3A1F0D' }}>
                            <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <path d={item.icon} />
                            </svg>
                            {item.label}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t py-1" style={{ borderColor: 'rgba(197,155,69,0.16)' }}>
                        <button
                          onClick={() => { logout(); setProfileOpen(false); }}
                          className="flex w-full items-center gap-3 px-5 py-2.5 text-[12.5px] transition-colors hover:bg-red-50"
                          style={{ fontFamily: '"Poppins",sans-serif', color: '#EF4444' }}>
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login"
                className="hidden rounded-full px-5 py-2.5 text-[11.5px] font-semibold uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md md:inline-flex items-center gap-1.5"
                style={{ border: '1.5px solid rgba(58,31,13,0.3)', color: '#3A1F0D', fontFamily: '"Poppins",sans-serif' }}>
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                Login
              </Link>
            )}

            {/* Wishlist */}
            <Link to="/wishlist" className="icon-btn relative" style={{ color: '#3A1F0D' }} aria-label="Wishlist">
              <svg className="h-[19px] w-[19px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
              </svg>
              <Badge n={wishlistCount} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="icon-btn relative" style={{ color: '#3A1F0D' }} aria-label="Cart">
              <svg className="h-[19px] w-[19px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M6 8h12l-1 13H7L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              <Badge n={cartCount} />
            </Link>

            {/* Mobile hamburger */}
            <button className="icon-btn md:hidden" style={{ color: '#3A1F0D' }}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen(m => !m)}>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                {menuOpen
                  ? <path d="M6 6l12 12M18 6 6 18" />
                  : <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h10" /></>}
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile search bar (slides down below header) ── */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden border-t md:hidden"
              style={{ borderColor: 'rgba(197,155,69,0.16)', backgroundColor: '#F8F2E8' }}
            >
              <div className="px-4 py-3">
                <form onSubmit={handleMobileSubmit}
                  className="flex items-center gap-2 rounded-full px-4 py-2.5"
                  style={{ backgroundColor: 'rgba(58,31,13,0.06)', border: '1.5px solid rgba(197,155,69,0.35)' }}>
                  {mobileLoading ? (
                    <div className="h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-t-amber-500 border-gray-300" />
                  ) : (
                    <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(58,31,13,0.45)" strokeWidth="2">
                      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
                    </svg>
                  )}
                  <input
                    ref={mobileInputRef}
                    type="text"
                    value={mobileSearchQuery}
                    onChange={handleMobileSearch}
                    placeholder="Search products…"
                    className="flex-1 bg-transparent text-[13px] outline-none"
                    style={{ color: '#3A1F0D', fontFamily: '"Poppins",sans-serif' }}
                    autoComplete="off"
                  />
                  {mobileSearchQuery && (
                    <button type="button"
                      onClick={() => { setMobileSearchQuery(''); setMobileResults([]); }}>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"
                        stroke="rgba(58,31,13,0.4)" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </form>

                {/* Mobile results */}
                {mobileResults.length > 0 && (
                  <div className="mt-2 overflow-hidden rounded-2xl"
                    style={{ border: '1px solid rgba(197,155,69,0.18)', backgroundColor: '#F8F2E8' }}>
                    {mobileResults.map(product => {
                      const imgSrc = product.images?.find(i => i.isPrimary)?.url || product.images?.[0]?.url;
                      return (
                        <button key={product._id}
                          onClick={() => {
                            setMobileSearchOpen(false);
                            setMobileSearchQuery('');
                            setMobileResults([]);
                            navigate(`/product/${product.slug}`);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-amber-50 border-b last:border-0"
                          style={{ borderColor: 'rgba(197,155,69,0.12)' }}>
                          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg"
                            style={{ backgroundColor: 'rgba(197,155,69,0.08)' }}>
                            {imgSrc && <img src={imgSrc} alt={product.name} className="h-full w-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-[13px] font-medium"
                              style={{ fontFamily: '"Cormorant Garamond",serif', color: '#3A1F0D' }}>
                              {product.name}
                            </p>
                            <p className="text-[11px]" style={{ fontFamily: '"Poppins",sans-serif', color: '#C59B45' }}>
                              ₹{Number(product.price).toLocaleString('en-IN')}
                            </p>
                          </div>
                          <svg className="h-4 w-4 flex-shrink-0 text-gray-300" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      );
                    })}
                    <button
                      onClick={handleMobileSubmit}
                      className="flex w-full items-center justify-between px-4 py-3 text-[12px] font-semibold"
                      style={{ fontFamily: '"Poppins",sans-serif', color: '#3A1F0D', borderTop: '1px solid rgba(197,155,69,0.12)' }}>
                      See all results
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}

                {mobileSearchQuery && !mobileLoading && mobileResults.length === 0 && (
                  <p className="mt-3 text-center text-[12px]"
                    style={{ fontFamily: '"Poppins",sans-serif', color: '#9CA3AF' }}>
                    No results for "<strong style={{ color: '#3A1F0D' }}>{mobileSearchQuery}</strong>"
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setMenuOpen(false)} />
            <motion.div key="drawer"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.22,1,0.36,1] }}
              className="fixed left-0 top-0 z-50 flex h-full w-[300px] flex-col overflow-y-auto"
              style={{ backgroundColor: '#F8F2E8' }}>
              <div className="flex items-center justify-between border-b px-5 py-4"
                style={{ borderColor: 'rgba(197,155,69,0.16)' }}>
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  <img src={logo} alt="GlowRoot" className="h-9 w-auto" />
                </Link>
                <button onClick={() => setMenuOpen(false)} className="icon-btn" style={{ color: '#3A1F0D' }}>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 px-5 py-6 space-y-1">
                {NAV_LINKS.map(link => (
                  <NavLink key={link.label} to={link.to} end={link.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold uppercase tracking-widest transition-colors"
                    style={({ isActive }) => ({
                      fontFamily: '"Poppins",sans-serif',
                      color: isActive ? '#C59B45' : '#3A1F0D',
                      backgroundColor: isActive ? 'rgba(197,155,69,0.1)' : 'transparent',
                    })}>
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <div className="border-t px-5 py-5 space-y-2" style={{ borderColor: 'rgba(197,155,69,0.16)' }}>
                {isAuthenticated ? (
                  <>
                    <div className="mb-3 rounded-xl px-4 py-3" style={{ backgroundColor: 'rgba(197,155,69,0.08)' }}>
                      <p className="text-[11px] uppercase tracking-widest" style={{ color: '#C59B45', fontFamily: '"Poppins",sans-serif' }}>
                        Signed in as
                      </p>
                      <p className="mt-0.5 text-[14px] font-semibold" style={{ fontFamily: '"Cormorant Garamond",serif', color: '#3A1F0D' }}>
                        {user?.firstName || user?.email}
                      </p>
                    </div>
                    {[
                      { to: '/profile', label: 'My Profile' },
                      { to: '/orders',  label: 'My Orders'  },
                      { to: '/wishlist',label: 'Wishlist'   },
                    ].map(item => (
                      <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}
                        className="flex rounded-xl px-4 py-3 text-[12.5px] font-medium transition-colors hover:bg-amber-50"
                        style={{ fontFamily: '"Poppins",sans-serif', color: '#3A1F0D' }}>
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="mt-1 flex w-full rounded-xl px-4 py-3 text-left text-[12.5px] font-medium transition-colors hover:bg-red-50"
                      style={{ fontFamily: '"Poppins",sans-serif', color: '#EF4444' }}>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-full py-3.5 text-[12px] font-bold uppercase tracking-widest transition-all hover:opacity-90"
                    style={{ backgroundColor: '#3A1F0D', color: '#F8F2E8', fontFamily: '"Poppins",sans-serif' }}>
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
