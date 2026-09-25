import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";

function MainLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    setSidebarOpen(false);
    logout();
  };

  return (
    <div className="dm-app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        user={user}
      />

      {sidebarOpen && (
        <button
          type="button"
          className="dm-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <div className="dm-main-wrapper">
        <Header user={user} onMenuClick={() => setSidebarOpen(true)} />

        <main className="dm-main-content">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  );
}

export default MainLayout;
