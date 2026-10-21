const { runSql, sqlString } = require("../config/db");

function nullableIntExpression(value) {
  const trimmedValue = `LTRIM(RTRIM(${value}))`;
  return `CASE
    WHEN ${trimmedValue} <> ''
      AND ${trimmedValue} NOT LIKE '%[^0-9]%'
      AND LEN(${trimmedValue}) <= 10
      AND (LEN(${trimmedValue}) < 10 OR ${trimmedValue} <= '2147483647')
    THEN CAST(${trimmedValue} AS INT)
  END`;
}

const HOT_LINK_COLUMNS = `
  Id, Title, Subtitle, Description, Icon, IconColor, GradientFrom, GradientTo,
  BadgeText, BadgeColor, Url, OpenInNewTab, IsActive, DisplayOrder, CreatedAt, UpdatedAt
`;
const ACHIEVER_CATEGORIES = new Set([
  "uco-offline",
  "uco-online",
  "uigko-offline",
  "uieo-offline",
  "uieo-online",
  "nstse-offline",
  "nstse-online",
  "uimo-offline",
  "uimo-online",
]);
const achieverTable = (
  table,
  studentColumn,
  schoolColumn,
  { yearColumn = "YEAR", fallbackYear = "", locationColumn = "" } = {}
) => ({
  table,
  studentColumn,
  schoolColumn,
  yearColumn,
  fallbackYear,
  locationColumn,
});
const yearExpressionForAchieverSource = (source) => {
  const value = `CONVERT(NVARCHAR(50), [${source.yearColumn}])`;
  return source.fallbackYear
    ? `COALESCE(NULLIF(LTRIM(RTRIM(${value})), ''), ${sqlString(source.fallbackYear)})`
    : value;
};
const ACHIEVER_CATEGORY_TABLES = {
  "uco-offline": [
    achieverTable("dbo.achieversuco", "STU_NAME", "SCH_NAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achieversuco_top100", "STDNAME", "SCHNAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achieversuco_top100_2024", "STDNAME", "SCHNAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.Achievers_UZ", "STDNAME", "SCHNAME"),
    achieverTable("dbo.Achievers_UZ_2024", "STDNAME", "SCHNAME", { yearColumn: "CYEAR" }),
  ],
  "uco-online": [
    achieverTable("dbo.achieversucoonline", "STU_NAME", "SCH_NAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achieversucoonline_2024", "STU_NAME", "SCH_NAME", {
      yearColumn: "YEAR",
      fallbackYear: "2024",
      locationColumn: "PLACE",
    }),
    achieverTable("dbo.achieversuco_top100_online", "STDNAME", "SCHNAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achieversuco_top100_online_2024", "STDNAME", "SCHNAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.Achievers_UZ_Online", "STDNAME", "SCHNAME", { yearColumn: "CYEAR" }),
    achieverTable("dbo.Achievers_UZ_Online_2024", "STDNAME", "SCHNAME", { yearColumn: "CYEAR" }),
  ],
  "uigko-offline": [
    achieverTable("dbo.achieversuigko", "STDNAME", "SCHNAME"),
    achieverTable("dbo.achieversuigko_top100", "STD_NAME", "SCHNAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achieversuigko_top25", "STDNAME", "SCHNAME"),
  ],
  "uieo-offline": [
    achieverTable("dbo.achieversuieo", "STD_NAME", "SCH_NAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achieversuieo_2023", "STD_NAME", "SCH_NAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achieversuieo_top100_2023", "STD_NAME", "SCHNAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.AchieversUIEO_top25", "STDNAME", "SCHNAME"),
  ],
  "uieo-online": [
    achieverTable("dbo.achieversuieo_online", "STDNAME", "SCHNAME", { yearColumn: "CYEAR" }),
    achieverTable("dbo.achieversuieo_online_2024", "STDNAME", "SCHNAME", { yearColumn: "CYEAR" }),
    achieverTable("dbo.achieversuieo_top100", "STD_NAME", "SCHNAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achieversuieo_top100_online", "STD_NAME", "SCHNAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achieversuieo_top100_online_2024", "STD_NAME", "SCHNAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.AchieversUIEO_Top25_Online", "STDNAME", "SCHOOLNAME"),
    achieverTable("dbo.AchieversUIEO_Zone_Online", "STDNAME", "SCHNAME"),
  ],
  "nstse-offline": [
    achieverTable("dbo.achievers", "STDNAME", "SCHNAME"),
    achieverTable("dbo.achievers2", "STD_NAME", "SCH_NAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achievers2_2024", "STD_NAME", "SCH_NAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achievers_2019", "STD_NAME", "SCH_NAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achievers_2020", "STD_NAME", "SCH_NAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achievers_2021", "STD_NAME", "SCH_NAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achievers_2022", "STD_NAME", "SCH_NAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achievers_2023", "STD_NAME", "SCH_NAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achievers_2024", "STD_NAME", "SCH_NAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.Achievers_NS_2019", "STDNAME", "SCHNAME", {
      yearColumn: "CYEAR",
      fallbackYear: "2019",
    }),
    achieverTable("dbo.Achievers_NS_2020", "STDNAME", "SCHNAME", { yearColumn: "CYEAR" }),
    achieverTable("dbo.Achievers_NS_2022", "STDNAME", "SCHNAME", {
      yearColumn: "CYEAR",
      fallbackYear: "2022",
    }),
    achieverTable("dbo.Achievers_NS_2023", "STDNAME", "SCHNAME", { yearColumn: "CYEAR" }),
    achieverTable("dbo.Achievers_NS_2024", "STDNAME", "SCHNAME", {
      yearColumn: "CYEAR",
      fallbackYear: "2024",
    }),
    achieverTable("dbo.Achievers_NS2", "STDNAME", "SCHNAME", { yearColumn: "CYEAR" }),
    achieverTable("dbo.Achievers_NS2_2025", "STDNAME", "SCHNAME", { yearColumn: "CYEAR" }),
    achieverTable("dbo.AchieversNSTSE_State", "STDNAME", "SCHNAME"),
  ],
  "nstse-online": [
    achieverTable("dbo.[achievers-online]", "STD_NAME", "SCH_NAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.AchieversNSTSE_Top50_Online", "STDNAME", "SCHNAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.AchieversNSTSE_Zone_Online", "STDNAME", "SCHNAME"),
  ],
  "uimo-offline": [
    achieverTable("dbo.achievers_uimo_Off_2425", "STDNAME", "SCHNAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.Achievers_UM", "STDNAME", "SCHNAME", { yearColumn: "CYEAR" }),
    achieverTable("dbo.Achievers_UM2", "STDNAME", "SCHNAME", { yearColumn: "CYEAR" }),
    achieverTable("dbo.achieversuimo_2024", "STU_NAME", "SCH_NAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achieversuimo_today", "STU_NAME", "SCH_NAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achieversuimo_top100", "STDNAME", "SCHNAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achieversuimo_top100_2024", "STDNAME", "SCHNAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.achieversuimo2_top100", "STDNAME", "SCHNAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.AchieversUIMO_State", "STDNAME", "SCHOOLNAME"),
    achieverTable("dbo.AchieversUIMO_Top25", "STDNAME", "SCHNAME"),
  ],
  "uimo-online": [
    achieverTable("dbo.AchieversUIMO_Top25_Online", "STDNAME", "SCHNAME", { locationColumn: "PLACE" }),
    achieverTable("dbo.AchieversUIMO_Zone_Online", "STDNAME", "SCHNAME"),
  ],
};
const ACHIEVER_CLASSES = Array.from({ length: 10 }, (_value, index) => index + 1);
const ACHIEVER_CATEGORY_LABELS = {
  "uco-offline": "UCO Offline",
  "uco-online": "UCO Online",
  "uigko-offline": "UIGKO Offline",
  "uieo-offline": "UIEO Offline",
  "uieo-online": "UIEO Online",
  "nstse-offline": "NSTSE Offline",
  "nstse-online": "NSTSE Online",
  "uimo-offline": "UIMO Offline",
  "uimo-online": "UIMO Online",
};
let ensureStaticContentTablesPromise;

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function parseJsonArray(output) {
  const text = String(output || "").replace(/^\uFEFF/, "").trim();
  if (!text || /^\(0 rows affected\)$/i.test(text)) {
    return [];
  }
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end <= start) {
    throw new Error("Unable to read static content records from the database.");
  }
  return JSON.parse(text.slice(start, end + 1).replace(/[\r\n]+/g, ""));
}

function parseId(value) {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw createValidationError("A valid record ID is required.");
  }
  return id;
}

function text(value, field, maxLength, required = false) {
  const result = String(value ?? "").trim();
  if (required && !result) {
    throw createValidationError(`${field} is required.`);
  }
  if (result.length > maxLength) {
    throw createValidationError(`${field} must be ${maxLength} characters or fewer.`);
  }
  return result;
}

function normalizeHotLink(payload = {}) {
  const displayOrder = Number(payload.displayOrder ?? 0);
  if (!Number.isSafeInteger(displayOrder) || displayOrder < 0) {
    throw createValidationError("Display order must be a non-negative whole number.");
  }

  return {
    title: text(payload.title, "Title", 200, true),
    subtitle: text(payload.subtitle, "Subtitle", 300),
    description: text(payload.description, "Description", 2000),
    icon: text(payload.icon, "Icon", 80, true),
    iconColor: text(payload.iconColor, "Icon color", 40),
    gradientFrom: text(payload.gradientFrom, "Gradient start", 60),
    gradientTo: text(payload.gradientTo, "Gradient end", 60),
    badgeText: text(payload.badgeText, "Badge text", 100),
    badgeColor: text(payload.badgeColor, "Badge color", 80),
    url: text(payload.url, "URL", 2000, true),
    openInNewTab: Boolean(payload.openInNewTab),
    isActive: payload.isActive === undefined ? true : Boolean(payload.isActive),
    displayOrder,
  };
}

function normalizeAchiever(payload = {}) {
  const rank = Number(payload.rank);
  if (!Number.isSafeInteger(rank) || rank < 1) {
    throw createValidationError("Rank must be a positive whole number.");
  }

  const year = text(payload.year, "Academic year", 7, true);
  if (!/^\d{4}-\d{2}$/.test(year)) {
    throw createValidationError("Academic year must use the YYYY-YY format.");
  }

  return {
    name: text(payload.name, "Student name", 200, true),
    school: text(payload.school, "School", 300, true),
    exam: text(payload.exam, "Olympiad", 50, true),
    year,
    studentClass: text(payload.studentClass, "Class", 20, true),
    rank,
    rankLabel: text(payload.rankLabel, "Rank label", 30),
    photo: text(payload.photo, "Photo URL", 1000),
    video: text(payload.video, "Video URL", 1000),
  };
}

async function ensureStaticContentTables() {
  if (!ensureStaticContentTablesPromise) {
    ensureStaticContentTablesPromise = runSql(`
    SET XACT_ABORT ON;
    BEGIN TRANSACTION;
    EXEC sp_getapplock @Resource = 'UnifiedCouncilStaticContentSchema', @LockMode = 'Exclusive', @LockOwner = 'Transaction';

    IF OBJECT_ID('dbo.Tbl_StaticContentHotLinks', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.Tbl_StaticContentHotLinks (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Title NVARCHAR(200) NOT NULL,
        Subtitle NVARCHAR(300) NULL,
        Description NVARCHAR(2000) NULL,
        Icon NVARCHAR(80) NOT NULL,
        IconColor NVARCHAR(40) NULL,
        GradientFrom NVARCHAR(60) NULL,
        GradientTo NVARCHAR(60) NULL,
        BadgeText NVARCHAR(100) NULL,
        BadgeColor NVARCHAR(80) NULL,
        Url NVARCHAR(2000) NOT NULL,
        OpenInNewTab BIT NOT NULL DEFAULT 0,
        IsActive BIT NOT NULL DEFAULT 1,
        DisplayOrder INT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END;

    IF OBJECT_ID('dbo.Tbl_StaticContentAchievers', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.Tbl_StaticContentAchievers (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        School NVARCHAR(300) NOT NULL,
        Exam NVARCHAR(50) NOT NULL,
        [Year] NVARCHAR(7) NOT NULL,
        StudentClass NVARCHAR(20) NOT NULL,
        [Rank] INT NOT NULL,
        RankLabel NVARCHAR(30) NULL,
        Photo NVARCHAR(1000) NOT NULL,
        Video NVARCHAR(1000) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END;

    IF OBJECT_ID('dbo.Tbl_StaticContentExamCategories', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.Tbl_StaticContentExamCategories (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(50) NOT NULL UNIQUE,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END;

    IF COL_LENGTH('dbo.Tbl_StaticContentAchievers', 'ExamCategoryId') IS NULL
    BEGIN
      ALTER TABLE dbo.Tbl_StaticContentAchievers ADD ExamCategoryId INT NULL;
    END;

    COMMIT TRANSACTION;
  `);
    ensureStaticContentTablesPromise = ensureStaticContentTablesPromise.catch((error) => {
      ensureStaticContentTablesPromise = null;
      throw error;
    });
  }
  await ensureStaticContentTablesPromise;
}

function hotLinkValues(link) {
  return [
    sqlString(link.title),
    sqlString(link.subtitle),
    sqlString(link.description),
    sqlString(link.icon),
    sqlString(link.iconColor),
    sqlString(link.gradientFrom),
    sqlString(link.gradientTo),
    sqlString(link.badgeText),
    sqlString(link.badgeColor),
    sqlString(link.url),
    link.openInNewTab ? 1 : 0,
    link.isActive ? 1 : 0,
    link.displayOrder,
  ];
}

function hotLinkSelect(whereClause = "") {
  return `
    SELECT ${HOT_LINK_COLUMNS}
    FROM dbo.Tbl_StaticContentHotLinks
    ${whereClause}
    ORDER BY DisplayOrder ASC, Id ASC
    FOR JSON PATH;
  `;
}

function hotLinkInsertValues(values) {
  return `(${values.slice(0, 10).join(", ")}, ${values[10]}, ${values[11]}, ${values[12]})`;
}

async function listHotLinks({ activeOnly = false } = {}) {
  await ensureStaticContentTables();
  const filter = activeOnly ? "WHERE IsActive = 1" : "";
  return parseJsonArray(await runSql(hotLinkSelect(filter)));
}

async function getHotLink(idValue) {
  await ensureStaticContentTables();
  const id = parseId(idValue);
  const rows = parseJsonArray(await runSql(hotLinkSelect(`WHERE Id = ${id}`)));
  return rows[0] || null;
}

async function createHotLink(payload) {
  await ensureStaticContentTables();
  const values = hotLinkValues(normalizeHotLink(payload));
  const output = await runSql(`
    SET NOCOUNT ON;
    DECLARE @Created TABLE (Id INT);
    INSERT INTO dbo.Tbl_StaticContentHotLinks
      (Title, Subtitle, Description, Icon, IconColor, GradientFrom, GradientTo,
       BadgeText, BadgeColor, Url, OpenInNewTab, IsActive, DisplayOrder)
    OUTPUT INSERTED.Id INTO @Created
    VALUES ${hotLinkInsertValues(values)};
    ${hotLinkSelect("WHERE Id = (SELECT TOP 1 Id FROM @Created)")}
  `);
  return parseJsonArray(output)[0] || null;
}

async function updateHotLink(idValue, payload) {
  await ensureStaticContentTables();
  const id = parseId(idValue);
  const values = hotLinkValues(normalizeHotLink(payload));
  await runSql(`
    UPDATE dbo.Tbl_StaticContentHotLinks
    SET Title = ${values[0]}, Subtitle = ${values[1]}, Description = ${values[2]},
        Icon = ${values[3]}, IconColor = ${values[4]}, GradientFrom = ${values[5]},
        GradientTo = ${values[6]}, BadgeText = ${values[7]}, BadgeColor = ${values[8]},
        Url = ${values[9]}, OpenInNewTab = ${values[10]}, IsActive = ${values[11]},
        DisplayOrder = ${values[12]}, UpdatedAt = SYSUTCDATETIME()
    WHERE Id = ${id};
  `);
  return getHotLink(id);
}

async function deleteHotLink(idValue) {
  await ensureStaticContentTables();
  const id = parseId(idValue);
  const result = await runSql(`
    SET NOCOUNT ON;
    DELETE FROM dbo.Tbl_StaticContentHotLinks WHERE Id = ${id};
    SELECT @@ROWCOUNT AS Deleted;
  `);
  return /\b1\b/.test(result);
}

async function toggleHotLink(idValue, isActive) {
  await ensureStaticContentTables();
  const id = parseId(idValue);
  if (typeof isActive !== "boolean") {
    throw createValidationError("A boolean active status is required.");
  }
  await runSql(`
    UPDATE dbo.Tbl_StaticContentHotLinks
    SET IsActive = ${isActive ? 1 : 0}, UpdatedAt = SYSUTCDATETIME()
    WHERE Id = ${id};
  `);
  return getHotLink(id);
}

async function reorderHotLinks(items) {
  await ensureStaticContentTables();
  if (!Array.isArray(items) || items.length === 0) {
    throw createValidationError("At least one hot link is required to update the order.");
  }
  const normalized = items.map((item) => {
    const id = parseId(item?.id);
    const order = Number(item?.order);
    if (!Number.isSafeInteger(order) || order < 0) {
      throw createValidationError("Each display order must be a non-negative whole number.");
    }
    return { id, order };
  });
  if (new Set(normalized.map(({ id }) => id)).size !== normalized.length) {
    throw createValidationError("Duplicate hot link IDs are not allowed.");
  }
  const values = normalized.map(({ id, order }) => `(${id}, ${order})`).join(", ");
  await runSql(`
    UPDATE link
    SET DisplayOrder = item.DisplayOrder, UpdatedAt = SYSUTCDATETIME()
    FROM dbo.Tbl_StaticContentHotLinks AS link
    INNER JOIN (VALUES ${values}) AS item(Id, DisplayOrder) ON item.Id = link.Id;
  `);
  return listHotLinks();
}

async function listAchievers() {
  await ensureStaticContentTables();
  return parseJsonArray(await runSql(`
    SELECT CONVERT(NVARCHAR(40), Id) AS id, Name AS name, School AS school,
           Exam AS exam, [Year] AS year, StudentClass AS studentClass,
           [Rank] AS rank, RankLabel AS rankLabel, Photo AS photo,
           Video AS video, CAST(0 AS BIT) AS isLegacy
    FROM dbo.Tbl_StaticContentAchievers
    ORDER BY [Year] DESC, [Rank] ASC, Id DESC
    FOR JSON PATH;
  `));
}

async function listAchieverCategoryCounts() {
  await ensureStaticContentTables();
  const categoryQueries = Object.entries(ACHIEVER_CATEGORY_TABLES).flatMap(
    ([category, sources]) => sources.map((source) => `
      SELECT
        ${sqlString(category)} AS category,
        ${yearExpressionForAchieverSource(source)} AS [year],
        CONVERT(INT, [CLASS]) AS studentClass,
        CONVERT(INT, [RANK]) AS [rank],
        CONVERT(NVARCHAR(200), [${source.studentColumn}]) AS name,
        CONVERT(NVARCHAR(300), [${source.schoolColumn}]) AS school,
        TOTAL AS score,
        ${source.locationColumn
          ? `CONVERT(NVARCHAR(200), [${source.locationColumn}])`
          : "CAST(NULL AS NVARCHAR(200))"} AS location
      FROM ${source.table}
    `)
  );
  const rows = parseJsonArray(await runSql(`
    SELECT category, COUNT(*) AS recordCount
    FROM (
      SELECT DISTINCT category, [year], studentClass, [rank], name, school, score, location
      FROM (${categoryQueries.join(" UNION ALL ")}) AS categoryRecords
    ) AS uniqueRecords
    GROUP BY category
    FOR JSON PATH;
  `));
  const countsByCategory = new Map(
    rows.map(({ category, recordCount }) => [category, Number(recordCount)])
  );
  const customCounts = parseJsonArray(await runSql(`
    SELECT CONCAT('custom-', exam.Id) AS category, COUNT(achiever.Id) AS recordCount
    FROM dbo.Tbl_StaticContentExamCategories AS exam
    LEFT JOIN dbo.Tbl_StaticContentAchievers AS achiever ON achiever.ExamCategoryId = exam.Id
    GROUP BY exam.Id
    FOR JSON PATH;
  `));
  const managedCounts = parseJsonArray(await runSql(`
    SELECT Exam AS exam, COUNT(*) AS recordCount
    FROM dbo.Tbl_StaticContentAchievers
    WHERE ExamCategoryId IS NULL
    GROUP BY Exam
    FOR JSON PATH;
  `));
  const managedCountsByCategory = new Map(
    managedCounts.map(({ exam, recordCount }) => [exam, Number(recordCount)])
  );
  return [
    ...Array.from(ACHIEVER_CATEGORIES, (category) => ({
      category,
      count: (countsByCategory.get(category) || 0)
        + (managedCountsByCategory.get(ACHIEVER_CATEGORY_LABELS[category]) || 0),
    })),
    ...customCounts.map(({ category, recordCount }) => ({
      category,
      count: Number(recordCount),
    })),
  ];
}

async function listCustomAchieverExams() {
  await ensureStaticContentTables();
  return parseJsonArray(await runSql(`
    SELECT Id AS id, Name AS name
    FROM dbo.Tbl_StaticContentExamCategories
    ORDER BY Name ASC, Id ASC
    FOR JSON PATH;
  `));
}

async function createCustomAchieverExam(payload = {}) {
  await ensureStaticContentTables();
  const name = text(payload.name, "Exam name", 50, true);
  const output = await runSql(`
    SET NOCOUNT ON;
    DECLARE @Created TABLE (Id INT);
    INSERT INTO dbo.Tbl_StaticContentExamCategories (Name)
    OUTPUT INSERTED.Id INTO @Created
    VALUES (${sqlString(name)});
    SELECT exam.Id AS id, exam.Name AS name
    FROM dbo.Tbl_StaticContentExamCategories AS exam
    INNER JOIN @Created AS created ON created.Id = exam.Id
    FOR JSON PATH;
  `);
  return parseJsonArray(output)[0] || null;
}

async function deleteCustomAchieverExam(idValue) {
  await ensureStaticContentTables();
  const id = parseId(idValue);
  const output = await runSql(`
    SET XACT_ABORT ON;
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    DELETE FROM dbo.Tbl_StaticContentAchievers WHERE ExamCategoryId = ${id};
    DELETE FROM dbo.Tbl_StaticContentExamCategories WHERE Id = ${id};
    SELECT @@ROWCOUNT AS Deleted FOR JSON PATH;
    COMMIT TRANSACTION;
  `);
  return parseJsonArray(output)[0]?.Deleted === 1;
}

async function listTopAchievers({ category, year = "", studentClass = "", limit = "all" } = {}) {
  const categoryKey = String(category || "").trim().toLowerCase();
  const customCategory = /^custom-(\d+)$/.exec(categoryKey);
  if (customCategory) {
    return listCustomExamAchievers(Number(customCategory[1]), { year, studentClass, limit });
  }
  if (!ACHIEVER_CATEGORIES.has(categoryKey)) {
    throw createValidationError("Select a valid achiever category.");
  }
  await ensureStaticContentTables();

  const requestedYear = year ? text(year, "Academic year", 50) : "";
  if (requestedYear && !/^(2019|202[0-6])$/.test(requestedYear)) {
    throw createValidationError("Select a year from 2019 to 2026.");
  }
  const classValue = studentClass ? Number(studentClass) : null;
  if (classValue !== null && (!Number.isSafeInteger(classValue) || classValue < 1 || classValue > 10)) {
    throw createValidationError("Select a class from 1 to 10.");
  }
  const requestedLimit = String(limit).trim().toLowerCase();
  if (!["all", "5", "10", "50", "100"].includes(requestedLimit)) {
    throw createValidationError("Choose All, Top 5, Top 10, Top 50, or Top 100 achievers.");
  }

  const tables = ACHIEVER_CATEGORY_TABLES[categoryKey] || [];

  const availableYearQueries = tables.map((source) => {
    const sourceYear = yearExpressionForAchieverSource(source);
    return `
      SELECT ${sourceYear} AS [year]
      FROM ${source.table}
      WHERE NULLIF(LTRIM(RTRIM(${sourceYear})), '') IS NOT NULL
    `;
  });
  const years = availableYearQueries.length
    ? parseJsonArray(await runSql(`
      SELECT DISTINCT [year]
      FROM (${availableYearQueries.join(" UNION ALL ")}) AS availableYears
      ORDER BY [year] DESC
      FOR JSON PATH;
    `)).map(({ year: availableYear }) => availableYear)
    : [];

  const recordQueries = tables.map((source) => `
    SELECT
      ${sqlString(categoryKey.split("-")[0].toUpperCase())} AS photoExam,
      ${yearExpressionForAchieverSource(source)} AS [year],
      CONVERT(INT, [CLASS]) AS studentClass,
      CONVERT(INT, [RANK]) AS [rank],
      CONVERT(NVARCHAR(200), [${source.studentColumn}]) AS name,
      CONVERT(NVARCHAR(300), [${source.schoolColumn}]) AS school,
      TOTAL AS score,
      ${source.locationColumn
        ? `CONVERT(NVARCHAR(200), [${source.locationColumn}])`
        : "CAST(NULL AS NVARCHAR(200))"} AS location
    FROM ${source.table}
  `);
  const recordFilters = [
    requestedYear ? `[year] = ${sqlString(requestedYear)}` : null,
    classValue === null ? null : `studentClass = ${classValue}`,
  ].filter(Boolean);
  const records = recordQueries.length
    ? parseJsonArray(await runSql(`
    SELECT ${requestedLimit === "all" ? "" : `TOP ${requestedLimit}`}
      ROW_NUMBER() OVER (ORDER BY [year] DESC, studentClass ASC, [rank] ASC, score DESC, name ASC) AS id,
      name,
      matchedPhoto.photo AS photo,
      school,
      studentClass,
      [rank],
      score,
      [year],
      location
    FROM (
      SELECT DISTINCT photoExam, year, studentClass, [rank], name, school, score, location
      FROM (${recordQueries.join(" UNION ALL ")}) AS allAchievers
    ) AS uniqueAchievers
    OUTER APPLY (
      SELECT CASE WHEN COUNT(*) = 1 THEN MAX(Photo) END AS photo
      FROM [unifiedcouncil_admin].dbo.Achievers AS storedPhoto
      WHERE UPPER(LTRIM(RTRIM(storedPhoto.Name))) = UPPER(LTRIM(RTRIM(uniqueAchievers.name)))
        AND UPPER(LTRIM(RTRIM(storedPhoto.Exam))) = uniqueAchievers.photoExam
        AND LEFT(storedPhoto.AcademicYear, 4) = uniqueAchievers.[year]
        AND CONVERT(INT, LEFT(storedPhoto.StudentClass, CHARINDEX(' ', storedPhoto.StudentClass + ' ') - 1)) = uniqueAchievers.studentClass
    ) AS matchedPhoto
    ${recordFilters.length ? `WHERE ${recordFilters.join(" AND ")}` : ""}
    ORDER BY [year] DESC, studentClass ASC, [rank] ASC, score DESC, name ASC
    FOR JSON PATH;
  `))
    : [];
  const managedFilters = [
    "ExamCategoryId IS NULL",
    `Exam = ${sqlString(ACHIEVER_CATEGORY_LABELS[categoryKey])}`,
    requestedYear ? `LEFT([Year], 4) = ${sqlString(requestedYear)}` : null,
    classValue === null ? null : `${nullableIntExpression("StudentClass")} = ${classValue}`,
  ].filter(Boolean);
  const managedRecords = parseJsonArray(await runSql(`
    SELECT ${requestedLimit === "all" ? "" : `TOP ${requestedLimit}`}
           Id AS id, Name AS name, Photo AS photo, School AS school,
           ${nullableIntExpression("StudentClass")} AS studentClass, [Rank] AS [rank],
           CAST(NULL AS NVARCHAR(100)) AS score, LEFT([Year], 4) AS [year],
           CAST(NULL AS NVARCHAR(200)) AS location, CAST(1 AS BIT) AS isManaged
    FROM dbo.Tbl_StaticContentAchievers
    WHERE ${managedFilters.join(" AND ")}
    ORDER BY [Year] DESC, ${nullableIntExpression("StudentClass")} ASC, [Rank] ASC, Name ASC
    FOR JSON PATH;
  `));
  const allRecords = [...records, ...managedRecords].sort((left, right) => (
    String(right.year).localeCompare(String(left.year))
    || Number(left.studentClass) - Number(right.studentClass)
    || Number(left.rank) - Number(right.rank)
    || (Number(right.score) || 0) - (Number(left.score) || 0)
    || String(left.name).localeCompare(String(right.name))
  ));
  const limitedRecords = requestedLimit === "all"
    ? allRecords
    : allRecords.slice(0, Number(requestedLimit));

  return {
    available: recordQueries.length > 0 || managedRecords.length > 0,
    category: categoryKey,
    years: [...new Set([...years, ...managedRecords.map(({ year: value }) => value)])]
      .sort((left, right) => String(right).localeCompare(String(left))),
    classes: ACHIEVER_CLASSES,
    records: limitedRecords,
  };
}

async function listCustomExamAchievers(categoryId, { year = "", studentClass = "", limit = "all" } = {}) {
  await ensureStaticContentTables();
  const id = parseId(categoryId);
  const requestedYear = year ? text(year, "Academic year", 4) : "";
  if (requestedYear && !/^(2019|202[0-6])$/.test(requestedYear)) {
    throw createValidationError("Select a year from 2019 to 2026.");
  }
  const classValue = studentClass ? Number(studentClass) : null;
  if (classValue !== null && (!Number.isSafeInteger(classValue) || classValue < 1 || classValue > 10)) {
    throw createValidationError("Select a class from 1 to 10.");
  }
  const requestedLimit = String(limit).trim().toLowerCase();
  if (!["all", "5", "10", "50", "100"].includes(requestedLimit)) {
    throw createValidationError("Choose All, Top 5, Top 10, Top 50, or Top 100 achievers.");
  }
  const examRows = parseJsonArray(await runSql(`
    SELECT Id AS id, Name AS name
    FROM dbo.Tbl_StaticContentExamCategories
    WHERE Id = ${id}
    FOR JSON PATH;
  `));
  if (!examRows.length) {
    throw createValidationError("Select a valid achiever category.");
  }

  const filterClauses = [
    `ExamCategoryId = ${id}`,
    requestedYear ? `LEFT([Year], 4) = ${sqlString(requestedYear)}` : null,
    classValue === null ? null : `CONVERT(INT, StudentClass) = ${classValue}`,
  ].filter(Boolean);
  const whereClause = filterClauses.join(" AND ");
  const years = parseJsonArray(await runSql(`
    SELECT DISTINCT LEFT([Year], 4) AS [year]
    FROM dbo.Tbl_StaticContentAchievers
    WHERE ExamCategoryId = ${id}
    ORDER BY [year] DESC
    FOR JSON PATH;
  `)).map(({ year: value }) => value);
  const records = parseJsonArray(await runSql(`
    SELECT ${requestedLimit === "all" ? "" : `TOP ${requestedLimit}`}
      Id AS id, Name AS name, Photo AS photo, School AS school,
      CONVERT(INT, StudentClass) AS studentClass, [Rank] AS [rank],
      CAST(NULL AS NVARCHAR(100)) AS score, LEFT([Year], 4) AS [year],
      CAST(NULL AS NVARCHAR(200)) AS location, CAST(1 AS BIT) AS isManaged
    FROM dbo.Tbl_StaticContentAchievers
    WHERE ${whereClause}
    ORDER BY [Year] DESC, CONVERT(INT, StudentClass) ASC, [Rank] ASC, Name ASC
    FOR JSON PATH;
  `));
  return {
    available: true,
    category: `custom-${id}`,
    years,
    classes: ACHIEVER_CLASSES,
    records,
  };
}

async function createCustomExamAchiever(categoryId, payload = {}) {
  await ensureStaticContentTables();
  const id = parseId(categoryId);
  const exams = parseJsonArray(await runSql(`
    SELECT Id AS id, Name AS name
    FROM dbo.Tbl_StaticContentExamCategories
    WHERE Id = ${id}
    FOR JSON PATH;
  `));
  if (!exams.length) return null;
  const values = achieverValues(normalizeAchiever({ ...payload, exam: exams[0].name }));
  const output = await runSql(`
    SET NOCOUNT ON;
    DECLARE @Created TABLE (Id INT);
    INSERT INTO dbo.Tbl_StaticContentAchievers
      (Name, School, Exam, [Year], StudentClass, [Rank], RankLabel, Photo, Video, ExamCategoryId)
    OUTPUT INSERTED.Id INTO @Created
    VALUES (${values.join(", ")}, ${id});
    SELECT achiever.Id AS id, achiever.Name AS name, achiever.School AS school,
           achiever.Exam AS exam, achiever.[Year] AS year,
           achiever.StudentClass AS studentClass, achiever.[Rank] AS rank,
           achiever.RankLabel AS rankLabel, achiever.Photo AS photo,
           achiever.Video AS video
    FROM dbo.Tbl_StaticContentAchievers AS achiever
    INNER JOIN @Created AS created ON created.Id = achiever.Id
    FOR JSON PATH;
  `);
  return parseJsonArray(output)[0] || null;
}

async function getAchiever(idValue) {
  await ensureStaticContentTables();
  const id = parseId(idValue);
  const rows = parseJsonArray(await runSql(`
    SELECT Id AS id, Name AS name, School AS school, Exam AS exam, [Year] AS year,
           StudentClass AS studentClass, [Rank] AS rank, RankLabel AS rankLabel,
           Photo AS photo, Video AS video
    FROM dbo.Tbl_StaticContentAchievers
    WHERE Id = ${id}
    FOR JSON PATH;
  `));
  return rows[0] || null;
}

function achieverValues(achiever) {
  return [
    sqlString(achiever.name),
    sqlString(achiever.school),
    sqlString(achiever.exam),
    sqlString(achiever.year),
    sqlString(achiever.studentClass),
    achiever.rank,
    sqlString(achiever.rankLabel),
    sqlString(achiever.photo),
    sqlString(achiever.video),
  ];
}

async function createAchiever(payload) {
  await ensureStaticContentTables();
  const values = achieverValues(normalizeAchiever(payload));
  const output = await runSql(`
    SET NOCOUNT ON;
    DECLARE @Created TABLE (Id INT);
    INSERT INTO dbo.Tbl_StaticContentAchievers
      (Name, School, Exam, [Year], StudentClass, [Rank], RankLabel, Photo, Video)
    OUTPUT INSERTED.Id INTO @Created
    VALUES (${values.join(", ")});
    SELECT achiever.Id AS id, achiever.Name AS name, achiever.School AS school,
           achiever.Exam AS exam, achiever.[Year] AS year,
           achiever.StudentClass AS studentClass, achiever.[Rank] AS rank,
           achiever.RankLabel AS rankLabel, achiever.Photo AS photo,
           achiever.Video AS video
    FROM dbo.Tbl_StaticContentAchievers AS achiever
    INNER JOIN @Created AS created ON created.Id = achiever.Id
    FOR JSON PATH;
  `);
  return parseJsonArray(output)[0] || null;
}

async function updateAchiever(idValue, payload) {
  await ensureStaticContentTables();
  const id = parseId(idValue);
  const values = achieverValues(normalizeAchiever(payload));
  await runSql(`
    UPDATE dbo.Tbl_StaticContentAchievers
    SET Name = ${values[0]}, School = ${values[1]}, Exam = ${values[2]},
        [Year] = ${values[3]}, StudentClass = ${values[4]}, [Rank] = ${values[5]},
        RankLabel = ${values[6]}, Photo = ${values[7]}, Video = ${values[8]},
        UpdatedAt = SYSUTCDATETIME()
    WHERE Id = ${id};
  `);
  return getAchiever(id);
}

async function deleteAchiever(idValue) {
  await ensureStaticContentTables();
  const id = parseId(idValue);
  const result = await runSql(`
    SET NOCOUNT ON;
    DELETE FROM dbo.Tbl_StaticContentAchievers WHERE Id = ${id};
    SELECT @@ROWCOUNT AS Deleted;
  `);
  return /\b1\b/.test(result);
}

module.exports = {
  createAchiever,
  createCustomAchieverExam,
  createCustomExamAchiever,
  deleteCustomAchieverExam,
  createHotLink,
  deleteAchiever,
  deleteHotLink,
  getAchiever,
  getHotLink,
  listAchievers,
  listCustomAchieverExams,
  listAchieverCategoryCounts,
  listHotLinks,
  listTopAchievers,
  reorderHotLinks,
  toggleHotLink,
  updateAchiever,
  updateHotLink,
};
