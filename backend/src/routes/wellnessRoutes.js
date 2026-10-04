const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCheckIns,
  getCheckInById,
  createCheckIn,
  updateCheckIn,
  deleteCheckIn,
  getTrends,
  getTodayCheckIn,
} = require("../controllers/wellnessController");

router.use(protect);

router.get("/", getCheckIns);
router.get("/today", getTodayCheckIn);
router.get("/trends", getTrends);
router.get("/:id", getCheckInById);
router.post("/", createCheckIn);
router.post("/check-in", createCheckIn);
router.put("/:id", updateCheckIn);
router.delete("/:id", deleteCheckIn);

module.exports = router;
