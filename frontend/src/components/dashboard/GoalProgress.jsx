import { Target, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function GoalProgress({ goals = [] }) {
  const calculateProgress = (current, target) => {
    if (!target || target <= 0) return 0;

    return Math.min(100, Math.round((current / target) * 100));
  };

  const formatValue = (value) => {
    if (typeof value !== "number") return value;

    return Number.isInteger(value) ? value : value.toFixed(1);
  };

  return (
    <div className="dm-panel dm-goal-progress">
      <div className="dm-panel-header">
        <div className="dm-panel-heading">
          <div className="dm-panel-icon">
            <Target size={19} />
          </div>

          <div>
            <h3>Today's goals</h3>
            <p>Keep moving towards your targets</p>
          </div>
        </div>

        <Link to="/goals" className="dm-panel-link">
          View all
          <ArrowRight size={15} />
        </Link>
      </div>

      {goals.length === 0 ? (
        <div className="dm-goal-empty">
          <Target size={30} />
          <p>No active goals yet.</p>

          <Link to="/goals">Create a goal</Link>
        </div>
      ) : (
        <div className="dm-goal-progress-list">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.current, goal.target);

            const completed = progress >= 100;

            return (
              <div className="dm-goal-progress-item" key={goal.id}>
                <div className="dm-goal-progress-top">
                  <div>
                    <h4>{goal.title}</h4>

                    <span>
                      {formatValue(goal.current)} / {formatValue(goal.target)}{" "}
                      {goal.unit}
                    </span>
                  </div>

                  <div
                    className={
                      completed
                        ? "dm-goal-percentage is-complete"
                        : "dm-goal-percentage"
                    }
                  >
                    {completed ? <CheckCircle2 size={16} /> : null}
                    {progress}%
                  </div>
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
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GoalProgress;
