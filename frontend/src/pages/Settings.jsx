import React, { useState } from "react";
import {
  Sun, Moon, Globe, Bell, Lock, Check, ShieldCheck, Palette, Volume2,
} from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";

import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

const navItems = [
  { id: "appearance",    label: "Appearance",    icon: Palette       },
  { id: "notifications", label: "Notifications", icon: Bell          },
  { id: "security",      label: "Security",      icon: Lock          },
  { id: "general",       label: "General",       icon: Globe         },
];

function Settings() {
  const { theme, setTheme, showToast } = useApp();
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState("appearance");

  const [passData, setPassData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passLoading, setPassLoading] = useState(false);

  const [notifs, setNotifs] = useState({
    dailyReminder:  true,
    streakAlert:    true,
    goalMilestone:  true,
    wellnessTip:    false,
  });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      showToast({ type: "error", title: "Mismatch", message: "New passwords do not match." });
      return;
    }
    if (passData.newPassword.length < 8) {
      showToast({ type: "error", title: "Too short", message: "Password must be at least 8 characters." });
      return;
    }
    setPassLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword,
      });
      setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showToast({ type: "success", title: "Password Updated", message: "Your password has been changed successfully." });
    } catch (error) {
      showToast({ type: "error", title: "Error", message: error.response?.data?.message || "Failed to update password." });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="dm-animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-6)" }}>
      <PageHeader
        title="Settings"
        subtitle="Manage appearance, notifications, and account security."
      />

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "var(--dm-space-5)", alignItems: "start" }}>
        {/* Left nav */}
        <div className="dm-card" style={{ padding: "var(--dm-space-2)", position: "sticky", top: "calc(var(--dm-header-height) + var(--dm-space-4))" }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {navItems.map(({ id, label, icon: Icon }) => {
              const active = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--dm-space-3)",
                    padding: "9px 12px",
                    borderRadius: "var(--dm-radius-sm)",
                    border: "none",
                    background: active ? "var(--dm-primary-soft)" : "transparent",
                    color: active ? "var(--dm-primary)" : "var(--dm-text-secondary)",
                    fontWeight: active ? "var(--dm-weight-semibold)" : "var(--dm-weight-medium)",
                    fontSize: "var(--dm-text-sm)",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all var(--dm-transition-fast)",
                    borderLeft: active ? "2px solid var(--dm-primary)" : "2px solid transparent",
                  }}
                >
                  <Icon size={15} style={{ color: active ? "var(--dm-primary)" : "var(--dm-text-muted)" }} />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-5)" }}>

          {/* ── APPEARANCE ── */}
          {activeSection === "appearance" && (
            <div className="dm-card">
              <div className="dm-section-header">
                <h3 className="dm-section-title">
                  <Palette size={17} style={{ color: "var(--dm-primary)" }} />
                  Theme Preference
                </h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--dm-space-3)" }}>
                {[
                  { value: "light",  label: "Light Mode",      icon: Sun,  hint: "Clean & bright"       },
                  { value: "dark",   label: "Dark Mode",        icon: Moon, hint: "Easy on the eyes"     },
                  { value: "system", label: "System Default",   icon: Globe,hint: "Follows device setting"},
                ].map(({ value, label, icon: Icon, hint }) => {
                  const isActive = theme === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTheme(value)}
                      style={{
                        padding: "var(--dm-space-5) var(--dm-space-4)",
                        borderRadius: "var(--dm-radius-md)",
                        border: isActive ? "2px solid var(--dm-primary)" : "1px solid var(--dm-border)",
                        backgroundColor: isActive ? "var(--dm-primary-soft)" : "var(--dm-surface-subtle)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "var(--dm-space-2)",
                        transition: "all var(--dm-transition-fast)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {isActive && (
                        <span style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          backgroundColor: "var(--dm-primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <Check size={10} color="#fff" />
                        </span>
                      )}
                      <div style={{
                        width: "40px", height: "40px",
                        borderRadius: "var(--dm-radius-sm)",
                        backgroundColor: isActive ? "var(--dm-primary)" : "var(--dm-surface)",
                        color: isActive ? "#fff" : "var(--dm-text-muted)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon size={20} />
                      </div>
                      <span style={{ fontSize: "var(--dm-text-sm)", fontWeight: isActive ? "var(--dm-weight-semibold)" : "var(--dm-weight-medium)", color: isActive ? "var(--dm-primary)" : "var(--dm-text-primary)" }}>
                        {label}
                      </span>
                      <span style={{ fontSize: "10px", color: "var(--dm-text-muted)" }}>{hint}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeSection === "notifications" && (
            <div className="dm-card">
              <div className="dm-section-header">
                <h3 className="dm-section-title">
                  <Bell size={17} style={{ color: "var(--dm-primary)" }} /> Notification Preferences
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { id: "dailyReminder",  label: "Daily Activity Reminder", desc: "Remind if no activities logged by 8:00 PM."       },
                  { id: "streakAlert",    label: "Streak Preservation",      desc: "Alert before your activity streak breaks."        },
                  { id: "goalMilestone",  label: "Goal Milestone",           desc: "Celebrate 50%, 75%, and 100% goal achievements."  },
                  { id: "wellnessTip",    label: "Wellness Tips",            desc: "Daily micro-insights on sleep, hydration & mood." },
                ].map(({ id, label, desc }, i, arr) => (
                  <div
                    key={id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "var(--dm-space-4) 0",
                      borderBottom: i < arr.length - 1 ? "1px solid var(--dm-border)" : "none",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "var(--dm-text-sm)", fontWeight: "var(--dm-weight-medium)", color: "var(--dm-text-primary)" }}>
                        {label}
                      </div>
                      <div style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)", marginTop: "2px" }}>
                        {desc}
                      </div>
                    </div>

                    {/* Custom Toggle */}
                    <button
                      type="button"
                      onClick={() => setNotifs((prev) => ({ ...prev, [id]: !prev[id] }))}
                      style={{
                        position: "relative",
                        width: "40px",
                        height: "22px",
                        borderRadius: "var(--dm-radius-full)",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: notifs[id] ? "var(--dm-primary)" : "var(--dm-surface-hover)",
                        flexShrink: 0,
                        transition: "background-color var(--dm-transition-fast)",
                      }}
                    >
                      <span style={{
                        position: "absolute",
                        top: "3px",
                        left: notifs[id] ? "20px" : "3px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        transition: "left var(--dm-transition-fast)",
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECURITY ── */}
          {activeSection === "security" && (
            <div className="dm-card">
              <div className="dm-section-header">
                <h3 className="dm-section-title">
                  <ShieldCheck size={17} style={{ color: "var(--dm-primary)" }} /> Change Password
                </h3>
              </div>

              <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-4)" }}>
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="Enter your current password"
                  value={passData.currentPassword}
                  onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                  required
                  autoComplete="current-password"
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--dm-space-3)" }}>
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={passData.newPassword}
                    onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                    required
                    autoComplete="new-password"
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Repeat new password"
                    value={passData.confirmPassword}
                    onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button type="submit" variant="primary" size="md" loading={passLoading}>
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* ── GENERAL ── */}
          {activeSection === "general" && (
            <div className="dm-card">
              <div className="dm-section-header">
                <h3 className="dm-section-title">
                  <Globe size={17} style={{ color: "var(--dm-primary)" }} /> General Preferences
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-5)" }}>
                <div style={{
                  padding: "var(--dm-space-4)",
                  borderRadius: "var(--dm-radius-sm)",
                  border: "1px solid var(--dm-border)",
                  backgroundColor: "var(--dm-surface-subtle)",
                }}>
                  <div style={{ fontSize: "var(--dm-text-sm)", fontWeight: "var(--dm-weight-medium)", color: "var(--dm-text-primary)", marginBottom: "4px" }}>
                    Default Timezone
                  </div>
                  <div style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)" }}>
                    Detected automatically from your browser.
                  </div>
                  <div style={{ fontSize: "var(--dm-text-sm)", fontWeight: "var(--dm-weight-semibold)", color: "var(--dm-primary)", marginTop: "6px" }}>
                    {Intl.DateTimeFormat().resolvedOptions().timeZone}
                  </div>
                </div>

                <div style={{
                  padding: "var(--dm-space-4)",
                  borderRadius: "var(--dm-radius-sm)",
                  border: "1px solid var(--dm-danger-border)",
                  backgroundColor: "var(--dm-danger-soft)",
                }}>
                  <div style={{ fontSize: "var(--dm-text-sm)", fontWeight: "var(--dm-weight-semibold)", color: "var(--dm-danger)", marginBottom: "4px" }}>
                    Danger Zone
                  </div>
                  <p style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)", marginBottom: "var(--dm-space-3)" }}>
                    Signing out will end your session. All local data is retained on the server.
                  </p>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => { logout(); window.location.href = "/login"; }}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
