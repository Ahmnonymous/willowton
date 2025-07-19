const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db is your PostgreSQL connection

// Route to fetch all student data for a given student_details_portal_id
router.get('/student-data/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Query student_details_portal (master table)
    const studentDetailsResult = await db.query(
      `SELECT 
        student_name, 
        student_surname, 
        TO_CHAR(student_date_of_birth, 'DD/MM/YYYY') AS student_date_of_birth, 
        student_id_passport_number, 
        student_nationality, 
        student_race, 
        student_religion,
        student_marital_status, 
        student_home_address, 
        student_suburb, 
        student_province,
        student_area_code, 
        student_whatsapp_number, 
        student_alternative_number,
        student_email_address, 
        student_employment_status, 
        student_company_of_employment,
        student_job_title, 
        student_current_salary, 
        student_highest_education, 
        student_number_of_siblings, 
        student_siblings_bursary,
        student_type, 
        student_finance_type,
        student_emergency_contact_name, 
        student_emergency_contact_relationship,
        student_emergency_contact_number, 
        student_emergency_contact_address,
        student_willow_relationship, 
        relation_name, 
        relation_surname, 
        relation_type, 
        relation_reference,
        relation_employee_code, 
        relation_hr_contact, 
        relation_branch,
        student_status, 
        student_status_comment,
        TO_CHAR(student_date_stamp, 'DDth Mon YYYY HH12:MI:SS PM') AS created_on
       FROM student_details_portal WHERE id = $1`,
      [id]
    );

    if (studentDetailsResult.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Query detail tables
    const aboutMeResult = await db.query(
      `SELECT 
        about_me_q01, 
        about_me_q02, 
        about_me_q03, 
        about_me_q04, 
        about_me_q05,
        about_me_q06, 
        about_me_q07, 
        about_me_q08, 
        about_me_q09, 
        about_me_q10,
        about_me_q11, 
        about_me_q12, 
        about_me_q13, 
        about_me_q14, 
        about_me_q15,
        about_me_q16, 
        about_me_q17, 
        about_me_q18, 
        about_me_q19, 
        about_me_q20,
        about_me_q21, 
        TO_CHAR(about_me_date_stamp, 'DDth Mon YYYY HH12:MI:SS PM') AS created_on
       FROM student_portal_about_me WHERE student_details_portal_id = $1`,
      [id]
    );

    const assetsLiabilitiesResult = await db.query(
      `SELECT 
        cash_in_bank, 
        gold_silver, 
        investments, 
        liabilities, 
        TO_CHAR(assets_liabilities_date_stamp, 'DDth Mon YYYY HH12:MI:SS PM') AS created_on
       FROM student_portal_assets_liabilities WHERE student_details_portal_id = $1`,
      [id]
    );

    const attachmentsResult = await db.query(
      `SELECT 
        attachments_name, 
        attachments_description, 
        TO_CHAR(attachments_date_stamp, 'DDth Mon YYYY HH12:MI:SS PM') AS created_on
       FROM student_portal_attachments WHERE student_details_portal_id = $1`,
      [id]
    );

    const expenseDetailsResult = await db.query(
      `SELECT 
        applicant_monthly_salary, 
        father_monthly_salary, 
        mother_monthly_salary,
        spouse_monthly_salary, 
        other_income, 
        rent_income, 
        grants, 
        groceries_expense,
        rent_bond_expense, 
        utilities_expense, 
        telephone_expense, 
        transport_petrol_expense,
        insurance_expense, 
        medical_aid_expense, 
        rates_expense, 
        other_expense,
        total_income, 
        total_expenses, 
        TO_CHAR(expense_date_stamp, 'DDth Mon YYYY HH12:MI:SS PM') AS created_on
       FROM student_portal_expense_details WHERE student_details_portal_id = $1`,
      [id]
    );

    const interviewResult = await db.query(
      `SELECT 
        interviewer_name, 
        year_of_interview, 
        interview_q01, 
        interview_q02, 
        interview_q03, 
        interview_q04, 
        interview_q05,
        interview_q06, 
        interview_q07, 
        interview_q08, 
        interview_q09, 
        interview_q10,
        interview_q11, 
        interview_q12, 
        interview_q13, 
        interview_q14, 
        interview_q15,
        interview_q16, 
        interview_q17, 
        interview_q18, 
        interview_q19, 
        interview_q20,
        interview_q21, 
        interview_q22, 
        interview_q23, 
        interview_q24, 
        interview_created_by,
        TO_CHAR(interview_date_stamp, 'DDth Mon YYYY HH12:MI:SS PM') AS created_on
       FROM student_portal_interview WHERE student_details_portal_id = $1`,
      [id]
    );

    const parentsDetailsResult = await db.query(
      `SELECT 
        parent_name, 
        parent_surname, 
        parent_relationship, 
        parent_cell_number,
        parent_email_address, 
        parent_employment_status, 
        parent_salary,
        parent_industry, 
        parent_highest_education, 
        parent_grant, 
        parent_other_income,
        TO_CHAR(parent_date_stamp, 'DDth Mon YYYY HH12:MI:SS PM') AS created_on
       FROM student_portal_parents_details WHERE student_details_portal_id = $1`,
      [id]
    );

    const paymentsResult = await db.query(
      `SELECT 
        payments_date, 
        payments_et_number, 
        payments_expense_type,
        payments_expense_amount, 
        payments_vendor, 
        payment_created_by,
        payments_attachment_name, 
        TO_CHAR(payments_date_stamp, 'DDth Mon YYYY HH12:MI:SS PM') AS created_on
       FROM student_portal_payments WHERE student_details_portal_id = $1`,
      [id]
    );

    const resultsResult = await db.query(
      `SELECT 
        results_module, 
        results_percentage, 
        results_attachment_name, 
        TO_CHAR(results_date_stamp, 'DDth Mon YYYY HH12:MI:SS PM') AS created_on
       FROM student_portal_results WHERE student_details_portal_id = $1`,
      [id]
    );

    const tasksResult = await db.query(
      `SELECT 
        task_description, 
        task_status, 
        task_comment, 
        created_by, 
        TO_CHAR(task_date_stamp, 'DDth Mon YYYY HH12:MI:SS PM') AS created_on
       FROM student_portal_tasks WHERE student_details_portal_id = $1`,
      [id]
    );

    const universityDetailsResult = await db.query(
      `SELECT 
        institution_name, 
        name_of_course, 
        current_year, 
        intake_year, 
        semester,
        student_number, 
        nqf_level, 
        tuition, 
        tuition_amount, 
        accommodation,
        accommodation_fee, 
        textbooks, 
        textbooks_fee, 
        travel, 
        travel_fee,
        total_university_expense, 
        previously_funded, 
        previously_funded_amount,
        previous_bursary_org_1, 
        previous_bursary_org_1_amount, 
        previous_bursary_org_1_contact,
        previous_bursary_org_2, 
        previous_bursary_org_2_amount, 
        previous_bursary_org_2_contact,
        previous_bursary_org_3, 
        previous_bursary_org_3_amount, 
        previous_bursary_org_3_contact,
        other_bursary_org_1, 
        other_bursary_org_1_contact, 
        other_bursary_org_2,
        other_bursary_org_2_contact, 
        other_bursary_org_3, 
        other_bursary_org_3_contact,
        application_process_status, 
        TO_CHAR(university_details_date_stamp, 'DDth Mon YYYY HH12:MI:SS PM') AS created_on
       FROM student_portal_university_details WHERE student_details_portal_id = $1`,
      [id]
    );

    const voluntaryServiceResult = await db.query(
      `SELECT 
        organisation, 
        hours_contributed, 
        contact_person, 
        contact_person_number,
        service_attachment_name, 
        TO_CHAR(voluntary_service_date_stamp, 'DDth Mon YYYY HH12:MI:SS PM') AS created_on
       FROM student_portal_voluntary_service WHERE student_details_portal_id = $1`,
      [id]
    );

    // Combine results into a single JSON object
    const response = {
      student_details: studentDetailsResult.rows[0] || {},
      about_me: aboutMeResult.rows[0] || {},
      assets_liabilities: assetsLiabilitiesResult.rows[0] || {},
      attachments: attachmentsResult.rows,
      expense_details: expenseDetailsResult.rows[0] || {},
      interview: interviewResult.rows[0] || {},
      parents_details: parentsDetailsResult.rows,
      payments: paymentsResult.rows,
      results: resultsResult.rows,
      tasks: tasksResult.rows,
      university_details: universityDetailsResult.rows[0] || {},
      voluntary_service: voluntaryServiceResult.rows,
    };

    res.json(response);
  } catch (err) {
    console.error('Error fetching student data:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;