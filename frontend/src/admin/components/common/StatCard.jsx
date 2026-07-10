import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'amber'
}) {
  const colorClasses = {
    amber: 'from-amber-400 to-amber-600',
    green: 'from-green-400 to-green-600',
    brown: 'from-amber-700 to-amber-900',
    gold: 'from-yellow-400 to-yellow-600'
  };

  const isPositive = trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
      style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className="text-sm font-medium"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
          >
            {title}
          </p>
          <h3
            className="mt-2 text-3xl font-bold"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            {value}
          </h3>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {trendValue}
              </span>
              <span
                className="text-xs"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
              >
                vs last month
              </span>
            </div>
          )}
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${colorClasses[color]}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
