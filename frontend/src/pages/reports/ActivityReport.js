import Breadcrumb from "../../components/Breadcrumb.js";
import React, { useState, useEffect, useContext } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { ThemeContext } from '../../config/ThemeContext.js';
import './GenericTable.css';

function ActivityLogTable() {
  const { isDarkMode } = useContext(ThemeContext);
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch activity logs when the component mounts
  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://willowtonbursary.co.za/api/activity-log');
        
        if (response.data.length > 0) {
          // Set columns based on the keys of the first log entry
          setColumns(['username', 'email_address', 'act_type', 'act_date', 'act_time']);
        }
        
        setLogs(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching activity logs:', err);
        setError('Failed to fetch activity logs. Please try again later.');
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, []);

  // Filter logs based on search term
  const filteredLogs = logs.filter((log) =>
    columns.some((column) => {
      const value = log[column];
      return value && typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  // Convert string to sentence case or custom header names
  const formatColumnName = (column) => {
    switch (column) {
      case 'act_type':
        return 'Activity';
      case 'act_date':
        return 'Date';
      case 'act_time':
        return 'Time';
      default:
        return column
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());
    }
  };

  // Determine styles for activity type
  const getActivityStyles = (activity) => {
    if (activity === 'Login') {
      return {
        backgroundColor: '#22C55E', // Green
        color: '#FFFFFF', // White text
        padding: '4px 8px',
        borderRadius: '4px',
        display: 'inline-block',
      };
    } else if (activity === 'Logout') {
      return {
        backgroundColor: '#EF4444', // Red
        color: '#FFFFFF', // White text
        padding: '4px 8px',
        borderRadius: '4px',
        display: 'inline-block',
      };
    }
    return {};
  };

  return (
    <Box
      sx={{
        backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <Breadcrumb title="Activity Logs" />

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

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: '20px' }}>
          {error}
        </Alert>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="generic-table-container" style={{ overflowX: 'auto' }}>
          <table
            className="generic-table"
            style={{
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              width: '100%',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    style={{
                      color: isDarkMode ? '#FFFFFF' : '#1E293B',
                      padding: '12px',
                      borderBottom: isDarkMode ? '1px solid #4B5563' : '1px solid #E2E8F0',
                      textAlign: 'left',
                    }}
                  >
                    {formatColumnName(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <tr
                    key={`${log.username}-${log.act_date}-${index}`}
                    style={{ borderBottom: isDarkMode ? '1px solid #4B5563' : '1px solid #E2E8F0' }}
                  >
                    {columns.map((column) => (
                      <td
                        key={column}
                        style={{
                          color: isDarkMode ? '#FFFFFF' : '#1E293B',
                          padding: '12px',
                        }}
                      >
                        {column === 'act_type' ? (
                          <span style={getActivityStyles(log[column])}>
                            {log[column] || 'N/A'}
                          </span>
                        ) : (
                          log[column] || 'N/A'
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{
                      textAlign: 'center',
                      padding: '20px',
                      color: isDarkMode ? '#9CA3AF' : '#6B7280',
                    }}
                  >
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Box>
  );
}

export default ActivityLogTable;