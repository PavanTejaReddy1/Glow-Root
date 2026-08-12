import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Check, X, Trash2, Clock, CheckCircle } from 'lucide-react';
import StatCard from '../components/common/StatCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import DataTable from '../components/common/DataTable.jsx';
import { reviewService } from '../../services/reviewService.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function Reviews() {
  const { success, error } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getAllReviews();
      setReviews(response.data?.reviews || []);
    } catch (err) {
      error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      await reviewService.updateReviewStatus(reviewId, { status: 'approved' });
      success('Review approved successfully');
      fetchReviews();
    } catch (err) {
      error('Failed to approve review');
    }
  };

  const handleReject = async (reviewId) => {
    try {
      await reviewService.updateReviewStatus(reviewId, { status: 'rejected' });
      success('Review rejected successfully');
      fetchReviews();
    } catch (err) {
      error('Failed to reject review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await reviewService.deleteReview(reviewId);
      success('Review deleted successfully');
      fetchReviews();
    } catch (err) {
      error('Failed to delete review');
    }
  };

  const reviewColumns = [
    {
      key: 'user',
      label: 'Customer',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center" style={{ backgroundColor: '#F8F2E8' }}>
            <span className="text-sm font-medium" style={{ color: '#6E4B2A' }}>
              {row.user?.firstName?.[0] || row.user?.email?.[0] || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium" style={{ color: '#4B2F1F' }}>{row.user?.firstName || 'Anonymous'}</p>
            <p className="text-xs" style={{ color: '#6E4B2A' }}>{new Date(row.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'product', 
      label: 'Product',
      render: (_, row) => row.product?.name || 'N/A'
    },
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
              <button 
                onClick={() => handleApprove(row._id)}
                className="rounded-full p-2 transition-colors hover:bg-green-50" 
                style={{ color: '#5B7F3A' }} 
                title="Approve"
              >
                <Check className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleReject(row._id)}
                className="rounded-full p-2 transition-colors hover:bg-red-50" 
                style={{ color: '#C59B45' }} 
                title="Reject"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
          <button 
            onClick={() => handleDelete(row._id)}
            className="rounded-full p-2 transition-colors hover:bg-red-50" 
            style={{ color: '#C59B45' }} 
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
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
        <StatCard title="Total Reviews" value={reviews.length} icon={MessageSquare} color="amber" />
        <StatCard title="Pending" value={reviews.filter(r => r.status === 'pending').length} icon={Clock} color="amber" />
        <StatCard title="Approved" value={reviews.filter(r => r.status === 'approved').length} icon={CheckCircle} color="green" />
        <StatCard 
          title="Average Rating" 
          value={reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'} 
          icon={Star} 
          color="gold" 
        />
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
