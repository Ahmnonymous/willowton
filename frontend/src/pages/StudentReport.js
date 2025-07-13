import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Box, Typography } from '@mui/material';
import axios from 'axios';

const StudentReport = ({ studentId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch student data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://willowtonbursary.co.za/api/studentPDFroutes/${studentId}`);
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch student data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  // Function to escape LaTeX special characters
  const escapeLatex = (str) => {
    if (!str || typeof str !== 'string') return 'N/A';
    return str
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/\$/g, '\\$')
      .replace(/#/g, '\\#')
      .replace(/_/g, '\\_')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}')
      .replace(/\\/g, '\\textbackslash{}');
  };

  // Function to generate LaTeX content
  const generateLatex = () => {
    if (!data) return '';

    // Extract data
    const {
      student_details,
      about_me,
      assets_liabilities,
      attachments,
      expense_details,
      interview,
      parents_details,
      payments,
      results,
      tasks,
      university_details,
      voluntary_service,
    } = data;

    // Format date fields
    const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : 'N/A');

    // Generate table rows for attachments
    const attachmentsTable = attachments
      .map(
        (item) =>
          `${escapeLatex(item.attachments_name)} & ${escapeLatex(item.attachments_description)} & ${formatDate(item.attachments_date_stamp)} \\\\`
      )
      .join('\n');

    // Generate table rows for parents details
    const parentsTable = parents_details
      .map(
        (item) =>
          `${escapeLatex(item.parent_name)} & ${escapeLatex(item.parent_surname)} & ${escapeLatex(item.parent_relationship)} & ${escapeLatex(item.parent_email_address)} & ${escapeLatex(item.parent_cell_number)} & ${formatDate(item.parent_date_stamp)} \\\\`
      )
      .join('\n');

    // Generate table rows for payments
    const paymentsTable = payments
      .map(
        (item) =>
          `${escapeLatex(item.payments_date)} & ${escapeLatex(item.payments_expense_type)} & ${escapeLatex(item.payments_expense_amount)} & ${escapeLatex(item.payments_vendor)} & ${escapeLatex(item.payments_attachment_name)} \\\\`
      )
      .join('\n');

    // Generate table rows for results
    const resultsTable = results
      .map(
        (item) =>
          `${escapeLatex(item.results_module)} & ${escapeLatex(item.results_percentage)} & ${escapeLatex(item.results_attachment_name)} \\\\`
      )
      .join('\n');

    // Generate table rows for tasks
    const tasksTable = tasks
      .map(
        (item) =>
          `${escapeLatex(item.task_description)} & ${escapeLatex(item.task_status)} & ${escapeLatex(item.task_comment)} \\\\`
      )
      .join('\n');

    // Generate table rows for voluntary service
    const voluntaryServiceTable = voluntary_service
      .map(
        (item) =>
          `${escapeLatex(item.organisation)} & ${escapeLatex(item.hours_contributed)} & ${escapeLatex(item.contact_person)} & ${escapeLatex(item.contact_person_number)} \\\\`
      )
      .join('\n');

    // Read the LaTeX template
    const latexTemplate = `\\documentclass[a4paper,11pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{noto}
\\usepackage{booktabs}
\\usepackage{enumitem}
\\usepackage{xcolor}
\\usepackage{titlesec}
\\usepackage{parskip}
\\usepackage{array}
\\usepackage{longtable}
\\usepackage{pdflscape}
\\usepackage{hyperref}
\\usepackage{fancyhdr}

\\definecolor{headerblue}{RGB}{0, 51, 102}
\\definecolor{lightgray}{RGB}{230, 230, 230}

\\titleformat{\\section}{\\Large\\bfseries\\color{headerblue}}{\\thesection}{1em}{}
\\titleformat{\\subsection}{\\large\\bfseries\\color{headerblue}}{\\thesubsection}{1em}{}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\textbf{Student Report}}
\\fancyhead[R]{\\textbf{Generated on \\today}}
\\fancyfoot[C]{\\thepage}

\\newcolumntype{L}[1]{>{\\raggedright\\arraybackslash}p{#1}}

\\begin{document}

\\begin{titlepage}
    \\centering
    \\vspace*{2cm}
    {\\Huge\\bfseries Student Profile Report \\par}
    \\vspace{1cm}
    {\\Large\\bfseries ${escapeLatex(student_details.student_name)} ${escapeLatex(student_details.student_surname)} \\par}
    \\vspace{0.5cm}
    {\\large Student ID: ${escapeLatex(student_details.id.toString())} \\par}
    \\vspace{2cm}
    {\\large WillowTon Student Portal \\par}
    \\vspace{0.5cm}
    {\\large Generated on \\today \\par}
\\end{titlepage}

\\section{Personal Details}
\\begin{tabular}{L{5cm} L{10cm}}
    \\toprule
    \\textbf{Field} & \\textbf{Value} \\\\
    \\midrule
    Name & ${escapeLatex(student_details.student_name)} \\\\
    Surname & ${escapeLatex(student_details.student_surname)} \\\\
    Date of Birth & ${formatDate(student_details.student_date_of_birth)} \\\\
    ID/Passport Number & ${escapeLatex(student_details.student_id_passport_number)} \\\\
    Nationality & ${escapeLatex(student_details.student_nationality)} \\\\
    Race & ${escapeLatex(student_details.student_race)} \\\\
    Religion & ${escapeLatex(student_details.student_religion)} \\\\
    Marital Status & ${escapeLatex(student_details.student_marital_status)} \\\\
    Home Address & ${escapeLatex(student_details.student_home_address)} \\\\
    Suburb & ${escapeLatex(student_details.student_suburb)} \\\\
    Province & ${escapeLatex(student_details.student_province)} \\\\
    Area Code & ${escapeLatex(student_details.student_area_code)} \\\\
    WhatsApp Number & ${escapeLatex(student_details.student_whatsapp_number)} \\\\
    Alternative Number & ${escapeLatex(student_details.student_alternative_number)} \\\\
    Email Address & ${escapeLatex(student_details.student_email_address)} \\\\
    Employment Status & ${escapeLatex(student_details.student_employment_status)} \\\\
    Company of Employment & ${escapeLatex(student_details.student_company_of_employment)} \\\\
    Job Title & ${escapeLatex(student_details.student_job_title)} \\\\
    Current Salary & ${escapeLatex(student_details.student_current_salary)} \\\\
    Finance Type & ${escapeLatex(student_details.student_finance_type)} \\\\
    Highest Education & ${escapeLatex(student_details.student_highest_education)} \\\\
    Number of Siblings & ${escapeLatex(student_details.student_number_of_siblings?.toString())} \\\\
    Siblings Bursary & ${escapeLatex(student_details.student_siblings_bursary)} \\\\
    Willow Relationship & ${escapeLatex(student_details.student_willow_relationship)} \\\\
    Student Type & ${escapeLatex(student_details.student_type)} \\\\
    Status & ${escapeLatex(student_details.student_status)} \\\\
    Status Comment & ${escapeLatex(student_details.student_status_comment)} \\\\
    Emergency Contact Name & ${escapeLatex(student_details.student_emergency_contact_name)} \\\\
    Emergency Contact Relationship & ${escapeLatex(student_details.student_emergency_contact_relationship)} \\\\
    Emergency Contact Number & ${escapeLatex(student_details.student_emergency_contact_number)} \\\\
    Emergency Contact Address & ${escapeLatex(student_details.student_emergency_contact_address)} \\\\
    Relation Name & ${escapeLatex(student_details.relation_name)} \\\\
    Relation Surname & ${escapeLatex(student_details.relation_surname)} \\\\
    Relation Type & ${escapeLatex(student_details.relation_type)} \\\\
    Relation Reference & ${escapeLatex(student_details.relation_reference)} \\\\
    Relation Employee Code & ${escapeLatex(student_details.relation_employee_code)} \\\\
    Relation HR Contact & ${escapeLatex(student_details.relation_hr_contact)} \\\\
    Relation Branch & ${escapeLatex(student_details.relation_branch)} \\\\
    Date Stamp & ${formatDate(student_details.student_date_stamp)} \\\\
    \\bottomrule
\\end{tabular}

\\section{About Me}
\\begin{itemize}[leftmargin=1.5cm]
    \\item \\textbf{What inspired you to pursue your chosen field of study?} ${escapeLatex(about_me.about_me_q01)} \\\\
    \\item \\textbf{How do you plan to use your education and skills to make a significant impact in this field?} ${escapeLatex(about_me.about_me_q02)} \\\\
    \\item \\textbf{What special projects or initiatives have you undertaken in your academic life?} ${escapeLatex(about_me.about_me_q03)} \\\\
    \\item \\textbf{Can you tell me about any academic awards or scholarships you have received?} ${escapeLatex(about_me.about_me_q04)} \\\\
    \\item \\textbf{Provide examples or specific skills you have developed that demonstrates your commitment.} ${escapeLatex(about_me.about_me_q05)} \\\\
    \\item \\textbf{What extracurricular activities have you participated in, and how have they contributed to your personal and academic growth?} ${escapeLatex(about_me.about_me_q06)} \\\\
    \\item \\textbf{Once you have completed your studies, how will others benefit from it?} ${escapeLatex(about_me.about_me_q07)} \\\\
    \\item \\textbf{Can you describe any financial challenges you have faced that have affected your ability to pursue your education, and how these challenges have impacted your current financial situation?} ${escapeLatex(about_me.about_me_q08)} \\\\
    \\item \\textbf{Have you previously been awarded a bursary?} ${escapeLatex(about_me.about_me_q09)} \\\\
    \\item \\textbf{What do you think has been your most notable contribution to society thus far?} ${escapeLatex(about_me.about_me_q10)} \\\\
    \\item \\textbf{Why do you think serving the community is important?} ${escapeLatex(about_me.about_me_q11)} \\\\
    \\item \\textbf{Will you be doing any volunteer work during your studies?} ${escapeLatex(about_me.about_me_q12)} \\\\
    \\item \\textbf{Are you willing to assist someone in need?} ${escapeLatex(about_me.about_me_q13)} \\\\
    \\item \\textbf{Describe yourself in three words.} ${escapeLatex(about_me.about_me_q14)} \\\\
    \\item \\textbf{What is your greatest strength?} ${escapeLatex(about_me.about_me_q15)} \\\\
    \\item \\textbf{Describe your biggest mistake and what steps you have taken to rectify it.} ${escapeLatex(about_me.about_me_q16)} \\\\
    \\item \\textbf{What personal achievement makes you proud?} ${escapeLatex(about_me.about_me_q17)} \\\\
    \\item \\textbf{Are you self-motivated? Explain} ${escapeLatex(about_me.about_me_q18)} \\\\
    \\item \\textbf{1st choice of study.} ${escapeLatex(about_me.about_me_q19)} \\\\
    \\item \\textbf{2nd choice of study} ${escapeLatex(about_me.about_me_q20)} \\\\
    \\item \\textbf{3rd choice of study.} ${escapeLatex(about_me.about_me_q21)} \\\\
\\end{itemize}

\\section{Assets and Liabilities}
\\begin{tabular}{L{5cm} L{10cm}}
    \\toprule
    \\textbf{Field} & \\textbf{Value} \\\\
    \\midrule
    Cash in Bank & ${escapeLatex(assets_liabilities.cash_in_bank)} \\\\
    Gold/Silver & ${escapeLatex(assets_liabilities.gold_silver)} \\\\
    Investments & ${escapeLatex(assets_liabilities.investments)} \\\\
    Liabilities & ${escapeLatex(assets_liabilities.liabilities)} \\\\
    Date Stamp & ${formatDate(assets_liabilities.assets_liabilities_date_stamp)} \\\\
    \\bottomrule
\\end{tabular}

\\section{Attachments}
\\begin{longtable}{L{5cm} L{8cm} L{3cm}}
    \\toprule
    \\textbf{Attachment Name} & \\textbf{Description} & \\textbf{Date} \\\\
    \\midrule
    \\endhead
    ${attachmentsTable}
    \\bottomrule
\\end{longtable}

\\section{Expense Details}
\\begin{tabular}{L{5cm} L{10cm}}
    \\toprule
    \\textbf{Field} & \\textbf{Value} \\\\
    \\midrule
    Applicant Monthly Salary & ${escapeLatex(expense_details.applicant_monthly_salary)} \\\\
    Father Monthly Salary & ${escapeLatex(expense_details.father_monthly_salary)} \\\\
    Mother Monthly Salary & ${escapeLatex(expense_details.mother_monthly_salary)} \\\\
    Spouse Monthly Salary & ${escapeLatex(expense_details.spouse_monthly_salary)} \\\\
    Other Income & ${escapeLatex(expense_details.other_income)} \\\\
    Rent Income & ${escapeLatex(expense_details.rent_income)} \\\\
    Grants & ${escapeLatex(expense_details.grants)} \\\\
    Groceries Expense & ${escapeLatex(expense_details.groceries_expense)} \\\\
    Rent/Bond Expense & ${escapeLatex(expense_details.rent_bond_expense)} \\\\
    Utilities Expense & ${escapeLatex(expense_details.utilities_expense)} \\\\
    Telephone Expense & ${escapeLatex(expense_details.telephone_expense)} \\\\
    Transport/Petrol Expense & ${escapeLatex(expense_details.transport_petrol_expense)} \\\\
    Insurance Expense & ${escapeLatex(expense_details.insurance_expense)} \\\\
    Medical Aid Expense & ${escapeLatex(expense_details.medical_aid_expense)} \\\\
    Rates Expense & ${escapeLatex(expense_details.rates_expense)} \\\\
    Other Expense & ${escapeLatex(expense_details.other_expense)} \\\\
    Total Income & ${escapeLatex(expense_details.total_income)} \\\\
    Total Expenses & ${escapeLatex(expense_details.total_expenses)} \\\\
    Date Stamp & ${formatDate(expense_details.expense_date_stamp)} \\\\
    \\bottomrule
\\end{tabular}

\\section{Interview}
\\begin{tabular}{L{5cm} L{10cm}}
    \\toprule
    \\textbf{Field} & \\textbf{Value} \\\\
    \\midrule
    Interviewer Name & ${escapeLatex(interview.interviewer_name)} \\\\
    Year of Interview & ${escapeLatex(interview.year_of_interview)} \\\\
    Created By & ${escapeLatex(interview.interview_created_by)} \\\\
    \\bottomrule
\\end{tabular}
\\subsection{Interview Responses}
\\begin{itemize}[leftmargin=1.5cm]
    \\item \\textbf{Question 1:} ${escapeLatex(interview.interview_q01)} \\\\
    \\item \\textbf{Question 2:} ${escapeLatex(interview.interview_q02)} \\\\
    \\item \\textbf{Question 3:} ${escapeLatex(interview.interview_q03)} \\\\
    \\item \\textbf{Question 4:} ${escapeLatex(interview.interview_q04)} \\\\
    \\item \\textbf{Question 5:} ${escapeLatex(interview.interview_q05)} \\\\
    \\item \\textbf{Question 6:} ${escapeLatex(interview.interview_q06)} \\\\
    \\item \\textbf{Question 7:} ${escapeLatex(interview.interview_q07)} \\\\
    \\item \\textbf{Question 8:} ${escapeLatex(interview.interview_q08)} \\\\
    \\item \\textbf{Question 9:} ${escapeLatex(interview.interview_q09)} \\\\
    \\item \\textbf{Question 10:} ${escapeLatex(interview.interview_q10)} \\\\
    \\item \\textbf{Question 11:} ${escapeLatex(interview.interview_q11)} \\\\
    \\item \\textbf{Question 12:} ${escapeLatex(interview.interview_q12)} \\\\
    \\item \\textbf{Question 13:} ${escapeLatex(interview.interview_q13)} \\\\
    \\item \\textbf{Question 14:} ${escapeLatex(interview.interview_q14)} \\\\
    \\item \\textbf{Question 15:} ${escapeLatex(interview.interview_q15)} \\\\
    \\item \\textbf{Question 16:} ${escapeLatex(interview.interview_q16)} \\\\
    \\item \\textbf{Question 17:} ${escapeLatex(interview.interview_q17)} \\\\
    \\item \\textbf{Question 18:} ${escapeLatex(interview.interview_q18)} \\\\
    \\item \\textbf{Question 19:} ${escapeLatex(interview.interview_q19)} \\\\
    \\item \\textbf{Question 20:} ${escapeLatex(interview.interview_q20)} \\\\
    \\item \\textbf{Question 21:} ${escapeLatex(interview.interview_q21)} \\\\
    \\item \\textbf{Question 22:} ${escapeLatex(interview.interview_q22)} \\\\
    \\item \\textbf{Question 23:} ${escapeLatex(interview.interview_q23)} \\\\
    \\item \\textbf{Question 24:} ${escapeLatex(interview.interview_q24)} \\\\
\\end{itemize}

\\section{Parents Details}
\\begin{longtable}{L{3cm} L{3cm} L{2cm} L{3cm} L{3cm} L{2cm}}
    \\toprule
    \\textbf{Name} & \\textbf{Surname} & \\textbf{Relationship} & \\textbf{Email} & \\textbf{Phone} & \\textbf{Date} \\\\
    \\midrule
    \\endhead
    ${parentsTable}
    \\bottomrule
\\end{longtable}

\\section{Payments}
\\begin{longtable}{L{3cm} L{3cm} L{3cm} L{3cm} L{3cm}}
    \\toprule
    \\textbf{Date} & \\textbf{Expense Type} & \\textbf{Amount} & \\textbf{Vendor} & \\textbf{Attachment Name} \\\\
    \\midrule
    \\endhead
    ${paymentsTable}
    \\bottomrule
\\end{longtable}

\\section{Results}
\\begin{longtable}{L{5cm} L{3cm} L{5cm}}
    \\toprule
    \\textbf{Module} & \\textbf{Percentage} & \\textbf{Attachment Name} \\\\
    \\midrule
    \\endhead
    ${resultsTable}
    \\bottomrule
\\end{longtable}

\\section{Tasks}
\\begin{longtable}{L{5cm} L{3cm} L{5cm}}
    \\toprule
    \\textbf{Description} & \\textbf{Status} & \\textbf{Comment} \\\\
    \\midrule
    \\endhead
    ${tasksTable}
    \\bottomrule
\\end{longtable}

\\section{University Details}
\\begin{tabular}{L{5cm} L{10cm}}
    \\toprule
    \\textbf{Field} & \\textbf{Value} \\\\
    \\midrule
    Institution Name & ${escapeLatex(university_details.institution_name)} \\\\
    Name of Course & ${escapeLatex(university_details.name_of_course)} \\\\
    Current Year & ${escapeLatex(university_details.current_year)} \\\\
    Intake Year & ${escapeLatex(university_details.intake_year)} \\\\
    Semester & ${escapeLatex(university_details.semester)} \\\\
    Student Number & ${escapeLatex(university_details.student_number)} \\\\
    NQF Level & ${escapeLatex(university_details.nqf_level)} \\\\
    Tuition & ${escapeLatex(university_details.tuition)} \\\\
    Tuition Amount & ${escapeLatex(university_details.tuition_amount)} \\\\
    Accommodation & ${escapeLatex(university_details.accommodation)} \\\\
    Accommodation Fee & ${escapeLatex(university_details.accommodation_fee)} \\\\
    Textbooks & ${escapeLatex(university_details.textbooks)} \\\\
    Textbooks Fee & ${escapeLatex(university_details.textbooks_fee)} \\\\
    Travel & ${escapeLatex(university_details.travel)} \\\\
    Travel Fee & ${escapeLatex(university_details.travel_fee)} \\\\
    Total University Expense & ${escapeLatex(university_details.total_university_expense)} \\\\
    Previously Funded & ${escapeLatex(university_details.previously_funded)} \\\\
    Previously Funded Amount & ${escapeLatex(university_details.previously_funded_amount)} \\\\
    Previous Bursary Org 1 & ${escapeLatex(university_details.previous_bursary_org_1)} \\\\
    Previous Bursary Org 1 Amount & ${escapeLatex(university_details.previous_bursary_org_1_amount)} \\\\
    Previous Bursary Org 1 Contact & ${escapeLatex(university_details.previous_bursary_org_1_contact)} \\\\
    Previous Bursary Org 2 & ${escapeLatex(university_details.previous_bursary_org_2)} \\\\
    Previous Bursary Org 2 Amount & ${escapeLatex(university_details.previous_bursary_org_2_amount)} \\\\
    Previous Bursary Org 2 Contact & ${escapeLatex(university_details.previous_bursary_org_2_contact)} \\\\
    Previous Bursary Org 3 & ${escapeLatex(university_details.previous_bursary_org_3)} \\\\
    Previous Bursary Org 3 Amount & ${escapeLatex(university_details.previous_bursary_org_3_amount)} \\\\
    Previous Bursary Org 3 Contact & ${escapeLatex(university_details.previous_bursary_org_3_contact)} \\\\
    Other Bursary Org 1 & ${escapeLatex(university_details.other_bursary_org_1)} \\\\
    Other Bursary Org 1 Contact & ${escapeLatex(university_details.other_bursary_org_1_contact)} \\\\
    Other Bursary Org 2 & ${escapeLatex(university_details.other_bursary_org_2)} \\\\
    Other Bursary Org 2 Contact & ${escapeLatex(university_details.other_bursary_org_2_contact)} \\\\
    Other Bursary Org 3 & ${escapeLatex(university_details.other_bursary_org_3)} \\\\
    Other Bursary Org 3 Contact & ${escapeLatex(university_details.other_bursary_org_3_contact)} \\\\
    Application Process Status & ${escapeLatex(university_details.application_process_status)} \\\\
    Date Stamp & ${formatDate(university_details.university_details_date_stamp)} \\\\
    \\bottomrule
\\end{tabular}

\\section{Voluntary Service}
\\begin{longtable}{L{5cm} L{3cm} L{3cm} L{3cm}}
    \\toprule
    \\textbf{Organisation} & \\textbf{Hours} & \\textbf{Contact Person} & \\textbf{Contact Number} \\\\
    \\midrule
    \\endhead
    ${voluntaryServiceTable}
    \\bottomrule
\\end{longtable}

\\end{document}`;

    return latexTemplate;
  };

  // Function to download LaTeX file
  const downloadLatex = () => {
    const latexContent = generateLatex();
    const blob = new Blob([latexContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudentReport_${studentId}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Button
        variant="contained"
        color="primary"
        onClick={downloadLatex}
        disabled={!data}
      >
        Generate PDF
      </Button>
    </Box>
  );
};

export default StudentReport;