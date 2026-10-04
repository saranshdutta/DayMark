import {
  Activity,
  Dumbbell,
  BookOpen,
  Droplets,
  Moon,
  Clock3,
  Compass,
  Users,
  Briefcase,
} from "lucide-react";

const iconMap = {
  PHYSICAL:  Dumbbell,
  ACADEMIC:  BookOpen,
  HEALTH:    Dumbbell,
  LIFESTYLE: Moon,
  SOCIAL:    Users,
  WORK:      Briefcase,
  CUSTOM:    Activity,
  OTHER:     Compass,
};

const categoryColors = {
  PHYSICAL:  { bg: "var(--dm-success-soft)",  color: "var(--dm-success)"  },
  ACADEMIC:  { bg: "var(--dm-primary-soft)",  color: "var(--dm-primary)"  },
  HEALTH:    { bg: "var(--dm-success-soft)",  color: "var(--dm-success)"  },
  LIFESTYLE: { bg: "var(--dm-warning-soft)",  color: "var(--dm-warning)"  },
  SOCIAL:    { bg: "var(--dm-info-soft)",     color: "var(--dm-info)"     },
  WORK:      { bg: "var(--dm-surface-subtle)", color: "var(--dm-text-secondary)" },
  CUSTOM:    { bg: "var(--dm-primary-soft)",  color: "var(--dm-primary)"  },
  OTHER:     { bg: "var(--dm-surface-subtle)", color: "var(--dm-text-muted)" },
};

function formatRelativeTime(dateStr) {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffH  = Math.floor(diffMs / 3600000);
  const diffD  = Math.floor(diffMs / 86400000);

  if (diffH < 1)   return "Just now";
  if (diffH < 24)  return `${diffH}h ago`;
  if (diffD === 1) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function RecentActivities({ activities = [] }) {
  if (activities.length === 0) {
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
        <Activity size={32} strokeWidth={1.5} />
        <p style={{ fontSize: "var(--dm-text-sm)", fontWeight: "var(--dm-weight-medium)" }}>No activities yet</p>
        <p style={{ fontSize: "var(--dm-text-xs)" }}>Start logging activities to see them here.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {activities.map((log, idx, arr) => {
        const actDef   = log?.activity || {};
        const category = actDef.category || log?.category || "CUSTOM";
        const Icon     = iconMap[category] || Activity;
        const name     = actDef.name || log?.title || log?.name || "Activity";
        const colors   = categoryColors[category] || categoryColors.CUSTOM;

        return (
          <div
            key={log.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--dm-space-3)",
              padding: "var(--dm-space-3) 0",
              borderBottom: idx < arr.length - 1 ? "1px solid var(--dm-border)" : "none",
            }}
          >
            {/* Icon */}
            <div style={{
              width: "34px",
              height: "34px",
              borderRadius: "var(--dm-radius-sm)",
              backgroundColor: colors.bg,
              color: colors.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <Icon size={16} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: "var(--dm-text-sm)",
                fontWeight: "var(--dm-weight-medium)",
                color: "var(--dm-text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {name}
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--dm-space-2)",
                marginTop: "2px",
                fontSize: "var(--dm-text-xs)",
                color: "var(--dm-text-muted)",
              }}>
                {log?.duration && (
                  <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <Clock3 size={11} /> {log.duration}m
                  </span>
                )}
              </div>
            </div>

            {/* Timestamp */}
            <span style={{
              fontSize: "var(--dm-text-xs)",
              color: "var(--dm-text-muted)",
              flexShrink: 0,
            }}>
              {formatRelativeTime(log?.loggedAt || log?.createdAt)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default RecentActivities;
