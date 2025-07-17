import React, { useContext } from "react";
import { pdf } from '@react-pdf/renderer';
import StudentPDFDocument from './StudentPDFDocument';
import { Button } from "@mui/material";
import { ThemeContext } from '../config/ThemeContext';
import DownloadIcon from '@mui/icons-material/Download';

const DownloadPDFButton = ({ studentData }) => {
  const { isDarkMode } = useContext(ThemeContext); 

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
    <Button
      variant="contained"
      onClick={handleDownload}
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: isDarkMode ? 'white' : 'black',
        color: isDarkMode ? 'black' : 'white',
        padding: '2px 6px',
        textTransform: 'none',
        marginLeft: 1,
      }}
    >
      <DownloadIcon sx={{ marginRight: 1, fontSize: 'small' }} />
      Download PDF
    </Button>    
  );
};

export default DownloadPDFButton;
