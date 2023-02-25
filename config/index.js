require("dotenv").config();
let { createPool } = require("mysql");
let connection = createPool({  // to create connection
  host: process.env.dbHost,
  name: process.env.dbName,
  user: process.env.dbUser,
  password: process.env.dbPwd,
  port: process.env.dbPort,
  multipleStatements: true   // to select multiple statements
});

module.exports = connection;
