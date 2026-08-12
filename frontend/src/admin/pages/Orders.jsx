import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, XCircle, Clock, Truck, FileText, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import DataTable from '../components/common/DataTable.jsx';
import { orderService } from '../../services/orderService.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function Orders() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      setOrders(response.data?.orders || []);
    } catch (err) {
      error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, { status: newStatus });
      success('Order status updated successfully');
      fetchOrders();
    } catch (err) {
      error('Failed to update order status');
    }
  };

  const orderColumns = [
    { 
      key: 'orderNumber', 
      label: 'Order ID',
      render: (value) => <span className="font-mono text-sm">#{value}</span>
    },
    { 
      key: 'customer', 
      label: 'Customer',
      render: (value) => value?.fullName || 'N/A'
    },
    { 
      key: 'items', 
      label: 'Products',
      render: (value) => <span className="text-sm">{value?.length || 0} items</span>
    },
    { 
      key: 'total', 
      label: 'Total', 
      render: (value) => <span className="font-medium">₹{value?.toLocaleString('en-IN') || 0}</span>
    },
    { 
      key: 'paymentMethod', 
      label: 'Payment',
      render: (value) => value === 'razorpay' ? 'Online' : 'COD'
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value) => <StatusBadge status={value} /> 
    },
    { 
      key: 'createdAt', 
      label: 'Date',
      render: (value) => new Date(value).toLocaleDateString('en-IN')
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(`/admin/orders/${row._id}`)}
            className="rounded-full p-2 transition-colors hover:bg-amber-100" 
            style={{ color: '#6E4B2A' }} 
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <select
            value={row.status}
            onChange={(e) => handleStatusUpdate(row._id, e.target.value)}
            className="rounded-full px-2 py-1 text-xs transition-colors hover:bg-amber-100"
            style={{ color: '#6E4B2A', border: '1px solid rgba(197,155,69,0.25)' }}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )
    }
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
        <StatCard title="Total Orders" value={orders.length} icon={Package} color="amber" />
        <StatCard title="Pending" value={orders.filter(o => o.status === 'pending').length} icon={Clock} color="amber" />
        <StatCard title="Processing" value={orders.filter(o => o.status === 'processing').length} icon={Clock} color="brown" />
        <StatCard title="Delivered" value={orders.filter(o => o.status === 'delivered').length} icon={CheckCircle} color="green" />
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
