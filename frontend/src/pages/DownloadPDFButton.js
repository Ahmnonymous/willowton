import React from 'react';
import { pdf } from '@react-pdf/renderer';
import StudentPDFDocument from './StudentPDFDocument';

const DownloadPDFButton = ({ studentData }) => {
  const handleDownload = async () => {
    const blob = await pdf(<StudentPDFDocument studentData={studentData} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Student_Details.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload}>
      Download Student PDF
    </button>
  );
};

export default DownloadPDFButton;
