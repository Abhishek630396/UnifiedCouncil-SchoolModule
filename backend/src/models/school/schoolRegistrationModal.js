const crypto = require("crypto");
const { DataTypes, Op, Transaction } = require("sequelize");
const { runSql, sqlString } = require("../../config/db");
const sequelize = require("../../config/dbConfig");

const SchoolRegistration = sequelize.define(
  "SchoolRegistration",
  {
    SchoolId: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    SchoolName: { type: DataTypes.STRING(300), allowNull: false },
    SchoolAddress: DataTypes.STRING(500),
    Place: { type: DataTypes.STRING(200), allowNull: false },
    District: { type: DataTypes.STRING(200), allowNull: false },
    State: DataTypes.STRING(100),
    Pincode: DataTypes.STRING(20),
    SchoolContact: DataTypes.STRING(50),
    SchoolMail: DataTypes.STRING(200),
    Schoolprinciname: DataTypes.STRING(200),
    IsNSTSEselected: { type: DataTypes.BOOLEAN, defaultValue: false },
    NSTSEExamdate: DataTypes.STRING(100),
    NSTSETeachername: DataTypes.STRING(200),
    NSTSETeachermobile: DataTypes.STRING(20),
    NSTSETeachemail: DataTypes.STRING(200),
    IsUIEOSelected: { type: DataTypes.BOOLEAN, defaultValue: false },
    UIEOExamdate: DataTypes.STRING(100),
    UIEOTeachername: DataTypes.STRING(200),
    UIEOTeacherMobile: DataTypes.STRING(20),
    UIEOTeacherMail: DataTypes.STRING(200),
    IsUIMOSelected: { type: DataTypes.BOOLEAN, defaultValue: false },
    UIMOExamdate: DataTypes.STRING(100),
    UIMOTeachername: DataTypes.STRING(200),
    UIMOTeacherMobile: DataTypes.STRING(20),
    UIMOTeacherMail: DataTypes.STRING(200),
    UCOExamdate: DataTypes.STRING(100),
    IsUCOSelected: { type: DataTypes.BOOLEAN, defaultValue: false },
    UCOTeacherName: DataTypes.STRING(200),
    UCOTeacherMobile: DataTypes.STRING(20),
    UCOTeacherMail: DataTypes.STRING(200),
    Syllabus: DataTypes.STRING(200),
    Regionalconame: DataTypes.STRING(200),
    Password: DataTypes.STRING(200),
    PrinciContact: DataTypes.STRING(20),
    REGNO: DataTypes.STRING(100),
    Coor: DataTypes.STRING(200),
    Country: DataTypes.STRING(100),
    Exam_Mode: DataTypes.STRING(50),
    UIGKOExamdate: DataTypes.STRING(100),
    IsUIGKOSelected: { type: DataTypes.BOOLEAN, defaultValue: false },
    UIGKOTeacherName: DataTypes.STRING(200),
    UIGKOTeacherMobile: DataTypes.STRING(20),
    UIGKOTeacherMail: DataTypes.STRING(200),
    Updated_Date: { type: DataTypes.DATE, defaultValue: sequelize.literal("GETDATE()") },
  },
  {
    tableName: "Tbl_SchoolRegistrations",
    schema: "dbo",
    timestamps: false,
  }
);

function cleanString(value) {
  return String(value ?? "").trim();
}

function normalizeStoredExamDate(value, fallbackMode) {
  const normalized = cleanString(value);
  if (!normalized) return "";

  if (/^\d{2}-\d{2}-\d{4}\s+\([^)]+\)-(Online|Offline)$/i.test(normalized)) {
    return normalized.replace(/-(online|offline)$/i, (_match, mode) =>
      `-${mode.charAt(0).toUpperCase()}${mode.slice(1).toLowerCase()}`
    );
  }

  const isoMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!isoMatch) return normalized;

  const [, year, month, day] = isoMatch;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];
  const mode = cleanString(fallbackMode).toLowerCase() === "offline" ? "Offline" : "Online";
  return `${day}-${month}-${year} (${dayName})-${mode}`;
}

function normalizePayload(payload) {
  const examMode = cleanString(payload.Exam_Mode || payload.examMode) || "Online";

  return {
    SchoolName: cleanString(payload.SchoolName || payload.schoolName),
    SchoolAddress: cleanString(payload.SchoolAddress || payload.schoolAddress),
    Place: cleanString(payload.Place || payload.place),
    District: cleanString(payload.District || payload.district),
    State: cleanString(payload.State || payload.state),
    Pincode: cleanString(payload.Pincode || payload.pincode),
    SchoolContact: cleanString(payload.SchoolContact || payload.schoolContact || payload.phone),
    SchoolMail: cleanString(payload.SchoolMail || payload.schoolMail || payload.email),
    Schoolprinciname: cleanString(payload.Schoolprinciname || payload.principalName),
    IsNSTSEselected: Boolean(payload.IsNSTSEselected ?? payload.nstseCheckbox),
    NSTSEExamdate: normalizeStoredExamDate(payload.NSTSEExamdate || payload.nstseExamDate, examMode),
    NSTSETeachername: cleanString(payload.NSTSETeachername || payload.nstseTeacher),
    NSTSETeachermobile: cleanString(payload.NSTSETeachermobile || payload.nstseTeacherMobile),
    NSTSETeachemail: cleanString(payload.NSTSETeachemail || payload.nstseTeacherEmail),
    IsUIEOSelected: Boolean(payload.IsUIEOSelected ?? payload.uieoCheckbox),
    UIEOExamdate: normalizeStoredExamDate(payload.UIEOExamdate || payload.uieoExamDate, examMode),
    UIEOTeachername: cleanString(payload.UIEOTeachername || payload.uieoTeacher),
    UIEOTeacherMobile: cleanString(payload.UIEOTeacherMobile || payload.uieoMobile),
    UIEOTeacherMail: cleanString(payload.UIEOTeacherMail || payload.uieoEmail),
    IsUIMOSelected: Boolean(payload.IsUIMOSelected ?? payload.uimoCheckbox),
    UIMOExamdate: normalizeStoredExamDate(payload.UIMOExamdate || payload.uimoExamDate, examMode),
    UIMOTeachername: cleanString(payload.UIMOTeachername || payload.uimoTeacher),
    UIMOTeacherMobile: cleanString(payload.UIMOTeacherMobile || payload.uimoPhone || payload.uimoMobile),
    UIMOTeacherMail: cleanString(payload.UIMOTeacherMail || payload.uimoEmail),
    UCOExamdate: normalizeStoredExamDate(payload.UCOExamdate || payload.ucoExamDate, examMode),
    IsUCOSelected: Boolean(payload.IsUCOSelected ?? payload.ucoCheckbox),
    UCOTeacherName: cleanString(payload.UCOTeacherName || payload.ucoTeacher),
    UCOTeacherMobile: cleanString(payload.UCOTeacherMobile || payload.ucoMobile),
    UCOTeacherMail: cleanString(payload.UCOTeacherMail || payload.ucoEmail),
    Syllabus: cleanString(payload.Syllabus || payload.syllabus),
    Regionalconame: cleanString(payload.Regionalconame || payload.regionalCoordinator),
    Password: cleanString(payload.Password || payload.password),
    PrinciContact: cleanString(payload.PrinciContact || payload.principalContact || payload.mobileNumber || payload.mobile),
    REGNO: cleanString(payload.REGNO || payload.regNo),
    Coor: cleanString(payload.Coor || payload.coor),
    Country: cleanString(payload.Country || payload.country),
    Exam_Mode: examMode,
    UIGKOExamdate: normalizeStoredExamDate(payload.UIGKOExamdate || payload.uigkoExamDate, examMode),
    IsUIGKOSelected: Boolean(payload.IsUIGKOSelected ?? payload.uigkoCheckbox),
    UIGKOTeacherName: cleanString(payload.UIGKOTeacherName || payload.uigkoTeacher),
    UIGKOTeacherMobile: cleanString(payload.UIGKOTeacherMobile || payload.uigkoMobile),
    UIGKOTeacherMail: cleanString(payload.UIGKOTeacherMail || payload.uigkoEmail),
  };
}

async function createSchoolRegistration(payload) {
  const row = normalizePayload(payload);
  const passwordLength = crypto.randomInt(5, 9);
  row.Password = String(
    crypto.randomInt(10 ** (passwordLength - 1), 10 ** passwordLength)
  );

  return sequelize.transaction(
    { isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE },
    async (transaction) => {
      if (!row.REGNO) {
        const maxSchoolId = Number(await SchoolRegistration.max("SchoolId", { transaction })) || 0;
        row.REGNO = `SCH${String(maxSchoolId + 1).padStart(6, "0")}`;
      }

      const school = await SchoolRegistration.create(row, { transaction });
      return {
        SchoolId: school.SchoolId,
        regNo: school.REGNO,
        initialPassword: row.Password,
      };
    }
  );
}

async function getSchoolRegistrationById(schoolId) {
  const normalizedId = String(schoolId || "").trim();
  if (!/^[A-Z0-9][A-Z0-9-]{0,98}[A-Z0-9]$|^[A-Z0-9]$/.test(normalizedId.toUpperCase())) {
    const error = new Error("A valid School ID is required.");
    error.statusCode = 400;
    throw error;
  }

  let school = null;
  if (/^\d+$/.test(normalizedId)) {
    const numericId = Number(normalizedId);
    if (Number.isSafeInteger(numericId)) {
      school = await SchoolRegistration.findByPk(numericId);
    }
  }
  if (!school) {
    school = await SchoolRegistration.findOne({
      where: { REGNO: normalizedId },
    });
  }
  if (!school) return null;

  return {
    schoolId: school.SchoolId,
    regNo: school.REGNO,
    schoolName: school.SchoolName,
    schoolAddress: school.SchoolAddress,
    place: school.Place,
    district: school.District,
    state: school.State,
    country: school.Country,
    examMode: school.Exam_Mode,
    isNSTSESelected: Boolean(school.IsNSTSEselected),
    nstseExamDate: school.NSTSEExamdate,
    isUIEOSelected: Boolean(school.IsUIEOSelected),
    uieoExamDate: school.UIEOExamdate,
    isUIMOSelected: Boolean(school.IsUIMOSelected),
    uimoExamDate: school.UIMOExamdate,
    isUCOSelected: Boolean(school.IsUCOSelected),
    ucoExamDate: school.UCOExamdate,
    isUIGKOSelected: Boolean(school.IsUIGKOSelected),
    uigkoExamDate: school.UIGKOExamdate,
    databaseDetails: {
      SchoolId: school.SchoolId,
      SchoolName: school.SchoolName,
      SchoolAddress: school.SchoolAddress,
      Place: school.Place,
      State: school.State,
      Pincode: school.Pincode,
    },
  };
}

async function getSchoolPasswordById(schoolId) {
  const normalizedId = String(schoolId || "").trim();
  const numericId = Number(normalizedId);
  if (!/^\d+$/.test(normalizedId) || !Number.isSafeInteger(numericId) || numericId <= 0) {
    const error = new Error("A valid School ID is required.");
    error.statusCode = 400;
    throw error;
  }

  const school = await SchoolRegistration.findByPk(numericId, {
    attributes: ["SchoolId", "Password"],
  });
  if (!school) return null;

  return {
    schoolId: school.SchoolId,
    password: school.Password || "",
  };
}

async function findSchoolByCredentials(registrationId) {
  const credential = String(registrationId || "").trim();
  const lookup = [{ REGNO: credential }];
  if (/^\d+$/.test(credential)) lookup.push({ SchoolId: Number(credential) });
  return SchoolRegistration.findOne({
    attributes: ["SchoolId", "REGNO", "Password"],
    where: { [Op.or]: lookup },
  });
}

async function changeSchoolPassword(schoolId, password) {
  await SchoolRegistration.update(
    { Password: String(password) },
    { where: { SchoolId: Number(schoolId) } }
  );
}

async function getSchoolDashboardProfile(schoolId) {
  const school = await SchoolRegistration.findByPk(Number(schoolId));
  if (!school) return null;

  const olympiads = [
    ["NSTSE", "IsNSTSEselected", "NSTSEExamdate", "NSTSETeachername", "NSTSETeachermobile", "NSTSETeachemail"],
    ["UIEO", "IsUIEOSelected", "UIEOExamdate", "UIEOTeachername", "UIEOTeacherMobile", "UIEOTeacherMail"],
    ["UIMO", "IsUIMOSelected", "UIMOExamdate", "UIMOTeachername", "UIMOTeacherMobile", "UIMOTeacherMail"],
    ["UCO", "IsUCOSelected", "UCOExamdate", "UCOTeacherName", "UCOTeacherMobile", "UCOTeacherMail"],
    ["UIGKO", "IsUIGKOSelected", "UIGKOExamdate", "UIGKOTeacherName", "UIGKOTeacherMobile", "UIGKOTeacherMail"],
  ].map(([code, selected, examDate, teacherName, teacherMobile, teacherEmail]) => ({
    code,
    selected: Boolean(school[selected]),
    examDate: school[examDate] || "",
    teacherName: school[teacherName] || "",
    teacherMobile: school[teacherMobile] || "",
    teacherEmail: school[teacherEmail] || "",
  }));

  return {
    schoolId: school.SchoolId,
    registrationId: school.REGNO || String(school.SchoolId),
    schoolName: school.SchoolName,
    principalName: school.Schoolprinciname,
    email: school.SchoolMail,
    phone: school.SchoolContact,
    schoolContact: school.SchoolContact,
    principalContact: school.PrinciContact,
    examMode: school.Exam_Mode,
    syllabus: school.Syllabus,
    city: school.Place,
    district: school.District,
    state: school.State,
    country: school.Country,
    pincode: school.Pincode,
    address: school.SchoolAddress,
    regionalCoordinator: school.Regionalconame,
    coordinator: school.Coor,
    updatedAt: school.Updated_Date,
    olympiads,
  };
}

async function getFullSchoolRegistrationById(schoolId) {
  const normalizedId = Number(schoolId);
  if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
    const error = new Error("A valid School ID is required.");
    error.statusCode = 400;
    throw error;
  }
  const rows = parseJsonArray(await runSql(`
    SET NOCOUNT ON;
    SELECT ${registeredSchoolAttributes.join(", ")}
    FROM dbo.Tbl_SchoolRegistrations
    WHERE SchoolId = ${normalizedId}
    FOR JSON PATH;
  `));
  return rows[0] ? toRegisteredSchool(rows[0]) : null;
}

async function updateSchoolRegistration(schoolId, payload = {}) {
  const normalizedId = Number(schoolId);
  if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
    const error = new Error("A valid School ID is required.");
    error.statusCode = 400;
    throw error;
  }
  const fields = [
    "SchoolName", "Schoolprinciname", "PrinciContact", "Exam_Mode", "SchoolMail",
    "SchoolContact", "Place", "District", "State", "Country", "Pincode", "SchoolAddress",
  ];
  const values = fields.map((field) => `${field} = ${sqlString(payload[field])}`).join(", ");
  const exists = await getFullSchoolRegistrationById(normalizedId);
  if (!exists) return null;
  await runSql(`UPDATE dbo.Tbl_SchoolRegistrations SET ${values}, Updated_Date = GETDATE() WHERE SchoolId = ${normalizedId};`);
  return getFullSchoolRegistrationById(normalizedId);
}

async function updateSchoolExamDetails(schoolId, examCode, payload = {}) {
  const normalizedId = Number(schoolId);
  const code = String(examCode || "").trim().toUpperCase();
  const columns = {
    NSTSE: ["NSTSEExamdate", "NSTSETeachername", "NSTSETeachermobile", "NSTSETeachemail"],
    UIEO: ["UIEOExamdate", "UIEOTeachername", "UIEOTeacherMobile", "UIEOTeacherMail"],
    UIMO: ["UIMOExamdate", "UIMOTeachername", "UIMOTeacherMobile", "UIMOTeacherMail"],
    UCO: ["UCOExamdate", "UCOTeacherName", "UCOTeacherMobile", "UCOTeacherMail"],
    UIGKO: ["UIGKOExamdate", "UIGKOTeacherName", "UIGKOTeacherMobile", "UIGKOTeacherMail"],
  }[code];
  if (!Number.isInteger(normalizedId) || normalizedId <= 0 || !columns) {
    const error = new Error("A valid school and exam code are required.");
    error.statusCode = 400;
    throw error;
  }
  if (!await getFullSchoolRegistrationById(normalizedId)) return null;
  const values = [payload.examDate, payload.teacherInCharge, payload.mobile, payload.email]
    .map((value, index) => `${columns[index]} = ${sqlString(value)}`).join(", ");
  await runSql(`UPDATE dbo.Tbl_SchoolRegistrations SET ${values}, Updated_Date = GETDATE() WHERE SchoolId = ${normalizedId};`);
  return { examCode: code, examName: code, examDate: payload.examDate || "", examMode: payload.examMode || "Offline", teacherInCharge: payload.teacherInCharge || "", mobile: payload.mobile || "", email: payload.email || "" };
}

const registeredSchoolAttributes = [
  "SchoolId", "SchoolName", "Place", "Schoolprinciname", "PrinciContact",
  "CASE WHEN NULLIF(LTRIM(RTRIM(Password)), '') IS NOT NULL THEN CAST(1 AS bit) ELSE CAST(0 AS bit) END AS hasPassword",
  "Exam_Mode", "IsNSTSEselected", "IsUIEOSelected", "IsUIMOSelected", "IsUCOSelected",
  "IsUIGKOSelected", "Updated_Date", "NSTSETeachername", "NSTSETeachermobile",
  "UIMOTeachername", "UIMOTeacherMobile", "UIEOTeachername", "UIEOTeacherMobile",
  "UCOTeacherName", "UCOTeacherMobile", "UIGKOTeacherName", "UIGKOTeacherMobile", "Country",
  "SchoolAddress", "SchoolMail", "SchoolContact", "District", "State", "Pincode", "REGNO", "Coor",
];

function normalizePositiveInteger(value, fallback, maximum = Number.MAX_SAFE_INTEGER) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, maximum) : fallback;
}

function parseJsonArray(output) {
  if (!output) return [];
  const text = String(output).replace(/^\uFEFF/, "").trim();
  const openIndex = text.indexOf("[");
  const closeIndex = text.lastIndexOf("]");
  if (openIndex === -1 || closeIndex <= openIndex) return [];
  try {
    return JSON.parse(text.slice(openIndex, closeIndex + 1).replace(/[\r\n]+/g, ""));
  } catch (_error) {
    return [];
  }
}

function dateRangeWhere(column, dateFrom, dateTo) {
  const from = /^\d{4}-\d{2}-\d{2}$/.test(String(dateFrom || "")) ? dateFrom : "";
  const to = /^\d{4}-\d{2}-\d{2}$/.test(String(dateTo || "")) ? dateTo : "";
  if (!from && !to) return null;

  const convertedColumn = `CASE WHEN ISDATE([${column}]) = 1 THEN CONVERT(datetime, [${column}]) END`;
  const clauses = [];
  if (from) clauses.push(`${convertedColumn} >= CONVERT(datetime, '${from.replace(/-/g, "")}')`);
  if (to) clauses.push(`${convertedColumn} < DATEADD(day, 1, CONVERT(datetime, '${to.replace(/-/g, "")}'))`);
  return sequelize.literal(clauses.join(" AND "));
}

function registeredSchoolsWhere(search, dateFrom, dateTo) {
  const term = String(search || "").trim();
  const where = {};
  const updatedDate = dateRangeWhere("Updated_Date", dateFrom, dateTo);
  if (updatedDate) {
    where[Op.and] = updatedDate;
  }
  if (!term) return where;

  const clauses = [
    { SchoolName: { [Op.like]: `%${term}%` } },
    { Place: { [Op.like]: `%${term}%` } },
    { Exam_Mode: { [Op.like]: `%${term}%` } },
  ];
  const examFields = {
    NSTSE: "IsNSTSEselected",
    UIEO: "IsUIEOSelected",
    UIMO: "IsUIMOSelected",
    UCO: "IsUCOSelected",
    UIGKO: "IsUIGKOSelected",
  };
  const normalizedTerm = term.toUpperCase();
  if (examFields[normalizedTerm]) clauses.push({ [examFields[normalizedTerm]]: true });
  if (/^\d+$/.test(term)) clauses.unshift({ SchoolId: Number(term) });
  where[Op.or] = clauses;
  return where;
}

function toRegisteredSchool(row) {
  const value = row.toJSON ? row.toJSON() : row;
  return {
    ...value,
    Exam_Mode: value.Exam_Mode || "---",
    Updated_Date: value.Updated_Date || null,
  };
}

async function getRegisteredSchools({ page = 1, pageSize = 10, search = "", dateFrom = "", dateTo = "", exportAll = false } = {}) {
  const normalizedPage = normalizePositiveInteger(page, 1);
  const normalizedPageSize = normalizePositiveInteger(pageSize, 10, 100);
  const offset = (normalizedPage - 1) * normalizedPageSize;

  const searchTerm = String(search || "").trim();
  const safeSearch = searchTerm.replace(/'/g, "''");
  const normalizeDate = (value) => {
    const normalized = String(value || "");
    if (!normalized) return "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
      throw new Error("Date filters must use valid YYYY-MM-DD values.");
    }
    const parsedDate = new Date(`${normalized}T00:00:00.000Z`);
    if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== normalized) {
      throw new Error("Date filters must use valid YYYY-MM-DD values.");
    }
    return normalized;
  };
  const validDateFrom = normalizeDate(dateFrom);
  const validDateTo = normalizeDate(dateTo);
  if (validDateFrom && validDateTo && validDateFrom > validDateTo) {
    throw new Error("The start date cannot be later than the end date.");
  }

  let whereClauses = [];
  if (validDateFrom) whereClauses.push(`Updated_Date >= CONVERT(date, '${validDateFrom}', 23)`);
  if (validDateTo) whereClauses.push(`Updated_Date < DATEADD(day, 1, CONVERT(date, '${validDateTo}', 23))`);
  if (safeSearch) {
    const escaped = safeSearch.replace(/%/g, "[%]");
    whereClauses.push(`(
      SchoolName LIKE '%${escaped}%'
      OR Place LIKE '%${escaped}%'
      OR District LIKE '%${escaped}%'
      OR State LIKE '%${escaped}%'
      OR Country LIKE '%${escaped}%'
      OR Pincode LIKE '%${escaped}%'
      OR SchoolContact LIKE '%${escaped}%'
      OR SchoolMail LIKE '%${escaped}%'
      OR Schoolprinciname LIKE '%${escaped}%'
      OR PrinciContact LIKE '%${escaped}%'
      OR REGNO LIKE '%${escaped}%'
      OR Exam_Mode LIKE '%${escaped}%'
      OR CAST(SchoolId AS NVARCHAR) = '${safeSearch}'
    )`);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const countQuery = `
    SET NOCOUNT ON;
    SELECT COUNT(*) AS total
    FROM dbo.Tbl_SchoolRegistrations
    ${whereSql};
  `;
  const countMatch = String(await runSql(countQuery)).match(/\d+/);
  const total = Number(countMatch ? countMatch[0] : 0);

  const rowsQuery = `
    SET NOCOUNT ON;
    SELECT ${registeredSchoolAttributes.join(", ")}
    FROM dbo.Tbl_SchoolRegistrations
    ${whereSql}
    ORDER BY Updated_Date DESC, SchoolId DESC
    ${exportAll ? "" : `OFFSET ${offset} ROWS FETCH NEXT ${normalizedPageSize} ROWS ONLY`}
    FOR JSON PATH;
  `;

  const rowsJson = parseJsonArray(await runSql(rowsQuery));

  return {
    rows: rowsJson.map(toRegisteredSchool),
    pagination: {
      page: normalizedPage,
      pageSize: normalizedPageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / normalizedPageSize)),
    },
  };
}

module.exports = {
  SchoolRegistration,
  createSchoolRegistration,
  findSchoolByCredentials,
  changeSchoolPassword,
  getSchoolPasswordById,
  getSchoolRegistrationById,
  getSchoolDashboardProfile,
  getFullSchoolRegistrationById,
  getRegisteredSchools,
  updateSchoolExamDetails,
  updateSchoolRegistration,
  normalizePayload,
};
