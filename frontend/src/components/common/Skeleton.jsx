import React from "react";

export function Skeleton({ width = "100%", height = "16px", borderRadius = "var(--dm-radius-xs)", className = "" }) {
  return (
    <div
      className={`dm-skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="dm-stat-card">
      <div className="dm-stat-header">
        <Skeleton width="40%" height="12px" />
        <Skeleton width="28px" height="28px" borderRadius="var(--dm-radius-sm)" />
      </div>
      <div style={{ marginTop: "var(--dm-space-3)" }}>
        <Skeleton width="60%" height="24px" />
        <Skeleton width="80%" height="12px" style={{ marginTop: "var(--dm-space-2)" }} />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="dm-card" style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-3)" }}>
      <Skeleton width="50%" height="18px" />
      <Skeleton width="100%" height="12px" />
      <Skeleton width="80%" height="12px" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "var(--dm-space-3) 0",
        borderBottom: "1px solid var(--dm-border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-3)", flex: 1 }}>
        <Skeleton width="32px" height="32px" borderRadius="var(--dm-radius-sm)" />
        <div style={{ flex: 1 }}>
          <Skeleton width="40%" height="14px" />
          <Skeleton width="25%" height="10px" style={{ marginTop: "4px" }} />
        </div>
      </div>
      <Skeleton width="60px" height="14px" />
    </div>
  );
}

export default Skeleton;
