function GoalProgressBar({
  current = 0,
  target = 0,
  unit = "",
  showValues = true,
  showPercentage = true,
  size = "medium",
}) {
  const safeCurrent = Number(current) || 0;
  const safeTarget = Number(target) || 0;

  const percentage =
    safeTarget > 0
      ? Math.min(100, Math.round((safeCurrent / safeTarget) * 100))
      : 0;

  return (
    <div
      className={["dm-goal-progress-bar", `dm-goal-progress-bar-${size}`].join(
        " ",
      )}
    >
      {showValues && (
        <div className="dm-goal-progress-bar-header">
          <span>
            {safeCurrent} / {safeTarget} {unit}
          </span>

          {showPercentage && <strong>{percentage}%</strong>}
        </div>
      )}

      <div
        className="dm-progress-track"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`${percentage}% goal progress`}
      >
        <div
          className="dm-progress-fill"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      {!showValues && showPercentage && (
        <div className="dm-goal-progress-percentage">{percentage}%</div>
      )}
    </div>
  );
}

export default GoalProgressBar;
