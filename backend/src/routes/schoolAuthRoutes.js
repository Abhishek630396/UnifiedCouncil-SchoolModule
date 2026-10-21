const express = require("express");
const {
  loginSchool,
  logoutSchool,
  updateSchoolPassword,
} = require("../controllers/schoolAuthController");
const { requireSchool } = require("../middleware/schoolAuth");

const router = express.Router();

router.post("/login", loginSchool);
router.post("/logout", logoutSchool);
router.post("/change-password", requireSchool, updateSchoolPassword);

module.exports = router;
