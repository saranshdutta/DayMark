const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/userController");
const { getPreferences, updatePreferences } = require("../controllers/userPreferenceController");
const { protect } = require("../middleware/authMiddleware");

router.route("/profile")
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.route("/preferences")
  .get(protect, getPreferences)
  .put(protect, updatePreferences);

module.exports = router;
