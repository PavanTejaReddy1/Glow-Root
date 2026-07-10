import { Bell, Search, User, ChevronDown, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header({ title, subtitle, setMobileOpen }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-30 shadow-sm"
      style={{ backgroundColor: '#F8F2E8', borderBottom: '1px solid rgba(197,155,69,0.25)' }}
    >
      <div className="flex h-16 items-center justify-between px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden rounded-full p-2 transition-colors hover:bg-amber-100"
          style={{ color: '#6E4B2A' }}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Breadcrumb / Title */}
        <div className="flex-1 lg:flex-none">
          <h1
            className="text-xl font-semibold"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="text-sm"
              style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="rounded-full p-2 transition-colors hover:bg-amber-100"
              style={{ color: '#6E4B2A' }}
            >
              <Search className="h-5 w-5" />
            </button>
            {searchOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-72 rounded-xl shadow-lg p-2"
                style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
              >
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-2"
                  style={{
                    fontFamily: '"Poppins", sans-serif',
                    borderColor: 'rgba(197,155,69,0.25)',
                    color: '#4B2F1F',
                    backgroundColor: '#FCFAF6'
                  }}
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative rounded-full p-2 transition-colors hover:bg-amber-100"
              style={{ color: '#6E4B2A' }}
            >
              <Bell className="h-5 w-5" />
              <span
                className="absolute right-1 top-1 flex h-2 w-2 items-center justify-center rounded-full"
                style={{ backgroundColor: '#C59B45' }}
              />
            </button>
            {notificationsOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-lg"
                style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
              >
                <div className="border-b px-4 py-3" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
                  <h3
                    className="font-semibold"
                    style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}
                  >
                    Notifications
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-amber-50 cursor-pointer transition-colors">
                    <p
                      className="text-sm"
                      style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}
                    >
                      New order received
                    </p>
                    <p
                      className="text-xs"
                      style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
                    >
                      2 minutes ago
                    </p>
                  </div>
                  <div className="px-4 py-3 hover:bg-amber-50 cursor-pointer transition-colors">
                    <p
                      className="text-sm"
                      style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}
                    >
                      Low stock alert
                    </p>
                    <p
                      className="text-xs"
                      style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
                    >
                      1 hour ago
                    </p>
                  </div>
                  <div className="px-4 py-3 hover:bg-amber-50 cursor-pointer transition-colors">
                    <p
                      className="text-sm"
                      style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}
                    >
                      New customer registered
                    </p>
                    <p
                      className="text-xs"
                      style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
                    >
                      3 hours ago
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-full p-1 hover:bg-amber-100 transition-colors"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium"
                style={{ backgroundColor: '#C59B45', color: '#F8F2E8' }}
              >
                A
              </div>
              <ChevronDown className="h-4 w-4" style={{ color: '#6E4B2A' }} />
            </button>
            {profileOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-lg"
                style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
              >
                <div className="border-b px-4 py-3" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
                  <p
                    className="text-sm font-medium"
                    style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}
                  >
                    Admin User
                  </p>
                  <p
                    className="text-xs"
                    style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
                  >
                    admin@glowroot.com
                  </p>
                </div>
                <div className="py-2">
                  <button
                    className="block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-amber-50"
                    style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}
                  >
                    Profile
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-amber-50"
                    style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}
                  >
                    Settings
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-amber-50"
                    style={{ fontFamily: '"Poppins", sans-serif', color: '#C59B45' }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
