const {
  runSql,
  sqlNumber,
  sqlNullableNumber,
  sqlString,
  sqlNullableString,
} = require("../config/db");
const getDatabaseConnection = require("../config/databaseConnection");

function parseJsonResult(output) {
  if (!output) {
    return null;
  }

  const normalizedOutput = String(output).replace(/^\uFEFF/, "").trim();
  const jsonStart = normalizedOutput.indexOf("{");
  const jsonArrayStart = normalizedOutput.indexOf("[");
  const startIndex =
    jsonStart === -1 ? jsonArrayStart : jsonArrayStart === -1 ? jsonStart : Math.min(jsonStart, jsonArrayStart);

  if (startIndex === -1) {
    return null;
  }

  const openingToken = normalizedOutput[startIndex];
  const closingToken = openingToken === "[" ? "]" : "}";
  let depth = 0;
  let inString = false;
  let isEscaped = false;

  for (let index = startIndex; index < normalizedOutput.length; index += 1) {
    const character = normalizedOutput[index];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
      } else if (character === "\\") {
        isEscaped = true;
      } else if (character === "\"") {
        inString = false;
      }
      continue;
    }

    if (character === "\"") {
      inString = true;
      continue;
    }

    if (character === openingToken) {
      depth += 1;
      continue;
    }

    if (character === closingToken) {
      depth -= 1;
      if (depth === 0) {
        const extractedJson = normalizedOutput.slice(startIndex, index + 1);
        return JSON.parse(extractedJson.replace(/[\r\n]+/g, ""));
      }
    }
  }

  return JSON.parse(normalizedOutput.slice(startIndex).replace(/[\r\n]+/g, ""));
}

function getMessageFromStatus(status, fallbackMessage = "") {
  const normalizedStatus = String(status || "").trim();

  if (normalizedStatus === "Success") {
    return "Successful";
  }

  if (normalizedStatus === "Failure") {
    return "Failed";
  }

  if (normalizedStatus === "Pending") {
    return "Pending";
  }

  return String(fallbackMessage || "").trim();
}

async function initializeTables() {
  const databaseName = getDatabaseConnection().database;
  await runSql(`
    IF DB_ID(${sqlString(databaseName)}) IS NULL
    BEGIN
      DECLARE @createDatabaseSql NVARCHAR(MAX) =
        N'CREATE DATABASE ' + QUOTENAME(${sqlString(databaseName)});
      EXEC(@createDatabaseSql);
    END;
  `, "master");

  await runSql(`
    IF OBJECT_ID('dbo.Tbl_UnsubmittedRegistrations', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.Tbl_UnsubmittedRegistrations (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Class NVARCHAR(20) NULL,
        Amount DECIMAL(18,2) NULL,
        StudentName NVARCHAR(200) NULL,
        ParentsName NVARCHAR(200) NULL,
        MobileNo NVARCHAR(20) NULL,
        EmailId NVARCHAR(200) NULL,
        CreatedOn DATETIME NOT NULL DEFAULT GETDATE(),
        UserStatus INT NOT NULL DEFAULT 1
      )
    END;

    IF OBJECT_ID('dbo.Tbl_Registration', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.Tbl_Registration (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CoordinatorId NVARCHAR(100) NULL,
        BMALSOP DECIMAL(18,2) NULL,
        CGSTOP DECIMAL(18,2) NULL,
        SGSTOP DECIMAL(18,2) NULL,
        IGSTOP DECIMAL(18,2) NULL,
        Examfee DECIMAL(18,2) NULL,
        SGST DECIMAL(18,2) NULL,
        CGST DECIMAL(18,2) NULL,
        IGST DECIMAL(18,2) NULL,
        ZIP NVARCHAR(20) NULL,
        STDSTATE NVARCHAR(100) NULL,
        STDADD1 NVARCHAR(500) NULL,
        STDADD2 NVARCHAR(500) NULL,
        STDADD3 NVARCHAR(200) NULL,
        STDNAME NVARCHAR(200) NULL,
        FNAME NVARCHAR(200) NULL,
        STDPH2 NVARCHAR(20) NULL,
        CLASS NVARCHAR(20) NULL,
        EMAIL NVARCHAR(200) NULL,
        SCHOOLNAME NVARCHAR(300) NULL,
        SCADD1 NVARCHAR(500) NULL,
        SCADD2 NVARCHAR(500) NULL,
        SCSTATE NVARCHAR(100) NULL,
        SCZIP NVARCHAR(20) NULL,
        SCPHONE NVARCHAR(50) NULL,
        Status NVARCHAR(50) NULL,
        ReferenceNumber NVARCHAR(100) NULL,
        transid NVARCHAR(100) NULL,
        Amount DECIMAL(18,2) NULL,
        FullAmount DECIMAL(18,2) NULL,
        transdate DATETIME NULL,
        Message NVARCHAR(100) NULL,
        Board NVARCHAR(100) NULL,
        InfoSource NVARCHAR(200) NULL,
        Packagesbought NVARCHAR(MAX) NULL,
        CENTERNAME NVARCHAR(200) NULL,
        Separatepackages NVARCHAR(500) NULL,
        SCPrincipal NVARCHAR(200) NULL,
        InvoiceNo NVARCHAR(100) NULL,
        OnlinePackageMRP DECIMAL(18,2) NULL,
        OnlinePackageDiscount DECIMAL(18,2) NULL,
        ComboOfferDiscount DECIMAL(18,2) NULL,
        PackageGST DECIMAL(18,2) NULL
      )
    END;

    IF COL_LENGTH('dbo.Tbl_Registration', 'ReferenceNumber') IS NULL
      ALTER TABLE dbo.Tbl_Registration ADD ReferenceNumber NVARCHAR(100) NULL;
    IF COL_LENGTH('dbo.Tbl_Registration', 'InvoiceNo') IS NULL
      ALTER TABLE dbo.Tbl_Registration ADD InvoiceNo NVARCHAR(100) NULL;
    IF COL_LENGTH('dbo.Tbl_Registration', 'OnlinePackageMRP') IS NULL
      ALTER TABLE dbo.Tbl_Registration ADD OnlinePackageMRP DECIMAL(18,2) NULL;
    IF COL_LENGTH('dbo.Tbl_Registration', 'OnlinePackageDiscount') IS NULL
      ALTER TABLE dbo.Tbl_Registration ADD OnlinePackageDiscount DECIMAL(18,2) NULL;
    IF COL_LENGTH('dbo.Tbl_Registration', 'ComboOfferDiscount') IS NULL
      ALTER TABLE dbo.Tbl_Registration ADD ComboOfferDiscount DECIMAL(18,2) NULL;
    IF COL_LENGTH('dbo.Tbl_Registration', 'PackageGST') IS NULL
      ALTER TABLE dbo.Tbl_Registration ADD PackageGST DECIMAL(18,2) NULL;
  `);
}

async function findExistingUserByMobile(mobile) {
  const registrationQuery = `
    SET NOCOUNT ON;
    SELECT
      Id AS registrationId,
      CoordinatorId,
      STDNAME,
      FNAME,
      STDPH2,
      EMAIL,
      STDSTATE,
      STDADD3,
      STDADD1,
      STDADD2,
      ZIP,
      SCHOOLNAME,
      SCPHONE,
      SCADD1,
      SCADD2,
      SCSTATE,
      SCZIP,
      SCPrincipal,
      Board,
      InfoSource,
      CLASS,
      COALESCE(NULLIF(Separatepackages, ''), Packagesbought) AS examName,
      Packagesbought,
      BMALSOP,
      CGSTOP,
      SGSTOP,
      IGSTOP,
      Examfee,
      SGST,
      CGST,
      IGST,
      Status,
      Amount,
      FullAmount,
      transdate AS paymentDate,
      COALESCE(NULLIF(transid, ''), NULLIF(ReferenceNumber, ''), InvoiceNo, '') AS registrationCode,
      ReferenceNumber,
      transid,
      InvoiceNo,
      Message,
      CENTERNAME,
      OnlinePackageMRP,
      OnlinePackageDiscount,
      ComboOfferDiscount,
      PackageGST
    FROM dbo.Tbl_Registration
    WHERE RIGHT(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(STDPH2, '+91', ''), ' ', ''), '-', ''), '(', ''), ')', ''), 10) = ${sqlString(mobile)}
    ORDER BY Id DESC
    FOR JSON PATH;
  `;

  const registrations = parseJsonResult(await runSql(registrationQuery));
  if (Array.isArray(registrations) && registrations.length > 0) {
    return { source: "registration", rows: registrations };
  }

  const draftQuery = `
    SET NOCOUNT ON;
    SELECT TOP 1
      StudentName,
      ParentsName,
      MobileNo,
      EmailId,
      Class
    FROM dbo.Tbl_UnsubmittedRegistrations
    WHERE MobileNo = ${sqlString(mobile)}
    ORDER BY Id DESC
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
  `;

  const draft = parseJsonResult(await runSql(draftQuery));
  if (draft) {
    return { source: "draft", row: draft };
  }

  return null;
}

async function saveRegistrationBatch({ selectedClass, cart, formData, totalAmount, totalOriginalAmount, rows }) {
  const packageString = rows
    .map((row) => row.Separatepackages)
    .join(",");

  const rowQueries = rows
    .map(
      (row) => `
        INSERT INTO dbo.Tbl_Registration (
          CoordinatorId, BMALSOP, CGSTOP, SGSTOP, IGSTOP, Examfee, SGST, CGST, IGST, ZIP,
          STDSTATE, STDADD1, STDADD2, STDADD3, STDNAME, FNAME, STDPH2, CLASS, EMAIL, SCHOOLNAME,
          SCADD1, SCADD2, SCSTATE, SCZIP, SCPHONE, Status, ReferenceNumber, transid, Amount, FullAmount, transdate,
          Message, Board, InfoSource, Packagesbought, CENTERNAME, Separatepackages, SCPrincipal,
          OnlinePackageMRP, OnlinePackageDiscount, ComboOfferDiscount, PackageGST
        )
        VALUES (
          ${sqlString(row.CoordinatorId)},
          ${sqlNumber(row.BMALSOP)},
          ${sqlNullableNumber(row.CGSTOP)},
          ${sqlNullableNumber(row.SGSTOP)},
          ${sqlNullableNumber(row.IGSTOP)},
          ${sqlNumber(row.Examfee)},
          ${sqlNumber(row.SGST)},
          ${sqlNumber(row.CGST)},
          ${sqlNumber(row.IGST)},
          ${sqlNullableString(row.ZIP)},
          ${sqlNullableString(row.STDSTATE)},
          ${sqlNullableString(row.STDADD1)},
          ${sqlNullableString(row.STDADD2)},
          ${sqlNullableString(row.STDADD3)},
          ${sqlNullableString(row.STDNAME)},
          ${sqlNullableString(row.FNAME)},
          ${sqlNullableString(row.STDPH2)},
          ${sqlNullableString(row.CLASS)},
          ${sqlNullableString(row.EMAIL)},
          ${sqlNullableString(row.SCHOOLNAME)},
          ${sqlNullableString(row.SCADD1)},
          ${sqlNullableString(row.SCADD2)},
          ${sqlNullableString(row.SCSTATE)},
          ${sqlNullableString(row.SCZIP)},
          ${sqlNullableString(row.SCPHONE)},
          ${sqlNullableString(row.Status)},
          N'',
          N'',
          ${sqlNumber(row.Amount)},
          ${sqlNumber(row.FullAmount)},
          GETDATE(),
          ${sqlNullableString(row.Message)},
          ${sqlNullableString(row.Board)},
          ${sqlNullableString(row.InfoSource)},
          ${sqlNullableString(packageString)},
          ${sqlNullableString(row.CENTERNAME)},
          ${sqlNullableString(row.Separatepackages)},
          ${sqlNullableString(row.SCPrincipal)},
          ${sqlNullableNumber(row.OnlinePackageMRP)},
          ${sqlNullableNumber(row.OnlinePackageDiscount)},
          ${sqlNumber(row.ComboOfferDiscount)},
          ${sqlNullableNumber(row.PackageGST)}
        );
        SET @CurrentId = SCOPE_IDENTITY();
        IF @GroupId IS NULL
        BEGIN
          SET @GroupId = @CurrentId;
        END;
        UPDATE dbo.Tbl_Registration
        SET
          transid = @ReferenceCode
        WHERE Id = @CurrentId;
      `
    )
    .join("\n");

  const query = `
    SET NOCOUNT ON;
    BEGIN TRY
      BEGIN TRANSACTION;

      DELETE FROM dbo.Tbl_UnsubmittedRegistrations
      WHERE EmailId = ${sqlString(formData.email)};

      INSERT INTO dbo.Tbl_UnsubmittedRegistrations
        (Class, Amount, StudentName, ParentsName, MobileNo, EmailId, CreatedOn, UserStatus)
      VALUES
        (
          ${sqlString(selectedClass)},
          ${sqlNumber(totalAmount)},
          ${sqlString(formData.studentName)},
          ${sqlString(formData.parentName)},
          ${sqlString(formData.mobile)},
          ${sqlString(formData.email)},
          GETDATE(),
          1
        );

      DECLARE @GroupId INT = NULL;
      DECLARE @CurrentId INT = NULL;
      DECLARE @InvoiceNo NVARCHAR(100) = NULL;
      DECLARE @ReferenceCode NVARCHAR(100) = NULL;
      DECLARE @ReferencePrefix NVARCHAR(4) =
        SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', (ABS(CHECKSUM(NEWID())) % 36) + 1, 1) +
        SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', (ABS(CHECKSUM(NEWID())) % 36) + 1, 1) +
        SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', (ABS(CHECKSUM(NEWID())) % 36) + 1, 1) +
        SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', (ABS(CHECKSUM(NEWID())) % 36) + 1, 1);
      DECLARE @LastReferenceNo INT = (
        SELECT ISNULL(MAX(CAST(RIGHT(transid, 6) AS INT)), 460174)
        FROM dbo.Tbl_Registration WITH (UPDLOCK, HOLDLOCK)
        WHERE transid LIKE '[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9]-[0-9][0-9][0-9][0-9][0-9][0-9]'
      );
      SET @ReferenceCode = CONCAT(@ReferencePrefix, '-', @LastReferenceNo + 1);

      ${rowQueries}

      COMMIT TRANSACTION;

      DECLARE @SavedReferenceNumber NVARCHAR(100) = (
        SELECT TOP 1 transid
        FROM dbo.Tbl_Registration
        WHERE Id = @GroupId
      );

      DECLARE @SavedTransactionId NVARCHAR(100) = (
        SELECT TOP 1 ReferenceNumber
        FROM dbo.Tbl_Registration
        WHERE Id = @GroupId
      );

      SELECT
        COALESCE(NULLIF(@SavedReferenceNumber, ''), @ReferenceCode, N'') AS registrationCode,
        COALESCE(NULLIF(@SavedReferenceNumber, ''), @ReferenceCode, N'') AS referenceNumber,
        COALESCE(NULLIF(@SavedTransactionId, ''), N'') AS transactionId,
        ${sqlNumber(totalAmount)} AS amount,
        ${sqlNumber(totalOriginalAmount)} AS fullAmount
      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
    END TRY
    BEGIN CATCH
      IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
      THROW;
    END CATCH;
  `;

  return parseJsonResult(await runSql(query));
}

async function getRegistrationByCode(registrationCode) {
  const query = `
    SET NOCOUNT ON;
    SELECT TOP 1
      COALESCE(NULLIF(transid, ''), ReferenceNumber) AS registrationCode,
      InvoiceNo,
      ReferenceNumber AS transactionId,
      Amount AS amount,
      FullAmount AS fullAmount,
      STDNAME AS studentName,
      FNAME AS parentName,
      STDPH2 AS mobile,
      EMAIL AS email,
      CLASS AS className,
      Packagesbought AS packagesBought,
      Status,
      Message
    FROM dbo.Tbl_Registration
    WHERE
      transid = ${sqlString(registrationCode)}
      OR ReferenceNumber = ${sqlString(registrationCode)}
      OR InvoiceNo = ${sqlString(registrationCode)}
      OR COALESCE(NULLIF(transid, ''), ReferenceNumber) = ${sqlString(registrationCode)}
    ORDER BY Id DESC
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
  `;

  return parseJsonResult(await runSql(query));
}

async function listAdminRegistrations({
  page = 1,
  pageSize = 10,
  search = "",
  dateFrom = "",
  dateTo = "",
  status = "",
  packageName = "",
  individualFields = false,
  registrationType = "",
} = {}) {
  const parsedPage = Number(page);
  const parsedPageSize = Number(pageSize);
  const normalizedPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const normalizedPageSize = Number.isInteger(parsedPageSize) && parsedPageSize > 0
    ? Math.min(parsedPageSize, 100)
    : 10;
  const offset = (normalizedPage - 1) * normalizedPageSize;
  const searchTerm = String(search || "").trim().slice(0, 200);
  const searchedId = /^\d+$/.test(searchTerm) && Number(searchTerm) <= 2147483647
    ? Number(searchTerm)
    : null;
  const validDateFrom = /^\d{4}-\d{2}-\d{2}$/.test(String(dateFrom || "")) ? dateFrom : "";
  const validDateTo = /^\d{4}-\d{2}-\d{2}$/.test(String(dateTo || "")) ? dateTo : "";
  const allowedStatuses = new Set(["Pending", "Success", "Failure"]);
  const allowedPackages = new Set(["NSTSE", "UCO", "UIEO", "UIMO", "UIGKO", "UMO"]);
  const whereConditions = [];

  if (searchTerm) {
    whereConditions.push(`(
      ${searchedId === null ? "1 = 0" : `Id = ${searchedId}`} OR
      STDNAME LIKE ${sqlString(`%${searchTerm}%`)} OR
      FNAME LIKE ${sqlString(`%${searchTerm}%`)} OR
      STDPH2 LIKE ${sqlString(`%${searchTerm}%`)} OR
      EMAIL LIKE ${sqlString(`%${searchTerm}%`)} OR
      SCHOOLNAME LIKE ${sqlString(`%${searchTerm}%`)} OR
      COALESCE(NULLIF(Separatepackages, ''), Packagesbought) LIKE ${sqlString(`%${searchTerm}%`)} OR
      COALESCE(NULLIF(transid, ''), ReferenceNumber) LIKE ${sqlString(`%${searchTerm}%`)}
    )`);
  }
  if (validDateFrom) {
    whereConditions.push(`transdate >= CONVERT(date, ${sqlString(validDateFrom)}, 23)`);
  }
  if (validDateTo) {
    whereConditions.push(`transdate < DATEADD(day, 1, CONVERT(date, ${sqlString(validDateTo)}, 23))`);
  }
  if (allowedStatuses.has(status)) {
    whereConditions.push(`Status = ${sqlString(status)}`);
  }
  if (allowedPackages.has(packageName)) {
    whereConditions.push(`COALESCE(NULLIF(Separatepackages, ''), Packagesbought) LIKE ${sqlString(`%${packageName}%`)}`);
  }
  if (registrationType === "INDIAN") {
    whereConditions.push(`RegistrationType = ${sqlString(registrationType)}`);
  }
  const whereClause = whereConditions.length ? `WHERE ${whereConditions.join(" AND ")}` : "";
  const countResult = parseJsonResult(await runSql(`
    SET NOCOUNT ON;
    SELECT COUNT(*) AS total
    FROM dbo.Tbl_Registration
    ${whereClause}
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
  `));
  const total = Number(countResult?.total || 0);
  const selectFields = individualFields
    ? `
      id AS id,
      transid AS registrationCode,
      STDNAME AS StudentName,
      FNAME AS FatherName,
      CLASS AS Class,
      SCHOOLNAME AS SchoolName,
      STDPH2 AS Mobile,
      EMAIL AS Email,
      COALESCE(NULLIF(transid, ''), ReferenceNumber) AS Number,
      transdate AS TransDate,
      Status,
      COALESCE(NULLIF(Separatepackages, ''), Packagesbought) AS Packages,
      STDSTATE AS State,
      Amount,
      Examfee,
      SGST,
      CGST,
      IGST,
      BMALSOP,
      CGSTOP,
      SGSTOP,
      IGSTOP,
      PackageGST
    `
    : `
      Id,
      CoordinatorId AS USRN,
      STDNAME AS StudentName,
      CLASS AS Class,
      STDPH2 AS Phone,
      EMAIL AS Email,
      transid AS registrationCode,
      COALESCE(NULLIF(transid, ''), ReferenceNumber) AS TransactionId,
      transdate AS TransDate,
      Status,
      COALESCE(NULLIF(Separatepackages, ''), Packagesbought) AS Packages,
      FNAME AS FathersName,
      SCHOOLNAME AS SchoolName,
      STDSTATE AS State,
      Amount,
      Examfee,
      SGST,
      CGST,
      IGST,
      BMALSOP,
      CGSTOP,
      SGSTOP,
      IGSTOP,
      PackageGST
    `;
  const rows = parseJsonResult(await runSql(`
    SET NOCOUNT ON;
    SELECT ${selectFields}
    FROM dbo.Tbl_Registration
    ${whereClause}
    ORDER BY transdate DESC, Id DESC
    OFFSET ${offset} ROWS FETCH NEXT ${normalizedPageSize} ROWS ONLY
    FOR JSON PATH${individualFields ? ", INCLUDE_NULL_VALUES" : ""};
  `));

  return {
    rows: Array.isArray(rows) ? rows : [],
    pagination: {
      page: normalizedPage,
      pageSize: normalizedPageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / normalizedPageSize)),
    },
  };
}

async function listAdminIndividualStudents({
  page = 1,
  pageSize = 10,
  search = "",
  dateFrom = "",
  dateTo = "",
  status = "",
  packageName = "",
} = {}) {
  return listAdminRegistrations({
    page,
    pageSize,
    search,
    dateFrom,
    dateTo,
    status,
    packageName,
    individualFields: true,
  });
}

async function getRegistrationInvoiceData(registrationCode) {
  const query = `
    SET NOCOUNT ON;
    SELECT
      COALESCE(NULLIF(transid, ''), ReferenceNumber) AS registrationCode,
      InvoiceNo,
      ReferenceNumber,
      transid,
      ReferenceNumber AS transactionId,
      Amount AS amount,
      FullAmount AS fullAmount,
      STDNAME AS studentName,
      FNAME AS parentName,
      STDPH2 AS mobile,
      EMAIL AS email,
      CLASS AS className,
      Packagesbought AS packagesBought,
      ZIP,
      STDSTATE,
      STDADD1,
      STDADD2,
      STDADD3,
      transdate,
      Status,
      Message,
      Separatepackages,
      BMALSOP,
      OnlinePackageMRP,
      OnlinePackageDiscount,
      ComboOfferDiscount,
      PackageGST,
      CGSTOP,
      SGSTOP,
      IGSTOP,
      Examfee,
      SGST,
      CGST,
      IGST
    FROM dbo.Tbl_Registration
    WHERE
      transid = ${sqlString(registrationCode)}
      OR ReferenceNumber = ${sqlString(registrationCode)}
      OR InvoiceNo = ${sqlString(registrationCode)}
      OR COALESCE(NULLIF(transid, ''), ReferenceNumber) = ${sqlString(registrationCode)}
    ORDER BY Id ASC
    FOR JSON PATH;
  `;

  const rows = parseJsonResult(await runSql(query));
  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  return rows;
}

async function updateRegistrationPaymentStatus({
  registrationCode,
  status,
  message,
  userStatus,
  transactionId,
  unsubmittedRegistrationId,
}) {
  const statusMessage = getMessageFromStatus(status, message);
  const unsubmittedRegistrationIdValue = Number(unsubmittedRegistrationId);
  const updateDraftWhere = Number.isSafeInteger(unsubmittedRegistrationIdValue) && unsubmittedRegistrationIdValue > 0
    ? `Id = ${unsubmittedRegistrationIdValue}`
    : `EmailId IN (
        SELECT DISTINCT EMAIL
        FROM dbo.Tbl_Registration
        WHERE
          transid = ${sqlString(registrationCode)}
          OR ReferenceNumber = ${sqlString(registrationCode)}
          OR InvoiceNo = ${sqlString(registrationCode)}
          OR COALESCE(NULLIF(transid, ''), ReferenceNumber) = ${sqlString(registrationCode)}
      )`;
  const query = `
    SET NOCOUNT ON;
    BEGIN TRY
      BEGIN TRANSACTION;

      DECLARE @ResolvedReferenceNumber NVARCHAR(100) = (
        SELECT TOP 1 COALESCE(NULLIF(transid, ''), ReferenceNumber)
        FROM dbo.Tbl_Registration
        WHERE
          transid = ${sqlString(registrationCode)}
          OR ReferenceNumber = ${sqlString(registrationCode)}
          OR InvoiceNo = ${sqlString(registrationCode)}
          OR COALESCE(NULLIF(transid, ''), ReferenceNumber) = ${sqlString(registrationCode)}
        ORDER BY Id ASC
      );

      DECLARE @GeneratedInvoiceNo NVARCHAR(100) = NULL;
      DECLARE @GeneratedReferenceNumber NVARCHAR(100) = @ResolvedReferenceNumber;

      IF ${sqlString(status)} = 'Success'
      BEGIN
        IF @GeneratedReferenceNumber IS NULL
          OR @GeneratedReferenceNumber = ''
          OR @GeneratedReferenceNumber NOT LIKE '[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9]-[0-9][0-9][0-9][0-9][0-9][0-9]'
        BEGIN
          DECLARE @SuccessReferencePrefix NVARCHAR(4) =
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', (ABS(CHECKSUM(NEWID())) % 36) + 1, 1) +
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', (ABS(CHECKSUM(NEWID())) % 36) + 1, 1) +
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', (ABS(CHECKSUM(NEWID())) % 36) + 1, 1) +
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', (ABS(CHECKSUM(NEWID())) % 36) + 1, 1);

          DECLARE @LastReferenceNoOnSuccess INT = (
            SELECT ISNULL(MAX(CAST(RIGHT(transid, 6) AS INT)), 460174)
            FROM dbo.Tbl_Registration WITH (UPDLOCK, HOLDLOCK)
            WHERE transid LIKE '[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9]-[0-9][0-9][0-9][0-9][0-9][0-9]'
          );

          SET @GeneratedReferenceNumber = CONCAT(@SuccessReferencePrefix, '-', @LastReferenceNoOnSuccess + 1);
        END

        DECLARE @ExistingInvoiceNo NVARCHAR(100) = (
          SELECT TOP 1 InvoiceNo
          FROM dbo.Tbl_Registration
          WHERE COALESCE(NULLIF(transid, ''), ReferenceNumber) = @ResolvedReferenceNumber
            AND NULLIF(InvoiceNo, '') IS NOT NULL
          ORDER BY Id ASC
        );

        IF @ExistingInvoiceNo IS NOT NULL
        BEGIN
          SET @GeneratedInvoiceNo = @ExistingInvoiceNo;
        END
        ELSE
        BEGIN
          DECLARE @LastInvoiceNo INT = (
            SELECT ISNULL(
              MAX(
                CASE
                  WHEN TRY_CAST(PARSENAME(REPLACE(InvoiceNo, '-', '.'), 1) AS INT) >= 100000
                    THEN TRY_CAST(PARSENAME(REPLACE(InvoiceNo, '-', '.'), 1) AS INT) - 100000
                  ELSE TRY_CAST(PARSENAME(REPLACE(InvoiceNo, '-', '.'), 1) AS INT)
                END
              ),
              350
            )
            FROM dbo.Tbl_Registration WITH (UPDLOCK, HOLDLOCK)
            WHERE Status = 'Success'
              AND InvoiceNo LIKE 'UCOIND-%'
          );

          SET @GeneratedInvoiceNo = CONCAT('UCOIND-', @LastInvoiceNo + 1);
        END
      END

      UPDATE dbo.Tbl_Registration
      SET
        Status = ${sqlString(status)},
        Message = ${sqlString(statusMessage.slice(0, 100))},
        transdate = GETDATE(),
        ReferenceNumber = CASE
          WHEN ${sqlNullableString(transactionId || null)} IS NOT NULL AND ${sqlNullableString(transactionId || null)} <> ''
            THEN ${sqlNullableString(transactionId || null)}
          ELSE ReferenceNumber
        END,
        transid = CASE
          WHEN ${sqlString(status)} = 'Success' AND @GeneratedReferenceNumber IS NOT NULL AND @GeneratedReferenceNumber <> ''
            THEN @GeneratedReferenceNumber
          ELSE transid
        END,
        InvoiceNo = CASE
          WHEN ${sqlString(status)} = 'Success' AND @GeneratedInvoiceNo IS NOT NULL
            THEN @GeneratedInvoiceNo
          ELSE InvoiceNo
        END
      WHERE
        transid = ${sqlString(registrationCode)}
        OR ReferenceNumber = ${sqlString(registrationCode)}
        OR InvoiceNo = ${sqlString(registrationCode)}
        OR COALESCE(NULLIF(transid, ''), ReferenceNumber) = ${sqlString(registrationCode)};

      UPDATE dbo.Tbl_UnsubmittedRegistrations
      SET UserStatus = ${Number.isFinite(Number(userStatus)) ? Number(userStatus) : 1}
      WHERE ${updateDraftWhere};

      COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
      IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
      THROW;
    END CATCH;
  `;

  await runSql(query);
}

async function closeAdminUnsubmittedRegistration({ registrationId }) {
  const id = Number(registrationId);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("A valid unsubmitted registration ID is required.");
  }

  const draft = parseJsonResult(await runSql(`
    SET NOCOUNT ON;
    SELECT Id, Class, StudentName, ParentsName, MobileNo, EmailId, UserStatus
    FROM dbo.Tbl_UnsubmittedRegistrations
    WHERE Id = ${id}
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES;
  `));
  if (!draft) {
    return null;
  }
  if (String(draft.UserStatus) !== "1") {
    throw new Error("This draft is no longer open for registration.");
  }

  const requiredMatchConditions = [
    ["EmailId", draft.EmailId, "EMAIL"],
    ["MobileNo", draft.MobileNo, "STDPH2"],
    ["StudentName", draft.StudentName, "STDNAME"],
    ["Class", draft.Class, "CLASS"],
  ];
  if (requiredMatchConditions.some(([, value]) => !String(value ?? "").trim())) {
    throw new Error("This draft does not have enough details to find its existing registration.");
  }
  const matchConditions = [
    ...requiredMatchConditions,
    ...(String(draft.ParentsName ?? "").trim() ? [["ParentsName", draft.ParentsName, "FNAME"]] : []),
  ];
  const matchingRegistrationConditions = matchConditions.map(([draftField, value, registrationField]) => (
    `LTRIM(RTRIM(COALESCE(${registrationField}, ''))) = ${sqlString(String(value).trim())}`
  ));
  const matches = parseJsonResult(await runSql(`
    SET NOCOUNT ON;
    SELECT DISTINCT transid AS registrationCode
    FROM dbo.Tbl_Registration
    WHERE Status = N'Pending'
      AND NULLIF(LTRIM(RTRIM(transid)), '') IS NOT NULL
      AND ${matchingRegistrationConditions.join("\n      AND ")}
    FOR JSON PATH;
  `));

  if (!Array.isArray(matches) || matches.length === 0) {
    throw new Error("No pending registered record matches this draft. The draft was not changed.");
  }
  if (matches.length > 1) {
    throw new Error("More than one pending registered record matches this draft. Review the registered data before closing it.");
  }

  await updateRegistrationPaymentStatus({
    registrationCode: matches[0].registrationCode,
    status: "Success",
    message: "Successful",
    userStatus: 2,
    unsubmittedRegistrationId: id,
  });

  return { registrationCode: matches[0].registrationCode };
}

async function markRegistrationRowSuccess({ registrationId, registrationCode }) {
  const id = Number(registrationId);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("A valid registrationId is required.");
  }

  const rows = parseJsonResult(await runSql(`
    SET NOCOUNT ON;
    DECLARE @UpdatedRegistration TABLE (
      Id BIGINT,
      transid NVARCHAR(100),
      Status NVARCHAR(50),
      Message NVARCHAR(100),
      transdate DATETIME
    );
    UPDATE dbo.Tbl_Registration
    SET
      Status = N'Success',
      Message = N'Successful',
      transdate = GETDATE()
    OUTPUT
      INSERTED.Id,
      INSERTED.transid,
      INSERTED.Status,
      INSERTED.Message,
      INSERTED.transdate
    INTO @UpdatedRegistration
    WHERE Id = ${id}
      AND transid = ${sqlString(registrationCode)}
      AND Status = N'Pending';
    SELECT Id, transid, Status, Message, transdate
    FROM @UpdatedRegistration
    FOR JSON PATH;
  `));

  return Array.isArray(rows) ? rows[0] || null : null;
}

module.exports = {
  initializeTables,
  findExistingUserByMobile,
  saveRegistrationBatch,
  listAdminRegistrations,
  listAdminIndividualStudents,
  getRegistrationByCode,
  getRegistrationInvoiceData,
  updateRegistrationPaymentStatus,
  closeAdminUnsubmittedRegistration,
  markRegistrationRowSuccess,
};
