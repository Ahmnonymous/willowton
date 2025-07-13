import Breadcrumb from "../../components/Breadcrumb";
import React, { useState, useEffect, useContext } from 'react';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import { ThemeContext } from '../../config/ThemeContext.js';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './GenericTable.css';

function GenericTable() {
  const { isDarkMode } = useContext(ThemeContext);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [columns, setColumns] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Format the date to mm/dd/yyyy
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Convert string to sentence case
  const sentenceCase = (str) => {
    return str
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Fetch student details when the component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('https://willowtonbursary.co.za/api/student-details');
        if (response.data.length > 0) {
          setColumns(Object.keys(response.data[0]).filter((column) => column !== 'id'));
        }
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []);

  // Fetch detailed student data for PDF generation
  const fetchStudentDetails = async (id) => {
    try {
      const response = await axios.get(`https://willowtonbursary.co.za/api/student-data/${id}`);
      setSelectedStudent(response.data);
      generatePDF(response.data);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  // Generate PDF
  const generatePDF = (data) => {
    const doc = new jsPDF();
    
    // Add logo (assuming willowton_logo.png is accessible in public folder)
    const logo = '/willowton_logo.png';
    doc.addImage(logo, 'PNG', 10, 10, 50, 20); // Logo at top-left

    // Set initial Y position after logo
    let yPos = 40;

    // Helper function to add section
    const addSection = (title, fields, isArray = false) => {
      // Section heading
      doc.setFillColor(200, 200, 200); // Light gray background
      doc.rect(10, yPos, 190, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(title, 15, yPos + 7);
      yPos += 15;

      // Section content
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);

      if (isArray) {
        fields.forEach((item, index) => {
          Object.entries(item).forEach(([key, value]) => {
            if (value && key !== 'student_details_portal_id') {
              const formattedKey = sentenceCase(key);
              const formattedValue = key.includes('date') ? formatDate(value) : value;
              doc.text(`${formattedKey}: ${formattedValue}`, 15, yPos);
              yPos += 7;
            }
          });
          if (index < fields.length - 1) {
            // Add separator for multi-row sections
            doc.setLineWidth(0.5);
            doc.line(15, yPos, 195, yPos);
            yPos += 5;
          }
        });
      } else {
        Object.entries(fields).forEach(([key, value]) => {
          if (value && key !== 'id' && key !== 'user_id') {
            const formattedKey = sentenceCase(key);
            const formattedValue = key.includes('date') ? formatDate(value) : value;
            doc.text(`${formattedKey}: ${formattedValue}`, 15, yPos);
            yPos += 7;
          }
        });
      }
      yPos += 5; // Space between sections
    };

    // Add sections
    addSection('Student Details', data.student_details);
    addSection('About Me', data.about_me);
    addSection('Assets and Liabilities', data.assets_liabilities);
    addSection('Attachments', data.attachments, true);
    addSection('Expense Details', data.expense_details);
    addSection('Interview', data.interview);
    addSection('Parents Details', data.parents_details, true);
    addSection('Payments', data.payments, true);
    addSection('Results', data.results, true);
    addSection('Tasks', data.tasks, true);
    addSection('University Details', data.university_details);
    addSection('Voluntary Service', data.voluntary_service, true);

    // Save the PDF
    doc.save(`Student_Report_${data.student_details.student_name}_${data.student_details.student_surname}.pdf`);
  };

  // Handle search
  const filteredStudents = students.filter((student) => {
    return columns.some((column) => {
      const value = student[column];
      if (value && typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  });

  return (
    <Box sx={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC', minHeight: '100vh', padding: '1px' }}>
      <div>
        <Breadcrumb title="Student Report" />

        {/* Search Input */}
        <div className="generic-search-container">
          <input
            type="text"
            className="generic-search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Download PDF Button */}
        <div style={{ margin: '10px 0' }}>
          {filteredStudents.map((student) => (
            <Button
              key={student.id}
              variant="contained"
              color="primary"
              onClick={() => fetchStudentDetails(student.id)}
              style={{ margin: '5px' }}
            >
              Download PDF for {student.student_name} {student.student_surname}
            </Button>
          ))}
        </div>

        {/* Table */}
        <div className="generic-table-container">
          <table className="generic-table" style={{ backgroundColor: isDarkMode ? '#1e293b' : 'white' }}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column} style={{ color: isDarkMode ? 'white' : '#1e293b' }}>
                    {sentenceCase(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    {columns.map((column) => (
                      <td key={column} style={{ color: isDarkMode ? 'white' : '#1e293b' }}>
                        {column === 'student_date_stamp' || column === 'student_dob'
                          ? formatDate(student[column])
                          : student[column]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="no-matching-records">
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Box>
  );
}

export default GenericTable;