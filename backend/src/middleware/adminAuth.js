const { verifyAdminToken } = require("../utils/adminToken");
const { getManagedAdminUserAuthorization } = require("../models/adminUserManagementModel");

const TABLE_PERMISSION_KEYS = {
  documents: "documents",
  "create-tests": "tests",
  feedbacks: "feedbacks",
  "class-documents": "class_documents",
  "coordinators-list": "coordinators",
  "unsubmitted-registration": "unsubmitted_registrations",
};

function getRequiredPermission(method, pathname) {
  const verb = String(method || "").toUpperCase();
  const isRead = verb === "GET";
  const readOrManage = (feature) => `${feature}.${isRead ? "view" : "manage"}`;

  if (/^\/api\/admin\/(school-students|registrations)(?:\/.*)?$/.test(pathname)) {
    return readOrManage("school_students");
  }
  if (/^\/api\/admin\/individual-registrations(?:\/.*)?$/.test(pathname)) {
    return readOrManage("individual_students");
  }
  if (/^\/api\/registrations\/admin\/mark-success$/.test(pathname)) {
    return "individual_students.manage";
  }
  if (/^\/api\/admin\/exam-dates(?:\/.*)?$/.test(pathname)) {
    return readOrManage("exam_dates");
  }
  if (/^\/api\/admin\/tables\/([^/]+)(?:\/row)?$/.test(pathname)) {
    const [, tableKey] = pathname.match(/^\/api\/admin\/tables\/([^/]+)(?:\/row)?$/) || [];
    const feature = TABLE_PERMISSION_KEYS[tableKey];
    return feature ? readOrManage(feature) : null;
  }
  if (/^\/api\/admin\/tests(?:\/.*)?$/.test(pathname)) return readOrManage("tests");
  if (/^\/api\/admin\/coordinators(?:\/.*)?$/.test(pathname)) return readOrManage("coordinators");
  if (/^\/api\/admin\/unsubmitted-registrations(?:\/.*)?$/.test(pathname)) {
    return readOrManage("unsubmitted_registrations");
  }
  if (/^\/api\/admin\/enquiries(?:\/.*)?$/.test(pathname) || /^\/api\/enquiries(?:\/.*)?$/.test(pathname)) {
    return readOrManage("enquiries");
  }
  if (/^\/api\/admin\/exam-prices(?:\/.*)?$/.test(pathname)) return readOrManage("exam_prices");
  if (/^\/api\/school-registration\/registered-schools(?:\/.*)?$/.test(pathname)) {
    return readOrManage("registered_schools");
  }
  if (/^\/api\/static-content-admin\/(?:hot-links|achievers)(?:\/.*)?$/.test(pathname)) {
    return readOrManage("static_content");
  }
  return null;
}

function isSuperAdmin(admin) {
  return admin.isSuperAdmin === true || !admin.managedUserId;
}

async function authenticateAdmin(req, res) {
  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const admin = verifyAdminToken(token);
  if (!admin) {
    res.status(401).json({
      success: false,
      message: "Admin authentication is required.",
    });
    return null;
  }

  if (admin.managedUserId) {
    try {
      const account = await getManagedAdminUserAuthorization(admin.managedUserId);
      if (!account || !account.isActive) {
        res.status(401).json({ success: false, message: "This admin account is no longer active." });
        return null;
      }
      req.adminPermissions = account.permissions;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  req.admin = admin;
  return admin;
}

function requireAdmin(req, res, next) {
  authenticateAdmin(req, res)
    .then((admin) => {
      if (!admin) return;
      if (isSuperAdmin(admin)) return next();
      const pathname = `${req.baseUrl}${req.path}`;
      const requiredPermission = getRequiredPermission(req.method, pathname);
      const canAccess = requiredPermission
        && (
          req.adminPermissions.includes(requiredPermission)
          || (requiredPermission.endsWith(".view")
            && req.adminPermissions.includes(`${requiredPermission.slice(0, -5)}.manage`))
        );
      if (!canAccess) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this admin feature.",
        });
      }
      return next();
    })
    .catch(next);
}

function requireSuperAdmin(req, res, next) {
  authenticateAdmin(req, res)
    .then((admin) => {
      if (!admin) return;
      if (!isSuperAdmin(admin)) {
        return res.status(403).json({
          success: false,
          message: "Only the super admin can manage admin users and roles.",
        });
      }
      return next();
    })
    .catch(next);
}

module.exports = {
  requireAdmin,
  requireSuperAdmin,
};
