const crypto = require("crypto");
const {
  changeSchoolPassword,
  findSchoolByCredentials,
} = require("../models/school/schoolRegistrationModal");
const {
  COOKIE_NAME,
  createSchoolToken,
  getSchoolCookieOptions,
  getSchoolTokenFromRequest,
  revokeSchoolToken,
  revokeSchoolTokens,
} = require("../utils/schoolToken");

function passwordsMatch(storedPassword, providedPassword) {
  const stored = Buffer.from(String(storedPassword ?? ""));
  const provided = Buffer.from(String(providedPassword ?? ""));
  return stored.length === provided.length && crypto.timingSafeEqual(stored, provided);
}

async function loginSchool(req, res, next) {
  try {
    const registrationId = String(req.body?.registrationId || "").trim();
    const password = String(req.body?.password || "");
    if (!registrationId || !password) {
      return res.status(400).json({
        success: false,
        message: "Enter your School ID and password.",
      });
    }

    const school = await findSchoolByCredentials(registrationId);
    if (!school || !passwordsMatch(school.Password, password)) {
      return res.status(401).json({
        success: false,
        message: "The School ID or password is incorrect.",
      });
    }

    const rememberMe = req.body?.rememberMe === true;
    const session = await createSchoolToken(school.SchoolId, rememberMe);
    res.cookie(
      COOKIE_NAME,
      session.token,
      getSchoolCookieOptions(req, rememberMe, session.expiresAt)
    );
    return res.json({
      success: true,
      message: "School login successful.",
    });
  } catch (error) {
    return next(error);
  }
}

async function logoutSchool(req, res, next) {
  try {
    await revokeSchoolToken(getSchoolTokenFromRequest(req));
  } catch (error) {
    return next(error);
  }
  res.clearCookie(COOKIE_NAME, getSchoolCookieOptions(req));
  return res.json({ success: true, message: "Signed out successfully." });
}

async function updateSchoolPassword(req, res, next) {
  try {
    const currentPassword = String(req.body?.currentPassword || "");
    const newPassword = String(req.body?.newPassword || "");
    if (newPassword.length < 10 || newPassword.length > 128) {
      return res.status(400).json({
        success: false,
        message: "The new password must be between 10 and 128 characters.",
      });
    }

    const school = await findSchoolByCredentials(String(req.school.schoolId));
    if (!school || !passwordsMatch(school.Password, currentPassword)) {
      return res.status(401).json({
        success: false,
        message: "The current password is incorrect.",
      });
    }

    await changeSchoolPassword(req.school.schoolId, newPassword);
    await revokeSchoolTokens(req.school.schoolId);
    res.clearCookie(COOKIE_NAME, getSchoolCookieOptions(req));
    return res.json({
      success: true,
      message: "Password changed. Sign in again with your new password.",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { loginSchool, logoutSchool, updateSchoolPassword };
