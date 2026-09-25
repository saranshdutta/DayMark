import {
  LayoutDashboard,
  Activity,
  Target,
  BarChart3,
  CalendarDays,
  Bell,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";

const navigationItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Activities", path: "/activities", icon: Activity },
  { label: "Goals", path: "/goals", icon: Target },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Calendar", path: "/calendar", icon: CalendarDays },
  { label: "Notifications", path: "/notifications", icon: Bell },
];

const secondaryItems = [
  { label: "Profile", path: "/profile", icon: User },
  { label: "Settings", path: "/settings", icon: Settings },
];

function Sidebar({ isOpen = false, onClose, onLogout, user }) {
  return (
    <aside className={["dm-sidebar", isOpen ? "is-open" : ""].filter(Boolean).join(" ")}>
      <div className="dm-sidebar-header">
        <Link to="/dashboard" className="dm-brand" onClick={onClose}>
          <div className="dm-brand-mark">D</div>
          <div className="dm-brand-text">
            <strong>DayMark</strong>
            <span>Student wellness</span>
          </div>
        </Link>
        <button
          type="button"
          className="dm-sidebar-close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="dm-sidebar-nav">
        <div className="dm-sidebar-section">
          <span className="dm-sidebar-section-title">Workspace</span>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  ["dm-sidebar-link", isActive ? "is-active" : ""].filter(Boolean).join(" ")
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="dm-sidebar-section">
          <span className="dm-sidebar-section-title">Account</span>
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  ["dm-sidebar-link", isActive ? "is-active" : ""].filter(Boolean).join(" ")
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="dm-sidebar-bottom">
        <div className="dm-sidebar-user">
          <div className="dm-sidebar-user-avatar">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="dm-sidebar-user-info">
            <strong>{user?.name || "Student"}</strong>
            <span>{user?.email || "Student Account"}</span>
          </div>
        </div>

        <button type="button" className="dm-sidebar-logout" onClick={onLogout}>
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
