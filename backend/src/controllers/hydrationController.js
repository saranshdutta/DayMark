const prisma = require("../utils/prisma");

const getHydrationLogs = async (req, res, next) => {
  try {
    const { date } = req.query;

    let whereClause = { userId: req.user.id };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      whereClause.loggedAt = { gte: start, lte: end };
    }

    const logs = await prisma.hydrationLog.findMany({
      where: whereClause,
      orderBy: { loggedAt: "desc" },
    });

    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

const getTodayHydration = async (req, res, next) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const logs = await prisma.hydrationLog.findMany({
      where: { userId: req.user.id, loggedAt: { gte: start, lte: end } },
      orderBy: { loggedAt: "desc" },
    });

    const total = logs.reduce((s, l) => s + l.amount, 0);

    // Get user preference for daily target
    const pref = await prisma.userPreference.findUnique({ where: { userId: req.user.id } });
    const target = pref?.dailyWaterTarget || 2.0;

    res.json({
      success: true,
      data: {
        logs,
        total: parseFloat(total.toFixed(2)),
        target,
        percentage: Math.min(Math.round((total / target) * 100), 100),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getWeeklyHydration = async (req, res, next) => {
  try {
    const { range = "7d" } = req.query;
    const days = range === "30d" ? 30 : range === "90d" ? 90 : 7;
    const start = new Date();
    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);

    const logs = await prisma.hydrationLog.findMany({
      where: { userId: req.user.id, loggedAt: { gte: start } },
      orderBy: { loggedAt: "asc" },
    });

    // Group by day
    const dayMap = {};
    logs.forEach((log) => {
      const day = new Date(log.loggedAt).toISOString().split("T")[0];
      if (!dayMap[day]) dayMap[day] = 0;
      dayMap[day] += log.amount;
    });

    const pref = await prisma.userPreference.findUnique({ where: { userId: req.user.id } });
    const target = pref?.dailyWaterTarget || 2.0;

    const trend = Object.entries(dayMap).map(([date, total]) => ({
      date,
      amount: parseFloat(total.toFixed(2)),
      target,
    }));

    const avgDaily =
      trend.length > 0
        ? parseFloat((trend.reduce((s, d) => s + d.amount, 0) / trend.length).toFixed(2))
        : 0;

    res.json({ success: true, data: { trend, averageDaily: avgDaily, target } });
  } catch (error) {
    next(error);
  }
};

const logHydration = async (req, res, next) => {
  try {
    const { amount, loggedAt } = req.body;

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "amount must be a positive number (in liters)" },
      });
    }

    const log = await prisma.hydrationLog.create({
      data: {
        userId: req.user.id,
        amount: parseFloat(amount),
        loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
      },
    });

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

const deleteHydrationLog = async (req, res, next) => {
  try {
    const log = await prisma.hydrationLog.findUnique({ where: { id: req.params.id } });

    if (!log || log.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: { message: "Hydration log not found" } });
    }

    await prisma.hydrationLog.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Hydration log deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHydrationLogs,
  getTodayHydration,
  getWeeklyHydration,
  logHydration,
  deleteHydrationLog,
};
