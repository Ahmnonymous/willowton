const express = require("express");
const router = express.Router();
const pool = require("../db");

// Utility function to format date to yyyy-MM-dd
const formatDate = (date) => {
    if (date) {
      // Convert the date to a Date object
      const formattedDate = new Date(date);
      
      // Handle time zone shift by adding 19 hours (UTC+19) to adjust the time to your desired output.
      formattedDate.setHours(formattedDate.getHours() + 19); // Add 19 hours to the date (adjust as needed)
  
      // Return the date in ISO format (keeping the date in UTC format)
      // return formattedDate.toISOString();
      return formattedDate.toISOString().split('T')[0];
    }
    return null; // If date is null, return null
  };

// Route for Student details
router.get("/view/student-details", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM Student_Details_Portal ORDER BY STUDENT_NAME,STUDENT_SURNAME");
  
      // Format the dob field before sending response
      const formattedResults = result.rows.map(student => {
        return {
          ...student,
          student_dob: formatDate(student.student_dob),  // Format DOB field
        };
      });
  
      res.json(formattedResults);
    } catch (error) {
      console.error("Error fetching student details:", error);
      res.status(500).json({ error: "Failed to fetch student details" });
    }
  });

// Route for Parent Details Report
router.get('/view/parent-detail-report', async (req, res) => {
    try {
      // SQL Query to fetch required columns from both Student_Details_Portal and Student_Portal_Parents_Details
      const query = `
        SELECT 
          s.Student_Name,
          s.Student_Surname,
          s.Student_Suburb,
          s.Student_Religion,
          s.Student_Race,
          s.Student_Employment_Status,
          p.Parent_Relationship,
          p.Parent_Name,
          p.Parent_Surname,
          p.Parent_Cell_Number,
          p.Parent_Employment_Status
        FROM 
          Student_Details_Portal s
        JOIN 
          Student_Portal_Parents_Details p
        ON 
          s.id = p.Student_Details_Portal_id;
      `;
  
      const result = await pool.query(query);
  
      // If no data is found
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No records found' });
      }
  
      // Send the result back to the client
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  });
    
// Route for Student Equity Report
router.get('/view/student-equity', async (req, res) => {
    try {
      // SQL Query to fetch required columns from both Student_Details_Portal and Student_Portal_Assets_Liabilities
      const query = `
      SELECT 
        s.Student_Name,
        s.Student_Surname,
        s.Student_Suburb,
        s.Student_Religion,
        s.Student_Race,
        s.Student_Employment_Status,
        a.Gold_Silver,
        a.Cash_in_Bank,
        a.Investments,
        a.Liabilities,
        a.Assets_Liabilities_Date_Stamp,
        (
          COALESCE(CAST(NULLIF(a.Gold_Silver, '') AS float), 0) +
          COALESCE(CAST(NULLIF(a.Cash_in_Bank, '') AS float), 0) +
          COALESCE(CAST(NULLIF(a.Investments, '') AS float), 0) -
          COALESCE(CAST(NULLIF(a.Liabilities, '') AS float), 0)
        ) AS Equity
      FROM 
        Student_Details_Portal s
      JOIN 
        Student_Portal_Assets_Liabilities a
      ON 
        s.id = a.Student_Details_Portal_id
      WHERE 
        (a.Gold_Silver ~ '^\\d+(\\.\\d+)?$' OR a.Gold_Silver IS NULL) AND
        (a.Cash_in_Bank ~ '^\\d+(\\.\\d+)?$' OR a.Cash_in_Bank IS NULL) AND
        (a.Investments ~ '^\\d+(\\.\\d+)?$' OR a.Investments IS NULL) AND
        (a.Liabilities ~ '^\\d+(\\.\\d+)?$' OR a.Liabilities IS NULL);
    `;
    
    
      const result = await pool.query(query);
  
      // If no data is found
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No records found' });
      }
  
      // Send the result back to the client
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  });
  

// Route for Student Payments
router.get('/view/student-payments-report', async (req, res) => {
    try {
      // SQL Query to fetch required columns from both Student_Details_Portal and Student_Portal_Payments
      const query = `
        SELECT 
          s.Student_Name,
          s.Student_Surname,
          s.Student_Suburb,
          s.Student_Religion,
          s.Student_Race,
          s.Student_Employment_Status,
          p.Payments_Expense_Type,
          p.Payments_Vendor,
          p.Payments_Expense_Amount,
          p.Payments_Date,
          p.Payments_ET_Number,
          p.Payment_Created_By,
          p.Payments_Date_Stamp
        FROM 
          Student_Details_Portal s
        JOIN 
          Student_Portal_Payments p
        ON 
          s.id = p.Student_Details_Portal_id;
      `;
  
      const result = await pool.query(query);
  
      // If no data is found
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No records found' });
      }
  
      // Send the result back to the client
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  });


// Route for Voluntary Servies
router.get('/view/student-voluntary-service', async (req, res) => {
    try {
      // SQL Query to fetch required columns from both Student_Details_Portal and Student_Portal_Voluntary_Service
      const query = `
        SELECT 
          s.Student_Name,
          s.Student_Surname,
          s.Student_Suburb,
          s.Student_Religion,
          s.Student_Race,
          s.Student_Employment_Status,
          v.Organisation,
          v.Contact_Person,
          v.Contact_Person_Number,
          v.Hours_Contributed,
          v.Voluntary_Service_Date_Stamp
        FROM 
          Student_Details_Portal s
        JOIN 
          Student_Portal_Voluntary_Service v
        ON 
          s.id = v.Student_Details_Portal_id;
      `;
  
      const result = await pool.query(query);
  
      // If no data is found
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No records found' });
      }
  
      // Send the result back to the client
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  });
  

module.exports = router;
