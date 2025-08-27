const express = require("express");
const router = express.Router();
const pool = require("../db");
const postmark = require('postmark');

// Live/ Demo
const MODE = process.env.REACT_APP_MODE;
const API_BASE_URL = MODE === "live" ? process.env.REACT_APP_API_BASE_URL_LIVE : process.env.REACT_APP_API_BASE_URL_DEMO;

// GET: All expense details by student ID
router.get("/expense-details/:studentId", async (req, res) => {
  const { studentId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_Expense_Details WHERE student_details_portal_id = $1",
      [studentId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching expense details" });
  }
});

// GET: Single record by detail ID
router.get("/expense-details/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_Expense_Details WHERE id = $1",
      [id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching expense details by ID" });
  }
});

// POST: Insert new record
router.post("/expense-details/insert", async (req, res) => {
  const {
    student_details_portal_id,
    Father_Monthly_Salary,
    Mother_Monthly_Salary,
    Spouse_Monthly_Salary,
    Applicant_Monthly_Salary,
    Rent_Income,
    Grants,
    Other_Income,
    total_income,
    Rent_Bond_Expense,
    Rates_Expense,
    Utilities_Expense,
    Groceries_Expense,
    Transport_Petrol_Expense,
    Telephone_Expense,
    Medical_Aid_Expense,
    Insurance_Expense,
    Other_Expense,
    total_expenses
  } = req.body;

  try {
    const query = `
      INSERT INTO Student_Portal_Expense_Details (
        student_details_portal_id,
        Father_Monthly_Salary,
        Mother_Monthly_Salary,
        Spouse_Monthly_Salary,
        Applicant_Monthly_Salary,
        Rent_Income,
        Grants,
        Other_Income,
        Total_Income,
        Rent_Bond_Expense,
        Rates_Expense,
        Utilities_Expense,
        Groceries_Expense,
        Transport_Petrol_Expense,
        Telephone_Expense,
        Medical_Aid_Expense,
        Insurance_Expense,
        Other_Expense,
        Total_Expenses
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
      )
      RETURNING *;
    `;
    const values = [
      student_details_portal_id,
      Father_Monthly_Salary,
      Mother_Monthly_Salary,
      Spouse_Monthly_Salary,
      Applicant_Monthly_Salary,
      Rent_Income,
      Grants,
      Other_Income,
      total_income,
      Rent_Bond_Expense,
      Rates_Expense,
      Utilities_Expense,
      Groceries_Expense,
      Transport_Petrol_Expense,
      Telephone_Expense,
      Medical_Aid_Expense,
      Insurance_Expense,
      Other_Expense,
      total_expenses
    ];

    const result = await pool.query(query, values);

    // Fetch student details to get name for email
    const studentResult = await pool.query(
      "SELECT student_name, student_surname FROM Student_Details_Portal WHERE id = $1",
      [student_details_portal_id]
    );
    const student = studentResult.rows[0] || { student_name: "Unknown", student_surname: "Student" };

    // Email notification
    const bgImage = `${API_BASE_URL}/StudentExpense.png`;
    const logoImage = `${API_BASE_URL}/uchakide_logo.png`;
    const loginUrl = 'https://willowtonbursary.co.za/dashboard';
    const emailHtml = `
      <body style="background-color: #f7f5f5;">
        <div style="width:60%; margin:20px auto;background-color:#fff;padding:20px;border-radius:8px;text-align:center;font-family:Arial,sans-serif;">
          <h1 style="color:#2d2d2d;font-size:36px;">Student Expense Update</h1>
          <div style="background-color:#FFC28A; border-radius: 20px;">
        <img src="${bgImage}" alt="Updated Expense Details" style="max-width:60%;height:auto;border-radius:8px;background:#FFC28A;" />
        </div>
        <p style="color:#666;font-size:14px;line-height:1.6;">Dear SANZAF Team,</p>
        <p style="color:#666;font-size:14px;line-height:1.6;">
          👉 <strong>${student.student_name} ${student.student_surname}</strong> 
        </p>
        <p style="color:#666;font-size:14px;line-height:1.6;">has updated updated some of their Income and</p>
        <p style="color:#666;font-size:14px;line-height:1.6;">expense details have a look below.</p>
        <a href="${loginUrl}" target="_blank" style="display:inline-block;background-color:#FFC28A;color:black;padding:15px 60px;text-decoration:none;margin-top:20px;border-radius:5px;font-size:14px;">
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
      Subject: 'Student Expense Update - Willowton & SANZAF Bursary Fund',
      HtmlBody: emailHtml,
      MessageStream: 'outbound',
    }).then(() => {
      // Optional: Log success if needed
      // console.log('Expense Email Sent!');
    }).catch(error => {
      console.error("Error sending expense email:", error);
      // Optional: Add more error handling, e.g., save to a log file or database
    });

    // Send response immediately
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error inserting expense details" });
  }
});

// PUT: Update existing record by ID
router.put("/expense-details/update/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const fields = Object.keys(updates).filter((key) => key !== "id");
  const values = fields.map((key) => updates[key]);
  const assignments = fields.map((field, i) => `${field} = $${i + 1}`).join(", ");

  try {
    const query = `UPDATE Student_Portal_Expense_Details SET ${assignments} WHERE id = $${fields.length + 1
      } RETURNING *`;
    const result = await pool.query(query, [...values, id]);

    // Fetch student details to get name for email
    const expense = result.rows[0];
    const studentResult = await pool.query(
      "SELECT student_name, student_surname FROM Student_Details_Portal WHERE id = $1",
      [expense.student_details_portal_id]
    );
    const student = studentResult.rows[0] || { student_name: "Unknown", student_surname: "Student" };

    // Email notification
    const bgImage = `${API_BASE_URL}/StudentExpense.png`;
    const logoImage = `${API_BASE_URL}/uchakide_logo.png`;
    const loginUrl = 'https://willowtonbursary.co.za/dashboard';
    const emailHtml = `
      <body style="background-color: #f7f5f5;">
        <div style="width:60%; margin:20px auto;background-color:#fff;padding:20px;border-radius:8px;text-align:center;font-family:Arial,sans-serif;">
          <h1 style="color:#2d2d2d;font-size:36px;">Student Expense Update</h1>
          <div style="background-color:#FFC28A; border-radius: 20px;">
            <img src="${bgImage}" alt="Updated Expense Details" style="max-width:60%;height:auto;border-radius:8px;background:#FFC28A;" />
          </div>
          <p style="color:#666;font-size:14px;line-height:1.6;">Dear SANZAF Team,</p>
          <p style="color:#666;font-size:14px;line-height:1.6;">
            👉 <strong>${student.student_name} ${student.student_surname}</strong> 
          </p>
          <p style="color:#666;font-size:14px;line-height:1.6;">has updated some of their Income and expense details have a look below.</p>
          <a href="${loginUrl}" target="_blank" style="display:inline-block;background-color:#FFC28A;color:black;padding:15px 60px;text-decoration:none;margin-top:20px;border-radius:5px;font-size:14px;">
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
      Subject: 'Student Expense Update - Willowton & SANZAF Bursary Fund',
      HtmlBody: emailHtml,
      MessageStream: 'outbound',
    }).then(() => {
      // Optional: Log success if needed
      // console.log('Update Expense Email Sent!');
    }).catch(error => {
      console.error("Error sending update expense email:", error);
      // Optional: Add more error handling, e.g., save to a log file or database
    });

    // Send response immediately
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating expense details" });
  }
});

// DELETE: Remove record by ID
router.delete("/expense-details/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM Student_Portal_Expense_Details WHERE id = $1", [id]);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting expense details" });
  }
});

module.exports = router;