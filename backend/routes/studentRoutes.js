const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");

const postmark = require('postmark');

// Live/ Demo
const MODE = process.env.REACT_APP_MODE;
const API_BASE_URL = MODE === "live" ? process.env.REACT_APP_API_BASE_URL_LIVE : process.env.REACT_APP_API_BASE_URL_DEMO;

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const formatDate = (date) => {
  if (date) {
    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) {
      return null;
    }
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const day = String(formattedDate.getDate()).padStart(2, '0');
    const year = formattedDate.getFullYear();
    return `${month}/${day}/${year}`;
  }
  return null;
};

const formatDateForDB = (date) => {
  if (date) {
    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) {
      return null;
    }
    // Return date in YYYY-MM-DD format for PostgreSQL
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const day = String(formattedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return null;
};

// Route to get all student details
router.get("/student-details", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, student_name, student_surname, student_nationality, student_id_passport_number, 
          student_type, student_religion, student_finance_type, student_whatsapp_number, 
          student_alternative_number, student_email_address, student_highest_education, 
          student_home_address, student_suburb, student_area_code, student_province, 
          to_char(student_date_of_birth,'DD/MM/YYYY') student_date_of_birth, student_race, student_marital_status, student_employment_status, 
          student_job_title, student_company_of_employment, student_current_salary, 
          student_number_of_siblings, student_siblings_bursary, student_willow_relationship, 
          relation_type, relation_hr_contact, relation_branch, relation_name, relation_surname, 
          relation_employee_code, relation_reference, student_emergency_contact_name, 
          student_emergency_contact_number, student_emergency_contact_relationship, 
          student_emergency_contact_address, user_id, student_status, student_status_comment, 
          employment_status_attachment_name, student_date_stamp 
      FROM Student_Details_Portal
      order by 1 desc`,
    );
    const formattedResults = result.rows.map(student => ({
      ...student,
      // student_date_of_birth: formatDate(student.student_date_of_birth),
    }));
    res.json(formattedResults);
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ error: "Failed to fetch student details" });
  }
});

// Route to get student details by ID
router.get("/student-details/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, student_name, student_surname, student_nationality, student_id_passport_number, 
              student_type, student_religion, student_finance_type, student_whatsapp_number, 
              student_alternative_number, student_email_address, student_highest_education, 
              student_home_address, student_suburb, student_area_code, student_province, 
              student_date_of_birth, student_race, student_marital_status, student_employment_status, 
              student_job_title, student_company_of_employment, student_current_salary, 
              student_number_of_siblings, student_siblings_bursary, student_willow_relationship, 
              relation_type, relation_hr_contact, relation_branch, relation_name, relation_surname, 
              relation_employee_code, relation_reference, student_emergency_contact_name, 
              student_emergency_contact_number, student_emergency_contact_relationship, 
              student_emergency_contact_address, user_id, student_status, student_status_comment, 
              employment_status_attachment_name, student_date_stamp 
       FROM Student_Details_Portal 
       WHERE id = $1`,
      [id]
    );
    if (result.rows.length > 0) {
      const student = result.rows[0];
      student.student_date_of_birth = formatDate(student.student_date_of_birth);
      res.json(student);
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ error: "Failed to fetch student details" });
  }
});

// Route to get student details by user_id
router.get("/student-detail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, student_name, student_surname, student_nationality, student_id_passport_number, 
              student_type, student_religion, student_finance_type, student_whatsapp_number, 
              student_alternative_number, student_email_address, student_highest_education, 
              student_home_address, student_suburb, student_area_code, student_province, 
              student_date_of_birth, student_race, student_marital_status, student_employment_status, 
              student_job_title, student_company_of_employment, student_current_salary, 
              student_number_of_siblings, student_siblings_bursary, student_willow_relationship, 
              relation_type, relation_hr_contact, relation_branch, relation_name, relation_surname, 
              relation_employee_code, relation_reference, student_emergency_contact_name, 
              student_emergency_contact_number, student_emergency_contact_relationship, 
              student_emergency_contact_address, user_id, student_status, student_status_comment, 
              employment_status_attachment_name, student_date_stamp 
       FROM Student_Details_Portal 
       WHERE user_id = $1`,
      [id]
    );
    if (result.rows.length > 0) {
      const student = result.rows[0];
      student.student_date_of_birth = formatDate(student.student_date_of_birth);
      res.json(student);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ error: "Failed to fetch student details" });
  }
});

// Route to view employment status attachment
router.get("/student-details/view-attachment/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT employment_status_attachment, employment_status_attachment_name FROM Student_Details_Portal WHERE id = $1',
      [id]
    );
    if (result.rows.length > 0) {
      const file = result.rows[0];
      const fileName = file.employment_status_attachment_name;
      if (!fileName) {
        return res.status(400).send("File name is missing.");
      }
      const extname = fileName.split('.').pop();
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      res.setHeader('Content-Type', `application/${extname}`);
      res.send(file.employment_status_attachment);
    } else {
      res.status(404).send("File not found");
    }
  } catch (err) {
    console.error("Error fetching file:", err);
    res.status(500).send("Server error");
  }
});

// Route to create a new student
router.post("/student-details/insert", upload.single('employment_status_attachment'), async (req, res) => {
  try {
    const {
      student_name,
      student_surname,
      student_nationality,
      student_id_passport_number,
      student_type,
      student_religion,
      student_finance_type,
      student_whatsapp_number,
      student_alternative_number,
      student_email_address,
      student_highest_education,
      student_home_address,
      student_suburb,
      student_area_code,
      student_province,
      student_date_of_birth,
      student_race,
      student_marital_status,
      student_employment_status,
      student_job_title,
      student_company_of_employment,
      student_current_salary,
      student_number_of_siblings,
      student_siblings_bursary,
      student_willow_relationship,
      relation_type,
      relation_hr_contact,
      relation_branch,
      relation_name,
      relation_surname,
      relation_employee_code,
      relation_reference,
      student_emergency_contact_name,
      student_emergency_contact_number,
      student_emergency_contact_relationship,
      student_emergency_contact_address,
      user_id,
      student_status,
      student_status_comment,
      employment_status_attachment_name,
    } = req.body;

    const attachmentBuffer = req.file ? req.file.buffer : null;
    const formattedDateOfBirth = student_date_of_birth === "" ? null : student_date_of_birth;
    const formattedSiblings = student_number_of_siblings === "" ? null : student_number_of_siblings;

    const result = await pool.query(
      `INSERT INTO Student_Details_Portal (
        student_name, student_surname, student_nationality, student_id_passport_number, student_type,
        student_religion, student_finance_type, student_whatsapp_number, student_alternative_number, student_email_address,
        student_highest_education, student_home_address, student_suburb, student_area_code, student_province,
        student_date_of_birth, student_race, student_marital_status, student_employment_status, student_job_title,
        student_company_of_employment, student_current_salary, student_number_of_siblings, student_siblings_bursary,
        student_willow_relationship, relation_type, relation_hr_contact, relation_branch, relation_name, relation_surname,
        relation_employee_code, relation_reference, student_emergency_contact_name, student_emergency_contact_number,
        student_emergency_contact_relationship, student_emergency_contact_address, user_id, student_status, student_status_comment,
        employment_status_attachment, employment_status_attachment_name, student_date_stamp
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, CURRENT_TIMESTAMP
      ) RETURNING id`,
      [
        student_name,
        student_surname,
        student_nationality,
        student_id_passport_number,
        student_type,
        student_religion,
        student_finance_type,
        student_whatsapp_number,
        student_alternative_number,
        student_email_address,
        student_highest_education,
        student_home_address,
        student_suburb,
        student_area_code,
        student_province,
        formattedDateOfBirth,
        student_race,
        student_marital_status,
        student_employment_status,
        student_job_title,
        student_company_of_employment,
        student_current_salary,
        formattedSiblings,
        student_siblings_bursary,
        student_willow_relationship,
        relation_type,
        relation_hr_contact,
        relation_branch,
        relation_name,
        relation_surname,
        relation_employee_code,
        relation_reference,
        student_emergency_contact_name,
        student_emergency_contact_number,
        student_emergency_contact_relationship,
        student_emergency_contact_address,
        user_id,
        student_status || "Pending",
        student_status_comment || "",
        attachmentBuffer,
        employment_status_attachment_name,
      ]
    );

    const newStudentId = result.rows[0].id;
    const newStudentResult = await pool.query("SELECT * FROM Student_Details_Portal WHERE id = $1", [newStudentId]);
    if (newStudentResult.rows.length > 0) {
      const student = newStudentResult.rows[0];
      student.student_date_of_birth = formatDate(student.student_date_of_birth);

      // Use the email template HTML with dynamic values
      const bgImage = `${API_BASE_URL}/NewStudent.png`;
      const logoImage = `${API_BASE_URL}/uchakide_logo.png`;
      const loginUrl = 'https://willowtonbursary.co.za/dashboard';
      const emailHtml = `
        <body style="background-color: #f7f5f5;">
        <div style="width:60%; margin:20px auto;background-color:#fff;padding:20px;border-radius:8px;text-align:center;font-family:Arial,sans-serif;">
          <h1 style="color:#2d2d2d;font-size:36px;">New Student Alert</h1>
          <div style="background-color:#8f98ff; border-radius: 20px;margin-top:10px;">
          <img src="${bgImage}" alt="New Student" style="max-width:60%;height:auto;border-radius:8px;background:#8F98FF;" />
          </div>
          <p style="color:#666;font-size:14px;line-height:1.6;margin-top:10px;">Dear SANZAF Team,</p>
          <p style="color:#666;font-size:14px;line-height:1.6;margin-top:10px;">We are pleased to inform you that a new student has been enrolled.</p>
          <p style="color:#666;font-size:14px;line-height:1.6;margin-top:10px;">You may view the student's details by logging into your dashboard using the link below:</p>
          <p style="color:#666;font-size:14px;line-height:1.6;margin-top:10px;">
            <strong>Student Name: ${student.student_name} ${student.student_surname}</strong>
          </p>
          <a href="${loginUrl}" target="_blank" style="display:inline-block;background-color:#8F98FF;color:#fff;padding:15px 60px;text-decoration:none;margin-top:20px;border-radius:5px;font-size:14px;">
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
        // To: student.student_email_address,
        // Cc: process.env.EMAIL_CC,
        Subject: 'New Student Alert - Willowton & SANZAF Bursary Fund',
        HtmlBody: emailHtml,
        MessageStream: 'outbound',
      }).then(() => {
        // Optional: Log success if needed
        // console.log('New Student Email Sent!');
      }).catch(error => {
        console.error("Error sending email:", error);
        // Optional: Add more error handling, e.g., save to a log file or database for retries
      });

      // Send response immediately
      res.status(201).json(student);
    } else {
      res.status(404).json({ error: "Student created but not found" });
    }
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Failed to create student" });
  }
});

// Route to update student details
router.put("/student-details/update/:id", upload.single('employment_status_attachment'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      student_name,
      student_surname,
      student_nationality,
      student_id_passport_number,
      student_type,
      student_religion,
      student_finance_type,
      student_whatsapp_number,
      student_alternative_number,
      student_email_address,
      student_highest_education,
      student_home_address,
      student_suburb,
      student_area_code,
      student_province,
      student_date_of_birth,
      student_race,
      student_marital_status,
      student_employment_status,
      student_job_title,
      student_company_of_employment,
      student_current_salary,
      student_number_of_siblings,
      student_siblings_bursary,
      student_willow_relationship,
      relation_type,
      relation_hr_contact,
      relation_branch,
      relation_name,
      relation_surname,
      relation_employee_code,
      relation_reference,
      student_emergency_contact_name,
      student_emergency_contact_number,
      student_emergency_contact_relationship,
      student_emergency_contact_address,
      student_status,
      student_status_comment,
      employment_status_attachment_name,
    } = req.body;

    const attachmentBuffer = req.file ? req.file.buffer : null;
    const formattedDateOfBirth = student_date_of_birth === "" ? null : formatDateForDB(student_date_of_birth);
    const formattedSiblings = student_number_of_siblings === "" ? null : student_number_of_siblings;

    const result = await pool.query(
      `UPDATE Student_Details_Portal SET
        student_name = $1,
        student_surname = $2,
        student_nationality = $3,
        student_id_passport_number = $4,
        student_type = $5,
        student_religion = $6,
        student_finance_type = $7,
        student_whatsapp_number = $8,
        student_alternative_number = $9,
        student_email_address = $10,
        student_highest_education = $11,
        student_home_address = $12,
        student_suburb = $13,
        student_area_code = $14,
        student_province = $15,
        student_date_of_birth = $16,
        student_race = $17,
        student_marital_status = $18,
        student_employment_status = $19,
        student_job_title = $20,
        student_company_of_employment = $21,
        student_current_salary = $22,
        student_number_of_siblings = $23,
        student_siblings_bursary = $24,
        student_willow_relationship = $25,
        relation_type = $26,
        relation_hr_contact = $27,
        relation_branch = $28,
        relation_name = $29,
        relation_surname = $30,
        relation_employee_code = $31,
        relation_reference = $32,
        student_emergency_contact_name = $33,
        student_emergency_contact_number = $34,
        student_emergency_contact_relationship = $35,
        student_emergency_contact_address = $36,
        student_status = $37,
        student_status_comment = $38,
        employment_status_attachment = COALESCE($39, employment_status_attachment),
        employment_status_attachment_name = COALESCE($40, employment_status_attachment_name),
        student_date_stamp = student_date_stamp
      WHERE id = $41 RETURNING *`,
      [
        student_name,
        student_surname,
        student_nationality,
        student_id_passport_number,
        student_type,
        student_religion,
        student_finance_type,
        student_whatsapp_number,
        student_alternative_number,
        student_email_address,
        student_highest_education,
        student_home_address,
        student_suburb,
        student_area_code,
        student_province,
        formattedDateOfBirth,
        student_race,
        student_marital_status,
        student_employment_status,
        student_job_title,
        student_company_of_employment,
        student_current_salary,
        formattedSiblings,
        student_siblings_bursary,
        student_willow_relationship,
        relation_type,
        relation_hr_contact,
        relation_branch,
        relation_name,
        relation_surname,
        relation_employee_code,
        relation_reference,
        student_emergency_contact_name,
        student_emergency_contact_number,
        student_emergency_contact_relationship,
        student_emergency_contact_address,
        student_status || "Pending",
        student_status_comment || "",
        attachmentBuffer,
        employment_status_attachment_name,
        id,
      ]
    );

    if (result.rows.length > 0) {
      const student = result.rows[0];
      student.student_date_of_birth = formatDate(student.student_date_of_birth);

      // Use the email template HTML with dynamic values for update
      const bgImage = `${API_BASE_URL}/StudentDetails.png`;
      const logoImage = `${API_BASE_URL}/uchakide_logo.png`;
      const loginUrl = 'https://willowtonbursary.co.za/dashboard';
      const emailHtml = `
        <body style="background-color: #f7f5f5;">
        <div style="width:60%; margin:20px auto;background-color:#fff;padding:20px;border-radius:8px;text-align:center;font-family:Arial,sans-serif;">
          <h1 style="color:#2d2d2d;font-size:36px;">Student Details Update</h1>
          <div style="background-color:#F8FFA8; border-radius: 20px;margin-top:10px;">
          <img src="${bgImage}" alt="Updated Student" style="max-width:60%;height:auto;border-radius:8px;background:#F8FFA8;" />
          </div>
          <p style="color:#666;font-size:14px;line-height:1.6;margin-top:10px;">Dear SANZAF Team,</p>
          <p style="color:#666;font-size:14px;line-height:1.6;margin-top:10px;">
          👉 <strong>${student.student_name} ${student.student_surname}</strong>
          </p>
          <p style="color:#666;font-size:14px;line-height:1.6;margin-top:10px;">
          has updated updated some of their personal details have a look below.
          </p>
          <a href="${loginUrl}" target="_blank" style="display:inline-block;background-color:#F8FFA8;color:black;padding:15px 60px;text-decoration:none;margin-top:20px;border-radius:5px;font-size:14px;">
            LOGIN HERE
          </a>
          <div style="color:#999;">
            <img src="${logoImage}" alt="Uchakide Logo" style="max-width:30%;height:auto;border-radius:8px;background:white;" />
          </div>
        </div>
      `;

      // Send email in the background without blocking
      const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN);
      client.sendEmail({
        From: process.env.EMAIL_FROM,
        To: process.env.EMAIL_TO,
        Subject: 'Student Details Update - Willowton & SANZAF Bursary Fund',
        HtmlBody: emailHtml,
        MessageStream: 'outbound',
      }).then(() => {
        // Optional: Log success if needed
        // console.log('Student Update Email Sent!');
      }).catch(error => {
        console.error("Error sending update email:", error);
        // Optional: Add more error handling, e.g., save to a log file or database for retries
      });

      // Send response immediately
      res.status(200).json(student);
    } else {
      res.status(404).json({ error: "Student not found after update" });
    }
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Failed to update student" });
  }
});

// Route to delete employment status attachment
router.put("/student-details/delete-attachment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE Student_Details_Portal SET
        employment_status_attachment = NULL,
        employment_status_attachment_name = NULL
      WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length > 0) {
      const student = result.rows[0];
      student.student_date_of_birth = formatDate(student.student_date_of_birth);
      res.status(200).json(student);
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    console.error("Error deleting attachment:", error);
    res.status(500).json({ error: "Failed to delete attachment" });
  }
});

// Route to delete a student
router.delete("/student-details/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const check = await pool.query("SELECT * FROM Student_Details_Portal WHERE id = $1", [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    await pool.query("DELETE FROM Student_Details_Portal WHERE id = $1", [id]);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Failed to delete student" });
  }
});

module.exports = router;