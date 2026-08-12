import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Plus, Edit, Trash2, Copy, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import DataTable from '../components/common/DataTable.jsx';
import { couponService } from '../../services/couponService.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function Coupons() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await couponService.getAllCoupons();
      // Backend returns { status, data: { coupons } } — axios wraps in .data
      setCoupons(response.data?.data?.coupons || response.data?.coupons || []);
    } catch (err) {
      error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  // Derive a display status from model fields (no 'status' field in DB)
  const getCouponStatus = (coupon) => {
    if (!coupon.isActive) return 'inactive';
    const now = new Date();
    if (now < new Date(coupon.validFrom)) return 'scheduled';
    if (now > new Date(coupon.validUntil)) return 'expired';
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return 'exhausted';
    return 'active';
  };

  const handleDelete = async (couponId) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await couponService.deleteCoupon(couponId);
      success('Coupon deleted successfully');
      fetchCoupons();
    } catch (err) {
      error('Failed to delete coupon');
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    success('Coupon code copied to clipboard');
  };

  const couponColumns = [
    {
      key: 'code',
      label: 'Code',
      render: (value) => (
        <div className="flex items-center gap-2">
          <code className="rounded-full px-3 py-1 text-sm font-mono"
            style={{ backgroundColor: '#EFE3D1', color: '#4B2F1F' }}>
            {value}
          </code>
          <button
            onClick={() => handleCopyCode(value)}
            className="transition-colors hover:text-amber-600"
            style={{ color: '#6E4B2A' }}
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      ),
    },
    {
      // model field: type = 'percentage' | 'flat', value = number
      key: 'value',
      label: 'Discount',
      render: (value, row) => (
        <span className="font-medium" style={{ fontFamily: '"Poppins",sans-serif' }}>
          {row.type === 'percentage' ? `${value}%` : `₹${value}`}
        </span>
      ),
    },
    {
      key: 'minimumOrder',
      label: 'Min Order',
      render: (value) => (
        <span style={{ fontFamily: '"Poppins",sans-serif' }}>
          ₹{(value || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'validUntil',
      label: 'Expiry',
      render: (value) => (
        <span style={{ fontFamily: '"Poppins",sans-serif' }}>
          {value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
        </span>
      ),
    },
    {
      key: 'usedCount',
      label: 'Usage',
      render: (value, row) => (
        <span style={{ fontFamily: '"Poppins",sans-serif' }}>
          {value || 0} / {row.usageLimit || '∞'}
        </span>
      ),
    },
    {
      key: '_status',
      label: 'Status',
      render: (_, row) => <StatusBadge status={getCouponStatus(row)} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/coupons/edit/${row._id}`)}
            className="rounded-full p-2 transition-colors hover:bg-amber-100"
            style={{ color: '#6E4B2A' }}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="rounded-full p-2 transition-colors hover:bg-red-50"
            style={{ color: '#EF4444' }}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-[#C59B45] border-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Coupons" value={coupons.length} icon={Ticket} color="amber" />
        <StatCard title="Active" value={coupons.filter(c => getCouponStatus(c) === 'active').length} icon={CheckCircle} color="green" />
        <StatCard title="Expired" value={coupons.filter(c => getCouponStatus(c) === 'expired').length} icon={XCircle} color="brown" />
        <StatCard title="Total Used" value={coupons.reduce((acc, c) => acc + (c.usedCount || 0), 0)} icon={TrendingUp} color="gold" />
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
          onClick={() => navigate('/admin/coupons/create')}
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
