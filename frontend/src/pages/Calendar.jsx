import React, { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Activity,
  Clock,
  Droplets,
  Timer,
  Moon,
} from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { IconButton, Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import Drawer from "../components/common/Drawer";
import EmptyState from "../components/common/EmptyState";

import { useApp } from "../context/AppContext";

function Calendar() {
  const { activities } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Map activities by date (YYYY-MM-DD)
  const activitiesByDate = useMemo(() => {
    const map = {};
    activities.forEach((item) => {
      if (!item.date && !item.createdAt) return;
      const dateKey = (item.date || item.createdAt).split("T")[0];
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(item);
    });
    return map;
  }, [activities]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (dayNumber) => {
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(dayNumber).padStart(2, "0");
    const dateKey = `${year}-${monthStr}-${dayStr}`;

    setSelectedDay({
      dateStr: dateKey,
      displayDate: new Date(year, month, dayNumber).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      logs: activitiesByDate[dateKey] || [],
    });
    setDrawerOpen(true);
  };

  // Day summary stats for drawer
  const dayStats = useMemo(() => {
    if (!selectedDay) return { totalMins: 0, academicMins: 0, healthMins: 0 };
    const logs = selectedDay.logs;
    const totalMins = logs.reduce((sum, l) => sum + (Number(l.duration) || 0), 0);
    const academicMins = logs
      .filter((l) => (l.category || l.activity?.category) === "ACADEMIC")
      .reduce((sum, l) => sum + (Number(l.duration) || 0), 0);
    const healthMins = logs
      .filter((l) => (l.category || l.activity?.category) === "HEALTH")
      .reduce((sum, l) => sum + (Number(l.duration) || 0), 0);

    return { totalMins, academicMins, healthMins };
  }, [selectedDay]);

  const formatDuration = (mins) => {
    if (!mins) return "0m";
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${mins}m`;
  };

  return (
    <div className="dm-animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-6)" }}>
      {/* Page Header */}
      <PageHeader
        title="Calendar"
        subtitle="Review historical activities and daily productivity summaries."
      />

      {/* Month Navigator Toolbar */}
      <div className="dm-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: "var(--dm-text-lg)", fontWeight: "var(--dm-weight-semibold)" }}>
          {monthNames[month]} {year}
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-2)" }}>
          <Button variant="secondary" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <IconButton icon={ChevronLeft} size="md" title="Previous Month" onClick={handlePrevMonth} />
          <IconButton icon={ChevronRight} size="md" title="Next Month" onClick={handleNextMonth} />
        </div>
      </div>

      {/* Month Grid */}
      <div className="dm-card" style={{ padding: "var(--dm-space-4)" }}>
        {/* Day Header Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", paddingBottom: "var(--dm-space-3)", borderBottom: "1px solid var(--dm-border)", fontSize: "var(--dm-text-xs)", fontWeight: "var(--dm-weight-semibold)", color: "var(--dm-text-muted)" }}>
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginTop: "var(--dm-space-2)" }}>
          {/* Empty lead cells */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} style={{ height: "80px", borderRadius: "var(--dm-radius-xs)", backgroundColor: "var(--dm-surface-subtle)", opacity: 0.4 }} />
          ))}

          {/* Month Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const monthStr = String(month + 1).padStart(2, "0");
            const dayStr = String(dayNum).padStart(2, "0");
            const dateKey = `${year}-${monthStr}-${dayStr}`;

            const dayLogs = activitiesByDate[dateKey] || [];
            const hasLogs = dayLogs.length > 0;
            const todayStr = new Date().toISOString().split("T")[0];
            const isToday = dateKey === todayStr;

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => handleDayClick(dayNum)}
                style={{
                  height: "80px",
                  borderRadius: "var(--dm-radius-sm)",
                  border: isToday ? "2px solid var(--dm-primary)" : "1px solid var(--dm-border)",
                  backgroundColor: isToday ? "var(--dm-primary-soft)" : "var(--dm-surface)",
                  padding: "6px 8px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all var(--dm-transition-fast)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "var(--dm-text-xs)", fontWeight: isToday ? "var(--dm-weight-bold)" : "var(--dm-weight-medium)", color: isToday ? "var(--dm-primary)" : "var(--dm-text-primary)" }}>
                    {dayNum}
                  </span>
                  {hasLogs && (
                    <span style={{ fontSize: "10px", fontWeight: "var(--dm-weight-bold)", color: "var(--dm-primary)", backgroundColor: "var(--dm-primary-soft)", padding: "1px 5px", borderRadius: "var(--dm-radius-full)" }}>
                      {dayLogs.length}
                    </span>
                  )}
                </div>

                {hasLogs ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
                    {dayLogs.slice(0, 3).map((l, idx) => (
                      <span key={idx} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--dm-primary)" }} />
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: "10px", color: "var(--dm-text-muted)" }}>—</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Detail Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedDay?.displayDate || "Daily Summary"}
        subtitle="Activities logged for this day"
        size="420px"
      >
        {selectedDay && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-5)" }}>
            {/* Quick Stat Summary */}
            <div className="dm-card" style={{ backgroundColor: "var(--dm-surface-subtle)" }}>
              <h4 style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)", textTransform: "uppercase", marginBottom: "var(--dm-space-2)" }}>
                Day Summary
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--dm-space-3)" }}>
                <div>
                  <span style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-secondary)" }}>Total Active Time</span>
                  <div style={{ fontSize: "var(--dm-text-md)", fontWeight: "var(--dm-weight-bold)", color: "var(--dm-text-primary)" }}>
                    {formatDuration(dayStats.totalMins)}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-secondary)" }}>Study Time</span>
                  <div style={{ fontSize: "var(--dm-text-md)", fontWeight: "var(--dm-weight-bold)", color: "var(--dm-primary)" }}>
                    {formatDuration(dayStats.academicMins)}
                  </div>
                </div>
              </div>
            </div>

            {/* Log List */}
            <div>
              <h4 style={{ fontSize: "var(--dm-text-sm)", fontWeight: "var(--dm-weight-semibold)", marginBottom: "var(--dm-space-3)" }}>
                Activity Logs ({selectedDay.logs.length})
              </h4>

              {selectedDay.logs.length === 0 ? (
                <EmptyState
                  icon={CalendarIcon}
                  title="No activities recorded"
                  message="No activities were logged on this date."
                />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-2)" }}>
                  {selectedDay.logs.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "var(--dm-space-3)",
                        borderRadius: "var(--dm-radius-sm)",
                        border: "1px solid var(--dm-border)",
                        backgroundColor: "var(--dm-surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "var(--dm-text-sm)", fontWeight: "var(--dm-weight-medium)", color: "var(--dm-text-primary)", display: "block" }}>
                          {item.title || item.activity?.name}
                        </span>
                        <span style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)" }}>
                          {item.category || item.activity?.category}
                        </span>
                      </div>
                      <span style={{ fontSize: "var(--dm-text-xs)", fontWeight: "var(--dm-weight-semibold)", color: "var(--dm-primary)" }}>
                        {formatDuration(item.duration)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

export default Calendar;
