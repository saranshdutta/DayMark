const prisma = require("../utils/prisma");

const getActivityLogs = async (req, res, next) => {
  try {
    const { date, startDate, endDate } = req.query;
    
    let whereClause = { userId: req.user.id };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      
      whereClause.loggedAt = {
        gte: startOfDay,
        lte: endOfDay
      };
    } else if (startDate && endDate) {
      whereClause.loggedAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const logs = await prisma.activityLog.findMany({
      where: whereClause,
      include: {
        activity: true
      },
      orderBy: { loggedAt: "desc" },
    });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

const getTodayLogs = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const logs = await prisma.activityLog.findMany({
      where: {
        userId: req.user.id,
        loggedAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: { activity: true },
      orderBy: { loggedAt: "desc" },
    });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

const getActivityLogById = async (req, res, next) => {
  try {
    const log = await prisma.activityLog.findUnique({
      where: { id: req.params.id },
      include: { activity: true }
    });
    
    if (!log || log.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: "Activity log not found" });
    }
    
    res.json(log);
  } catch (error) {
    next(error);
  }
};

const createActivityLog = async (req, res, next) => {
  try {
    let { activityId, title, category, value, duration, note, loggedAt, date } = req.body;

    // Auto-resolve or create Activity definition if activityId is missing
    if (!activityId) {
      const actName = title || "General Activity";
      const actCategory = category || "ACADEMIC";

      let activity = await prisma.activity.findFirst({
        where: { name: actName, category: actCategory },
      });

      if (!activity) {
        activity = await prisma.activity.create({
          data: {
            name: actName,
            category: actCategory,
            unit: "mins",
          },
        });
      }
      activityId = activity.id;
    }
    
    if (value !== undefined && value !== null && parseFloat(value) < 0) {
      return res.status(400).json({ success: false, message: "Value cannot be negative" });
    }

    if (duration !== undefined && duration !== null && parseInt(duration) < 0) {
      return res.status(400).json({ success: false, message: "Duration cannot be negative" });
    }

    const logDate = date || loggedAt;
    
    const log = await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        activityId,
        value: value !== undefined && value !== null ? parseFloat(value) : null,
        duration: duration !== undefined && duration !== null ? parseInt(duration) : null,
        note: note || null,
        loggedAt: logDate ? new Date(logDate) : new Date()
      },
      include: { activity: true }
    });
    
    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
};

const updateActivityLog = async (req, res, next) => {
  try {
    const { activityId, value, duration, note, loggedAt } = req.body;
    
    if (value !== undefined && value !== null && parseFloat(value) < 0) {
      return res.status(400).json({ success: false, message: "Value cannot be negative" });
    }

    if (duration !== undefined && duration !== null && parseInt(duration) < 0) {
      return res.status(400).json({ success: false, message: "Duration cannot be negative" });
    }

    const log = await prisma.activityLog.findUnique({ where: { id: req.params.id } });
    if (!log || log.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: "Activity log not found" });
    }

    const updatedLog = await prisma.activityLog.update({
      where: { id: req.params.id },
      data: {
        activityId: activityId || log.activityId,
        value: value !== undefined ? parseFloat(value) : log.value,
        duration: duration !== undefined ? parseInt(duration) : log.duration,
        note: note !== undefined ? note : log.note,
        loggedAt: loggedAt ? new Date(loggedAt) : log.loggedAt
      },
      include: { activity: true }
    });
    
    res.json(updatedLog);
  } catch (error) {
    next(error);
  }
};

const deleteActivityLog = async (req, res, next) => {
  try {
    const log = await prisma.activityLog.findUnique({ where: { id: req.params.id } });
    if (!log || log.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: "Activity log not found" });
    }

    await prisma.activityLog.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Activity log deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivityLogs,
  getTodayLogs,
  getActivityLogById,
  createActivityLog,
  updateActivityLog,
  deleteActivityLog,
};
