import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, XCircle, Clock, Truck, FileText, Download, Eye } from 'lucide-react';
import StatCard from '../components/common/StatCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import DataTable from '../components/common/DataTable.jsx';
import { mockOrders } from '../data/mockOrders.js';

export default function Orders() {
  const [orders, setOrders] = useState(mockOrders);

  const orderColumns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'products', label: 'Products', render: (value) => <span className="text-sm">{value.join(', ')}</span> },
    { key: 'total', label: 'Total', render: (value) => <span className="font-medium">₹{value}</span> },
    { key: 'payment', label: 'Payment' },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    { key: 'date', label: 'Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 transition-colors hover:bg-amber-100" style={{ color: '#6E4B2A' }} title="View">
            <Eye className="h-4 w-4" />
          </button>
          <button className="rounded-full p-2 transition-colors hover:bg-amber-100" style={{ color: '#6E4B2A' }} title="Update Status">
            <Clock className="h-4 w-4" />
          </button>
          <button className="rounded-full p-2 transition-colors hover:bg-amber-100" style={{ color: '#6E4B2A' }} title="Print Invoice">
            <FileText className="h-4 w-4" />
          </button>
          <button className="rounded-full p-2 transition-colors hover:bg-amber-100" style={{ color: '#6E4B2A' }} title="Download Invoice">
            <Download className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Orders" value={orders.length} icon={Package} color="amber" />
        <StatCard title="Pending" value={orders.filter(o => o.status === 'Pending').length} icon={Clock} color="amber" />
        <StatCard title="Processing" value={orders.filter(o => o.status === 'Processing').length} icon={Clock} color="brown" />
        <StatCard title="Delivered" value={orders.filter(o => o.status === 'Delivered').length} icon={CheckCircle} color="green" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            Orders
          </h2>
          <p
            className="text-sm"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
          >
            Manage customer orders
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <DataTable columns={orderColumns} data={orders} searchable={true} filterable={true} />
    </div>
  );
}
