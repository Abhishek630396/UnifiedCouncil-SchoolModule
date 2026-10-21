const crypto = require("crypto");

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

function getSecret() {
  return process.env.ADMIN_AUTH_SECRET || process.env.JWT_SECRET || "change-this-admin-secret";
}

function toBase64Url(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function createAdminToken(username, claims = {}) {
  const payload = {
    sub: username,
    role: "admin",
    exp: Date.now() + TOKEN_TTL_MS,
    ...claims,
  };
  const encodedPayload = toBase64Url(payload);
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

function verifyAdminToken(token) {
  const [encodedPayload, signature] = String(token || "").split(".");
  if (!encodedPayload || !signature || sign(encodedPayload) !== signature) {
    return null;
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
  } catch (error) {
    return null;
  }
  if (payload.role !== "admin" || Number(payload.exp || 0) < Date.now()) {
    return null;
  }

  return payload;
}

module.exports = {
  createAdminToken,
  verifyAdminToken,
};
