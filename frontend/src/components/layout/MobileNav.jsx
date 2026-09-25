import {
  LayoutDashboard,
  Activity,
  Target,
  BarChart3,
  CalendarDays,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  {
    label: "Home",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Activities",
    path: "/activities",
    icon: Activity,
  },
  {
    label: "Goals",
    path: "/goals",
    icon: Target,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Calendar",
    path: "/calendar",
    icon: CalendarDays,
  },
];

function MobileNav() {
  return (
    <nav className="dm-mobile-nav">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              ["dm-mobile-nav-item", isActive ? "is-active" : ""]
                .filter(Boolean)
                .join(" ")
            }
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default MobileNav;
