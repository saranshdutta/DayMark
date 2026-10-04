import React, { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  Target,
  Save,
  Mail,
  BookOpen,
  Droplets,
  Moon,
  Activity,
  Shield,
} from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { Input, Select } from "../components/common/Input";

import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import userPreferenceService from "../services/userPreferenceService";

function Profile() {
  const { user } = useAuth();
  const { showToast } = useApp();

  const [formData, setFormData] = useState({
    name:               user?.name || "",
    email:              user?.email || "",
    academicYear:       "Senior (Year 4)",
    department:         "Computer Science",
    dailySleepTarget:   8.0,
    dailyStudyTarget:   180,
    dailyExerciseTarget: 45,
    dailyWaterTarget:   2.0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPreferences() {
      try {
        const res = await userPreferenceService.getUserPreferences();
        if (res?.data) {
          setFormData((prev) => ({
            ...prev,
            academicYear:        res.data.academicYear       || "Senior (Year 4)",
            department:          res.data.department         || "Computer Science",
            dailySleepTarget:    res.data.dailySleepTarget   || 8.0,
            dailyStudyTarget:    res.data.dailyStudyTarget   || 180,
            dailyExerciseTarget: res.data.dailyExerciseTarget || 45,
            dailyWaterTarget:    res.data.dailyWaterTarget   || 2.0,
          }));
        }
      } catch (error) {
        console.error(error);
      }
    }
    loadPreferences();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userPreferenceService.updateUserPreferences({
        academicYear:        formData.academicYear,
        department:          formData.department,
        dailySleepTarget:    Number(formData.dailySleepTarget),
        dailyStudyTarget:    Number(formData.dailyStudyTarget),
        dailyExerciseTarget: Number(formData.dailyExerciseTarget),
        dailyWaterTarget:    Number(formData.dailyWaterTarget),
      });
      showToast({ type: "success", title: "Profile Updated", message: "Your preferences and targets have been saved." });
    } catch (error) {
      showToast({ type: "error", title: "Error", message: "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "DM";
    return name.split(" ").map((part) => part[0]).join("").toUpperCase().slice(0, 2);
  };

  const wellnessTargets = [
    { key: "dailyStudyTarget",    label: "Study Goal",   unit: "min/day",  icon: BookOpen, step: 15,  min: 0 },
    { key: "dailyExerciseTarget", label: "Exercise Goal", unit: "min/day",  icon: Activity, step: 5,   min: 0 },
    { key: "dailySleepTarget",    label: "Sleep Target",  unit: "hrs/night",icon: Moon,     step: 0.5, min: 4 },
    { key: "dailyWaterTarget",    label: "Water Target",  unit: "L/day",    icon: Droplets, step: 0.1, min: 0 },
  ];

  return (
    <div className="dm-animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-6)" }}>
      <PageHeader
        title="Account Profile"
        subtitle="Manage your personal details and wellness targets."
      />

      {/* Hero Profile Card */}
      <div className="dm-card" style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-6)", padding: "var(--dm-space-6)" }}>
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "var(--dm-radius-full)",
              background: "linear-gradient(135deg, var(--dm-primary), var(--dm-accent-sage))",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "var(--dm-text-xl)",
              fontWeight: "var(--dm-weight-bold)",
              boxShadow: "var(--dm-shadow-md)",
            }}
          >
            {getInitials(user?.name)}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "var(--dm-text-lg)", fontWeight: "var(--dm-weight-semibold)" }}>
            {user?.name || "Student User"}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-2)", marginTop: "4px" }}>
            <Mail size={12} style={{ color: "var(--dm-text-muted)" }} />
            <span style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)" }}>{user?.email}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-2)", marginTop: "4px" }}>
            <Shield size={12} style={{ color: "var(--dm-success)" }} />
            <span style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-success)", fontWeight: "var(--dm-weight-medium)" }}>Verified Student Account</span>
          </div>
        </div>

        <div style={{
          padding: "var(--dm-space-3) var(--dm-space-4)",
          borderRadius: "var(--dm-radius-md)",
          backgroundColor: "var(--dm-primary-soft)",
          border: "1px solid var(--dm-primary-border)",
          textAlign: "center",
          minWidth: "120px",
        }}>
          <div style={{ fontSize: "var(--dm-text-lg)", fontWeight: "var(--dm-weight-bold)", color: "var(--dm-primary)" }}>2026</div>
          <div style={{ fontSize: "10px", color: "var(--dm-primary)", fontWeight: "var(--dm-weight-medium)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Cohort</div>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-5)" }}>
        {/* Personal Info */}
        <div className="dm-card">
          <div className="dm-section-header">
            <h3 className="dm-section-title">
              <User size={17} style={{ color: "var(--dm-primary)" }} /> Personal Information
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--dm-space-4)" }}>
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              disabled
              helperText="Contact support to update primary email."
            />
          </div>
        </div>

        {/* Academic Info */}
        <div className="dm-card">
          <div className="dm-section-header">
            <h3 className="dm-section-title">
              <GraduationCap size={17} style={{ color: "var(--dm-primary)" }} /> Academic Details
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--dm-space-4)" }}>
            <Select
              label="Academic Year"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
            >
              <option value="Freshman (Year 1)">Freshman (Year 1)</option>
              <option value="Sophomore (Year 2)">Sophomore (Year 2)</option>
              <option value="Junior (Year 3)">Junior (Year 3)</option>
              <option value="Senior (Year 4)">Senior (Year 4)</option>
              <option value="Graduate / Master">Graduate / Master</option>
            </Select>

            <Input
              label="Department / Major"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g. Computer Science, Bioengineering"
            />
          </div>
        </div>

        {/* Wellness Targets */}
        <div className="dm-card">
          <div className="dm-section-header">
            <h3 className="dm-section-title">
              <Target size={17} style={{ color: "var(--dm-primary)" }} /> Daily Wellness Targets
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--dm-space-4)" }}>
            {wellnessTargets.map(({ key, label, unit, icon: Icon, step, min }) => (
              <div key={key}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-2)", marginBottom: "4px" }}>
                  <Icon size={13} style={{ color: "var(--dm-text-muted)" }} />
                  <label className="dm-label">{label}</label>
                  <span style={{ fontSize: "10px", color: "var(--dm-text-muted)", marginLeft: "auto" }}>{unit}</span>
                </div>
                <input
                  type="number"
                  step={step}
                  min={min}
                  className="dm-input"
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" variant="primary" size="md" icon={Save} loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
