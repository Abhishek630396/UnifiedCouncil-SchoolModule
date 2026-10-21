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

function parseJsonResult(output) {
  if (!output) {
    return null;
  }

  const jsonStart = output.indexOf("{");
  const jsonArrayStart = output.indexOf("[");
  const startIndex =
    jsonStart === -1 ? jsonArrayStart : jsonArrayStart === -1 ? jsonStart : Math.min(jsonStart, jsonArrayStart);

  if (startIndex === -1) {
    return null;
  }

  return JSON.parse(output.slice(startIndex));
}

async function getClassDocByClassAndExamType(studentClass, examType) {
  const query = `
    SET NOCOUNT ON;
    SELECT TOP 1
      Title,
      Examtype,
      File1,
      File2,
      File3,
      File4,
      File5
    FROM dbo.Tbl_ClassDoc
    WHERE Title = ${sqlString(studentClass)}
      AND Examtype = ${sqlString(examType)}
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
  `;

  return parseJsonResult(await runSql(query));
}

async function getNearestClassDocByExamType(studentClass, examType) {
  const numericClass = Number(studentClass);
  const sortAnchor = Number.isFinite(numericClass) ? numericClass : 0;
  const numericTitle = nullableIntExpression("Title");
  const query = `
    SET NOCOUNT ON;
    SELECT TOP 1
      Title,
      Examtype,
      File1,
      File2,
      File3,
      File4,
      File5
    FROM dbo.Tbl_ClassDoc
    WHERE Examtype = ${sqlString(examType)}
    ORDER BY
      CASE
        WHEN ${numericTitle} IS NULL THEN 1
        ELSE 0
      END,
      ABS(ISNULL(${numericTitle}, 9999) - ${sortAnchor}),
      ${numericTitle}
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
  `;

  return parseJsonResult(await runSql(query));
}

module.exports = {
  getClassDocByClassAndExamType,
  getNearestClassDocByExamType,
};
