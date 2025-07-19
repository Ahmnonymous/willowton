import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  ListItemIcon,
  ListItemText,
  Select,
  MenuItem as MuiMenuItem,
  Typography,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { ThemeContext } from '../../config/ThemeContext.js';
import Breadcrumb from "../../components/Breadcrumb.js";
import './GenericTable.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function GenericTable() {
  const { isDarkMode } = useContext(ThemeContext);
  const [allStudents, setAllStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [columns, setColumns] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [columnSearchTerm, setColumnSearchTerm] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const searchRef = useRef(null);
  const open = Boolean(anchorEl);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/student-details`);
      const records = Array.isArray(res.data) ? res.data : res?.data?.records ?? [];

      if (records.length > 0) {
        const cols = Object.keys(records[0]).filter((c) => c !== 'id');
        setColumns(cols);
        setVisibleColumns(cols);
      }

      setAllStudents(records);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setAllStudents([]);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // const sentenceCase = (str) => str.replace(/_/g, ' ').replace(/\w/g, (c) => c.toUpperCase());
  const sentenceCase = (str) => str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : 'N/A');

  const toggleColumn = (col) => {
    if (visibleColumns.includes(col)) {
      setVisibleColumns((prev) => prev.filter((c) => c !== col));
    } else {
      const idx = columns.indexOf(col);
      const updated = [...visibleColumns];
      updated.splice(idx, 0, col);
      setVisibleColumns(updated);
    }
  };

  const resetColumns = () => setVisibleColumns(columns);

  const exportToExcel = () => {
    const data = allStudents.map((s) =>
      Object.fromEntries(visibleColumns.map((col) => [sentenceCase(col), s[col]]))
    );
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'student_report.xlsx');
  };

  const handleSort = (col) => {
    setSortConfig((prev) => {
      if (prev.key === col) {
        return {
          key: col,
          direction:
            prev.direction === 'asc' ? 'desc' : prev.direction === 'desc' ? null : 'asc',
        };
      } else {
        return { key: col, direction: 'asc' };
      }
    });
    setPage(0);
  };

  const filteredStudents = allStudents
    .filter((student) =>
      visibleColumns.some((col) => {
        const val = student[col];
        return val != null && val.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    )
    .sort((a, b) => {
      if (!sortConfig.key || !sortConfig.direction) return 0;
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal == null || bVal == null) return 0;
      return sortConfig.direction === 'asc'
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });

  const paginatedStudents = filteredStudents.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  useEffect(() => {
    setTotalRecords(filteredStudents.length);
  }, [filteredStudents]);

  const filteredColumns = columns.filter((col) =>
    col.toLowerCase().includes(columnSearchTerm.toLowerCase()) ||
    sentenceCase(col).toLowerCase().includes(columnSearchTerm.toLowerCase())
  );

  return (
    <Box sx={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC', minHeight: '100vh', p: 2 }}>
      <Breadcrumb title="Student Report" />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        {!showSearch && (
          <Tooltip title="Search">
            <IconButton size="small" onClick={() => setShowSearch(true)} sx={{ color: isDarkMode ? 'white' : 'black' }}>
              <SearchIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Box
          ref={searchRef}
          sx={{
            width: showSearch ? 220 : 0,
            height: 36,
            transition: 'width 0.3s ease',
            overflow: 'hidden',
          }}
        >
          {showSearch && (
            <InputBase
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              sx={{
                backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                color: isDarkMode ? 'white' : 'black',
                px: 1.5,
                height: '100%',
                fontSize: '0.85rem',
                borderRadius: 1,
                border: `1px solid ${isDarkMode ? '#4A5568' : '#CBD5E0'}`,
                width: '100%',
              }}
              startAdornment={<SearchIcon sx={{ mr: 1 }} fontSize="small" />}
            />
          )}
        </Box>

        <Tooltip title="Column Visibility">
          <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: isDarkMode ? 'white' : 'black' }}>
            <ViewColumnIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Export to Excel">
          <IconButton size="small" onClick={exportToExcel} sx={{ color: isDarkMode ? 'white' : 'black' }}>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Column Toggle Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)} PaperProps={{ sx: { minWidth: 200, maxHeight: 300, p: 1 } }}>
        <InputBase
          placeholder="Search Columns"
          value={columnSearchTerm}
          onChange={(e) => setColumnSearchTerm(e.target.value)}
          sx={{
            mb: 1,
            px: 1,
            fontSize: '0.7rem',
            backgroundColor: '#f1f5f9',
            borderRadius: 1,
            width: '100%', // Stretch to full width
            height: '28px', // Match column name height
          }}
        />
        {filteredColumns.map((col) => (
          <MenuItem key={col} dense>
            <FormControlLabel
              control={<Checkbox size="small" checked={visibleColumns.includes(col)} onChange={() => toggleColumn(col)} />}
              label={<span style={{ fontSize: '0.7rem' }}>{sentenceCase(col)}</span>} // Smaller font size
            />
          </MenuItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <MenuItem dense onClick={() => { resetColumns(); setAnchorEl(null); }}>
          <ListItemIcon><RefreshIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Reset Columns" primaryTypographyProps={{ fontSize: '0.7rem' }} />
        </MenuItem>
      </Menu>

      <div className="generic-table-container">
        <table className="generic-table" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff' }}>
          <thead>
            <tr>
              {visibleColumns.map((col) => (
                <th
                  key={col}
                  style={{
                    color: isDarkMode ? 'white' : '#1e293b',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onClick={() => handleSort(col)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {sentenceCase(col)}
                    <Box sx={{ ml: 0.5, display: 'flex', alignItems: 'center' }}>
                      {sortConfig.key === col && sortConfig.direction === 'asc' && <ArrowDropUpIcon fontSize="small" />}
                      {sortConfig.key === col && sortConfig.direction === 'desc' && <ArrowDropDownIcon fontSize="small" />}
                      {sortConfig.key === col && sortConfig.direction === null && <ClearIcon fontSize="small" />}
                    </Box>
                  </Box>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student) => (
                <tr key={student.id}>
                  {visibleColumns.map((col) => (
                    <td key={col} style={{ color: isDarkMode ? 'white' : '#1e293b' }}>
                      {col.includes('date') ? formatDate(student[col]) : student[col]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr><td colSpan={visibleColumns.length} className="no-matching-records">No matching records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="caption">
          {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, totalRecords)} of {totalRecords}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} size="small" variant="outlined" startIcon={<ArrowBackIosIcon fontSize="small" />}>Prev</Button>
          <Select
            value={rowsPerPage}
            onChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
            size="small"
            sx={{ fontSize: '0.85rem' }}
          >
            {[5, 10, 20, 50].map((n) => (
              <MuiMenuItem key={n} value={n}>{n}</MuiMenuItem>
            ))}
          </Select>
          <Button onClick={() => setPage((p) => (p + 1) * rowsPerPage < totalRecords ? p + 1 : p)} disabled={(page + 1) * rowsPerPage >= totalRecords} size="small" variant="outlined" endIcon={<ArrowForwardIosIcon fontSize="small" />}>Next</Button>
        </Box>
      </Box>
    </Box>
  );
}

export default GenericTable;