const crypto = require("crypto");
const { setOtp, verifyOtp: verifyStoredOtp } = require("../models/otpStore");
const { getExistingUserProfile } = require("../services/registrationService");
const { sendOtpSms } = require("../services/smsService");

function isValidMobile(mobile) {
  return /^[6-9]\d{9}$/.test(String(mobile || ""));
}

function isLocalDevelopmentRequest(req) {
  try {
    const hostname = new URL(req.get("origin")).hostname;
    const requestHostname = req.hostname;
    const isLocalHostname = (value) => ["localhost", "127.0.0.1", "::1"].includes(value);

    return isLocalHostname(hostname) && isLocalHostname(requestHostname);
  } catch {
    return false;
  }
}

async function getDemoProfile(req, res, next) {
  if (!isLocalDevelopmentRequest(req)) {
    return res.status(404).json({
      success: false,
      message: "Not found.",
    });
  }

  try {
    const { mobile } = req.body;
    if (!isValidMobile(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number.",
      });
    }

    const existingUser = await getExistingUserProfile(mobile);
    return res.json({
      success: true,
      message: "Demo profile loaded successfully.",
      existingUser,
    });
  } catch (error) {
    return next(error);
  }
}

async function sendOtp(req, res, next) {
  try {
    const { mobile } = req.body;

    if (!isValidMobile(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number.",
      });
    }

    const otp = String(crypto.randomInt(100000, 1000000));

    const isDemoOtp = isLocalDevelopmentRequest(req);
    const smsResult = isDemoOtp ? null : await sendOtpSms(mobile, otp);
    await setOtp(mobile, otp);

    return res.json({
      success: true,
      message: isDemoOtp ? "Demo OTP generated. No SMS was sent." : "OTP sent successfully.",
      ...(isDemoOtp ? { demoOtp: otp } : { campId: smsResult.campId }),
    });
  } catch (error) {
    return next(error);
  }
}

async function verifyOtp(req, res, next) {
  try {
    const { mobile, otp } = req.body;

    if (!isValidMobile(mobile) || !/^\d{6}$/.test(String(otp || ""))) {
      return res.status(400).json({
        success: false,
        message: "Mobile number or OTP is invalid.",
      });
    }

    if (!(await verifyStoredOtp(mobile, String(otp)))) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    const existingUser = await getExistingUserProfile(mobile);

    return res.json({
      success: true,
      message: "OTP verified successfully.",
      existingUser,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getDemoProfile,
  sendOtp,
  verifyOtp,
};
