export default function StatusBadge({ status }) {
  const statusConfig = {
    active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
    inactive: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Inactive' },
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
    processing: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Processing' },
    shipped: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Shipped' },
    delivered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
    approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
    expired: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Expired' },
    low_stock: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Low Stock' },
    out_of_stock: { bg: 'bg-red-100', text: 'text-red-700', label: 'Out of Stock' }
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.active;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${config.bg} ${config.text}`}
      style={{ fontFamily: '"Poppins", sans-serif' }}
    >
      {config.label}
    </span>
  );
}
