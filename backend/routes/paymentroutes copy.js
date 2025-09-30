const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/payments/:studentId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_Payments WHERE student_details_portal_id = $1",
      [req.params.studentId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching payment data" });
  }
});

router.get("/payments/id/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Student_Portal_Payments WHERE id = $1",
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching payment by ID" });
  }
});

router.post("/payments/insert", upload.single("Proof_of_Payment"), async (req, res) => {
  const {
    Payments_Expense_Type,
    Payments_Vendor,
    Payments_Expense_Amount,
    Payments_Date,
    Payments_ET_Number,
    Payments_Attachment_Name,
    Payment_Created_By,
    Student_Details_Portal_id,
  } = req.body;

  const fileBuffer = req.file ? req.file.buffer : null;
  const fileName = req.file ? req.file.originalname : null;

  try {
    const result = await pool.query(
      `INSERT INTO Student_Portal_Payments
      (Payments_Expense_Type, Payments_Vendor, Payments_Expense_Amount, Payments_Date, Payments_ET_Number, Payments_Attachment_Name, Proof_of_Payment, Payment_Created_By, Student_Details_Portal_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        Payments_Expense_Type,
        Payments_Vendor,
        Payments_Expense_Amount,
        Payments_Date,
        Payments_ET_Number,
        Payments_Attachment_Name,
        fileBuffer,
        Payment_Created_By,
        Student_Details_Portal_id,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error inserting payment" });
  }
});

router.put("/payments/update/:id", upload.single("Proof_of_Payment"), async (req, res) => {
  const {
    Payments_Expense_Type,
    Payments_Vendor,
    Payments_Expense_Amount,
    Payments_Date,
    Payments_ET_Number,
    Payments_Attachment_Name,
    Payment_Created_By,
  } = req.body;

  const fileBuffer = req.file ? req.file.buffer : null;
  const fileName = req.file ? req.file.originalname : null;

  try {
    let query, values;

    if (fileBuffer) {
      query = `UPDATE Student_Portal_Payments SET
        Payments_Expense_Type = $1,
        Payments_Vendor = $2,
        Payments_Expense_Amount = $3,
        Payments_Date = $4,
        Payments_ET_Number = $5,
        Payments_Attachment_Name = $6,
        Proof_of_Payment = $7,
        Payment_Created_By = $8
        WHERE id = $9 RETURNING *`;
      values = [
        Payments_Expense_Type,
        Payments_Vendor,
        Payments_Expense_Amount,
        Payments_Date,
        Payments_ET_Number,
        Payments_Attachment_Name,
        fileBuffer,
        Payment_Created_By,
        req.params.id,
      ];
    } else {
      query = `UPDATE Student_Portal_Payments SET
        Payments_Expense_Type = $1,
        Payments_Vendor = $2,
        Payments_Expense_Amount = $3,
        Payments_Date = $4,
        Payments_ET_Number = $5,
        Payments_Attachment_Name = $6,
        Payment_Created_By = $7
        WHERE id = $8 RETURNING *`;
      values = [
        Payments_Expense_Type,
        Payments_Vendor,
        Payments_Expense_Amount,
        Payments_Date,
        Payments_ET_Number,
        Payments_Attachment_Name,
        Payment_Created_By,
        req.params.id,
      ];
    }

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating payment" });
  }
});

router.delete("/payments/delete/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM Student_Portal_Payments WHERE id = $1", [req.params.id]);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting payment" });
  }
});

router.get("/payments/view/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT proof_of_payment, payments_attachment_name FROM Student_Portal_Payments WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length > 0) {
      const file = result.rows[0];
      const fileName = file.payments_attachment_name || "proof.pdf";
      const ext = fileName.split(".").pop();

      res.setHeader("Content-Disposition", `inline; filename=\"${fileName}\"`);
      res.setHeader("Content-Type", `application/${ext}`);
      res.send(file.proof_of_payment);
    } else {
      res.status(404).send("File not found");
    }
  } catch (err) {
    console.error("Error fetching file:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
