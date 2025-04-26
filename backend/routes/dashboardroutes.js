const express = require('express');
const router = express.Router();
const pool = require('../db');  // Assuming you have a PostgreSQL connection setup

// Route to fetch dashboard data (student count, payments, voluntary services, interviews)
router.get('/dashboard', async (req, res) => {
  try {
    // Query for the Student Count
    const studentCountQuery = 'SELECT COUNT(*) FROM Student_Details_Portal';
    const studentCountResult = await pool.query(studentCountQuery);
    const studentCount = studentCountResult.rows[0].count;

    // Query for Total Student Payments
    const totalPaymentsQuery = 'SELECT COUNT(*) AS total FROM Student_Portal_Payments';
    const totalPaymentsResult = await pool.query(totalPaymentsQuery);
    const totalPayments = totalPaymentsResult.rows[0].total || 0;

    // Query for Total Voluntary Services
    const voluntaryServicesQuery = 'SELECT COUNT(*) FROM Student_Portal_Voluntary_Service';
    const voluntaryServicesResult = await pool.query(voluntaryServicesQuery);
    const voluntaryServicesCount = voluntaryServicesResult.rows[0].count;

    // Query for Total Interviews (Adjust based on how interviews are stored)
    const interviewsQuery = 'SELECT COUNT(*) FROM Student_Portal_Interview';  // Assuming a table for interviews
    const interviewsResult = await pool.query(interviewsQuery);
    const interviewsCount = interviewsResult.rows[0].count;

    // Return all the data in a single response
    res.json({
      studentCount,
      totalPayments,
      voluntaryServicesCount,
      interviewsCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Route to fetch region data (assuming there's a region column in your `Student_Details_Portal`)
router.get('/student-region-distribution', async (req, res) => {
  try {
    const query = `
        SELECT Student_Province, COUNT(*) as count 
        FROM Student_Details_Portal 
        GROUP BY Student_Province;
      `;

    const result = await pool.query(query);

    // Send the result back to the client
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});


// Route to fetch employment status data
router.get('/student-employment-status', async (req, res) => {
  try {
    const query = `
        SELECT Student_Employment_Status, COUNT(*) as count 
        FROM Student_Details_Portal 
        GROUP BY Student_Employment_Status;
      `;

    const result = await pool.query(query);

    // Send the result back to the client
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Route to fetch nationality distribution (assuming there's a `Student_Nationality` column in your `Student_Details_Portal`)
router.get('/student-nationality-distribution', async (req, res) => {
  try {
    const query = `
        SELECT Student_Nationality, COUNT(*) as count 
        FROM Student_Details_Portal 
        GROUP BY Student_Nationality;
      `;

    const result = await pool.query(query);

    // Send the result back to the client
    res.json(result.rows);  // The result should have { Student_Nationality, count }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Route to fetch current education distribution (assuming there's a `Student_Highest_Education` column in your `Student_Details_Portal`)
router.get('/student-highest-education-distribution', async (req, res) => {
  try {
    const query = `
        SELECT Student_Highest_Education, COUNT(*) as count 
        FROM Student_Details_Portal 
        GROUP BY Student_Highest_Education;
      `;

    const result = await pool.query(query);

    // Send the result back to the client
    res.json(result.rows);  // The result should have { Student_Highest_Education, count }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Route to fetch current education distribution (assuming there's a `Student_Highest_Education` column in your `Student_Details_Portal`)
router.get('/student-current-education-distribution', async (req, res) => {
  try {
    const query = `
        SELECT Student_Type, COUNT(*) as count 
        FROM Student_Details_Portal 
        GROUP BY Student_Type;
      `;

    const result = await pool.query(query);

    // Send the result back to the client
    res.json(result.rows);  // The result should have { Student_Highest_Education, count }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});


// Route to fetch race distribution (assuming there's a `Student_Highest_Education` column in your `Student_Details_Portal`)
router.get('/student-race-distribution', async (req, res) => {
  try {
    const query = `
        SELECT Student_Race, COUNT(*) as count 
        FROM Student_Details_Portal 
        GROUP BY Student_Race;
      `;

    const result = await pool.query(query);

    // Send the result back to the client
    res.json(result.rows);  // The result should have { Student_Highest_Education, count }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Route to fetch martial-status distribution (assuming there's a `Student_Highest_Education` column in your `Student_Details_Portal`)
router.get('/student-employment-status-distribution', async (req, res) => {
  try {
    const query = `
        SELECT Student_employment_status, COUNT(*) as count 
        FROM Student_Details_Portal 
        GROUP BY Student_employment_status;
      `;

    const result = await pool.query(query);

    // Send the result back to the client
    res.json(result.rows);  // The result should have { Student_Highest_Education, count }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Route to fetch martial-status distribution (assuming there's a `Student_Highest_Education` column in your `Student_Details_Portal`)
router.get('/student-marital-status-distribution', async (req, res) => {
  try {
    const query = `
        SELECT Student_marital_status, COUNT(*) as count 
        FROM Student_Details_Portal 
        GROUP BY Student_marital_status;
      `;

    const result = await pool.query(query);

    // Send the result back to the client
    res.json(result.rows);  // The result should have { Student_Highest_Education, count }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
