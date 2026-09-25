import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

function Calendar({ activities = {}, onDateSelect }) {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0],
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];

    // Empty cells before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [firstDayOfMonth, daysInMonth]);

  const formatDateKey = (day) => {
    const monthNumber = String(month + 1).padStart(2, "0");
    const dayNumber = String(day).padStart(2, "0");

    return `${year}-${monthNumber}-${dayNumber}`;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));

    const todayKey = today.toISOString().split("T")[0];
    setSelectedDate(todayKey);
    onDateSelect?.(todayKey);
  };

  const handleDateClick = (day) => {
    if (!day) return;

    const dateKey = formatDateKey(day);

    setSelectedDate(dateKey);
    onDateSelect?.(dateKey);
  };

  const isToday = (day) => {
    if (!day) return false;

    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!day) return false;

    return selectedDate === formatDateKey(day);
  };

  const getActivityCount = (day) => {
    if (!day) return 0;

    const dateKey = formatDateKey(day);
    const dayActivities = activities[dateKey];

    if (Array.isArray(dayActivities)) {
      return dayActivities.length;
    }

    if (typeof dayActivities === "number") {
      return dayActivities;
    }

    return 0;
  };

  return (
    <div className="dm-calendar">
      <div className="dm-calendar-header">
        <div className="dm-calendar-title">
          <div className="dm-calendar-icon">
            <CalendarDays size={20} />
          </div>

          <div>
            <h3>
              {monthName} {year}
            </h3>
            <p>View your daily activity history</p>
          </div>
        </div>

        <div className="dm-calendar-controls">
          <button
            type="button"
            onClick={goToToday}
            className="dm-calendar-today"
          >
            Today
          </button>

          <button
            type="button"
            onClick={goToPreviousMonth}
            className="dm-calendar-nav"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={goToNextMonth}
            className="dm-calendar-nav"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="dm-calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="dm-calendar-weekday">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          const activityCount = getActivityCount(day);

          return (
            <button
              key={day ? formatDateKey(day) : `empty-${index}`}
              type="button"
              className={[
                "dm-calendar-day",
                !day ? "is-empty" : "",
                isToday(day) ? "is-today" : "",
                isSelected(day) ? "is-selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={!day}
              onClick={() => handleDateClick(day)}
            >
              {day && (
                <>
                  <span className="dm-calendar-day-number">{day}</span>

                  {activityCount > 0 && (
                    <span className="dm-calendar-activity">
                      {activityCount}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
