import {
  Activity,
  CalendarDays,
  Clock3,
  Footprints,
  Dumbbell,
  BookOpen,
  Droplets,
  Moon,
} from "lucide-react";

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

function DayActivities({ date, activities = [] }) {
  const formattedDate = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Select a date";

  return (
    <div className="dm-panel dm-day-activities">
      <div className="dm-panel-header">
        <div>
          <h3>Daily activities</h3>
          <p>{formattedDate}</p>
        </div>

        <div className="dm-day-activity-count">
          {activities.length}
          <span>{activities.length === 1 ? " activity" : " activities"}</span>
        </div>
      </div>

      {!date ? (
        <div className="dm-calendar-empty">
          <CalendarDays size={32} />
          <h4>Select a date</h4>
          <p>Choose a day from the calendar to view your activities.</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="dm-calendar-empty">
          <Activity size={32} />
          <h4>No activities logged</h4>
          <p>There are no activities recorded for this date.</p>
        </div>
      ) : (
        <div className="dm-day-activity-list">
          {activities.map((activity, index) => {
            const Icon = iconMap[activity?.category] || Activity;

            return (
              <div className="dm-day-activity-item" key={activity?.id || index}>
                <div className="dm-day-activity-icon">
                  <Icon size={19} />
                </div>

                <div className="dm-day-activity-content">
                  <h4>{activity?.name || "Activity"}</h4>

                  <div className="dm-day-activity-meta">
                    {activity?.value !== null &&
                      activity?.value !== undefined && (
                        <span>
                          {activity.value} {activity.unit || ""}
                        </span>
                      )}

                    {activity?.duration !== null &&
                      activity?.duration !== undefined && (
                        <span className="dm-duration">
                          <Clock3 size={14} />
                          {activity.duration} min
                        </span>
                      )}
                  </div>

                  {activity?.note && <p>{activity.note}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DayActivities;
