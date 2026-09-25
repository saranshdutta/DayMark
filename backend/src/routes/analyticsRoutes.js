const express = require("express");
const router = express.Router();
const {
  getOverview,
  getActivityTrend,
  getActivitySummary,
  getCategoryBreakdown,
  getGoalAnalytics,
  getGoalCompletion,
  getTimeAnalytics,
  getStreak,
  getStreakHistory,
  getByRange
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

router.get("/overview", protect, getOverview);
router.get("/activity-trend", protect, getActivityTrend);
router.get("/activity-summary", protect, getActivitySummary);
router.get("/category-breakdown", protect, getCategoryBreakdown);
router.get("/goals", protect, getGoalAnalytics);
router.get("/goal-completion", protect, getGoalCompletion);
router.get("/time", protect, getTimeAnalytics);
router.get("/streak", protect, getStreak);
router.get("/streak-history", protect, getStreakHistory);
router.get("/", protect, getByRange);

module.exports = router;
