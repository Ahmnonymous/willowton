const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

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

router.post("/voluntary-service/insert", upload.single("Proof_of_Service"), async (req, res) => {
  const {
    Organisation,
    Contact_Person,
    Contact_Person_Number,
    Hours_Contributed,
    Student_Details_Portal_id
  } = req.body;

  const fileBuffer = req.file.buffer || null;
  const fileName = req.file?.originalname || null;

  try {
    const result = await pool.query(
      `INSERT INTO Student_Portal_Voluntary_Service 
      (Organisation, Contact_Person, Contact_Person_Number, Hours_Contributed, Student_Details_Portal_id, Proof_of_Service, Service_Attachment_Name)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [Organisation, Contact_Person, Contact_Person_Number, Hours_Contributed, Student_Details_Portal_id, fileBuffer, fileName]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error inserting voluntary service" });
  }
});

router.put("/voluntary-service/update/:id", upload.single("Proof_of_Service"), async (req, res) => {
  const {
    Organisation,
    Contact_Person,
    Contact_Person_Number,
    Hours_Contributed
  } = req.body;

  const fileBuffer = req.file?.buffer;
  const fileName = req.file?.originalname;

  try {
    let query, values;

    if (fileBuffer) {
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
    console.error(err);
    res.status(500).json({ error: "Error updating voluntary service" });
  }
});

router.delete("/voluntary-service/delete/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM Student_Portal_Voluntary_Service WHERE id = $1", [req.params.id]);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting voluntary service" });
  }
});

module.exports = router;
