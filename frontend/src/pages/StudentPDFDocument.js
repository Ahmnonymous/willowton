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
    marginBottom: 8,           // reduced gap
    paddingBottom: 4           // reduced gap
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
    objectFit: 'contain'
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    padding: 4,
    marginTop: 10,
    marginBottom: 4,
    textTransform: 'none'     // changed to keep sentence case
  },
  fieldRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4
  },
  fieldBox: {
    flexBasis: '50%',         // more flexible layout
    flexDirection: 'row',
    marginBottom: 2,
    paddingRight: 5
  },
  fieldLabel: {
    fontWeight: 'bold',
    paddingRight: 4
  },
  fieldValue: {
    paddingRight: 4
  },
  lineSeparator: {
    borderBottom: '0.5 solid #ccc',
    marginVertical: 4
  }
});

// Helper: snake_case to Sentence case
const toSentenceCase = (str) => {
  return str
    .replace(/_/g, ' ')
    .split(' ')
    .map((word, idx) => idx === 0
      ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      : word.toLowerCase())
    .join(' ');
};

const FieldPair = ({ label, value }) => (
  <View style={styles.fieldBox}>
    <Text style={styles.fieldLabel}>{toSentenceCase(label)}:</Text>
    <Text style={styles.fieldValue}>{value || '—'}</Text>
  </View>
);

const RenderSection = ({ title, data }) => {
  const entries = Object.entries(data || {}).filter(([k, v]) => v !== null && v !== '');
  return (
    <View>
      <Text style={styles.sectionTitle}>{toSentenceCase(title)}</Text>
      <View style={styles.fieldRow}>
        {entries.map(([key, value], idx) => (
          <FieldPair key={idx} label={key} value={value} />
        ))}
      </View>
    </View>
  );
};

const RenderMultiple = ({ title, data }) => {
  if (!data || data.length === 0) return null;

  return (
    <View>
      <Text style={styles.sectionTitle}>{toSentenceCase(title)}</Text>
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
        {/* Removed title text */}
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
