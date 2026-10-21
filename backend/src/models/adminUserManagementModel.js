const { runSql, sqlString } = require("../config/db");

let schemaPromise;

function sqlUnicodeBase64(value) {
  const encoded = Buffer.from(String(value), "utf16le").toString("base64");
  return `CONVERT(NVARCHAR(MAX), CAST(N'${encoded}' AS XML).value('xs:base64Binary(.)', 'VARBINARY(MAX)'))`;
}

function parseJsonResult(output) {
  const normalizedOutput = String(output || "").replace(/^\uFEFF/, "").trim();
  const startIndex = normalizedOutput.search(/[\[{]/);
  if (startIndex === -1) return null;

  const jsonStart = normalizedOutput[startIndex];
  const closingCharacter = jsonStart === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = startIndex; index < normalizedOutput.length; index += 1) {
    const character = normalizedOutput[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === "\"") inString = false;
      continue;
    }
    if (character === "\"") inString = true;
    else if (character === "{" || character === "[") depth += 1;
    else if (character === "}" || character === "]") {
      depth -= 1;
      if (depth === 0 && character === closingCharacter) {
        return JSON.parse(normalizedOutput.slice(startIndex, index + 1));
      }
    }
  }
  throw new Error("The database returned incomplete admin account data.");
}

function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = runSql(`
      SET NOCOUNT ON;
      IF OBJECT_ID(N'dbo.AdminManagedRoles', N'U') IS NULL
      BEGIN
        CREATE TABLE dbo.AdminManagedRoles (
          RoleId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
          Name NVARCHAR(80) NOT NULL UNIQUE,
          Permissions NVARCHAR(MAX) NOT NULL,
          CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_AdminManagedRoles_CreatedAt DEFAULT SYSUTCDATETIME()
        );
      END;
      IF OBJECT_ID(N'dbo.AdminManagedUsers', N'U') IS NULL
      BEGIN
        CREATE TABLE dbo.AdminManagedUsers (
          UserId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
          Username NVARCHAR(100) NOT NULL UNIQUE,
          DisplayName NVARCHAR(120) NOT NULL,
          PasswordHash CHAR(128) NOT NULL,
          PasswordSalt CHAR(32) NOT NULL,
          RoleId INT NOT NULL,
          IsActive BIT NOT NULL CONSTRAINT DF_AdminManagedUsers_IsActive DEFAULT 1,
          CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_AdminManagedUsers_CreatedAt DEFAULT SYSUTCDATETIME(),
          CONSTRAINT FK_AdminManagedUsers_Roles FOREIGN KEY (RoleId)
            REFERENCES dbo.AdminManagedRoles(RoleId)
        );
      END;
    `).catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  return schemaPromise;
}

function parsePermissions(value) {
  try {
    const permissions = JSON.parse(String(value || "[]"));
    return Array.isArray(permissions) ? permissions : [];
  } catch (error) {
    throw new Error("An admin role has invalid stored permissions.");
  }
}

async function listManagedAdminRoles() {
  await ensureSchema();
  const output = await runSql(`
    SET NOCOUNT ON;
    SELECT RoleId AS id, Name AS name, Permissions AS permissions, CreatedAt AS createdAt
    FROM dbo.AdminManagedRoles
    ORDER BY Name
    FOR JSON PATH;
  `);
  return (parseJsonResult(output) || []).map((role) => ({
    ...role,
    permissions: parsePermissions(role.permissions),
  }));
}

async function listManagedAdminUsers() {
  await ensureSchema();
  const output = await runSql(`
    SET NOCOUNT ON;
    SELECT
      users.UserId AS id,
      users.Username AS username,
      users.DisplayName AS displayName,
      users.RoleId AS roleId,
      roles.Name AS roleName,
      users.IsActive AS isActive,
      users.CreatedAt AS createdAt
    FROM dbo.AdminManagedUsers AS users
    INNER JOIN dbo.AdminManagedRoles AS roles ON roles.RoleId = users.RoleId
    ORDER BY users.DisplayName, users.Username
    FOR JSON PATH;
  `);
  return parseJsonResult(output) || [];
}

async function getManagedAdminUserByUsername(username) {
  await ensureSchema();
  const output = await runSql(`
    SET NOCOUNT ON;
    SELECT TOP (1)
      users.UserId AS id,
      users.Username AS username,
      users.DisplayName AS displayName,
      users.PasswordHash AS passwordHash,
      users.PasswordSalt AS passwordSalt,
      users.RoleId AS roleId,
      users.IsActive AS isActive,
      roles.Permissions AS permissions
    FROM dbo.AdminManagedUsers AS users
    INNER JOIN dbo.AdminManagedRoles AS roles ON roles.RoleId = users.RoleId
    WHERE users.Username = ${sqlString(username)}
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
  `);
  return parseJsonResult(output);
}

async function getManagedAdminUserAuthorization(userId) {
  await ensureSchema();
  const output = await runSql(`
    SET NOCOUNT ON;
    SELECT TOP (1)
      users.UserId AS id,
      users.IsActive AS isActive,
      roles.Permissions AS permissions
    FROM dbo.AdminManagedUsers AS users
    INNER JOIN dbo.AdminManagedRoles AS roles ON roles.RoleId = users.RoleId
    WHERE users.UserId = ${Number(userId)}
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
  `);
  const user = parseJsonResult(output);
  return user ? { ...user, permissions: parsePermissions(user.permissions) } : null;
}

async function createManagedAdminRole({ name, permissions }) {
  await ensureSchema();
  const output = await runSql(`
    SET QUOTED_IDENTIFIER ON;
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM dbo.AdminManagedRoles WHERE Name = ${sqlString(name)})
      SELECT N'role_exists' AS error FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
    ELSE
    BEGIN
      INSERT INTO dbo.AdminManagedRoles (Name, Permissions)
      VALUES (${sqlString(name)}, ${sqlUnicodeBase64(JSON.stringify(permissions))});
      SELECT CAST(SCOPE_IDENTITY() AS INT) AS id, ${sqlString(name)} AS name
      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
    END;
  `);
  const result = parseJsonResult(output);
  if (result?.error === "role_exists") {
    throw new Error("A role with this name already exists.");
  }
  return result;
}

async function updateManagedAdminRolePermissions({ roleId, permissions }) {
  await ensureSchema();
  const output = await runSql(`
    SET QUOTED_IDENTIFIER ON;
    SET NOCOUNT ON;
    UPDATE dbo.AdminManagedRoles
    SET Permissions = ${sqlUnicodeBase64(JSON.stringify(permissions))}
    WHERE RoleId = ${Number(roleId)};
    SELECT @@ROWCOUNT AS affected FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
  `);
  const result = parseJsonResult(output);
  return Number(result?.affected) === 1;
}

async function deleteManagedAdminRole(roleId) {
  await ensureSchema();
  const output = await runSql(`
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    IF NOT EXISTS (
      SELECT 1
      FROM dbo.AdminManagedRoles WITH (UPDLOCK, HOLDLOCK)
      WHERE RoleId = ${Number(roleId)}
    )
    BEGIN
      COMMIT TRANSACTION;
      SELECT N'not_found' AS result FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
    END
    ELSE IF EXISTS (SELECT 1 FROM dbo.AdminManagedUsers WHERE RoleId = ${Number(roleId)})
    BEGIN
      COMMIT TRANSACTION;
      SELECT N'assigned_users' AS result FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
    END
    ELSE
    BEGIN
      DELETE FROM dbo.AdminManagedRoles WHERE RoleId = ${Number(roleId)};
      COMMIT TRANSACTION;
      SELECT N'deleted' AS result FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
    END;
  `);
  const result = parseJsonResult(output);
  return result?.result;
}

async function createManagedAdminUser({
  username,
  displayName,
  passwordHash,
  passwordSalt,
  roleId,
}) {
  await ensureSchema();
  const output = await runSql(`
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM dbo.AdminManagedUsers WHERE Username = ${sqlString(username)})
      SELECT N'username_exists' AS error FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
    ELSE IF NOT EXISTS (SELECT 1 FROM dbo.AdminManagedRoles WHERE RoleId = ${Number(roleId)})
      SELECT N'role_not_found' AS error FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
    ELSE
    BEGIN
      INSERT INTO dbo.AdminManagedUsers
        (Username, DisplayName, PasswordHash, PasswordSalt, RoleId)
      VALUES (
        ${sqlString(username)},
        ${sqlString(displayName)},
        ${sqlString(passwordHash)},
        ${sqlString(passwordSalt)},
        ${Number(roleId)}
      );
      SELECT CAST(SCOPE_IDENTITY() AS INT) AS id, ${sqlString(username)} AS username
      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
    END;
  `);
  const result = parseJsonResult(output);
  if (result?.error === "username_exists") {
    throw new Error("A managed admin account with this username already exists.");
  }
  if (result?.error === "role_not_found") {
    throw new Error("The selected role no longer exists.");
  }
  return result;
}

async function setManagedAdminUserStatus({ userId, isActive }) {
  await ensureSchema();
  const output = await runSql(`
    SET NOCOUNT ON;
    UPDATE dbo.AdminManagedUsers
    SET IsActive = ${isActive ? 1 : 0}
    WHERE UserId = ${Number(userId)};
    SELECT @@ROWCOUNT AS affected FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
  `);
  const result = parseJsonResult(output);
  return Number(result?.affected) === 1;
}

module.exports = {
  createManagedAdminRole,
  createManagedAdminUser,
  deleteManagedAdminRole,
  getManagedAdminUserAuthorization,
  getManagedAdminUserByUsername,
  listManagedAdminRoles,
  listManagedAdminUsers,
  updateManagedAdminRolePermissions,
  setManagedAdminUserStatus,
};
