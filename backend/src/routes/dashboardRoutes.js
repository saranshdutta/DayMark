const express = require("express");
const router = express.Router();
const { 
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
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getDashboard);
router.get("/stats", protect, getStats);
router.get("/today", protect, getToday);
router.get("/recent-activities", protect, getRecentActivities);
router.get("/active-goals", protect, getActiveGoals);
router.get("/goal-progress", protect, getGoalProgress);
router.get("/weekly-progress", protect, getWeeklyProgress);
router.get("/activity-chart", protect, getActivityChart);
router.get("/streak", protect, getStreak);
router.get("/notifications", protect, getNotifications);

module.exports = router;
