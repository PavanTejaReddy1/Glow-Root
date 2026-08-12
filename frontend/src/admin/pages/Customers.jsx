import { useState, useEffect, useCallback } from 'react';
import { Users, Calendar, DollarSign, CheckCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard.jsx';
import DataTable from '../components/common/DataTable.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../services/api.js';

export default function Customers() {
  const navigate = useNavigate();
  const { error } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(async () => {
    try {
      // Use shared api instance — proper auth interceptors, no localhost fallback
      const response = await api.get('/api/v1/admin/customers');
      const data = response.data?.data?.customers || response.data?.customers || [];
      setCustomers(data);
    } catch (err) {
      error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const newThisMonth = customers.filter(c => {
    const d = new Date(c.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  const customerColumns = [
    {
      key: 'avatar',
      label: 'Profile',
      render: (_, row) => (
        <div className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: '#EFE3D1' }}>
          <span className="text-sm font-semibold" style={{ color: '#6E4B2A' }}>
            {row.firstName?.[0]?.toUpperCase() || row.email?.[0]?.toUpperCase() || 'U'}
          </span>
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (_, row) => `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'N/A',
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', render: v => v || 'N/A' },
    { key: 'orders', label: 'Orders', render: (_, row) => row.orderCount || 0 },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      render: (_, row) => (
        <span className="font-medium">₹{(row.totalSpent || 0).toLocaleString('en-IN')}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: v => new Date(v).toLocaleDateString('en-IN'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => navigate(`/admin/customers/${row._id}`)}
          className="rounded-full p-2 transition-colors hover:bg-amber-100"
          style={{ color: '#6E4B2A' }}
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </button>
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Customers" value={customers.length} icon={Users} color="amber" />
        <StatCard
          title="Active Customers"
          value={customers.filter(c => c.isActive !== false).length}
          icon={CheckCircle}
          color="green"
        />
        <StatCard title="New This Month" value={newThisMonth} icon={Calendar} color="gold" />
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          icon={DollarSign}
          color="brown"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
            Customers
          </h2>
          <p className="text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
            Manage your customer base
          </p>
        </div>
      </div>

      <DataTable columns={customerColumns} data={customers} searchable filterable />
    </div>
  );
}
