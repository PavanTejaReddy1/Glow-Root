import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ProductCard from '../components/product/ProductCard.jsx';
import { productService } from '../services/productService.js';
import { categoryService } from '../services/categoryService.js';

const sortOptions = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price',      label: 'Price: Low → High' },
  { value: '-price',     label: 'Price: High → Low' },
  { value: '-rating',    label: 'Top Rated' },
  { value: '-soldCount', label: 'Best Sellers' },
];

export default function Shop() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products,  setProducts]  = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState('-createdAt');
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    document.title = 'Shop All Rituals — GlowRoot';
    categoryService.getCategories()
      .then(r => setCategories(r.data?.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category, searchParams, sort]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { sort, status: 'active' };
      if (category) params.category = category;
      const search = searchParams.get('search');
      if (search) params.search = search;
      const response = await productService.getProducts(params);
      setProducts(response.data?.products || []);
      setActiveCategory(category || 'All');
    } catch {
      console.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const searchQuery = searchParams.get('search');
  const activeSortLabel = sortOptions.find(o => o.value === sort)?.label || 'Sort';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F2E8' }}>
      {/* ── Page Header ─────────────────────────── */}
      <div
        className="relative overflow-hidden py-14 md:py-20"
        style={{ backgroundColor: '#4B2F1F' }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(rgba(197,155,69,0.6) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="relative mx-auto max-w-content px-4 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest"
            style={{ backgroundColor: 'rgba(197,155,69,0.15)', color: '#C59B45', border: '1px solid rgba(197,155,69,0.3)' }}
          >
            Shop All
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-3 text-3xl font-medium md:text-5xl"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#F8F2E8' }}
          >
            {searchQuery ? `Results for "${searchQuery}"` : 'Every ritual, in one place'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-[14px]"
            style={{ fontFamily: '"Poppins", sans-serif', color: 'rgba(248,242,232,0.6)' }}
          >
            {loading ? '…' : `${products.length} formulation${products.length !== 1 ? 's' : ''}, small-batch and cold-processed`}
          </motion.p>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-10 lg:px-8">
        {/* ── Filters & Sort row ──────────────────── */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/shop')}
              className="rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-widest transition-all duration-250"
              style={{
                fontFamily: '"Poppins", sans-serif',
                backgroundColor: activeCategory === 'All' ? '#4B2F1F' : 'transparent',
                color: activeCategory === 'All' ? '#F8F2E8' : '#6E4B2A',
                border: activeCategory === 'All' ? '1.5px solid #4B2F1F' : '1.5px solid rgba(110,75,42,0.35)',
                boxShadow: activeCategory === 'All' ? '0 4px 14px rgba(75,47,31,0.25)' : 'none',
              }}
            >
              All
            </motion.button>

            {categories.map(cat => (
              <motion.button
                key={cat._id}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/shop/${cat.slug}`)}
                className="rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-widest transition-all duration-250"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  backgroundColor: activeCategory === cat.slug ? '#4B2F1F' : 'transparent',
                  color: activeCategory === cat.slug ? '#F8F2E8' : '#6E4B2A',
                  border: activeCategory === cat.slug ? '1.5px solid #4B2F1F' : '1.5px solid rgba(110,75,42,0.35)',
                  boxShadow: activeCategory === cat.slug ? '0 4px 14px rgba(75,47,31,0.25)' : 'none',
                }}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSort(s => !s)}
              className="flex items-center gap-2 rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-widest transition-all"
              style={{
                fontFamily: '"Poppins", sans-serif',
                color: '#6E4B2A',
                border: '1.5px solid rgba(110,75,42,0.35)',
                backgroundColor: showSort ? 'rgba(197,155,69,0.08)' : 'transparent',
              }}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M7 12h10M11 18h2" />
              </svg>
              {activeSortLabel}
              <svg
                className={`h-3 w-3 transition-transform ${showSort ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <AnimatePresence>
              {showSort && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-2xl shadow-xl"
                    style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
                  >
                    {sortOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSort(opt.value); setShowSort(false); }}
                        className="flex w-full items-center gap-3 px-5 py-3 text-[12px] transition-colors hover:bg-amber-50"
                        style={{
                          fontFamily: '"Poppins", sans-serif',
                          color: sort === opt.value ? '#C59B45' : '#4B2F1F',
                          fontWeight: sort === opt.value ? 600 : 400,
                        }}
                      >
                        {sort === opt.value && (
                          <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                        <span className={sort === opt.value ? '' : 'ml-6'}>{opt.label}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Product Grid ────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse rounded-3xl"
                style={{ backgroundColor: 'rgba(197,155,69,0.07)', animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-28 text-center"
          >
            <div
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(197,155,69,0.1)' }}
            >
              <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="#C59B45" strokeWidth="1.4">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h3
              className="mb-2 text-2xl font-medium"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
            >
              No formulations found
            </h3>
            <p className="mb-6 text-[14px]" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
              Try a different category or search term.
            </p>
            <Link
              to="/shop"
              className="rounded-full px-8 py-3 text-[12px] font-semibold uppercase tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: '#4B2F1F', color: '#F8F2E8', fontFamily: '"Poppins", sans-serif' }}
            >
              View All Rituals
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
