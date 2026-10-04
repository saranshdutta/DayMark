import React, { forwardRef } from "react";

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    className = "",
    id,
    type = "text",
    required = false,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="dm-input-group">
      {label && (
        <label htmlFor={inputId} className="dm-label">
          {label} {required && <span style={{ color: "var(--dm-danger)" }}>*</span>}
        </label>
      )}
      <div className="dm-input-wrapper">
        {Icon && <Icon className="dm-input-icon" size={16} />}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`dm-input ${Icon ? "dm-input-with-icon" : ""} ${
            error ? "dm-input-error" : ""
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <span className="dm-input-error-msg">{error}</span>
      ) : helperText ? (
        <span style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)" }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, error, helperText, className = "", id, required = false, rows = 3, ...props },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="dm-input-group">
      {label && (
        <label htmlFor={inputId} className="dm-label">
          {label} {required && <span style={{ color: "var(--dm-danger)" }}>*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={`dm-textarea ${error ? "dm-input-error" : ""} ${className}`}
        {...props}
      />
      {error ? (
        <span className="dm-input-error-msg">{error}</span>
      ) : helperText ? (
        <span style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)" }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

export const Select = forwardRef(function Select(
  { label, error, helperText, options = [], className = "", id, required = false, children, ...props },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="dm-input-group">
      {label && (
        <label htmlFor={inputId} className="dm-label">
          {label} {required && <span style={{ color: "var(--dm-danger)" }}>*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={`dm-select ${error ? "dm-input-error" : ""} ${className}`}
        {...props}
      >
        {children
          ? children
          : options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
      </select>
      {error ? (
        <span className="dm-input-error-msg">{error}</span>
      ) : helperText ? (
        <span style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)" }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

export default Input;
