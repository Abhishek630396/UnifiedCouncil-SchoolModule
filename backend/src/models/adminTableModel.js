const { runSql, sqlString } = require("../config/db");

const ADMIN_TABLES = {
  documents: "Tbl_ClassDoc",
  "create-tests": "Tbl_Tests",
  feedbacks: "Tbl_KeyFeedBack",
  "class-documents": "Tbl_Classdocforschool",
  "coordinators-list": "Tbl_Coordinators",
  "unsubmitted-registration": "Tbl_UnsubmittedRegistrations",
  "qr-users": "Tbl_M_Users",
};
const ADMIN_TABLE_DATE_COLUMNS = {
  documents: "CreatedOn",
  "create-tests": "CreatedOn",
  feedbacks: "CreatedOn",
  "class-documents": "CreatedOn",
  "unsubmitted-registration": "CreatedOn",
};
const FEEDBACK_COLUMNS = [
  "KF_Id",
  "Name",
  "EmailId",
  "ContactNumber",
  "Test_Id",
  "Class",
  "Question_No",
  "Given_Answers",
  "Correct_Answers",
  "Description",
  "CreatedOn",
  "Status",
];
const PRIMARY_KEY_ORDER_TABLES = new Set(["documents", "create-tests", "class-documents"]);
const ADMIN_MUTABLE_TABLES = new Set(["documents", "class-documents", "coordinators-list"]);
const DOCUMENT_EDITABLE_COLUMNS = new Set([
  "title",
  "description",
  "examtype",
  "file1",
  "file2",
  "file3",
  "file4",
  "file5",
  "isactive",
]);

function quoteIdentifier(value) {
  return `[${String(value).replace(/]/g, "]]")}]`;
}

function parseJsonResult(output) {
  const normalizedOutput = String(output || "")
    .replace(/^\uFEFF/, "")
    .replace(/[\r\n]+/g, "")
    .trim();
  const objectStart = normalizedOutput.indexOf("{");
  const arrayStart = normalizedOutput.indexOf("[");
  const startIndex = objectStart === -1
    ? arrayStart
    : arrayStart === -1
      ? objectStart
      : Math.min(objectStart, arrayStart);
  if (startIndex === -1) return null;
  const rootToken = normalizedOutput[startIndex];

  const delimiters = [];
  const jsonCharacters = [];
  let inString = false;
  let isEscaped = false;

  for (let index = startIndex; index < normalizedOutput.length; index += 1) {
    const character = normalizedOutput[index];

    if (inString) {
      if (character.charCodeAt(0) <= 0x1f) {
        if (isEscaped) {
          jsonCharacters.push("\\");
          isEscaped = false;
        }
        jsonCharacters.push(`\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`);
        continue;
      }

      if (isEscaped) {
        jsonCharacters.push(character);
        isEscaped = false;
      } else if (character === "\\") {
        jsonCharacters.push(character);
        isEscaped = true;
      } else if (character === "\"") {
        jsonCharacters.push(character);
        inString = false;
      } else {
        jsonCharacters.push(character);
      }
      continue;
    }

    jsonCharacters.push(character);
    if (character === "\"") {
      inString = true;
    } else if (character === "{" || character === "[") {
      delimiters.push(character);
    } else if (character === "}" || character === "]") {
      delimiters.pop();
      if (delimiters.length === 0 && character === (rootToken === "{" ? "}" : "]")) {
        return JSON.parse(jsonCharacters.join(""));
      }
    }
  }

  throw new Error("The database returned incomplete JSON while loading admin table data.");
}

async function listAdminTableData(tableKey, {
  page = 1,
  pageSize = 50,
  statusFilter = "all",
  dateFrom = "",
  dateTo = "",
  search = "",
} = {}) {
  const tableName = ADMIN_TABLES[tableKey];
  if (!tableName) {
    throw new Error("The requested admin table is not available.");
  }
  const schema = await getTableSchema(tableName);
  const schemaByName = new Map(schema.map((column) => [column.name.toLowerCase(), column]));
  const orderByPrimaryKey = PRIMARY_KEY_ORDER_TABLES.has(tableKey);
  if (tableKey === "create-tests" && !["all", "active", "inactive"].includes(statusFilter)) {
    throw new Error("Test status filter must be all, active, or inactive.");
  }
  if (tableKey === "unsubmitted-registration" && !["all", "close", "registered", "not-open"].includes(statusFilter)) {
    throw new Error("Unsubmitted registration status filter must be all, close, registered, or not-open.");
  }
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

  const parsedPage = Number(page);
  const parsedPageSize = Number(pageSize);
  const normalizedPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const normalizedPageSize = Number.isInteger(parsedPageSize) && parsedPageSize > 0
    ? Math.min(parsedPageSize, 100)
    : 50;
  const offset = (normalizedPage - 1) * normalizedPageSize;
  const filteredTestStatus = statusFilter === "active" ? 1 : statusFilter === "inactive" ? 0 : null;
  const testStatusWhere = filteredTestStatus === 1
    ? "[Status] = 1"
    : filteredTestStatus === 0
      ? "ISNULL([Status], 0) <> 1"
      : "";
  const unsubmittedStatusWhere = statusFilter === "close"
    ? "[UserStatus] = 1"
    : statusFilter === "registered"
      ? "[UserStatus] = 2"
      : statusFilter === "not-open"
        ? "ISNULL([UserStatus], 0) NOT IN (1, 2)"
        : "";
  const dateColumn = ADMIN_TABLE_DATE_COLUMNS[tableKey]
    ? schemaByName.get(ADMIN_TABLE_DATE_COLUMNS[tableKey].toLowerCase())?.name || null
    : tableKey === "coordinators-list"
      ? (
        ["createdon", "createdat", "updatedon", "updatedat"]
          .map((name) => schemaByName.get(name))
          .find((column) => column && ["date", "datetime", "datetime2", "smalldatetime", "datetimeoffset"].includes(column.dataType.toLowerCase()))
        || schema.find((column) => ["date", "datetime", "datetime2", "smalldatetime", "datetimeoffset"].includes(column.dataType.toLowerCase()))
      )?.name || null
      : null;
  if ((validDateFrom || validDateTo) && !dateColumn) {
    throw new Error("Date filtering is not available for this admin table.");
  }
  const dateConditions = [
    ...(validDateFrom ? [`${quoteIdentifier(dateColumn)} >= CONVERT(date, ${sqlString(validDateFrom).replace(/'/g, "''")}, 23)`] : []),
    ...(validDateTo ? [`${quoteIdentifier(dateColumn)} < DATEADD(day, 1, CONVERT(date, ${sqlString(validDateTo).replace(/'/g, "''")}, 23))`] : []),
  ];
  const orderByDateColumn = ADMIN_TABLE_DATE_COLUMNS[tableKey] ? dateColumn : null;
  const normalizedSearch = String(search || "").trim().slice(0, 200);
  const searchableColumns = schema.filter((column) => (
    !(tableKey === "qr-users"
      ? /(password|passcode|pwd|secret|token|otp|credential|salt|hash)/i
      : /password/i).test(column.name)
    && !["timestamp", "rowversion", "binary", "varbinary", "image"].includes(column.dataType.toLowerCase())
  ));
  const searchPattern = normalizedSearch
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_")
    .replace(/\[/g, "\\[");
  const searchConditions = normalizedSearch
    ? [`(${searchableColumns.map((column) => (
      `CONVERT(NVARCHAR(MAX), ${quoteIdentifier(column.name)}) LIKE ${sqlString(`%${searchPattern}%`)} ESCAPE '\\'`
    )).join(" OR ") || "1 = 0"})`]
    : [];
  const unsubmittedCountConditions = [...dateConditions, ...searchConditions];
  const unsubmittedCountWhere = unsubmittedCountConditions.length
    ? `WHERE ${unsubmittedCountConditions.join(" AND ")}`
    : "";
  const rowConditions = [
    ...(testStatusWhere ? [testStatusWhere] : []),
    ...(tableKey === "unsubmitted-registration" && unsubmittedStatusWhere ? [unsubmittedStatusWhere] : []),
    ...dateConditions,
    ...searchConditions,
  ];
  const rowsWhere = rowConditions.length ? `WHERE ${rowConditions.join(" AND ")}` : "";
  const rowsFrom = `FROM dbo.${tableName} ${rowsWhere}`;
  const totalQuery = `(SELECT COUNT_BIG(*) FROM dbo.${tableName} ${rowsWhere})`;
  const feedbackColumnFilter = FEEDBACK_COLUMNS
    .map((column) => `columnInfo.name = ${sqlString(column)}`)
    .join(" OR ");
  const feedbackColumnOrder = FEEDBACK_COLUMNS
    .map((column, index) => `WHEN ${sqlString(column)} THEN ${index}`)
    .join(" ");
  const dynamicFeedbackColumnFilter = feedbackColumnFilter.replace(/'/g, "''");
  const dynamicFeedbackColumnOrder = feedbackColumnOrder.replace(/'/g, "''");
  const dateFilteredTestWhere = dateConditions.length ? `WHERE ${dateConditions.join(" AND ")}` : "";
  const testStatusCounts = tableKey === "create-tests"
    ? `JSON_QUERY((
          SELECT
            (SELECT COUNT_BIG(*) FROM dbo.Tbl_Tests ${dateFilteredTestWhere ? `${dateFilteredTestWhere} AND [Status] = 1` : "WHERE [Status] = 1"}) AS [active],
            (SELECT COUNT_BIG(*) FROM dbo.Tbl_Tests ${dateFilteredTestWhere ? `${dateFilteredTestWhere} AND ISNULL([Status], 0) <> 1` : "WHERE ISNULL([Status], 0) <> 1"}) AS [inactive]
          FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        )) AS [statusCounts],`
    : "";
  const unsubmittedStatusCounts = tableKey === "unsubmitted-registration"
    ? `JSON_QUERY((
          SELECT
            (SELECT COUNT_BIG(*) FROM dbo.Tbl_UnsubmittedRegistrations ${unsubmittedCountWhere}) AS [all],
            (SELECT COUNT_BIG(*) FROM dbo.Tbl_UnsubmittedRegistrations ${unsubmittedCountWhere ? `${unsubmittedCountWhere} AND [UserStatus] = 1` : "WHERE [UserStatus] = 1"}) AS [close],
            (SELECT COUNT_BIG(*) FROM dbo.Tbl_UnsubmittedRegistrations ${unsubmittedCountWhere ? `${unsubmittedCountWhere} AND [UserStatus] = 2` : "WHERE [UserStatus] = 2"}) AS [registered],
            (SELECT COUNT_BIG(*) FROM dbo.Tbl_UnsubmittedRegistrations ${unsubmittedCountWhere ? `${unsubmittedCountWhere} AND ISNULL([UserStatus], 0) NOT IN (1, 2)` : "WHERE ISNULL([UserStatus], 0) NOT IN (1, 2)"}) AS [notOpen]
          FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        )) AS [statusCounts],`
    : "";
  const rowColumnProjection = tableKey === "feedbacks"
    ? `DECLARE @rowColumns NVARCHAR(MAX);
    SELECT @rowColumns = STUFF((
      SELECT N', ' + CASE
        WHEN columnInfo.system_type_id IN (35, 99, 167, 175, 231, 239) THEN
          N'TRANSLATE(CONVERT(NVARCHAR(MAX), ' + QUOTENAME(columnInfo.name)
          + N'), NCHAR(1)+NCHAR(2)+NCHAR(3)+NCHAR(4)+NCHAR(5)+NCHAR(6)+NCHAR(7)+NCHAR(8)+NCHAR(9)+NCHAR(10)+NCHAR(11)+NCHAR(12)+NCHAR(13)+NCHAR(14)+NCHAR(15)+NCHAR(16)+NCHAR(17)+NCHAR(18)+NCHAR(19)+NCHAR(20)+NCHAR(21)+NCHAR(22)+NCHAR(23)+NCHAR(24)+NCHAR(25)+NCHAR(26)+NCHAR(27)+NCHAR(28)+NCHAR(29)+NCHAR(30)+NCHAR(31), REPLICATE(N'' '', 31)) AS '
          + QUOTENAME(columnInfo.name)
        ELSE QUOTENAME(columnInfo.name)
      END
      FROM sys.columns AS columnInfo
      WHERE columnInfo.object_id = @objectId
        AND (${feedbackColumnFilter})
      ORDER BY CASE columnInfo.name ${feedbackColumnOrder} END
      FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 2, '');`
    : "DECLARE @rowColumns NVARCHAR(MAX) = N'*';";

  const query = `
    SET QUOTED_IDENTIFIER ON;
    SET NOCOUNT ON;
    DECLARE @objectId INT = OBJECT_ID(N'dbo.${tableName}', N'U');
    IF @objectId IS NULL
      THROW 50001, 'The requested admin table does not exist in the configured database.', 1;

    DECLARE @orderBy NVARCHAR(MAX);
    SELECT @orderBy = STUFF((
      SELECT N', ' + QUOTENAME(columnInfo.name)
      FROM sys.indexes AS indexInfo
      INNER JOIN sys.index_columns AS indexColumn
        ON indexColumn.object_id = indexInfo.object_id
        AND indexColumn.index_id = indexInfo.index_id
      INNER JOIN sys.columns AS columnInfo
        ON columnInfo.object_id = indexColumn.object_id
        AND columnInfo.column_id = indexColumn.column_id
      WHERE indexInfo.object_id = @objectId
        AND indexInfo.is_primary_key = 1
      ORDER BY indexColumn.key_ordinal
      FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 2, '');

    IF @orderBy IS NULL
      SELECT @orderBy = STUFF((
        SELECT N', ' + QUOTENAME(name)
        FROM sys.columns
        WHERE object_id = @objectId
        ORDER BY column_id
        FOR XML PATH(''), TYPE
      ).value('.', 'NVARCHAR(MAX)'), 1, 2, '');

    ${rowColumnProjection}

    DECLARE @query NVARCHAR(MAX) = N'
      SELECT
        JSON_QUERY((
          SELECT
            columnInfo.name AS [name],
            typeInfo.name AS [dataType],
            columnInfo.is_nullable AS [nullable],
            columnInfo.is_identity AS [isIdentity],
            columnInfo.is_computed AS [isComputed]
          FROM sys.columns AS columnInfo
          INNER JOIN sys.types AS typeInfo
            ON typeInfo.user_type_id = columnInfo.user_type_id
          WHERE columnInfo.object_id = OBJECT_ID(N''dbo.${tableName}'', N''U'')
            ${tableKey === "feedbacks" ? `AND (${dynamicFeedbackColumnFilter})` : ""}
          ${tableKey === "feedbacks"
    ? `ORDER BY CASE columnInfo.name ${dynamicFeedbackColumnOrder} END`
    : "ORDER BY columnInfo.column_id"}
          FOR JSON PATH
        )) AS [columns],
        JSON_QUERY((
          SELECT columnInfo.name AS [name]
          FROM sys.indexes AS indexInfo
          INNER JOIN sys.index_columns AS indexColumn
            ON indexColumn.object_id = indexInfo.object_id
            AND indexColumn.index_id = indexInfo.index_id
          INNER JOIN sys.columns AS columnInfo
            ON columnInfo.object_id = indexColumn.object_id
            AND columnInfo.column_id = indexColumn.column_id
          WHERE indexInfo.object_id = OBJECT_ID(N''dbo.${tableName}'', N''U'')
            AND indexInfo.is_primary_key = 1
          ORDER BY indexColumn.key_ordinal
          FOR JSON PATH
        )) AS [primaryKey],
        ${totalQuery} AS [total],
        ${testStatusCounts}
        ${unsubmittedStatusCounts}
        JSON_QUERY(COALESCE((
          SELECT ' + @rowColumns + N'
          ${rowsFrom}
          ORDER BY ${orderByDateColumn && !orderByPrimaryKey ? `${quoteIdentifier(orderByDateColumn)} DESC,` : ""} ' + @orderBy + N'
          OFFSET ${offset} ROWS FETCH NEXT ${normalizedPageSize} ROWS ONLY
          FOR JSON PATH, INCLUDE_NULL_VALUES
        ), N''[]'')) AS [rows]
      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;';

    EXEC sp_executesql @query;
  `;

  const result = parseJsonResult(await runSql(query));
  if (!result || !Array.isArray(result.columns) || !Array.isArray(result.primaryKey) || !Array.isArray(result.rows)) {
    throw new Error(`Unable to read records from dbo.${tableName}.`);
  }
  if (tableKey === "feedbacks") {
    const returnedColumns = result.columns.map((column) => column.name.toLowerCase());
    const missingColumns = FEEDBACK_COLUMNS.filter((column) => !returnedColumns.includes(column.toLowerCase()));
    if (missingColumns.length) {
      throw new Error(`The feedback table is missing required columns: ${missingColumns.join(", ")}.`);
    }
  }

  const total = Number(result.total);
  if (!Number.isSafeInteger(total) || total < 0) {
    throw new Error(`The database returned an invalid record count for dbo.${tableName}.`);
  }
  const statusCounts = tableKey === "create-tests"
    ? {
      active: Number(result.statusCounts?.active),
      inactive: Number(result.statusCounts?.inactive),
    }
    : null;
  if (
    statusCounts
    && (
      !Number.isSafeInteger(statusCounts.active)
      || statusCounts.active < 0
      || !Number.isSafeInteger(statusCounts.inactive)
      || statusCounts.inactive < 0
      || total !== (filteredTestStatus === 1
        ? statusCounts.active
        : filteredTestStatus === 0
          ? statusCounts.inactive
          : statusCounts.active + statusCounts.inactive)
    )
  ) {
    throw new Error("The database returned invalid active and inactive test counts.");
  }
  const unsubmittedCounts = tableKey === "unsubmitted-registration"
    ? {
      all: Number(result.statusCounts?.all),
      close: Number(result.statusCounts?.close),
      registered: Number(result.statusCounts?.registered),
      notOpen: Number(result.statusCounts?.notOpen),
    }
    : null;
  if (
    unsubmittedCounts
    && (
      Object.values(unsubmittedCounts).some((count) => !Number.isSafeInteger(count) || count < 0)
      || unsubmittedCounts.all !== unsubmittedCounts.close + unsubmittedCounts.registered + unsubmittedCounts.notOpen
      || total !== (statusFilter === "close"
        ? unsubmittedCounts.close
        : statusFilter === "registered"
          ? unsubmittedCounts.registered
          : statusFilter === "not-open"
            ? unsubmittedCounts.notOpen
            : unsubmittedCounts.all)
    )
  ) {
    throw new Error("The database returned invalid unsubmitted registration status counts.");
  }

  return {
    columns: result.columns,
    dateColumn,
    primaryKey: result.primaryKey.map((column) => column.name),
    rows: result.rows,
    ...(statusCounts && { statusCounts }),
    ...(unsubmittedCounts && { statusCounts: unsubmittedCounts }),
    pagination: {
      page: normalizedPage,
      pageSize: normalizedPageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / normalizedPageSize)),
    },
  };
}

async function setAdminTestStatus({ key, status } = {}) {
  if (status !== 0 && status !== 1) {
    throw new Error("Test status must be either active (1) or inactive (0).");
  }

  const tableName = ADMIN_TABLES["create-tests"];
  const schema = await getTableSchema(tableName);
  const statusColumn = schema.find((column) => column.name.toLowerCase() === "status");
  if (!statusColumn || statusColumn.isIdentity || statusColumn.isComputed) {
    throw new Error("The test table does not have an editable Status field.");
  }
  const primaryKeyColumns = schema
    .filter((column) => column.isPrimaryKey)
    .sort((first, second) => first.keyOrdinal - second.keyOrdinal)
    .map((column) => column.name);
  if (primaryKeyColumns.length === 0) {
    throw new Error("Tests cannot be updated because dbo.Tbl_Tests has no primary key.");
  }

  const updatedOnColumn = schema.find((column) => column.name.toLowerCase() === "updatedon");
  const setClause = [
    `${quoteIdentifier(statusColumn.name)} = ${status}`,
    ...(updatedOnColumn && !updatedOnColumn.isComputed && updatedOnColumn.dataType.toLowerCase() !== "timestamp"
      ? [`${quoteIdentifier(updatedOnColumn.name)} = GETDATE()`]
      : []),
  ].join(", ");
  const result = parseJsonResult(await runSql(`
    SET QUOTED_IDENTIFIER ON;
    SET NOCOUNT ON;
    UPDATE dbo.${tableName}
    SET ${setClause}
    WHERE ${buildRowKeyWhere(primaryKeyColumns, key)};
    SELECT @@ROWCOUNT AS [affected] FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
  `));
  return Boolean(result && Number(result.affected) === 1);
}

async function createAdminTest({ testName } = {}) {
  const normalizedTestName = typeof testName === "string" ? testName.trim() : "";
  if (!normalizedTestName) {
    throw new Error("A test name is required.");
  }

  const tableName = ADMIN_TABLES["create-tests"];
  const schema = await getTableSchema(tableName);
  const schemaByName = new Map(schema.map((column) => [column.name.toLowerCase(), column]));
  const testNameColumn = schemaByName.get("testname");
  if (
    !testNameColumn
    || testNameColumn.isIdentity
    || testNameColumn.isComputed
    || !["char", "nchar", "ntext", "nvarchar", "text", "varchar"].includes(testNameColumn.dataType.toLowerCase())
  ) {
    throw new Error("The test table does not have an editable TestName field.");
  }
  const maxLength = Number(testNameColumn.maxLength);
  const testNameType = testNameColumn.dataType.toLowerCase();
  const maxCharacters = ["nchar", "nvarchar"].includes(testNameType)
    ? maxLength / 2
    : ["char", "varchar"].includes(testNameType)
      ? maxLength
      : 0;
  if (maxCharacters > 0 && normalizedTestName.length > maxCharacters) {
    throw new Error(`The test name cannot exceed ${Math.floor(maxCharacters)} characters.`);
  }

  const insertValues = new Map([[testNameColumn.name, sqlString(normalizedTestName)]]);
  const statusColumn = schemaByName.get("status");
  if (!statusColumn || statusColumn.isIdentity || statusColumn.isComputed) {
    throw new Error("The test table does not have an editable Status field.");
  }
  insertValues.set(statusColumn.name, "1");

  for (const timestampName of ["createdon", "updatedon"]) {
    const column = schemaByName.get(timestampName);
    if (column && !column.isIdentity && !column.isComputed && column.dataType.toLowerCase() !== "timestamp") {
      insertValues.set(column.name, "GETDATE()");
    }
  }

  const unsupportedRequiredColumn = schema.find((column) => (
    !column.nullable
    && !column.isIdentity
    && !column.isComputed
    && !column.hasDefault
    && !insertValues.has(column.name)
  ));
  if (unsupportedRequiredColumn) {
    throw new Error(`The test table has an unsupported required field: ${unsupportedRequiredColumn.name}.`);
  }

  const insertColumns = [...insertValues.keys()];
  const result = parseJsonResult(await runSql(`
    SET QUOTED_IDENTIFIER ON;
    SET NOCOUNT ON;
    INSERT INTO dbo.${tableName} (${insertColumns.map(quoteIdentifier).join(", ")})
    VALUES (${insertColumns.map((column) => insertValues.get(column)).join(", ")});
    SELECT @@ROWCOUNT AS [affected] FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
  `));
  if (!result || Number(result.affected) !== 1) {
    throw new Error("The test was not saved.");
  }
  return true;
}

async function createAdminCoordinator(values = {}) {
  const tableName = ADMIN_TABLES["coordinators-list"];
  const schema = await getTableSchema(tableName);
  const schemaByName = new Map(schema.map((column) => [column.name.toLowerCase(), column]));
  const coordinatorFieldMap = {
    CO_ID: "CoordinatorId",
    CO_Name: "CoordinatorName",
    CO_Email: "Email",
    CO_Password: "Password",
    CO_Mobile: "Mobile",
    CO_Address: "Address",
  };

  const insertFields = Object.entries(coordinatorFieldMap)
    .map(([formField, dbField]) => {
      const rawValue = values[formField];
      const textValue = typeof rawValue === "string" ? rawValue.trim() : rawValue;
      if (textValue === undefined || textValue === null || String(textValue).trim() === "") {
        return null;
      }
      return [dbField, String(textValue).trim()];
    })
    .filter(Boolean);

  if (insertFields.length === 0) {
    throw new Error("The coordinator table is missing the required fields.");
  }

  const columns = insertFields.map(([name]) => {
    const column = schemaByName.get(name.toLowerCase());
    if (!column) {
      throw new Error(`The coordinator table is missing the required '${name}' field.`);
    }
    if (column.isIdentity || column.isComputed) {
      throw new Error(`The coordinator field '${column.name}' cannot be entered manually.`);
    }
    return column;
  });

  const result = parseJsonResult(await runSql(`
    SET QUOTED_IDENTIFIER ON;
    SET NOCOUNT ON;
    INSERT INTO dbo.${tableName} (${columns.map((column) => quoteIdentifier(column.name)).join(", ")})
    VALUES (${insertFields.map(([, value]) => sqlString(value)).join(", ")});
    SELECT @@ROWCOUNT AS [affected] FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
  `));
  if (!result || Number(result.affected) !== 1) {
    throw new Error("The coordinator was not saved.");
  }
  return true;
}

async function getAdminCoordinatorPassword(key, requestedColumn) {
  const tableName = ADMIN_TABLES["coordinators-list"];
  const schema = await getTableSchema(tableName);
  const primaryKeyColumns = schema
    .filter((column) => column.isPrimaryKey)
    .sort((first, second) => first.keyOrdinal - second.keyOrdinal)
    .map((column) => column.name);
  if (primaryKeyColumns.length === 0) {
    throw new Error("Coordinator passwords cannot be retrieved because the table has no primary key.");
  }

  const passwordColumn = schema.find((column) => (
    column.name.toLowerCase() === String(requestedColumn || "").toLowerCase()
    && /password/i.test(column.name)
  ));
  if (!passwordColumn) {
    throw new Error("The coordinator table does not have a password field.");
  }

  const whereClause = buildRowKeyWhere(primaryKeyColumns, key);
  const result = parseJsonResult(await runSql(`
    SET QUOTED_IDENTIFIER ON;
    SET NOCOUNT ON;
    SELECT ${quoteIdentifier(passwordColumn.name)} AS [password]
    FROM dbo.${tableName}
    WHERE ${whereClause}
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES;
  `));
  return result ? String(result.password ?? "") : null;
}

async function getTableSchema(tableName) {
  const query = `
    SET QUOTED_IDENTIFIER ON;
    SET NOCOUNT ON;
    DECLARE @objectId INT = OBJECT_ID(N'dbo.${tableName}', N'U');
    IF @objectId IS NULL
      THROW 50001, 'The requested admin table does not exist in the configured database.', 1;

    SELECT
      columnInfo.name AS [name],
      typeInfo.name AS [dataType],
      columnInfo.is_nullable AS [nullable],
      columnInfo.is_identity AS [isIdentity],
      columnInfo.is_computed AS [isComputed],
      CASE WHEN columnInfo.default_object_id <> 0 THEN 1 ELSE 0 END AS [hasDefault],
      columnInfo.max_length AS [maxLength],
      CASE WHEN indexColumn.column_id IS NOT NULL THEN 1 ELSE 0 END AS [isPrimaryKey],
      COALESCE(indexColumn.key_ordinal, 0) AS [keyOrdinal]
    FROM sys.columns AS columnInfo
    INNER JOIN sys.types AS typeInfo
      ON typeInfo.user_type_id = columnInfo.user_type_id
    LEFT JOIN sys.index_columns AS indexColumn
      ON indexColumn.object_id = columnInfo.object_id
      AND indexColumn.column_id = columnInfo.column_id
      AND EXISTS (
        SELECT 1
        FROM sys.indexes AS indexInfo
        WHERE indexInfo.object_id = indexColumn.object_id
          AND indexInfo.index_id = indexColumn.index_id
          AND indexInfo.is_primary_key = 1
      )
    WHERE columnInfo.object_id = @objectId
    ORDER BY columnInfo.column_id
    FOR JSON PATH;
  `;
  const schema = parseJsonResult(await runSql(query));
  if (!Array.isArray(schema) || schema.length === 0) {
    throw new Error(`Unable to read the schema for dbo.${tableName}.`);
  }
  return schema;
}

function buildRowKeyWhere(primaryKeyColumns, key) {
  if (!key || typeof key !== "object" || Array.isArray(key)) {
    throw new Error("A valid row key is required.");
  }
  const keyNames = Object.keys(key);
  if (
    keyNames.length !== primaryKeyColumns.length ||
    primaryKeyColumns.some((column) => !Object.prototype.hasOwnProperty.call(key, column))
  ) {
    throw new Error("The row key does not match the table primary key.");
  }

  return primaryKeyColumns.map((column) => (
    key[column] === null
      ? `${quoteIdentifier(column)} IS NULL`
      : `${quoteIdentifier(column)} = ${sqlString(key[column])}`
  )).join(" AND ");
}

async function updateAdminTableRow({ tableKey = "documents", key, values } = {}) {
  if (!ADMIN_MUTABLE_TABLES.has(tableKey)) {
    throw new Error("The requested admin table is not available for editing.");
  }
  const tableName = ADMIN_TABLES[tableKey];
  if (!tableName) {
    throw new Error("The requested admin table is not available.");
  }
  const schema = await getTableSchema(tableName);
  const primaryKeyColumns = schema
    .filter((column) => column.isPrimaryKey)
    .sort((first, second) => first.keyOrdinal - second.keyOrdinal)
    .map((column) => column.name);
  if (primaryKeyColumns.length === 0) {
    throw new Error(`Records in dbo.${tableName} cannot be edited because the table has no primary key.`);
  }

  const whereClause = buildRowKeyWhere(primaryKeyColumns, key);
  if (!values || typeof values !== "object" || Array.isArray(values)) {
    throw new Error("Table changes must be provided as a field map.");
  }

  const schemaByName = new Map(schema.map((column) => [column.name.toLowerCase(), column]));
  const updates = Object.entries(values);
  if (updates.length === 0) {
    throw new Error("At least one field must be provided.");
  }
  const setClause = updates.map(([name, value]) => {
    const column = schemaByName.get(String(name).toLowerCase());
    const isEditable = tableKey === "documents" || tableKey === "class-documents"
      ? Boolean(
        column
        && !column.isPrimaryKey
        && !column.isIdentity
        && !column.isComputed
        && DOCUMENT_EDITABLE_COLUMNS.has(column.name.toLowerCase())
      )
      : Boolean(column && !column.isPrimaryKey && !column.isIdentity && !column.isComputed && column.dataType.toLowerCase() !== "timestamp");
    if (!column || !isEditable) {
      throw new Error(`The field '${name}' cannot be edited.`);
    }
    if (value === null && !column.nullable) {
      throw new Error(`The field '${column.name}' cannot be empty.`);
    }
    return `${quoteIdentifier(column.name)} = ${value === null ? "NULL" : sqlString(value)}`;
  }).join(", ");

  const result = parseJsonResult(await runSql(`
    SET QUOTED_IDENTIFIER ON;
    SET NOCOUNT ON;
    UPDATE dbo.${tableName}
    SET ${setClause}
    WHERE ${whereClause};
    SELECT @@ROWCOUNT AS [affected] FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
  `));
  if (!result || Number(result.affected) !== 1) {
    return false;
  }
  return true;
}

async function deleteAdminTableRow({ tableKey = "documents", key } = {}) {
  if (!ADMIN_MUTABLE_TABLES.has(tableKey)) {
    throw new Error("The requested admin table is not available for deletion.");
  }
  const tableName = ADMIN_TABLES[tableKey];
  if (!tableName) {
    throw new Error("The requested admin table is not available.");
  }
  const schema = await getTableSchema(tableName);
  const primaryKeyColumns = schema
    .filter((column) => column.isPrimaryKey)
    .sort((first, second) => first.keyOrdinal - second.keyOrdinal)
    .map((column) => column.name);
  if (primaryKeyColumns.length === 0) {
    throw new Error(`Records in dbo.${tableName} cannot be deleted because the table has no primary key.`);
  }

  const whereClause = buildRowKeyWhere(primaryKeyColumns, key);
  const result = parseJsonResult(await runSql(`
    SET QUOTED_IDENTIFIER ON;
    SET NOCOUNT ON;
    DELETE FROM dbo.${tableName}
    WHERE ${whereClause};
    SELECT @@ROWCOUNT AS [affected] FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
  `));
  return Boolean(result && Number(result.affected) === 1);
}

module.exports = {
  createAdminCoordinator,
  createAdminTest,
  deleteAdminTableRow,
  getAdminCoordinatorPassword,
  listAdminTableData,
  setAdminTestStatus,
  updateAdminTableRow,
};
