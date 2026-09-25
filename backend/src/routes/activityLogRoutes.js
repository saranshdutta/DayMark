const express = require("express");
const router = express.Router();
const { getActivityLogs, getTodayLogs, getActivityLogById, createActivityLog, updateActivityLog, deleteActivityLog } = require("../controllers/activityLogController");
const { protect } = require("../middleware/authMiddleware");

router.get("/today", protect, getTodayLogs);

router.route("/")
  .get(protect, getActivityLogs)
  .post(protect, createActivityLog);

router.route("/:id")
  .get(protect, getActivityLogById)
  .put(protect, updateActivityLog)
  .delete(protect, deleteActivityLog);

module.exports = router;
