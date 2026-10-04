import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Bell, Plus, Search, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { Button, IconButton } from "../common/Button";
import { ROUTES } from "../../utils/constants";

const PAGE_TITLES = {
  [ROUTES.DASHBOARD]:     { title: "Dashboard",     subtitle: "Your daily overview" },
  [ROUTES.ACTIVITIES]:    { title: "Activities",    subtitle: "Activity log" },
  [ROUTES.GOALS]:         { title: "Goals",         subtitle: "Goal tracking" },
  [ROUTES.WELLNESS]:      { title: "Wellness",      subtitle: "Mind & body" },
  [ROUTES.ANALYTICS]:     { title: "Analytics",     subtitle: "Progress insights" },
  [ROUTES.CALENDAR]:      { title: "Calendar",      subtitle: "Day-by-day view" },
  [ROUTES.FOCUS]:         { title: "Focus Mode",    subtitle: "Deep work timer" },
  [ROUTES.NOTIFICATIONS]: { title: "Notifications", subtitle: "Updates & alerts" },
  [ROUTES.PROFILE]:       { title: "Profile",       subtitle: "Account details" },
  [ROUTES.SETTINGS]:      { title: "Settings",      subtitle: "Preferences" },
};

export function Header({ onMobileOpen, onOpenAddActivity }) {
  const { user } = useAuth();
  const { unreadNotificationCount } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const pageInfo = PAGE_TITLES[location.pathname] || { title: "DayMark", subtitle: "" };

  const getInitials = (name) => {
    if (!name) return "DM";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.ACTIVITIES}?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      style={{
        height: "var(--dm-header-height)",
        backgroundColor: "var(--dm-surface)",
        borderBottom: "1px solid var(--dm-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--dm-space-6)",
        position: "sticky",
        top: 0,
        zIndex: 90,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* Left: Mobile Toggle + Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-3)" }}>
        <button
          type="button"
          onClick={onMobileOpen}
          className="dm-mobile-only"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
            background: "transparent",
            border: "none",
            color: "var(--dm-text-secondary)",
            cursor: "pointer",
            borderRadius: "var(--dm-radius-xs)",
          }}
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb */}
        <div className="dm-desktop-only" style={{ flexDirection: "column", gap: "1px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--dm-text-muted)" }}>
            <span>DayMark</span>
            <ChevronRight size={10} />
            <span style={{ color: "var(--dm-text-secondary)", fontWeight: "var(--dm-weight-medium)" }}>
              {pageInfo.title}
            </span>
          </div>
          {pageInfo.subtitle && (
            <span style={{ fontSize: "10px", color: "var(--dm-text-muted)" }}>
              {pageInfo.subtitle}
            </span>
          )}
        </div>

        {/* Mobile: Page title */}
        <span
          className="dm-mobile-only"
          style={{
            fontSize: "var(--dm-text-sm)",
            fontWeight: "var(--dm-weight-semibold)",
            color: "var(--dm-text-primary)",
          }}
        >
          {pageInfo.title}
        </span>
      </div>

      {/* Right: Search + CTA + Notifications + Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-3)" }}>
        {/* Quick Search */}
        <form onSubmit={handleSearchSubmit} className="dm-desktop-only">
          <div className="dm-input-wrapper" style={{ width: "180px" }}>
            <Search className="dm-input-icon" size={13} />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dm-input dm-input-with-icon"
              style={{
                paddingTop: "6px",
                paddingBottom: "6px",
                fontSize: "var(--dm-text-xs)",
                borderRadius: "var(--dm-radius-full)",
              }}
            />
          </div>
        </form>

        {/* Log Activity CTA */}
        {onOpenAddActivity && (
          <Button
            size="sm"
            variant="primary"
            icon={Plus}
            onClick={onOpenAddActivity}
          >
            Log Activity
          </Button>
        )}

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <IconButton
            icon={Bell}
            size="md"
            title="Notifications"
            onClick={() => navigate(ROUTES.NOTIFICATIONS)}
          />
          {unreadNotificationCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "var(--dm-danger)",
                boxShadow: "0 0 0 2px var(--dm-surface)",
              }}
            />
          )}
        </div>

        {/* User Avatar */}
        <div
          onClick={() => navigate(ROUTES.PROFILE)}
          title={user?.name || "Profile"}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "var(--dm-radius-full)",
            background: "linear-gradient(135deg, var(--dm-primary), var(--dm-accent-sage))",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: "var(--dm-weight-bold)",
            cursor: "pointer",
            boxShadow: "0 0 0 2px var(--dm-primary-border)",
          }}
        >
          {getInitials(user?.name)}
        </div>
      </div>
    </header>
  );
}

export default Header;
