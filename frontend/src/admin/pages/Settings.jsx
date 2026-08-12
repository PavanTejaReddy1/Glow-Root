import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, Link, Truck, Palette, Save, Loader } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';
import { settingsService } from '../../services/settingsService.js';

const inputStyle = {
  fontFamily: '"Poppins", sans-serif',
  borderColor: 'rgba(197,155,69,0.25)',
  color: '#4B2F1F',
  backgroundColor: '#FCFAF6',
};

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium"
        style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function Settings() {
  const { success, error } = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    settingsService.getAdminSettings()
      .then(s => setSettings(s))
      .catch(() => error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const set = (field, value) => setSettings(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const saved = await settingsService.updateSettings(settings);
      setSettings(saved);
      success('Settings saved successfully!');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-[#C59B45] border-gray-200" />
      </div>
    );
  }

  const cls = "w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
          Settings
        </h2>
        <p className="text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
          Manage your store configuration — changes are saved to the database
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Store Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}>
          <div className="mb-4 flex items-center gap-2">
            <Store className="h-5 w-5" style={{ color: '#C59B45' }} />
            <h3 className="text-lg font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
              Store Information
            </h3>
          </div>
          <div className="space-y-4">
            <Field label="Store Name">
              <input type="text" value={settings?.storeName || ''} onChange={e => set('storeName', e.target.value)} className={cls} style={inputStyle} />
            </Field>
            <Field label="Support Email">
              <input type="email" value={settings?.storeEmail || ''} onChange={e => set('storeEmail', e.target.value)} className={cls} style={inputStyle} />
            </Field>
            <Field label="Phone">
              <input type="tel" value={settings?.storePhone || ''} onChange={e => set('storePhone', e.target.value)} className={cls} style={inputStyle} />
            </Field>
            <Field label="Address">
              <textarea value={settings?.storeAddress || ''} onChange={e => set('storeAddress', e.target.value)} rows={3}
                className="w-full rounded-2xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
                style={inputStyle} />
            </Field>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}>
          <div className="mb-4 flex items-center gap-2">
            <Link className="h-5 w-5" style={{ color: '#C59B45' }} />
            <h3 className="text-lg font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
              Social Links
            </h3>
          </div>
          <div className="space-y-4">
            <Field label="Instagram"><input type="url" value={settings?.instagramUrl || ''} onChange={e => set('instagramUrl', e.target.value)} className={cls} style={inputStyle} placeholder="https://instagram.com/..." /></Field>
            <Field label="Facebook"><input type="url" value={settings?.facebookUrl || ''} onChange={e => set('facebookUrl', e.target.value)} className={cls} style={inputStyle} placeholder="https://facebook.com/..." /></Field>
            <Field label="Pinterest"><input type="url" value={settings?.pinterestUrl || ''} onChange={e => set('pinterestUrl', e.target.value)} className={cls} style={inputStyle} placeholder="https://pinterest.com/..." /></Field>
            <Field label="Twitter / X"><input type="url" value={settings?.twitterUrl || ''} onChange={e => set('twitterUrl', e.target.value)} className={cls} style={inputStyle} placeholder="https://twitter.com/..." /></Field>
          </div>
        </motion.div>

        {/* Shipping & Tax */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}>
          <div className="mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5" style={{ color: '#C59B45' }} />
            <h3 className="text-lg font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
              Shipping &amp; Tax
            </h3>
          </div>
          <div className="space-y-4">
            <Field label="Shipping Charge (₹)">
              <input type="number" min="0" value={settings?.shippingCharge ?? 99} onChange={e => set('shippingCharge', Number(e.target.value))} className={cls} style={inputStyle} />
            </Field>
            <Field label="Free Shipping Above (₹)">
              <input type="number" min="0" value={settings?.freeShippingAbove ?? 1999} onChange={e => set('freeShippingAbove', Number(e.target.value))} className={cls} style={inputStyle} />
            </Field>
            <Field label="Tax Rate (%)">
              <input type="number" min="0" max="100" value={settings?.taxRate ?? 18} onChange={e => set('taxRate', Number(e.target.value))} className={cls} style={inputStyle} />
            </Field>
            <Field label="Low Stock Alert Threshold">
              <input type="number" min="1" value={settings?.lowStockThreshold ?? 10} onChange={e => set('lowStockThreshold', Number(e.target.value))} className={cls} style={inputStyle} />
            </Field>
          </div>
        </motion.div>

        {/* Announcement & Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}
          className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}>
          <div className="mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5" style={{ color: '#C59B45' }} />
            <h3 className="text-lg font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}>
              Storefront Copy
            </h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={settings?.announcementEnabled ?? true}
                onChange={e => set('announcementEnabled', e.target.checked)}
                className="h-4 w-4 rounded" style={{ accentColor: '#C59B45' }} />
              <span className="text-sm font-medium" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                Show announcement bar
              </span>
            </label>
            <Field label="Announcement Text">
              <input type="text" value={settings?.announcementText || ''} onChange={e => set('announcementText', e.target.value)}
                className={cls} style={inputStyle}
                placeholder="Free shipping on orders above ₹{freeShippingAbove}" />
            </Field>
            <Field label="Hero Tagline">
              <textarea
                value={settings?.heroTagline || ''}
                onChange={e => set('heroTagline', e.target.value)}
                rows={2}
                className="w-full rounded-2xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
                style={inputStyle}
                placeholder="Rooted in Nature. Crafted for You."
              />
              <p className="mt-1 text-[11px]" style={{ color: '#9CA3AF', fontFamily: '"Poppins",sans-serif' }}>
                Leave blank to use the default two-line heading
              </p>
            </Field>
            <Field label="Footer Tagline">
              <textarea value={settings?.footerTagline || ''} onChange={e => set('footerTagline', e.target.value)} rows={2}
                className="w-full rounded-2xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
                style={inputStyle} />
            </Field>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-full px-6 py-3 text-white transition-all hover:shadow-lg disabled:opacity-60"
          style={{ fontFamily: '"Poppins", sans-serif', background: 'linear-gradient(135deg, #C59B45 0%, #A8771E 100%)' }}
        >
          {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
