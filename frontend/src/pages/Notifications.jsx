import React from "react";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Flame,
  Clock,
  Trash2,
  Check,
} from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { Button, IconButton } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";

import { useApp } from "../context/AppContext";

const getNotificationIcon = (type) => {
  switch (type) {
    case "GOAL_ACHIEVED":
    case "GOAL":
      return <CheckCircle2 size={18} style={{ color: "var(--dm-success)" }} />;
    case "STREAK":
      return <Flame size={18} style={{ color: "var(--dm-warning)" }} />;
    default:
      return <Bell size={18} style={{ color: "var(--dm-primary)" }} />;
  }
};

function Notifications() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
  } = useApp();

  const isToday = (dateString) => {
    if (!dateString) return true;
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const todayNotifications = notifications.filter((n) => isToday(n.createdAt));
  const earlierNotifications = notifications.filter((n) => !isToday(n.createdAt));

  return (
    <div className="dm-animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-6)" }}>
      {/* Page Header */}
      <PageHeader
        title="Notifications"
        subtitle="Goal updates, daily wellness reminders, and achievement milestones."
        actions={
          notifications.some((n) => !n.isRead) && (
            <Button
              variant="secondary"
              size="sm"
              icon={Check}
              onClick={markAllNotificationsRead}
            >
              Mark all as read
            </Button>
          )
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="All caught up!"
          message="You have no unread or recent notifications."
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-6)" }}>
          {/* Today Section */}
          {todayNotifications.length > 0 && (
            <div>
              <div className="dm-section-header">
                <h3 className="dm-section-title">Today</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-2)" }}>
                {todayNotifications.map((item) => (
                  <div
                    key={item.id}
                    className="dm-card"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "var(--dm-space-3) var(--dm-space-4)",
                      backgroundColor: item.isRead ? "var(--dm-surface)" : "var(--dm-primary-soft)",
                      borderColor: item.isRead ? "var(--dm-border)" : "var(--dm-primary-border)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-3)" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "var(--dm-radius-sm)",
                          backgroundColor: "var(--dm-surface)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          boxShadow: "var(--dm-shadow-xs)",
                        }}
                      >
                        {getNotificationIcon(item.type)}
                      </div>

                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-2)" }}>
                          <h4 style={{ fontSize: "var(--dm-text-sm)", fontWeight: "var(--dm-weight-semibold)" }}>
                            {item.title}
                          </h4>
                          {!item.isRead && <Badge variant="primary">New</Badge>}
                        </div>

                        <p style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-secondary)", marginTop: "2px" }}>
                          {item.message}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-2)" }}>
                      {!item.isRead && (
                        <IconButton
                          icon={Check}
                          size="sm"
                          title="Mark read"
                          onClick={() => markNotificationRead(item.id)}
                        />
                      )}
                      <IconButton
                        icon={Trash2}
                        size="sm"
                        title="Delete notification"
                        onClick={() => deleteNotification(item.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Earlier Section */}
          {earlierNotifications.length > 0 && (
            <div>
              <div className="dm-section-header">
                <h3 className="dm-section-title">Earlier</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-2)" }}>
                {earlierNotifications.map((item) => (
                  <div
                    key={item.id}
                    className="dm-card"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "var(--dm-space-3) var(--dm-space-4)",
                      backgroundColor: item.isRead ? "var(--dm-surface)" : "var(--dm-primary-soft)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-3)" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "var(--dm-radius-sm)",
                          backgroundColor: "var(--dm-surface-subtle)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {getNotificationIcon(item.type)}
                      </div>

                      <div>
                        <h4 style={{ fontSize: "var(--dm-text-sm)", fontWeight: "var(--dm-weight-semibold)" }}>
                          {item.title}
                        </h4>
                        <p style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-secondary)", marginTop: "2px" }}>
                          {item.message}
                        </p>
                      </div>
                    </div>

                    <IconButton
                      icon={Trash2}
                      size="sm"
                      title="Delete"
                      onClick={() => deleteNotification(item.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;
