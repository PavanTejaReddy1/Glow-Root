import { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

export default function AdminLayout({ children, title, subtitle }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F8F2E8' }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 transition-all duration-300 lg:ml-0">
        <Header title={title} subtitle={subtitle} setMobileOpen={setMobileOpen} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
