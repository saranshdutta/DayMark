import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ActivityFormModal from "../activities/ActivityFormModal";
import { ToastContainer } from "../common/Toast";
import { useApp } from "../../context/AppContext";

export function MainLayout() {
  const { toasts, removeToast } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <div className="dm-app-shell">
      {/* Desktop & Mobile Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Main Content Area */}
      <div className="dm-main-content">
        <Header
          onMobileOpen={() => setMobileOpen(true)}
          onOpenAddActivity={() => setAddModalOpen(true)}
        />

        <main className="dm-page-container">
          <Outlet />
        </main>
      </div>

      {/* Global Activity Creator Modal */}
      <ActivityFormModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      {/* Floating Toast Notification Stack */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default MainLayout;
