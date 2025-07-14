import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  Card,
  CardContent,
  Button,
  Tab,
  Tabs,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import axios from 'axios';
import DrawerForm from './Drawer/StudentDetailDrawer';
import AboutusDrawer from './Drawer/AboutUsDrawer';
import ParentsDrawer from './Drawer/ParentsDrawer';
import UniversityDetailsDrawer from './Drawer/UniversityDetailsDrawer';
import AttachmentsDrawer from './Drawer/AttachmentsDrawer';
import ExpenseDetailsDrawer from './Drawer/ExpenseDetailsDrawer';
import AssetsLiabilitiesDrawer from './Drawer/AssetsLiabilitiesDrawer';
import AcademicResultsDrawer from './Drawer/AcademicResultsDrawer';
import VoluntaryServiceDrawer from './Drawer/VoluntaryServiceDrawer';
import PaymentDrawer from './Drawer/PaymentDrawer';
import InterviewDrawer from './Drawer/InterviewDrawer';
import TaskDetailsDrawer from './Drawer/TaskDetailsDrawer';
import { ThemeContext } from '../config/ThemeContext';
// import WillowTonLogo from "../images/willowton_logo.png";

const StudentDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isDarkMode } = useContext(ThemeContext);
  const [studentDetails, setStudentDetails] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentid, setSelectedStudentid] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aboutMeDrawerOpen, setAboutMeDrawerOpen] = useState(false);
  const [editingAboutMeId, setEditingAboutMeId] = useState(null);
  const [parentsDrawerOpen, setParentsDrawerOpen] = useState(false);
  const [editingParentId, setEditingParentId] = useState(null);
  const [universityDetailsDrawerOpen, setUniversityDetailsDrawerOpen] = useState(false);
  const [editingUniversityId, setEditingUniversityId] = useState(null);
  const [attachmentsDrawerOpen, setAttachmentsDrawerOpen] = useState(false);
  const [editingAttachmentId, setEditingAttachmentId] = useState(null);
  const [expenseDetailsDrawerOpen, setExpensesSummaryDrawerOpen] = useState(false);
  const [editingExpenseDetailsId, setEditingExpenseDetailsId] = useState(null);
  const [assetsLiabilitiesDrawerOpen, setAssetsLiabilitiesDrawerOpen] = useState(false);
  const [editingAssetLiabilityId, setEditingAssetLiabilityId] = useState(null);
  const [academicResultsDrawerOpen, setAcademicResultsDrawerOpen] = useState(false);
  const [editingAcademicResultId, setEditingAcademicResultId] = useState(null);
  const [voluntaryServiceDrawerOpen, setVoluntaryServiceDrawerOpen] = useState(false);
  const [editingVoluntaryServiceId, setEditingVoluntaryServiceId] = useState(null);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [interviewDrawerOpen, setInterviewDrawerOpen] = useState(false);
  const [editingInterviewId, setEditingInterviewId] = useState(null);
  const [tasksDrawerOpen, setTasksDrawerOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.user_type === 'admin';
  const isStudent = user?.user_type === 'student';

  const pageStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#e1f5fe',
    color: isDarkMode ? '#ffffff' : '#000000',
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    const formattedDate = date.toLocaleString('en-GB', options).replace(',', '');
    return formattedDate.replace(/\//g, '/');
  };

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

  const generateLatex = (data) => {
    if (!data) return '';

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

    const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : 'N/A');

    const attachmentsTable = attachments
      .map(
        (item) =>
          `${escapeLatex(item.attachments_name)} & ${escapeLatex(item.attachments_description)} & ${formatDate(item.attachments_date_stamp)} \\\\`
      )
      .join('\n');

    const parentsTable = parents_details
      .map(
        (item) =>
          `${escapeLatex(item.parent_name)} & ${escapeLatex(item.parent_surname)} & ${escapeLatex(item.parent_relationship)} & ${escapeLatex(item.parent_email_address)} & ${escapeLatex(item.parent_cell_number)} & ${formatDate(item.parent_date_stamp)} \\\\`
      )
      .join('\n');

    const paymentsTable = payments
      .map(
        (item) =>
          `${escapeLatex(item.payments_date)} & ${escapeLatex(item.payments_expense_type)} & ${escapeLatex(item.payments_expense_amount)} & ${escapeLatex(item.payments_vendor)} & ${escapeLatex(item.payments_attachment_name)} \\\\`
      )
      .join('\n');

    const resultsTable = results
      .map(
        (item) =>
          `${escapeLatex(item.results_module)} & ${escapeLatex(item.results_percentage)} & ${escapeLatex(item.results_attachment_name)} \\\\`
      )
      .join('\n');

    const tasksTable = tasks
      .map(
        (item) =>
          `${escapeLatex(item.task_description)} & ${escapeLatex(item.task_status)} & ${escapeLatex(item.task_comment)} \\\\`
      )
      .join('\n');

    const voluntaryServiceTable = voluntary_service
      .map(
        (item) =>
          `${escapeLatex(item.organisation)} & ${escapeLatex(item.hours_contributed)} & ${escapeLatex(item.contact_person)} & ${escapeLatex(item.contact_person_number)} \\\\`
      )
      .join('\n');

    return `\\documentclass[a4paper,11pt]{article}
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
\\usepackage{graphicx}

\\definecolor{headerblue}{RGB}{0, 51, 102}
\\definecolor{lightgray}{RGB}{230, 230, 230}

\\titleformat{\\section}{\\Large\\bfseries\\color{headerblue}}{\\thesection}{1em}{}
\\titleformat{\\subsection}{\\large\\bfseries\\color{headerblue}}{\\thesubsection}{1em}{}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\includegraphics[height=1cm]{willowton_logo.png}}
\\fancyhead[R]{\\textbf{Generated on \\today}}
\\fancyfoot[C]{\\thepage}

\\newcolumntype{L}[1]{>{\\raggedright\\arraybackslash}p{#1}}

\\begin{document}

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
    \\item \\textbf{Briefly describe the applicant's family & social financial conditions?} ${escapeLatex(interview.interview_q01)} \\\\
    \\item \\textbf{Employment Status Score} ${escapeLatex(interview.interview_q02)} \\\\
    \\item \\textbf{Year of Study} ${escapeLatex(interview.interview_q03)} \\\\
    \\item \\textbf{Degree/Diploma Name} ${escapeLatex(interview.interview_q04)} \\\\
    \\item \\textbf{Number of Years to Qualify} ${escapeLatex(interview.interview_q05)} \\\\
    \\item \\textbf{Reason for Choosing the Course} ${escapeLatex(interview.interview_q06)} \\\\
    \\item \\textbf{Field of Study Score} ${escapeLatex(interview.interview_q07)} \\\\
    \\item \\textbf{APS Score (Matric) or University Average} ${escapeLatex(interview.interview_q08)} \\\\
    \\item \\textbf{Number of Failed Modules} ${escapeLatex(interview.interview_q09)} \\\\
    \\item \\textbf{Academic Results Score} ${escapeLatex(interview.interview_q10)} \\\\
    \\item \\textbf{Have you worked on any special projects or initiatives?} ${escapeLatex(interview.interview_q11)} \\\\
    \\item \\textbf{What extracurricular activities have you participated in?} ${escapeLatex(interview.interview_q12)} \\\\
    \\item \\textbf{How do you plan to contribute to your community post-graduation?} ${escapeLatex(interview.interview_q13)} \\\\
    \\item \\textbf{How would you inspire others to make an impact?} ${escapeLatex(interview.interview_q14)} \\\\
    \\item \\textbf{Community Work Involvement Score} ${escapeLatex(interview.interview_q15)} \\\\
    \\item \\textbf{How will you use your education and skills to make an impact?} ${escapeLatex(interview.interview_q16)} \\\\
    \\item \\textbf{Can you share academic awards or scholarships received?} ${escapeLatex(interview.interview_q17)} \\\\
    \\item \\textbf{Describe a role model and why they inspire you?} ${escapeLatex(interview.interview_q18)} \\\\
    \\item \\textbf{Why do you believe you deserve this bursary?} ${escapeLatex(interview.interview_q19)} \\\\
    \\item \\textbf{If not awarded this bursary, what are your plans?} ${escapeLatex(interview.interview_q20)} \\\\
    \\item \\textbf{Motivation Score} ${escapeLatex(interview.interview_q21)} \\\\
    \\item \\textbf{Total Score} ${escapeLatex(interview.interview_q22)} \\\\
    \\item \\textbf{Comments Section} ${escapeLatex(interview.interview_q23)} \\\\
    \\item \\textbf{Overall Impression} ${escapeLatex(interview.interview_q24)} \\\\
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
  };

  const downloadLatex = async () => {
    if (!selectedStudentid) return;

    setPdfLoading(true);
    setPdfError(null);

    try {
      const response = await axios.get(`https://willowtonbursary.co.za/api/student-data/${selectedStudentid}`);
      const data = response.data;

      const latexContent = generateLatex(data);

      // Call the new backend endpoint
      const compileResponse = await axios.post(
        'https://willowtonbursary.co.za/api/compile-latex',
        { latexContent },
        { responseType: 'blob' }
      );

      // Check if response is a PDF
      if (compileResponse.headers['content-type'] === 'application/pdf') {
        const blob = new Blob([compileResponse.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `StudentReport_${selectedStudentid}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const text = await compileResponse.data.text();
        throw new Error(`Failed to compile LaTeX: ${text}`);
      }
    } catch (err) {
      setPdfError(err.message || 'Failed to generate PDF');
      console.error('Download error:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
      }
    } finally {
      setPdfLoading(false);
    }
  };

  const fetchStudentDetails = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.user_id;

      let response;
      if (user.user_type === 'admin') {
        response = await fetch("https://willowtonbursary.co.za/api/student-details");
      } else if (user.user_type === 'student' && userId) {
        response = await fetch(`https://willowtonbursary.co.za/api/student-detail/${userId}`);
      } else {
        console.error("User type is neither admin nor student or user ID is missing");
        return {};
      }

      const data = await response.json();

      if (data) {
        const updatedStudent = Array.isArray(data) ? data[0] : data;
        Object.keys(updatedStudent).forEach((key) => {
          if (key.toLowerCase().includes('date_stamp')) {
            updatedStudent[key] = formatDate(updatedStudent[key]);
          }
        });
        setStudentDetails(Array.isArray(data) ? data : [updatedStudent]);
        setSelectedStudent(updatedStudent);
        setSelectedStudentid(updatedStudent.id);
      }

      return data;
    } catch (error) {
      console.error("Error fetching student details:", error);
      return {};
    }
  }, []);

  const handleDeleteStudent = async (studentId) => {
    if (isStudent) {
      setSelectedStudent(null);
      setSelectedStudentid(null);
    } else if (isAdmin) {
      const remainingStudents = studentDetails.filter(student => student.id !== studentId);
      if (remainingStudents.length > 0) {
        const nextStudent = remainingStudents[0];
        setSelectedStudent(nextStudent);
        setSelectedStudentid(nextStudent.id);
      } else {
        setSelectedStudent(null);
        setSelectedStudentid(null);
      }
      fetchStudentDetails();
    }
  };

  const isStudentWithNoData = isStudent && !selectedStudent;
  const isUserWithData = (isAdmin || isStudent) && selectedStudent;
  const isSelectedStudent = selectedStudent;

  const fetchAboutMe = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/about-me/${studentId}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        const formattedData = data.map(item => {
          const updatedItem = { ...item };
          Object.keys(updatedItem).forEach((key) => {
            if (key.toLowerCase().endsWith('date_stamp')) {
              updatedItem[key] = formatDate(updatedItem[key]);
            }
          });
          return updatedItem;
        });
        setAboutMe(formattedData);
      } else {
        setAboutMe([]);
      }
    } catch (error) {
      console.error("Error refetching About Me:", error);
    }
  };

  const fetchParentsDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/parents-details/${studentId}`);
      const data = await response.json();
      const formattedData = data.map(item => {
        const updatedItem = { ...item };
        Object.keys(updatedItem).forEach((key) => {
          if (key.toLowerCase().endsWith('date_stamp')) {
            updatedItem[key] = formatDate(updatedItem[key]);
          }
        });
        return updatedItem;
      });
      setParentsDetails(formattedData);
    } catch (error) {
      console.error("Error fetching parent details:", error);
    }
  };

  const fetchUniversityDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/university-details/${studentId}`);
      const data = await response.json();
      const formattedData = data.map(item => {
        const updatedItem = { ...item };
        Object.keys(updatedItem).forEach((key) => {
          if (key.toLowerCase().endsWith('date_stamp')) {
            updatedItem[key] = formatDate(updatedItem[key]);
          }
        });
        return updatedItem;
      });
      setUniversityDetails(formattedData);
    } catch (error) {
      console.error("Error fetching university details:", error);
    }
  };

  const fetchAttachmentsDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/attachments/${studentId}`);
      const data = await response.json();
      const formattedData = data.map(item => {
        const updatedItem = { ...item };
        Object.keys(updatedItem).forEach((key) => {
          if (key.toLowerCase().endsWith('date_stamp')) {
            updatedItem[key] = formatDate(updatedItem[key]);
          }
        });
        return updatedItem;
      });
      setAttachments(formattedData);
    } catch (error) {
      console.error("Error fetching attachments:", error);
    }
  };

  const fetchExpenseDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/expense-details/${studentId}`);
      const data = await response.json();
      const formattedData = data.map(item => {
        const updatedItem = { ...item };
        Object.keys(updatedItem).forEach((key) => {
          if (key.toLowerCase().endsWith('date_stamp')) {
            updatedItem[key] = formatDate(updatedItem[key]);
          }
        });
        return updatedItem;
      });
      setExpensesSummary(formattedData);
    } catch (error) {
      console.error("Error fetching expense details:", error);
    }
  };

  const fetchAssetsLiabilities = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/assets-liabilities/${studentId}`);
      const data = await response.json();
      const formattedData = data.map(item => {
        const updatedItem = { ...item };
        Object.keys(updatedItem).forEach((key) => {
          if (key.toLowerCase().endsWith('date_stamp')) {
            updatedItem[key] = formatDate(updatedItem[key]);
          }
        });
        return updatedItem;
      });
      setAssetsLiabilities(formattedData);
    } catch (err) {
      console.error("Error fetching assets & liabilities:", err);
    }
  };

  const fetchAcademicResults = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/academic-results/${studentId}`);
      const data = await response.json();
      const formattedData = data.map(item => {
        const updatedItem = { ...item };
        Object.keys(updatedItem).forEach((key) => {
          if (key.toLowerCase().endsWith('date_stamp')) {
            updatedItem[key] = formatDate(updatedItem[key]);
          }
        });
        return updatedItem;
      });
      setAcademicResults(formattedData);
    } catch (err) {
      console.error("Error fetching academic results:", err);
    }
  };

  const fetchVoluntaryServices = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/voluntary-service/${studentId}`);
      const data = await response.json();
      const formattedData = data.map(item => {
        const updatedItem = { ...item };
        Object.keys(updatedItem).forEach((key) => {
          if (key.toLowerCase().endsWith('date_stamp')) {
            updatedItem[key] = formatDate(updatedItem[key]);
          }
        });
        return updatedItem;
      });
      setVoluntaryServices(formattedData);
    } catch (err) {
      console.error("Error fetching voluntary services:", err);
    }
  };

  const fetchPaymentsDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/payments/${studentId}`);
      const data = await response.json();
      const formattedData = data.map(item => {
        const updatedItem = { ...item };
        Object.keys(updatedItem).forEach((key) => {
          if (key.toLowerCase().endsWith('date_stamp')) {
            updatedItem[key] = formatDate(updatedItem[key]);
          }
        });
        return updatedItem;
      });
      setPayments(formattedData);
    } catch (error) {
      console.error("Error fetching payments details:", error);
    }
  };

  const fetchInterviewsDetails = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/interviews/${studentId}`);
      const data = await response.json();
      const formattedData = data.map(item => {
        const updatedItem = { ...item };
        Object.keys(updatedItem).forEach((key) => {
          if (key.toLowerCase().endsWith('date_stamp')) {
            updatedItem[key] = formatDate(updatedItem[key]);
          }
        });
        return updatedItem;
      });
      setInterviews(formattedData);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  const fetchTasks = async (studentId) => {
    try {
      const response = await fetch(`https://willowtonbursary.co.za/api/tasks/${studentId}`);
      const data = await response.json();
      const formattedData = data.map(item => {
        const updatedItem = { ...item };
        Object.keys(updatedItem).forEach((key) => {
          if (key.toLowerCase().endsWith('date_stamp')) {
            updatedItem[key] = formatDate(updatedItem[key]);
          }
        });
        return updatedItem;
      });
      setTasks(formattedData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchStudentDetails().then((data) => {
      if (data.length > 0) {
        setSelectedStudent(data[0]);
        setSelectedStudentid(data[0].id);
      }
    });
  }, [fetchStudentDetails]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const renderDrawer = () => (
    <DrawerForm
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      studentId={selectedStudentid}
      onSave={(savedStudent) => {
        if (savedStudent && typeof savedStudent === "object" && savedStudent.id) {
          const formattedStudent = {
            ...savedStudent,
            ...Object.keys(savedStudent).reduce((acc, key) => {
              if (key.toLowerCase().includes("date") && savedStudent[key]) {
                acc[key] = formatDate(savedStudent[key]);
              } else {
                acc[key] = savedStudent[key];
              }
              return acc;
            }, {}),
          };
          setStudentDetails((prev) => {
            const existingIndex = prev.findIndex((s) => s.id === savedStudent.id);
            if (existingIndex >= 0) {
              const updatedDetails = [...prev];
              updatedDetails[existingIndex] = formattedStudent;
              return updatedDetails;
            } else {
              return [...prev, formattedStudent];
            }
          });
          setSelectedStudent(formattedStudent);
          setSelectedStudentid(formattedStudent.id);
        } else {
          console.error("Invalid savedStudent data:", savedStudent);
        }
        setDrawerOpen(false);
        fetchStudentDetails();
      }}
      onDelete={handleDeleteStudent}
    />
  );

  const tabSections = [
    { label: "Show all", key: "show_all" },
    { label: "About Me", key: "about-me" },
    { label: "Parents Details", key: "parents-details" },
    { label: "University Details", key: "university-details" },
    { label: "Attachments", key: "attachments" },
    { label: "Financial Details", key: "expenses-summary" },
    { label: "Assets & Liabilities", key: "assets-liabilities" },
    { label: "Academic Results", key: "academic-results" },
    { label: "Voluntary Services", key: "voluntary-services" },
    { label: "Tasks", key: "tasks" },
  ];

  if (isAdmin) {
    tabSections.splice(9, 0, 
      { label: "Payments", key: "payments" },
      { label: "Interviews", key: "interviews" }
    );
  }

  const capitalizeWords = (str) => {
    if (str.toLowerCase() === "student id passport number") {
      return "ID/Passport Number";
    }
    if (str.toLowerCase() === "student willow relationship") {
      return "Willowton Group Relationship";
    }
    const formattedStr = str.replace(/^student /i, '').replace(/_/g, "");
    return formattedStr.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const dataForSection = (key) => {
    const mapping = {
      "about-me": aboutMe,
      "parents-details": parentsDetails,
      "university-details": universityDetails,
      "attachments": attachments,
      "expenses-summary": expensesSummary,
      "assets-liabilities": assetsLiabilities,
      "academic-results": academicResults,
      "voluntary-services": voluntaryServices,
      "payments": payments,
      "interviews": interviews,
      "tasks": tasks
    };
    return mapping[key] || [];
  };

  const [aboutMe, setAboutMe] = useState(null);
  const [parentsDetails, setParentsDetails] = useState(null);
  const [universityDetails, setUniversityDetails] = useState(null);
  const [attachments, setAttachments] = useState(null);
  const [expensesSummary, setExpensesSummary] = useState(null);
  const [assetsLiabilities, setAssetsLiabilities] = useState(null);
  const [academicResults, setAcademicResults] = useState(null);
  const [voluntaryServices, setVoluntaryServices] = useState(null);
  const [payments, setPayments] = useState(null);
  const [interviews, setInterviews] = useState(null);
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    if (selectedStudent) {
      const fetchAllData = async () => {
        try {
          const responses = await Promise.all(
            ["about-me", "parents-details", "university-details", "attachments", "expenses-summary", "assets-liabilities", "academic-results", "voluntary-services", "payments", "interviews", "tasks"]
              .map((key) => fetch(`https://willowtonbursary.co.za/api/${key}/${selectedStudent.id}`).then(res => res.json()))
          );

          const formatResponseData = (data) => {
            return data.map(item => {
              const updatedItem = { ...item };
              Object.keys(updatedItem).forEach((key) => {
                if (key.toLowerCase().endsWith('date_stamp') && updatedItem[key]) {
                  updatedItem[key] = formatDate(updatedItem[key]);
                }
              });
              return updatedItem;
            });
          };

          setAboutMe(formatResponseData(responses[0]));
          setParentsDetails(formatResponseData(responses[1]));
          setUniversityDetails(formatResponseData(responses[2]));
          setAttachments(formatResponseData(responses[3]));
          setExpensesSummary(formatResponseData(responses[4]));
          setAssetsLiabilities(formatResponseData(responses[5]));
          setAcademicResults(formatResponseData(responses[6]));
          setVoluntaryServices(formatResponseData(responses[7]));
          setPayments(formatResponseData(responses[8]));
          setInterviews(formatResponseData(responses[9]));
          setTasks(formatResponseData(responses[10]));
        } catch (error) {
          console.error("Error fetching section data:", error);
        }
      };
      fetchAllData();
    }
  }, [selectedStudent]);

  const renderRegion = (sectionKey, data) => {
    if (!data) return null;

    const isAboutMe = sectionKey === "about-me";
    const isParents = sectionKey === "parents-details";
    const isUniversityDetails = sectionKey === "university-details";
    const isAttachments = sectionKey === "attachments";
    const isExpenses = sectionKey === "expenses-summary";
    const isAssetsLiabilities = sectionKey === "assets-liabilities";
    const isAcademicResults = sectionKey === "academic-results";
    const isVoluntaryServices = sectionKey === "voluntary-services";
    const isPayments = sectionKey === "payments";
    const isInterview = sectionKey === "interviews";
    const isTasks = sectionKey === "tasks";

    if ((isPayments || isInterview) && !isAdmin) return null;

    return (
      <Box sx={{ padding: 0, border: '1px solid #ccc', marginBottom: 2, backgroundColor: isDarkMode ? '#1e293b' : 'white', color: pageStyle.color }}>
        <Box sx={{ padding: 1, display: 'flex', alignItems: 'center', marginBottom: 0.5, borderBottom: 1, borderBottomColor: '#ccc', height: 40, backgroundColor: isDarkMode ? '#1e293b' : '#e1f5fe' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginLeft: 1 }}>
            {capitalizeWords(sectionKey === "expenses-summary" ? "financial-details" : sectionKey)}
          </Typography>
          {isSelectedStudent && (isAboutMe || isParents || isUniversityDetails || isAttachments || isExpenses
            || isAssetsLiabilities || isAcademicResults || isVoluntaryServices || isPayments || isInterview || isTasks) && (
              <Button
                sx={{ marginLeft: 'auto', color: isDarkMode ? 'white' : 'black' }}
                onClick={() => {
                  if (isAboutMe) {
                    setEditingAboutMeId(null);
                    setAboutMeDrawerOpen(true);
                  }
                  if (isParents) {
                    setEditingParentId(null);
                    setParentsDrawerOpen(true);
                  }
                  if (isUniversityDetails) {
                    setEditingUniversityId(null);
                    setUniversityDetailsDrawerOpen(true);
                  }
                  if (isAttachments) {
                    setEditingAttachmentId(null);
                    setAttachmentsDrawerOpen(true);
                  }
                  if (isExpenses) {
                    setEditingExpenseDetailsId(null);
                    setExpensesSummaryDrawerOpen(true);
                  }
                  if (isAssetsLiabilities) {
                    setEditingAssetLiabilityId(null);
                    setAssetsLiabilitiesDrawerOpen(true);
                  }
                  if (isAcademicResults) {
                    setEditingAcademicResultId(null);
                    setAcademicResultsDrawerOpen(true);
                  }
                  if (isVoluntaryServices) {
                    setEditingVoluntaryServiceId(null);
                    setVoluntaryServiceDrawerOpen(true);
                  }
                  if (isPayments) {
                    setEditingPaymentId(null);
                    setPaymentDrawerOpen(true);
                  }
                  if (isInterview) {
                    setEditingInterviewId(null);
                    setInterviewDrawerOpen(true);
                  }
                  if (isTasks) {
                    setEditingTaskId(null);
                    setTasksDrawerOpen(true);
                  }
                }}
              >
                <AddIcon fontSize="small" />
              </Button>
            )}
        </Box>
        {data.length > 0 && (
          <Table sx={{ maxHeight: 400, overflowY: 'auto', display: 'block' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: '50px' }} />
                {Object.keys(data[0])
                  .filter(field => field !== "id" && field !== "student_details_portal_id")
                  .map((field, idx) => (
                    <TableCell key={idx}
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 300,
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                        color: isDarkMode ? 'white' : 'black'
                      }}>
                      {capitalizeWords(field.replace(/_/g, " "))}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ width: '50px' }}>
                    {(isAboutMe || isParents || isUniversityDetails || isAttachments || isExpenses
                      || isAssetsLiabilities || isAcademicResults || isVoluntaryServices || isPayments || isInterview || isTasks) && (
                        <EditIcon
                          sx={{ cursor: 'pointer', fontSize: 'large', color: isDarkMode ? 'white' : 'black' }}
                          onClick={() => {
                            if (isAboutMe) {
                              setEditingAboutMeId(row.id);
                              setAboutMeDrawerOpen(true);
                            }
                            if (isParents) {
                              setEditingParentId(row.id);
                              setParentsDrawerOpen(true);
                            }
                            if (isUniversityDetails) {
                              setEditingUniversityId(row.id);
                              setUniversityDetailsDrawerOpen(true);
                            }
                            if (isAttachments) {
                              setEditingAttachmentId(row.id);
                              setAttachmentsDrawerOpen(true);
                            }
                            if (isExpenses) {
                              setEditingExpenseDetailsId(row.id);
                              setExpensesSummaryDrawerOpen(true);
                            }
                            if (isAssetsLiabilities) {
                              setEditingAssetLiabilityId(row.id);
                              setAssetsLiabilitiesDrawerOpen(true);
                            }
                            if (isAcademicResults) {
                              setEditingAcademicResultId(row.id);
                              setAcademicResultsDrawerOpen(true);
                            }
                            if (isVoluntaryServices) {
                              setEditingVoluntaryServiceId(row.id);
                              setVoluntaryServiceDrawerOpen(true);
                            }
                            if (isPayments) {
                              setEditingPaymentId(row.id);
                              setPaymentDrawerOpen(true);
                            }
                            if (isInterview) {
                              setEditingInterviewId(row.id);
                              setInterviewDrawerOpen(true);
                            }
                            if (isTasks) {
                              setEditingTaskId(row.id);
                              setTasksDrawerOpen(true);
                            }
                          }}
                        />
                      )}
                  </TableCell>
                  {Object.entries(row).map(([key, val], j) =>
                    key !== "id" && key !== "student_details_portal_id" && (
                      <TableCell key={j} sx={{ color: isDarkMode ? 'white' : 'black' }}>
                        {typeof val === 'object' && val !== null
                          ? (key.toLowerCase().includes("attachment") || key.toLowerCase().includes("proof_of_service")
                            || key.toLowerCase().includes("proof_of_payment")
                            ? "📎 File attached"
                            : JSON.stringify(val))
                          : val
                        }
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    );
  };

  const TabContent = ({ sectionKey, data }) => renderRegion(sectionKey, data);

  const renderTabContent = (tabValue) => {
    const section = tabSections[tabValue];
    return section.key === "show_all"
      ? tabSections.filter(s => s.key !== "show_all").map((sec, i) => (
        (isAdmin || (sec.key !== 'payments' && sec.key !== 'interviews')) && (
          <TabContent key={i} sectionKey={sec.key} data={dataForSection(sec.key)} />
        )
      ))
      : <TabContent sectionKey={section.key} data={dataForSection(section.key)} />;
  };

  return (
    <div>
      <Box sx={{ padding: "12px", backgroundColor: isDarkMode ? '#1e293b' : '#e1f5fe', borderRadius: "8px", marginBottom: "12px", display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ccc' }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: isDarkMode ? 'white' : 'black' }}>Student Details</Typography>
        {isStudentWithNoData && (
          <Button
            variant="contained"
            onClick={() => {
              setSelectedStudentid(null);
              setDrawerOpen(true);
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: isDarkMode ? 'white' : 'black',
              color: isDarkMode ? 'black' : 'white',
              padding: '2px 6px',
              textTransform: 'none',
            }}
          >
            <AddIcon sx={{ marginRight: 1, fontSize: 'small' }} />
            Start Application
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {isAdmin && (
          <Grid item xs={12} sm={3} md={2}>
            <Paper sx={{ border: '1px solid #ccc', backgroundColor: isDarkMode ? '#1e293b' : 'white', color: pageStyle.color }}>
              <Box sx={{ backgroundColor: isDarkMode ? '#1e293b' : '#e1f5fe', padding: "6px", borderBottom: isDarkMode ? '1px solid white' : '1px solid #ccc' }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: isDarkMode ? 'white' : '#1e293b', marginLeft: 1 }}>Search</Typography>
              </Box>
              <Box sx={{ padding: 2 }}>
                <TextField
                  label="Search"
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: isDarkMode ? '#1e293b' : 'white',
                      '& fieldset': {
                        borderColor: isDarkMode ? 'white' : '#1e293b',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? 'white' : '#1e293b',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: isDarkMode ? 'white' : '#1e293b',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: isDarkMode ? 'white' : '#1e293b',
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: isDarkMode ? '#B0B0B0' : '#666',
                    }
                  }}
                  placeholder="Search"
                  InputLabelProps={{ style: { color: isDarkMode ? '#ffffff' : '#000000' } }}
                />
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {studentDetails
                    .filter((s) =>
                      s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.student_surname.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((student, idx) => (
                      <Card
                        key={idx}
                        sx={{
                          mb: 0.5,
                          boxShadow: 0,
                          height: 55,
                          cursor: "pointer",
                          backgroundColor: selectedStudent?.id === student.id ? (isDarkMode ? 'white' : '#1e293b') : 'transparent',
                          color: selectedStudent?.id === student.id ? (isDarkMode ? '#1e293b' : 'white') : "inherit",
                          "&:hover": {
                            backgroundColor: isDarkMode ? 'white' : '#1e293b',
                            color: isDarkMode ? '#1e293b' : 'white',
                          }
                        }}
                        onClick={() => {
                          setSelectedStudent(student);
                          setSelectedStudentid(student.id);
                        }}
                      >
                        <CardContent sx={{ padding: "10px" }}>
                          <Typography variant="body1" sx={{ fontWeight: "bold" }}>{student.student_name}</Typography>
                          <Typography variant="body2">{student.student_surname}</Typography>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </Box>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} sm={9} md={isStudent ? 12 : 10}>
          <Paper sx={{ border: '1px solid #ccc', backgroundColor: isDarkMode ? '#1e293b' : 'white', color: pageStyle.color }}>
            <Box sx={{ backgroundColor: isDarkMode ? '#1e293b' : '#e1f5fe', borderBottom: isDarkMode ? '1px solid white' : '1px solid #ccc', padding: "6px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: isDarkMode ? 'white' : '#1e293b', marginLeft: 1 }}>Student Details Portal</Typography>
              {isUserWithData && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setDrawerOpen(false);
                      setTimeout(() => setDrawerOpen(true), 50);
                      setSelectedStudentid(selectedStudent?.id);
                    }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: isDarkMode ? 'white' : 'black',
                      color: isDarkMode ? 'black' : 'white',
                      padding: '2px 6px',
                      textTransform: 'none',
                    }}
                  >
                    <EditIcon sx={{ marginRight: 1, fontSize: 'small' }} />
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    onClick={downloadLatex}
                    disabled={pdfLoading || !selectedStudentid}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: isDarkMode ? 'white' : 'black',
                      color: isDarkMode ? 'black' : 'white',
                      padding: '2px 6px',
                      textTransform: 'none',
                    }}
                  >
                    {pdfLoading ? (
                      <CircularProgress size={16} sx={{ marginRight: 1, color: isDarkMode ? 'black' : 'white' }} />
                    ) : (
                      <GetAppIcon sx={{ marginRight: 1, fontSize: 'small' }} />
                    )}
                    Download PDF
                  </Button>
                </Box>
              )}
            </Box>

            {pdfError && (
              <Typography variant="body2" color="error" sx={{ p: 1 }}>
                {pdfError}
              </Typography>
            )}

            {selectedStudent ? (
              <Box sx={{ padding: 1.5 }}>
                <Grid container spacing={1}>
                  {Object.entries(selectedStudent).map(([key, value], i) => (
                    key !== "id" && key !== "user_id" && key !== "employment_status_attachment" && (
                      <React.Fragment key={i}>
                        <Grid item xs={6} sx={{ borderBottom: '1px solid #ccc', pb: '6px' }}>
                          <Typography variant="body1"><strong>{capitalizeWords(key.replace(/_/g, " "))}</strong></Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ borderBottom: '1px solid #ccc', pb: '6px' }}>
                          <Typography variant="body1">{value}</Typography>
                        </Grid>
                      </React.Fragment>
                    )
                  ))}
                </Grid>
              </Box>
            ) : (
              <Typography variant="body1" sx={{ m: 2, fontWeight: 'bold' }}>No Record Selected</Typography>
            )}

            <Box sx={{ p: 1, overflowX: 'auto' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="tabs"
                sx={{
                  "& .MuiTab-root": {
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    mr: -2,
                    color: isDarkMode ? 'white' : 'black'
                  }
                }}
              >
                {tabSections.map((section, i) => (
                  <Tab key={i} label={section.label} />
                ))}
              </Tabs>
            </Box>

            <Box sx={{ p: 2 }}>
              {renderTabContent(tabValue)}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {renderDrawer()}

      <AboutusDrawer
        open={aboutMeDrawerOpen}
        onClose={() => {
          setAboutMeDrawerOpen(false);
          setEditingAboutMeId(null);
        }}
        studentId={selectedStudentid}
        aboutMeId={editingAboutMeId}
        onSave={() => {
          if (selectedStudentid) {
            fetchAboutMe(selectedStudentid);
          }
          setAboutMeDrawerOpen(false);
          setEditingAboutMeId(null);
        }}
      />

      <ParentsDrawer
        open={parentsDrawerOpen}
        onClose={() => {
          setParentsDrawerOpen(false);
          setEditingParentId(null);
        }}
        studentId={selectedStudentid}
        parentId={editingParentId}
        onSave={() => {
          if (selectedStudentid) {
            fetchParentsDetails(selectedStudentid);
          }
          setParentsDrawerOpen(false);
          setEditingParentId(null);
        }}
      />

      <UniversityDetailsDrawer
        open={universityDetailsDrawerOpen}
        onClose={() => {
          setUniversityDetailsDrawerOpen(false);
          setEditingUniversityId(null);
        }}
        studentId={selectedStudentid}
        universityDetailsId={editingUniversityId}
        onSave={() => {
          if (selectedStudentid) {
            fetchUniversityDetails(selectedStudentid);
          }
          setUniversityDetailsDrawerOpen(false);
          setEditingUniversityId(null);
        }}
      />

      <AttachmentsDrawer
        open={attachmentsDrawerOpen}
        onClose={() => {
          setAttachmentsDrawerOpen(false);
          setEditingAttachmentId(null);
        }}
        studentId={selectedStudentid}
        attachmentId={editingAttachmentId}
        onSave={() => {
          if (selectedStudentid) {
            fetchAttachmentsDetails(selectedStudentid);
          }
          setAttachmentsDrawerOpen(false);
          setEditingAttachmentId(null);
        }}
      />

      <ExpenseDetailsDrawer
        open={expenseDetailsDrawerOpen}
        onClose={() => {
          setExpensesSummaryDrawerOpen(false);
          setEditingExpenseDetailsId(null);
        }}
        studentId={selectedStudentid}
        expenseDetailsId={editingExpenseDetailsId}
        onSave={() => {
          if (selectedStudentid) {
            fetchExpenseDetails(selectedStudentid);
          }
          setExpensesSummaryDrawerOpen(false);
          setEditingExpenseDetailsId(null);
        }}
      />

      <AssetsLiabilitiesDrawer
        open={assetsLiabilitiesDrawerOpen}
        onClose={() => {
          setAssetsLiabilitiesDrawerOpen(false);
          setEditingAssetLiabilityId(null);
        }}
        studentId={selectedStudentid}
        assetLiabilityId={editingAssetLiabilityId}
        onSave={() => {
          if (selectedStudentid) fetchAssetsLiabilities(selectedStudentid);
          setAssetsLiabilitiesDrawerOpen(false);
          setEditingAssetLiabilityId(null);
        }}
      />

      <AcademicResultsDrawer
        open={academicResultsDrawerOpen}
        onClose={() => {
          setAcademicResultsDrawerOpen(false);
          setEditingAcademicResultId(null);
        }}
        studentId={selectedStudentid}
        resultId={editingAcademicResultId}
        onSave={() => {
          if (selectedStudentid) fetchAcademicResults(selectedStudentid);
          setAcademicResultsDrawerOpen(false);
          setEditingAcademicResultId(null);
        }}
      />

      <VoluntaryServiceDrawer
        open={voluntaryServiceDrawerOpen}
        onClose={() => {
          setVoluntaryServiceDrawerOpen(false);
          setEditingVoluntaryServiceId(null);
        }}
        studentId={selectedStudentid}
        recordId={editingVoluntaryServiceId}
        onSave={() => {
          if (selectedStudentid) fetchVoluntaryServices(selectedStudentid);
          setVoluntaryServiceDrawerOpen(false);
          setEditingVoluntaryServiceId(null);
        }}
      />

      <PaymentDrawer
        open={paymentDrawerOpen}
        onClose={() => setPaymentDrawerOpen(false)}
        studentId={selectedStudentid}
        recordId={editingPaymentId}
        onSave={() => {
          if (selectedStudentid) {
            fetchPaymentsDetails(selectedStudentid);
          }
          setPaymentDrawerOpen(false);
          setEditingPaymentId(null);
        }}
      />

      <InterviewDrawer
        open={interviewDrawerOpen}
        onClose={() => setInterviewDrawerOpen(false)}
        studentId={selectedStudentid}
        recordId={editingInterviewId}
        onSave={() => {
          if (selectedStudentid) {
            fetchInterviewsDetails(selectedStudentid);
          }
          setInterviewDrawerOpen(false);
          setEditingInterviewId(null);
        }}
      />

      <TaskDetailsDrawer
        open={tasksDrawerOpen}
        onClose={() => {
          setTasksDrawerOpen(false);
          setEditingTaskId(null);
        }}
        studentId={selectedStudentid}
        taskId={editingTaskId}
        onSave={() => {
          if (selectedStudentid) {
            fetchTasks(selectedStudentid);
          }
          setTasksDrawerOpen(false);
          setEditingTaskId(null);
        }}
      />
    </div>
  );
};

export default StudentDetails;