import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Plus, Edit, Trash2, Copy, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import StatCard from '../components/common/StatCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import DataTable from '../components/common/DataTable.jsx';
import { mockCoupons } from '../data/mockCoupons.js';

export default function Coupons() {
  const [coupons, setCoupons] = useState(mockCoupons);

  const couponColumns = [
    { key: 'code', label: 'Code', render: (value) => (
      <div className="flex items-center gap-2">
        <code className="rounded-full px-3 py-1 text-sm font-mono" style={{ backgroundColor: '#EFE3D1', color: '#4B2F1F' }}>{value}</code>
        <button className="transition-colors hover:text-amber-600" style={{ color: '#6E4B2A' }}>
          <Copy className="h-4 w-4" />
        </button>
      </div>
    )},
    {
      key: 'discount',
      label: 'Discount',
      render: (value, row) => (
        <span className="font-medium">
          {row.discountType === 'percentage' ? `${value}%` : `₹${value}`}
        </span>
      )
    },
    { key: 'minPurchase', label: 'Min Purchase', render: (value) => <span>₹{value}</span> },
    { key: 'expiry', label: 'Expiry' },
    {
      key: 'usage',
      label: 'Usage',
      render: (_, row) => (
        <span className="text-sm">
          {row.usedCount}/{row.usageLimit}
        </span>
      )
    },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 transition-colors hover:bg-amber-100" style={{ color: '#6E4B2A' }}>
            <Edit className="h-4 w-4" />
          </button>
          <button className="rounded-full p-2 transition-colors hover:bg-red-50" style={{ color: '#C59B45' }}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Coupons" value={coupons.length} icon={Ticket} color="amber" />
        <StatCard title="Active" value={coupons.filter(c => c.status === 'active').length} icon={CheckCircle} color="green" />
        <StatCard title="Expired" value={coupons.filter(c => c.status === 'expired').length} icon={XCircle} color="brown" />
        <StatCard title="Total Used" value={coupons.reduce((acc, c) => acc + c.usedCount, 0)} icon={TrendingUp} color="gold" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            Coupons
          </h2>
          <p
            className="text-sm"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
          >
            Manage discount coupons
          </p>
        </div>
        <button
          className="flex items-center gap-2 rounded-full px-6 py-2 text-white transition-all hover:shadow-lg"
          style={{
            fontFamily: '"Poppins", sans-serif',
            background: 'linear-gradient(135deg, #C59B45 0%, #A8771E 100%)'
          }}
        >
          <Plus className="h-4 w-4" />
          Create Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <DataTable columns={couponColumns} data={coupons} searchable={true} filterable={true} />
    </div>
  );
}
