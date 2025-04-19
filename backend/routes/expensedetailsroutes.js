const express = require("express");
const router = express.Router();
const pool = require("../db");

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

  // Log the incoming data to check if totals are received
  // console.log('Received Data:', req.body);

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
    const query = `UPDATE Student_Portal_Expense_Details SET ${assignments} WHERE id = $${
      fields.length + 1
    } RETURNING *`;
    const result = await pool.query(query, [...values, id]);
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
