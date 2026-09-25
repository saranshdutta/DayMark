const prisma = require("../utils/prisma");

const getGoals = async (req, res, next) => {
  try {
    const { status, frequency } = req.query;
    
    let whereClause = { userId: req.user.id };
    
    if (status) whereClause.status = status;
    if (frequency) whereClause.frequency = frequency;

    const goals = await prisma.goal.findMany({
      where: whereClause,
      include: { activity: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(goals);
  } catch (error) {
    next(error);
  }
};

const getGoalById = async (req, res, next) => {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id: req.params.id },
      include: { activity: true }
    });
    
    if (!goal || goal.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }
    
    res.json(goal);
  } catch (error) {
    next(error);
  }
};

const createGoal = async (req, res, next) => {
  try {
    const { title, activityId, targetValue, unit, frequency, startDate, endDate } = req.body;
    
    if (!title || !targetValue || !unit || !frequency || !startDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (parseFloat(targetValue) < 0) {
      return res.status(400).json({ success: false, message: "Target value cannot be negative" });
    }

    const goal = await prisma.goal.create({
      data: {
        userId: req.user.id,
        title,
        activityId,
        targetValue: parseFloat(targetValue),
        unit,
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: "ACTIVE"
      },
      include: { activity: true }
    });
    
    res.status(201).json(goal);
  } catch (error) {
    next(error);
  }
};

const updateGoal = async (req, res, next) => {
  try {
    const { title, activityId, targetValue, unit, frequency, startDate, endDate, status } = req.body;
    
    if (targetValue !== undefined && parseFloat(targetValue) < 0) {
      return res.status(400).json({ success: false, message: "Target value cannot be negative" });
    }

    const goal = await prisma.goal.findUnique({ where: { id: req.params.id } });
    if (!goal || goal.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: req.params.id },
      data: {
        title: title || goal.title,
        activityId: activityId !== undefined ? activityId : goal.activityId,
        targetValue: targetValue !== undefined ? parseFloat(targetValue) : goal.targetValue,
        unit: unit || goal.unit,
        frequency: frequency || goal.frequency,
        startDate: startDate ? new Date(startDate) : goal.startDate,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : goal.endDate,
        status: status || goal.status
      },
      include: { activity: true }
    });
    
    res.json(updatedGoal);
  } catch (error) {
    next(error);
  }
};

const deleteGoal = async (req, res, next) => {
  try {
    const goal = await prisma.goal.findUnique({ where: { id: req.params.id } });
    if (!goal || goal.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    await prisma.goal.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Goal deleted" });
  } catch (error) {
    next(error);
  }
};

// Status Updaters
const updateGoalStatus = async (req, res, next, status) => {
  try {
    const goal = await prisma.goal.findUnique({ where: { id: req.params.id } });
    if (!goal || goal.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: req.params.id },
      data: { status },
      include: { activity: true }
    });
    
    res.json(updatedGoal);
  } catch (error) {
    next(error);
  }
};

const pauseGoal = (req, res, next) => updateGoalStatus(req, res, next, "PAUSED");
const resumeGoal = (req, res, next) => updateGoalStatus(req, res, next, "ACTIVE");
const completeGoal = (req, res, next) => updateGoalStatus(req, res, next, "COMPLETED");
const archiveGoal = (req, res, next) => updateGoalStatus(req, res, next, "ARCHIVED");

// Progress Calculation logic
const calculateProgress = async (goal) => {
  let dateFilter = {};
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  if (goal.frequency === "DAILY") {
    dateFilter = {
      gte: startOfDay,
      lte: now
    };
  } else if (goal.frequency === "WEEKLY") {
    const startOfWeek = new Date(startOfDay);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    startOfWeek.setDate(diff);
    dateFilter = {
      gte: startOfWeek,
      lte: now
    };
  } else if (goal.frequency === "MONTHLY") {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    dateFilter = {
      gte: startOfMonth,
      lte: now
    };
  } else {
    // Custom / total
    dateFilter = {
      gte: goal.startDate,
      lte: goal.endDate || now
    };
  }

  // Aggregate logs
  let whereClause = {
    userId: goal.userId,
    loggedAt: dateFilter
  };
  
  if (goal.activityId) {
    whereClause.activityId = goal.activityId;
  }

  const logs = await prisma.activityLog.findMany({ where: whereClause });
  
  // Assuming progress is based on value (or duration if value is null)
  let currentProgress = 0;
  for (const log of logs) {
    if (log.value !== null) {
      currentProgress += log.value;
    } else if (log.duration !== null) {
      currentProgress += log.duration;
    } else {
      // Just a count if no value/duration
      currentProgress += 1;
    }
  }

  return {
    ...goal,
    currentProgress,
    percentage: Math.min(Math.round((currentProgress / goal.targetValue) * 100), 100)
  };
};

const getGoalProgress = async (req, res, next) => {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id: req.params.id },
      include: { activity: true }
    });
    
    if (!goal || goal.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    const progress = await calculateProgress(goal);
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

const getAllGoalProgress = async (req, res, next) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.user.id },
      include: { activity: true }
    });

    const progressList = await Promise.all(goals.map(calculateProgress));
    res.json(progressList);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  pauseGoal,
  resumeGoal,
  completeGoal,
  archiveGoal,
  getGoalProgress,
  getAllGoalProgress,
};
