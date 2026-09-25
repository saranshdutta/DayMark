import {
  Activity,
  Footprints,
  Dumbbell,
  BookOpen,
  Droplets,
  Moon,
  ArrowRight,
  Clock3,
} from "lucide-react";
import { Link } from "react-router-dom";

const iconMap = {
  PHYSICAL: Dumbbell,
  ACADEMIC: BookOpen,
  LIFESTYLE: Moon,
  CUSTOM: Activity,
  steps: Footprints,
  exercise: Dumbbell,
  reading: BookOpen,
  water: Droplets,
  sleep: Moon,
};

function formatRelativeTime(dateStr) {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD === 1) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Receives ActivityLog records from backend: { id, activity: { name, category, unit }, value, duration, loggedAt }
function RecentActivities({ activities = [] }) {
  return (
    <div className="dm-panel dm-recent-activities">
      <div className="dm-panel-header">
        <div>
          <h3>Recent activities</h3>
          <p>Your latest logged activities</p>
        </div>

        <Link to="/activities" className="dm-panel-link">
          View all
          <ArrowRight size={15} />
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="dm-recent-empty">
          <Activity size={30} />
          <h4>No recent activities</h4>
          <p>Start logging activities to see them here.</p>
          <Link to="/activities">Log an activity</Link>
        </div>
      ) : (
        <div className="dm-recent-activity-list">
          {activities.map((log) => {
            const actDef = log?.activity || {};
            const category = actDef.category || log?.category || "CUSTOM";
            const Icon = iconMap[category] || Activity;
            const name = actDef.name || log?.name || "Activity";
            const unit = actDef.unit || log?.unit || "";

            return (
              <div className="dm-recent-activity-item" key={log.id}>
                <div className="dm-recent-activity-icon">
                  <Icon size={19} />
                </div>

                <div className="dm-recent-activity-content">
                  <h4>{name}</h4>
                  <div className="dm-recent-activity-meta">
                    {log?.value !== null && log?.value !== undefined && (
                      <span>
                        {log.value} {unit}
                      </span>
                    )}
                    {log?.duration && (
                      <span>
                        <Clock3 size={13} />
                        {log.duration} min
                      </span>
                    )}
                  </div>
                </div>

                <span className="dm-recent-activity-time">
                  {formatRelativeTime(log?.loggedAt)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecentActivities;
