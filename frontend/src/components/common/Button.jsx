import React from "react";
import { Loader2 } from "lucide-react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) {
  const variantClass = `dm-button-${variant}`;
  const sizeClass = `dm-button-${size}`;
  const fullWidthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      className={`dm-button ${variantClass} ${sizeClass} ${fullWidthClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === "sm" ? 14 : size === "lg" ? 20 : 16} className="animate-spin" />
      ) : Icon && iconPosition === "left" ? (
        <Icon size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />
      ) : null}

      <span>{children}</span>

      {!loading && Icon && iconPosition === "right" && (
        <Icon size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />
      )}
    </button>
  );
}

export function IconButton({
  icon: Icon,
  size = "md",
  variant = "ghost",
  className = "",
  disabled = false,
  title,
  onClick,
  type = "button",
  ...props
}) {
  const sizeClass = `dm-icon-button-${size}`;
  const iconSize = size === "sm" ? 14 : size === "lg" ? 20 : 16;

  return (
    <button
      type={type}
      className={`dm-icon-button ${sizeClass} ${className}`}
      disabled={disabled}
      title={title}
      aria-label={title}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={iconSize} />}
    </button>
  );
}

export default Button;
