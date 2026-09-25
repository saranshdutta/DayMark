/*
 * DayMark Duration Formatting Utilities
 *
 * Handles activity duration, study time, exercise time,
 * and other time-based values throughout the application.
 */

/* =========================
   Format Duration
   Examples:
   45      → 45m
   60      → 1h
   125     → 2h 5m
   ========================= */

export function formatDuration(minutes) {
  const value = Number(minutes);

  if (!Number.isFinite(value) || value <= 0) {
    return "0m";
  }

  const totalMinutes = Math.round(value);

  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/* =========================
   Detailed Duration
   Examples:
   45      → 45 minutes
   125     → 2 hours 5 minutes
   ========================= */

export function formatDurationLong(minutes) {
  const value = Number(minutes);

  if (!Number.isFinite(value) || value <= 0) {
    return "0 minutes";
  }

  const totalMinutes = Math.round(value);

  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  }

  if (remainingMinutes > 0) {
    parts.push(
      `${remainingMinutes} ${remainingMinutes === 1 ? "minute" : "minutes"}`,
    );
  }

  return parts.join(" ");
}

/* =========================
   Hours + Minutes
   Example:
   125 → "2h 5m"
   ========================= */

export function formatHoursMinutes(minutes) {
  const value = Number(minutes);

  if (!Number.isFinite(value) || value <= 0) {
    return "0h 0m";
  }

  const totalMinutes = Math.round(value);

  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}

/* =========================
   Convert Hours → Minutes
   ========================= */

export function hoursToMinutes(hours) {
  const value = Number(hours);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.round(value * 60);
}

/* =========================
   Convert Minutes → Hours
   Example:
   90 → 1.5
   ========================= */

export function minutesToHours(minutes) {
  const value = Number(minutes);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return value / 60;
}

/* =========================
   Format Decimal Hours
   Example:
   1.5 → 1h 30m
   ========================= */

export function formatHours(hours) {
  const value = Number(hours);

  if (!Number.isFinite(value) || value <= 0) {
    return "0m";
  }

  return formatDuration(hoursToMinutes(value));
}

/* =========================
   Format Seconds
   Example:
   3665 → 1h 1m
   ========================= */

export function formatSeconds(seconds) {
  const value = Number(seconds);

  if (!Number.isFinite(value) || value <= 0) {
    return "0m";
  }

  const totalMinutes = Math.floor(value / 60);

  return formatDuration(totalMinutes);
}

/* =========================
   Format Duration For Timer
   Example:
   3665 → 01:01:05
   ========================= */

export function formatTimer(seconds) {
  const value = Number(seconds);

  if (!Number.isFinite(value) || value < 0) {
    return "00:00:00";
  }

  const totalSeconds = Math.floor(value);

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const remainingSeconds = totalSeconds % 60;

  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(remainingSeconds).padStart(2, "0"),
  ].join(":");
}

/* =========================
   Duration Difference
   ========================= */

export function getDurationDifference(currentMinutes, targetMinutes) {
  const current = Number(currentMinutes) || 0;
  const target = Number(targetMinutes) || 0;

  return Math.max(target - current, 0);
}

/* =========================
   Check Duration Target
   ========================= */

export function hasReachedDurationTarget(currentMinutes, targetMinutes) {
  const current = Number(currentMinutes) || 0;
  const target = Number(targetMinutes) || 0;

  return current >= target;
}

/* =========================
   Duration Percentage
   ========================= */

export function calculateDurationPercentage(currentMinutes, targetMinutes) {
  const current = Number(currentMinutes) || 0;
  const target = Number(targetMinutes) || 0;

  if (target <= 0) {
    return 0;
  }

  return Math.min(Math.round((current / target) * 100), 100);
}
