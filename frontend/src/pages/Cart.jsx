import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import { useCart } from '../context/CartContext.jsx';
import { cartService } from '../services/cartService.js';
import { couponService } from '../services/couponService.js';
import { useToast } from '../context/ToastContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';

/* ─── Available Coupons Modal ─────────────────────────────────────── */
function CouponsModal({ onClose, onApply, cartSubtotal }) {
  const [coupons,  setCoupons]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    couponService.getActiveCoupons()
      .then(r => setCoupons(r.data?.data?.coupons || r.data?.coupons || []))
      .catch(() => setCoupons([]))
      .finally(() => setLoading(false));
  }, []);

  const eligible = (c) => cartSubtotal >= (c.minimumOrder || 0);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />
      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        exit=  {{ opacity: 0, y: 32, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.22,1,0.36,1] }}
        className="fixed inset-x-4 bottom-0 z-50 mx-auto max-w-lg rounded-t-3xl pb-6 sm:inset-x-auto sm:left-1/2 sm:bottom-auto sm:top-1/2 sm:w-full sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl"
        style={{ backgroundColor: '#F8F2E8', boxShadow: '0 -8px 48px rgba(75,47,31,0.18)' }}
      >
        {/* Handle */}
        <div className="mb-4 flex justify-center pt-4 sm:hidden">
          <div className="h-1 w-10 rounded-full" style={{ backgroundColor: 'rgba(110,75,42,0.25)' }} />
        </div>

        <div className="px-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold" style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
              Available Coupons
            </h3>
            <button onClick={onClose} className="icon-btn" style={{ color: '#4B2F1F' }}>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-t-[#C59B45] border-gray-200" />
            </div>
          ) : coupons.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[14px]" style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>
                No active coupons at the moment.
              </p>
            </div>
          ) : (
            <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1 pb-2">
              {coupons.map(coupon => {
                const ok = eligible(coupon);
                return (
                  <div
                    key={coupon._id}
                    className="flex items-center gap-4 rounded-2xl p-4"
                    style={{
                      border: `1.5px ${ok ? 'dashed' : 'solid'} rgba(197,155,69,${ok ? '0.5' : '0.2'})`,
                      backgroundColor: ok ? 'rgba(197,155,69,0.05)' : 'rgba(197,155,69,0.02)',
                      opacity: ok ? 1 : 0.65,
                    }}
                  >
                    {/* Coupon icon */}
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                      style={{ background: 'linear-gradient(135deg,#C59B45,#A8771E)' }}>
                      <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M20 12V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 1 0 4v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2a2 2 0 0 1 0-4Z" />
                      </svg>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[15px] font-bold" style={{ color: '#4B2F1F' }}>
                          {coupon.code}
                        </span>
                        {!ok && (
                          <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                            style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                            Not eligible
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[12px]" style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>
                        {coupon.type === 'percentage' ? `${coupon.value}% off` : `₹${coupon.value} off`}
                        {coupon.minimumOrder > 0 ? ` · Min order ₹${coupon.minimumOrder.toLocaleString('en-IN')}` : ''}
                      </p>
                      {coupon.description && (
                        <p className="mt-0.5 truncate text-[11px]" style={{ fontFamily: '"Poppins",sans-serif', color: '#9CA3AF' }}>
                          {coupon.description}
                        </p>
                      )}
                      {coupon.validUntil && (
                        <p className="mt-0.5 text-[10px] uppercase tracking-wide" style={{ fontFamily: '"Poppins",sans-serif', color: '#C59B45' }}>
                          Expires {new Date(coupon.validUntil).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                        </p>
                      )}
                    </div>

                    {/* Apply button */}
                    <button
                      disabled={!ok || applying === coupon.code}
                      onClick={async () => {
                        setApplying(coupon.code);
                        await onApply(coupon.code);
                        setApplying(null);
                        onClose();
                      }}
                      className="flex-shrink-0 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: ok ? '#4B2F1F' : 'transparent',
                        color: ok ? '#F8F2E8' : '#9CA3AF',
                        border: ok ? 'none' : '1px solid #D1D5DB',
                        fontFamily: '"Poppins",sans-serif',
                        minWidth: '72px',
                      }}
                    >
                      {applying === coupon.code ? (
                        <span className="flex items-center gap-1">
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        </span>
                      ) : ok ? 'Apply' : 'Add more'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

/* ─── Cart Page ───────────────────────────────────────────────────── */
export default function Cart() {
  const { cart, loading, updating, updateCartItem, removeFromCart, fetchCart } = useCart();
  const { success, error: toastError } = useToast();
  const { settings } = useSettings();

  const [couponCode,    setCouponCode]    = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [showCoupons,   setShowCoupons]   = useState(false);

  const freeShippingAbove = settings?.freeShippingAbove ?? 1999;
  const shippingCost = cart?.shippingCharge ?? cart?.shippingCost ?? 0;
  const amountToFreeShipping = freeShippingAbove - (cart?.subtotal || 0);

  useEffect(() => { document.title = 'Your Bag — GlowRoot'; }, []);

  const applyCode = useCallback(async (code) => {
    const c = (code || couponCode).trim().toUpperCase();
    if (!c) return;
    setCouponLoading(true);
    try {
      await cartService.applyCoupon(c);
      await fetchCart();
      success(`Coupon ${c} applied!`);
      setCouponCode('');
    } catch (err) {
      toastError(err.response?.data?.message || 'Invalid or expired coupon');
    } finally {
      setCouponLoading(false);
    }
  }, [couponCode, fetchCart, success, toastError]);

  const removeCode = useCallback(async () => {
    setCouponLoading(true);
    try {
      await cartService.removeCoupon();
      await fetchCart();
      success('Coupon removed');
      setCouponCode('');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to remove coupon');
    } finally {
      setCouponLoading(false);
    }
  }, [fetchCart, success, toastError]);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen py-20" style={{ backgroundColor: '#F8F2E8' }}>
        <div className="mx-auto max-w-content px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-28 animate-pulse rounded-2xl" style={{ backgroundColor: 'rgba(197,155,69,0.07)' }} />)}
            </div>
            <div className="h-80 animate-pulse rounded-2xl" style={{ backgroundColor: 'rgba(197,155,69,0.07)' }} />
          </div>
        </div>
      </div>
    );
  }

  /* ── Empty bag ── */
  if (!cart || !cart.items?.length) {
    return (
      <div className="min-h-screen py-20" style={{ backgroundColor: '#F8F2E8' }}>
        <div className="mx-auto max-w-content px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex flex-col items-center py-20 text-center"
          >
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(197,155,69,0.1)' }}>
              <svg className="h-11 w-11" viewBox="0 0 24 24" fill="none" stroke="#C59B45" strokeWidth="1.3">
                <path d="M6 8h12l-1 13H7L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
            </div>
            <img src={logo} alt="GlowRoot" className="mb-6 h-12 w-auto" />
            <h1 className="mb-3 text-3xl font-medium md:text-4xl" style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
              Your bag awaits its first ritual
            </h1>
            <p className="mb-8 max-w-sm text-[14px] leading-relaxed" style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>
              Everything in the GlowRoot catalog is formulated to work together.
            </p>
            <Link to="/shop"
              className="rounded-full px-10 py-3.5 text-[12px] font-semibold uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: '#4B2F1F', color: '#F8F2E8', fontFamily: '"Poppins",sans-serif' }}>
              Explore The Rituals
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── Cart with items ── */
  return (
    <div className="min-h-screen py-14 md:py-20" style={{ backgroundColor: '#F8F2E8' }}>
      <div className="mx-auto max-w-content px-4 lg:px-8">

        <h1 className="mb-10 text-3xl font-medium md:text-4xl page-enter"
          style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
          Your Bag
          <span className="ml-3 text-xl font-normal" style={{ color: '#C59B45' }}>
            ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
          </span>
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* ── Items ── */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, i) => (
              <div key={item._id}
                className="flex gap-5 rounded-2xl p-5"
                style={{
                  backgroundColor: '#FCFAF6',
                  border: '1px solid rgba(197,155,69,0.15)',
                  boxShadow: '0 2px 14px rgba(75,47,31,0.06)',
                  animation: `sectionFadeUp 0.35s ease-out ${i * 55}ms both`,
                }}>
                <Link to={`/product/${item.product?.slug}`} className="flex-shrink-0">
                  <img src={item.product?.images?.[0]?.url} alt={item.product?.name}
                    className="h-24 w-24 rounded-xl object-cover" />
                </Link>

                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest truncate"
                        style={{ color: '#C59B45', fontFamily: '"Poppins",sans-serif' }}>
                        {item.product?.category?.name || 'Product'}
                      </p>
                      <Link to={`/product/${item.product?.slug}`}>
                        <h3 className="text-[16px] font-medium transition-opacity hover:opacity-70 truncate"
                          style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
                          {item.product?.name}
                        </h3>
                      </Link>
                      <p className="mt-1 text-[15px] font-semibold"
                        style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
                        ₹{item.price?.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} disabled={updating}
                      className="flex-shrink-0 rounded-full p-1.5 transition-colors hover:bg-red-50 disabled:opacity-40"
                      style={{ color: '#9CA3AF' }} aria-label="Remove">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-xl" style={{ border: '1.5px solid rgba(197,155,69,0.3)' }}>
                      <button onClick={() => updateCartItem(item._id, Math.max(1, item.quantity - 1))}
                        disabled={updating} className="px-3 py-1.5 text-[16px] transition-colors hover:text-amber-700 disabled:opacity-40"
                        style={{ color: '#6E4B2A' }}>−</button>
                      <span className="w-8 text-center text-[13px] font-semibold"
                        style={{ color: '#4B2F1F', fontFamily: '"Poppins",sans-serif' }}>{item.quantity}</span>
                      <button onClick={() => updateCartItem(item._id, item.quantity + 1)}
                        disabled={updating} className="px-3 py-1.5 text-[16px] transition-colors hover:text-amber-700 disabled:opacity-40"
                        style={{ color: '#6E4B2A' }}>+</button>
                    </div>
                    <span className="text-[13px] font-semibold"
                      style={{ color: '#4B2F1F', fontFamily: '"Poppins",sans-serif' }}>
                      = ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Order Summary ── */}
          <div className="h-fit rounded-2xl p-6"
            style={{ backgroundColor: '#FCFAF6', border: '1px solid rgba(197,155,69,0.18)', boxShadow: '0 4px 24px rgba(75,47,31,0.09)' }}>

            <h2 className="mb-6 text-xl font-medium" style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
              Order Summary
            </h2>

            {/* Free shipping nudge */}
            {shippingCost > 0 && amountToFreeShipping > 0 && (
              <div className="mb-5 rounded-xl px-4 py-3"
                style={{ backgroundColor: 'rgba(197,155,69,0.08)', border: '1px solid rgba(197,155,69,0.25)' }}>
                <p className="text-[12px]" style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>
                  Add <strong>₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> more for{' '}
                  <span className="font-semibold" style={{ color: '#5B7F3A' }}>FREE shipping</span>
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(197,155,69,0.2)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, ((cart?.subtotal || 0) / freeShippingAbove) * 100)}%`,
                      backgroundColor: '#C59B45',
                    }}
                  />
                </div>
              </div>
            )}
            {shippingCost === 0 && (cart?.subtotal || 0) > 0 && (
              <div className="mb-5 rounded-xl px-4 py-3"
                style={{ backgroundColor: 'rgba(91,127,58,0.08)', border: '1px solid rgba(91,127,58,0.25)' }}>
                <p className="text-[12px] font-semibold" style={{ fontFamily: '"Poppins",sans-serif', color: '#5B7F3A' }}>
                  🎉 You have free shipping!
                </p>
              </div>
            )}

            {/* ── Coupon section ── */}
            {cart.coupon?.code ? (
              /* Applied coupon */
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="mb-5 flex items-center justify-between rounded-xl px-4 py-3"
                style={{ backgroundColor: 'rgba(91,127,58,0.08)', border: '1px solid rgba(91,127,58,0.3)' }}
              >
                <div>
                  <p className="text-[12px] font-bold" style={{ color: '#5B7F3A', fontFamily: '"Poppins",sans-serif' }}>
                    🎉 {cart.coupon.code}
                  </p>
                  <p className="text-[11px]" style={{ color: '#5B7F3A', fontFamily: '"Poppins",sans-serif' }}>
                    Saving ₹{(cart.discount || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                  onClick={removeCode}
                  disabled={couponLoading}
                  className="rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all hover:opacity-80 disabled:opacity-40"
                  style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444', fontFamily: '"Poppins",sans-serif' }}
                >
                  {couponLoading ? '…' : 'Remove'}
                </button>
              </motion.div>
            ) : (
              /* Coupon input */
              <div className="mb-5 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && applyCode()}
                    placeholder="Enter coupon code"
                    className="flex-1 rounded-xl border px-3 py-2.5 text-[12px] outline-none focus:ring-2 focus:ring-amber-300"
                    style={{ borderColor: 'rgba(197,155,69,0.3)', fontFamily: '"Poppins",sans-serif', color: '#4B2F1F', backgroundColor: '#F8F2E8' }}
                  />
                  <button
                    onClick={() => applyCode()}
                    disabled={couponLoading || !couponCode.trim()}
                    className="rounded-xl px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-40"
                    style={{ backgroundColor: '#6E4B2A', color: '#F8F2E8', fontFamily: '"Poppins",sans-serif' }}
                  >
                    {couponLoading ? '…' : 'Apply'}
                  </button>
                </div>

                {/* Show all coupons button */}
                <button
                  onClick={() => setShowCoupons(true)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-semibold uppercase tracking-wider transition-all hover:opacity-80"
                  style={{ color: '#C59B45', fontFamily: '"Poppins",sans-serif', border: '1px solid rgba(197,155,69,0.3)', backgroundColor: 'rgba(197,155,69,0.05)' }}
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 12V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 1 0 4v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2a2 2 0 0 1 0-4Z" />
                  </svg>
                  View All Available Coupons
                </button>
              </div>
            )}

            {/* Price breakdown */}
            <div className="space-y-3 text-[13px]" style={{ fontFamily: '"Poppins",sans-serif' }}>
              <div className="flex justify-between">
                <span style={{ color: '#6E4B2A' }}>Subtotal</span>
                <span style={{ color: '#4B2F1F' }}>₹{(cart.subtotal || 0).toLocaleString('en-IN')}</span>
              </div>
              {cart.coupon?.code && (
                <div className="flex justify-between">
                  <span style={{ color: '#6E4B2A' }}>Discount</span>
                  <span className="font-semibold" style={{ color: '#5B7F3A' }}>
                    −₹{(cart.discount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span style={{ color: '#6E4B2A' }}>Shipping</span>
                <span style={{ color: shippingCost === 0 ? '#5B7F3A' : '#4B2F1F', fontWeight: shippingCost === 0 ? 600 : 400 }}>
                  {shippingCost === 0 ? 'Free' : `₹${shippingCost.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div className="border-t pt-3" style={{ borderColor: 'rgba(197,155,69,0.2)' }}>
                <div className="flex justify-between text-[15px]">
                  <span className="font-semibold" style={{ color: '#4B2F1F' }}>Total</span>
                  <span style={{ color: '#C59B45', fontFamily: '"Cormorant Garamond",serif', fontSize: '1.15rem', fontWeight: 700 }}>
                    ₹{(cart.total || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <Link to="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[12px] font-semibold uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: '#4B2F1F', color: '#F8F2E8', fontFamily: '"Poppins",sans-serif' }}>
              Proceed to Checkout
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <p className="mt-4 text-center text-[11px]" style={{ color: 'rgba(110,75,42,0.5)', fontFamily: '"Poppins",sans-serif' }}>
              Secure checkout · Free returns within 14 days
            </p>
          </div>
        </div>
      </div>

      {/* Coupons Modal */}
      <AnimatePresence>
        {showCoupons && (
          <CouponsModal
            onClose={() => setShowCoupons(false)}
            onApply={applyCode}
            cartSubtotal={cart.subtotal || 0}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
