const { DataTypes, Op } = require("sequelize");
const { runSql } = require("../../config/db");
const sequelize = require("../../config/dbConfig");
const { calculateSchoolRegistrationPricing } = require("../pricingModal");

const StudentRegistration = sequelize.define(
  "StudentRegistration",
  {
    StudentId: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    SchoolId: { type: DataTypes.BIGINT, allowNull: false },
    SNAME: DataTypes.STRING(200),
    Class: DataTypes.INTEGER,
    Section: DataTypes.STRING(50),
    FNAME: DataTypes.STRING(200),
    MOBILE: DataTypes.STRING(20),
    EMAIL: DataTypes.STRING(200),
    AMOUNT: DataTypes.DECIMAL(18, 2),
    STATUS: DataTypes.STRING(50),
    transid: DataTypes.STRING(100),
    transdate: DataTypes.DATE,
    Message: DataTypes.STRING(100),
    Packagesbought: DataTypes.STRING(500),
    Separatepackages: DataTypes.STRING(500),
    ExamCode: DataTypes.STRING(20),
    OptionId: DataTypes.INTEGER,
    STUDADD1: DataTypes.STRING(500),
    STUDADD2: DataTypes.STRING(500),
    STUDCITY: DataTypes.STRING(200),
    STUDPINCODE: DataTypes.STRING(20),
    STUDSTATE: DataTypes.STRING(100),
    SGST: DataTypes.DECIMAL(18, 2),
    CGST: DataTypes.DECIMAL(18, 2),
    IGST: DataTypes.DECIMAL(18, 2),
    EXAMFEE: DataTypes.DECIMAL(18, 2),
    EBOOK: DataTypes.DECIMAL(18, 2),
    CGSTEB: DataTypes.DECIMAL(18, 2),
    SGSTEB: DataTypes.DECIMAL(18, 2),
    IGSTEB: DataTypes.DECIMAL(18, 2),
    BMALSOP: DataTypes.DECIMAL(18, 2),
    CGSTOP: DataTypes.DECIMAL(18, 2),
    SGSTOP: DataTypes.DECIMAL(18, 2),
    IGSTOP: DataTypes.DECIMAL(18, 2),
  },
  {
    tableName: "Tbl_Studentregistration",
    schema: "dbo",
    timestamps: false,
  }
);

function roundCurrency(value) {
  return Number(Number(value || 0).toFixed(2));
}

let pricingColumnsPromise;

async function ensureStudentRegistrationPricingColumns() {
  if (!pricingColumnsPromise) {
    pricingColumnsPromise = runSql(`
      IF OBJECT_ID(N'dbo.Tbl_Studentregistration', N'U') IS NOT NULL
      BEGIN
        IF COL_LENGTH(N'dbo.Tbl_Studentregistration', N'ExamCode') IS NULL
          ALTER TABLE dbo.Tbl_Studentregistration ADD ExamCode NVARCHAR(20) NULL;
        IF COL_LENGTH(N'dbo.Tbl_Studentregistration', N'OptionId') IS NULL
          ALTER TABLE dbo.Tbl_Studentregistration ADD OptionId INT NULL;
      END;
    `).catch((error) => {
      pricingColumnsPromise = null;
      throw error;
    });
  }
  await pricingColumnsPromise;
}

function createReferencePrefix() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 4 }, () => characters[Math.floor(Math.random() * characters.length)]).join("");
}

async function createStudentRegistration(payload) {
  await ensureStudentRegistrationPricingColumns();
  const selections = Array.isArray(payload.selections) ? payload.selections : [];
  const totalAmount = roundCurrency(selections.reduce((sum, item) => sum + Number(item.amount || 0), 0));
  const packageLabels = selections.map((item) => `${item.examCode}-${roundCurrency(item.price)}`);
  const packagesBought = packageLabels.join(",");

  return sequelize.transaction(async (transaction) => {
    const savedRows = [];

    for (let index = 0; index < selections.length; index += 1) {
      const selection = selections[index];
      const isTelangana = String(payload.state || "").trim().toLowerCase() === "telangana";
      const halfGst = roundCurrency(Number(selection.gst || 0) / 2);
      const tax = {
        EXAMFEE: roundCurrency(selection.taxablePrice),
        EBOOK: 0,
        SGST: isTelangana ? halfGst : 0,
        CGST: isTelangana ? roundCurrency(Number(selection.gst || 0) - halfGst) : 0,
        IGST: isTelangana ? 0 : roundCurrency(selection.gst),
        SGSTEB: 0,
        CGSTEB: 0,
        IGSTEB: 0,
      };
      const row = await StudentRegistration.create(
        {
          SchoolId: Number(payload.schoolId),
          SNAME: String(payload.studentName || "").trim().toUpperCase(),
          Class: String(payload.className || "").trim(),
          Section: String(payload.section || "").trim().toUpperCase(),
          FNAME: String(payload.parentName || "").trim().toUpperCase(),
          MOBILE: String(payload.mobile || "").trim(),
          EMAIL: String(payload.email || "").trim(),
          AMOUNT: totalAmount,
          STATUS: "Pending",
          transid: "",
          transdate: sequelize.literal("GETDATE()"),
          Message: "Pending",
          Packagesbought: packagesBought,
          Separatepackages: packageLabels[index],
          ExamCode: selection.examCode,
          OptionId: selection.optionId,
          STUDADD1: String(payload.addressLine1 || "").replace(/#/g, "").trim(),
          STUDADD2: String(payload.addressLine2 || "").replace(/#/g, "").trim(),
          STUDCITY: String(payload.city || "").trim(),
          STUDPINCODE: String(payload.pincode || "").trim(),
          STUDSTATE: String(payload.state || "").trim(),
          ...tax,
          BMALSOP: 0,
          CGSTOP: 0,
          SGSTOP: 0,
          IGSTOP: 0,
        },
        { transaction }
      );
      savedRows.push(row);
    }

    const firstStudentId = savedRows[0].StudentId;
    const registrationCode = `${createReferencePrefix()}-${firstStudentId}`;
    await StudentRegistration.update(
      { transid: registrationCode },
      { where: { StudentId: savedRows.map((row) => row.StudentId) }, transaction }
    );

    return {
      registrationId: firstStudentId,
      studentIds: savedRows.map((row) => row.StudentId),
      schoolId: Number(payload.schoolId),
      registrationCode,
      amount: totalAmount,
      packagesBought,
    };
  });
}

async function repriceSchoolEnrollment(registrationCode, prices) {
  await ensureStudentRegistrationPricingColumns();
  const code = String(registrationCode || "").trim();
  const rows = await StudentRegistration.findAll({
    where: { transid: code },
    attributes: ["StudentId", "STATUS", "STUDSTATE", "ExamCode", "OptionId"],
    order: [["StudentId", "ASC"]],
    raw: true,
  });
  if (!rows.length) {
    const error = new Error("Student registration was not found.");
    error.statusCode = 404;
    throw error;
  }

  const selections = rows.map((row) => {
    const examCode = String(row.ExamCode || "").trim().toUpperCase();
    const optionId = row.OptionId == null ? null : Number(row.OptionId);
    if (examCode && optionId == null) {
      const error = new Error("This registration is waiting for school pricing confirmation.");
      error.statusCode = 409;
      throw error;
    }
    if (!examCode) {
      const error = new Error("This registration needs updated exam-price details. Please register again to continue with the current prices.");
      error.statusCode = 409;
      throw error;
    }
    return { examCode, optionId };
  });
  const pricing = calculateSchoolRegistrationPricing(selections, prices);

  await sequelize.transaction(async (transaction) => {
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const pricedRow = pricing.rows[index];
      const isTelangana = String(row.STUDSTATE || "").trim().toLowerCase() === "telangana";
      const halfGst = roundCurrency(pricedRow.gst / 2);
      const [updatedCount] = await StudentRegistration.update(
        {
          ExamCode: pricedRow.examCode,
          OptionId: pricedRow.optionId,
          AMOUNT: pricing.amount,
          EXAMFEE: pricedRow.taxablePrice,
          EBOOK: 0,
          SGST: isTelangana ? halfGst : 0,
          CGST: isTelangana ? roundCurrency(pricedRow.gst - halfGst) : 0,
          IGST: isTelangana ? 0 : pricedRow.gst,
          SGSTEB: 0,
          CGSTEB: 0,
          IGSTEB: 0,
        },
        {
          where: { StudentId: row.StudentId, transid: code, STATUS: row.STATUS },
          transaction,
        }
      );
      if (updatedCount !== 1) {
        const error = new Error("The registration changed while its payment total was being verified. Please try again.");
        error.statusCode = 409;
        throw error;
      }
    }
  });

  return { amount: pricing.amount, rows: pricing.rows };
}

async function getRegisteredStudentsBySchool(schoolId, {
  page = 1,
  pageSize = 10,
  search = "",
  className = "",
  exam = "",
  status = "",
  dateFrom = "",
  dateTo = "",
} = {}) {
  const normalizedPage = Math.max(1, Number.parseInt(page, 10) || 1);
  const normalizedPageSize = Math.min(100, Math.max(1, Number.parseInt(pageSize, 10) || 10));
  const term = String(search || "").trim();
  const selectedClass = String(className || "").trim();
  const selectedExam = String(exam || "").trim();
  const selectedStatus = String(status || "").trim();
  const where = { SchoolId: Number(schoolId) };
  const conditions = [];
  const from = /^\d{4}-\d{2}-\d{2}$/.test(String(dateFrom || "")) ? dateFrom : "";
  const to = /^\d{4}-\d{2}-\d{2}$/.test(String(dateTo || "")) ? dateTo : "";
  if (from || to) {
    const convertedColumn = "CASE WHEN ISDATE([transdate]) = 1 THEN CONVERT(datetime, [transdate]) END";
    const clauses = [];
    if (from) clauses.push(`${convertedColumn} >= CONVERT(datetime, '${from.replace(/-/g, "")}')`);
    if (to) clauses.push(`${convertedColumn} < DATEADD(day, 1, CONVERT(datetime, '${to.replace(/-/g, "")}'))`);
    conditions.push(sequelize.literal(clauses.join(" AND ")));
  }
  if (term) {
    conditions.push({ [Op.or]: [
      { SNAME: { [Op.like]: `%${term}%` } }, { FNAME: { [Op.like]: `%${term}%` } },
      { MOBILE: { [Op.like]: `%${term}%` } },
      sequelize.where(sequelize.cast(sequelize.col("Class"), "NVARCHAR(20)"), {
        [Op.like]: `%${term}%`,
      }),
      { Separatepackages: { [Op.like]: `%${term}%` } }, { transid: { [Op.like]: `%${term}%` } },
    ] });
  }
  if (selectedClass) {
    conditions.push({ Class: /^\d+$/.test(selectedClass) ? Number(selectedClass) : -1 });
  }
  if (selectedExam) conditions.push({ Separatepackages: { [Op.like]: `%${selectedExam}%` } });
  if (selectedStatus === "Completed") {
    conditions.push({ STATUS: { [Op.in]: ["Completed", "Success"] } });
  } else if (selectedStatus) {
    conditions.push({ STATUS: selectedStatus });
  }
  if (conditions.length) where[Op.and] = conditions;
  const { count, rows } = await StudentRegistration.findAndCountAll({
    attributes: [
      "StudentId", "SchoolId", "SNAME", "Class", "Section", "FNAME", "MOBILE", "EMAIL",
      "AMOUNT", "STATUS", "transid", "transdate", "Message", "Packagesbought", "Separatepackages",
      "STUDADD1", "STUDADD2", "STUDCITY", "STUDPINCODE", "STUDSTATE", "SGST", "CGST", "IGST",
      "EXAMFEE", "EBOOK", "CGSTEB", "SGSTEB", "IGSTEB", "BMALSOP", "CGSTOP", "SGSTOP", "IGSTOP",
    ],
    where,
    order: [["transdate", "DESC"], ["StudentId", "DESC"]],
    limit: normalizedPageSize,
    offset: (normalizedPage - 1) * normalizedPageSize,
  });
  return {
    rows,
    pagination: { page: normalizedPage, pageSize: normalizedPageSize, total: count, totalPages: Math.max(1, Math.ceil(count / normalizedPageSize)) },
  };
}

async function listAdminSchoolStudentRegistrations({
  page = 1,
  pageSize = 10,
  search = "",
  status = "",
  dateFrom = "",
  dateTo = "",
  packageName = "",
} = {}) {
  const normalizedPage = Math.max(1, Number.parseInt(page, 10) || 1);
  const normalizedPageSize = Math.min(100, Math.max(1, Number.parseInt(pageSize, 10) || 10));
  const term = String(search || "").trim().slice(0, 200);
  const selectedStatus = String(status || "").trim();
  const selectedPackage = String(packageName || "").trim();
  const where = {};
  const conditions = [];
  const isValidDate = (value) => {
    const normalized = String(value || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return "";
    const date = new Date(`${normalized}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === normalized ? normalized : "";
  };
  const from = isValidDate(dateFrom);
  const to = isValidDate(dateTo);

  if (from || to) {
    const clauses = [];
    if (from) clauses.push(`[transdate] >= CONVERT(datetime, '${from.replace(/-/g, "")}')`);
    if (to) clauses.push(`[transdate] < DATEADD(day, 1, CONVERT(datetime, '${to.replace(/-/g, "")}'))`);
    conditions.push(sequelize.literal(clauses.join(" AND ")));
  }
  if (term) {
    const numericSearch = /^\d+$/.test(term) ? Number(term) : null;
    conditions.push({
      [Op.or]: [
        ...(numericSearch !== null && Number.isSafeInteger(numericSearch)
          ? [
              { StudentId: numericSearch },
              { SchoolId: numericSearch },
            ]
          : []),
        { SNAME: { [Op.like]: `%${term}%` } },
        { FNAME: { [Op.like]: `%${term}%` } },
        { MOBILE: { [Op.like]: `%${term}%` } },
        { EMAIL: { [Op.like]: `%${term}%` } },
        { transid: { [Op.like]: `%${term}%` } },
        { Separatepackages: { [Op.like]: `%${term}%` } },
        { Packagesbought: { [Op.like]: `%${term}%` } },
        sequelize.where(sequelize.cast(sequelize.col("Class"), "NVARCHAR(20)"), {
          [Op.like]: `%${term}%`,
        }),
        { STATUS: { [Op.like]: `%${term}%` } },
      ],
    });
  }
  if (selectedStatus) conditions.push({ STATUS: selectedStatus });
  if (selectedPackage) {
    conditions.push({
      [Op.or]: [
        { Separatepackages: { [Op.like]: `%${selectedPackage}%` } },
        { Packagesbought: { [Op.like]: `%${selectedPackage}%` } },
      ],
    });
  }
  if (conditions.length) where[Op.and] = conditions;

  const { count, rows } = await StudentRegistration.findAndCountAll({
    attributes: [
      ["StudentId", "Id"],
      "SchoolId",
      ["SNAME", "StudentName"],
      "Class",
      ["STATUS", "Status"],
      ["Separatepackages", "Packages"],
      "Packagesbought",
      ["MOBILE", "Phone"],
      ["transid", "TransactionId"],
      ["transdate", "TransDate"],
      ["FNAME", "FathersName"],
      ["STUDSTATE", "State"],
      ["AMOUNT", "Amount"],
      ["EXAMFEE", "Examfee"],
      "SGST",
      "CGST",
      "IGST",
      "BMALSOP",
      "CGSTOP",
      "SGSTOP",
      "IGSTOP",
    ],
    where,
    order: [["transdate", "DESC"], ["StudentId", "DESC"]],
    limit: normalizedPageSize,
    offset: (normalizedPage - 1) * normalizedPageSize,
  });

  return {
    rows,
    pagination: {
      page: normalizedPage,
      pageSize: normalizedPageSize,
      total: count,
      totalPages: Math.max(1, Math.ceil(count / normalizedPageSize)),
    },
  };
}

async function getSchoolStudentById(schoolId, studentId) {
  const normalizedStudentId = Number(studentId);
  if (!Number.isInteger(normalizedStudentId) || normalizedStudentId <= 0) return null;
  const student = await StudentRegistration.findOne({
    where: { SchoolId: Number(schoolId), StudentId: normalizedStudentId },
  });
  return student;
}

async function getSchoolEnrollmentByCode(registrationCode) {
  const code = String(registrationCode || "").trim();
  if (!code) return null;

  const student = await StudentRegistration.findOne({
    where: { transid: code },
    order: [["StudentId", "ASC"]],
  });
  if (!student) return null;

  return {
    registrationId: student.StudentId,
    registrationCode: student.transid,
    schoolId: student.SchoolId,
    amount: Number(student.AMOUNT || 0),
    status: String(student.STATUS || "Pending"),
    studentName: student.SNAME || "",
    parentName: student.FNAME || "",
    mobile: student.MOBILE || "",
    email: student.EMAIL || "",
    className: student.Class || "",
    address1: student.STUDADD1 || "",
    address2: student.STUDADD2 || "",
    city: student.STUDCITY || "",
    state: student.STUDSTATE || "",
    pincode: student.STUDPINCODE || "",
    packagesBought: student.Packagesbought || "",
  };
}

async function updateSchoolEnrollmentPayment(registrationCode, status, message) {
  const [updatedCount] = await StudentRegistration.update(
    {
      STATUS: String(status),
      Message: String(message || status).slice(0, 100),
    },
    { where: { transid: String(registrationCode || "").trim() } }
  );
  return updatedCount > 0;
}

async function markSchoolEnrollmentSuccess(registrationCode) {
  const normalizedRegistrationCode = String(registrationCode || "").trim();
  if (!normalizedRegistrationCode) return false;

  const [updatedCount] = await StudentRegistration.update(
    { STATUS: "Success", Message: "Successful" },
    { where: { transid: normalizedRegistrationCode, STATUS: "Pending" } }
  );
  return updatedCount > 0;
}

async function markSchoolStudentRowSuccess({ studentId, registrationCode }) {
  const normalizedStudentId = Number(studentId);
  const normalizedRegistrationCode = String(registrationCode || "").trim();
  if (!Number.isSafeInteger(normalizedStudentId) || normalizedStudentId <= 0 || !normalizedRegistrationCode) {
    throw new Error("A valid studentId and registrationCode are required.");
  }

  const [updatedCount] = await StudentRegistration.update(
    { STATUS: "Success", Message: "Successful" },
    {
      where: {
        StudentId: normalizedStudentId,
        transid: normalizedRegistrationCode,
        STATUS: "Pending",
      },
    },
  );
  return updatedCount > 0;
}

async function getStudentRegistrationSummary(schoolId, year = new Date().getFullYear()) {
  const schoolWhere = { SchoolId: Number(schoolId) };
  const where = {
    ...schoolWhere,
    [Op.and]: [sequelize.where(sequelize.fn("YEAR", sequelize.col("transdate")), year)],
  };
  const [totalStudents, groupedStatuses, yearRows] = await Promise.all([
    StudentRegistration.count({ where }),
    StudentRegistration.findAll({
      attributes: ["STATUS", [sequelize.fn("COUNT", sequelize.col("StudentId")), "count"]],
      where,
      group: ["STATUS"],
      raw: true,
    }),
    StudentRegistration.findAll({
      attributes: [[sequelize.fn("YEAR", sequelize.col("transdate")), "year"]],
      where: schoolWhere,
      group: [sequelize.fn("YEAR", sequelize.col("transdate"))],
      order: [[sequelize.fn("YEAR", sequelize.col("transdate")), "DESC"]],
      raw: true,
    }),
  ]);
  const availableYears = yearRows
    .map((row) => Number(row.year))
    .filter((availableYear) => Number.isInteger(availableYear) && availableYear >= 2000);
  let pendingRegistrations = 0;
  let activeRegistrations = 0;
  let completedRegistrations = 0;
  for (const row of groupedStatuses) {
    const status = String(row.STATUS || "").trim().toLowerCase();
    const count = Number(row.count || 0);
    if (status === "pending") pendingRegistrations += count;
    if (status === "registered") activeRegistrations += count;
    if (status === "success" || status === "completed") completedRegistrations += count;
  }
  return {
    year,
    availableYears,
    totalStudents,
    activeRegistrations,
    completedRegistrations,
    pendingRegistrations,
  };
}

async function getStudentCountsBySchoolIds(schoolIds) {
  const normalizedIds = [...new Set(
    (Array.isArray(schoolIds) ? schoolIds : [])
      .map(Number)
      .filter((schoolId) => Number.isInteger(schoolId) && schoolId > 0)
  )];
  if (!normalizedIds.length) return {};

  const counts = {};
  const batchSize = 500;

  for (let offset = 0; offset < normalizedIds.length; offset += batchSize) {
    const idBatch = normalizedIds.slice(offset, offset + batchSize);
    const rows = String(await runSql(`
      SET NOCOUNT ON;
      SELECT SchoolId, COUNT(*) AS studentCount
      FROM dbo.Tbl_Studentregistration
      WHERE SchoolId IN (${idBatch.join(",")})
      GROUP BY SchoolId
      FOR JSON PATH;
    `)).trim();
    const start = rows.indexOf("[");
    const end = rows.lastIndexOf("]");
    if (start === -1 || end <= start) continue;

    const parsed = JSON.parse(rows.slice(start, end + 1).replace(/[\r\n]+/g, ""));
    parsed.forEach((row) => {
      counts[Number(row.SchoolId)] = Number(row.studentCount);
    });
  }

  return counts;
}

module.exports = {
  StudentRegistration,
  createStudentRegistration,
  ensureStudentRegistrationPricingColumns,
  getRegisteredStudentsBySchool,
  repriceSchoolEnrollment,
  listAdminSchoolStudentRegistrations,
  getSchoolStudentById,
  getSchoolEnrollmentByCode,
  markSchoolEnrollmentSuccess,
  updateSchoolEnrollmentPayment,
  markSchoolStudentRowSuccess,
  getStudentRegistrationSummary,
  getStudentCountsBySchoolIds,
};
