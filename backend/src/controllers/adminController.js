const {
  addSchoolExamDate,
  getAdminSchoolExamDates,
  getSchoolExamDates,
  replaceSchoolExamDates,
  updateSchoolExamDate,
  toggleSchoolExamDateStatus,
} = require("../models/school/schoolExamDateModel");
const {
  listAdminIndividualStudents: fetchAdminIndividualStudents,
  listAdminRegistrations: fetchAdminRegistrations,
  closeAdminUnsubmittedRegistration: submitAdminUnsubmittedRegistration,
} = require("../models/registrationModel");
const {
  listAdminSchoolStudentRegistrations: fetchAdminSchoolStudentRegistrations,
  markSchoolStudentRowSuccess: markSchoolStudentRegistrationSuccess,
} = require("../models/school/studentRegistrationModal");
const { createAdminToken } = require("../utils/adminToken");
const crypto = require("crypto");
const {
  getManagedAdminUserByUsername,
} = require("../models/adminUserManagementModel");
const {
  createAdminCoordinator: insertAdminCoordinator,
  createAdminTest: insertAdminTest,
  deleteAdminTableRow: removeAdminTableRow,
  getAdminCoordinatorPassword: fetchAdminCoordinatorPassword,
  listAdminTableData: fetchAdminTableData,
  setAdminTestStatus: saveAdminTestStatus,
  updateAdminTableRow: saveAdminTableRow,
} = require("../models/adminTableModel");

function getConfiguredAdmin() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin123",
  };
}

async function loginAdmin(req, res, next) {
  try {
    const username = String(req.body?.username || "").trim();
    const password = String(req.body?.password || "");
    const admin = getConfiguredAdmin();

    if (username === admin.username) {
      if (password !== admin.password) {
        return res.status(401).json({
          success: false,
          message: "Invalid admin credentials.",
        });
      }

      return res.json({
        success: true,
        message: "Admin login successful.",
        data: {
          token: createAdminToken(admin.username, { isSuperAdmin: true }),
          username: admin.username,
          isSuperAdmin: true,
        },
      });
    }

    const managedUser = await getManagedAdminUserByUsername(username.toLowerCase());
    const storedHash = Buffer.from(String(managedUser?.passwordHash || ""), "hex");
    const salt = String(managedUser?.passwordSalt || "");
    const submittedHash = managedUser && salt
      ? crypto.scryptSync(password, salt, 64)
      : Buffer.alloc(64);
    const isValidPassword = storedHash.length === submittedHash.length
      && crypto.timingSafeEqual(storedHash, submittedHash);

    if (!managedUser || !managedUser.isActive || !isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    let permissions;
    try {
      permissions = JSON.parse(String(managedUser.permissions || "[]"));
    } catch (error) {
      return next(new Error("The admin account has invalid role permissions."));
    }

    return res.json({
      success: true,
      message: "Admin login successful.",
      data: {
        token: createAdminToken(managedUser.username, { managedUserId: managedUser.id }),
        username: managedUser.username,
        displayName: managedUser.displayName,
        isSuperAdmin: false,
        permissions: Array.isArray(permissions) ? permissions : [],
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function listExamDates(_req, res, next) {
  try {
    const exams = await getSchoolExamDates();
    return res.json({
      success: true,
      data: exams,
    });
  } catch (error) {
    return next(error);
  }
}

async function listAdminExamDates(req, res, next) {
  try {
    const exams = await getAdminSchoolExamDates({
      page: req.query.page,
      pageSize: req.query.pageSize,
    });

    return res.json({
      success: true,
      data: exams,
    });
  } catch (error) {
    return next(error);
  }
}

async function listAdminRegistrations(req, res, next) {
  try {
    res.set("Cache-Control", "no-store");
    const result = await fetchAdminRegistrations({
      page: req.query.page,
      pageSize: req.query.pageSize,
      search: req.query.search,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      status: req.query.status,
      packageName: req.query.packageName,
    });
    return res.json({ success: true, data: result.rows, pagination: result.pagination });
  } catch (error) {
    return next(error);
  }
}

async function closeAdminUnsubmittedRegistration(req, res, next) {
  const registrationId = Number(req.body?.registrationId);
  if (!Number.isSafeInteger(registrationId) || registrationId <= 0) {
    return res.status(400).json({
      success: false,
      message: "A valid unsubmitted registration ID is required.",
    });
  }

  try {
    const result = await submitAdminUnsubmittedRegistration({ registrationId });
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "This unsubmitted registration was not found.",
      });
    }
    return res.json({
      success: true,
      message: "The registration was submitted and added to registered data.",
    });
  } catch (error) {
    if (
      error.message.startsWith("This draft") ||
      error.message.startsWith("No pending registered") ||
      error.message.startsWith("More than one pending registered")
    ) {
      return res.status(409).json({ success: false, message: error.message });
    }
    return next(error);
  }
}

async function listAdminIndividualRegistrations(req, res, next) {
  try {
    res.set("Cache-Control", "no-store");
    const result = await fetchAdminIndividualStudents({
      page: req.query.page,
      pageSize: req.query.pageSize,
      search: req.query.search,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      status: req.query.status,
      packageName: req.query.packageName,
    });
    return res.json({ success: true, data: result.rows, pagination: result.pagination });
  } catch (error) {
    return next(error);
  }
}

async function listAdminSchoolStudents(req, res, next) {
  try {
    res.set("Cache-Control", "no-store");
    const result = await fetchAdminSchoolStudentRegistrations({
      page: req.query.page,
      pageSize: req.query.pageSize,
      search: req.query.search,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      status: req.query.status,
      packageName: req.query.packageName,
    });
    return res.json({ success: true, data: result.rows, pagination: result.pagination });
  } catch (error) {
    return next(error);
  }
}

async function markAdminSchoolStudentSuccess(req, res, next) {
  const studentId = Number(req.body?.studentId);
  const registrationCode = String(req.body?.registrationCode || "").trim();

  if (!Number.isSafeInteger(studentId) || studentId <= 0 || !registrationCode || registrationCode.length > 100) {
    return res.status(400).json({
      success: false,
      message: "A valid studentId and registrationCode are required to mark this school student successful.",
    });
  }

  try {
    const updated = await markSchoolStudentRegistrationSuccess({ studentId, registrationCode });
    if (!updated) {
      return res.status(409).json({
        success: false,
        message: "This school student row was not updated. Refresh the pending records and try again.",
      });
    }

    return res.json({
      success: true,
      message: "This school student registration was marked successful.",
    });
  } catch (error) {
    return next(error);
  }
}

async function listAdminTableData(req, res, next) {
  try {
    res.set("Cache-Control", "no-store");
    const result = await fetchAdminTableData(req.params.tableKey, {
      page: req.query.page,
      pageSize: req.query.pageSize,
      statusFilter: req.query.status,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      search: req.query.search,
    });
    const protectedColumns = req.params.tableKey === "qr-users"
      ? result.columns.filter((column) => /(password|passcode|pwd|secret|token|otp|credential|salt|hash)/i.test(column.name))
      : req.params.tableKey === "coordinators-list"
        ? result.columns.filter((column) => /password/i.test(column.name))
      : [];
    const protectedColumnNames = new Set(protectedColumns.map((column) => column.name));
    const columns = req.params.tableKey === "qr-users"
      ? result.columns.filter((column) => !protectedColumnNames.has(column.name))
      : result.columns;
    const rows = result.rows.map((row) => protectedColumns.reduce(
      (safeRow, column) => {
        if (req.params.tableKey === "qr-users") {
          delete safeRow[column.name];
        } else {
          safeRow[column.name] = "********";
        }
        return safeRow;
      },
      { ...row },
    ));
    return res.json({
      success: true,
      data: rows,
      columns,
      primaryKey: req.params.tableKey === "qr-users"
        ? result.primaryKey.filter((column) => !protectedColumnNames.has(column))
        : result.primaryKey,
      pagination: result.pagination,
      dateColumn: result.dateColumn,
      ...(result.statusCounts && { statusCounts: result.statusCounts }),
    });
  } catch (error) {
    if (
      error.message.startsWith("Test status filter") ||
      error.message.startsWith("Unsubmitted registration status filter") ||
      error.message.startsWith("Date filters") ||
      error.message.startsWith("The start date") ||
      error.message.startsWith("Date filtering")
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.message === "The requested admin table is not available.") {
      return res.status(404).json({ success: false, message: error.message });
    }
    return next(error);
  }
}

async function createAdminCoordinator(req, res, next) {
  const fields = ["CO_ID", "CO_Name", "CO_Email", "CO_Password", "CO_Mobile", "CO_Address"];
  const aliases = {
    CO_ID: ["CO_ID", "CoordinatorId", "coordinatorid", "co_id"],
    CO_Name: ["CO_Name", "CoordinatorName", "coordinatorname", "co_name"],
    CO_Email: ["CO_Email", "Email", "email", "co_email"],
    CO_Password: ["CO_Password", "Password", "password", "co_password"],
    CO_Mobile: ["CO_Mobile", "Mobile", "mobile", "co_mobile"],
    CO_Address: ["CO_Address", "Address", "address", "co_address"],
  };
  const values = Object.fromEntries(fields.map((field) => {
    const source = aliases[field].find((name) => req.body?.[name] !== undefined && req.body?.[name] !== null);
    const rawValue = source ? req.body[source] : req.body?.[field];
    return [field, String(rawValue ?? "").trim()];
  }));
  const missingField = fields.find((field) => !values[field]);
  if (missingField) {
    return res.status(400).json({
      success: false,
      message: `${missingField.replace("_", " ")} is required.`,
    });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.CO_Email)) {
    return res.status(400).json({ success: false, message: "Enter a valid coordinator email address." });
  }

  try {
    await insertAdminCoordinator(values);
    return res.status(201).json({
      success: true,
      message: "Coordinator registered successfully.",
    });
  } catch (error) {
    if (
      error.message.startsWith("The coordinator table") ||
      error.message.startsWith("The coordinator field") ||
      error.message === "The coordinator was not saved."
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return next(error);
  }
}

async function getAdminCoordinatorPassword(req, res, next) {
  const key = req.body?.key;
  const column = typeof req.body?.column === "string" ? req.body.column : "";
  if (!key || typeof key !== "object" || Array.isArray(key) || !column) {
    return res.status(400).json({ success: false, message: "A coordinator key and password field are required." });
  }

  try {
    const password = await fetchAdminCoordinatorPassword(key, column);
    if (password === null) {
      return res.status(404).json({ success: false, message: "Coordinator not found." });
    }
    res.set("Cache-Control", "no-store");
    return res.json({ success: true, data: { password } });
  } catch (error) {
    if (
      error.message.startsWith("A valid row key") ||
      error.message.startsWith("The row key") ||
      error.message.startsWith("Coordinator passwords") ||
      error.message.startsWith("The coordinator table")
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return next(error);
  }
}

async function createAdminTest(req, res, next) {
  const testName = typeof req.body?.testName === "string" ? req.body.testName.trim() : "";
  if (!testName) {
    return res.status(400).json({ success: false, message: "A test name is required." });
  }

  try {
    await insertAdminTest({ testName });
    return res.status(201).json({
      success: true,
      message: "Test created successfully.",
    });
  } catch (error) {
    if (
      error.message.startsWith("A test name") ||
      error.message.startsWith("The test name") ||
      error.message.startsWith("The test table") ||
      error.message.startsWith("The test was not saved.") ||
      error.message.startsWith("The test table has")
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return next(error);
  }
}

async function updateAdminTableRow(req, res, next) {
  const key = req.body?.key;
  const values = req.body?.values;
  if (!key || !values || typeof key !== "object" || Array.isArray(key) || typeof values !== "object" || Array.isArray(values)) {
    return res.status(400).json({ success: false, message: "A row key and field values are required." });
  }
  if (req.params.tableKey === "coordinators-list") {
    const emailEntry = Object.entries(values).find(([field]) => ["co_email", "email"].includes(field.toLowerCase()));
    if (emailEntry && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(emailEntry[1] ?? "").trim())) {
      return res.status(400).json({ success: false, message: "Enter a valid coordinator email address." });
    }
  }

  try {
    const updated = await saveAdminTableRow({ tableKey: req.params.tableKey, key, values });
    if (!updated) {
      return res.status(409).json({
        success: false,
        message: "The record was not updated. It may have changed or been removed; refresh the list and try again.",
      });
    }
    return res.json({ success: true, message: "Record updated successfully." });
  } catch (error) {
    if (
      error.message.startsWith("The requested admin table") ||
      error.message.startsWith("The row key") ||
      error.message.startsWith("A valid row key") ||
      error.message.startsWith("At least one field") ||
      error.message.startsWith("The field") ||
      error.message.startsWith("Table changes") ||
      error.message.startsWith("Records in dbo.")
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return next(error);
  }
}

async function updateAdminTestStatus(req, res, next) {
  const key = req.body?.key;
  const status = req.body?.status;
  if (!key || typeof key !== "object" || Array.isArray(key) || (status !== 0 && status !== 1)) {
    return res.status(400).json({
      success: false,
      message: "A test row key and status (0 or 1) are required.",
    });
  }

  try {
    const updated = await saveAdminTestStatus({ key, status });
    if (!updated) {
      return res.status(409).json({
        success: false,
        message: "The test status was not updated. Refresh the list and try again.",
      });
    }
    return res.json({
      success: true,
      message: `Test ${status === 1 ? "activated" : "deactivated"} successfully.`,
    });
  } catch (error) {
    if (
      error.message.startsWith("A valid row key") ||
      error.message.startsWith("The row key") ||
      error.message.startsWith("Tests cannot be updated") ||
      error.message.startsWith("The test table") ||
      error.message.startsWith("Test status")
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return next(error);
  }
}

async function deleteAdminTableRow(req, res, next) {
  const key = req.body?.key;
  if (!key || typeof key !== "object" || Array.isArray(key)) {
    return res.status(400).json({ success: false, message: "A row key is required." });
  }

  try {
    const deleted = await removeAdminTableRow({ tableKey: req.params.tableKey, key });
    if (!deleted) {
      return res.status(409).json({
        success: false,
        message: "The record was not deleted. It may have changed or already been removed; refresh the list and try again.",
      });
    }
    return res.json({ success: true, message: "Record deleted successfully." });
  } catch (error) {
    if (
      error.message.startsWith("The requested admin table") ||
      error.message.startsWith("The row key") ||
      error.message.startsWith("A valid row key") ||
      error.message.startsWith("Records in dbo.")
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return next(error);
  }
}

async function createExamDate(req, res, next) {
  try {
    const savedExamDate = await addSchoolExamDate(req.body);

    return res.status(201).json({
      success: true,
      message: "Exam date inserted successfully.",
      data: savedExamDate,
    });
  } catch (error) {
    return next(error);
  }
}

async function toggleExamDateStatus(req, res, next) {
  try {
    const updatedExamDate = await toggleSchoolExamDateStatus(req.params.id);

    return res.json({
      success: true,
      message: "Exam date status updated successfully.",
      data: updatedExamDate,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateExamDates(req, res, next) {
  try {
    const exams = Array.isArray(req.body?.exams) ? req.body.exams : [];
    const savedExams = await replaceSchoolExamDates(exams);

    return res.json({
      success: true,
      message: "Exam dates updated successfully.",
      data: savedExams,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateExamDate(req, res, next) {
  try {
    const updatedExamDate = await updateSchoolExamDate(req.params.id, req.body);
    return res.json({
      success: true,
      message: "Exam date updated successfully.",
      data: updatedExamDate,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  loginAdmin,
  createAdminCoordinator,
  getAdminCoordinatorPassword,
  createAdminTest,
  createExamDate,
  listAdminExamDates,
  listAdminIndividualRegistrations,
  listAdminRegistrations,
  closeAdminUnsubmittedRegistration,
  listAdminSchoolStudents,
  listAdminTableData,
  markAdminSchoolStudentSuccess,
  updateAdminTableRow,
  updateAdminTestStatus,
  deleteAdminTableRow,
  listExamDates,
  toggleExamDateStatus,
  updateExamDate,
  updateExamDates,
};
