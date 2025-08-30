// routes/AttachmentsRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/attachments/:studentId", async (req, res) => {
  const { studentId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_Attachments WHERE Student_Details_Portal_id = $1",
      [studentId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching attachments" });
  }
});

// GET /api/attachments/view/:id
router.get('/attachments/view/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT attachment, attachments_name FROM Student_Portal_Attachments WHERE id = $1',
      [id]
    );

    if (result.rows.length > 0) {
      const file = result.rows[0];

      // Ensure Attachments_Name exists before trying to split it
      const fileName = file.attachments_name;
      if (!fileName) {
        return res.status(400).send("File name is missing.");
      }

      // Manually extracting the filename and extension
      const extname = fileName.split('.').pop();
      const baseName = fileName.substring(0, fileName.lastIndexOf('.'));

      // Set content headers for file download/view
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      res.setHeader('Content-Type', `application/${extname}`);

      // Send the file content as the response
      res.send(file.attachment);
    } else {
      res.status(404).send("File not found");
    }
  } catch (err) {
    console.error("Error fetching file:", err);
    res.status(500).send("Server error");
  }
});

router.get("/attachments/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_Attachments WHERE id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching attachment by ID" });
  }
});

router.post("/attachments/insert", upload.single('Attachment'), async (req, res) => {
  const { Attachments_Name, Attachments_Description, Student_Details_Portal_id } = req.body;
  const attachmentBuffer = req.file ? req.file.buffer : null;

  // Validate Student_Details_Portal_id
  if (!Student_Details_Portal_id || isNaN(parseInt(Student_Details_Portal_id))) {
    return res.status(400).json({ error: "Invalid or missing Student_Details_Portal_id" });
  }

  const query = `
    INSERT INTO Student_Portal_Attachments (
      Attachments_Name, Attachments_Description, Student_Details_Portal_id, Attachment
    )
    VALUES ($1, $2, $3, $4) RETURNING *
  `;
  try {
    const result = await pool.query(query, [
      Attachments_Name,
      Attachments_Description,
      parseInt(Student_Details_Portal_id),
      attachmentBuffer,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error inserting attachment" });
  }
});

router.put("/attachments/update/:id", upload.single('Attachment'), async (req, res) => {
  const { id } = req.params;
  const { Attachments_Name, Attachments_Description } = req.body;
  const attachmentBuffer = req.file ? req.file.buffer : null;

  // Validate id
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Invalid or missing ID" });
  }

  const query = `
    UPDATE Student_Portal_Attachments
    SET Attachments_Name = $1, Attachments_Description = $2, Attachment = $3
    WHERE id = $4 RETURNING *
  `;
  try {
    const result = await pool.query(query, [
      Attachments_Name,
      Attachments_Description,
      attachmentBuffer,
      parseInt(id),
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Attachment not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating attachment" });
  }
});

router.delete("/attachments/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM Student_Portal_Attachments WHERE id = $1", [id]);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting attachment" });
  }
});

module.exports = router;
