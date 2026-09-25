import { Target } from "lucide-react";
import GoalCard from "./GoalCard";
import EmptyState from "../common/EmptyState";

function GoalList({ goals = [], onEdit, onDelete, onPause, onArchive }) {
  if (!goals.length) {
    return (
      <EmptyState
        icon={Target}
        title="No goals yet"
        message="Create your first goal and start tracking your progress."
      />
    );
  }

  return (
    <div className="dm-goal-list-grid">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onEdit={onEdit}
          onDelete={onDelete}
          onPause={onPause}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}

export default GoalList;
