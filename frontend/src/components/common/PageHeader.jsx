import React from "react";

export function PageHeader({ title, subtitle, actions, breadcrumb }) {
  return (
    <div className="dm-page-header">
      <div className="dm-page-title-group">
        {breadcrumb && (
          <span style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)", marginBottom: "4px", display: "block" }}>
            {breadcrumb}
          </span>
        )}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="dm-page-actions">{actions}</div>}
    </div>
  );
}

export default PageHeader;
