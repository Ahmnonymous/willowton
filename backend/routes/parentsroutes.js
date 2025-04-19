const express = require("express");
const router = express.Router();
const pool = require("../db");

// Format date (like in other routes)
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  d.setHours(d.getHours() + 19);
  return d.toISOString().split("T")[0];
};

// GET by student ID
router.get("/parents-details/:studentId", async (req, res) => {
  const { studentId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_Parents_Details WHERE student_details_portal_id = $1",
      [studentId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching parent details:", err);
    res.status(500).json({ error: "Failed to fetch parent details" });
  }
});

// GET by record ID (for editing)
router.get("/parents-details/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_Parents_Details WHERE id = $1",
      [id]
    );
    if (result.rows.length > 0) {
      const data = result.rows[0];
      data.parent_date_stamp = formatDate(data.parent_date_stamp);
      res.json(data);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (err) {
    console.error("Error fetching parent detail by ID:", err);
    res.status(500).json({ error: "Failed to fetch parent detail" });
  }
});

// INSERT
router.post("/parents-details/insert", async (req, res) => {
  const {
    student_details_portal_id,
    parent_relationship,
    parent_name,
    parent_surname,
    parent_cell_number,
    parent_email_address,
    parent_employment_status,
    parent_industry,
    parent_highest_education,
    parent_salary,
    parent_grant,
    parent_other_income,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO Student_Portal_Parents_Details (
        student_details_portal_id, parent_relationship, parent_name, parent_surname,
        parent_cell_number, parent_email_address, parent_employment_status, parent_industry,
        parent_highest_education, parent_salary, parent_grant, parent_other_income
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
      ) RETURNING *`,
      [
        student_details_portal_id,
        parent_relationship,
        parent_name,
        parent_surname,
        parent_cell_number,
        parent_email_address,
        parent_employment_status,
        parent_industry,
        parent_highest_education,
        parent_salary,
        parent_grant,
        parent_other_income,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting parent details:", err);
    res.status(500).json({ error: "Failed to insert parent details" });
  }
});

// UPDATE
router.put("/parents-details/update/:id", async (req, res) => {
  const { id } = req.params;
  const {
    parent_relationship,
    parent_name,
    parent_surname,
    parent_cell_number,
    parent_email_address,
    parent_employment_status,
    parent_industry,
    parent_highest_education,
    parent_salary,
    parent_grant,
    parent_other_income,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE Student_Portal_Parents_Details SET
        parent_relationship = $1,
        parent_name = $2,
        parent_surname = $3,
        parent_cell_number = $4,
        parent_email_address = $5,
        parent_employment_status = $6,
        parent_industry = $7,
        parent_highest_education = $8,
        parent_salary = $9,
        parent_grant = $10,
        parent_other_income = $11
      WHERE id = $12 RETURNING *`,
      [
        parent_relationship,
        parent_name,
        parent_surname,
        parent_cell_number,
        parent_email_address,
        parent_employment_status,
        parent_industry,
        parent_highest_education,
        parent_salary,
        parent_grant,
        parent_other_income,
        id,
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating parent details:", err);
    res.status(500).json({ error: "Failed to update parent details" });
  }
});

// DELETE
router.delete("/parents-details/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM Student_Portal_Parents_Details WHERE id = $1", [id]);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting parent details:", err);
    res.status(500).json({ error: "Failed to delete parent details" });
  }
});


module.exports = router;
