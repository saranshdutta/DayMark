import { Flame, Zap } from "lucide-react";

function StreakCard({ currentStreak = 0, longestStreak = 0 }) {
  const streakLevel =
    currentStreak >= 30 ? "legendary" :
    currentStreak >= 14 ? "fire" :
    currentStreak >= 7  ? "hot" :
    currentStreak >= 3  ? "warm" : "cool";

  const streakColor =
    streakLevel === "legendary" ? "var(--dm-warning)" :
    streakLevel === "fire"      ? "var(--dm-danger)"  :
    streakLevel === "hot"       ? "var(--dm-warning)" :
    streakLevel === "warm"      ? "var(--dm-primary)" :
                                  "var(--dm-text-muted)";

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div
      className="dm-card"
      style={{
        background: currentStreak >= 7
          ? "linear-gradient(135deg, var(--dm-primary-soft) 0%, var(--dm-warning-soft) 100%)"
          : undefined,
        borderColor: currentStreak >= 7 ? "var(--dm-primary-border)" : undefined,
      }}
    >
      {/* Top: Flame + Value */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--dm-space-4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-3)" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "var(--dm-radius-sm)",
            backgroundColor: `${streakColor}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Flame size={22} style={{ color: streakColor }} />
          </div>
          <div>
            <div style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)", fontWeight: "var(--dm-weight-medium)" }}>
              Active Streak
            </div>
            <div style={{
              fontSize: "var(--dm-text-2xl)",
              fontWeight: "var(--dm-weight-bold)",
              color: streakColor,
              lineHeight: 1.1,
            }}>
              {currentStreak}
              <span style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)", fontWeight: "normal", marginLeft: "4px" }}>
                {currentStreak === 1 ? "day" : "days"}
              </span>
            </div>
          </div>
        </div>

        {longestStreak > 0 && (
          <div style={{
            textAlign: "right",
            padding: "6px 10px",
            borderRadius: "var(--dm-radius-sm)",
            backgroundColor: "var(--dm-surface-subtle)",
            border: "1px solid var(--dm-border)",
          }}>
            <div style={{ fontSize: "10px", color: "var(--dm-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Best</div>
            <div style={{ fontSize: "var(--dm-text-sm)", fontWeight: "var(--dm-weight-bold)", color: "var(--dm-text-primary)", display: "flex", alignItems: "center", gap: "3px" }}>
              <Zap size={12} style={{ color: streakColor }} />{longestStreak}d
            </div>
          </div>
        )}
      </div>

      {/* Day Pills */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
        {weekDays.map((day, i) => {
          const filled = i < Math.min(currentStreak, 7);
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
              <div style={{
                width: "100%",
                aspectRatio: "1",
                borderRadius: "var(--dm-radius-xs)",
                backgroundColor: filled ? streakColor : "var(--dm-surface-hover)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color var(--dm-transition-base)",
              }}>
                {filled && <Flame size={10} color="#fff" />}
              </div>
              <span style={{ fontSize: "9px", color: "var(--dm-text-muted)", textTransform: "uppercase" }}>{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StreakCard;
