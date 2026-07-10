import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Check, X, Trash2, Clock, CheckCircle } from 'lucide-react';
import StatCard from '../components/common/StatCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import DataTable from '../components/common/DataTable.jsx';
import { mockReviews } from '../data/mockReviews.js';

export default function Reviews() {
  const [reviews, setReviews] = useState(mockReviews);

  const reviewColumns = [
    {
      key: 'avatar',
      label: 'Customer',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <img src={value} alt="Customer" className="h-10 w-10 rounded-full object-cover" />
          <div>
            <p className="font-medium" style={{ color: '#4B2F1F' }}>{row.customer}</p>
            <p className="text-xs" style={{ color: '#6E4B2A' }}>{row.date}</p>
          </div>
        </div>
      )
    },
    { key: 'product', label: 'Product' },
    {
      key: 'rating',
      label: 'Rating',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4" style={{ fill: '#C59B45', color: '#C59B45' }} />
          <span className="font-medium">{value}/5</span>
        </div>
      )
    },
    { key: 'title', label: 'Title' },
    { key: 'comment', label: 'Comment', render: (value) => <span className="max-w-xs truncate">{value}</span> },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {row.status === 'pending' && (
            <>
              <button className="rounded-full p-2 transition-colors hover:bg-green-50" style={{ color: '#5B7F3A' }} title="Approve">
                <Check className="h-4 w-4" />
              </button>
              <button className="rounded-full p-2 transition-colors hover:bg-red-50" style={{ color: '#C59B45' }} title="Reject">
                <X className="h-4 w-4" />
              </button>
            </>
          )}
          <button className="rounded-full p-2 transition-colors hover:bg-red-50" style={{ color: '#C59B45' }} title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Reviews" value={reviews.length} icon={MessageSquare} color="amber" />
        <StatCard title="Pending" value={reviews.filter(r => r.status === 'pending').length} icon={Clock} color="amber" />
        <StatCard title="Approved" value={reviews.filter(r => r.status === 'approved').length} icon={CheckCircle} color="green" />
        <StatCard title="Average Rating" value="4.5" icon={Star} color="gold" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            Reviews
          </h2>
          <p
            className="text-sm"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
          >
            Manage customer reviews
          </p>
        </div>
      </div>

      {/* Reviews Table */}
      <DataTable columns={reviewColumns} data={reviews} searchable={true} filterable={true} />
    </div>
  );
}
