import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function ProductCard({ product, index = 0 }) {
  const [adding, setAdding] = useState(false);
  const { addToast } = useToast();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const {
    _id, slug, name, category,
    price = 0, discount = 0,
    images, rating, stock, status,
  } = product;

  /* Price computation — model: price = selling price, discount = % off */
  const sellingPrice  = Number(price)    || 0;
  const discountPct   = Number(discount) || 0;
  const originalPrice = discountPct > 0
    ? Math.round(sellingPrice / (1 - discountPct / 100))
    : 0;

  const imageUrl    = images?.find(i => i.isPrimary)?.url || images?.[0]?.url;
  const wishlisted  = isWishlisted(_id);
  const isOutOfStock = stock <= 0 || status !== 'active';
  const hasDiscount  = discountPct > 0 && originalPrice > sellingPrice;

  const handleWishlist = async (e) => {
    e.preventDefault(); e.stopPropagation();
    try {
      wishlisted ? await removeFromWishlist(_id) : await addToWishlist(_id);
      addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', wishlisted ? 'info' : 'success');
    } catch { addToast('Failed to update wishlist', 'error'); }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (isOutOfStock) return;
    setAdding(true);
    try {
      await addToCart(_id, 1);
      addToast(`${name} added to cart`, 'success');
    } catch { addToast('Failed to add to cart', 'error'); }
    finally { setAdding(false); }
  };

  return (
    /* One lightweight fade-in on first render only; all hover via CSS */
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3), ease: 'easeOut' }}
      className="product-card group"
      style={{ willChange: 'transform' }}
    >
      <div className="product-card-inner">
        {/* ── Image ─────────────────────────────── */}
        <Link to={`/product/${slug}`} className="block relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="product-img h-full w-full object-cover"
          />

          {/* Dark overlay — CSS only */}
          <div className="product-overlay" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
            {isOutOfStock && (
              <span className="rounded-full bg-red-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                Out of Stock
              </span>
            )}
            {hasDiscount && !isOutOfStock && (
              <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm"
                style={{ backgroundColor: '#C59B45' }}>
                {discountPct}% OFF
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={handleWishlist}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-transform duration-200 hover:scale-110 active:scale-95"
            style={{
              backgroundColor: wishlisted ? 'rgba(197,155,69,0.95)' : 'rgba(255,255,255,0.92)',
              color: wishlisted ? '#fff' : '#6E4B2A',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24"
              fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
            </svg>
          </button>

          {/* Quick-add — slides up via CSS */}
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="quick-add-btn"
            >
              {adding ? 'Adding…' : 'Quick Add'}
            </button>
          )}
        </Link>

        {/* ── Body ──────────────────────────────── */}
        <div className="px-4 pb-4 pt-3" style={{ backgroundColor: '#FCFAF6' }}>
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: '#C59B45', fontFamily: '"Poppins", sans-serif' }}>
            {category?.name || 'Product'}
          </p>

          <Link to={`/product/${slug}`}>
            <h3 className="mb-2 font-medium leading-snug transition-opacity duration-200 hover:opacity-70"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F', fontSize: '1rem' }}>
              {name}
            </h3>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-[17px] font-semibold"
                style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
                {sellingPrice > 0 ? `₹${sellingPrice.toLocaleString('en-IN')}` : '—'}
              </span>
              {hasDiscount && (
                <span className="text-[12px] line-through" style={{ color: '#9CA3AF', fontFamily: '"Poppins", sans-serif' }}>
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#C59B45">
                  <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 9.2l7.1-.6L12 2Z" />
                </svg>
                <span className="text-[11px]" style={{ color: '#6E4B2A', fontFamily: '"Poppins", sans-serif' }}>
                  {Number(rating).toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Mobile add-to-cart button */}
          <button
            onClick={handleAddToCart}
            disabled={adding || isOutOfStock}
            className="mt-3 w-full rounded-xl py-2.5 text-[11px] font-semibold uppercase tracking-widest transition-opacity duration-200 hover:opacity-80 active:scale-[0.98] sm:hidden"
            style={{
              backgroundColor: isOutOfStock ? '#D1D5DB' : '#6E4B2A',
              color: '#F8F2E8',
              fontFamily: '"Poppins", sans-serif',
            }}
          >
            {isOutOfStock ? 'Out of Stock' : adding ? 'Adding…' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
