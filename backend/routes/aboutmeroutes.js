// routes/AboutMeRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  d.setHours(d.getHours() + 19);
  return d.toISOString().split("T")[0];
};

router.get("/about-me/:studentId", async (req, res) => {
  const { studentId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_About_Me WHERE student_details_portal_id = $1",
      [studentId]
    );
    if (result.rows.length > 0) {
      const data = result.rows[0];
      data.about_me_date_stamp = formatDate(data.about_me_date_stamp);
      res.json(data);
    } else {
      res.json({});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching About Me" });
  }
});

router.get("/about-me/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_About_Me WHERE id = $1",
      [id]
    );
    if (result.rows.length > 0) {
      const data = result.rows[0];
      data.about_me_date_stamp = formatDate(data.about_me_date_stamp);
      res.json(data);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching About Me by ID" });
  }
});

router.post("/about-me/insert", async (req, res) => {
  const {
    student_details_portal_id,
    ...questions
  } = req.body;

  const fields = Object.keys(questions);
  const values = Object.values(questions);

  // Validate that there are fields to insert
  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields provided to insert" });
  }

  // Validate student_details_portal_id
  if (!student_details_portal_id || isNaN(parseInt(student_details_portal_id))) {
    return res.status(400).json({ error: "Invalid or missing student_details_portal_id" });
  }

  const placeholders = fields.map((_, i) => `$${i + 2}`).join(", ");

  try {
    const query = `
      INSERT INTO Student_Portal_About_Me (
        student_details_portal_id, ${fields.join(", ")}
      ) VALUES (
        $1, ${placeholders}
      ) RETURNING *
    `;

    const result = await pool.query(query, [parseInt(student_details_portal_id), ...values]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error inserting About Me" });
  }
});

router.put("/about-me/update/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const fields = Object.keys(updates).filter((key) => key !== "id");
  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields provided to update" });
  }

  const values = fields.map((key) => updates[key]);
  const assignments = fields.map((field, i) => `${field} = $${i + 1}`).join(", ");

  try {
    const query = `
      UPDATE Student_Portal_About_Me
      SET ${assignments}
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
    const result = await pool.query(query, [...values, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating About Me" });
  }
});

router.delete("/about-me/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM Student_Portal_About_Me WHERE id = $1", [id]);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting About Me" });
  }
});

module.exports = router;