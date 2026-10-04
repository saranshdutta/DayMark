const prisma = require("../utils/prisma");

const VALID_QUALITY = ["POOR", "FAIR", "GOOD", "EXCELLENT"];

// Calculate duration in hours between two times, handling overnight correctly
function calcDuration(bedtime, wakeTime) {
  const bed = new Date(bedtime);
  const wake = new Date(wakeTime);
  let diffMs = wake - bed;

  // If wake is before bed (overnight sleep), add 24h
  if (diffMs < 0) {
    diffMs += 24 * 60 * 60 * 1000;
  }

  return parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
}

const getSleepRecords = async (req, res, next) => {
  try {
    const { limit, startDate, endDate } = req.query;

    let whereClause = { userId: req.user.id };

    if (startDate && endDate) {
      whereClause.sleepDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const records = await prisma.sleepRecord.findMany({
      where: whereClause,
      orderBy: { sleepDate: "desc" },
      take: limit ? parseInt(limit) : undefined,
    });

    res.json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};

const getSleepById = async (req, res, next) => {
  try {
    const record = await prisma.sleepRecord.findUnique({ where: { id: req.params.id } });

    if (!record || record.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: { message: "Sleep record not found" } });
    }

    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

const createSleepRecord = async (req, res, next) => {
  try {
    const { bedtime, wakeTime, quality, notes, sleepDate } = req.body;

    if (!bedtime || !wakeTime) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "bedtime and wakeTime are required" },
      });
    }

    if (quality && !VALID_QUALITY.includes(quality)) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: `quality must be one of: ${VALID_QUALITY.join(", ")}` },
      });
    }

    const duration = calcDuration(bedtime, wakeTime);

    const record = await prisma.sleepRecord.create({
      data: {
        userId: req.user.id,
        bedtime: new Date(bedtime),
        wakeTime: new Date(wakeTime),
        duration,
        quality: quality || null,
        notes: notes || null,
        sleepDate: sleepDate ? new Date(sleepDate) : new Date(wakeTime),
      },
    });

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

const updateSleepRecord = async (req, res, next) => {
  try {
    const record = await prisma.sleepRecord.findUnique({ where: { id: req.params.id } });

    if (!record || record.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: { message: "Sleep record not found" } });
    }

    const { bedtime, wakeTime, quality, notes } = req.body;

    const newBedtime = bedtime ? new Date(bedtime) : record.bedtime;
    const newWakeTime = wakeTime ? new Date(wakeTime) : record.wakeTime;
    const duration = calcDuration(newBedtime, newWakeTime);

    const updated = await prisma.sleepRecord.update({
      where: { id: req.params.id },
      data: {
        bedtime: newBedtime,
        wakeTime: newWakeTime,
        duration,
        quality: quality !== undefined ? quality : record.quality,
        notes: notes !== undefined ? notes : record.notes,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

const deleteSleepRecord = async (req, res, next) => {
  try {
    const record = await prisma.sleepRecord.findUnique({ where: { id: req.params.id } });

    if (!record || record.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: { message: "Sleep record not found" } });
    }

    await prisma.sleepRecord.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Sleep record deleted" });
  } catch (error) {
    next(error);
  }
};

const getSleepStats = async (req, res, next) => {
  try {
    const { range = "7d" } = req.query;
    const days = range === "30d" ? 30 : range === "90d" ? 90 : 7;
    const start = new Date();
    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);

    const records = await prisma.sleepRecord.findMany({
      where: { userId: req.user.id, sleepDate: { gte: start } },
      orderBy: { sleepDate: "asc" },
    });

    const avgDuration =
      records.length > 0
        ? parseFloat(
            (records.reduce((s, r) => s + r.duration, 0) / records.length).toFixed(1)
          )
        : 0;

    const trend = records.map((r) => ({
      date: new Date(r.sleepDate).toISOString().split("T")[0],
      duration: r.duration,
      quality: r.quality,
    }));

    // Preference target
    const pref = await prisma.userPreference.findUnique({ where: { userId: req.user.id } });
    const target = pref?.dailySleepTarget || 8;

    res.json({
      success: true,
      data: {
        trend,
        averageDuration: avgDuration,
        totalRecords: records.length,
        target,
        meetsTarget: avgDuration >= target,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSleepRecords,
  getSleepById,
  createSleepRecord,
  updateSleepRecord,
  deleteSleepRecord,
  getSleepStats,
};
