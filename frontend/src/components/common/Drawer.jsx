import React, { useEffect } from "react";
import { X } from "lucide-react";
import { IconButton } from "./Button";

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  position = "right",
  size = "380px",
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLeft = position === "left";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1050,
        backgroundColor: "rgba(15, 18, 16, 0.5)",
        backdropFilter: "blur(4px)",
        animation: "dmFadeIn 150ms ease forwards",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          [isLeft ? "left" : "right"]: 0,
          width: "100%",
          maxWidth: size,
          backgroundColor: "var(--dm-surface)",
          borderLeft: isLeft ? "none" : "1px solid var(--dm-border)",
          borderRight: isLeft ? "1px solid var(--dm-border)" : "none",
          boxShadow: "var(--dm-shadow-lg)",
          display: "flex",
          flexDirection: "column",
          zIndex: 1051,
          animation: "dmFadeIn 200ms ease forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "var(--dm-space-4) var(--dm-space-5)",
            borderBottom: "1px solid var(--dm-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            {title && (
              <h3 style={{ fontSize: "var(--dm-text-md)", fontWeight: "var(--dm-weight-semibold)" }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)" }}>
                {subtitle}
              </p>
            )}
          </div>
          <IconButton icon={X} size="sm" onClick={onClose} title="Close drawer" />
        </div>

        <div style={{ padding: "var(--dm-space-5)", overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Drawer;
