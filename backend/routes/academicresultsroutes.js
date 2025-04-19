const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/academic-results/:studentId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_Results WHERE student_details_portal_id = $1",
      [req.params.studentId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching academic results" });
  }
});

router.get("/academic-results/id/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_Results WHERE id = $1",
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching academic result by ID" });
  }
});

router.get("/academic-results/view/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT results_attachment, results_attachment_name FROM Student_Portal_Results WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length > 0) {
      const file = result.rows[0];
      const fileName = file.results_attachment_name || "";
      const ext = fileName.split(".").pop();

      res.setHeader("Content-Disposition", `inline; filename=\"${fileName}\"`);
      res.setHeader("Content-Type", `application/${ext}`);
      res.send(file.results_attachment);
    } else {
      res.status(404).send("File not found");
    }
  } catch (err) {
    console.error("Error fetching academic file:", err);
    res.status(500).send("Server error");
  }
});

router.post("/academic-results/insert", upload.single("Results_Attachment"), async (req, res) => {
  const { Results_Module, Results_Percentage, Student_Details_Portal_id } = req.body;
  const fileBuffer = req.file?.buffer || null;
  const fileName = req.file?.originalname || null;

  try {
    const result = await pool.query(
      `INSERT INTO Student_Portal_Results 
      (Results_Module, Results_Percentage, Student_Details_Portal_id, Results_Attachment, Results_Attachment_Name) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [Results_Module, Results_Percentage, Student_Details_Portal_id, fileBuffer, fileName]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error inserting academic result" });
  }
});

router.put("/academic-results/update/:id", upload.single("Results_Attachment"), async (req, res) => {
  const { Results_Module, Results_Percentage } = req.body;
  const fileBuffer = req.file?.buffer;
  const fileName = req.file?.originalname;

  try {
    let query, values;

    if (fileBuffer) {
      query = `
        UPDATE Student_Portal_Results
        SET Results_Module = $1, Results_Percentage = $2, Results_Attachment = $3, Results_Attachment_Name = $4
        WHERE id = $5 RETURNING *`;
      values = [Results_Module, Results_Percentage, fileBuffer, fileName, req.params.id];
    } else {
      query = `
        UPDATE Student_Portal_Results
        SET Results_Module = $1, Results_Percentage = $2
        WHERE id = $3 RETURNING *`;
      values = [Results_Module, Results_Percentage, req.params.id];
    }

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating academic result" });
  }
});

router.delete("/academic-results/delete/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM Student_Portal_Results WHERE id = $1", [req.params.id]);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting academic result" });
  }
});

module.exports = router;