import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from '@react-pdf/renderer';
import logo from '../images/willowton_logo.png';

// About Me Custom Questions
const aboutMeQuestions = [
  "What inspired you to pursue your chosen field of study?",
  "How do you plan to use your education and skills to make a significant impact in this field?",
  "What special projects or initiatives have you undertaken in your academic life?",
  "Can you tell me about any academic awards or scholarships you have received?",
  "Provide examples or specific skills you have developed that demonstrates your commitment.",
  "What extracurricular activities have you participated in, and how have they contributed to your personal and academic growth?",
  "Once you have completed your studies, how will others benefit from it?",
  "Can you describe any financial challenges you have faced that have affected your ability to pursue your education, and how these challenges have impacted your current financial situation?",
  "Have you previously been awarded a bursary?",
  "What do you think has been your most notable contribution to society thus far?",
  "Why do you think serving the community is important?",
  "Will you be doing any volunteer work during your studies?",
  "Are you willing to assist someone in need?",
  "Describe yourself in three words.",
  "What is your greatest strength?",
  "Describe your biggest mistake and what steps you have taken to rectify it.",
  "What personal achievement makes you proud?",
  "Are you self-motivated? Explain",
  "1st choice of study.",
  "2nd choice of study",
  "3rd choice of study."
];

// Interview Custom Questions
const interviewQuestions = [
  "Briefly describe the applicant's family & social financial conditions?",
  "Employment Status Score",
  "Year of Study",
  "Degree/Diploma Name",
  "Number of Years to Qualify",
  "Reason for Choosing the Course",
  "Field of Study Score",
  "APS Score (Matric) or University Average",
  "Number of Failed Modules",
  "Academic Results Score",
  "Have you worked on any special projects or initiatives?",
  "What extracurricular activities have you participated in?",
  "How do you plan to contribute to your community post-graduation?",
  "How would you inspire others to make an impact?",
  "Community Work Involvement Score",
  "How will you use your education and skills to make an impact?",
  "Can you share academic awards or scholarships received?",
  "Describe a role model and why they inspire you?",
  "Why do you believe you deserve this bursary?",
  "If not awarded this bursary, what are your plans?",
  "Motivation Score",
  "Total Score",
  "Comments Section",
  "Overall Impression"
];

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 8,
    fontFamily: 'Helvetica',
    lineHeight: 1.5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1 solid #ccc',
    marginBottom: 10,
    paddingBottom: 4
  },
  logo: {
    width: 60,
    height: 60,
    objectFit: 'contain'
  },
  headerText: {
    textAlign: 'center',
    flex: 1
  },
  headerTitle1: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 1
  },
  headerTitle2: {
    fontSize: 10,
    fontStyle: 'italic'
  },
  reportTime: {
    fontSize: 8,
    textAlign: 'right'
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#2D3748',
    color: 'white',
    padding: 4,
    marginTop: 10,
    marginBottom: 4,
    width: '100%',
    borderRadius: 4
  },
  studentDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 4,
    marginBottom: 4
  },
  studentDetailsField: {
    width: '49%',
    flexDirection: 'column',
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderBottomStyle: 'solid'
  },
  studentDetailsLabel: {
    fontWeight: 'bold',
    marginBottom: 2
  },
  studentDetailsValue: {
    fontStyle: 'italic'
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    minHeight: 20, // Ensure minimum height for content
  },
  tableCellLabel: {
    width: '40%',
    padding: 4,
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    wordBreak: 'keep-all',   // Don't break in the middle of words
    minWidth: 0,
    overflow: 'hidden'
  },
  tableCellValue: {
    width: 400,
    padding: 4,
    fontStyle: 'italic',
    lineHeight: 0.7,
  },


});

// Breaks long unbroken strings by inserting zero-width space every N characters
const breakLongWords = (str, maxLen = 20) => {
  if (typeof str !== 'string') return str;

  return str
    .split(' ')
    .map(word => {
      if (word.length <= maxLen) return word;

      // insert soft hyphen every maxLen chars
      return word.match(new RegExp(`.{1,${maxLen}}`, 'g')).join('\u00AD');
    })
    .join(' ');
};


// Converts snake_case or raw field names to Sentence Case
const toSentenceCase = (str) => {
  return str
    .replace(/_/g, ' ')
    .split(' ')
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' ');
};

// Removes section prefix from the field name
const removePrefix = (label, sectionTitle) => {
  const cleanLabel = toSentenceCase(label);
  const cleanSection = toSentenceCase(sectionTitle).replace(/s$/, '');
  if (cleanLabel.startsWith(cleanSection + ' ')) {
    return cleanLabel.slice(cleanSection.length + 1);
  }
  return cleanLabel;
};

// Map question to field name
const mapQuestion = (section, key) => {
  const questionMap = {
    'About Me': aboutMeQuestions,
    'Interview': interviewQuestions
  };
  const questions = questionMap[section];
  if (!questions) return removePrefix(key, section);

  const match = key.match(/^(about_me_q|interview_q)(\d+)/i);
  if (match) {
    const index = parseInt(match[2], 10) - 1; // Convert to 0-based index
    return questions[index] || removePrefix(key, section);
  }
  return removePrefix(key, section);
};

// Get current date and time
const getCurrentDateTime = () => {
  const now = new Date();
  return now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Student Details Section
const StudentDetailsSection = ({ data }) => {
  const entries = Object.entries(data || {}).filter(([k, v]) => v !== null && v !== '');
  const rows = [];
  for (let i = 0; i < entries.length; i += 2) {
    rows.push(entries.slice(i, i + 2));
  }
  return (
    <View>
      <Text style={styles.sectionTitle}>Student Details</Text>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.studentDetailsRow}>
          {row.map(([key, value]) => (
            <View key={key} style={styles.studentDetailsField}>
              <Text style={styles.studentDetailsLabel}>{removePrefix(key, 'Student Details')}</Text>
              <Text style={styles.studentDetailsValue}>{value || '—'}</Text>
            </View>
          ))}
          {row.length < 2 && <View style={styles.studentDetailsField} />}
        </View>
      ))}
    </View>
  );
};

// Single Object Section
const RenderSection = ({ title, data }) => {
  if (!data || Object.keys(data).length === 0) return null;
  const entries = Object.entries(data).filter(([k, v]) => v !== null && v !== '');
  return (
    <View>
      <Text style={styles.sectionTitle}>{toSentenceCase(title)}</Text>
      <View style={styles.table}>
        {entries.map(([key, value], idx) => (
          <View key={idx} style={styles.tableRow} wrap={false}>
            <Text style={styles.tableCellLabel}>{mapQuestion(title, key)}</Text>
            <Text style={styles.tableCellValue}>{breakLongWords(value || '—')}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Multiple Records Section
const RenderMultiple = ({ title, data }) => {
  if (!data || data.length === 0) return null;

  const showNumbering = data.length > 1;

  return (
    <View>
      {data.map((item, idx) => (
        <View key={idx}>
          <Text style={styles.sectionTitle}>
            {toSentenceCase(title)}{showNumbering ? ` - ${idx + 1}` : ''}
          </Text>
          <View style={styles.table}>
            {Object.entries(item).map(([key, val], i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableCellLabel}>
                  {removePrefix(key, title)}
                </Text>
                {/* <Text style={styles.tableCellValue}>
                  {val || '—'}
                </Text> */}
                <Text style={styles.tableCellValue}>{breakLongWords(val || '—')}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const StudentPDFDocument = ({ studentData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image src={logo} style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle1}>WillowTon & SANZAF Bursary</Text>
          <Text style={styles.headerTitle2}>Student Detailed Report</Text>
        </View>
        <Text style={styles.reportTime}>{getCurrentDateTime()}</Text>
      </View>

      {/* Sections */}
      <StudentDetailsSection data={studentData.student_details} />
      <RenderSection title="About Me" data={studentData.about_me} />
      <RenderSection title="Assets & Liabilities" data={studentData.assets_liabilities} />
      <RenderSection title="Expense Details" data={studentData.expense_details} />
      <RenderSection title="Interview" data={studentData.interview} />
      <RenderSection title="University Details" data={studentData.university_details} />
      <RenderMultiple title="Parents Details" data={studentData.parents_details} />
      <RenderMultiple title="Attachments" data={studentData.attachments} />
      <RenderMultiple title="Payments" data={studentData.payments} />
      <RenderMultiple title="Results" data={studentData.results} />
      <RenderMultiple title="Tasks" data={studentData.tasks} />
      <RenderMultiple title="Voluntary Service" data={studentData.voluntary_service} />
    </Page>
  </Document>
);

export default StudentPDFDocument;