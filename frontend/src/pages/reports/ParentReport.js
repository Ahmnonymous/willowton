import Breadcrumb from "../../components/Breadcrumb";
import React, { useState, useEffect, useContext } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import { ThemeContext } from '../../config/ThemeContext'; // Import ThemeContext
import './GenericTable.css'; // Updated generic class names for styling

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function GenericTable() {
  const { isDarkMode } = useContext(ThemeContext); // Access theme context
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');  // Search term to filter the student list
  const [columns, setColumns] = useState([]); // To store the column names

  // Format the date to mm/dd/yyyy
  const formatDate = (date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Fetch student details when the component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/view/parent-detail-report`);
        if (response.data.length > 0) {
          setColumns(Object.keys(response.data[0]).filter((column) => column !== 'id'));
        }
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search term
  const filteredStudents = students.filter((student) =>
    columns.some((column) => {
      const value = student[column];
      if (value && typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    })
  );

  return (
    <Box sx={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC', minHeight: '100vh', padding: '1px' }}>
      <div>
        <Breadcrumb title="Parents Details Report" />

        {/* Generic Search Input */}
        <div className="generic-search-container">
          <input
            type="text"
            className="generic-search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="generic-table-container">
          <table className="generic-table" style={{ backgroundColor: isDarkMode ? '#1e293b' : 'white' }}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>
                    {column
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    {columns.map((column) => (
                      <td key={`${student.id}-${column}`}>
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
