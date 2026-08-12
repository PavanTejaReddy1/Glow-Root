import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, Package, CheckCircle, Star, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import DataTable from '../components/common/DataTable.jsx';
import { productService } from '../../services/productService.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function Products() {
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
    setLoading(true);
    try {
      const response = await productService.getAdminProducts();
      setProducts(response.data?.products || []);
    } catch (err) {
      error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productService.deleteProduct(productId);
      success('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      error('Failed to delete product');
    }
  };

  const productColumns = [
    {
      key: 'image',
      label: 'Image',
      render: (value, row) => (
        <img 
          src={row.images?.[0]?.url || value} 
          alt={row.name} 
          className="h-12 w-12 rounded-2xl object-cover" 
        />
      )
    },
    { key: 'name', label: 'Product Name' },
    { 
      key: 'category', 
      label: 'Category',
      render: (value) => value?.name || 'N/A'
    },
    {
      key: 'price',
      label: 'Price',
      render: (value, row) => (
        <div>
          <p className="font-medium">₹{value?.toLocaleString('en-IN') || 0}</p>
          {row.discountPrice && <p className="text-xs">{row.discountPrice}% off</p>}
        </div>
      )
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (value) => (
        <span className={value === 0 ? 'text-red-600 font-medium' : value <= 10 ? 'text-amber-600 font-medium' : ''}>
          {value || 0}
        </span>
      )
    },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    { 
      key: 'createdAt', 
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString('en-IN')
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(`/admin/products/${row._id}`)}
            className="rounded-full p-2 transition-colors hover:bg-amber-100" 
            style={{ color: '#6E4B2A' }}
          >
            <Eye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => navigate(`/admin/products/edit/${row._id}`)}
            className="rounded-full p-2 transition-colors hover:bg-amber-100" 
            style={{ color: '#6E4B2A' }}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(row._id)}
            className="rounded-full p-2 transition-colors hover:bg-red-50" 
            style={{ color: '#C59B45' }}
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
        <StatCard title="Total Products" value={products.length} icon={Package} color="amber" />
        <StatCard title="Active Products" value={products.filter(p => p.status === 'active').length} icon={CheckCircle} color="green" />
        <StatCard title="Featured" value={products.filter(p => p.featured).length} icon={Star} color="gold" />
        <StatCard title="Low Stock" value={products.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold || 10)).length} icon={AlertCircle} color="amber" />
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
          onClick={() => navigate('/admin/products/add')}
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
