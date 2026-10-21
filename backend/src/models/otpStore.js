const OTP_TTL_MS = 5 * 60 * 1000;
const { runSql, sqlString } = require("../config/db");

async function ensureUserOtpTable() {
  await runSql(`
    IF OBJECT_ID('dbo.UserOTP', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.UserOTP (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Mobile NVARCHAR(20) NOT NULL,
        OTP NVARCHAR(10) NOT NULL,
        ExpiresAt BIGINT NOT NULL,
        Used BIT NOT NULL DEFAULT 0,
        CreatedOn DATETIME NOT NULL DEFAULT GETDATE()
      )
    END;
  `);
}

async function setOtp(mobile, otp) {
  await ensureUserOtpTable();
  const expiresAt = Date.now() + OTP_TTL_MS;
  // Mark previous OTPs as used
  await runSql(`UPDATE dbo.UserOTP SET Used = 1 WHERE Mobile = ${sqlString(mobile)} AND Used = 0;`);
  // Insert new OTP
  await runSql(`
    INSERT INTO dbo.UserOTP (Mobile, OTP, ExpiresAt, Used)
    VALUES (${sqlString(mobile)}, ${sqlString(otp)}, ${expiresAt}, 0);
  `);
}

async function verifyOtp(mobile, otp) {
  await ensureUserOtpTable();
  const now = Date.now();
  // Find unused, unexpired OTP
  const result = await runSql(`
    SELECT TOP 1 Id, OTP, ExpiresAt, Used
    FROM dbo.UserOTP
    WHERE Mobile = ${sqlString(mobile)} AND Used = 0
    ORDER BY Id DESC;
  `);
  let record;
  try {
    record = JSON.parse(result.match(/\{.*\}/s)?.[0] || null);
  } catch {
    record = null;
  }
  if (!record) return false;
  if (record.ExpiresAt < now) {
    await runSql(`UPDATE dbo.UserOTP SET Used = 1 WHERE Id = ${record.Id};`);
    return false;
  }
  if (record.OTP !== otp) return false;
  await runSql(`UPDATE dbo.UserOTP SET Used = 1 WHERE Id = ${record.Id};`);
  return true;
}

module.exports = {
  setOtp,
  verifyOtp,
};
