const { Sequelize } = require("sequelize");
const getDatabaseConnection = require("./databaseConnection");

const connection = getDatabaseConnection();

const sequelize = new Sequelize(connection.database, connection.user, connection.password, {
  host: connection.server,
  port: connection.port,
  dialect: "mssql",
  logging: false,
  dialectOptions: {
    options: {
      encrypt: connection.encrypt,
      trustServerCertificate: connection.trustServerCertificate,
    },
  },

  pool: {
    max: Number(process.env.DB_POOL_MAX || 10),
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully through Sequelize.");
  })
  .catch((error) => {
    console.error("Database connection failed through Sequelize:", error.message);
  });

module.exports = sequelize;