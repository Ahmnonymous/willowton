const express = require("express");
const router = express.Router();
const pool = require("../db");  // Assuming you're using pg for PostgreSQL

// Create user
router.post("/users", async (req, res) => {
  try {
    const { first_name, last_name, email_address, password, user_type } = req.body;
    const result = await pool.query(
      "INSERT INTO Student_portal_users (first_name, last_name, email_address, password, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [first_name, last_name, email_address, password, user_type]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Server error");
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Student_portal_users");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Server error");
  }
});

// Update user
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email_address, password, user_type } = req.body;

  try {
    const result = await pool.query(
      "UPDATE Student_portal_users SET first_name = $1, last_name = $2, email_address = $3, password = $4, user_type = $5 WHERE user_id = $6 RETURNING *",
      [first_name, last_name, email_address, password, user_type, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Server error");
  }
});

// Get user by ID
router.get("/users/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query(
        "SELECT * FROM Student_portal_users WHERE user_id = $1", 
        [id]
      );
  
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      res.status(500).send("Server error");
    }
  });

  
// Delete user
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM Student_portal_users WHERE user_id = $1 RETURNING *", [id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
