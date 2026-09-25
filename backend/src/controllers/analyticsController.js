const prisma = require("../utils/prisma");

// Helper: get date range based on range string "7d" | "30d" | "90d"
function parseDateRange(range) {
  const now = new Date();
  const start = new Date();
  if (range === "30d") start.setDate(now.getDate() - 30);
  else if (range === "90d") start.setDate(now.getDate() - 90);
  else start.setDate(now.getDate() - 7); // default 7d
  start.setHours(0, 0, 0, 0);
  return { start, end: now };
}

const getOverview = async (req, res, next) => {
  try {
    const { range = "7d" } = req.query;
    const { start, end } = parseDateRange(range);

    const [totalLogs, totalGoals, activeGoals] = await Promise.all([
      prisma.activityLog.count({ where: { userId: req.user.id, loggedAt: { gte: start, lte: end } } }),
      prisma.goal.count({ where: { userId: req.user.id } }),
      prisma.goal.count({ where: { userId: req.user.id, status: "ACTIVE" } }),
    ]);

    res.json({ totalLogs, totalGoals, activeGoals, range });
  } catch (error) {
    next(error);
  }
};

const getActivityTrend = async (req, res, next) => {
  try {
    const { startDate, endDate, range = "7d" } = req.query;
    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      ({ start, end } = parseDateRange(range));
    }

    const logs = await prisma.activityLog.findMany({
      where: { userId: req.user.id, loggedAt: { gte: start, lte: end } },
      include: { activity: true },
      orderBy: { loggedAt: "asc" },
    });

    // Group by day
    const dayMap = {};
    logs.forEach((log) => {
      const day = new Date(log.loggedAt).toISOString().split("T")[0];
      if (!dayMap[day]) dayMap[day] = 0;
      dayMap[day]++;
    });

    const trend = Object.entries(dayMap).map(([date, count]) => ({ date, count }));
    res.json(trend);
  } catch (error) {
    next(error);
  }
};

const getActivitySummary = async (req, res, next) => {
  try {
    const { range = "7d" } = req.query;
    const { start, end } = parseDateRange(range);

    const logs = await prisma.activityLog.findMany({
      where: { userId: req.user.id, loggedAt: { gte: start, lte: end } },
      include: { activity: true },
    });

    const totalDuration = logs.reduce((sum, l) => sum + (l.duration || 0), 0);
    const totalLogs = logs.length;
    res.json({ totalLogs, totalDuration, range });
  } catch (error) {
    next(error);
  }
};

const getCategoryBreakdown = async (req, res, next) => {
  try {
    const { range = "7d" } = req.query;
    const { start, end } = parseDateRange(range);

    const logs = await prisma.activityLog.findMany({
      where: { userId: req.user.id, loggedAt: { gte: start, lte: end } },
      include: { activity: true },
    });

    const categoryMap = {};
    logs.forEach((log) => {
      const cat = log.activity?.category || "CUSTOM";
      if (!categoryMap[cat]) categoryMap[cat] = { category: cat, count: 0, totalDuration: 0 };
      categoryMap[cat].count++;
      categoryMap[cat].totalDuration += log.duration || 0;
    });

    res.json(Object.values(categoryMap));
  } catch (error) {
    next(error);
  }
};

const getGoalAnalytics = async (req, res, next) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.user.id },
      include: { activity: true },
    });

    const summary = {
      total: goals.length,
      active: goals.filter((g) => g.status === "ACTIVE").length,
      completed: goals.filter((g) => g.status === "COMPLETED").length,
      paused: goals.filter((g) => g.status === "PAUSED").length,
      archived: goals.filter((g) => g.status === "ARCHIVED").length,
    };

    res.json(summary);
  } catch (error) {
    next(error);
  }
};

const getGoalCompletion = async (req, res, next) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.user.id },
      include: { activity: true },
    });
    res.json(goals);
  } catch (error) {
    next(error);
  }
};

const getTimeAnalytics = async (req, res, next) => {
  try {
    const { range = "7d" } = req.query;
    const { start, end } = parseDateRange(range);

    const logs = await prisma.activityLog.findMany({
      where: { userId: req.user.id, loggedAt: { gte: start, lte: end } },
    });

    const totalMinutes = logs.reduce((sum, l) => sum + (l.duration || 0), 0);
    res.json({ totalMinutes, averagePerDay: Math.round(totalMinutes / 7) });
  } catch (error) {
    next(error);
  }
};

// Calculate streak
async function calculateStreak(userId) {
  const logs = await prisma.activityLog.findMany({
    where: { userId },
    orderBy: { loggedAt: "desc" },
    select: { loggedAt: true },
  });

  if (logs.length === 0) return { current: 0, longest: 0 };

  const uniqueDays = [...new Set(
    logs.map((l) => new Date(l.loggedAt).toISOString().split("T")[0])
  )].sort().reverse();

  let current = 0;
  let longest = 0;
  let streak = 1;

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Current streak: must include today or yesterday
  if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
    current = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const prevDay = new Date(uniqueDays[i - 1]);
      const curDay = new Date(uniqueDays[i]);
      const diff = Math.round((prevDay - curDay) / 86400000);
      if (diff === 1) {
        current++;
      } else {
        break;
      }
    }
  }

  // Longest streak
  for (let i = 1; i < uniqueDays.length; i++) {
    const prevDay = new Date(uniqueDays[i - 1]);
    const curDay = new Date(uniqueDays[i]);
    const diff = Math.round((prevDay - curDay) / 86400000);
    if (diff === 1) {
      streak++;
      if (streak > longest) longest = streak;
    } else {
      streak = 1;
    }
  }
  if (longest === 0 && uniqueDays.length > 0) longest = current || 1;

  return { current, longest };
}

const getStreak = async (req, res, next) => {
  try {
    const streak = await calculateStreak(req.user.id);
    res.json(streak);
  } catch (error) {
    next(error);
  }
};

const getStreakHistory = async (req, res, next) => {
  try {
    const logs = await prisma.activityLog.findMany({
      where: { userId: req.user.id },
      orderBy: { loggedAt: "desc" },
      select: { loggedAt: true },
    });

    const days = [...new Set(
      logs.map((l) => new Date(l.loggedAt).toISOString().split("T")[0])
    )];

    res.json(days);
  } catch (error) {
    next(error);
  }
};

const getByRange = async (req, res, next) => {
  try {
    const { range = "7d" } = req.query;
    const { start, end } = parseDateRange(range);

    const [logs, goals, streak] = await Promise.all([
      prisma.activityLog.count({ where: { userId: req.user.id, loggedAt: { gte: start, lte: end } } }),
      prisma.goal.findMany({ where: { userId: req.user.id, status: "ACTIVE" } }),
      calculateStreak(req.user.id),
    ]);

    res.json({ logs, activeGoals: goals.length, streak, range });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getActivityTrend,
  getActivitySummary,
  getCategoryBreakdown,
  getGoalAnalytics,
  getGoalCompletion,
  getTimeAnalytics,
  getStreak,
  getStreakHistory,
  getByRange,
};
