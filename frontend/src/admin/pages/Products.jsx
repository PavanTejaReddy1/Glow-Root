import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, Package, CheckCircle, Star, AlertCircle } from 'lucide-react';
import StatCard from '../components/common/StatCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import DataTable from '../components/common/DataTable.jsx';
import { mockProducts } from '../data/mockProducts.js';

export default function Products() {
  const [products, setProducts] = useState(mockProducts);

  const productColumns = [
    {
      key: 'image',
      label: 'Image',
      render: (value) => (
        <img src={value} alt="Product" className="h-12 w-12 rounded-2xl object-cover" />
      )
    },
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    {
      key: 'price',
      label: 'Price',
      render: (value, row) => (
        <div>
          <p className="font-medium">₹{value}</p>
          {row.discount > 0 && <p className="text-xs">{row.discount}% off</p>}
        </div>
      )
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (value) => (
        <span className={value < 10 ? 'text-red-600 font-medium' : ''}>
          {value}
        </span>
      )
    },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    { key: 'createdAt', label: 'Created' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 transition-colors hover:bg-amber-100" style={{ color: '#6E4B2A' }}>
            <Eye className="h-4 w-4" />
          </button>
          <button className="rounded-full p-2 transition-colors hover:bg-amber-100" style={{ color: '#6E4B2A' }}>
            <Edit className="h-4 w-4" />
          </button>
          <button className="rounded-full p-2 transition-colors hover:bg-red-50" style={{ color: '#C59B45' }}>
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
        <StatCard title="Total Products" value={products.length} icon={Package} color="amber" />
        <StatCard title="Active Products" value={products.filter(p => p.status === 'active').length} icon={CheckCircle} color="green" />
        <StatCard title="Featured" value={products.filter(p => p.featured).length} icon={Star} color="gold" />
        <StatCard title="Low Stock" value={products.filter(p => p.stock < 10).length} icon={AlertCircle} color="amber" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            Products
          </h2>
          <p
            className="text-sm"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
          >
            Manage your product inventory
          </p>
        </div>
        <button
          className="flex items-center gap-2 rounded-full px-6 py-2 text-white transition-all hover:shadow-lg"
          style={{
            fontFamily: '"Poppins", sans-serif',
            background: 'linear-gradient(135deg, #C59B45 0%, #A8771E 100%)'
          }}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <DataTable columns={productColumns} data={products} searchable={true} filterable={true} />
      </div>
    </div>
  );
}
