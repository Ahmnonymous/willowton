const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db is your PostgreSQL connection

// Log user activity (login or logout)
router.post('/activity-log/insert', async (req, res) => {
  const { user_id, activity_type } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO student_portal_activity_log (user_id, activity_type) VALUES ($1, $2) RETURNING *',
      [user_id, activity_type]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error logging activity:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;