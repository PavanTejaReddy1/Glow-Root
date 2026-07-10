import { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Globe, Phone, Mail, Link, Truck, Percent, Palette, Save } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    storeName: 'GlowRoot',
    storeEmail: 'support@glowroot.com',
    storePhone: '+91 98765 43210',
    storeAddress: '123, Green Street, Mumbai, Maharashtra - 400001',
    facebookUrl: 'https://facebook.com/glowroot',
    instagramUrl: 'https://instagram.com/glowroot',
    twitterUrl: 'https://twitter.com/glowroot',
    shippingCharge: 99,
    freeShippingAbove: 999,
    taxRate: 18,
    currency: 'INR',
    theme: 'light'
  });

  const handleSave = () => {
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-2xl font-semibold"
          style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
        >
          Settings
        </h2>
        <p
          className="text-sm"
          style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
        >
          Manage your store configuration
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Store Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Store className="h-5 w-5" style={{ color: '#C59B45' }} />
            <h3
              className="text-lg font-semibold"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
            >
              Store Information
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label
                className="mb-2 block text-sm font-medium"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
              >
                Store Name
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  borderColor: 'rgba(197,155,69,0.25)',
                  color: '#4B2F1F',
                  backgroundColor: '#FCFAF6'
                }}
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-medium"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
              >
                Email
              </label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                className="w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  borderColor: 'rgba(197,155,69,0.25)',
                  color: '#4B2F1F',
                  backgroundColor: '#FCFAF6'
                }}
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-medium"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
              >
                Phone
              </label>
              <input
                type="tel"
                value={settings.storePhone}
                onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                className="w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  borderColor: 'rgba(197,155,69,0.25)',
                  color: '#4B2F1F',
                  backgroundColor: '#FCFAF6'
                }}
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-medium"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
              >
                Address
              </label>
              <textarea
                value={settings.storeAddress}
                onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                rows={3}
                className="w-full rounded-2xl border px-4 py-2 focus:outline-none focus:ring-2"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  borderColor: 'rgba(197,155,69,0.25)',
                  color: '#4B2F1F',
                  backgroundColor: '#FCFAF6'
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Link className="h-5 w-5" style={{ color: '#C59B45' }} />
            <h3
              className="text-lg font-semibold"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
            >
              Social Links
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label
                className="mb-2 block text-sm font-medium"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
              >
                Facebook
              </label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  borderColor: 'rgba(197,155,69,0.25)',
                  color: '#4B2F1F',
                  backgroundColor: '#FCFAF6'
                }}
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-medium"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
              >
                Instagram
              </label>
              <input
                type="url"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  borderColor: 'rgba(197,155,69,0.25)',
                  color: '#4B2F1F',
                  backgroundColor: '#FCFAF6'
                }}
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-medium"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
              >
                Twitter
              </label>
              <input
                type="url"
                value={settings.twitterUrl}
                onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                className="w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  borderColor: 'rgba(197,155,69,0.25)',
                  color: '#4B2F1F',
                  backgroundColor: '#FCFAF6'
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Shipping & Tax */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5" style={{ color: '#C59B45' }} />
            <h3
              className="text-lg font-semibold"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
            >
              Shipping & Tax
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label
                className="mb-2 block text-sm font-medium"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
              >
                Shipping Charge (₹)
              </label>
              <input
                type="number"
                value={settings.shippingCharge}
                onChange={(e) => setSettings({ ...settings, shippingCharge: Number(e.target.value) })}
                className="w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  borderColor: 'rgba(197,155,69,0.25)',
                  color: '#4B2F1F',
                  backgroundColor: '#FCFAF6'
                }}
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-medium"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
              >
                Free Shipping Above (₹)
              </label>
              <input
                type="number"
                value={settings.freeShippingAbove}
                onChange={(e) => setSettings({ ...settings, freeShippingAbove: Number(e.target.value) })}
                className="w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  borderColor: 'rgba(197,155,69,0.25)',
                  color: '#4B2F1F',
                  backgroundColor: '#FCFAF6'
                }}
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-medium"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
              >
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                className="w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  borderColor: 'rgba(197,155,69,0.25)',
                  color: '#4B2F1F',
                  backgroundColor: '#FCFAF6'
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5" style={{ color: '#C59B45' }} />
            <h3
              className="text-lg font-semibold"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
            >
              Theme
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label
                className="mb-2 block text-sm font-medium"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
              >
                Theme Mode
              </label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                className="w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  borderColor: 'rgba(197,155,69,0.25)',
                  color: '#4B2F1F',
                  backgroundColor: '#FCFAF6'
                }}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-full px-6 py-3 text-white transition-all hover:shadow-lg"
          style={{
            fontFamily: '"Poppins", sans-serif',
            background: 'linear-gradient(135deg, #C59B45 0%, #A8771E 100%)'
          }}
        >
          <Save className="h-4 w-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
