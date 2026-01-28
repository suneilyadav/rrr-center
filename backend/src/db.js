const { Pool } = require("pg");
require("dotenv").config();

console.log("✅ Connecting DB with user:", process.env.DB_USER);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,

  // ✅ Required for Render PostgreSQL
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;

