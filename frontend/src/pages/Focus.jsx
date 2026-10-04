import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Check, Timer, Sparkles, Coffee, Brain } from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Badge } from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";

import focusService from "../services/focusService";
import { useApp } from "../context/AppContext";

const MODES = {
  FOCUS:       { label: "Focus",       minutes: 25, color: "var(--dm-primary)",  icon: Brain },
  SHORT_BREAK: { label: "Short Break", minutes: 5,  color: "var(--dm-success)",  icon: Coffee },
  LONG_BREAK:  { label: "Long Break",  minutes: 15, color: "var(--dm-info)",     icon: Coffee },
};

export function Focus() {
  const { showToast } = useApp();

  const [mode, setMode] = useState("FOCUS");
  const [taskName, setTaskName] = useState("Exam Study Session");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({ totalMinutes: 0, completedCount: 0 });

  const timerRef = useRef(null);
  const totalDuration = MODES[mode].minutes * 60;
  const progressPercent = Math.round(((totalDuration - timeLeft) / totalDuration) * 100);

  // SVG circular progress
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const fetchFocusHistory = async () => {
    try {
      const [res, statsRes] = await Promise.all([
        focusService.getFocusSessions({ limit: 10 }),
        focusService.getFocusStats({ range: "7d" }),
      ]);
      if (res?.data) setSessions(res.data);
      if (statsRes?.data) {
        setStats({
          totalMinutes: statsRes.data.totalMinutes || 0,
          completedCount: statsRes.data.completedCount || 0,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFocusHistory();
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleCompleteSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleModeChange = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode].minutes * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODES[mode].minutes * 60);
  };

  const handleCompleteSession = async () => {
    try {
      await focusService.createFocusSession({
        taskName: taskName || "Focus Session",
        duration: Math.round(totalDuration / 60),
        status: "COMPLETED",
        startTime: new Date(Date.now() - totalDuration * 1000).toISOString(),
        endTime: new Date().toISOString(),
      });
      showToast({ type: "success", title: "Session Complete! 🎉", message: `${MODES[mode].label} session saved.` });
      fetchFocusHistory();
    } catch (error) {
      console.error(error);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const modeColor = MODES[mode].color;

  return (
    <div className="dm-animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-6)" }}>
      {/* Page Header */}
      <PageHeader
        title="Focus Mode"
        subtitle="Distraction-free Pomodoro sessions to maximize deep work."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "var(--dm-space-5)", alignItems: "start" }}>
        {/* Left Timer Panel */}
        <div style={{ gridColumn: "span 8" }} className="dm-card">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "var(--dm-space-8) var(--dm-space-4)" }}>

            {/* Mode Selector */}
            <div className="dm-tabs" style={{ marginBottom: "var(--dm-space-8)" }}>
              {Object.entries(MODES).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  className={`dm-tab ${mode === key ? "dm-tab-active" : ""}`}
                  onClick={() => handleModeChange(key)}
                >
                  {cfg.label}
                </button>
              ))}
            </div>

            {/* Circular Timer Display */}
            <div style={{ position: "relative", width: "224px", height: "224px", marginBottom: "var(--dm-space-8)" }}>
              {/* SVG Ring */}
              <svg
                width="224"
                height="224"
                style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}
              >
                {/* Track */}
                <circle
                  cx="112" cy="112" r={radius}
                  fill="none"
                  stroke="var(--dm-surface-subtle)"
                  strokeWidth="8"
                />
                {/* Progress */}
                <circle
                  cx="112" cy="112" r={radius}
                  fill="none"
                  stroke={modeColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: "stroke-dashoffset 1s linear, stroke var(--dm-transition-base)" }}
                />
              </svg>

              {/* Inner content */}
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: "4px",
              }}>
                <div style={{
                  fontSize: "48px",
                  fontWeight: "var(--dm-weight-bold)",
                  fontFamily: "var(--dm-font-mono)",
                  color: "var(--dm-text-primary)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}>
                  {formattedTime}
                </div>
                <span style={{
                  fontSize: "var(--dm-text-xs)",
                  color: modeColor,
                  fontWeight: "var(--dm-weight-semibold)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}>
                  {MODES[mode].label}
                </span>
              </div>
            </div>

            {/* Task Name Field */}
            <div style={{ width: "100%", maxWidth: "320px", marginBottom: "var(--dm-space-6)" }}>
              <Input
                placeholder="What task are you working on?"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>

            {/* Timer Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-3)" }}>
              <Button
                variant={isRunning ? "secondary" : "primary"}
                size="lg"
                icon={isRunning ? Pause : Play}
                onClick={() => setIsRunning(!isRunning)}
                style={{ minWidth: "148px" }}
              >
                {isRunning ? "Pause" : "Start Session"}
              </Button>

              <Button variant="outline" size="lg" icon={RotateCcw} onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Right Stats & History Panel */}
        <div style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", gap: "var(--dm-space-5)" }}>
          {/* Stats Card */}
          <div className="dm-card">
            <div className="dm-section-header" style={{ marginBottom: "var(--dm-space-4)" }}>
              <h3 className="dm-section-title">
                <Sparkles size={16} style={{ color: "var(--dm-primary)" }} />
                Week Stats
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-4)" }}>
              <div style={{
                padding: "var(--dm-space-3) var(--dm-space-4)",
                borderRadius: "var(--dm-radius-sm)",
                backgroundColor: "var(--dm-primary-soft)",
                border: "1px solid var(--dm-primary-border)",
              }}>
                <span style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-primary)", fontWeight: "var(--dm-weight-medium)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Focus</span>
                <div style={{ fontSize: "var(--dm-text-xl)", fontWeight: "var(--dm-weight-bold)", color: "var(--dm-primary)", lineHeight: 1.2, marginTop: "2px" }}>
                  {stats.totalMinutes >= 60
                    ? `${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`
                    : `${stats.totalMinutes}m`}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)" }}>Completed sessions</span>
                <span style={{ fontSize: "var(--dm-text-md)", fontWeight: "var(--dm-weight-bold)", color: "var(--dm-text-primary)" }}>
                  {stats.completedCount}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="dm-card">
            <h3 style={{ fontSize: "var(--dm-text-sm)", fontWeight: "var(--dm-weight-semibold)", marginBottom: "var(--dm-space-3)" }}>
              Recent Sessions
            </h3>

            {sessions.length === 0 ? (
              <EmptyState
                icon={Timer}
                title="No sessions yet"
                message="Start a focus timer to build your history."
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-2)" }}>
                {sessions.slice(0, 6).map((s) => (
                  <div
                    key={s.id}
                    style={{
                      padding: "var(--dm-space-2) var(--dm-space-3)",
                      borderRadius: "var(--dm-radius-sm)",
                      border: "1px solid var(--dm-border)",
                      backgroundColor: "var(--dm-surface-subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "var(--dm-text-xs)", fontWeight: "var(--dm-weight-medium)", display: "block", color: "var(--dm-text-primary)" }}>
                        {s.taskName || "Focus Session"}
                      </span>
                      <span style={{ fontSize: "10px", color: "var(--dm-text-muted)" }}>
                        {new Date(s.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <Badge variant="success">{s.duration}m</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Focus;
