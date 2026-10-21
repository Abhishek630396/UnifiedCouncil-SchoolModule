const { DataTypes } = require("sequelize");
const { runSql, sqlString } = require("../../config/db");
const sequelize = require("../../config/dbConfig");

const EXAM_CODES = ["NSTSE", "UIEO", "UIMO", "UCO", "UIGKO"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SchoolExamDate = sequelize.define(
  "SchoolExamDate",
  {
    Id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ExamCode: { type: DataTypes.STRING(20), allowNull: false },
    ExamDate: { type: DataTypes.DATEONLY, allowNull: false },
    ExamDay: { type: DataTypes.STRING(20), allowNull: false },
    ExamMode: { type: DataTypes.STRING(20), allowNull: false },
    SortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    IsActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    Updated_Date: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal("GETDATE()") },
  },
  {
    tableName: "Tbl_SchoolExamDates",
    schema: "dbo",
    timestamps: false,
  }
);

function getDayName(dateValue) {
  if (!dateValue) return "";
  const [year, month, day] = String(dateValue).slice(0, 10).split("-").map(Number);
  return DAYS[new Date(year, month - 1, day).getDay()] || "";
}

function normalizeMode(mode) {
  return String(mode || "Offline").trim().toLowerCase() === "online" ? "Online" : "Offline";
}

function formatLabel(dateValue, day, mode) {
  if (!dateValue) return "";
  const [year, month, date] = String(dateValue).slice(0, 10).split("-");
  return `${date}-${month}-${year} (${day || getDayName(dateValue)})-${mode || "Offline"}`;
}

function parseExamDateLabel(value) {
  const match = String(value || "").trim().match(/^(\d{2})-(\d{2})-(\d{4})(?:\s+\(([^)]+)\))?-(Online|Offline)$/i);
  if (!match) return null;
  const date = `${match[3]}-${match[2]}-${match[1]}`;
  const day = match[4] || getDayName(date);
  const mode = normalizeMode(match[5]);
  return { date, day, mode, label: formatLabel(date, day, mode) };
}

function normalizeExamDateRow(row) {
  if (typeof row === "string") {
    return parseExamDateLabel(row) || { date: "", day: "", mode: "Offline", label: "" };
  }

  const rawDate = String(row?.date || row?.examDate || row?.ExamDate || row?.value || "").trim();
  const parsed = parseExamDateLabel(rawDate);
  if (parsed) return parsed;
  const date = rawDate.slice(0, 10);
  const day = String(row?.day || row?.examDay || row?.ExamDay || "").trim() || getDayName(date);
  const mode = normalizeMode(row?.mode || row?.examMode || row?.ExamMode);
  return { date, day, mode, label: row?.label || formatLabel(date, day, mode) };
}

function normalizeExamDates(rows = []) {
  return EXAM_CODES.map((examCode) => ({
    examCode,
    dates: rows
      .filter((row) => (row.ExamCode || row.examCode) === examCode)
      .map(normalizeExamDateRow)
      .filter((row) => row.date),
  }));
}

async function ensureExamDatesTable() {
  await SchoolExamDate.sync();
}

function toResponse(row) {
  const value = row.toJSON ? row.toJSON() : row;
  return {
    id: value.Id,
    examCode: value.ExamCode,
    ...normalizeExamDateRow(value),
    isActive: Boolean(value.IsActive),
    updatedDate: value.Updated_Date || "",
  };
}

async function getSchoolExamDates() {
  const result = await runSql(`
    SET NOCOUNT ON;
    SELECT Id, ExamCode, ExamDate, ExamDay, ExamMode, SortOrder, IsActive, Updated_Date
    FROM dbo.Tbl_SchoolExamDates
    WHERE IsActive = 1
    ORDER BY ExamCode ASC, SortOrder ASC, Id ASC
    FOR JSON PATH;
  `);

  const rows = parseJsonArray(result);
  return normalizeExamDates(rows);
}

function normalizePage(value, fallback) {
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric > 0 ? numeric : fallback;
}

function parseJsonArray(output) {
  if (!output) return [];
  const text = String(output).replace(/^\uFEFF/, "").trim();
  const openIndex = text.indexOf("[");
  const closeIndex = text.lastIndexOf("]");
  if (openIndex === -1 || closeIndex <= openIndex) return [];

  try {
    return JSON.parse(text.slice(openIndex, closeIndex + 1));
  } catch (_error) {
    return [];
  }
}

async function getAdminSchoolExamDates({ page = 1, pageSize = 5 } = {}) {
  const normalizedPage = normalizePage(page, 1);
  const normalizedPageSize = Math.min(normalizePage(pageSize, 5), 25);
  const offset = (normalizedPage - 1) * normalizedPageSize;

  const results = await Promise.all(EXAM_CODES.map(async (examCode) => {
    const safeExamCode = String(examCode || "").replace(/'/g, "''");
    const countSql = `
      SET NOCOUNT ON;
      SELECT COUNT(*) AS total
      FROM dbo.Tbl_SchoolExamDates
      WHERE ExamCode = '${safeExamCode}';
    `;
    const countOutput = await runSql(countSql);
    const countValue = Number(String(countOutput).match(/\d+/)?.[0] || 0);

    const rowsSql = `
      SET NOCOUNT ON;
      SELECT Id, ExamCode, ExamDate, ExamDay, ExamMode, SortOrder, IsActive, Updated_Date
      FROM dbo.Tbl_SchoolExamDates
      WHERE ExamCode = '${safeExamCode}'
      ORDER BY SortOrder ASC, Id ASC
      OFFSET ${offset} ROWS FETCH NEXT ${normalizedPageSize} ROWS ONLY
      FOR JSON PATH;
    `;
    const rowsOutput = await runSql(rowsSql);
    const rows = parseJsonArray(rowsOutput).map((row) => toResponse({ toJSON: () => row }));

    return {
      examCode,
      page: normalizedPage,
      pageSize: normalizedPageSize,
      total: countValue,
      totalPages: Math.max(1, Math.ceil(countValue / normalizedPageSize)),
      dates: rows,
    };
  }));

  return results;
}

function validateExamCode(examCode) {
  const normalized = String(examCode || "").trim().toUpperCase();
  if (!EXAM_CODES.includes(normalized)) {
    const error = new Error("A valid exam code is required.");
    error.statusCode = 400;
    throw error;
  }
  return normalized;
}

async function addSchoolExamDate({ examCode, date, day, mode, isActive = true }) {
  await ensureExamDatesTable();
  const normalizedExamCode = validateExamCode(examCode);
  const examDate = normalizeExamDateRow({ date, day, mode });
  if (!examDate.date) {
    const error = new Error("Exam date is required.");
    error.statusCode = 400;
    throw error;
  }

  const duplicate = await SchoolExamDate.findOne({ where: { ExamCode: normalizedExamCode, ExamDate: examDate.date } });
  if (duplicate) {
    const error = new Error("Duplicate exam date: this exam already has an entry on the selected date.");
    error.statusCode = 409;
    throw error;
  }

  const maxSortOrder = Number(await SchoolExamDate.max("SortOrder", { where: { ExamCode: normalizedExamCode } })) || 0;
  const saved = await SchoolExamDate.create({
    ExamCode: normalizedExamCode,
    ExamDate: examDate.date,
    ExamDay: examDate.day,
    ExamMode: examDate.mode,
    SortOrder: maxSortOrder + 1,
    IsActive: Boolean(isActive),
    Updated_Date: sequelize.literal("GETDATE()"),
  });
  return toResponse(saved);
}

async function toggleSchoolExamDateStatus(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    const error = new Error("A valid exam date id is required.");
    error.statusCode = 400;
    throw error;
  }

  const existing = parseJsonArray(await runSql(`
    SET NOCOUNT ON;
    SELECT Id, ExamCode, ExamDate, ExamDay, ExamMode, SortOrder, IsActive, Updated_Date
    FROM dbo.Tbl_SchoolExamDates WHERE Id = ${numericId} FOR JSON PATH;
  `))[0];
  if (!existing) {
    const error = new Error("Exam date was not found.");
    error.statusCode = 404;
    throw error;
  }
  await runSql(`
    UPDATE dbo.Tbl_SchoolExamDates
    SET IsActive = CASE WHEN IsActive = 1 THEN 0 ELSE 1 END, Updated_Date = GETDATE()
    WHERE Id = ${numericId};
  `);
  return toResponse({ ...existing, IsActive: !Boolean(existing.IsActive) });
}

async function updateSchoolExamDate(id, { examCode, date, day, mode, isActive = true } = {}) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    const error = new Error("A valid exam date id is required.");
    error.statusCode = 400;
    throw error;
  }

  const normalizedExamCode = validateExamCode(examCode);
  const examDate = normalizeExamDateRow({ date, day, mode });
  if (!examDate.date) {
    const error = new Error("Exam date is required.");
    error.statusCode = 400;
    throw error;
  }

  const existing = parseJsonArray(await runSql(`
    SET NOCOUNT ON;
    SELECT Id, ExamCode, ExamDate, ExamDay, ExamMode, SortOrder, IsActive, Updated_Date
    FROM dbo.Tbl_SchoolExamDates WHERE Id = ${numericId} FOR JSON PATH;
  `))[0];
  if (!existing) {
    const error = new Error("Exam date was not found.");
    error.statusCode = 404;
    throw error;
  }

  await runSql(`
    UPDATE dbo.Tbl_SchoolExamDates
    SET ExamCode = ${sqlString(normalizedExamCode)},
      ExamDate = '${examDate.date}', ExamDay = ${sqlString(examDate.day)},
      ExamMode = ${sqlString(examDate.mode)},
      IsActive = ${isActive ? 1 : 0}, Updated_Date = GETDATE()
    WHERE Id = ${numericId};
  `);
  return toResponse({ ...existing, ExamCode: normalizedExamCode, ExamDate: examDate.date, ExamDay: examDate.day, ExamMode: examDate.mode, IsActive: Boolean(isActive) });
}

async function replaceSchoolExamDates(exams = []) {
  await ensureExamDatesTable();
  const rows = [];
  exams.forEach((exam) => {
    const examCode = String(exam.examCode || exam.id || "").trim().toUpperCase();
    if (!EXAM_CODES.includes(examCode)) return;
    (Array.isArray(exam.dates) ? exam.dates : []).forEach((dateRow, index) => {
      const value = normalizeExamDateRow(dateRow);
      if (value.date) rows.push({ ExamCode: examCode, ExamDate: value.date, ExamDay: value.day, ExamMode: value.mode, SortOrder: index + 1, IsActive: true, Updated_Date: sequelize.literal("GETDATE()") });
    });
  });
  if (!rows.length) {
    const error = new Error("At least one exam date is required.");
    error.statusCode = 400;
    throw error;
  }

  await sequelize.transaction(async (transaction) => {
    await SchoolExamDate.destroy({ where: {}, transaction });
    await SchoolExamDate.bulkCreate(rows, { transaction });
  });
  return getSchoolExamDates();
}

module.exports = {
  SchoolExamDate,
  EXAM_CODES,
  addSchoolExamDate,
  getAdminSchoolExamDates,
  getSchoolExamDates,
  replaceSchoolExamDates,
  updateSchoolExamDate,
  toggleSchoolExamDateStatus,
};
