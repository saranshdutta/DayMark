import React from "react";
import { Button } from "./Button";
import { Inbox } from "lucide-react";

export function EmptyState({
  icon: Icon = Inbox,
  title = "No data found",
  message = "Get started by adding your first item.",
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div
      style={{
        padding: "var(--dm-space-10) var(--dm-space-6)",
        textAlign: "center",
        backgroundColor: "var(--dm-surface)",
        border: "1px dashed var(--dm-border-strong)",
        borderRadius: "var(--dm-radius-md)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      className={className}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "var(--dm-radius-md)",
          backgroundColor: "var(--dm-surface-subtle)",
          color: "var(--dm-text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "var(--dm-space-3)",
        }}
      >
        <Icon size={22} />
      </div>

      <h3
        style={{
          fontSize: "var(--dm-text-base)",
          fontWeight: "var(--dm-weight-semibold)",
          color: "var(--dm-text-primary)",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "var(--dm-text-xs)",
          color: "var(--dm-text-muted)",
          maxWidth: "340px",
          marginTop: "var(--dm-space-1)",
          marginBottom: actionLabel ? "var(--dm-space-5)" : 0,
        }}
      >
        {message}
      </p>

      {actionLabel && onAction && (
        <Button size="sm" variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
