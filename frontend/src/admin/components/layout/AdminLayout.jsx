import { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

export default function AdminLayout({ children, title, subtitle }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F8F2E8' }}>
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 z-30 h-screen">
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      </div>

      {/* Main — margin transition is GPU-composited via CSS var */}
      <div
        className="flex min-h-screen flex-1 flex-col"
        style={{
          marginLeft: sidebarCollapsed ? '80px' : '256px',
          transition: 'margin-left 0.25s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <Header title={title} subtitle={subtitle} setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
