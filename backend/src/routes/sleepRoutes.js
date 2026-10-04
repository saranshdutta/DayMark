const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getSleepRecords,
  getSleepById,
  createSleepRecord,
  updateSleepRecord,
  deleteSleepRecord,
  getSleepStats,
} = require("../controllers/sleepController");

router.use(protect);

router.get("/", getSleepRecords);
router.get("/stats", getSleepStats);
router.get("/:id", getSleepById);
router.post("/", createSleepRecord);
router.put("/:id", updateSleepRecord);
router.delete("/:id", deleteSleepRecord);

module.exports = router;
