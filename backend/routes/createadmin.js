// backend/routes/createadmin.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");  // Assuming you're using pg for PostgreSQL
const session = require("express-session");
const router = express.Router();

// Middleware to protect routes
const verifySession = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  next();
};

// Create user (sign up)
router.post("/users", async (req, res) => {
  const { first_name, last_name, email_address, password, user_type } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await pool.query(
      "SELECT * FROM Student_portal_users WHERE email_address = $1",
      [email_address]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ msg: "Email address is already in use" });
    }

    // Hash the password before storing it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      "INSERT INTO Student_portal_users (first_name, last_name, email_address, password, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [first_name, last_name, email_address, hashedPassword, user_type]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Server error");
  }
});

// User login (with password validation and session)
// User login (with password validation and session)
router.post("/login", async (req, res) => {
  const { email_address, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM Student_portal_users WHERE email_address = $1",
      [email_address]
    );

    // Check if user exists
    if (result.rows.length === 0) {
      return res.status(400).json({ msg: "User not found" }); // Return user not found error
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    // Check if password matches
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password" }); // Return incorrect password error
    }

    // Create a JWT token
    const payload = {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email_address: user.email_address,
      user_type: user.user_type,
    };
    const token = jwt.sign(payload, "6c7b98e79cd65965905931d8ca53d41fe9c8399eeb3b5964e73a37076b2b957d140b4a9015680631529ed5222f900094dee2f3b40429a84ca26e1370babbe120");

    // Save user details in session
    req.session.user = {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email_address: user.email_address,
      user_type: user.user_type,
    };

    // Send both the token and user data in the response
    res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email_address,
        user_type: user.user_type,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Server error");
  }
});

// Protected route: Get user profile
router.get("/profile", verifySession, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Student_portal_users WHERE user_id = $1",
      [req.session.user.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user profile:", error);
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
  const { first_name, last_name, email_address, password } = req.body;

  try {
    // Check if password was provided for updating
    let hashedPassword = null;

    if (password) {
      // Hash the new password if provided
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Update user information
    const result = await pool.query(
      "UPDATE Student_portal_users SET first_name = $1, last_name = $2, email_address = $3, password = $4 WHERE user_id = $5 RETURNING *",
      [
        first_name,
        last_name,
        email_address,
        hashedPassword || undefined, // Only update password if provided
        id
      ]
    );

    // Send back the updated user information
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating user:", error);
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
