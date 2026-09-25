import {
  Footprints,
  Dumbbell,
  BookOpen,
  Moon,
  Activity,
  MoreVertical,
} from "lucide-react";

const iconMap = {
  PHYSICAL: Dumbbell,
  ACADEMIC: BookOpen,
  LIFESTYLE: Moon,
  CUSTOM: Activity,
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ActivityCard receives an ActivityLog record from the backend:
// { id, activityId, activity: { name, category, unit }, value, duration, note, loggedAt }
function ActivityCard({ activity: log, onEdit, onDelete }) {
  const activityDef = log?.activity || {};
  const category = activityDef.category || log?.category || "CUSTOM";
  const Icon = iconMap[category] || Footprints;

  const name = activityDef.name || log?.name || "Activity";
  const unit = activityDef.unit || log?.unit || "";
  const value = log?.value ?? null;
  const duration = log?.duration ?? null;
  const note = log?.note || "";
  const loggedAt = log?.loggedAt || "";

  return (
    <div className="dm-activity-card">
      {/* Activity Icon */}
      <div className="dm-card-icon">
        <Icon size={21} />
      </div>

      {/* Activity Information */}
      <div className="dm-card-content">
        <h3>{name}</h3>

        {value !== null && (
          <span className="dm-activity-value">
            {value} {unit}
          </span>
        )}

        {duration && (
          <span className="dm-activity-duration">{duration} min</span>
        )}

        {note && <p>{note}</p>}

        {loggedAt && (
          <span className="dm-activity-duration" style={{ marginTop: 4 }}>
            {formatDate(loggedAt)}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="dm-card-actions">
        {onEdit && (
          <button type="button" onClick={() => onEdit(log)}>
            Edit
          </button>
        )}

        {onDelete && (
          <button type="button" onClick={() => onDelete(log)}>
            Delete
          </button>
        )}

        {!onEdit && !onDelete && (
          <button
            type="button"
            className="dm-more-btn"
            aria-label="Activity options"
          >
            <MoreVertical size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ActivityCard;
