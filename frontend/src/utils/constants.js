/*
 * DayMark Constants
 *
 * Centralized values used across the application.
 * Keep UI labels, API-independent values, and
 * configuration here instead of repeating strings
 * throughout components.
 */

/* =========================
   App
   ========================= */

export const APP_NAME = "DayMark";

export const APP_TAGLINE =
  "Track your day. Build your goals. See your progress.";

export const APP_DESCRIPTION = "Smart Student Wellness Activity Portal";

/* =========================
   Activity Categories
   ========================= */

export const ACTIVITY_CATEGORIES = {
  PHYSICAL: "PHYSICAL",
  ACADEMIC: "ACADEMIC",
  LIFESTYLE: "LIFESTYLE",
  SOCIAL: "SOCIAL",
  CUSTOM: "CUSTOM",
};

export const ACTIVITY_CATEGORY_OPTIONS = [
  { value: "PHYSICAL", label: "Physical" },
  { value: "ACADEMIC", label: "Academic" },
  { value: "LIFESTYLE", label: "Lifestyle" },
  { value: "SOCIAL", label: "Social" },
  { value: "CUSTOM", label: "Custom" },
];

/* =========================
   Goal Frequencies
   ========================= */

export const GOAL_FREQUENCIES = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
};

export const GOAL_FREQUENCY_OPTIONS = [
  {
    value: "DAILY",
    label: "Daily",
  },
  {
    value: "WEEKLY",
    label: "Weekly",
  },
  {
    value: "MONTHLY",
    label: "Monthly",
  },
];

/* =========================
   Goal Status
   ========================= */

export const GOAL_STATUS = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  PAUSED: "PAUSED",
  ARCHIVED: "ARCHIVED",
};

export const GOAL_STATUS_OPTIONS = [
  {
    value: "ALL",
    label: "All",
  },
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
  {
    value: "PAUSED",
    label: "Paused",
  },
  {
    value: "ARCHIVED",
    label: "Archived",
  },
];

/* =========================
   Notification Types
   ========================= */

export const NOTIFICATION_TYPES = {
  GOAL: "GOAL",
  STREAK: "STREAK",
  ACTIVITY: "ACTIVITY",
  REMINDER: "REMINDER",
};

export const NOTIFICATION_TYPE_LABELS = {
  GOAL: "Goal",
  STREAK: "Streak",
  ACTIVITY: "Activity",
  REMINDER: "Reminder",
};

/* =========================
   Date Ranges
   ========================= */

export const DATE_RANGES = {
  SEVEN_DAYS: "7d",
  THIRTY_DAYS: "30d",
  THREE_MONTHS: "3m",
  SIX_MONTHS: "6m",
  ONE_YEAR: "1y",
};

export const DATE_RANGE_OPTIONS = [
  {
    value: "7d",
    label: "Last 7 days",
  },
  {
    value: "30d",
    label: "Last 30 days",
  },
  {
    value: "3m",
    label: "Last 3 months",
  },
  {
    value: "6m",
    label: "Last 6 months",
  },
  {
    value: "1y",
    label: "Last year",
  },
];

/* =========================
   Units
   ========================= */

export const ACTIVITY_UNITS = {
  STEPS: "steps",
  MINUTES: "minutes",
  HOURS: "hours",
  PAGES: "pages",
  LITERS: "L",
  GLASSES: "glasses",
  SESSIONS: "sessions",
  TIMES: "times",
};

export const ACTIVITY_UNIT_OPTIONS = [
  {
    value: "steps",
    label: "Steps",
  },
  {
    value: "minutes",
    label: "Minutes",
  },
  {
    value: "hours",
    label: "Hours",
  },
  {
    value: "pages",
    label: "Pages",
  },
  {
    value: "L",
    label: "Liters",
  },
  {
    value: "glasses",
    label: "Glasses",
  },
  {
    value: "sessions",
    label: "Sessions",
  },
  {
    value: "times",
    label: "Times",
  },
];

/* =========================
   Local Storage Keys
   ========================= */

export const STORAGE_KEYS = {
  TOKEN: "daymark_token",
  USER: "daymark_user",
};

/* =========================
   Routes
   ========================= */

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  ONBOARDING: "/onboarding",

  DASHBOARD: "/dashboard",
  ACTIVITIES: "/activities",
  GOALS: "/goals",
  WELLNESS: "/wellness",
  ANALYTICS: "/analytics",
  CALENDAR: "/calendar",
  FOCUS: "/focus",
  NOTIFICATIONS: "/notifications",
  PROFILE: "/profile",
  SETTINGS: "/settings",
};

/* =========================
   API
   ========================= */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* =========================
   Pagination
   ========================= */

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

/* =========================
   Validation
   ========================= */

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 100,

  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,

  MAX_ACTIVITY_NAME_LENGTH: 100,
  MAX_ACTIVITY_NOTE_LENGTH: 500,

  MAX_GOAL_TITLE_LENGTH: 100,
};

/* =========================
   Dashboard
   ========================= */

export const DASHBOARD = {
  RECENT_ACTIVITY_LIMIT: 5,
  RECENT_NOTIFICATION_LIMIT: 5,
  WEEK_DAYS: 7,
};

/* =========================
   Default Values
   ========================= */

export const DEFAULTS = {
  ACTIVITY_CATEGORY: "CUSTOM",
  ACTIVITY_UNIT: "minutes",

  GOAL_FREQUENCY: "DAILY",
  GOAL_STATUS: "ACTIVE",

  DATE_RANGE: "7d",

  THEME: "light",
};

/* =========================
   Theme
   ========================= */

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

export const THEME_OPTIONS = [
  {
    value: "light",
    label: "Light",
    description: "Clean and bright interface",
  },
  {
    value: "dark",
    label: "Dark",
    description: "Easier on the eyes at night",
  },
  {
    value: "system",
    label: "System",
    description: "Follow your device preference",
  },
];

/* =========================
   Helper Labels
   ========================= */

export const CATEGORY_LABELS = {
  PHYSICAL: "Physical",
  ACADEMIC: "Academic",
  LIFESTYLE: "Lifestyle",
  SOCIAL: "Social",
  CUSTOM: "Custom",
};

/* =========================
   Wellness / Mood
   ========================= */

export const MOOD_OPTIONS = [
  { value: "VERY_LOW", label: "Very Low", emoji: "😔", score: 1 },
  { value: "LOW", label: "Low", emoji: "😕", score: 2 },
  { value: "OKAY", label: "Okay", emoji: "😐", score: 3 },
  { value: "GOOD", label: "Good", emoji: "🙂", score: 4 },
  { value: "GREAT", label: "Great", emoji: "😄", score: 5 },
];

export const ENERGY_OPTIONS = [
  { value: "LOW", label: "Low", emoji: "🪫" },
  { value: "MEDIUM", label: "Medium", emoji: "⚡" },
  { value: "HIGH", label: "High", emoji: "🔋" },
];

export const STRESS_OPTIONS = [
  { value: "LOW", label: "Low", emoji: "😌" },
  { value: "MEDIUM", label: "Medium", emoji: "😤" },
  { value: "HIGH", label: "High", emoji: "😰" },
];

export const SLEEP_QUALITY_OPTIONS = [
  { value: "POOR", label: "Poor", emoji: "😴" },
  { value: "FAIR", label: "Fair", emoji: "🛌" },
  { value: "GOOD", label: "Good", emoji: "😊" },
  { value: "EXCELLENT", label: "Excellent", emoji: "✨" },
];

export const GOAL_STATUS_LABELS = {
  ACTIVE: "Active",
  COMPLETED: "Completed",
  PAUSED: "Paused",
  ARCHIVED: "Archived",
};

export const FREQUENCY_LABELS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
};

/* =========================
   HTTP Status Codes
   ========================= */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};
