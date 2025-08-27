const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const postmark = require('postmark');

// Live/ Demo
const MODE = process.env.REACT_APP_MODE;
const API_BASE_URL = MODE === "live" ? process.env.REACT_APP_API_BASE_URL_LIVE : process.env.REACT_APP_API_BASE_URL_DEMO;

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

    // Fetch student details to get name for email
    const studentResult = await pool.query(
      "SELECT student_name, student_surname FROM Student_Details_Portal WHERE id = $1",
      [Student_Details_Portal_id]
    );
    const student = studentResult.rows[0] || { student_name: "Unknown", student_surname: "Student" };

    // Email notification
    const bgImage = `${API_BASE_URL}/StudentVoluntary.png`;
    const logoImage = `${API_BASE_URL}/uchakide_logo.png`;
    const loginUrl = 'https://willowtonbursary.co.za/dashboard';
    const emailHtml = `
      <body style="background-color: #f7f5f5;">
        <div style="width:60%; margin:20px auto;background-color:#fff;padding:20px;border-radius:8px;text-align:center;font-family:Arial,sans-serif;">
          <h1 style="color:#2d2d2d;font-size:36px;">Student Voluntary Services</h1>
          <div style="background-color:#FFFB9A; border-radius: 20px;">
            <img src="${bgImage}" alt="Voluntary Service" style="max-width:60%;height:auto;border-radius:8px;background:#FFFB9A;" />
          </div>
          <p style="color:#666;font-size:14px;line-height:1.6;">Dear SANZAF Team,</p>
          <p style="color:#666;font-size:14px;line-height:1.6;">
            👉 <strong>${student.student_name} ${student.student_surname}</strong>
          </p>
          <p style="color:#666;font-size:14px;line-height:1.6;">Is following in our footsteps.</p>
          <p style="color:#666;font-size:14px;line-height:1.6;">Wanna see how they making an impact.</p>
          <a href="${loginUrl}" target="_blank" style="display:inline-block;background-color:#FFFB9A;color:black;padding:15px 60px;text-decoration:none;margin-top:20px;border-radius:5px;font-size:14px;">
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
      Subject: 'Student Voluntary Services - Willowton & SANZAF Bursary Fund',
      HtmlBody: emailHtml,
      MessageStream: 'outbound',
    }).then(() => {
      // Optional: Log success if needed
      // console.log('Voluntary Service Email Sent!');
    }).catch(error => {
      console.error("Error sending voluntary service email:", error);
      // Optional: Add more error handling, e.g., save to a log file or database
    });

    // Send response immediately
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

  const fileBuffer = req.file ? req.file.buffer : null;
  const fileName = req.file ? req.file.originalname : null;

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

    // Fetch student details to get name for email (optional, added for consistency)
    const voluntaryService = result.rows[0];
    const studentResult = await pool.query(
      "SELECT student_name, student_surname FROM Student_Details_Portal WHERE id = $1",
      [voluntaryService.student_details_portal_id]
    );
    const student = studentResult.rows[0] || { student_name: "Unknown", student_surname: "Student" };

    // Email notification (optional, added for consistency)
    const bgImage = `${API_BASE_URL}/StudentVoluntary.png`;
    const logoImage = `${API_BASE_URL}/uchakide_logo.png`;
    const loginUrl = 'https://willowtonbursary.co.za/dashboard';
    const emailHtml = `
      <body style="background-color: #f7f5f5;">
        <div style="width:60%; margin:20px auto;background-color:#fff;padding:20px;border-radius:8px;text-align:center;font-family:Arial,sans-serif;">
          <h1 style="color:#2d2d2d;font-size:36px;">Student Voluntary Services Updated</h1>
          <div style="background-color:#FFFB9A; border-radius: 20px;">
            <img src="${bgImage}" alt="Updated Voluntary Service" style="max-width:60%;height:auto;border-radius:8px;background:#FFFB9A;" />
          </div>
          <p style="color:#666;font-size:14px;line-height:1.6;">Dear SANZAF Team,</p>
          <p style="color:#666;font-size:14px;line-height:1.6;">
            👉 <strong>${student.student_name} ${student.student_surname}</strong>
          </p>
          <p style="color:#666;font-size:14px;line-height:1.6;">has updated their voluntary service details.</p>
          <p style="color:#666;font-size:14px;line-height:1.6;">Check out their latest contributions below.</p>
          <a href="${loginUrl}" target="_blank" style="display:inline-block;background-color:#FFFB9A;color:black;padding:15px 60px;text-decoration:none;margin-top:20px;border-radius:5px;font-size:14px;">
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
      Subject: 'Student Voluntary Services Updated - Willowton & SANZAF Bursary Fund',
      HtmlBody: emailHtml,
      MessageStream: 'outbound',
    }).then(() => {
      // Optional: Log success if needed
      // console.log('Update Voluntary Service Email Sent!');
    }).catch(error => {
      console.error("Error sending update voluntary service email:", error);
      // Optional: Add more error handling, e.g., save to a log file or database
    });

    // Send response immediately
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