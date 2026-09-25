const express = require("express");
const router = express.Router();
const { 
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
  getAllGoalProgress
} = require("../controllers/goalController");
const { protect } = require("../middleware/authMiddleware");

router.get("/progress", protect, getAllGoalProgress);
router.get("/:id/progress", protect, getGoalProgress);

router.patch("/:id/pause", protect, pauseGoal);
router.patch("/:id/resume", protect, resumeGoal);
router.patch("/:id/complete", protect, completeGoal);
router.patch("/:id/archive", protect, archiveGoal);

router.route("/")
  .get(protect, getGoals)
  .post(protect, createGoal);

router.route("/:id")
  .get(protect, getGoalById)
  .put(protect, updateGoal)
  .delete(protect, deleteGoal);

module.exports = router;
