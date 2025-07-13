const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/tasks/:studentId", async (req, res) => {
  const { studentId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM student_portal_tasks WHERE student_details_portal_id = $1",
      [studentId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

router.get("/tasks/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM student_portal_tasks WHERE id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching task by ID" });
  }
});

router.post("/tasks/insert", async (req, res) => {
  const {
    student_details_portal_id,
    created_by,
    task_comment,
    task_description,
    task_status
  } = req.body;

  const fields = [];
  const values = [];
  let placeholderIndex = 2;

  if (created_by !== undefined) {
    fields.push("created_by");
    values.push(created_by);
  }
  if (task_comment !== undefined) {
    fields.push("task_comment");
    values.push(task_comment);
  }
  if (task_description !== undefined) {
    fields.push("task_description");
    values.push(task_description);
  }
  if (task_status !== undefined) {
    fields.push("task_status");
    values.push(task_status);
  }

  const placeholders = fields.map((_, i) => `$${i + 2}`).join(", ");

  try {
    const query = `
      INSERT INTO student_portal_tasks (student_details_portal_id${fields.length ? ", " + fields.join(", ") : ""})
      VALUES ($1${fields.length ? ", " + placeholders : ""})
      RETURNING *
    `;
    const result = await pool.query(query, [student_details_portal_id, ...values]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error inserting task" });
  }
});

router.put("/tasks/update/:id", async (req, res) => {
  const { id } = req.params;
  const { created_by, task_comment, task_description, task_status } = req.body;

  const fields = [];
  const values = [];
  let placeholderIndex = 1;

  if (created_by !== undefined) {
    fields.push(`created_by = $${placeholderIndex++}`);
    values.push(created_by);
  }
  if (task_comment !== undefined) {
    fields.push(`task_comment = $${placeholderIndex++}`);
    values.push(task_comment);
  }
  if (task_description !== undefined) {
    fields.push(`task_description = $${placeholderIndex++}`);
    values.push(task_description);
  }
  if (task_status !== undefined) {
    fields.push(`task_status = $${placeholderIndex++}`);
    values.push(task_status);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields provided for update" });
  }

  try {
    const query = `
      UPDATE student_portal_tasks
      SET ${fields.join(", ")}
      WHERE id = $${placeholderIndex}
      RETURNING *
    `;
    const result = await pool.query(query, [...values, id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating task" });
  }
});

router.delete("/tasks/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM student_portal_tasks WHERE id = $1", [id]);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting task" });
  }
});

module.exports = router;