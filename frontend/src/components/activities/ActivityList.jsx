import { Activity as ActivityIcon } from "lucide-react";

import EmptyState from "../common/EmptyState";
import ActivityCard from "./ActivityCard";

function ActivityList({ activities = [], onEdit, onDelete }) {
  if (!activities.length) {
    return (
      <EmptyState
        icon={ActivityIcon}
        title="No activities yet"
        message="Start logging your daily activities to build your activity history."
      />
    );
  }

  return (
    <div className="dm-activity-list-grid">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default ActivityList;
