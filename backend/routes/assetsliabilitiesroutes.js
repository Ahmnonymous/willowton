const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/assets-liabilities/:studentId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_Assets_Liabilities WHERE student_details_portal_id = $1",
      [req.params.studentId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching assets & liabilities" });
  }
});

router.get("/assets-liabilities/id/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_Assets_Liabilities WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length) res.json(result.rows[0]);
    else res.status(404).json({ error: "Not found" });
  } catch (err) {
    res.status(500).json({ error: "Error fetching by ID" });
  }
});

router.post("/assets-liabilities/insert", async (req, res) => {
  const {
    student_details_portal_id,
    Gold_Silver,
    Cash_in_Bank,
    Investments,
    Liabilities
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO Student_Portal_Assets_Liabilities 
        (student_details_portal_id, Gold_Silver, Cash_in_Bank, Investments, Liabilities) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [student_details_portal_id, Gold_Silver, Cash_in_Bank, Investments, Liabilities]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Insert failed" });
  }
});

router.put("/assets-liabilities/update/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const fields = Object.keys(updates).filter(k => k !== "id");
  const values = fields.map(k => updates[k]);
  const assignments = fields.map((k, i) => `${k} = $${i + 1}`).join(", ");

  try {
    const result = await pool.query(
      `UPDATE Student_Portal_Assets_Liabilities SET ${assignments} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

router.delete("/assets-liabilities/delete/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM Student_Portal_Assets_Liabilities WHERE id = $1", [req.params.id]);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
