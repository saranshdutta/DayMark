const express = require("express");
const router = express.Router();
const { getActivities, getActivityById, createActivity, updateActivity, deleteActivity } = require("../controllers/activityController");
const { protect } = require("../middleware/authMiddleware");

// Note: In DayMark, activities are global/shared, but we can protect them
router.route("/")
  .get(protect, getActivities)
  .post(protect, createActivity);

router.route("/:id")
  .get(protect, getActivityById)
  .put(protect, updateActivity)
  .delete(protect, deleteActivity);

module.exports = router;
