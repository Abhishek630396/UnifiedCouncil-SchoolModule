const crypto = require("crypto");
const { DataTypes, Op } = require("sequelize");
const sequelize = require("../config/dbConfig");

const COOKIE_NAME = "uc_school_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const SchoolDashboardToken = sequelize.define(
  "SchoolDashboardToken",
  {
    TokenHash: { type: DataTypes.CHAR(64), primaryKey: true },
    SchoolId: { type: DataTypes.BIGINT, allowNull: false },
    TokenType: { type: DataTypes.STRING, allowNull: false },
    ExpiresAt: { type: DataTypes.DATE, allowNull: false },
    CreatedAt: { type: DataTypes.DATE, allowNull: false },
    RevokedAt: DataTypes.DATE,
  },
  {
    tableName: "Tbl_SchoolDashboardTokens",
    schema: "dbo",
    timestamps: false,
  }
);

async function ensureSchoolDashboardTokenTable() {
  await SchoolDashboardToken.sync();
}

function getTokenHash(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

async function createSchoolToken(schoolId, rememberMe = false) {
  const token = crypto.randomBytes(32).toString("base64url");
  const now = Date.now();
  const expiresAt = new Date(now + (rememberMe ? REMEMBER_TTL_MS : SESSION_TTL_MS));
  await SchoolDashboardToken.create({
    TokenHash: getTokenHash(token),
    SchoolId: Number(schoolId),
    TokenType: "school-dashboard",
    ExpiresAt: expiresAt,
    CreatedAt: new Date(now),
    RevokedAt: null,
  });
  return { token, expiresAt };
}

async function verifySchoolToken(token) {
  if (!token) return null;
  const session = await SchoolDashboardToken.findOne({
    attributes: ["SchoolId"],
    where: {
      TokenHash: getTokenHash(token),
      TokenType: "school-dashboard",
      RevokedAt: null,
      ExpiresAt: { [Op.gt]: new Date() },
    },
  });
  return session ? { schoolId: Number(session.SchoolId) } : null;
}

async function revokeSchoolToken(token) {
  if (!token) return;
  await SchoolDashboardToken.update(
    { RevokedAt: new Date() },
    {
      where: {
        TokenHash: getTokenHash(token),
        TokenType: "school-dashboard",
        RevokedAt: null,
      },
    }
  );
}

async function revokeSchoolTokens(schoolId) {
  await SchoolDashboardToken.update(
    { RevokedAt: new Date() },
    {
      where: {
        SchoolId: Number(schoolId),
        TokenType: "school-dashboard",
        RevokedAt: null,
      },
    }
  );
}

function getSchoolTokenFromRequest(req) {
  const cookieHeader = String(req.headers.cookie || "");
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!cookie) return "";
  try {
    return decodeURIComponent(cookie.slice(COOKIE_NAME.length + 1));
  } catch {
    return "";
  }
}

function getSchoolCookieOptions(req, rememberMe = false, expiresAt) {
  const options = {
    httpOnly: true,
    sameSite: "lax",
    secure: req.secure || process.env.NODE_ENV === "production",
    path: "/",
  };
  if (rememberMe && expiresAt) options.expires = expiresAt;
  return options;
}

module.exports = {
  COOKIE_NAME,
  createSchoolToken,
  ensureSchoolDashboardTokenTable,
  getSchoolCookieOptions,
  getSchoolTokenFromRequest,
  revokeSchoolToken,
  revokeSchoolTokens,
  verifySchoolToken,
};
