import React from "react";

export function Tabs({ tabs = [], activeTab, onChange, className = "" }) {
  return (
    <div className={`dm-tabs ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`dm-tab ${activeTab === tab.id ? "dm-tab-active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon && <tab.icon size={14} style={{ marginRight: "6px" }} />}
          {tab.label}
          {tab.badge !== undefined && (
            <span
              style={{
                marginLeft: "6px",
                padding: "1px 6px",
                fontSize: "10px",
                borderRadius: "var(--dm-radius-full)",
                backgroundColor: activeTab === tab.id ? "var(--dm-primary-soft)" : "var(--dm-surface-hover)",
                color: activeTab === tab.id ? "var(--dm-primary)" : "var(--dm-text-muted)",
              }}
            >
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

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

export default Tabs;
