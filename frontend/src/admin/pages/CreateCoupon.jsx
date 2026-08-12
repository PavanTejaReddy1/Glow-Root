import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { couponService } from '../../services/couponService.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function CreateCoupon() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage',
    value: '',
    minimumOrder: '',
    maximumDiscount: '',
    usageLimit: '',
    perUserLimit: 1,
    validFrom: '',
    validUntil: '',
    isActive: true,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        value: Number(formData.value),
        minimumOrder: formData.minimumOrder ? Number(formData.minimumOrder) : 0,
        maximumDiscount: formData.maximumDiscount ? Number(formData.maximumDiscount) : undefined,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
        perUserLimit: Number(formData.perUserLimit),
      };
      await couponService.createCoupon(payload);
      success('Coupon created successfully!');
      navigate('/admin/coupons');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-[#FCFAF6]";
  const inputStyle = { borderColor: 'rgba(197,155,69,0.35)', color: '#4B2F1F', fontFamily: '"Poppins", sans-serif' };
  const labelStyle = { fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/coupons')}
          className="rounded-full p-2 transition-colors hover:bg-amber-100"
          style={{ color: '#6E4B2A' }}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-2xl font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
            Create Coupon
          </h2>
          <p className="text-sm" style={labelStyle}>Add a new discount coupon</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              className="rounded-2xl p-6 shadow-sm space-y-4"
              style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
            >
              <h3 className="text-lg font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
                Coupon Details
              </h3>

              <div>
                <label className="mb-1 block text-sm font-medium" style={labelStyle}>Coupon Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                  placeholder="e.g. SAVE20"
                  required
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" style={labelStyle}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  placeholder="Brief description of the coupon"
                  className="w-full rounded-2xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-[#FCFAF6]"
                  style={inputStyle}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium" style={labelStyle}>Discount Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium" style={labelStyle}>
                    Value * {formData.type === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={formData.type === 'percentage' ? 100 : undefined}
                    value={formData.value}
                    onChange={(e) => handleChange('value', e.target.value)}
                    required
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium" style={labelStyle}>Min Order (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minimumOrder}
                    onChange={(e) => handleChange('minimumOrder', e.target.value)}
                    placeholder="0"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                {formData.type === 'percentage' && (
                  <div>
                    <label className="mb-1 block text-sm font-medium" style={labelStyle}>Max Discount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.maximumDiscount}
                      onChange={(e) => handleChange('maximumDiscount', e.target.value)}
                      placeholder="No limit"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
              className="rounded-2xl p-6 shadow-sm space-y-4"
              style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
            >
              <h3 className="text-lg font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
                Validity & Limits
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium" style={labelStyle}>Valid From *</label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => handleChange('validFrom', e.target.value)}
                    required
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium" style={labelStyle}>Valid Until *</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => handleChange('validUntil', e.target.value)}
                    required
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium" style={labelStyle}>Total Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => handleChange('usageLimit', e.target.value)}
                    placeholder="Unlimited"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium" style={labelStyle}>Per User Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.perUserLimit}
                    onChange={(e) => handleChange('perUserLimit', e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="h-4 w-4 rounded"
                  style={{ accentColor: '#C59B45' }}
                />
                <span className="text-sm font-medium" style={labelStyle}>Active immediately</span>
              </label>
            </motion.div>

            {/* Preview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}
              className="rounded-2xl p-6 shadow-sm"
              style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
            >
              <h3 className="mb-4 text-lg font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
                Preview
              </h3>
              <div
                className="rounded-xl p-4 flex items-center gap-4"
                style={{ background: 'linear-gradient(135deg, #C59B45 0%, #A8771E 100%)' }}
              >
                <Ticket className="h-10 w-10 text-white flex-shrink-0" />
                <div>
                  <p className="text-xl font-bold text-white font-mono">{formData.code || 'COUPONCODE'}</p>
                  <p className="text-sm text-white/80">
                    {formData.value
                      ? formData.type === 'percentage'
                        ? `${formData.value}% off`
                        : `₹${formData.value} off`
                      : 'Enter value above'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/coupons')}
            className="rounded-full px-6 py-2 text-sm font-medium transition-colors hover:bg-amber-50"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A', border: '1px solid rgba(197,155,69,0.35)' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-full px-6 py-2 text-white text-sm font-medium transition-all hover:shadow-lg disabled:opacity-50"
            style={{ fontFamily: '"Poppins", sans-serif', background: 'linear-gradient(135deg, #C59B45 0%, #A8771E 100%)' }}
          >
            {loading ? (
              <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Saving...</>
            ) : (
              <><Save className="h-4 w-4" /> Create Coupon</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
