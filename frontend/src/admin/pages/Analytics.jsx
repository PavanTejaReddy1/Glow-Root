import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Users, TrendingUp, Package, Star } from 'lucide-react';
import StatCard from '../components/common/StatCard.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 24000, orders: 40 },
  { name: 'Feb', revenue: 13980, orders: 30 },
  { name: 'Mar', revenue: 9800, orders: 20 },
  { name: 'Apr', revenue: 39080, orders: 55 },
  { name: 'May', revenue: 48000, orders: 65 },
  { name: 'Jun', revenue: 38000, orders: 50 },
  { name: 'Jul', revenue: 52000, orders: 70 },
  { name: 'Aug', revenue: 45000, orders: 60 },
  { name: 'Sep', revenue: 49000, orders: 68 },
  { name: 'Oct', revenue: 55000, orders: 75 },
  { name: 'Nov', revenue: 62000, orders: 82 },
  { name: 'Dec', revenue: 68000, orders: 90 },
];

const categoryData = [
  { name: 'Serums', sales: 45000, orders: 120 },
  { name: 'Moisturizers', sales: 38000, orders: 95 },
  { name: 'Masks', sales: 25000, orders: 80 },
  { name: 'Oils', sales: 32000, orders: 70 },
  { name: 'Cleansers', sales: 28000, orders: 110 },
];

const topProducts = [
  { name: 'Radiance Face Serum', sales: 450, revenue: 584550 },
  { name: 'Anti-Aging Serum', sales: 380, revenue: 684020 },
  { name: 'Night Repair Oil', sales: 320, revenue: 479680 },
  { name: 'Hydra Glow Moisturizer', sales: 290, revenue: 260710 },
  { name: 'Purifying Clay Mask', sales: 250, revenue: 168500 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value="₹12,45,678" icon={DollarSign} trend="up" trendValue="12.5%" color="gold" />
        <StatCard title="Total Sales" value="4,567" icon={ShoppingCart} trend="up" trendValue="8.2%" color="amber" />
        <StatCard title="Customers" value="1,234" icon={Users} trend="up" trendValue="15.3%" color="brown" />
        <StatCard title="Avg Order Value" value="₹2,726" icon={TrendingUp} trend="up" trendValue="5.7%" color="green" />
      </div>

      {/* Revenue Chart */}
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
          Revenue Overview
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={revenueData}>
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
            <Area type="monotone" dataKey="revenue" stroke="#C59B45" fill="#C59B45" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Performance */}
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
            Category Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
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
              <Bar dataKey="sales" fill="#5B7F3A" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
        >
          <h3
            className="mb-4 text-lg font-semibold"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            Orders Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
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
              <Line type="monotone" dataKey="orders" stroke="#C59B45" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="rounded-2xl p-6 shadow-sm"
        style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
      >
        <h3
          className="mb-4 text-lg font-semibold"
          style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
        >
          Top Selling Products
        </h3>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-4 last:border-0"
              style={{ borderColor: 'rgba(197,155,69,0.25)' }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium"
                  style={{ backgroundColor: '#EFE3D1', color: '#4B2F1F' }}
                >
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#4B2F1F' }}>{product.name}</p>
                  <p className="text-sm" style={{ color: '#6E4B2A' }}>{product.sales} sales</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium" style={{ color: '#4B2F1F' }}>₹{product.revenue.toLocaleString()}</p>
                <p className="text-sm" style={{ color: '#6E4B2A' }}>Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
