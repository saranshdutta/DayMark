const prisma = require("../utils/prisma");

// Shared streak calculation used by multiple endpoints
async function computeStreak(userId) {
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

const getStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [activeGoals, logsToday, streakData] = await Promise.all([
      prisma.goal.count({ where: { userId: req.user.id, status: "ACTIVE" } }),
      prisma.activityLog.count({ where: { userId: req.user.id, loggedAt: { gte: today } } }),
      computeStreak(req.user.id),
    ]);

    res.json({
      activeGoals,
      logsToday,
      currentStreak: streakData.current,
      bestStreak: streakData.longest,
    });
  } catch (error) {
    next(error);
  }
};

const getToday = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const logs = await prisma.activityLog.findMany({
      where: { userId: req.user.id, loggedAt: { gte: startOfDay } },
      include: { activity: true }
    });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

const getRecentActivities = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const logs = await prisma.activityLog.findMany({
      where: { userId: req.user.id },
      include: { activity: true },
      orderBy: { loggedAt: "desc" },
      take: limit
    });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

const getActiveGoals = async (req, res, next) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.user.id, status: "ACTIVE" },
      include: { activity: true },
      take: 5
    });
    res.json(goals);
  } catch (error) {
    next(error);
  }
};

const getGoalProgress = async (req, res, next) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.user.id, status: "ACTIVE" },
      include: { activity: true }
    });
    res.json(goals);
  } catch (error) {
    next(error);
  }
};

const getWeeklyProgress = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    const logs = await prisma.activityLog.findMany({
      where: { userId: req.user.id, loggedAt: { gte: startOfWeek } }
    });

    // Build day map with actual log counts; no hardcoded 'total'
    const dayMap = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const key = d.toLocaleDateString('en-US', { weekday: 'short' });
      dayMap[key] = { day: key, completed: 0 };
    }

    logs.forEach(log => {
      const day = new Date(log.loggedAt).toLocaleDateString('en-US', { weekday: 'short' });
      if (dayMap[day]) {
        dayMap[day].completed++;
      }
    });

    res.json(Object.values(dayMap));
  } catch (error) {
    next(error);
  }
};

const getActivityChart = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    const logs = await prisma.activityLog.findMany({
      where: { userId: req.user.id, loggedAt: { gte: startOfWeek } }
    });

    const dayMap = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const key = d.toLocaleDateString('en-US', { weekday: 'short' });
      dayMap[key] = { day: key, activities: 0 };
    }

    logs.forEach(log => {
      const day = new Date(log.loggedAt).toLocaleDateString('en-US', { weekday: 'short' });
      if (dayMap[day]) {
        dayMap[day].activities++;
      }
    });

    res.json(Object.values(dayMap));
  } catch (error) {
    next(error);
  }
};

const getStreak = async (req, res, next) => {
  try {
    const streakData = await computeStreak(req.user.id);
    res.json(streakData);
  } catch (error) {
    next(error);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: limit
    });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const streakData = await computeStreak(req.user.id);
    res.json({
      message: "Dashboard data ready",
      stats: { streak: streakData },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getStats,
  getToday,
  getRecentActivities,
  getActiveGoals,
  getGoalProgress,
  getWeeklyProgress,
  getActivityChart,
  getStreak,
  getNotifications
};
