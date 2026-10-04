import React, { useState, useEffect } from "react";
import {
  HeartPulse,
  Smile,
  Moon,
  Droplets,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { Input, Textarea, Select } from "../components/common/Input";
import { ProgressBar } from "../components/common/Badge";

import wellnessService from "../services/wellnessService";
import sleepService from "../services/sleepService";
import hydrationService from "../services/hydrationService";
import { useApp } from "../context/AppContext";

const moodOptions = [
  { value: "VERY_LOW", label: "Low",   icon: "😔", color: "var(--dm-danger)"  },
  { value: "LOW",      label: "Muted", icon: "😕", color: "var(--dm-warning)" },
  { value: "OKAY",     label: "Okay",  icon: "😐", color: "var(--dm-text-muted)" },
  { value: "GOOD",     label: "Good",  icon: "🙂", color: "var(--dm-success)" },
  { value: "GREAT",    label: "Great", icon: "😊", color: "var(--dm-primary)" },
];

const energyOptions = [
  { value: "LOW",    label: "Low Energy" },
  { value: "MEDIUM", label: "Moderate"   },
  { value: "HIGH",   label: "High Energy"},
];

const stressOptions = [
  { value: "LOW",    label: "Low Stress"  },
  { value: "MEDIUM", label: "Moderate"    },
  { value: "HIGH",   label: "High Stress" },
];

const waterAmounts = [
  { label: "+100ml", amount: 0.10 },
  { label: "+250ml", amount: 0.25 },
  { label: "+500ml", amount: 0.50 },
  { label: "+750ml", amount: 0.75 },
];

function Wellness() {
  const { showToast } = useApp();

  const [selectedMood, setSelectedMood]     = useState("GOOD");
  const [selectedEnergy, setSelectedEnergy] = useState("MEDIUM");
  const [selectedStress, setSelectedStress] = useState("LOW");
  const [moodNote, setMoodNote]             = useState("");
  const [moodLoading, setMoodLoading]       = useState(false);
  const [moodSaved, setMoodSaved]           = useState(false);

  // Sleep state
  const [bedtime, setBedtime]           = useState("23:00");
  const [wakeTime, setWakeTime]         = useState("07:00");
  const [sleepQuality, setSleepQuality] = useState("GOOD");
  const [sleepLoading, setSleepLoading] = useState(false);

  // Hydration state
  const [hydrationData, setHydrationData]     = useState({ total: 0, target: 2.0 });
  const [hydrationLoading, setHydrationLoading] = useState(false);

  const fetchWellnessData = async () => {
    try {
      const [todayMood, hydrationRes, sleepRes] = await Promise.all([
        wellnessService.getTodayCheckIn(),
        hydrationService.getTodayHydration(),
        sleepService.getSleepRecords({ limit: 5 }),
      ]);

      if (todayMood?.data) {
        setSelectedMood(todayMood.data.mood || "GOOD");
        setSelectedEnergy(todayMood.data.energy || "MEDIUM");
        setSelectedStress(todayMood.data.stress || "LOW");
        setMoodNote(todayMood.data.note || "");
        setMoodSaved(true);
      }

      if (hydrationRes?.data) {
        setHydrationData(hydrationRes.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWellnessData();
  }, []);

  const handleMoodSubmit = async (e) => {
    e.preventDefault();
    setMoodLoading(true);
    try {
      await wellnessService.createCheckIn({
        mood: selectedMood,
        energy: selectedEnergy,
        stress: selectedStress,
        note: moodNote,
      });
      setMoodSaved(true);
      showToast({ type: "success", title: "Check-in Saved ✓", message: "Your wellness status has been logged." });
    } catch (error) {
      showToast({ type: "error", title: "Error", message: "Failed to save wellness check-in." });
    } finally {
      setMoodLoading(false);
    }
  };

  const handleSleepSubmit = async (e) => {
    e.preventDefault();
    setSleepLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const bedDate  = new Date(`${today}T${bedtime}:00`);
      const wakeDate = new Date(`${today}T${wakeTime}:00`);
      if (wakeDate <= bedDate) wakeDate.setDate(wakeDate.getDate() + 1);

      await sleepService.createSleepRecord({
        bedtime:   bedDate.toISOString(),
        wakeTime:  wakeDate.toISOString(),
        quality:   sleepQuality,
        sleepDate: new Date().toISOString(),
      });
      showToast({ type: "success", title: "Sleep Logged", message: "Sleep duration and quality saved." });
      fetchWellnessData();
    } catch (error) {
      showToast({ type: "error", title: "Error", message: "Failed to log sleep record." });
    } finally {
      setSleepLoading(false);
    }
  };

  const handleAddWater = async (amountLiters) => {
    setHydrationLoading(true);
    try {
      await hydrationService.logHydration({ amount: amountLiters });
      setHydrationData((prev) => ({
        ...prev,
        total: Math.round(((prev.total || 0) + amountLiters) * 100) / 100,
      }));
      showToast({ type: "success", title: "Water Logged", message: `+${Math.round(amountLiters * 1000)}ml added.` });
    } catch (error) {
      showToast({ type: "error", title: "Error", message: "Failed to log hydration." });
    } finally {
      setHydrationLoading(false);
    }
  };

  const hydrationPct = Math.round(((hydrationData.total || 0) / (hydrationData.target || 2)) * 100);
  const currentMoodConfig = moodOptions.find((m) => m.value === selectedMood);

  return (
    <div className="dm-animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-6)" }}>
      {/* Page Header */}
      <PageHeader
        title="Wellness"
        subtitle="Check in with yourself and track physical and mental harmony."
      />

      {/* ROW 1: Mood Check-in + Hydration side-by-side */}
      <div style={{ display: "grid", gridTemplateColumns: "7fr 5fr", gap: "var(--dm-space-5)" }}>

        {/* Mood Check-in Card */}
        <div className="dm-card">
          <div className="dm-section-header">
            <h2 className="dm-section-title">
              <Smile size={18} style={{ color: "var(--dm-primary)" }} /> Daily Check-in
            </h2>
            {moodSaved && (
              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "var(--dm-text-xs)", color: "var(--dm-success)", fontWeight: "var(--dm-weight-medium)" }}>
                <CheckCircle2 size={13} /> Saved today
              </span>
            )}
          </div>

          <form onSubmit={handleMoodSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-5)" }}>
            {/* Mood Selector */}
            <div>
              <label className="dm-label" style={{ marginBottom: "var(--dm-space-3)", display: "block" }}>
                How are you feeling today?
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "var(--dm-space-2)" }}>
                {moodOptions.map((opt) => {
                  const isSelected = selectedMood === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setSelectedMood(opt.value); setMoodSaved(false); }}
                      style={{
                        padding: "var(--dm-space-3) var(--dm-space-2)",
                        borderRadius: "var(--dm-radius-md)",
                        border: isSelected ? `2px solid ${opt.color}` : "1px solid var(--dm-border)",
                        backgroundColor: isSelected ? "var(--dm-surface-subtle)" : "var(--dm-surface)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all var(--dm-transition-fast)",
                        transform: isSelected ? "translateY(-2px)" : "none",
                        boxShadow: isSelected ? `0 4px 12px ${opt.color}22` : "none",
                      }}
                    >
                      <span style={{ fontSize: "24px", lineHeight: 1 }}>{opt.icon}</span>
                      <span style={{
                        fontSize: "var(--dm-text-xs)",
                        fontWeight: isSelected ? "var(--dm-weight-semibold)" : "var(--dm-weight-medium)",
                        color: isSelected ? opt.color : "var(--dm-text-secondary)",
                      }}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Energy & Stress Dropdowns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--dm-space-3)" }}>
              <Select label="Energy Level" value={selectedEnergy} onChange={(e) => setSelectedEnergy(e.target.value)}>
                {energyOptions.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
              </Select>

              <Select label="Stress Factor" value={selectedStress} onChange={(e) => setSelectedStress(e.target.value)}>
                {stressOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </Select>
            </div>

            <Textarea
              label="Reflection Note (optional)"
              placeholder="Any thoughts, exam stress highlights, or positives to remember..."
              rows={3}
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="primary" size="md" loading={moodLoading}>
                Save Check-in
              </Button>
            </div>
          </form>
        </div>

        {/* Right column: Hydration + Insight */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-5)" }}>

          {/* Hydration Tracker */}
          <div className="dm-card">
            <div className="dm-section-header">
              <h2 className="dm-section-title">
                <Droplets size={18} style={{ color: "var(--dm-info)" }} /> Hydration
              </h2>
              <span style={{ fontSize: "var(--dm-text-xs)", fontWeight: "var(--dm-weight-bold)", color: "var(--dm-info)" }}>
                {hydrationPct}%
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-4)" }}>
              {/* Big number */}
              <div style={{ textAlign: "center", padding: "var(--dm-space-4) 0" }}>
                <div style={{ fontSize: "var(--dm-text-3xl)", fontWeight: "var(--dm-weight-bold)", color: "var(--dm-text-primary)", lineHeight: 1 }}>
                  {(hydrationData.total || 0).toFixed(1)}L
                </div>
                <div style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)", marginTop: "4px" }}>
                  of {hydrationData.target || 2.0}L daily goal
                </div>
              </div>

              <ProgressBar value={hydrationData.total || 0} max={hydrationData.target || 2} variant="info" height={8} />

              {/* Quick-add buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--dm-space-2)" }}>
                {waterAmounts.map(({ label, amount }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleAddWater(amount)}
                    disabled={hydrationLoading}
                    style={{
                      padding: "8px",
                      borderRadius: "var(--dm-radius-sm)",
                      border: "1px solid var(--dm-info-border)",
                      backgroundColor: "var(--dm-info-soft)",
                      color: "var(--dm-info)",
                      fontSize: "var(--dm-text-xs)",
                      fontWeight: "var(--dm-weight-semibold)",
                      cursor: "pointer",
                      transition: "all var(--dm-transition-fast)",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Wellness Insight */}
          <div className="dm-card" style={{ backgroundColor: "var(--dm-primary-soft)", borderColor: "var(--dm-primary-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-2)", marginBottom: "var(--dm-space-2)" }}>
              <Sparkles size={15} style={{ color: "var(--dm-primary)" }} />
              <h3 style={{ fontSize: "var(--dm-text-xs)", fontWeight: "var(--dm-weight-bold)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--dm-primary)" }}>
                Pattern Insight
              </h3>
            </div>
            <p style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-secondary)", lineHeight: "1.6" }}>
              You report higher focus and lower stress on days when you sleep at least 7.5 hours and hit an academic study goal.
            </p>
          </div>
        </div>
      </div>

      {/* ROW 2: Sleep Log */}
      <div className="dm-card">
        <div className="dm-section-header">
          <h2 className="dm-section-title">
            <Moon size={18} style={{ color: "var(--dm-warning)" }} /> Sleep Log &amp; Quality
          </h2>
        </div>

        <form onSubmit={handleSleepSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--dm-space-4)", alignItems: "flex-end" }}>
          <Input
            label="Bedtime"
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            required
          />

          <Input
            label="Wake Time"
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            required
          />

          <Select
            label="Quality Rating"
            value={sleepQuality}
            onChange={(e) => setSleepQuality(e.target.value)}
          >
            <option value="POOR">Poor</option>
            <option value="FAIR">Fair</option>
            <option value="GOOD">Good</option>
            <option value="EXCELLENT">Excellent</option>
          </Select>

          <Button type="submit" variant="primary" size="md" loading={sleepLoading}>
            Log Sleep
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Wellness;
