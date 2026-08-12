import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import StatCard from '../components/common/StatCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import DataTable from '../components/common/DataTable.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { productService } from '../../services/productService.js';
import { orderService } from '../../services/orderService.js';

const COLORS = ['#C59B45', '#5B7F3A', '#6E4B2A', '#A8771E', '#4B2F1F'];

const orderColumns = [
  { key: 'orderNumber', label: 'Order ID', render: (value) => <span className="font-mono text-sm">#{value}</span> },
  { key: 'customer', label: 'Customer', render: (value) => value?.fullName || 'N/A' },
  { key: 'items', label: 'Products', render: (value) => <span className="text-sm">{value?.length || 0} items</span> },
  { key: 'total', label: 'Total', render: (value) => <span className="font-medium">₹{value?.toLocaleString('en-IN') || 0}</span> },
  { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
  { key: 'createdAt', label: 'Date', render: (value) => new Date(value).toLocaleDateString('en-IN') },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    lowStockProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch products for stats
      const productsResponse = await productService.getProducts();
      const products = productsResponse.data?.products || [];
      
      // Fetch orders for stats
      const ordersResponse = await orderService.getAllOrders();
      const orders = ordersResponse.data?.orders || [];

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const monthlyRevenue = orders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          const now = new Date();
          return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
      const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
      const lowStockProducts = products.filter(p => p.stock < 10).length;
      
      // Get unique customers
      const uniqueCustomers = new Set(orders.map(o => o.user?._id));
      const totalCustomers = uniqueCustomers.size;

      setStats({
        totalRevenue,
        monthlyRevenue,
        totalOrders,
        totalCustomers,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        lowStockProducts
      });

      // Set recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));

      // Generate sales data by month (last 6 months)
      const months = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
          name: date.toLocaleString('default', { month: 'short' }),
          sales: orders.filter(o => {
            const orderDate = new Date(o.createdAt);
            return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear();
          }).length,
          revenue: orders
            .filter(o => {
              const orderDate = new Date(o.createdAt);
              return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear();
            })
            .reduce((sum, o) => sum + (o.total || 0), 0)
        });
      }
      setSalesData(months);

      // Generate category data
      const categoryCount = {};
      products.forEach(product => {
        const category = product.category || 'Other';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
      setCategoryData(Object.entries(categoryCount).map(([name, value]) => ({ name, value })));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-amber-500 border-gray-200" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
          icon={DollarSign}
          color="gold"
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${stats.monthlyRevenue.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          color="amber"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="brown"
        />
        <StatCard
          title="Customers"
          value={stats.totalCustomers}
          icon={Users}
          color="green"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={ShoppingCart}
          color="amber"
        />
        <StatCard
          title="Delivered"
          value={stats.deliveredOrders}
          icon={Package}
          color="green"
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelledOrders}
          icon={TrendingDown}
          color="brown"
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStockProducts}
          icon={AlertCircle}
          color="amber"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
        >
          <h3
            className="mb-4 text-lg font-semibold"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            Sales Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(197,155,69,0.25)" />
              <XAxis
                dataKey="name"
                style={{ fontFamily: '"Poppins", sans-serif', fill: '#6E4B2A' }}
              />
              <YAxis style={{ fontFamily: '"Poppins", sans-serif', fill: '#6E4B2A' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#F8F2E8',
                  border: '1px solid rgba(197,155,69,0.25)',
                  borderRadius: '12px',
                  fontFamily: '"Poppins", sans-serif'
                }}
              />
              <Line type="monotone" dataKey="sales" stroke="#C59B45" strokeWidth={2} />
              <Line type="monotone" dataKey="revenue" stroke="#5B7F3A" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
        >
          <h3
            className="mb-4 text-lg font-semibold"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            Category Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#F8F2E8',
                  border: '1px solid rgba(197,155,69,0.25)',
                  borderRadius: '12px',
                  fontFamily: '"Poppins", sans-serif'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="rounded-2xl shadow-sm"
        style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
      >
        <div className="border-b px-6 py-4" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
          <h3
            className="text-lg font-semibold"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            Recent Orders
          </h3>
        </div>
        <DataTable columns={orderColumns} data={recentOrders} searchable={false} pagination={false} />
      </motion.div>
    </div>
  );
}
