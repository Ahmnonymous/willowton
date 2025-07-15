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

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: '1px solid #999',
    paddingBottom: 10
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15
  },
  sectionTitle: {
    backgroundColor: '#eee',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
    padding: 4,
    textTransform: 'uppercase'
  },
  row: {
    flexDirection: 'row',
    marginVertical: 2
  },
  label: {
    width: '40%',
    fontWeight: 'bold'
  },
  value: {
    width: '60%'
  },
  lineSeparator: {
    marginVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#aaa'
  }
});

const KeyValueRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '—'}</Text>
  </View>
);

const Section = ({ title, data }) => (
  <View>
    <Text style={styles.sectionTitle}>{title}</Text>
    {Object.entries(data).map(([key, value]) => (
      <KeyValueRow key={key} label={key.replace(/_/g, ' ')} value={value} />
    ))}
  </View>
);

const SectionWithMultipleRows = ({ title, data, keysPerRow = 2 }) => (
  <View>
    <Text style={styles.sectionTitle}>{title}</Text>
    {data.map((record, idx) => (
      <View key={idx} wrap={false}>
        {Object.entries(record).map(([key, value]) => (
          <KeyValueRow key={key} label={key.replace(/_/g, ' ')} value={value} />
        ))}
        <View style={styles.lineSeparator} />
      </View>
    ))}
  </View>
);

const StudentPDFDocument = ({ studentData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image src={logo} style={styles.logo} />
        <Text>Student Information Report</Text>
      </View>

      <Section title="Student Details" data={studentData.student_details} />
      <Section title="About Me" data={studentData.about_me} />
      <Section title="Assets & Liabilities" data={studentData.assets_liabilities} />
      <Section title="Expense Details" data={studentData.expense_details} />
      <Section title="Interview" data={studentData.interview} />
      <Section title="University Details" data={studentData.university_details} />

      <SectionWithMultipleRows title="Parents Details" data={studentData.parents_details} />
      <SectionWithMultipleRows title="Attachments" data={studentData.attachments} />
      <SectionWithMultipleRows title="Payments" data={studentData.payments} />
      <SectionWithMultipleRows title="Results" data={studentData.results} />
      <SectionWithMultipleRows title="Tasks" data={studentData.tasks} />
      <SectionWithMultipleRows title="Voluntary Service" data={studentData.voluntary_service} />
    </Page>
  </Document>
);

export default StudentPDFDocument;
