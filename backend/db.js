// backend/db.js
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected Successfully!"))
  .catch(err => console.error("❌ Database Connection Error:", err));

module.exports = pool;
