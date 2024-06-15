const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "users",
  password: "0216",
  port: 5432,
});

module.exports = pool;
