/*
 * DayMark Calculation Utilities
 *
 * Pure functions for calculating:
 * - Goal progress
 * - Goal completion
 * - Activity statistics
 * - Duration
 * - Streaks
 * - Weekly progress
 */

/* =========================
   Goal Calculations
   ========================= */

/**
 * Calculate goal progress percentage.
 *
 * Example:
 * current = 7200
 * target = 10000
 * result = 72
 */
export function calculateGoalProgress(current = 0, target = 0) {
  const currentValue = Number(current) || 0;

  const targetValue = Number(target) || 0;

  if (targetValue <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((currentValue / targetValue) * 100));
}

/**
 * Calculate remaining goal value.
 */
export function calculateGoalRemaining(current = 0, target = 0) {
  const currentValue = Number(current) || 0;

  const targetValue = Number(target) || 0;

  return Math.max(0, targetValue - currentValue);
}

/**
 * Check whether a goal is completed.
 */
export function isGoalCompleted(current = 0, target = 0) {
  return Number(current) >= Number(target);
}

/**
 * Calculate average goal completion.
 */
export function calculateAverageGoalProgress(goals = []) {
  if (!goals.length) {
    return 0;
  }

  const totalProgress = goals.reduce(
    (total, goal) => total + calculateGoalProgress(goal.current, goal.target),
    0,
  );

  return Math.round(totalProgress / goals.length);
}

/* =========================
   Activity Calculations
   ========================= */

/**
 * Calculate total activity duration.
 *
 * Returns minutes.
 */
export function calculateTotalDuration(activities = []) {
  return activities.reduce(
    (total, activity) => total + (Number(activity.duration) || 0),
    0,
  );
}

/**
 * Format minutes into readable time.
 *
 * 125 → "2h 5m"
 * 45  → "45m"
 */
export function formatDuration(minutes = 0) {
  const totalMinutes = Math.max(0, Number(minutes) || 0);

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

/**
 * Calculate average activity duration.
 */
export function calculateAverageDuration(activities = []) {
  if (!activities.length) {
    return 0;
  }

  return Math.round(calculateTotalDuration(activities) / activities.length);
}

/**
 * Count activities by category.
 */
export function calculateCategoryCounts(activities = []) {
  return activities.reduce((result, activity) => {
    const category = activity.category || "CUSTOM";

    result[category] = (result[category] || 0) + 1;

    return result;
  }, {});
}

/**
 * Calculate percentage distribution
 * of activity categories.
 */
export function calculateCategoryPercentages(activities = []) {
  const counts = calculateCategoryCounts(activities);

  const total = activities.length;

  if (!total) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(counts).map(([category, count]) => [
      category,
      Math.round((count / total) * 100),
    ]),
  );
}

/* =========================
   Date Calculations
   ========================= */

/**
 * Get YYYY-MM-DD from a date.
 */
export function getDateKey(date = new Date()) {
  const value = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toISOString().split("T")[0];
}

/**
 * Get today's date key.
 */
export function getTodayKey() {
  return getDateKey(new Date());
}

/**
 * Group activities by date.
 */
export function groupActivitiesByDate(activities = []) {
  return activities.reduce((result, activity) => {
    if (!activity.loggedAt) {
      return result;
    }

    const dateKey = getDateKey(activity.loggedAt);

    if (!dateKey) {
      return result;
    }

    if (!result[dateKey]) {
      result[dateKey] = [];
    }

    result[dateKey].push(activity);

    return result;
  }, {});
}

/**
 * Get activities for a specific date.
 */
export function getActivitiesForDate(activities = [], date) {
  const dateKey = typeof date === "string" ? date : getDateKey(date);

  return activities.filter((activity) =>
    activity.loggedAt?.startsWith(dateKey),
  );
}

/* =========================
   Streak Calculations
   ========================= */

/**
 * Get unique activity dates.
 */
export function getActivityDates(activities = []) {
  return [
    ...new Set(
      activities
        .filter((activity) => activity.loggedAt)
        .map((activity) => getDateKey(activity.loggedAt)),
    ),
  ].sort();
}

/**
 * Calculate current consecutive
 * activity streak.
 */
export function calculateCurrentStreak(activities = []) {
  const dates = getActivityDates(activities);

  if (!dates.length) {
    return 0;
  }

  const dateSet = new Set(dates);

  let streak = 0;

  const currentDate = new Date();

  while (true) {
    const dateKey = getDateKey(currentDate);

    if (!dateSet.has(dateKey)) {
      break;
    }

    streak += 1;

    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

/**
 * Calculate longest consecutive
 * activity streak.
 */
export function calculateLongestStreak(activities = []) {
  const dates = getActivityDates(activities);

  if (!dates.length) {
    return 0;
  }

  const dateSet = new Set(dates);

  let longest = 0;

  dates.forEach((date) => {
    const previousDate = new Date(date);

    previousDate.setDate(previousDate.getDate() - 1);

    const previousKey = getDateKey(previousDate);

    /*
     * Only start counting when this
     * date is the beginning of a streak.
     */
    if (!dateSet.has(previousKey)) {
      let streak = 1;

      const nextDate = new Date(date);

      while (true) {
        nextDate.setDate(nextDate.getDate() + 1);

        const nextKey = getDateKey(nextDate);

        if (!dateSet.has(nextKey)) {
          break;
        }

        streak += 1;
      }

      longest = Math.max(longest, streak);
    }
  });

  return longest;
}

/* =========================
   Weekly Calculations
   ========================= */

/**
 * Count activities for each day
 * of the current week.
 */
export function calculateWeeklyActivity(activities = []) {
  const today = new Date();

  const dayOfWeek = today.getDay();

  /*
   * Convert Sunday-based JS index
   * into Monday-based index.
   */
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(today);

  monday.setDate(today.getDate() + mondayOffset);

  monday.setHours(0, 0, 0, 0);

  const result = [];

  for (let index = 0; index < 7; index++) {
    const date = new Date(monday);

    date.setDate(monday.getDate() + index);

    const dateKey = getDateKey(date);

    const count = activities.filter((activity) =>
      activity.loggedAt?.startsWith(dateKey),
    ).length;

    result.push({
      date: dateKey,
      day: date.toLocaleDateString(undefined, {
        weekday: "short",
      }),
      count,
    });
  }

  return result;
}

/* =========================
   Dashboard Statistics
   ========================= */

/**
 * Calculate common dashboard stats.
 */
export function calculateActivityStats(activities = [], goals = []) {
  const totalActivities = activities.length;

  const totalDuration = calculateTotalDuration(activities);

  const averageDuration = calculateAverageDuration(activities);

  const goalCompletion = calculateAverageGoalProgress(goals);

  const currentStreak = calculateCurrentStreak(activities);

  const longestStreak = calculateLongestStreak(activities);

  return {
    totalActivities,
    totalDuration,
    averageDuration,
    goalCompletion,
    currentStreak,
    longestStreak,
  };
}
