import React from "react";

export function Badge({
  children,
  variant = "default",
  icon: Icon,
  className = "",
  size = "md",
  ...props
}) {
  const variantClass = `dm-badge-${variant}`;

  return (
    <span className={`dm-badge ${variantClass} ${className}`} {...props}>
      {Icon && <Icon size={size === "sm" ? 10 : 12} />}
      <span>{children}</span>
    </span>
  );
}

export function ProgressBar({
  value = 0,
  max = 100,
  height = 8,
  variant = "primary",
  showLabel = false,
  className = "",
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const getColor = () => {
    if (variant === "success") return "var(--dm-success)";
    if (variant === "warning") return "var(--dm-warning)";
    if (variant === "danger") return "var(--dm-danger)";
    if (variant === "info") return "var(--dm-info)";
    return "var(--dm-primary)";
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)", marginBottom: "4px" }}>
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="dm-progress-track" style={{ height: `${height}px` }}>
        <div
          className="dm-progress-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: getColor(),
          }}
        />
      </div>
    </div>
  );
}

export default Badge;
