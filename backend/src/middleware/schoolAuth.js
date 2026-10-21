const { getSchoolTokenFromRequest, verifySchoolToken } = require("../utils/schoolToken");

async function requireSchool(req, res, next) {
  try {
    const school = await verifySchoolToken(getSchoolTokenFromRequest(req));
    if (!school) {
      return res.status(401).json({
        success: false,
        message: "School authentication is required.",
      });
    }

    req.school = school;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = { requireSchool };
