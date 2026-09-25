import { Inbox } from "lucide-react";

function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  message = "There is nothing to display at the moment.",
  action = null,
  className = "",
}) {
  return (
    <div className={["dm-empty-state", className].filter(Boolean).join(" ")}>
      <div className="dm-empty-state-icon">
        <Icon size={28} strokeWidth={1.8} />
      </div>

      <div className="dm-empty-state-content">
        <h3>{title}</h3>
        <p>{message}</p>

        {action && <div className="dm-empty-state-action">{action}</div>}
      </div>
    </div>
  );
}

export default EmptyState;
