import { Target, CheckCircle2 } from "lucide-react";

function GoalProgress({ goals = [] }) {
  if (goals.length === 0) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "var(--dm-space-8) 0",
        gap: "var(--dm-space-2)",
        color: "var(--dm-text-muted)",
        textAlign: "center",
      }}>
        <Target size={32} strokeWidth={1.5} />
        <p style={{ fontSize: "var(--dm-text-sm)", fontWeight: "var(--dm-weight-medium)" }}>No active goals</p>
        <p style={{ fontSize: "var(--dm-text-xs)" }}>Create a goal to start tracking progress.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-4)" }}>
      {goals.map((goal) => {
        const current    = Number(goal.current ?? 0);
        const target     = Number(goal.target ?? 1);
        const progress   = Math.min(100, Math.round((current / target) * 100));
        const isComplete = progress >= 100;

        return (
          <div key={goal.id} style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-2)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  fontSize: "var(--dm-text-xs)",
                  fontWeight: "var(--dm-weight-medium)",
                  color: "var(--dm-text-primary)",
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {goal.title}
                </span>
                <span style={{ fontSize: "10px", color: "var(--dm-text-muted)" }}>
                  {current} / {target} {goal.unit}
                </span>
              </div>

              <span style={{
                fontSize: "var(--dm-text-xs)",
                fontWeight: "var(--dm-weight-bold)",
                color: isComplete ? "var(--dm-success)" : "var(--dm-primary)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: "3px",
                marginLeft: "var(--dm-space-2)",
              }}>
                {isComplete && <CheckCircle2 size={12} />}
                {progress}%
              </span>
            </div>

            <div className="dm-progress-track" style={{ height: "4px" }}>
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  backgroundColor: isComplete ? "var(--dm-success)" : "var(--dm-primary)",
                  borderRadius: "var(--dm-radius-full)",
                  transition: "width var(--dm-transition-slow)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default GoalProgress;
