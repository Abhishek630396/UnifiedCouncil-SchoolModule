const express = require("express");
const { getDemoProfile, sendOtp, verifyOtp } = require("../controllers/authController");

const router = express.Router();

router.post("/demo-profile", getDemoProfile);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;
