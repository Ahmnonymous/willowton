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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropUpIcon from '@mui/icons-material/ArrowUpward';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ClearIcon from '@mui/icons-material/Clear';
import { useTheme, useMediaQuery } from '@mui/material';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { ThemeContext } from '../../config/ThemeContext.js';
import './GenericTable.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function GenericTable() {
  const { isDarkMode } = useContext(ThemeContext);
  const [allStudents, setAllStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [columns, setColumns] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [columnWidths, setColumnWidths] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [columnSearchTerm, setColumnSearchTerm] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const searchRef = useRef(null);
  const resizingRef = useRef(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const sentenceCase = useCallback((str) => {
    if (str === 'student_id_passport_number') {
      return 'Student ID/Passport Number';
    }
    return str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }, []);


  // Calculate default column width based on header length
  const calculateColumnWidth = useCallback((col) => {
    const headerText = sentenceCase(col);
    const charCount = headerText.length;
    const pixelsPerChar = 10; // Adjust this value based on your font size/style
    const minWidth = 50; // Minimum width to ensure usability
    const calculatedWidth = charCount * pixelsPerChar + 40; // Add padding for sort icons and separator
    return Math.max(minWidth, calculatedWidth);
  }, [sentenceCase]);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/view/student-equity`);
      const records = Array.isArray(res.data) ? res.data : res?.data?.records ?? [];

      if (records.length > 0) {
        const cols = Object.keys(records[0]).filter((c) => c !== 'id');
        setColumns(cols);
        setVisibleColumns(cols);
        // Initialize column widths based on header length
        setColumnWidths(cols.reduce((acc, col) => ({
          ...acc,
          [col]: calculateColumnWidth(col),
        }), {}));
      }

      setAllStudents(records);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setAllStudents([]);
    }
  }, [calculateColumnWidth]);

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

  // Column resizing handlers
  const handleMouseMove = useCallback((e) => {
    if (resizingRef.current) {
      const { col, startX, startWidth } = resizingRef.current;
      const newWidth = Math.max(50, startWidth + (e.clientX - startX));
      setColumnWidths((prev) => ({ ...prev, [col]: newWidth }));
    }
  }, []);

  const stopResizing = useCallback(() => {
    resizingRef.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
    document.body.style.userSelect = '';
  }, [handleMouseMove]);

  const startResizing = useCallback(
    (e, col) => {
      e.preventDefault();
      resizingRef.current = { col, startX: e.clientX, startWidth: columnWidths[col] || calculateColumnWidth(col) };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopResizing);
      document.body.style.userSelect = 'none';
    },
    [columnWidths, calculateColumnWidth, handleMouseMove, stopResizing]
  );

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

  const resetColumns = () => {
    setVisibleColumns(columns);
    // Reset column widths based on header length
    setColumnWidths(columns.reduce((acc, col) => ({
      ...acc,
      [col]: calculateColumnWidth(col),
    }), {}));
  };

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

  const filteredColumns = columns.filter((col) => {
    const lowerTerm = columnSearchTerm.toLowerCase();
    const raw = col.toLowerCase();
    const formatted = sentenceCase(col).toLowerCase();
    return raw.includes(lowerTerm) || formatted.includes(lowerTerm);
  });

  return (
    <Box
      sx={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC', minHeight: '100vh', p: 2 }}
      className={isDarkMode ? 'dark-mode' : ''}
    >
      {/* Inline Breadcrumb with Search and Icons */}
      <Box sx={{ padding: "12px", backgroundColor: isDarkMode ? '#1e293b' : '#e1f5fe', borderRadius: "8px", marginBottom: "12px", border: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: isDarkMode ? 'white' : 'black', fontWeight: "bold" }}>
          Student Equity
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search input field */}
          <Box
            ref={searchRef}
            sx={{
              width: showSearch ? (isSmallScreen ? 120 : 220) : 0, // Adjust width based on screen size
              height: 36,
              overflow: 'hidden',
              transition: 'width 0.3s ease-in-out, opacity 0.3s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              opacity: showSearch ? 1 : 0,
            }}
          >

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
                minWidth: 0,
              }}
              startAdornment={<SearchIcon sx={{ mr: 1 }} fontSize="small" />}
              endAdornment={
                searchTerm && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchTerm('');
                      setPage(0);
                    }}
                    sx={{ color: isDarkMode ? 'white' : 'black' }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )
              }
            />

          </Box>

          {/* Search icon toggle */}
          <Tooltip title={showSearch ? 'Close Search' : 'Search'}>
            <IconButton
              size="small"
              onClick={() => setShowSearch((prev) => !prev)}
              sx={{ color: isDarkMode ? 'white' : 'black' }}
            >
              {showSearch ? <ClearIcon fontSize="small" /> : <SearchIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* Other icons – hidden on small screen when search is open */}
          {!(isSmallScreen && showSearch) && (
            <>
              <Typography sx={{ color: isDarkMode ? 'white' : 'black', fontSize: '1rem' }}>|</Typography>
              <Tooltip title="Column Visibility">
                <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: isDarkMode ? 'white' : 'black' }}>
                  <ViewColumnIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography sx={{ color: isDarkMode ? 'white' : 'black', fontSize: '1rem' }}>|</Typography>
              <Tooltip title="Export to Excel">
                <IconButton size="small" onClick={exportToExcel} sx={{ color: isDarkMode ? 'white' : 'black' }}>
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>

      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            minWidth: 200,
            maxHeight: 300,
            p: 1,
            backgroundColor: isDarkMode ? '#1e293b' : '#fff',
            color: isDarkMode ? '#F7FAFC' : '#1e293b',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
            borderRadius: 2,
          },
        }}
      >
        <InputBase
          autoFocus
          placeholder="Search Columns"
          value={columnSearchTerm}
          onChange={(e) => setColumnSearchTerm(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          sx={{
            mb: 1,
            px: 1,
            fontSize: '0.7rem',
            backgroundColor: isDarkMode ? '#334155' : '#f1f5f9',
            borderRadius: 1,
            width: '100%',
            height: '28px',
            color: isDarkMode ? '#F7FAFC' : '#1e293b',
          }}
        />

        {filteredColumns.map((col) => (
          <MenuItem key={col} dense>
            <FormControlLabel
              control={<Checkbox size="small" checked={visibleColumns.includes(col)} onChange={() => toggleColumn(col)} />}
              label={<span style={{ fontSize: '0.7rem' }}>{sentenceCase(col)}</span>}
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
        <table className="generic-table" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', tableLayout: 'fixed' }}>
          <thead>
            <tr>
              {visibleColumns.map((col) => (
                <th
                  key={col}
                  style={{
                    color: isDarkMode ? 'white' : '#1e293b',
                    cursor: 'pointer',
                    position: 'relative',
                    width: columnWidths[col] || calculateColumnWidth(col),
                    minWidth: 50,
                  }}
                  onClick={(e) => {
                    if (e.target.className !== 'resize-handle') {
                      handleSort(col);
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '10px' }}>
                    <span>{sentenceCase(col)}</span>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {sortConfig.key === col && sortConfig.direction === 'asc' && <ArrowDropUpIcon fontSize="small" />}
                      {sortConfig.key === col && sortConfig.direction === 'desc' && <ArrowDropDownIcon fontSize="small" />}
                      {sortConfig.key === col && sortConfig.direction === null}
                    </Box>
                  </Box>
                  <span
                    className="resize-handle"
                    onMouseDown={(e) => startResizing(e, col)}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      height: '100%',
                      width: '5px',
                      cursor: 'col-resize',
                      background: isDarkMode ? '#4A5568' : '#CBD5E0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      userSelect: 'none',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: isDarkMode ? '#F7FAFC' : '#1e293b' }}>|</span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student) => (
                <tr key={student.id}>
                  {visibleColumns.map((col) => (
                    <td
                      key={col}
                      style={{
                        color: isDarkMode ? 'white' : '#1e293b',
                        width: columnWidths[col] || calculateColumnWidth(col),
                        minWidth: 50,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
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

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            border: '1px solid',
            borderColor: isDarkMode ? '#4A5568' : '#CBD5E0',
            borderRadius: '8px',
            padding: '6px 12px',
            backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
            color: isDarkMode ? '#F7FAFC' : '#1e293b',
          }}
        >
          <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
            Rows per page:
          </Typography>
          <Select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setPage(0);
            }}
            size="small"
            sx={{
              color: isDarkMode ? '#F7FAFC' : '#1e293b',
              '.MuiSelect-icon': { color: isDarkMode ? '#F7FAFC' : '#1e293b' },
              backgroundColor: isDarkMode ? '#4A5568' : '#E2E8F0',
              borderRadius: '4px',
              fontSize: '0.85rem',
              minWidth: '60px',
            }}
          >
            {[10, 15, 25, 50, 100].map((n) => (
              <MuiMenuItem key={n} value={n}>{n}</MuiMenuItem>
            ))}
          </Select>
          <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
            {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, totalRecords)} of {totalRecords}
          </Typography>
          <IconButton
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            size="small"
            sx={{ color: isDarkMode ? '#F7FAFC' : '#1e293b' }}
          >
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => setPage((p) => (p + 1) * rowsPerPage < totalRecords ? p + 1 : p)}
            disabled={(page + 1) * rowsPerPage >= totalRecords}
            size="small"
            sx={{ color: isDarkMode ? '#F7FAFC' : '#1e293b' }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

    </Box>
  );
}

export default GenericTable;