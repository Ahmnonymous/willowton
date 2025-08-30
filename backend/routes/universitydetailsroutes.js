// routes/UniversityDetailsRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/university-details/:studentId", async (req, res) => {
  const { studentId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_University_Details WHERE student_details_portal_id = $1",
      [studentId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching University Details" });
  }
});

router.get("/university-details/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_University_Details WHERE id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching University Details by ID" });
  }
});

router.post("/university-details/insert", async (req, res) => {
  const {
    student_details_portal_id,
    ...fields
  } = req.body;

  const keys = Object.keys(fields);
  const values = Object.values(fields);

  // Validate that there are fields to insert
  if (keys.length === 0) {
    return res.status(400).json({ error: "No fields provided to insert" });
  }

  // Validate student_details_portal_id
  if (!student_details_portal_id || isNaN(parseInt(student_details_portal_id))) {
    return res.status(400).json({ error: "Invalid or missing student_details_portal_id" });
  }

  const placeholders = keys.map((_, i) => `$${i + 2}`).join(", ");

  try {
    const query = `
      INSERT INTO Student_Portal_University_Details (student_details_portal_id, ${keys.join(", ")})
      VALUES ($1, ${placeholders})
      RETURNING *
    `;
    const result = await pool.query(query, [parseInt(student_details_portal_id), ...values]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error inserting University Details" });
  }
});

router.put("/university-details/update/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Validate id
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Invalid or missing ID" });
  }

  const fields = Object.keys(updates).filter((key) => key !== "id");
  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields provided to update" });
  }

  const values = fields.map((key) => updates[key]);
  const assignments = fields.map((field, i) => `${field} = $${i + 1}`).join(", ");

  try {
    const query = `
      UPDATE Student_Portal_University_Details
      SET ${assignments}
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
    const result = await pool.query(query, [...values, parseInt(id)]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating University Details" });
  }
});

router.delete("/university-details/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM Student_Portal_University_Details WHERE id = $1", [id]);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting University Details" });
  }
});

module.exports = router;
