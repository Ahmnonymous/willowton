const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");

// Set up multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Route to fetch voluntary service data by student ID
router.get("/voluntary-service/:studentId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_Voluntary_Service WHERE student_details_portal_id = $1",
      [req.params.studentId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voluntary service data" });
  }
});

// Route to fetch voluntary service data by ID
router.get("/voluntary-service/id/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_Voluntary_Service WHERE id = $1",
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching voluntary service by ID" });
  }
});

// Route to fetch file attachment by ID
router.get("/voluntary-service/view/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT proof_of_service, service_attachment_name FROM Student_Portal_Voluntary_Service WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length > 0) {
      const file = result.rows[0];
      const fileName = file.service_attachment_name || "proof.pdf";
      const ext = fileName.split(".").pop();

      res.setHeader("Content-Disposition", `inline; filename=\"${fileName}\"`);
      res.setHeader("Content-Type", `application/${ext}`);
      res.send(file.proof_of_service);
    } else {
      res.status(404).send("File not found");
    }
  } catch (err) {
    console.error("Error fetching file:", err);
    res.status(500).send("Server error");
  }
});

// Route to insert a new voluntary service record
router.post("/voluntary-service/insert", upload.single("Proof_of_Service"), async (req, res) => {
  const {
    Organisation,
    Contact_Person,
    Contact_Person_Number,
    Hours_Contributed,
    Student_Details_Portal_id
  } = req.body;

  const fileBuffer = req.file ? req.file.buffer : null;
  const fileName = req.file ? req.file.originalname : null;

  try {
    const result = await pool.query(
      `INSERT INTO Student_Portal_Voluntary_Service 
      (Organisation, Contact_Person, Contact_Person_Number, Hours_Contributed, Student_Details_Portal_id, Proof_of_Service, Service_Attachment_Name)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [Organisation, Contact_Person, Contact_Person_Number, Hours_Contributed, Student_Details_Portal_id, fileBuffer, fileName]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting voluntary service:", err);
    res.status(500).json({ error: "Error inserting voluntary service" });
  }
});

// Route to update an existing voluntary service record
router.put("/voluntary-service/update/:id", upload.single("Proof_of_Service"), async (req, res) => {
  const {
    Organisation,
    Contact_Person,
    Contact_Person_Number,
    Hours_Contributed
  } = req.body;

  const fileBuffer = req.file ? req.file.buffer : null;  // Check if a new file is uploaded
  const fileName = req.file ? req.file.originalname : null;

  try {
    let query, values;

    if (fileBuffer) {
      // If there is a new file, update all fields including the file
      query = `UPDATE Student_Portal_Voluntary_Service SET
        Organisation = $1,
        Contact_Person = $2,
        Contact_Person_Number = $3,
        Hours_Contributed = $4,
        Proof_of_Service = $5,
        Service_Attachment_Name = $6
        WHERE id = $7 RETURNING *`;
      values = [Organisation, Contact_Person, Contact_Person_Number, Hours_Contributed, fileBuffer, fileName, req.params.id];
    } else {
      // If no file is provided, just update the rest of the fields, leaving the file unchanged
      query = `UPDATE Student_Portal_Voluntary_Service SET
        Organisation = $1,
        Contact_Person = $2,
        Contact_Person_Number = $3,
        Hours_Contributed = $4
        WHERE id = $5 RETURNING *`;
      values = [Organisation, Contact_Person, Contact_Person_Number, Hours_Contributed, req.params.id];
    }

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating voluntary service:", err);
    res.status(500).json({ error: "Error updating voluntary service" });
  }
});

// Route to delete a voluntary service record
router.delete("/voluntary-service/delete/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM Student_Portal_Voluntary_Service WHERE id = $1", [req.params.id]);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting voluntary service:", err);
    res.status(500).json({ error: "Error deleting voluntary service" });
  }
});

module.exports = router;
