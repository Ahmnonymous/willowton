const express = require("express");
const router = express.Router();
const pool = require("../db");  // Import your DB connection

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

// Route to get all student details
router.get("/student-details", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Student_Details_Portal");

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

// Route to get student details by ID
router.get("/student-details/:id", async (req, res) => {
  try {
    const { id } = req.params;  // Get the student ID from the request parameters
    const result = await pool.query("SELECT * FROM Student_Details_Portal WHERE id = $1", [id]);

    // Format the dob field before sending response
    if (result.rows.length > 0) {
      const student = result.rows[0];
      student.student_dob = formatDate(student.student_dob);  // Format DOB field
      res.json(student);
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ error: "Failed to fetch student details" });
  }
});

// Route to get student details by ID
router.get("/student-detail/:id", async (req, res) => {
  try {
    const { id } = req.params;  // Get the student ID from the request parameters
    const result = await pool.query("SELECT * FROM Student_Details_Portal WHERE user_id = $1", [id]);

    // Format the dob field before sending response
    if (result.rows.length > 0) {
      const student = result.rows[0];
      student.student_dob = formatDate(student.student_dob);  // Format DOB field
      res.json(student);
    } else {
      // res.status(404).json({  });
      null;
    }
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ error: "Failed to fetch student details" });
  }
});

// Route to create a new student (POST request)
router.post("/student-details/insert", async (req, res) => {
  try {
    const {
      student_name,
      student_surname,
      student_nationality,
      student_id_passport_number,
      student_type,
      student_religion,
      student_finance_type,
      student_whatsapp_number,
      student_alternative_number,
      student_email_address,
      student_highest_education,
      student_home_address,
      student_suburb,
      student_area_code,
      student_province,
      student_dob,
      student_race,
      student_marital_status,
      student_employment_status,
      student_job_title,
      student_industry,
      student_company_of_employment,
      student_current_salary,
      student_number_of_siblings,
      student_siblings_bursary,
      student_willow_relationship,
      student_relationship_type,
      student_employee_name,
      student_employee_designation,
      student_employee_branch,
      student_employee_number,
      student_emergency_contact_name,
      student_emergency_contact_number,
      student_emergency_contact_relationship,
      student_emergency_contact_address,
      user_id,
    } = req.body;

    // Handle null values for student_dob and student_number_of_siblings
    const formattedDob = student_dob === "" ? null : student_dob;
    const formattedSiblings = student_number_of_siblings === "" ? null : student_number_of_siblings;
    
    // Insert into database
    const result = await pool.query(
      `INSERT INTO Student_Details_Portal (
        student_name, student_surname, student_nationality, student_id_passport_number, student_type,
        student_religion, student_finance_type, student_whatsapp_number, student_alternative_number, student_email_address,
        student_highest_education, student_home_address, student_suburb, student_area_code, student_province,
        student_dob, student_race, student_marital_status, student_employment_status, student_job_title, student_industry,
        student_company_of_employment, student_current_salary, student_number_of_siblings, student_siblings_bursary,
        student_willow_relationship, student_relationship_type, student_employee_name, student_employee_designation,
        student_employee_branch, student_employee_number, student_emergency_contact_name, student_emergency_contact_number,
        student_emergency_contact_relationship, student_emergency_contact_address,user_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25,
        $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36
      ) RETURNING id`,
      [
        student_name,
        student_surname,
        student_nationality,
        student_id_passport_number,
        student_type,
        student_religion,
        student_finance_type,
        student_whatsapp_number,
        student_alternative_number,
        student_email_address,
        student_highest_education,
        student_home_address,
        student_suburb,
        student_area_code,
        student_province,
        formattedDob,
        student_race,
        student_marital_status,
        student_employment_status,
        student_job_title,
        student_industry,
        student_company_of_employment,
        student_current_salary,
        formattedSiblings,
        student_siblings_bursary,
        student_willow_relationship,
        student_relationship_type,
        student_employee_name,
        student_employee_designation,
        student_employee_branch,
        student_employee_number,
        student_emergency_contact_name,
        student_emergency_contact_number,
        student_emergency_contact_relationship,
        student_emergency_contact_address,
        user_id,
      ]
    );
    // res.status(201).json({ message: "Student created successfully", id: result.rows[0].id });
    const newStudentId = result.rows[0].id;
    const newStudentResult = await pool.query("SELECT * FROM Student_Details_Portal WHERE id = $1", [newStudentId]);
    
    if (newStudentResult.rows.length > 0) {
      const student = newStudentResult.rows[0];
      student.student_dob = formatDate(student.student_dob);
      res.status(201).json(student);
    } else {
      res.status(404).json({ error: "Student created but not found" });
    }
    
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Failed to create student" });
  }
});

// Route to update student details (PUT request)
router.put("/student-details/update/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get the student ID from the request parameters
    const {
      student_name,
      student_surname,
      student_nationality,
      student_id_passport_number,
      student_type,
      student_religion,
      student_finance_type,
      student_whatsapp_number,
      student_alternative_number,
      student_email_address,
      student_highest_education,
      student_home_address,
      student_suburb,
      student_area_code,
      student_province,
      student_dob,
      student_race,
      student_marital_status,
      student_employment_status,
      student_job_title,
      student_industry,
      student_company_of_employment,
      student_current_salary,
      student_number_of_siblings,
      student_siblings_bursary,
      student_willow_relationship,
      student_relationship_type,
      student_employee_name,
      student_employee_designation,
      student_employee_branch,
      student_employee_number,
      student_emergency_contact_name,
      student_emergency_contact_number,
      student_emergency_contact_relationship,
      student_emergency_contact_address,
    } = req.body;

    // Handle null values for student_dob and student_number_of_siblings
    const formattedDob = student_dob === "" ? null : student_dob;
    const formattedSiblings = student_number_of_siblings === "" ? null : student_number_of_siblings;
  
    const result = await pool.query(
      `UPDATE Student_Details_Portal SET
        student_name = $1,
        student_surname = $2,
        student_nationality = $3,
        student_id_passport_number = $4,
        student_type = $5,
        student_religion = $6,
        student_finance_type = $7,
        student_whatsapp_number = $8,
        student_alternative_number = $9,
        student_email_address = $10,
        student_highest_education = $11,
        student_home_address = $12,
        student_suburb = $13,
        student_area_code = $14,
        student_province = $15,
        student_dob = $16,
        student_race = $17,
        student_marital_status = $18,
        student_employment_status = $19,
        student_job_title = $20,
        student_industry = $21,
        student_company_of_employment = $22,
        student_current_salary = $23,
        student_number_of_siblings = $24,
        student_siblings_bursary = $25,
        student_willow_relationship = $26,
        student_relationship_type = $27,
        student_employee_name = $28,
        student_employee_designation = $29,
        student_employee_branch = $30,
        student_employee_number = $31,
        student_emergency_contact_name = $32,
        student_emergency_contact_number = $33,
        student_emergency_contact_relationship = $34,
        student_emergency_contact_address = $35
      WHERE id = $36`,
      [
        student_name,
        student_surname,
        student_nationality,
        student_id_passport_number,
        student_type,
        student_religion,
        student_finance_type,
        student_whatsapp_number,
        student_alternative_number,
        student_email_address,
        student_highest_education,
        student_home_address,
        student_suburb,
        student_area_code,
        student_province,
        formattedDob,
        student_race,
        student_marital_status,
        student_employment_status,
        student_job_title,
        student_industry,
        student_company_of_employment,
        student_current_salary,
        formattedSiblings,
        student_siblings_bursary,
        student_willow_relationship,
        student_relationship_type,
        student_employee_name,
        student_employee_designation,
        student_employee_branch,
        student_employee_number,
        student_emergency_contact_name,
        student_emergency_contact_number,
        student_emergency_contact_relationship,
        student_emergency_contact_address,
        id,  // Student ID from the URL
      ]
    );

    // res.status(200).json({ message: "Student updated successfully" });
    // Fetch and return updated student
    const updatedStudent = await pool.query("SELECT * FROM Student_Details_Portal WHERE id = $1", [id]);
    if (updatedStudent.rows.length > 0) {
      const student = updatedStudent.rows[0];
      student.student_dob = formatDate(student.student_dob);
      res.status(200).json(student);
    } else {
      res.status(404).json({ error: "Student not found after update" });
    }

  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Failed to update student" });
  }
});

// Route to delete a student
router.delete("/student-details/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // First, check if the student exists
    const check = await pool.query("SELECT * FROM Student_Details_Portal WHERE id = $1", [id]);

    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Delete the student
    await pool.query("DELETE FROM Student_Details_Portal WHERE id = $1", [id]);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Failed to delete student" });
  }
});

module.exports = router;
