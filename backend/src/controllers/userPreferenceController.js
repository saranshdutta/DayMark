const prisma = require("../utils/prisma");

const getPreferences = async (req, res, next) => {
  try {
    let pref = await prisma.userPreference.findUnique({
      where: { userId: req.user.id },
    });

    // Auto-create default preferences if not existing
    if (!pref) {
      pref = await prisma.userPreference.create({
        data: { userId: req.user.id },
      });
    }

    res.json({ success: true, data: pref });
  } catch (error) {
    next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const {
      academicYear,
      department,
      dailySleepTarget,
      dailyStudyTarget,
      dailyExerciseTarget,
      dailyWaterTarget,
      preferredCategories,
      onboardingCompleted,
    } = req.body;

    // Validate numeric targets
    if (dailySleepTarget !== undefined && (parseFloat(dailySleepTarget) < 0 || parseFloat(dailySleepTarget) > 24)) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "dailySleepTarget must be between 0 and 24 hours" },
      });
    }

    if (dailyWaterTarget !== undefined && parseFloat(dailyWaterTarget) < 0) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "dailyWaterTarget must be a positive number" },
      });
    }

    const pref = await prisma.userPreference.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        academicYear,
        department,
        dailySleepTarget: dailySleepTarget ? parseFloat(dailySleepTarget) : 8,
        dailyStudyTarget: dailyStudyTarget ? parseInt(dailyStudyTarget) : 120,
        dailyExerciseTarget: dailyExerciseTarget ? parseInt(dailyExerciseTarget) : 30,
        dailyWaterTarget: dailyWaterTarget ? parseFloat(dailyWaterTarget) : 2.0,
        preferredCategories: preferredCategories
          ? JSON.stringify(preferredCategories)
          : null,
        onboardingCompleted: onboardingCompleted || false,
      },
      update: {
        ...(academicYear !== undefined && { academicYear }),
        ...(department !== undefined && { department }),
        ...(dailySleepTarget !== undefined && { dailySleepTarget: parseFloat(dailySleepTarget) }),
        ...(dailyStudyTarget !== undefined && { dailyStudyTarget: parseInt(dailyStudyTarget) }),
        ...(dailyExerciseTarget !== undefined && { dailyExerciseTarget: parseInt(dailyExerciseTarget) }),
        ...(dailyWaterTarget !== undefined && { dailyWaterTarget: parseFloat(dailyWaterTarget) }),
        ...(preferredCategories !== undefined && {
          preferredCategories: JSON.stringify(preferredCategories),
        }),
        ...(onboardingCompleted !== undefined && { onboardingCompleted }),
      },
    });

    res.json({ success: true, data: pref });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPreferences, updatePreferences };
