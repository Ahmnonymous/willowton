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
    alignItems: 'center',
    borderBottom: '1 solid #ccc',
    marginBottom: 15,
    paddingBottom: 8
  },
  logo: {
    width: 60, // Increased width to ensure the logo is visible
    height: 60, // Increased height to maintain aspect ratio
    marginRight: 10,
    objectFit: 'contain' 
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#E1F5FE',
    padding: 4,
    marginTop: 12,
    marginBottom: 4,
    textTransform: 'uppercase'
  },
  fieldRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4
  },
  fieldBox: {
    width: '50%',
    flexDirection: 'row',
    marginBottom: 2,
    paddingRight: 5
  },
  fieldLabel: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 4,
    fontWeight: 'bold',
    minWidth: 80
  },
  fieldValue: {
    paddingHorizontal: 4
  },
  lineSeparator: {
    borderBottom: '0.5 solid #ccc',
    marginVertical: 4
  }
});

// Helper function to convert snake_case to Sentence Case
const toSentenceCase = (str) => {
  return str
    .replace(/_/g, ' ') // Replace underscores with spaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Component to render a field with label and value
const FieldPair = ({ label, value }) => (
  <View style={styles.fieldBox}>
    <Text style={styles.fieldLabel}>{toSentenceCase(label)}:</Text>
    <Text style={styles.fieldValue}>{value || '—'}</Text>
  </View>
);

// Section for flat objects (single records)
const RenderSection = ({ title, data }) => {
  const entries = Object.entries(data || {}).filter(([k, v]) => v !== null && v !== '');
  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.fieldRow}>
        {entries.map(([key, value], idx) => (
          <FieldPair key={idx} label={key} value={value} />
        ))}
      </View>
    </View>
  );
};

// Section for arrays (multiple records)
const RenderMultiple = ({ title, data }) => {
  if (!data || data.length === 0) return null;

  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.map((item, idx) => (
        <View key={idx} wrap={false}>
          <View style={styles.fieldRow}>
            {Object.entries(item).map(([key, val], i) => (
              <FieldPair key={i} label={key} value={val} />
            ))}
          </View>
          <View style={styles.lineSeparator} />
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
        <Text style={styles.title}>Student Information Report</Text>
      </View>

      {/* Sections */}
      <RenderSection title="Student Details" data={studentData.student_details} />
      
      <RenderMultiple title="About Me" data={[studentData.about_me]} />
      <RenderMultiple title="Assets & Liabilities" data={[studentData.assets_liabilities]} />
      <RenderMultiple title="Expense Details" data={[studentData.expense_details]} />
      <RenderMultiple title="Interview" data={[studentData.interview]} />
      <RenderMultiple title="University Details" data={[studentData.university_details]} />
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