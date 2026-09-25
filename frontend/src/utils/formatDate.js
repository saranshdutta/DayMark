/*
 * DayMark Date Formatting Utilities
 *
 * All date-related formatting is kept here so that
 * components don't need to repeat date logic.
 */

/* =========================
   Basic Date Conversion
   ========================= */

export function toDate(date) {
  if (!date) return null;

  const parsedDate = date instanceof Date ? date : new Date(date);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

/* =========================
   Date Key
   ========================= */

export function getDateKey(date) {
  const parsedDate = toDate(date);

  if (!parsedDate) return "";

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================
   Today's Date
   ========================= */

export function getToday() {
  return getDateKey(new Date());
}

/* =========================
   Display Date
   Example:
   September 19, 2026
   ========================= */

export function formatDate(date) {
  const parsedDate = toDate(date);

  if (!parsedDate) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* =========================
   Short Date
   Example:
   19 Sep 2026
   ========================= */

export function formatShortDate(date) {
  const parsedDate = toDate(date);

  if (!parsedDate) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* =========================
   Date Without Year
   Example:
   19 September
   ========================= */

export function formatDayMonth(date) {
  const parsedDate = toDate(date);

  if (!parsedDate) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
  });
}

/* =========================
   Day Name
   Example:
   Saturday
   ========================= */

export function formatDayName(date) {
  const parsedDate = toDate(date);

  if (!parsedDate) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    weekday: "long",
  });
}

/* =========================
   Short Day Name
   Example:
   Sat
   ========================= */

export function formatShortDayName(date) {
  const parsedDate = toDate(date);

  if (!parsedDate) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    weekday: "short",
  });
}

/* =========================
   Month Name
   Example:
   September 2026
   ========================= */

export function formatMonthYear(date) {
  const parsedDate = toDate(date);

  if (!parsedDate) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

/* =========================
   Time
   Example:
   6:30 PM
   ========================= */

export function formatTime(date) {
  const parsedDate = toDate(date);

  if (!parsedDate) return "—";

  return parsedDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/* =========================
   Date + Time
   Example:
   19 Sep 2026, 6:30 PM
   ========================= */

export function formatDateTime(date) {
  const parsedDate = toDate(date);

  if (!parsedDate) return "—";

  return `${formatShortDate(parsedDate)}, ${formatTime(parsedDate)}`;
}

/* =========================
   Relative Date
   Examples:
   Today
   Yesterday
   3 days ago
   ========================= */

export function formatRelativeDate(date) {
  const parsedDate = toDate(date);

  if (!parsedDate) return "—";

  const today = new Date();

  const todayKey = getDateKey(today);
  const dateKey = getDateKey(parsedDate);

  if (dateKey === todayKey) {
    return "Today";
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateKey === getDateKey(yesterday)) {
    return "Yesterday";
  }

  const difference = Math.floor(
    (new Date(todayKey) - new Date(dateKey)) / (1000 * 60 * 60 * 24),
  );

  if (difference > 0 && difference < 7) {
    return `${difference} days ago`;
  }

  return formatShortDate(parsedDate);
}

/* =========================
   Check Same Day
   ========================= */

export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;

  return getDateKey(date1) === getDateKey(date2);
}

/* =========================
   Check Today
   ========================= */

export function isToday(date) {
  return isSameDay(date, new Date());
}

/* =========================
   Check Yesterday
   ========================= */

export function isYesterday(date) {
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  return isSameDay(date, yesterday);
}

/* =========================
   Add / Subtract Days
   ========================= */

export function addDays(date, amount) {
  const parsedDate = toDate(date);

  if (!parsedDate) return null;

  const result = new Date(parsedDate);

  result.setDate(result.getDate() + amount);

  return result;
}

/* =========================
   Start / End of Day
   ========================= */

export function startOfDay(date = new Date()) {
  const parsedDate = toDate(date);

  if (!parsedDate) return null;

  const result = new Date(parsedDate);

  result.setHours(0, 0, 0, 0);

  return result;
}

export function endOfDay(date = new Date()) {
  const parsedDate = toDate(date);

  if (!parsedDate) return null;

  const result = new Date(parsedDate);

  result.setHours(23, 59, 59, 999);

  return result;
}

/* =========================
   Start / End of Week
   Monday → Sunday
   ========================= */

export function startOfWeek(date = new Date()) {
  const parsedDate = toDate(date);

  if (!parsedDate) return null;

  const result = startOfDay(parsedDate);

  const day = result.getDay();

  const daysFromMonday = day === 0 ? 6 : day - 1;

  result.setDate(result.getDate() - daysFromMonday);

  return result;
}

export function endOfWeek(date = new Date()) {
  const start = startOfWeek(date);

  if (!start) return null;

  const result = new Date(start);

  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);

  return result;
}

/* =========================
   Date Comparison
   ========================= */

export function isDateBefore(date1, date2) {
  const first = toDate(date1);
  const second = toDate(date2);

  if (!first || !second) return false;

  return first < second;
}

export function isDateAfter(date1, date2) {
  const first = toDate(date1);
  const second = toDate(date2);

  if (!first || !second) return false;

  return first > second;
}
