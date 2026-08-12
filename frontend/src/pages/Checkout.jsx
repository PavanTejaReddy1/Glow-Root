import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { cartService } from '../services/cartService.js';
import { orderService } from '../services/orderService.js';
import { useToast } from '../context/ToastContext.jsx';

const inputClass = "w-full rounded-xl border px-4 py-3 text-[13px] outline-none transition-shadow focus:ring-2 focus:ring-amber-300";
const inputStyle = { borderColor: 'rgba(197,155,69,0.3)', fontFamily: '"Poppins", sans-serif', color: '#4B2F1F', backgroundColor: '#F8F2E8' };

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: toastError } = useToast();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: { fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' },
    paymentMethod: 'razorpay',
  });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchCart();
  }, [user, navigate]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartService.getCart();
      const c = response.data?.cart || null;
      setCart(c);
      if (user?.addresses?.length > 0) {
        const addr = user.addresses.find(a => a.isDefault) || user.addresses[0];
        setFormData(p => ({
          ...p,
          shippingAddress: {
            fullName: addr.fullName || user.fullName || '',
            phone: addr.phone || user.phone || '',
            addressLine1: addr.addressLine1 || '',
            addressLine2: addr.addressLine2 || '',
            city: addr.city || '',
            state: addr.state || '',
            pincode: addr.pincode || '',
          },
        }));
      }
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  const set = (field, value) => setFormData(p => ({ ...p, shippingAddress: { ...p.shippingAddress, [field]: value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const orderResponse = await orderService.createOrder({ shippingAddress: formData.shippingAddress, paymentMethod: formData.paymentMethod });
      const order = orderResponse.data?.order;
      if (formData.paymentMethod === 'razorpay' && order?.razorpayOrderId) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.total * 100, currency: 'INR', name: 'GlowRoot',
          description: 'Order Payment', order_id: order.razorpayOrderId,
          handler: async (response) => {
            await orderService.verifyPayment({ orderId: order._id, razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id, razorpaySignature: response.razorpay_signature });
            navigate(`/orders/${order._id}`);
          },
          prefill: { name: formData.shippingAddress.fullName, contact: formData.shippingAddress.phone, email: user.email },
          theme: { color: '#C59B45' },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        rzp.on('payment.failed', () => setProcessing(false));
      } else {
        navigate('/orders');
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Checkout failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20" style={{ backgroundColor: '#F8F2E8' }}>
        <div className="mx-auto max-w-content px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {[1,2].map(i => <div key={i} className="h-48 animate-pulse rounded-2xl" style={{ backgroundColor: 'rgba(197,155,69,0.08)' }} />)}
            </div>
            <div className="h-64 animate-pulse rounded-2xl" style={{ backgroundColor: 'rgba(197,155,69,0.08)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items?.length) { navigate('/cart'); return null; }

  return (
    <div className="min-h-screen py-14 md:py-20" style={{ backgroundColor: '#F8F2E8' }}>
      <div className="mx-auto max-w-content px-4 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-3xl font-medium md:text-4xl"
          style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
        >
          Checkout
        </motion.h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ── Left ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
              className="rounded-2xl p-7"
              style={{ backgroundColor: '#FCFAF6', boxShadow: '0 2px 20px rgba(75,47,31,0.07)', border: '1px solid rgba(197,155,69,0.15)' }}
            >
              <h2 className="mb-6 flex items-center gap-3 text-xl font-medium" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
                <span className="flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold text-white" style={{ backgroundColor: '#C59B45' }}>1</span>
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Full Name *">
                    <input type="text" required value={formData.shippingAddress.fullName} onChange={e => set('fullName', e.target.value)} className={inputClass} style={inputStyle} placeholder="Ananya Sharma" />
                  </Field>
                  <Field label="Phone *">
                    <input type="tel" required value={formData.shippingAddress.phone} onChange={e => set('phone', e.target.value)} className={inputClass} style={inputStyle} placeholder="+91 98765 43210" />
                  </Field>
                </div>
                <Field label="Address Line 1 *">
                  <input type="text" required value={formData.shippingAddress.addressLine1} onChange={e => set('addressLine1', e.target.value)} className={inputClass} style={inputStyle} placeholder="House / Flat / Block No." />
                </Field>
                <Field label="Address Line 2">
                  <input type="text" value={formData.shippingAddress.addressLine2} onChange={e => set('addressLine2', e.target.value)} className={inputClass} style={inputStyle} placeholder="Street, Locality (optional)" />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="City *">
                    <input type="text" required value={formData.shippingAddress.city} onChange={e => set('city', e.target.value)} className={inputClass} style={inputStyle} placeholder="Mumbai" />
                  </Field>
                  <Field label="State *">
                    <input type="text" required value={formData.shippingAddress.state} onChange={e => set('state', e.target.value)} className={inputClass} style={inputStyle} placeholder="Maharashtra" />
                  </Field>
                  <Field label="Pincode *">
                    <input type="text" required value={formData.shippingAddress.pincode} onChange={e => set('pincode', e.target.value)} className={inputClass} style={inputStyle} placeholder="400001" />
                  </Field>
                </div>
              </div>
            </motion.div>

            {/* Payment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }}
              className="rounded-2xl p-7"
              style={{ backgroundColor: '#FCFAF6', boxShadow: '0 2px 20px rgba(75,47,31,0.07)', border: '1px solid rgba(197,155,69,0.15)' }}
            >
              <h2 className="mb-6 flex items-center gap-3 text-xl font-medium" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
                <span className="flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold text-white" style={{ backgroundColor: '#C59B45' }}>2</span>
                Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'razorpay', label: 'Razorpay', sub: 'Cards · UPI · Net Banking · Wallets', icon: '💳' },
                  { value: 'cod',      label: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: '🏠' },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-4 rounded-xl p-4 transition-all"
                    style={{
                      border: `1.5px solid ${formData.paymentMethod === opt.value ? 'rgba(197,155,69,0.6)' : 'rgba(197,155,69,0.2)'}`,
                      backgroundColor: formData.paymentMethod === opt.value ? 'rgba(197,155,69,0.06)' : 'transparent',
                    }}
                  >
                    <input
                      type="radio" name="paymentMethod" value={opt.value}
                      checked={formData.paymentMethod === opt.value}
                      onChange={e => setFormData(p => ({ ...p, paymentMethod: e.target.value }))}
                      className="hidden"
                    />
                    <div
                      className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                      style={{ borderColor: formData.paymentMethod === opt.value ? '#C59B45' : 'rgba(110,75,42,0.35)' }}
                    >
                      {formData.paymentMethod === opt.value && (
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#C59B45' }} />
                      )}
                    </div>
                    <span className="text-xl">{opt.icon}</span>
                    <div>
                      <p className="text-[14px] font-semibold" style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}>{opt.label}</p>
                      <p className="text-[12px]" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>{opt.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Order Summary ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="h-fit rounded-2xl p-6"
            style={{ backgroundColor: '#FCFAF6', boxShadow: '0 4px 24px rgba(75,47,31,0.09)', border: '1px solid rgba(197,155,69,0.18)' }}
          >
            <h2 className="mb-5 text-xl font-medium" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
              Order Summary
            </h2>

            <div className="mb-5 max-h-52 space-y-3 overflow-y-auto pr-1">
              {cart.items.map(item => (
                <div key={item._id} className="flex items-center gap-3">
                  <img src={item.product?.images?.[0]?.url} alt={item.product?.name} className="h-12 w-12 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[13px] font-medium" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>{item.product?.name}</p>
                    <p className="text-[11px]" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>Qty: {item.quantity}</p>
                  </div>
                  <p className="text-[13px] font-semibold flex-shrink-0" style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}>
                    ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 border-t pt-4 text-[13px]" style={{ borderColor: 'rgba(197,155,69,0.2)', fontFamily: '"Poppins", sans-serif' }}>
              <div className="flex justify-between"><span style={{ color: '#6E4B2A' }}>Subtotal</span><span style={{ color: '#4B2F1F' }}>₹{cart.subtotal?.toLocaleString('en-IN') || 0}</span></div>
              {cart.coupon && <div className="flex justify-between"><span style={{ color: '#6E4B2A' }}>Discount</span><span className="font-semibold" style={{ color: '#5B7F3A' }}>−₹{cart.discount?.toLocaleString('en-IN') || 0}</span></div>}
              <div className="flex justify-between">
                <span style={{ color: '#6E4B2A' }}>Shipping</span>
                <span style={{ color: (cart.shippingCharge ?? 0) === 0 ? '#5B7F3A' : '#4B2F1F', fontWeight: (cart.shippingCharge ?? 0) === 0 ? 600 : 400 }}>
                  {(cart.shippingCharge ?? 0) === 0 ? 'Free' : `₹${cart.shippingCharge?.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div className="flex justify-between border-t pt-3 text-[15px] font-bold" style={{ borderColor: 'rgba(197,155,69,0.2)' }}>
                <span style={{ color: '#4B2F1F' }}>Total</span>
                <span style={{ color: '#C59B45', fontFamily: '"Cormorant Garamond", serif', fontSize: '1.15rem' }}>₹{cart.total?.toLocaleString('en-IN') || 0}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[12px] font-semibold uppercase tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
              style={{ backgroundColor: '#4B2F1F', color: '#F8F2E8', fontFamily: '"Poppins", sans-serif' }}
            >
              {processing ? (
                <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Processing…</>
              ) : (
                <>Place Order · ₹{cart.total?.toLocaleString('en-IN') || 0}</>
              )}
            </button>

            <p className="mt-4 text-center text-[11px]" style={{ color: 'rgba(110,75,42,0.5)', fontFamily: '"Poppins", sans-serif' }}>
              🔒 128-bit SSL encrypted checkout
            </p>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
