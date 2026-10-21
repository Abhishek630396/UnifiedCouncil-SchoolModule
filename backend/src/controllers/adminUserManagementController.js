const crypto = require("crypto");
const {
  ADMIN_PERMISSION_GROUPS,
  ADMIN_PERMISSION_KEYS,
} = require("../constants/adminPermissions");
const {
  createManagedAdminRole: insertManagedAdminRole,
  createManagedAdminUser: insertManagedAdminUser,
  deleteManagedAdminRole: removeManagedAdminRole,
  listManagedAdminRoles: fetchManagedAdminRoles,
  listManagedAdminUsers: fetchManagedAdminUsers,
  setManagedAdminUserStatus: saveManagedAdminUserStatus,
  updateManagedAdminRolePermissions: saveManagedAdminRolePermissions,
} = require("../models/adminUserManagementModel");

function listManagedRoles(_req, res, next) {
  fetchManagedAdminRoles()
    .then((roles) => res.json({ success: true, data: roles }))
    .catch(next);
}

function listManagedUsers(_req, res, next) {
  fetchManagedAdminUsers()
    .then((users) => res.json({ success: true, data: users }))
    .catch(next);
}

async function createManagedRole(req, res, next) {
  const name = String(req.body?.name || "").trim();
  const permissions = req.body?.permissions;

  if (name.length < 2 || name.length > 80) {
    return res.status(400).json({ success: false, message: "Role names must be between 2 and 80 characters." });
  }
  if (!Array.isArray(permissions) || permissions.some((permission) => !ADMIN_PERMISSION_KEYS.has(permission))) {
    return res.status(400).json({ success: false, message: "Choose valid permissions for this role." });
  }

  try {
    const role = await insertManagedAdminRole({
      name,
      permissions: [...new Set(permissions)],
    });
    return res.status(201).json({ success: true, message: "Role created successfully.", data: role });
  } catch (error) {
    if (error.message === "A role with this name already exists.") {
      return res.status(409).json({ success: false, message: error.message });
    }
    return next(error);
  }
}

async function updateManagedRolePermissions(req, res, next) {
  const roleId = Number(req.params.roleId);
  const permissions = req.body?.permissions;
  if (!Number.isSafeInteger(roleId) || roleId <= 0) {
    return res.status(400).json({ success: false, message: "A valid role ID is required." });
  }
  if (!Array.isArray(permissions) || permissions.some((permission) => !ADMIN_PERMISSION_KEYS.has(permission))) {
    return res.status(400).json({ success: false, message: "Choose valid permissions for this role." });
  }

  try {
    const updated = await saveManagedAdminRolePermissions({
      roleId,
      permissions: [...new Set(permissions)],
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: "The admin role was not found." });
    }
    return res.json({ success: true, message: "Role permissions updated successfully." });
  } catch (error) {
    return next(error);
  }
}

async function deleteManagedRole(req, res, next) {
  const roleId = Number(req.params.roleId);
  if (!Number.isSafeInteger(roleId) || roleId <= 0) {
    return res.status(400).json({ success: false, message: "A valid role ID is required." });
  }

  try {
    const result = await removeManagedAdminRole(roleId);
    if (result === "not_found") {
      return res.status(404).json({ success: false, message: "The admin role was not found." });
    }
    if (result === "assigned_users") {
      return res.status(409).json({
        success: false,
        message: "This role is assigned to admin users. Reassign those users before deleting the role.",
      });
    }
    if (result !== "deleted") {
      throw new Error("The admin role could not be deleted.");
    }
    return res.json({ success: true, message: "Role deleted successfully." });
  } catch (error) {
    return next(error);
  }
}

async function createManagedUser(req, res, next) {
  const username = String(req.body?.username || "").trim().toLowerCase();
  const displayName = String(req.body?.displayName || "").trim();
  const password = String(req.body?.password || "");
  const roleId = Number(req.body?.roleId);
  const configuredAdminUsername = String(process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
  const isValidUsername = /^[a-z0-9._-]{3,64}$/.test(username);
  const isValidEmail = username.length <= 100
    && /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(username);

  if (!isValidUsername && !isValidEmail) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid username (3-64 letters, numbers, dots, underscores, or hyphens) or an email address up to 100 characters.",
    });
  }
  if (username === configuredAdminUsername) {
    return res.status(409).json({ success: false, message: "This username is reserved for the super admin." });
  }
  if (displayName.length < 2 || displayName.length > 120) {
    return res.status(400).json({ success: false, message: "Display names must be between 2 and 120 characters." });
  }
  if (password.length < 12 || password.length > 128) {
    return res.status(400).json({ success: false, message: "Passwords must be between 12 and 128 characters." });
  }
  if (!Number.isSafeInteger(roleId) || roleId <= 0) {
    return res.status(400).json({ success: false, message: "Select a valid role for this user." });
  }

  try {
    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = crypto.scryptSync(password, salt, 64).toString("hex");
    const user = await insertManagedAdminUser({
      username,
      displayName,
      passwordHash,
      passwordSalt: salt,
      roleId,
    });
    return res.status(201).json({
      success: true,
      message: "Admin user created successfully.",
      data: user,
    });
  } catch (error) {
    if (
      error.message === "A managed admin account with this username already exists."
      || error.message === "The selected role no longer exists."
    ) {
      return res.status(409).json({ success: false, message: error.message });
    }
    return next(error);
  }
}

async function setManagedUserStatus(req, res, next) {
  const userId = Number(req.params.userId);
  const isActive = req.body?.isActive;
  if (!Number.isSafeInteger(userId) || userId <= 0 || typeof isActive !== "boolean") {
    return res.status(400).json({ success: false, message: "A valid user ID and active status are required." });
  }

  try {
    const updated = await saveManagedAdminUserStatus({ userId, isActive });
    if (!updated) {
      return res.status(404).json({ success: false, message: "The admin user was not found." });
    }
    return res.json({
      success: true,
      message: `Admin user ${isActive ? "activated" : "deactivated"} successfully.`,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  ADMIN_PERMISSION_GROUPS,
  createManagedRole,
  createManagedUser,
  deleteManagedRole,
  listManagedRoles,
  listManagedUsers,
  setManagedUserStatus,
  updateManagedRolePermissions,
};
