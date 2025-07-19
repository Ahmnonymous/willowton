const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db is your PostgreSQL connection
const pool = require('../db');

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

router.get('/activity-log', async (req, res) => {
  try {
    const query = `
        SELECT 
            (d.first_name || ' ' || d.last_name) AS username, 
          d.email_address,
            INITCAP(m.activity_type) AS activity_type, 
            TO_CHAR(ACTIVITY_DATE_STAMP, 'DD-Mon-YYYY') AS ACTIVITY_DATE,
            TO_CHAR(ACTIVITY_DATE_STAMP, 'HH:MI:SS PM') AS ACTIVITY_TIME
        FROM 
            student_portal_activity_log m,
            student_portal_users d
        WHERE 
            d.user_id = m.user_id
        order by ACTIVITY_DATE_STAMP desc;
      `;

    const result = await pool.query(query);

    // Send the result back to the client
    res.json(result.rows);  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});


module.exports = router;