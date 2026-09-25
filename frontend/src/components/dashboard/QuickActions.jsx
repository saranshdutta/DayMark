import { Plus, Target, Activity, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    title: "Log activity",
    description: "Record what you did today",
    icon: Plus,
    path: "/activities",
    variant: "primary",
  },
  {
    title: "Create goal",
    description: "Set a target for yourself",
    icon: Target,
    path: "/goals",
    variant: "secondary",
  },
  {
    title: "View activities",
    description: "Check your recent activity",
    icon: Activity,
    path: "/activities",
    variant: "secondary",
  },
  {
    title: "View analytics",
    description: "Understand your progress",
    icon: BarChart3,
    path: "/analytics",
    variant: "secondary",
  },
];

function QuickActions() {
  return (
    <div className="dm-panel dm-quick-actions">
      <div className="dm-panel-header">
        <div>
          <h3>Quick actions</h3>
          <p>Keep your day moving</p>
        </div>
      </div>

      <div className="dm-quick-actions-grid">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              to={action.path}
              className={`dm-quick-action dm-quick-action-${action.variant}`}
            >
              <div className="dm-quick-action-icon">
                <Icon size={20} />
              </div>

              <div className="dm-quick-action-content">
                <h4>{action.title}</h4>
                <p>{action.description}</p>
              </div>

              <ArrowRight size={17} className="dm-quick-action-arrow" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
