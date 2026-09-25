import { Bell, Search, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Header({ onMenuClick }) {
  const location = useLocation();

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/activities": "Activities",
    "/goals": "Goals",
    "/analytics": "Analytics",
    "/calendar": "Calendar",
    "/notifications": "Notifications",
    "/profile": "Profile",
    "/settings": "Settings",
  };

  const currentTitle = pageTitles[location.pathname] || "DayMark";

  return (
    <header className="dm-header">
      <div className="dm-header-left">
        <button
          type="button"
          className="dm-mobile-menu-btn"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
        <div className="dm-header-page">
          <h2>{currentTitle}</h2>
        </div>
      </div>

      <div className="dm-header-right">
        <div className="dm-header-search">
          <Search size={16} />
          <input type="search" placeholder="Search..." aria-label="Search" />
        </div>

        <Link
          to="/notifications"
          className="dm-header-btn"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="dm-notification-dot" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
