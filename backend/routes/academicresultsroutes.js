const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const postmark = require('postmark');

// Live/ Demo
const MODE = process.env.REACT_APP_MODE;
const API_BASE_URL = MODE === "live" ? process.env.REACT_APP_API_BASE_URL_LIVE : process.env.REACT_APP_API_BASE_URL_DEMO;

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
  const fileBuffer = req.file ? req.file.buffer : null;
  const fileName = req.file ? req.file.originalname : null;

  try {
    const result = await pool.query(
      `INSERT INTO Student_Portal_Results 
      (Results_Module, Results_Percentage, Student_Details_Portal_id, Results_Attachment, Results_Attachment_Name) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [Results_Module, Results_Percentage, Student_Details_Portal_id, fileBuffer, fileName]
    );

    // Fetch student details to get name for email
    const studentResult = await pool.query(
      "SELECT student_name, student_surname FROM Student_Details_Portal WHERE id = $1",
      [Student_Details_Portal_id]
    );
    const student = studentResult.rows[0] || { student_name: "Unknown", student_surname: "Student" };

    // Email notification
    const bgImage = `${API_BASE_URL}/StudentAcademic.png`;
    const logoImage = `${API_BASE_URL}/uchakide_logo.png`;
    const loginUrl = 'https://willowtonbursary.co.za/dashboard';
    const emailHtml = `
      <body style="background-color: #f7f5f5;">
        <div style="width:60%; margin:20px auto;background-color:#fff;padding:20px;border-radius:8px;text-align:center;font-family:Arial,sans-serif;">
          <h1 style="color:#2d2d2d;font-size:36px;">Student Academic Results</h1>
          <div style="background-color:#C5F8FF; border-radius: 20px;">
            <img src="${bgImage}" alt="Academic Results" style="max-width:60%;height:auto;border-radius:8px;background:#C5F8FF;" />
          </div>
          <p style="color:#666;font-size:14px;line-height:1.6;">Dear SANZAF Team,</p>
          <p style="color:#666;font-size:14px;line-height:1.6;">
            👉 <strong>${student.student_name} ${student.student_surname}</strong> 
          </p>
          <p style="color:#666;font-size:14px;line-height:1.6;">Seems like contributions are bearing some fruits, have a look below.</p>
          <a href="${loginUrl}" target="_blank" style="display:inline-block;background-color:#C5F8FF;color:black;padding:15px 60px;text-decoration:none;margin-top:20px;border-radius:5px;font-size:14px;">
            LOGIN HERE
          </a>
          <div style="color:#999;">
            <img src="${logoImage}" alt="Uchakide Logo" style="max-width:30%;height:auto;border-radius:8px;background:white;" />
          </div>
        </div>
      </body>
    `;

    // Send email in the background without blocking
    const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN);
    client.sendEmail({
      From: process.env.EMAIL_FROM,
      To: process.env.EMAIL_TO,
      Subject: 'Student Academic Results - Willowton & SANZAF Bursary Fund',
      HtmlBody: emailHtml,
      MessageStream: 'outbound',
    }).then(() => {
      // Optional: Log success if needed
      // console.log('Academic Result Email Sent!');
    }).catch(error => {
      console.error("Error sending academic result email:", error);
      // Optional: Add more error handling, e.g., save to a log file or database
    });

    // Send response immediately
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error inserting academic result" });
  }
});

router.put("/academic-results/update/:id", upload.single("Results_Attachment"), async (req, res) => {
  const { Results_Module, Results_Percentage } = req.body;
  const fileBuffer = req.file ? req.file.buffer : null;
  const fileName = req.file ? req.file.originalname : null;

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

    // Fetch student details to get name for email (optional, added for consistency)
    const academicResult = result.rows[0];
    const studentResult = await pool.query(
      "SELECT student_name, student_surname FROM Student_Details_Portal WHERE id = $1",
      [academicResult.student_details_portal_id]
    );
    const student = studentResult.rows[0] || { student_name: "Unknown", student_surname: "Student" };

    // Email notification (optional, added for consistency)
    const bgImage = `${API_BASE_URL}/StudentAcademic.png`;
    const logoImage = `${API_BASE_URL}/uchakide_logo.png`;
    const loginUrl = 'https://willowtonbursary.co.za/dashboard';
    const emailHtml = `
      <body style="background-color: #f7f5f5;">
        <div style="width:60%; margin:20px auto;background-color:#fff;padding:20px;border-radius:8px;text-align:center;font-family:Arial,sans-serif;">
          <h1 style="color:#2d2d2d;font-size:36px;">Student Academic Results Updated</h1>
          <div style="background-color:#C5F8FF; border-radius: 20px;">
            <img src="${bgImage}" alt="Updated Academic Results" style="max-width:60%;height:auto;border-radius:8px;background:#C5F8FF;" />
          </div>
          <p style="color:#666;font-size:14px;line-height:1.6;">Dear SANZAF Team,</p>
          <p style="color:#666;font-size:14px;line-height:1.6;">
            👉 <strong>${student.student_name} ${student.student_surname}</strong> 
          </p>
          <p style="color:#666;font-size:14px;line-height:1.6;">has updated their academic results, have a look below.</p>
          <a href="${loginUrl}" target="_blank" style="display:inline-block;background-color:#C5F8FF;color:black;padding:15px 60px;text-decoration:none;margin-top:20px;border-radius:5px;font-size:14px;">
            LOGIN HERE
          </a>
          <div style="color:#999;">
            <img src="${logoImage}" alt="Uchakide Logo" style="max-width:30%;height:auto;border-radius:8px;background:white;" />
          </div>
        </div>
      </body>
    `;

    // Send email in the background without blocking
    const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN);
    client.sendEmail({
      From: process.env.EMAIL_FROM,
      To: process.env.EMAIL_TO,
      Subject: 'Student Academic Results Updated - Willowton & SANZAF Bursary Fund',
      HtmlBody: emailHtml,
      MessageStream: 'outbound',
    }).then(() => {
      // Optional: Log success if needed
      // console.log('Update Academic Result Email Sent!');
    }).catch(error => {
      console.error("Error sending update academic result email:", error);
      // Optional: Add more error handling, e.g., save to a log file or database
    });

    // Send response immediately
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