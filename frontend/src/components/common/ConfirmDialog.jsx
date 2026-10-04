import React from "react";
import Modal from "./Modal";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="420px">
      <div style={{ display: "flex", gap: "var(--dm-space-3)", alignItems: "flex-start" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "var(--dm-radius-sm)",
            backgroundColor: variant === "danger" ? "var(--dm-danger-soft)" : "var(--dm-warning-soft)",
            color: variant === "danger" ? "var(--dm-danger)" : "var(--dm-warning)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={18} />
        </div>
        <div>
          <p style={{ fontSize: "var(--dm-text-sm)", color: "var(--dm-text-secondary)", lineHeight: "1.5" }}>
            {message}
          </p>
        </div>
      </div>

      <div
        style={{
          marginTop: "var(--dm-space-6)",
          display: "flex",
          justifyContent: "flex-end",
          gap: "var(--dm-space-2)",
        }}
      >
        <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={variant}
          size="sm"
          loading={loading}
          onClick={() => {
            onConfirm();
          }}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
