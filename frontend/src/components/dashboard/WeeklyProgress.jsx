import { Activity } from "lucide-react";

function WeeklyProgress({ data = [] }) {
  // data comes as [{ day: "Mon", completed: 2 }, ...]
  const defaultDays = [
    { day: "Mon", completed: 0 },
    { day: "Tue", completed: 0 },
    { day: "Wed", completed: 0 },
    { day: "Thu", completed: 0 },
    { day: "Fri", completed: 0 },
    { day: "Sat", completed: 0 },
    { day: "Sun", completed: 0 },
  ];

  const chartData = data && data.length === 7 ? data : defaultDays;

  return (
    <div className="dm-panel dm-weekly-progress">
      <div className="dm-panel-header">
        <div className="dm-panel-heading">
          <div className="dm-panel-icon">
            <Activity size={18} />
          </div>
          <div>
            <h3>Weekly progress</h3>
            <p>Activities logged this week</p>
          </div>
        </div>
      </div>

      <div className="dm-weekly-chart">
        {chartData.map((item, idx) => {
          // We don't have a 'total' target anymore. 
          // Let's make the max bar height represent the maximum value in the week, 
          // or 100% if we just want relative heights.
          const maxCompleted = Math.max(1, ...chartData.map(d => d.completed));
          const percentage = (item.completed / maxCompleted) * 100;
          return (
            <div className="dm-weekly-col" key={item.day || idx}>
              <div className="dm-weekly-bar-bg">
                <div
                  className="dm-weekly-bar-fill"
                  style={{ height: `${percentage}%` }}
                />
              </div>
              <span className="dm-weekly-label">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeeklyProgress;
