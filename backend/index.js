require("dotenv").config();
const express = require("express");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Middleware for parsing JSON

// Test Route to fetch data from the database
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW();");
    res.json({ success: true, message: "Database connected!", timestamp: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
app.listen(PORT, async () => {
  try {
    await pool.connect();
    console.log(`✅ Server started on http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ Error connecting to database:", err);
  }
});
