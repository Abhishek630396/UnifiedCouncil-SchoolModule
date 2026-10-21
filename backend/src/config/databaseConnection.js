const sql = require("mssql");

function getDatabaseConnection() {
  const separateSettingsConfigured = Boolean(
    String(process.env.DB_SERVER || "").trim() &&
      String(process.env.DB_DATABASE || "").trim()
  );
  const connectionString = String(process.env.DB_CONNECTION_STRING || "").trim();
  const connection = separateSettingsConfigured
    ? {
        server: process.env.DB_SERVER,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT || 1433),
        options: {
          encrypt: String(process.env.DB_ENCRYPT || "").toLowerCase() === "true",
          trustServerCertificate:
            String(process.env.DB_TRUST_SERVER_CERTIFICATE || "").toLowerCase() === "true",
        },
      }
    : connectionString
      ? sql.ConnectionPool.parseConnectionString(connectionString)
      : {};

  if (!connection.server || !connection.database) {
    throw new Error(
      "Database configuration must include a server and database in DB_CONNECTION_STRING or DB_SERVER/DB_DATABASE."
    );
  }

  return {
    server: connection.server,
    database: connection.database,
    user: connection.user,
    password: connection.password,
    port: Number(connection.port || 1433),
    encrypt: Boolean(connection.options && connection.options.encrypt),
    trustServerCertificate: Boolean(
      connection.options && connection.options.trustServerCertificate
    ),
  };
}

module.exports = getDatabaseConnection;
