const { execFile } = require("child_process");
const { promisify } = require("util");
const getDatabaseConnection = require("./databaseConnection");

const execFileAsync = promisify(execFile);

function getSqlcmdArgs(query, databaseName) {
  const connection = getDatabaseConnection();
  const server = connection.port === 1433
    ? connection.server
    : `${connection.server},${connection.port}`;
  const args = [
    "-S",
    server,
    "-d",
    databaseName || connection.database,
    "-b",
    "-w",
    "65535",
    "-y",
    "0",
    "-Y",
    "0",
  ];

  if (connection.encrypt) {
    args.push("-N");
  }

  if (connection.trustServerCertificate) {
    args.push("-C");
  }

  if (connection.user) {
    args.push("-U", connection.user, "-P", connection.password || "");
  } else {
    args.push("-E");
  }

  args.push("-Q", query);
  return args;
}

async function runSql(query, databaseName) {
  let stdout = "";
  let stderr = "";

  try {
    const result = await execFileAsync("sqlcmd", getSqlcmdArgs(query, databaseName), {
      windowsHide: true,
      maxBuffer: 10 * 1024 * 1024,
    });
    stdout = result.stdout;
    stderr = result.stderr;
  } catch (error) {
    const output = `${error.stdout || ""}${error.stderr || ""}`.trim();
    if (output) {
      error.message = output;
    }
    throw error;
  }

  const output = `${stdout || ""}${stderr || ""}`.trim();
  return output;
}

function escapeSqlString(value) {
  return String(value ?? "").replace(/'/g, "''");
}

function sqlString(value) {
  return `N'${escapeSqlString(value)}'`;
}

function sqlNullableString(value) {
  return value ? sqlString(value) : "NULL";
}

function sqlNumber(value) {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) ? numeric.toFixed(2) : "0.00";
}

function sqlNullableNumber(value) {
  if (value === null || value === undefined || value === "") {
    return "NULL";
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric.toFixed(2) : "NULL";
}

module.exports = {
  runSql,
  sqlNumber,
  sqlNullableNumber,
  sqlString,
  sqlNullableString,
};
