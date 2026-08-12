import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import StatCard from '../components/common/StatCard.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../services/api.js';

export default function Analytics() {
  const { error } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRevenue: 0, totalSales: 0, totalCustomers: 0, avgOrderValue: 0 });
  const [revenueData, setRevenueData]   = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts]   = useState([]);

  const fetchAnalytics = useCallback(async () => {
    try {
      // Use shared api instance — gets auth interceptors, no localhost fallback
      const response = await api.get('/api/v1/analytics');
      const data = response.data?.data;
      if (data) {
        setStats(data.stats       || {});
        setRevenueData(data.revenueData   || []);
        setCategoryData(data.categoryData || []);
        setTopProducts(data.topProducts   || []);
      }
    } catch (err) {
      error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 60000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-[#C59B45] border-gray-200" />
      </div>
    );
  }

  const chartStyle = {
    contentStyle: {
      backgroundColor: '#F8F2E8',
      border: '1px solid rgba(197,155,69,0.25)',
      borderRadius: '12px',
      fontFamily: '"Poppins", sans-serif',
    },
  };

  const axisStyle = { fontFamily: '"Poppins", sans-serif', fill: '#6E4B2A' };

  return (
    <div className="space-y-6">
      {/* Stats — trend values computed from real API data */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`}
          icon={DollarSign}
          trend={stats.revenueTrend?.direction}
          trendValue={stats.revenueTrend?.value}
          color="gold"
        />
        <StatCard
          title="Total Sales"
          value={(stats.totalSales || 0).toLocaleString('en-IN')}
          icon={ShoppingCart}
          trend={stats.salesTrend?.direction}
          trendValue={stats.salesTrend?.value}
          color="amber"
        />
        <StatCard
          title="Customers"
          value={(stats.totalCustomers || 0).toLocaleString('en-IN')}
          icon={Users}
          trend={stats.customersTrend?.direction}
          trendValue={stats.customersTrend?.value}
          color="brown"
        />
        <StatCard
          title="Avg Order Value"
          value={`₹${(stats.avgOrderValue || 0).toLocaleString('en-IN')}`}
          icon={TrendingUp}
          trend={stats.aovTrend?.direction}
          trendValue={stats.aovTrend?.value}
          color="green"
        />
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="rounded-2xl p-6 shadow-sm"
        style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
      >
        <h3 className="mb-4 text-lg font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
          Revenue Overview
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(197,155,69,0.25)" />
            <XAxis dataKey="name" style={axisStyle} />
            <YAxis style={axisStyle} />
            <Tooltip {...chartStyle} />
            <Area type="monotone" dataKey="revenue" stroke="#C59B45" fill="#C59B45" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
        >
          <h3 className="mb-4 text-lg font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
            Category Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(197,155,69,0.25)" />
              <XAxis dataKey="name" style={axisStyle} />
              <YAxis style={axisStyle} />
              <Tooltip {...chartStyle} />
              <Bar dataKey="sales" fill="#5B7F3A" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
        >
          <h3 className="mb-4 text-lg font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
            Orders Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(197,155,69,0.25)" />
              <XAxis dataKey="name" style={axisStyle} />
              <YAxis style={axisStyle} />
              <Tooltip {...chartStyle} />
              <Line type="monotone" dataKey="orders" stroke="#C59B45" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}
        className="rounded-2xl p-6 shadow-sm"
        style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
      >
        <h3 className="mb-4 text-lg font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
          Top Selling Products
        </h3>
        {topProducts.length > 0 ? (
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product._id || index}
                className="flex items-center justify-between border-b pb-4 last:border-0"
                style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium"
                    style={{ backgroundColor: '#EFE3D1', color: '#4B2F1F' }}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#4B2F1F' }}>{product.name}</p>
                    <p className="text-sm" style={{ color: '#6E4B2A' }}>{product.totalSold || product.sales || 0} sold</p>
                  </div>
                </div>
                <p className="font-medium" style={{ color: '#4B2F1F' }}>
                  ₹{(product.revenue || 0).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center" style={{ color: '#6E4B2A', fontFamily: '"Poppins",sans-serif' }}>
            No orders yet — sales data will appear here.
          </p>
        )}
      </motion.div>
    </div>
  );
}
