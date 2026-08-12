import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import { orderService } from '../services/orderService.js';

const STATUS_COLORS = {
  pending:    { bg: '#FEF3C7', text: '#D97706' },
  confirmed:  { bg: '#DBEAFE', text: '#2563EB' },
  processing: { bg: '#EDE9FE', text: '#7C3AED' },
  shipped:    { bg: '#CFFAFE', text: '#0891B2' },
  delivered:  { bg: '#D1FAE5', text: '#059669' },
  cancelled:  { bg: '#FEE2E2', text: '#DC2626' },
  refunded:   { bg: '#E0E7FF', text: '#4F46E5' },
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || { bg: 'rgba(197,155,69,0.1)', text: '#6E4B2A' };
  return (
    <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: s.bg, color: s.text, fontFamily: '"Poppins",sans-serif' }}>
      {status}
    </span>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'My Orders — GlowRoot';
    orderService.getUserOrders()
      .then(r => setOrders(r.data?.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen py-14 md:py-20 page-enter" style={{ backgroundColor: '#F8F2E8' }}>
        <div className="mx-auto max-w-content px-4 lg:px-8">

          {/* Header */}
          <div className="mb-10">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: '#C59B45', fontFamily: '"Poppins",sans-serif' }}>
              My Account
            </p>
            <h1 className="text-3xl font-medium md:text-4xl"
              style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
              My Orders
            </h1>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="h-32 animate-pulse rounded-2xl"
                  style={{ backgroundColor: 'rgba(197,155,69,0.07)' }} />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center">
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full"
                style={{ backgroundColor: 'rgba(197,155,69,0.1)' }}>
                <svg className="h-11 w-11" viewBox="0 0 24 24" fill="none" stroke="#C59B45" strokeWidth="1.3">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" />
                  <path d="M9 12h6M9 16h4" />
                </svg>
              </div>
              <h2 className="mb-3 text-2xl font-medium"
                style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
                No orders yet
              </h2>
              <p className="mb-8 text-[14px]" style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>
                Your ritual journey starts with your first order.
              </p>
              <Link to="/shop"
                className="rounded-full px-10 py-3.5 text-[12px] font-semibold uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ backgroundColor: '#4B2F1F', color: '#F8F2E8', fontFamily: '"Poppins",sans-serif' }}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl"
                  style={{
                    backgroundColor: '#FCFAF6',
                    border: '1px solid rgba(197,155,69,0.14)',
                    boxShadow: '0 2px 14px rgba(75,47,31,0.05)',
                    animation: `sectionFadeUp 0.4s ease-out ${i * 60}ms both`,
                  }}
                >
                  {/* Order header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
                    style={{ borderColor: 'rgba(197,155,69,0.14)' }}>
                    <div>
                      <p className="text-[11px] uppercase tracking-widest"
                        style={{ fontFamily: '"Poppins",sans-serif', color: '#9CA3AF' }}>
                        Order
                      </p>
                      <p className="font-mono text-[15px] font-semibold"
                        style={{ color: '#4B2F1F' }}>
                        #{order.orderNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px]" style={{ fontFamily: '"Poppins",sans-serif', color: '#9CA3AF' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                    <Link to={`/orders/${order._id}`}
                      className="text-[12px] font-semibold transition-colors hover:opacity-70"
                      style={{ color: '#C59B45', fontFamily: '"Poppins",sans-serif' }}>
                      View Details →
                    </Link>
                  </div>

                  {/* Items preview */}
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className="flex gap-2 flex-1 overflow-hidden">
                      {order.items.slice(0, 4).map((item, idx) => (
                        <img
                          key={item._id || idx}
                          src={item.product?.images?.[0]?.url}
                          alt={item.product?.name}
                          className="h-14 w-14 flex-shrink-0 rounded-xl object-cover"
                          style={{ border: '1px solid rgba(197,155,69,0.18)' }}
                        />
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl"
                          style={{ backgroundColor: 'rgba(197,155,69,0.08)', color: '#6E4B2A', fontFamily: '"Poppins",sans-serif', fontSize: '12px', fontWeight: 600 }}>
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-[11px]" style={{ fontFamily: '"Poppins",sans-serif', color: '#9CA3AF' }}>
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-[18px] font-semibold"
                        style={{ fontFamily: '"Cormorant Garamond",serif', color: '#C59B45' }}>
                        ₹{order.total?.toLocaleString('en-IN') || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
