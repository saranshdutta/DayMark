import React from "react";
import { CheckCircle2, AlertCircle, Info, XCircle, X } from "lucide-react";

export function Toast({ id, type = "info", title, message, onClose }) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={18} style={{ color: "var(--dm-success)" }} />;
      case "error":
        return <XCircle size={18} style={{ color: "var(--dm-danger)" }} />;
      case "warning":
        return <AlertCircle size={18} style={{ color: "var(--dm-warning)" }} />;
      default:
        return <Info size={18} style={{ color: "var(--dm-info)" }} />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--dm-space-3)",
        padding: "var(--dm-space-3) var(--dm-space-4)",
        backgroundColor: "var(--dm-surface)",
        border: "1px solid var(--dm-border)",
        borderRadius: "var(--dm-radius-md)",
        boxShadow: "var(--dm-shadow-md)",
        minWidth: "280px",
        maxWidth: "360px",
        animation: "dmFadeIn 200ms ease forwards",
      }}
    >
      <div style={{ marginTop: "2px", flexShrink: 0 }}>{getIcon()}</div>
      <div style={{ flex: 1 }}>
        {title && (
          <h4
            style={{
              fontSize: "var(--dm-text-xs)",
              fontWeight: "var(--dm-weight-semibold)",
              color: "var(--dm-text-primary)",
            }}
          >
            {title}
          </h4>
        )}
        {message && (
          <p
            style={{
              fontSize: "var(--dm-text-xs)",
              color: "var(--dm-text-secondary)",
              marginTop: title ? "2px" : 0,
            }}
          >
            {message}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onClose(id)}
        style={{
          background: "none",
          border: "none",
          color: "var(--dm-text-muted)",
          cursor: "pointer",
          padding: "2px",
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts = [], onClose }) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "var(--dm-space-6)",
        right: "var(--dm-space-6)",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        gap: "var(--dm-space-2)",
      }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}

export default Toast;
