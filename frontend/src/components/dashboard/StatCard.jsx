import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const variantColors = {
  primary: { text: "var(--dm-primary)", bg: "var(--dm-primary-soft)", border: "var(--dm-primary-border)" },
  success: { text: "var(--dm-success)", bg: "var(--dm-success-soft)", border: "var(--dm-success-border)" },
  warning: { text: "var(--dm-warning)", bg: "var(--dm-warning-soft)", border: "var(--dm-warning-border)" },
  danger:  { text: "var(--dm-danger)",  bg: "var(--dm-danger-soft)",  border: "var(--dm-danger-border)"  },
  info:    { text: "var(--dm-info)",    bg: "var(--dm-info-soft)",    border: "var(--dm-info-border)"    },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  progress,
  variant = "primary",
  className = "",
  onClick,
}) {
  const colors = variantColors[variant] || variantColors.primary;

  return (
    <div
      className={`dm-stat-card ${onClick ? "dm-card-interactive" : ""} ${className}`}
      onClick={onClick}
      style={{ minHeight: "110px" }}
    >
      <div className="dm-stat-header">
        <span className="dm-stat-title">{title}</span>
        {Icon && (
          <div
            className="dm-stat-icon-wrapper"
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Icon size={15} />
          </div>
        )}
      </div>

      <div>
        <div className="dm-stat-value" style={{ color: "var(--dm-text-primary)" }}>
          {value}
        </div>

        {(subtitle || trend !== undefined) && (
          <div className="dm-stat-meta">
            {trend !== undefined && (
              <span
                className={`dm-stat-badge ${
                  trend >= 0 ? "dm-stat-badge-positive" : "dm-stat-badge-negative"
                }`}
                style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}
              >
                {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {trend >= 0 ? `+${trend}%` : `${trend}%`}
              </span>
            )}

            {subtitle && <span style={{ color: "var(--dm-text-muted)" }}>{subtitle}</span>}
            {trendLabel && !subtitle && <span style={{ color: "var(--dm-text-muted)" }}>{trendLabel}</span>}
          </div>
        )}

        {progress !== undefined && (
          <div style={{ marginTop: "var(--dm-space-3)" }}>
            <div className="dm-progress-track" style={{ height: "3px" }}>
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(100, Math.max(0, progress))}%`,
                  backgroundColor: colors.text,
                  borderRadius: "var(--dm-radius-full)",
                  transition: "width var(--dm-transition-slow)",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
