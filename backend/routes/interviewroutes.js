const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/interviews/:studentId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_Interview WHERE student_details_portal_id = $1",
      [req.params.studentId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching interview details" });
  }
});

router.get("/interviews/id/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_Interview WHERE id = $1",
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching interview by ID" });
  }
});

// Insert new interview
// Insert new interview
router.post("/interviews/insert", async (req, res) => {
  const {
    Interviewer_Name,
    Year_of_Interview,
    Interview_Q01,
    Interview_Q02,
    Interview_Q03,
    Interview_Q04,
    Interview_Q05,
    Interview_Q06,
    Interview_Q07,
    Interview_Q08,
    Interview_Q09,
    Interview_Q10,
    Interview_Q11,
    Interview_Q12,
    Interview_Q13,
    Interview_Q14,
    Interview_Q15,
    Interview_Q16,
    Interview_Q17,
    Interview_Q18,
    Interview_Q19,
    Interview_Q20,
    Interview_Q21,
    Interview_Q22,
    Interview_Q23,
    Interview_Q24,
    Interview_Created_By,
    Student_Details_Portal_id,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO Student_Portal_Interview 
      (Interviewer_Name, Year_of_Interview, Interview_Q01, Interview_Q02, Interview_Q03, Interview_Q04, Interview_Q05, Interview_Q06, Interview_Q07, Interview_Q08, Interview_Q09, Interview_Q10, Interview_Q11, Interview_Q12, Interview_Q13, Interview_Q14, Interview_Q15, Interview_Q16, Interview_Q17, Interview_Q18, Interview_Q19, Interview_Q20, Interview_Q21, Interview_Q22, Interview_Q23, Interview_Q24, Interview_Created_By, Student_Details_Portal_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28) RETURNING *`,
      [
        Interviewer_Name,
        Year_of_Interview,
        Interview_Q01 || null,
        Interview_Q02 || null,
        Interview_Q03 || null,
        Interview_Q04 || null,
        Interview_Q05 || null,
        Interview_Q06 || null,
        Interview_Q07 || null,
        Interview_Q08 || null,
        Interview_Q09 || null,
        Interview_Q10 || null,
        Interview_Q11 || null,
        Interview_Q12 || null,
        Interview_Q13 || null,
        Interview_Q14 || null,
        Interview_Q15 || null,
        Interview_Q16 || null,
        Interview_Q17 || null,
        Interview_Q18 || null,
        Interview_Q19 || null,
        Interview_Q20 || null,
        Interview_Q21 || null,
        Interview_Q22 || null,
        Interview_Q23 || null,
        Interview_Q24 || null,
        Interview_Created_By,
        Student_Details_Portal_id,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error inserting interview details" });
  }
});

// Update interview
router.put("/interviews/update/:id", async (req, res) => {
  const {
    Interviewer_Name,
    Year_of_Interview,
    Interview_Q01,
    Interview_Q02,
    Interview_Q03,
    Interview_Q04,
    Interview_Q05,
    Interview_Q06,
    Interview_Q07,
    Interview_Q08,
    Interview_Q09,
    Interview_Q10,
    Interview_Q11,
    Interview_Q12,
    Interview_Q13,
    Interview_Q14,
    Interview_Q15,
    Interview_Q16,
    Interview_Q17,
    Interview_Q18,
    Interview_Q19,
    Interview_Q20,
    Interview_Q21,
    Interview_Q22,
    Interview_Q23,
    Interview_Q24,
    Interview_Created_By,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE Student_Portal_Interview 
      SET Interviewer_Name = $1, Year_of_Interview = $2, Interview_Q01 = $3, Interview_Q02 = $4, Interview_Q03 = $5, Interview_Q04 = $6, Interview_Q05 = $7, Interview_Q06 = $8, Interview_Q07 = $9, Interview_Q08 = $10, Interview_Q09 = $11, Interview_Q10 = $12, Interview_Q11 = $13, Interview_Q12 = $14, Interview_Q13 = $15, Interview_Q14 = $16, Interview_Q15 = $17, Interview_Q16 = $18, Interview_Q17 = $19, Interview_Q18 = $20, Interview_Q19 = $21, Interview_Q20 = $22, Interview_Q21 = $23, Interview_Q22 = $24, Interview_Q23 = $25, Interview_Q24 = $26, Interview_Created_By = $27
      WHERE id = $28 RETURNING *`,
      [
        Interviewer_Name,
        Year_of_Interview,
        Interview_Q01 || null,
        Interview_Q02 || null,
        Interview_Q03 || null,
        Interview_Q04 || null,
        Interview_Q05 || null,
        Interview_Q06 || null,
        Interview_Q07 || null,
        Interview_Q08 || null,
        Interview_Q09 || null,
        Interview_Q10 || null,
        Interview_Q11 || null,
        Interview_Q12 || null,
        Interview_Q13 || null,
        Interview_Q14 || null,
        Interview_Q15 || null,
        Interview_Q16 || null,
        Interview_Q17 || null,
        Interview_Q18 || null,
        Interview_Q19 || null,
        Interview_Q20 || null,
        Interview_Q21 || null,
        Interview_Q22 || null,
        Interview_Q23 || null,
        Interview_Q24 || null,
        Interview_Created_By,
        req.params.id,
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating interview details" });
  }
});

// Delete interview
router.delete("/interviews/delete/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM Student_Portal_Interview WHERE id = $1", [req.params.id]);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting interview details" });
  }
});

module.exports = router;
