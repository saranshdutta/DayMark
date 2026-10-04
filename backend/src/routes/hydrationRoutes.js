const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getHydrationLogs,
  getTodayHydration,
  getWeeklyHydration,
  logHydration,
  deleteHydrationLog,
} = require("../controllers/hydrationController");

router.use(protect);

router.get("/", getHydrationLogs);
router.get("/today", getTodayHydration);
router.get("/weekly", getWeeklyHydration);
router.post("/", logHydration);
router.delete("/:id", deleteHydrationLog);

module.exports = router;
