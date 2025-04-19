// backend/routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../db");  // Import your DB connection

/*
// Route to get student details
router.get("/student-details", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Student_Details_Portal");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ error: "Failed to fetch student details" });
  }
});
*/

// Route for About Me
router.get("/about-me", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Student_Portal_About_Me");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching About Me data:", error);
    res.status(500).json({ error: "Failed to fetch About Me data" });
  }
});

// Route for Parents Details
router.get("/parents-details", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Student_Portal_Parents_Details");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching Parents Details:", error);
    res.status(500).json({ error: "Failed to fetch Parents Details" });
  }
});

// Route for University Details
router.get("/university-details", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Student_Portal_University_Details");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching University Details:", error);
    res.status(500).json({ error: "Failed to fetch University Details" });
  }
});

// Route for Assets & Liabilities
router.get("/assets-liabilities", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Student_Portal_Assets_Liabilities");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching Assets & Liabilities:", error);
    res.status(500).json({ error: "Failed to fetch Assets & Liabilities" });
  }
});

// Route for Expenses Summary
router.get("/expenses-summary", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Student_Portal_Expense_Details");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching Expenses Summary:", error);
    res.status(500).json({ error: "Failed to fetch Expenses Summary" });
  }
});

// Route for Attachments
router.get("/attachments", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Student_Portal_Attachments");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching Attachments:", error);
    res.status(500).json({ error: "Failed to fetch Attachments" });
  }
});

// Route for Payments
router.get("/payments", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Student_Portal_Payments");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching Payments:", error);
    res.status(500).json({ error: "Failed to fetch Payments" });
  }
});

// Route for Results
router.get("/academic-results", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Student_Portal_Results");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching Results:", error);
    res.status(500).json({ error: "Failed to fetch Results" });
  }
});

// Route for Voluntary Services
router.get("/voluntary-services", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Student_Portal_Voluntary_Service");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching Voluntary Services:", error);
    res.status(500).json({ error: "Failed to fetch Voluntary Services" });
  }
});

// Route for Interviews
router.get("/interviews", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Student_Portal_Interview");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching Interviews:", error);
    res.status(500).json({ error: "Failed to fetch Interviews" });
  }
});
/*
// Route to get student details by ID
router.get("/student-details/:id", async (req, res) => {
    try {
      const { id } = req.params;  // Get the student ID from the request parameters
      const result = await pool.query("SELECT * FROM Student_Details_Portal WHERE id = $1", [id]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching student details:", error);
      res.status(500).json({ error: "Failed to fetch student details" });
    }
  });
  
  */
  // Route for About Me by student ID
  router.get("/about-me/:id", async (req, res) => {
    try {
      const { id } = req.params;  // Get the student ID from the request parameters
      const result = await pool.query("SELECT * FROM Student_Portal_About_Me WHERE Student_Details_Portal_id= $1", [id]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching About Me data:", error);
      res.status(500).json({ error: "Failed to fetch About Me data" });
    }
  });
  
  // Route for Parents Details by student ID
  router.get("/parents-details/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("SELECT * FROM Student_Portal_Parents_Details WHERE Student_Details_Portal_id= $1", [id]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching Parents Details:", error);
      res.status(500).json({ error: "Failed to fetch Parents Details" });
    }
  });
  
  // Route for University Details by student ID
  router.get("/university-details/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("SELECT * FROM Student_Portal_University_Details WHERE Student_Details_Portal_id= $1", [id]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching University Details:", error);
      res.status(500).json({ error: "Failed to fetch University Details" });
    }
  });
  
  // Route for Assets & Liabilities by student ID
  router.get("/assets-liabilities/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("SELECT * FROM Student_Portal_Assets_Liabilities WHERE Student_Details_Portal_id= $1", [id]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching Assets & Liabilities:", error);
      res.status(500).json({ error: "Failed to fetch Assets & Liabilities" });
    }
  });
  
  // Route for Expenses Summary by student ID
  router.get("/expenses-summary/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("SELECT * FROM Student_Portal_Expense_Details WHERE Student_Details_Portal_id= $1", [id]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching Expenses Summary:", error);
      res.status(500).json({ error: "Failed to fetch Expenses Summary" });
    }
  });
  
  // Route for Attachments by student ID
  router.get("/attachments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("SELECT * FROM Student_Portal_Attachments WHERE Student_Details_Portal_id= $1", [id]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching Attachments:", error);
      res.status(500).json({ error: "Failed to fetch Attachments" });
    }
  });
  
  // Route for Payments by student ID
  router.get("/payments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("SELECT * FROM Student_Portal_Payments WHERE Student_Details_Portal_id= $1", [id]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching Payments:", error);
      res.status(500).json({ error: "Failed to fetch Payments" });
    }
  });
  
  // Route for Results by student ID
  router.get("/academic-results/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("SELECT * FROM Student_Portal_Results WHERE Student_Details_Portal_id= $1", [id]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching Results:", error);
      res.status(500).json({ error: "Failed to fetch Results" });
    }
  });
  
  // Route for Voluntary Services by student ID
  router.get("/voluntary-services/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("SELECT * FROM Student_Portal_Voluntary_Service WHERE Student_Details_Portal_id= $1", [id]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching Voluntary Services:", error);
      res.status(500).json({ error: "Failed to fetch Voluntary Services" });
    }
  });
  
  // Route for Interviews by student ID
  router.get("/interviews/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("SELECT * FROM Student_Portal_Interview WHERE Student_Details_Portal_id= $1", [id]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching Interviews:", error);
      res.status(500).json({ error: "Failed to fetch Interviews" });
    }
  });
  

module.exports = router;
