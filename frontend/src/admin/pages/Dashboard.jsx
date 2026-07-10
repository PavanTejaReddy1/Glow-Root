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

const salesData = [
  { name: 'Jan', sales: 4000, revenue: 24000 },
  { name: 'Feb', sales: 3000, revenue: 13980 },
  { name: 'Mar', sales: 2000, revenue: 9800 },
  { name: 'Apr', sales: 2780, revenue: 39080 },
  { name: 'May', sales: 1890, revenue: 48000 },
  { name: 'Jun', sales: 2390, revenue: 38000 },
];

const categoryData = [
  { name: 'Serums', value: 400 },
  { name: 'Moisturizers', value: 300 },
  { name: 'Masks', value: 300 },
  { name: 'Oils', value: 200 },
  { name: 'Cleansers', value: 278 },
];

const COLORS = ['#C59B45', '#5B7F3A', '#6E4B2A', '#A8771E', '#4B2F1F'];

const recentOrders = [
  { id: 'ORD-001', customer: 'Priya Sharma', products: 'Radiance Face Serum, Hydra Glow Moisturizer', total: '₹2,198', status: 'Delivered', date: '2024-02-15' },
  { id: 'ORD-002', customer: 'Rahul Verma', products: 'Night Repair Oil', total: '₹1,199', status: 'Shipped', date: '2024-02-14' },
  { id: 'ORD-003', customer: 'Ananya Patel', products: 'Purifying Clay Mask, Gentle Cleansing Milk', total: '₹1,348', status: 'Processing', date: '2024-02-14' },
  { id: 'ORD-004', customer: 'Vikram Singh', products: 'Eye Brightening Cream, Rose Water Toner', total: '₹1,448', status: 'Pending', date: '2024-02-13' },
  { id: 'ORD-005', customer: 'Meera Krishnan', products: 'Anti-Aging Serum', total: '₹1,349', status: 'Delivered', date: '2024-02-12' },
];

const orderColumns = [
  { key: 'id', label: 'Order ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'products', label: 'Products' },
  { key: 'total', label: 'Total' },
  { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
  { key: 'date', label: 'Date' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Revenue"
          value="₹45,678"
          icon={DollarSign}
          trend="up"
          trendValue="12.5%"
          color="gold"
        />
        <StatCard
          title="Monthly Revenue"
          value="₹12,45,678"
          icon={TrendingUp}
          trend="up"
          trendValue="8.2%"
          color="amber"
        />
        <StatCard
          title="Total Orders"
          value="1,234"
          icon={ShoppingCart}
          trend="up"
          trendValue="15.3%"
          color="brown"
        />
        <StatCard
          title="Customers"
          value="456"
          icon={Users}
          trend="up"
          trendValue="5.7%"
          color="green"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Orders"
          value="23"
          icon={ShoppingCart}
          trend="down"
          trendValue="3.2%"
          color="amber"
        />
        <StatCard
          title="Delivered"
          value="1,156"
          icon={Package}
          trend="up"
          trendValue="12.1%"
          color="green"
        />
        <StatCard
          title="Cancelled"
          value="55"
          icon={TrendingDown}
          trend="down"
          trendValue="8.5%"
          color="brown"
        />
        <StatCard
          title="Low Stock"
          value="12"
          icon={AlertCircle}
          trend="up"
          trendValue="2.1%"
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
