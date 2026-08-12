import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Wishlist() {
  const { wishlist, loading, error, fetchWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [movingId, setMovingId] = useState(null);

  useEffect(() => {
    document.title = 'My Wishlist — GlowRoot';
    if (isAuthenticated) {
      fetchWishlist().finally(() => setHasLoaded(true));
    }
  }, [isAuthenticated]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      addToast('Removed from wishlist', 'info');
    } catch {
      addToast('Failed to remove', 'error');
    }
  };

  const handleMoveToCart = async (productId) => {
    setMovingId(productId);
    try {
      await addToCart(productId, 1);
      await removeFromWishlist(productId);
      addToast('Moved to cart!', 'success');
    } catch {
      addToast('Failed to move to cart', 'error');
    } finally {
      setMovingId(null);
    }
  };

  if (!isAuthenticated) {
    return <ProtectedRoute><div /></ProtectedRoute>;
  }

  const showLoader = !hasLoaded && loading;

  return (
    <div className="min-h-screen py-14 md:py-20 page-enter" style={{ backgroundColor: '#F8F2E8' }}>
      <div className="mx-auto max-w-content px-4 lg:px-8">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#C59B45', fontFamily: '"Poppins",sans-serif' }}>
              My Account
            </p>
            <h1 className="text-3xl font-medium md:text-4xl" style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
              Wishlist
              {wishlist.length > 0 && (
                <span className="ml-3 text-xl font-normal" style={{ color: '#C59B45' }}>({wishlist.length})</span>
              )}
            </h1>
          </div>
          {wishlist.length > 0 && (
            <Link to="/shop"
              className="hidden text-[12px] font-semibold uppercase tracking-widest transition-all duration-200 hover:text-amber-700 md:block"
              style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>
              Continue Shopping →
            </Link>
          )}
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl p-4" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA' }}>
            <p className="flex-1 text-[13px]" style={{ fontFamily: '"Poppins",sans-serif', color: '#DC2626' }}>
              Error loading wishlist. <button onClick={fetchWishlist} className="underline">Retry</button>
            </p>
          </div>
        )}

        {showLoader ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="animate-pulse rounded-2xl overflow-hidden" style={{ backgroundColor: 'rgba(197,155,69,0.07)' }}>
                <div className="h-52 w-full" />
                <div className="p-4 space-y-2">
                  <div className="h-3 rounded w-3/4" style={{ backgroundColor: 'rgba(197,155,69,0.12)' }} />
                  <div className="h-5 rounded w-1/2" style={{ backgroundColor: 'rgba(197,155,69,0.12)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(197,155,69,0.1)' }}>
              <svg className="h-11 w-11" viewBox="0 0 24 24" fill="none" stroke="#C59B45" strokeWidth="1.3">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
              </svg>
            </div>
            <h2 className="mb-3 text-2xl font-medium" style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
              Your wishlist is empty
            </h2>
            <p className="mb-8 text-[14px]" style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>
              Save formulations you love — they'll be right here.
            </p>
            <Link to="/shop"
              className="rounded-full px-10 py-3.5 text-[12px] font-semibold uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: '#4B2F1F', color: '#F8F2E8', fontFamily: '"Poppins",sans-serif' }}>
              Explore Rituals
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((item, i) => {
              const productId = typeof item.product === 'object' ? item.product._id : item.product;
              const isMoving = movingId === productId;
              return (
                <div
                  key={item._id}
                  className="wishlist-card overflow-hidden rounded-2xl"
                  style={{
                    backgroundColor: '#FCFAF6',
                    boxShadow: '0 2px 14px rgba(75,47,31,0.06)',
                    border: '1px solid rgba(197,155,69,0.14)',
                    animation: `sectionFadeUp 0.4s ease-out ${i * 50}ms both`,
                  }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <Link to={`/product/${item.productSlug || productId}`}>
                      <img src={item.productImage} alt={item.productName}
                        className="wishlist-img h-full w-full object-cover" />
                    </Link>
                    <button
                      onClick={() => handleRemove(productId)}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-all duration-200 hover:scale-110 active:scale-95"
                      style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#EF4444' }}
                      aria-label="Remove"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <Link to={`/product/${item.productSlug || productId}`}>
                      <h3 className="mb-1 text-[15px] font-medium leading-snug transition-opacity hover:opacity-70"
                        style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
                        {item.productName}
                      </h3>
                    </Link>
                    <p className="mb-4 text-[17px] font-semibold"
                      style={{ fontFamily: '"Cormorant Garamond",serif', color: '#C59B45' }}>
                      ₹{item.price?.toLocaleString('en-IN') || '—'}
                    </p>
                    <button
                      onClick={() => handleMoveToCart(productId)}
                      disabled={isMoving}
                      className="w-full rounded-xl py-2.5 text-[11px] font-semibold uppercase tracking-widest transition-all duration-200 hover:opacity-80 active:scale-[0.98] disabled:opacity-60"
                      style={{ backgroundColor: '#4B2F1F', color: '#F8F2E8', fontFamily: '"Poppins",sans-serif' }}
                    >
                      {isMoving ? 'Adding…' : 'Move to Bag'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
