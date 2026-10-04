const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getFocusSessions,
  createFocusSession,
  updateFocusSession,
  deleteFocusSession,
  getFocusStats,
} = require("../controllers/focusController");

router.use(protect);

router.get("/", getFocusSessions);
router.get("/stats", getFocusStats);
router.post("/", createFocusSession);
router.put("/:id", updateFocusSession);
router.delete("/:id", deleteFocusSession);

module.exports = router;
