import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Warehouse, AlertTriangle, Package, TrendingUp, XCircle, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import DataTable from '../components/common/DataTable.jsx';
import { productService } from '../../services/productService.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function Inventory() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(fetchProducts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAdminProducts();
      setProducts(response.data?.products || []);
    } catch (err) {
      error('Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = (productId) => {
    navigate(`/admin/inventory/update/${productId}`);
  };

  const lowStockProducts  = products.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold || 10));
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const totalStockValue = products.reduce((acc, p) => acc + (p.stock * p.price || 0), 0);

  const inventoryColumns = [
    {
      key: 'image',
      label: 'Product',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.images?.[0]?.url || value} 
            alt={row.name} 
            className="h-12 w-12 rounded-2xl object-cover" 
          />
          <div>
            <p className="font-medium" style={{ color: '#4B2F1F' }}>{row.name}</p>
            <p className="text-xs" style={{ color: '#6E4B2A' }}>{row.sku || 'N/A'}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'category', 
      label: 'Category',
      render: (value) => value?.name || 'N/A'
    },
    { 
      key: 'stock', 
      label: 'Stock', 
      render: (value, row) => {
        const threshold = row.lowStockThreshold || 10;
        return (
          <div>
            <p className={`font-medium ${value <= threshold && value > 0 ? 'text-amber-600' : value === 0 ? 'text-red-600' : ''}`}>
              {value || 0}
            </p>
            <p className="text-xs" style={{ color: '#6E4B2A' }}>
              {value === 0 ? 'Out of Stock' : value <= threshold ? 'Low Stock' : 'In Stock'}
            </p>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, row) => {
        const threshold = row.lowStockThreshold || 10;
        if (row.stock === 0) return <StatusBadge status="out_of_stock" />;
        if (row.stock <= threshold) return <StatusBadge status="low_stock" />;
        return <StatusBadge status="active" />;
      }
    },
    { 
      key: 'price', 
      label: 'Price', 
      render: (value) => <span className="font-medium">₹{value?.toLocaleString('en-IN') || 0}</span> 
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => handleUpdateStock(row._id)}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all hover:shadow-lg"
          style={{
            fontFamily: '"Poppins", sans-serif',
            background: 'linear-gradient(135deg, #C59B45 0%, #A8771E 100%)',
            color: '#F8F2E8'
          }}
        >
          <Edit className="h-4 w-4" />
          Update Stock
        </button>
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
        <StatCard title="Total Products" value={products.length} icon={Package} color="amber" />
        <StatCard title="Low Stock" value={lowStockProducts.length} icon={AlertTriangle} color="amber" />
        <StatCard title="Out of Stock" value={outOfStockProducts.length} icon={XCircle} color="brown" />
        <StatCard title="Total Stock Value" value={`₹${totalStockValue.toLocaleString('en-IN')}`} icon={TrendingUp} color="green" />
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
