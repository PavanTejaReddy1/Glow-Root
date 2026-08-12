import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Package } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../services/productService.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function UpdateStock() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [stock, setStock] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setFetchLoading(true);
    try {
      const response = await productService.getProductById(id);
      const productData = response.data?.product;
      
      if (productData) {
        setProduct(productData);
        setStock(productData.stock || 0);
      }
    } catch (err) {
      error('Failed to fetch product');
      navigate('/admin/inventory');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('stock', stock);

      await productService.updateProduct(id, formData);
      success('Stock updated successfully!');
      navigate('/admin/inventory');
    } catch (err) {
      console.error('Error updating stock:', err);
      error(err.response?.data?.message || 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-amber-500 border-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/inventory')}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Update Stock</h2>
            <p className="text-slate-500">Update inventory for {product?.name}</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl rounded-xl border bg-white p-6 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Info */}
          <div className="flex items-center gap-4 pb-6 border-b">
            <Package className="h-12 w-12 text-amber-500" />
            <div>
              <h3 className="font-semibold text-slate-900">{product?.name}</h3>
              <p className="text-sm text-slate-500">SKU: {product?.sku || 'N/A'}</p>
              <p className="text-sm text-slate-500">Current Stock: {product?.stock || 0}</p>
            </div>
          </div>

          {/* Stock Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              New Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <p className="mt-2 text-sm text-slate-500">
              {stock === 0 ? (
                <span className="text-red-600">Product will be marked as out of stock</span>
              ) : stock < 10 ? (
                <span className="text-amber-600">Low stock warning will be displayed</span>
              ) : (
                <span className="text-green-600">Stock level is healthy</span>
              )}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStock(stock + 1)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              +1
            </button>
            <button
              type="button"
              onClick={() => setStock(stock + 10)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              +10
            </button>
            <button
              type="button"
              onClick={() => setStock(stock + 50)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              +50
            </button>
            <button
              type="button"
              onClick={() => setStock(stock + 100)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              +100
            </button>
            <button
              type="button"
              onClick={() => setStock(0)}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Set to 0
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/inventory')}
              className="rounded-lg px-6 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2 text-white hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Stock
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
