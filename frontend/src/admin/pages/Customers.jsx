import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import StatCard from '../components/common/StatCard.jsx';
import DataTable from '../components/common/DataTable.jsx';
import { mockCustomers } from '../data/mockCustomers.js';

export default function Customers() {
  const [customers, setCustomers] = useState(mockCustomers);

  const customerColumns = [
    {
      key: 'avatar',
      label: 'Profile',
      render: (value) => (
        <img src={value} alt="Customer" className="h-10 w-10 rounded-full object-cover" />
      )
    },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'orders', label: 'Orders' },
    { key: 'totalSpent', label: 'Total Spent', render: (value) => <span className="font-medium">₹{value}</span> },
    { key: 'joinedDate', label: 'Joined' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
          value === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
        }`} style={{ fontFamily: '"Poppins", sans-serif' }}>
          {value}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Customers" value={customers.length} icon={Users} color="amber" />
        <StatCard title="Active Customers" value={customers.filter(c => c.status === 'active').length} icon={CheckCircle} color="green" />
        <StatCard title="New This Month" value="45" icon={Calendar} color="gold" />
        <StatCard title="Total Revenue" value="₹12,45,678" icon={DollarSign} color="brown" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            Customers
          </h2>
          <p
            className="text-sm"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
          >
            Manage your customer base
          </p>
        </div>
      </div>

      {/* Customers Table */}
      <DataTable columns={customerColumns} data={customers} searchable={true} filterable={true} />
    </div>
  );
}
