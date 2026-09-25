import {
  Target,
  MoreVertical,
  CheckCircle2,
  PauseCircle,
  Archive,
  Pencil,
  Trash2,
} from "lucide-react";

function GoalCard({ goal, onEdit, onDelete, onPause, onArchive }) {
  const {
    title = "Untitled goal",
    unit = "",
    frequency = "DAILY",
    status = "ACTIVE",
  } = goal || {};

  const current = goal?.currentProgress || goal?.current || 0;
  const target = goal?.targetValue || goal?.target || 0;

  const progress = goal?.percentage ?? (target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0);

  const isCompleted = status === "COMPLETED" || progress >= 100;

  const formattedFrequency =
    frequency.charAt(0) + frequency.slice(1).toLowerCase();

  return (
    <div className="dm-goal-card">
      <div className="dm-goal-card-header">
        <div className="dm-goal-card-title-wrapper">
          <div className="dm-goal-card-icon">
            {isCompleted ? <CheckCircle2 size={20} /> : <Target size={20} />}
          </div>

          <div>
            <h3>{title}</h3>
            <span>{formattedFrequency} goal</span>
          </div>
        </div>

        <div className="dm-goal-card-menu">
          <button
            type="button"
            className="dm-more-btn"
            aria-label="Goal options"
          >
            <MoreVertical size={18} />
          </button>

          <div className="dm-goal-actions">
            {onEdit && (
              <button type="button" onClick={() => onEdit(goal)}>
                <Pencil size={15} />
                Edit
              </button>
            )}

            {onPause && status === "ACTIVE" && (
              <button type="button" onClick={() => onPause(goal)}>
                <PauseCircle size={15} />
                Pause
              </button>
            )}

            {onArchive && (
              <button type="button" onClick={() => onArchive(goal)}>
                <Archive size={15} />
                Archive
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                className="is-danger"
                onClick={() => onDelete(goal)}
              >
                <Trash2 size={15} />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="dm-goal-card-progress">
        <div className="dm-goal-card-progress-info">
          <span>
            {current} / {target} {unit}
          </span>

          <strong>{progress}%</strong>
        </div>

        <div className="dm-progress-track">
          <div
            className="dm-progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="dm-goal-card-footer">
        <span
          className={[
            "dm-goal-status",
            isCompleted
              ? "is-completed"
              : status === "PAUSED"
                ? "is-paused"
                : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {isCompleted
            ? "Completed"
            : status === "PAUSED"
              ? "Paused"
              : "Active"}
        </span>

        <span>
          {target > 0
            ? `${target - Math.min(current, target)} ${unit} remaining`
            : "Set a target"}
        </span>
      </div>
    </div>
  );
}

export default GoalCard;
