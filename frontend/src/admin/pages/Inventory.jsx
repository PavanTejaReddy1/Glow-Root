import { useState } from 'react';
import { motion } from 'framer-motion';
import { Warehouse, AlertTriangle, Package, TrendingUp, XCircle } from 'lucide-react';
import StatCard from '../components/common/StatCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import DataTable from '../components/common/DataTable.jsx';
import { mockProducts } from '../data/mockProducts.js';

export default function Inventory() {
  const [products, setProducts] = useState(mockProducts);

  const inventoryColumns = [
    {
      key: 'image',
      label: 'Product',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <img src={value} alt="Product" className="h-12 w-12 rounded-2xl object-cover" />
          <div>
            <p className="font-medium" style={{ color: '#4B2F1F' }}>{row.name}</p>
            <p className="text-xs" style={{ color: '#6E4B2A' }}>{row.sku}</p>
          </div>
        </div>
      )
    },
    { key: 'category', label: 'Category' },
    { key: 'stock', label: 'Stock', render: (value) => (
      <div>
        <p className={`font-medium ${value < 10 ? 'text-red-600' : value < 20 ? 'text-amber-600' : ''}`}>
          {value}
        </p>
        <p className="text-xs" style={{ color: '#6E4B2A' }}>{row.weight}</p>
      </div>
    )},
    {
      key: 'status',
      label: 'Status',
      render: (value, row) => {
        if (row.stock === 0) return <StatusBadge status="out_of_stock" />;
        if (row.stock < 10) return <StatusBadge status="low_stock" />;
        return <StatusBadge status="active" />;
      }
    },
    { key: 'price', label: 'Price', render: (value) => <span className="font-medium">₹{value}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <button
          className="rounded-full px-4 py-2 text-sm transition-all hover:shadow-lg"
          style={{
            fontFamily: '"Poppins", sans-serif',
            background: 'linear-gradient(135deg, #C59B45 0%, #A8771E 100%)',
            color: '#F8F2E8'
          }}
        >
          Update Stock
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Products" value={products.length} icon={Package} color="amber" />
        <StatCard title="Low Stock" value={products.filter(p => p.stock < 10).length} icon={AlertTriangle} color="amber" />
        <StatCard title="Out of Stock" value={products.filter(p => p.stock === 0).length} icon={XCircle} color="brown" />
        <StatCard title="Total Stock Value" value="₹45,678" icon={TrendingUp} color="green" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            Inventory
          </h2>
          <p
            className="text-sm"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
          >
            Manage product stock levels
          </p>
        </div>
      </div>

      {/* Inventory Table */}
      <DataTable columns={inventoryColumns} data={products} searchable={true} filterable={true} />
    </div>
  );
}
