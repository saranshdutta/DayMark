const prisma = require("../utils/prisma");

const VALID_MOODS = ["VERY_LOW", "LOW", "OKAY", "GOOD", "GREAT"];
const VALID_ENERGY = ["LOW", "MEDIUM", "HIGH"];
const VALID_STRESS = ["LOW", "MEDIUM", "HIGH"];

const getCheckIns = async (req, res, next) => {
  try {
    const { limit, startDate, endDate } = req.query;

    let whereClause = { userId: req.user.id };

    if (startDate && endDate) {
      whereClause.checkedAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const checkIns = await prisma.moodCheckIn.findMany({
      where: whereClause,
      orderBy: { checkedAt: "desc" },
      take: limit ? parseInt(limit) : undefined,
    });

    res.json({ success: true, data: checkIns });
  } catch (error) {
    next(error);
  }
};

const getCheckInById = async (req, res, next) => {
  try {
    const checkIn = await prisma.moodCheckIn.findUnique({
      where: { id: req.params.id },
    });

    if (!checkIn || checkIn.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: { message: "Check-in not found" } });
    }

    res.json({ success: true, data: checkIn });
  } catch (error) {
    next(error);
  }
};

const createCheckIn = async (req, res, next) => {
  try {
    const { mood, energy, stress, note, checkedAt } = req.body;

    if (!mood || !energy || !stress) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "mood, energy and stress are required" },
      });
    }

    if (!VALID_MOODS.includes(mood)) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: `mood must be one of: ${VALID_MOODS.join(", ")}` },
      });
    }

    if (!VALID_ENERGY.includes(energy)) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: `energy must be one of: ${VALID_ENERGY.join(", ")}` },
      });
    }

    if (!VALID_STRESS.includes(stress)) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: `stress must be one of: ${VALID_STRESS.join(", ")}` },
      });
    }

    const checkIn = await prisma.moodCheckIn.create({
      data: {
        userId: req.user.id,
        mood,
        energy,
        stress,
        note: note || null,
        checkedAt: checkedAt ? new Date(checkedAt) : new Date(),
      },
    });

    res.status(201).json({ success: true, data: checkIn });
  } catch (error) {
    next(error);
  }
};

const updateCheckIn = async (req, res, next) => {
  try {
    const checkIn = await prisma.moodCheckIn.findUnique({ where: { id: req.params.id } });

    if (!checkIn || checkIn.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: { message: "Check-in not found" } });
    }

    const { mood, energy, stress, note } = req.body;

    const updated = await prisma.moodCheckIn.update({
      where: { id: req.params.id },
      data: {
        mood: mood || checkIn.mood,
        energy: energy || checkIn.energy,
        stress: stress || checkIn.stress,
        note: note !== undefined ? note : checkIn.note,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

const deleteCheckIn = async (req, res, next) => {
  try {
    const checkIn = await prisma.moodCheckIn.findUnique({ where: { id: req.params.id } });

    if (!checkIn || checkIn.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: { message: "Check-in not found" } });
    }

    await prisma.moodCheckIn.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Check-in deleted" });
  } catch (error) {
    next(error);
  }
};

// Get trends for the last N days
const getTrends = async (req, res, next) => {
  try {
    const { range = "7d" } = req.query;
    const days = range === "30d" ? 30 : range === "90d" ? 90 : 7;
    const start = new Date();
    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);

    const checkIns = await prisma.moodCheckIn.findMany({
      where: { userId: req.user.id, checkedAt: { gte: start } },
      orderBy: { checkedAt: "asc" },
    });

    // Map mood strings to numeric values for trend calculation
    const moodScore = { VERY_LOW: 1, LOW: 2, OKAY: 3, GOOD: 4, GREAT: 5 };
    const energyScore = { LOW: 1, MEDIUM: 2, HIGH: 3 };
    const stressScore = { LOW: 1, MEDIUM: 2, HIGH: 3 };

    // Group by day
    const dayMap = {};
    checkIns.forEach((ci) => {
      const day = new Date(ci.checkedAt).toISOString().split("T")[0];
      if (!dayMap[day]) {
        dayMap[day] = { date: day, moodScores: [], energyScores: [], stressScores: [] };
      }
      dayMap[day].moodScores.push(moodScore[ci.mood] || 3);
      dayMap[day].energyScores.push(energyScore[ci.energy] || 2);
      dayMap[day].stressScores.push(stressScore[ci.stress] || 2);
    });

    const trend = Object.values(dayMap).map((d) => ({
      date: d.date,
      mood: parseFloat((d.moodScores.reduce((a, b) => a + b, 0) / d.moodScores.length).toFixed(1)),
      energy: parseFloat((d.energyScores.reduce((a, b) => a + b, 0) / d.energyScores.length).toFixed(1)),
      stress: parseFloat((d.stressScores.reduce((a, b) => a + b, 0) / d.stressScores.length).toFixed(1)),
    }));

    // Average stats
    const avgMood =
      checkIns.length > 0
        ? parseFloat(
            (
              checkIns.reduce((s, ci) => s + (moodScore[ci.mood] || 3), 0) / checkIns.length
            ).toFixed(1)
          )
        : null;

    res.json({ success: true, data: { trend, averageMood: avgMood, totalCheckIns: checkIns.length } });
  } catch (error) {
    next(error);
  }
};

const getTodayCheckIn = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const checkIn = await prisma.moodCheckIn.findFirst({
      where: {
        userId: req.user.id,
        checkedAt: { gte: startOfDay, lte: endOfDay },
      },
      orderBy: { checkedAt: "desc" },
    });

    res.json({ success: true, data: checkIn });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCheckIns,
  getCheckInById,
  createCheckIn,
  updateCheckIn,
  deleteCheckIn,
  getTrends,
  getTodayCheckIn,
};
