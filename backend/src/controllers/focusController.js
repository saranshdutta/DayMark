const prisma = require("../utils/prisma");

const VALID_STATUS = ["COMPLETED", "CANCELLED", "IN_PROGRESS"];

const getFocusSessions = async (req, res, next) => {
  try {
    const { limit, startDate, endDate } = req.query;

    let whereClause = { userId: req.user.id };

    if (startDate && endDate) {
      whereClause.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const sessions = await prisma.focusSession.findMany({
      where: whereClause,
      orderBy: { startTime: "desc" },
      take: limit ? parseInt(limit) : undefined,
    });

    res.json({ success: true, data: sessions });
  } catch (error) {
    next(error);
  }
};

const createFocusSession = async (req, res, next) => {
  try {
    const { taskName, duration, breakDuration, status, startTime, endTime, actualDuration } =
      req.body;

    if (!duration || parseInt(duration) <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "duration (minutes) is required and must be positive" },
      });
    }

    const sessionStatus = status || "COMPLETED";
    if (!VALID_STATUS.includes(sessionStatus)) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: `status must be one of: ${VALID_STATUS.join(", ")}` },
      });
    }

    const session = await prisma.focusSession.create({
      data: {
        userId: req.user.id,
        taskName: taskName || null,
        duration: parseInt(duration),
        actualDuration: actualDuration ? parseInt(actualDuration) : null,
        breakDuration: breakDuration ? parseInt(breakDuration) : null,
        status: sessionStatus,
        startTime: startTime ? new Date(startTime) : new Date(),
        endTime: endTime ? new Date(endTime) : null,
      },
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

const updateFocusSession = async (req, res, next) => {
  try {
    const session = await prisma.focusSession.findUnique({ where: { id: req.params.id } });

    if (!session || session.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: { message: "Focus session not found" } });
    }

    const { taskName, actualDuration, status, endTime } = req.body;

    const updated = await prisma.focusSession.update({
      where: { id: req.params.id },
      data: {
        taskName: taskName !== undefined ? taskName : session.taskName,
        actualDuration: actualDuration !== undefined ? parseInt(actualDuration) : session.actualDuration,
        status: status || session.status,
        endTime: endTime ? new Date(endTime) : session.endTime,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

const deleteFocusSession = async (req, res, next) => {
  try {
    const session = await prisma.focusSession.findUnique({ where: { id: req.params.id } });

    if (!session || session.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: { message: "Focus session not found" } });
    }

    await prisma.focusSession.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Focus session deleted" });
  } catch (error) {
    next(error);
  }
};

const getFocusStats = async (req, res, next) => {
  try {
    const { range = "7d" } = req.query;
    const days = range === "30d" ? 30 : range === "90d" ? 90 : 7;
    const start = new Date();
    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);

    const sessions = await prisma.focusSession.findMany({
      where: {
        userId: req.user.id,
        startTime: { gte: start },
        status: "COMPLETED",
      },
      orderBy: { startTime: "asc" },
    });

    const totalMinutes = sessions.reduce(
      (s, sess) => s + (sess.actualDuration || sess.duration),
      0
    );

    const totalSessions = sessions.length;

    // Group by day
    const dayMap = {};
    sessions.forEach((sess) => {
      const day = new Date(sess.startTime).toISOString().split("T")[0];
      if (!dayMap[day]) dayMap[day] = { date: day, sessions: 0, minutes: 0 };
      dayMap[day].sessions++;
      dayMap[day].minutes += sess.actualDuration || sess.duration;
    });

    const trend = Object.values(dayMap);

    res.json({
      success: true,
      data: {
        totalMinutes,
        totalSessions,
        averagePerDay: totalSessions > 0 ? parseFloat((totalMinutes / days).toFixed(1)) : 0,
        trend,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFocusSessions,
  createFocusSession,
  updateFocusSession,
  deleteFocusSession,
  getFocusStats,
};
