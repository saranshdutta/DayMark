import { useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Shield,
  Lock,
  LogOut,
  ChevronRight,
  Save,
} from "lucide-react";

import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import authService from "../services/authService";

function Settings() {
  const { logout } = useAuth();

  const [notifications, setNotifications] = useState(true);

  const [goalReminders, setGoalReminders] = useState(true);

  const [activityReminders, setActivityReminders] = useState(true);

  const { theme, setTheme } = useApp();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [saved, setSaved] = useState(false);

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSavePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("Please fill in all fields.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordSuccess("Password updated successfully.");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess("");
      }, 1500);
    } catch (error) {
      setPasswordError(
        error.response?.data?.message || "Failed to update password."
      );
    }
  };

  const handleSavePreferences = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const handleLogout = () => {
    logout?.();
    localStorage.removeItem("daymark_token");
    localStorage.removeItem("daymark_user");
    window.location.href = "/login";
  };

  return (
    <div className="dm-page dm-settings-page">
      {/* Header */}
      <div className="dm-page-header">
        <div className="dm-page-title-row">
          <div className="dm-page-title-icon">
            <SettingsIcon size={21} />
          </div>

          <div>
            <h1>Settings</h1>
            <p>Manage your DayMark preferences and account settings.</p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <section className="dm-settings-section">
        <div className="dm-section-heading">
          <div>
            <h2>Preferences</h2>
            <p>Control how DayMark behaves for you.</p>
          </div>
        </div>

        <div className="dm-settings-list">
          {/* Notifications */}
          <div className="dm-setting-row">
            <div className="dm-setting-icon">
              <Bell size={19} />
            </div>

            <div className="dm-setting-content">
              <h3>Notifications</h3>

              <p>Receive updates about your activities and goals.</p>
            </div>

            <button
              type="button"
              className={["dm-toggle", notifications ? "is-active" : ""].join(
                " ",
              )}
              onClick={() => setNotifications((value) => !value)}
              aria-label="Toggle notifications"
              aria-pressed={notifications}
            >
              <span />
            </button>
          </div>

          {/* Goal reminders */}
          <div className="dm-setting-row">
            <div className="dm-setting-icon">
              <Bell size={19} />
            </div>

            <div className="dm-setting-content">
              <h3>Goal reminders</h3>

              <p>Get reminders when your goals need attention.</p>
            </div>

            <button
              type="button"
              className={["dm-toggle", goalReminders ? "is-active" : ""].join(
                " ",
              )}
              onClick={() => setGoalReminders((value) => !value)}
              aria-label="Toggle goal reminders"
              aria-pressed={goalReminders}
            >
              <span />
            </button>
          </div>

          {/* Activity reminders */}
          <div className="dm-setting-row">
            <div className="dm-setting-icon">
              <Bell size={19} />
            </div>

            <div className="dm-setting-content">
              <h3>Activity reminders</h3>

              <p>Get reminded to log your daily activities.</p>
            </div>

            <button
              type="button"
              className={[
                "dm-toggle",
                activityReminders ? "is-active" : "",
              ].join(" ")}
              onClick={() => setActivityReminders((value) => !value)}
              aria-label="Toggle activity reminders"
              aria-pressed={activityReminders}
            >
              <span />
            </button>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="dm-settings-section">
        <div className="dm-section-heading">
          <div>
            <h2>Appearance</h2>
            <p>Choose how DayMark looks on your device.</p>
          </div>
        </div>

        <div className="dm-theme-options">
          <button
            type="button"
            className={[
              "dm-theme-option",
              theme === "light" ? "is-active" : "",
            ].join(" ")}
            onClick={() => setTheme("light")}
          >
            <Sun size={20} />

            <div>
              <strong>Light</strong>

              <span>Clean and bright interface</span>
            </div>
          </button>

          <button
            type="button"
            className={[
              "dm-theme-option",
              theme === "dark" ? "is-active" : "",
            ].join(" ")}
            onClick={() => setTheme("dark")}
          >
            <Moon size={20} />

            <div>
              <strong>Dark</strong>

              <span>Easier on the eyes at night</span>
            </div>
          </button>

          <button
            type="button"
            className={[
              "dm-theme-option",
              theme === "system" ? "is-active" : "",
            ].join(" ")}
            onClick={() => setTheme("system")}
          >
            <SettingsIcon size={20} />

            <div>
              <strong>System</strong>

              <span>Follow your device preference</span>
            </div>
          </button>
        </div>
      </section>

      {/* Security */}
      <section className="dm-settings-section">
        <div className="dm-section-heading">
          <div>
            <h2>Security</h2>
            <p>Manage your account security.</p>
          </div>
        </div>

        <div className="dm-settings-action-list">
          <button
            type="button"
            className="dm-settings-action"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            <div className="dm-setting-icon">
              <Lock size={19} />
            </div>

            <div className="dm-setting-content">
              <h3>Change password</h3>

              <p>Update your account password.</p>
            </div>

            <ChevronRight size={18} />
          </button>

          <button type="button" className="dm-settings-action">
            <div className="dm-setting-icon">
              <Shield size={19} />
            </div>

            <div className="dm-setting-content">
              <h3>Privacy</h3>

              <p>Review how your DayMark data is handled.</p>
            </div>

            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* Save */}
      <div className="dm-settings-footer">
        {saved && <span className="dm-settings-saved">Preferences saved.</span>}

        <Button onClick={handleSavePreferences}>
          <Save size={17} />
          Save preferences
        </Button>
      </div>

      {/* Account */}
      <section className="dm-settings-section dm-danger-section">
        <div className="dm-section-heading">
          <div>
            <h2>Account</h2>
            <p>Actions related to your DayMark session.</p>
          </div>
        </div>

        <button
          type="button"
          className="dm-logout-action"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </section>

      {/* Change password modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change password"
        description="Enter your current password and choose a new one."
      >
        <div className="dm-password-form">
          {passwordError && (
            <div style={{ color: "var(--dm-danger-text)", marginBottom: "1rem" }}>
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div style={{ color: "var(--dm-success-text)", marginBottom: "1rem" }}>
              {passwordSuccess}
            </div>
          )}
          <div className="dm-form-group">
            <label htmlFor="currentPassword">Current password</label>

            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
            />
          </div>

          <div className="dm-form-group">
            <label htmlFor="newPassword">New password</label>

            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
            />
          </div>

          <div className="dm-form-group">
            <label htmlFor="confirmPassword">Confirm new password</label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
            />
          </div>

          <div className="dm-modal-form-actions">
            <Button
              variant="secondary"
              onClick={() => setIsPasswordModalOpen(false)}
            >
              Cancel
            </Button>

            <Button onClick={handleSavePassword}>
              <Save size={17} />
              Update password
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Settings;
