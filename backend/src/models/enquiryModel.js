const { runSql, sqlString } = require("../config/db");

function parseJsonArray(output) {
  const text = String(output || "").replace(/^\uFEFF/, "").trim();
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end <= start) return [];
  return JSON.parse(text.slice(start, end + 1).replace(/[\r\n]+/g, ""));
}

function normalizePage(value, fallback) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

function safeText(value, maxLength = 1000) {
  return String(value ?? "").trim().slice(0, maxLength);
}

async function ensureEnquiriesTable() {
  await runSql(`
    IF OBJECT_ID('dbo.Tbl_SchoolEnquiries', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.Tbl_SchoolEnquiries (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        SchoolName NVARCHAR(300) NOT NULL,
        PrincipalName NVARCHAR(200) NOT NULL,
        Designation NVARCHAR(200) NULL,
        SchoolAddress NVARCHAR(500) NULL,
        Phone NVARCHAR(30) NOT NULL,
        Email NVARCHAR(200) NULL,
        City NVARCHAR(200) NOT NULL,
        ApproxStudents NVARCHAR(50) NULL,
        AnythingElse NVARCHAR(MAX) NULL,
        SourceOfInformation NVARCHAR(100) NULL,
        Status NVARCHAR(50) NOT NULL DEFAULT 'New Enquiry',
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
      );
    END;

    IF COL_LENGTH('dbo.Tbl_SchoolEnquiries', 'Designation') IS NULL
      ALTER TABLE dbo.Tbl_SchoolEnquiries ADD Designation NVARCHAR(200) NULL;
    IF COL_LENGTH('dbo.Tbl_SchoolEnquiries', 'SchoolAddress') IS NULL
      ALTER TABLE dbo.Tbl_SchoolEnquiries ADD SchoolAddress NVARCHAR(500) NULL;
    IF COL_LENGTH('dbo.Tbl_SchoolEnquiries', 'SourceOfInformation') IS NULL
      ALTER TABLE dbo.Tbl_SchoolEnquiries ADD SourceOfInformation NVARCHAR(100) NULL;
  `);
}

async function createEnquiry(payload = {}) {
  await ensureEnquiriesTable();
  const schoolName = safeText(payload.schoolName, 300);
  const contactPersonName = safeText(payload.contactPersonName, 200);
  const designation = safeText(payload.designation, 200);
  const schoolAddress = safeText(payload.schoolAddress, 500);
  const phone = safeText(payload.phone, 30);
  const email = safeText(payload.email, 200);
  const city = safeText(payload.city, 200);
  const anythingElse = safeText(payload.anythingElse, 4000);
  const sourceOfInformation = safeText(payload.sourceOfInformation, 100);

  const result = await runSql(`
    SET NOCOUNT ON;
    DECLARE @InsertedEnquiry TABLE (Id INT);
    INSERT INTO dbo.Tbl_SchoolEnquiries
      (SchoolName, PrincipalName, Designation, SchoolAddress, Phone, Email, City,
       ApproxStudents, AnythingElse, SourceOfInformation)
    OUTPUT INSERTED.Id INTO @InsertedEnquiry
    VALUES (${sqlString(schoolName)}, ${sqlString(contactPersonName)}, ${sqlString(designation)},
      ${schoolAddress ? sqlString(schoolAddress) : "NULL"}, ${sqlString(phone)},
      ${sqlString(email)}, ${sqlString(city)}, NULL,
      ${anythingElse ? sqlString(anythingElse) : "NULL"},
      ${sourceOfInformation ? sqlString(sourceOfInformation) : "NULL"});
    SELECT enquiry.Id, enquiry.Status, enquiry.CreatedAt
    FROM dbo.Tbl_SchoolEnquiries AS enquiry
    INNER JOIN @InsertedEnquiry AS inserted ON inserted.Id = enquiry.Id
    FOR JSON PATH;
  `);
  const enquiry = parseJsonArray(result)[0];
  if (!enquiry?.Id) {
    throw new Error("Enquiry was saved, but its generated ID could not be retrieved.");
  }
  return enquiry;
}

async function listEnquiries({ page = 1, pageSize = 10, search = "", dateFrom = "", dateTo = "" } = {}) {
  await ensureEnquiriesTable();
  const normalizedPage = normalizePage(page, 1);
  const normalizedPageSize = Math.min(normalizePage(pageSize, 10), 100);
  const offset = (normalizedPage - 1) * normalizedPageSize;
  const trimmedSearch = safeText(search, 200).replace(/[\\%_]/g, "\\$&");
  const validDateFrom = /^\d{4}-\d{2}-\d{2}$/.test(String(dateFrom || "")) ? dateFrom : "";
  const validDateTo = /^\d{4}-\d{2}-\d{2}$/.test(String(dateTo || "")) ? dateTo : "";
  if (validDateFrom && validDateTo && validDateFrom > validDateTo) {
    throw new Error("The start date cannot be later than the end date.");
  }
  const whereClauses = [];

  if (trimmedSearch) {
    const numericId = /^\d+$/.test(trimmedSearch) ? Number(trimmedSearch) : null;
    const matchingFields = [
      "SchoolName",
      "PrincipalName",
      "Designation",
      "Phone",
      "Email",
      "City",
      "SchoolAddress",
      "SourceOfInformation",
    ];
    const searchClauses = matchingFields.map(
      (field) => `LOWER(COALESCE(${field}, '')) LIKE LOWER(${sqlString(`%${trimmedSearch}%`)}) ESCAPE '\\'`
    );
    if (numericId !== null && Number.isSafeInteger(numericId)) {
      searchClauses.push(`Id = ${numericId}`);
    }
    whereClauses.push(`(${searchClauses.join(" OR ")})`);
  }
  if (validDateFrom) {
    whereClauses.push(`CreatedAt >= CONVERT(date, ${sqlString(validDateFrom)}, 23)`);
  }
  if (validDateTo) {
    whereClauses.push(`CreatedAt < DATEADD(day, 1, CONVERT(date, ${sqlString(validDateTo)}, 23))`);
  }

  const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const countOutput = await runSql(`
    SELECT COUNT(*) AS total
    FROM dbo.Tbl_SchoolEnquiries
    ${whereClause};
  `);
  const total = Number(String(countOutput).match(/\d+/)?.[0] || 0);

  const rows = parseJsonArray(await runSql(`
    SET NOCOUNT ON;
    SELECT Id, SchoolName, PrincipalName AS ContactPersonName, Designation,
      SchoolAddress, Phone, Email, City, ApproxStudents, AnythingElse,
      SourceOfInformation, Status, CreatedAt, UpdatedAt
    FROM dbo.Tbl_SchoolEnquiries
    ${whereClause}
    ORDER BY CreatedAt DESC, Id DESC
    OFFSET ${offset} ROWS FETCH NEXT ${normalizedPageSize} ROWS ONLY
    FOR JSON PATH;
  `));

  return {
    rows,
    pagination: {
      page: normalizedPage,
      pageSize: normalizedPageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / normalizedPageSize)),
    },
  };
}

async function updateEnquiryStatus(id, status) {
  await ensureEnquiriesTable();
  const numericId = Number(id);
  const safeStatus = safeText(status, 50);
  if (!Number.isInteger(numericId) || numericId < 1 || !safeStatus) return false;
  const output = await runSql(`
    SET NOCOUNT ON;
    UPDATE dbo.Tbl_SchoolEnquiries
    SET Status = ${sqlString(safeStatus)}, UpdatedAt = GETDATE()
    WHERE Id = ${numericId};
    SELECT @@ROWCOUNT AS affected;
  `);
  return Number(String(output).match(/\d+/)?.[0] || 0) > 0;
}

async function deleteEnquiry(id) {
  await ensureEnquiriesTable();
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) return false;
  const output = await runSql(`DELETE FROM dbo.Tbl_SchoolEnquiries WHERE Id = ${numericId}; SELECT @@ROWCOUNT AS affected;`);
  return Number(String(output).match(/\d+/)?.[0] || 0) > 0;
}

module.exports = { createEnquiry, deleteEnquiry, listEnquiries, updateEnquiryStatus };
