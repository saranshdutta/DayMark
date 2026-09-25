const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const activityRoutes = require("./activityRoutes");
const activityLogRoutes = require("./activityLogRoutes");
const goalRoutes = require("./goalRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const analyticsRoutes = require("./analyticsRoutes");
const notificationRoutes = require("./notificationRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/activities", activityRoutes);
router.use("/activity-logs", activityLogRoutes);
router.use("/goals", goalRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/notifications", notificationRoutes);

module.exports = router;
