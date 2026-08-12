export default function StatusBadge({ status }) {
  const statusConfig = {
    active:      { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Active'     },
    inactive:    { bg: 'bg-slate-100',  text: 'text-slate-600',  label: 'Inactive'   },
    scheduled:   { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Scheduled'  },
    expired:     { bg: 'bg-slate-100',  text: 'text-slate-600',  label: 'Expired'    },
    exhausted:   { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Exhausted'  },
    pending:     { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Pending'    },
    confirmed:   { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Confirmed'  },
    processing:  { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Processing' },
    shipped:     { bg: 'bg-cyan-100',   text: 'text-cyan-700',   label: 'Shipped'    },
    delivered:   { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Delivered'  },
    cancelled:   { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Cancelled'  },
    refunded:    { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Refunded'   },
    approved:    { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Approved'   },
    rejected:    { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Rejected'   },
    blocked:     { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Blocked'    },
    low_stock:   { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Low Stock'  },
    out_of_stock:{ bg: 'bg-red-100',    text: 'text-red-700',    label: 'Out of Stock'},
  };

  const key = (status || '').toLowerCase();
  const config = statusConfig[key] || { bg: 'bg-slate-100', text: 'text-slate-600', label: status || '—' };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${config.bg} ${config.text}`}
      style={{ fontFamily: '"Poppins",sans-serif' }}
    >
      {config.label}
    </span>
  );
}
