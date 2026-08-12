import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useSearchParams } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import { orderService } from '../services/orderService.js';
import { authService } from '../services/authService.js';
import { useToast } from '../context/ToastContext.jsx';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const { success: toastSuccess, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [addressData, setAddressData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  useEffect(() => {
    document.title = 'My Profile — GlowRoot';
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getUserOrders();
      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toastSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toastError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toastError('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toastError('New password must be at least 8 characters');
      return;
    }
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toastSuccess('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password change error:', error);
      toastError(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const currentAddresses = user?.addresses || [];
      await updateProfile({
        addresses: [
          ...currentAddresses,
          { ...addressData }
        ]
      });
      toastSuccess('Address added successfully');
      setAddressData({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
    } catch (error) {
      console.error('Add address error:', error);
      toastError(error.response?.data?.message || 'Failed to add address');
    }
  };

  return (
    <ProtectedRoute>
      <div className="py-16 md:py-24" style={{ backgroundColor: '#F8F2E8' }}>
        <div className="mx-auto max-w-content px-4">
          <h1
            className="mb-8 text-3xl font-medium md:text-4xl"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            My Profile
          </h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="space-y-2">
              {[
                { id: 'profile', label: 'Profile Information' },
                { id: 'orders', label: 'Order History' },
                { id: 'wishlist', label: 'Wishlist' },
                { id: 'addresses', label: 'Saved Addresses' },
                { id: 'security', label: 'Security' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full rounded px-4 py-3 text-left text-sm transition-colors ${
                    activeTab === tab.id ? 'text-white' : ''
                  }`}
                  style={{
                    fontFamily: '"Poppins", sans-serif',
                    backgroundColor: activeTab === tab.id ? '#6E4B2A' : 'transparent',
                    color: activeTab === tab.id ? '#F8F2E8' : '#4B2F1F'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && (
                <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: '#FCFAF6' }}>
                  <h2
                    className="mb-6 text-xl font-medium"
                    style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
                  >
                    Profile Information
                  </h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full rounded border px-4 py-2 outline-none focus:border-[#C59B45]"
                          style={{ borderColor: 'rgba(197,155,69,0.25)', fontFamily: '"Poppins", sans-serif' }}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full rounded border px-4 py-2 outline-none focus:border-[#C59B45]"
                          style={{ borderColor: 'rgba(197,155,69,0.25)', fontFamily: '"Poppins", sans-serif' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full rounded border px-4 py-2 bg-gray-100 outline-none"
                        style={{ borderColor: 'rgba(197,155,69,0.25)', fontFamily: '"Poppins", sans-serif' }}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded border px-4 py-2 outline-none focus:border-[#C59B45]"
                        style={{ borderColor: 'rgba(197,155,69,0.25)', fontFamily: '"Poppins", sans-serif' }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-full px-8 py-3 text-sm font-medium tracking-wider uppercase transition-colors hover:opacity-90"
                      style={{
                        fontFamily: '"Poppins", sans-serif',
                        backgroundColor: '#6E4B2A',
                        color: '#F8F2E8'
                      }}
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: '#FCFAF6' }}>
                  <h2
                    className="mb-6 text-xl font-medium"
                    style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
                  >
                    Order History
                  </h2>
                  {loading ? (
                    <div className="h-64 animate-pulse rounded bg-gray-200" />
                  ) : orders.length === 0 ? (
                    <p style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                      No orders yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="flex items-center justify-between rounded border p-4"
                          style={{ borderColor: 'rgba(197,155,69,0.25)' }}
                        >
                          <div>
                            <p
                              className="font-medium"
                              style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}
                            >
                              Order #{order.orderNumber}
                            </p>
                            <p
                              className="text-sm"
                              style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
                            >
                              {new Date(order.createdAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className="font-medium"
                              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#C59B45' }}
                            >
                              ₹{order.total?.toLocaleString('en-IN')}
                            </p>
                            <p
                              className="text-sm"
                              style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
                            >
                              {order.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: '#FCFAF6' }}>
                  <h2
                    className="mb-6 text-xl font-medium"
                    style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
                  >
                    My Wishlist
                  </h2>
                  <p style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A', marginBottom: '1rem' }}>
                    View your wishlist on the dedicated wishlist page.
                  </p>
                  <Link
                    to="/wishlist"
                    className="inline-block rounded-full px-6 py-2 text-sm font-medium tracking-wider uppercase transition-colors hover:opacity-90"
                    style={{
                      fontFamily: '"Poppins", sans-serif',
                      backgroundColor: '#6E4B2A',
                      color: '#F8F2E8'
                    }}
                  >
                    Go to Wishlist
                  </Link>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: '#FCFAF6' }}>
                  <h2
                    className="mb-6 text-xl font-medium"
                    style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
                  >
                    Saved Addresses
                  </h2>
                  <form onSubmit={handleAddAddress} className="mb-6 space-y-4">
                    <div>
                      <label className="mb-1 block text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={addressData.fullName}
                        onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })}
                        className="w-full rounded border px-4 py-2 outline-none focus:border-[#C59B45]"
                        style={{ borderColor: 'rgba(197,155,69,0.25)', fontFamily: '"Poppins", sans-serif' }}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        required
                        value={addressData.phone}
                        onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                        className="w-full rounded border px-4 py-2 outline-none focus:border-[#C59B45]"
                        style={{ borderColor: 'rgba(197,155,69,0.25)', fontFamily: '"Poppins", sans-serif' }}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        required
                        value={addressData.addressLine1}
                        onChange={(e) => setAddressData({ ...addressData, addressLine1: e.target.value })}
                        className="w-full rounded border px-4 py-2 outline-none focus:border-[#C59B45]"
                        style={{ borderColor: 'rgba(197,155,69,0.25)', fontFamily: '"Poppins", sans-serif' }}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={addressData.city}
                        onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                        className="w-full rounded border px-4 py-2 outline-none focus:border-[#C59B45]"
                        style={{ borderColor: 'rgba(197,155,69,0.25)', fontFamily: '"Poppins", sans-serif' }}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                          State
                        </label>
                        <input
                          type="text"
                          required
                          value={addressData.state}
                          onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                          className="w-full rounded border px-4 py-2 outline-none focus:border-[#C59B45]"
                          style={{ borderColor: 'rgba(197,155,69,0.25)', fontFamily: '"Poppins", sans-serif' }}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                          Pincode
                        </label>
                        <input
                          type="text"
                          required
                          value={addressData.pincode}
                          onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                          className="w-full rounded border px-4 py-2 outline-none focus:border-[#C59B45]"
                          style={{ borderColor: 'rgba(197,155,69,0.25)', fontFamily: '"Poppins", sans-serif' }}
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addressData.isDefault}
                        onChange={(e) => setAddressData({ ...addressData, isDefault: e.target.checked })}
                        className="h-4 w-4"
                        style={{ accentColor: '#C59B45' }}
                      />
                      <span className="text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                        Set as default address
                      </span>
                    </label>
                    <button
                      type="submit"
                      className="rounded-full px-8 py-3 text-sm font-medium tracking-wider uppercase transition-colors hover:opacity-90"
                      style={{
                        fontFamily: '"Poppins", sans-serif',
                        backgroundColor: '#6E4B2A',
                        color: '#F8F2E8'
                      }}
                    >
                      Add Address
                    </button>
                  </form>

                  <div className="space-y-4">
                    {user?.addresses?.map((address, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between rounded border p-4"
                        style={{ borderColor: 'rgba(197,155,69,0.25)' }}
                      >
                        <div>
                          <p
                            className="font-medium"
                            style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}
                          >
                            {address.fullName}
                          </p>
                          <p
                            className="text-sm"
                            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
                          >
                            {address.addressLine1}, {address.city}, {address.state} - {address.pincode}
                          </p>
                          {address.isDefault && (
                            <span
                              className="mt-2 inline-block rounded-full px-3 py-1 text-xs"
                              style={{
                                fontFamily: '"Poppins", sans-serif',
                                backgroundColor: '#C59B45',
                                color: '#F8F2E8'
                              }}
                            >
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: '#FCFAF6' }}>
                  <h2
                    className="mb-6 text-xl font-medium"
                    style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
                  >
                    Change Password
                  </h2>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full rounded border px-4 py-2 outline-none focus:border-[#C59B45]"
                        style={{ borderColor: 'rgba(197,155,69,0.25)', fontFamily: '"Poppins", sans-serif' }}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full rounded border px-4 py-2 outline-none focus:border-[#C59B45]"
                        style={{ borderColor: 'rgba(197,155,69,0.25)', fontFamily: '"Poppins", sans-serif' }}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm" style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full rounded border px-4 py-2 outline-none focus:border-[#C59B45]"
                        style={{ borderColor: 'rgba(197,155,69,0.25)', fontFamily: '"Poppins", sans-serif' }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-full px-8 py-3 text-sm font-medium tracking-wider uppercase transition-colors hover:opacity-90"
                      style={{
                        fontFamily: '"Poppins", sans-serif',
                        backgroundColor: '#6E4B2A',
                        color: '#F8F2E8'
                      }}
                    >
                      Change Password
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
