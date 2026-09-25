import { useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  Target,
  Flame,
  Activity,
  Clock3,
  Trash2,
} from "lucide-react";

import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { useApp } from "../context/AppContext";



const notificationIcons = {
  GOAL: Target,
  STREAK: Flame,
  ACTIVITY: Activity,
  REMINDER: Clock3,
};

function formatNotificationTime(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  const now = new Date();

  const difference = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (difference < 1) {
    return "Just now";
  }

  if (difference < 60) {
    return `${difference}m ago`;
  }

  if (difference < 1440) {
    return `${Math.floor(difference / 60)}h ago`;
  }

  if (difference < 10080) {
    return `${Math.floor(difference / 1440)}d ago`;
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Notifications() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
  } = useApp();

  const [filter, setFilter] = useState("ALL");

  const displayNotifications = notifications;

  const filteredNotifications = useMemo(() => {
    if (filter === "UNREAD") {
      return displayNotifications.filter(
        (notification) => !notification.isRead,
      );
    }

    return displayNotifications;
  }, [displayNotifications, filter]);

  const unreadCount = displayNotifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const handleMarkRead = (notification) => {
    if (notification.isRead) {
      return;
    }

    markNotificationRead?.(notification.id);
  };

  const handleDelete = (notification) => {
    deleteNotification?.(notification.id);
  };

  return (
    <div className="dm-page dm-notifications-page">
      {/* Header */}
      <div className="dm-page-header">
        <div className="dm-page-title-row">
          <div className="dm-page-title-icon">
            <Bell size={21} />
          </div>

          <div>
            <h1>Notifications</h1>
            <p>Stay updated with your goals, activities, and consistency.</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <Button variant="secondary" onClick={markAllNotificationsRead}>
            <CheckCheck size={17} />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Summary */}
      <div className="dm-notification-summary">
        <div>
          <strong>{unreadCount}</strong>

          <span>
            {unreadCount === 1
              ? " unread notification"
              : " unread notifications"}
          </span>
        </div>

        <div className="dm-notification-filter">
          <button
            type="button"
            className={filter === "ALL" ? "is-active" : ""}
            onClick={() => setFilter("ALL")}
          >
            All
          </button>

          <button
            type="button"
            className={filter === "UNREAD" ? "is-active" : ""}
            onClick={() => setFilter("UNREAD")}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Notification list */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={
            filter === "UNREAD"
              ? "You're all caught up"
              : "No notifications yet"
          }
          message={
            filter === "UNREAD"
              ? "There are no unread notifications right now."
              : "Your activity and goal updates will appear here."
          }
        />
      ) : (
        <div className="dm-notification-list">
          {filteredNotifications.map((notification) => {
            const Icon = notificationIcons[notification.type] || Bell;

            return (
              <div
                key={notification.id}
                className={[
                  "dm-notification-item",
                  !notification.isRead ? "is-unread" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="dm-notification-icon">
                  <Icon size={19} strokeWidth={1.9} />
                </div>

                <div className="dm-notification-content">
                  <div className="dm-notification-heading">
                    <h3>{notification.title}</h3>

                    {!notification.isRead && <span className="dm-unread-dot" />}
                  </div>

                  <p>{notification.message}</p>

                  <span className="dm-notification-time">
                    {formatNotificationTime(notification.createdAt)}
                  </span>
                </div>

                <div className="dm-notification-actions">
                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(notification)}
                      aria-label="Mark notification as read"
                      title="Mark as read"
                    >
                      <CheckCheck size={17} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(notification)}
                    aria-label="Delete notification"
                    title="Delete notification"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Notifications;
