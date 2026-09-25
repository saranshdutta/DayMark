import { Flame } from "lucide-react";function StreakCard({
  currentStreak = 7,
  longestStreak = 14,
  title = "Current streak",
  subtitle = "Keep your consistency going",
  showLongest = true,
}) {
  return (
    <div className="dm-panel dm-streak-card">
      <div className="dm-streak-content">
        <div className="dm-streak-icon">
          <Flame size={25} />
        </div>

        <div className="dm-streak-info">
          <p>{title}</p>

          <div className="dm-streak-value">
            <strong>{currentStreak}</strong>
            <span>{currentStreak === 1 ? "day" : "days"}</span>
          </div>

          <span className="dm-streak-subtitle">{subtitle}</span>
        </div>
      </div>

      {showLongest && (
        <div className="dm-streak-best">
          <span>Longest streak</span>
          <strong>
            {longestStreak} {longestStreak === 1 ? "day" : "days"}
          </strong>
        </div>
      )}

      <div className="dm-streak-days" aria-label="Weekly streak">
        {[1, 2, 3, 4, 5, 6, 7].map((day, index) => {
          const completed = index < Math.min(currentStreak, 7);

          return (
            <div
              key={day}
              className={["dm-streak-day", completed ? "is-complete" : ""]
                .filter(Boolean)
                .join(" ")}
            >
              {completed && <Flame size={13} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StreakCard;
