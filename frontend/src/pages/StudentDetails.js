import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  Card,
  CardContent,
  Button,
  Tab,
  Tabs,
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
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ClearIcon from "@mui/icons-material/Clear";
import { useTheme, useMediaQuery } from "@mui/material";
import * as XLSX from "xlsx";
import DrawerForm from "./Drawer/StudentDetailDrawer";
import AboutusDrawer from "./Drawer/AboutUsDrawer";
import ParentsDrawer from "./Drawer/ParentsDrawer";
import UniversityDetailsDrawer from "./Drawer/UniversityDetailsDrawer";
import AttachmentsDrawer from "./Drawer/AttachmentsDrawer";
import ExpenseDetailsDrawer from "./Drawer/ExpenseDetailsDrawer";
import AssetsLiabilitiesDrawer from "./Drawer/AssetsLiabilitiesDrawer";
import AcademicResultsDrawer from "./Drawer/AcademicResultsDrawer";
import VoluntaryServiceDrawer from "./Drawer/VoluntaryServiceDrawer";
import PaymentDrawer from "./Drawer/PaymentDrawer";
import InterviewDrawer from "./Drawer/InterviewDrawer";
import TaskDetailsDrawer from "./Drawer/TaskDetailsDrawer";
import { ThemeContext } from "../config/ThemeContext";
import { pdf } from "@react-pdf/renderer";
import StudentPDFDocument from "./StudentPDFDocument";
import '../css/GenericTable.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SectionTable = ({ data, sectionKey, sectionLabel, isDarkMode, selectedStudentid, onEdit, onAdd }) => {
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
  const [loading, setLoading] = useState(true); // Add loading state
  const searchRef = useRef(null);
  const resizingRef = useRef(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const sentenceCase = useCallback((str) => {
    if (str === 'student_id_passport_number') return 'Student ID/Passport Number';
    if (str === 'student_willow_relationship') return 'Willowton Group Relationship';
    return str.replace(/^student /i, '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }, []);

  const calculateColumnWidth = useCallback((col) => {
    const headerText = sentenceCase(col);
    const charCount = headerText.length;
    const pixelsPerChar = 10;
    const minWidth = 50;
    const calculatedWidth = charCount * pixelsPerChar + 40;
    return Math.max(minWidth, calculatedWidth);
  }, [sentenceCase]);

  useEffect(() => {
    // Simulate data loading with a delay to ensure spinner is visible
    const loadData = async () => {
      setLoading(true);
      try {
        if (data && data.length > 0) {
          const cols = Object.keys(data[0]).filter((c) => c !== 'id' && c !== 'student_details_portal_id');
          setColumns(cols);
          setVisibleColumns(cols);
          setColumnWidths(cols.reduce((acc, col) => ({
            ...acc,
            [col]: calculateColumnWidth(col),
          }), {}));
          setTotalRecords(data.length);
        } else {
          setColumns([]);
          setVisibleColumns([]);
          setColumnWidths({});
          setTotalRecords(0);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [data, calculateColumnWidth]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setColumnWidths(columns.reduce((acc, col) => ({
      ...acc,
      [col]: calculateColumnWidth(col),
    }), {}));
  };

  const exportToExcel = () => {
    const exportData = data.map((s) =>
      Object.fromEntries(visibleColumns.map((col) => [sentenceCase(col), s[col]]))
    );
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sectionKey);
    XLSX.writeFile(wb, `${sectionKey}_report.xlsx`);
  };

  const handleSort = (col) => {
    setSortConfig((prev) => {
      if (prev.key === col) {
        return {
          key: col,
          direction: prev.direction === 'asc' ? 'desc' : prev.direction === 'desc' ? null : 'asc',
        };
      } else {
        return { key: col, direction: 'asc' };
      }
    });
    setPage(0);
  };

  const filteredData = data
    .filter((item) =>
      visibleColumns.some((col) => {
        const val = item[col];
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

  const paginatedData = filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  useEffect(() => {
    setTotalRecords(filteredData.length);
  }, [filteredData]);

  const filteredColumns = columns.filter((col) => {
    const lowerTerm = columnSearchTerm.toLowerCase();
    const raw = col.toLowerCase();
    const formatted = sentenceCase(col).toLowerCase();
    return raw.includes(lowerTerm) || formatted.includes(lowerTerm);
  });

  return (
    <Box
      sx={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC', p: 2 }}
      className={isDarkMode ? 'dark-mode' : ''}
    >
      <Box sx={{ padding: "12px", backgroundColor: isDarkMode ? '#1e293b' : '#e1f5fe', borderRadius: "8px", marginBottom: "12px", border: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: isDarkMode ? 'white' : 'black', fontWeight: "bold" }}>
          {sectionLabel}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            ref={searchRef}
            sx={{
              width: showSearch ? (isSmallScreen ? 120 : 220) : 0,
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
          <Tooltip title={showSearch ? 'Close Search' : 'Search'}>
            <IconButton
              size="small"
              onClick={() => setShowSearch((prev) => !prev)}
              sx={{ color: isDarkMode ? 'white' : 'black' }}
            >
              {showSearch ? <ClearIcon fontSize="small" /> : <SearchIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
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
              {onAdd && (
                <>
                  <Typography sx={{ color: isDarkMode ? 'white' : 'black', fontSize: '1rem' }}>|</Typography>
                  <Tooltip title="Add New">
                    <IconButton size="small" onClick={onAdd} sx={{ color: isDarkMode ? 'white' : 'black' }}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress sx={{ color: isDarkMode ? '#F7FAFC' : '#1e293b' }} />
          </Box>
        ) : (
          <table className="generic-table" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                {onEdit && <th style={{ width: 50, color: isDarkMode ? 'white' : '#1e293b' }}></th>}
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
              {paginatedData.length > 0 ? (
                paginatedData.map((row, i) => (
                  <tr key={i}>
                    {onEdit && (
                      <td style={{ width: 50 }}>
                        <EditIcon
                          sx={{ cursor: 'pointer', fontSize: 'large', color: isDarkMode ? 'white' : 'black' }}
                          onClick={() => onEdit(row.id)}
                        />
                      </td>
                    )}
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
                        {col.includes('date') ? formatDate(row[col]) :
                          typeof row[col] === 'object' && row[col] !== null ?
                            col.toLowerCase().includes('attachment') ||
                              col.toLowerCase().includes('proof_of_service') ||
                              col.toLowerCase().includes('proof_of_payment') ?
                              '📎 File attached' :
                              JSON.stringify(row[col]) :
                            row[col] || 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr><td colSpan={visibleColumns.length + (onEdit ? 1 : 0)} className="no-matching-records">No matching records found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {!loading && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            border: '1px solid',
            borderColor: isDarkMode ? '#4A5568' : '#CBD5E0',
            borderRadius: '8px',
            padding: '6px 12px',
            backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC',
            color: isDarkMode ? '#F7FAFC' : '#1e293b',
          }}>
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
      )}
    </Box>
  );
};

const StudentDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [studentDetails, setStudentDetails] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentid, setSelectedStudentid] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aboutMeDrawerOpen, setAboutMeDrawerOpen] = useState(false);
  const [editingAboutMeId, setEditingAboutMeId] = useState(null);
  const [parentsDrawerOpen, setParentsDrawerOpen] = useState(false);
  const [editingParentId, setEditingParentId] = useState(null);
  const [universityDetailsDrawerOpen, setUniversityDetailsDrawerOpen] = useState(false);
  const [editingUniversityId, setEditingUniversityId] = useState(null);
  const [attachmentsDrawerOpen, setAttachmentsDrawerOpen] = useState(false);
  const [editingAttachmentId, setEditingAttachmentId] = useState(null);
  const [expenseDetailsDrawerOpen, setExpensesSummaryDrawerOpen] = useState(false);
  const [editingExpenseDetailsId, setEditingExpenseDetailsId] = useState(null);
  const [assetsLiabilitiesDrawerOpen, setAssetsLiabilitiesDrawerOpen] = useState(false);
  const [editingAssetLiabilityId, setEditingAssetLiabilityId] = useState(null);
  const [academicResultsDrawerOpen, setAcademicResultsDrawerOpen] = useState(false);
  const [editingAcademicResultId, setEditingAcademicResultId] = useState(null);
  const [voluntaryServiceDrawerOpen, setVoluntaryServiceDrawerOpen] = useState(false);
  const [editingVoluntaryServiceId, setEditingVoluntaryServiceId] = useState(null);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [interviewDrawerOpen, setInterviewDrawerOpen] = useState(false);
  const [editingInterviewId, setEditingInterviewId] = useState(null);
  const [tasksDrawerOpen, setTasksDrawerOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [aboutMe, setAboutMe] = useState(null);
  const [parentsDetails, setParentsDetails] = useState(null);
  const [universityDetails, setUniversityDetails] = useState(null);
  const [attachments, setAttachments] = useState(null);
  const [expensesSummary, setExpensesSummary] = useState(null);
  const [assetsLiabilities, setAssetsLiabilities] = useState(null);
  const [academicResults, setAcademicResults] = useState(null);
  const [voluntaryServices, setVoluntaryServices] = useState(null);
  const [payments, setPayments] = useState(null);
  const [interviews, setInterviews] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isDarkMode } = useContext(ThemeContext);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = user?.user_type === "admin";
  const isStudent = user?.user_type === "student";

  const pageStyle = {
    backgroundColor: isDarkMode ? "#1e293b" : "#e1f5fe",
    color: isDarkMode ? "#ffffff" : "#000000",
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const formattedDate = date.toLocaleString("en-GB", options).replace(",", "");
    return formattedDate.replace(/\//g, "/");
  };

  const fetchStudentDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = user.user_id;
      let response;
      if (isAdmin) {
        response = await fetch(`${API_BASE_URL}/student-details`);
      } else if (isStudent && userId) {
        response = await fetch(`${API_BASE_URL}/student-detail/${userId}`);
      } else {
        setStudentDetails([]);
        setSelectedStudent(null);
        setSelectedStudentid(null);
        return [];
      }

      if (!response.ok) {
        setStudentDetails([]);
        setSelectedStudent(null);
        setSelectedStudentid(null);
        return [];
      }

      const data = await response.json();
      if (
        data &&
        ((Array.isArray(data) && data.length > 0 && data[0]?.id) ||
          (!Array.isArray(data) && data?.id))
      ) {
        if (isAdmin) {
          const formattedData = data.map((student) => {
            const updatedStudent = { ...student };
            Object.keys(updatedStudent).forEach((key) => {
              if (key.toLowerCase().includes("date_stamp")) {
                updatedStudent[key] = formatDate(updatedStudent[key]);
              }
            });
            return updatedStudent;
          });
          setStudentDetails(formattedData);
          setSelectedStudent(formattedData[0] || null);
          setSelectedStudentid(formattedData[0]?.id || null);
          return formattedData;
        } else {
          const updatedStudent = Array.isArray(data) ? data[0] : data;
          Object.keys(updatedStudent).forEach((key) => {
            if (key.toLowerCase().includes("date_stamp")) {
              updatedStudent[key] = formatDate(updatedStudent[key]);
            }
          });
          setStudentDetails([updatedStudent]);
          setSelectedStudent(updatedStudent);
          setSelectedStudentid(updatedStudent.id);
          return updatedStudent;
        }
      } else {
        setStudentDetails([]);
        setSelectedStudent(null);
        setSelectedStudentid(null);
        return [];
      }
    } catch (error) {
      setStudentDetails([]);
      setSelectedStudent(null);
      setSelectedStudentid(null);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, isStudent, user.user_id]);

  const fetchStudentData = useCallback(async (studentId) => {
    if (!studentId) {
      setStudentData(null);
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/student-data/${studentId}`);
      const data = await response.json();
      setStudentData(data);
    } catch (error) {
      setStudentData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSectionData = useCallback(async (key, studentId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/${key}/${studentId}`);
      const data = await response.json();
      const formattedData = Array.isArray(data)
        ? data.map((item) => {
          const updatedItem = { ...item };
          Object.keys(updatedItem).forEach((key) => {
            if (key.toLowerCase().endsWith("date_stamp")) {
              updatedItem[key] = formatDate(updatedItem[key]);
            }
          });
          return updatedItem;
        })
        : [];
      return formattedData;
    } catch (error) {
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const initializeData = async () => {
      setIsLoading(true);
      if (isStudent) {
        const data = await fetchStudentDetails();
        if (mounted && data && data.id) {
          setStudentDetails([data]);
          setSelectedStudent(data);
          setSelectedStudentid(data.id);
          await fetchStudentData(data.id);

          const sectionKeys = [
            "about-me",
            "parents-details",
            "university-details",
            "attachments",
            "expenses-summary",
            "assets-liabilities",
            "academic-results",
            "voluntary-services",
            "tasks",
          ].filter((key) => isAdmin || (key !== "payments" && key !== "interviews"));

          const responses = await Promise.all(
            sectionKeys.map((key) => fetchSectionData(key, data.id))
          );

          if (mounted) {
            setAboutMe(responses[sectionKeys.indexOf("about-me")]);
            setParentsDetails(responses[sectionKeys.indexOf("parents-details")]);
            setUniversityDetails(responses[sectionKeys.indexOf("university-details")]);
            setAttachments(responses[sectionKeys.indexOf("attachments")]);
            setExpensesSummary(responses[sectionKeys.indexOf("expenses-summary")]);
            setAssetsLiabilities(responses[sectionKeys.indexOf("assets-liabilities")]);
            setAcademicResults(responses[sectionKeys.indexOf("academic-results")]);
            setVoluntaryServices(responses[sectionKeys.indexOf("voluntary-services")]);
            setTasks(responses[sectionKeys.indexOf("tasks")]);
          }
        } else if (mounted) {
          setStudentDetails([]);
          setSelectedStudent(null);
          setSelectedStudentid(null);
          setStudentData(null);
        }
      } else if (isAdmin) {
        const data = await fetchStudentDetails();
        if (mounted && Array.isArray(data) && data.length > 0) {
          setStudentDetails(data);
          setSelectedStudent(data[0]);
          setSelectedStudentid(data[0].id);
          await fetchStudentData(data[0].id);

          const sectionKeys = [
            "about-me",
            "parents-details",
            "university-details",
            "attachments",
            "expenses-summary",
            "assets-liabilities",
            "academic-results",
            "voluntary-services",
            "payments",
            "interviews",
            "tasks",
          ].filter((key) => isAdmin || (key !== "payments" && key !== "interviews"));

          const responses = await Promise.all(
            sectionKeys.map((key) => fetchSectionData(key, data[0].id))
          );

          if (mounted) {
            setAboutMe(responses[sectionKeys.indexOf("about-me")]);
            setParentsDetails(responses[sectionKeys.indexOf("parents-details")]);
            setUniversityDetails(responses[sectionKeys.indexOf("university-details")]);
            setAttachments(responses[sectionKeys.indexOf("attachments")]);
            setExpensesSummary(responses[sectionKeys.indexOf("expenses-summary")]);
            setAssetsLiabilities(responses[sectionKeys.indexOf("assets-liabilities")]);
            setAcademicResults(responses[sectionKeys.indexOf("academic-results")]);
            setVoluntaryServices(responses[sectionKeys.indexOf("voluntary-services")]);
            if (isAdmin) {
              setPayments(responses[sectionKeys.indexOf("payments")]);
              setInterviews(responses[sectionKeys.indexOf("interviews")]);
            }
            setTasks(responses[sectionKeys.indexOf("tasks")]);
          }
        } else if (mounted) {
          setStudentDetails([]);
          setSelectedStudent(null);
          setSelectedStudentid(null);
          setStudentData(null);
        }
      }
      setIsLoading(false);
    };

    initializeData();
    return () => {
      mounted = false;
    };
  }, [fetchStudentDetails, isAdmin, isStudent, fetchSectionData, fetchStudentData]);

  const fetchAboutMe = useCallback(async (studentId) => {
    try {
      setIsLoading(true);
      const data = await fetchSectionData("about-me", studentId);
      setAboutMe(data);
      await fetchStudentData(studentId);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSectionData, fetchStudentData]);

  const fetchParentsDetails = useCallback(async (studentId) => {
    try {
      setIsLoading(true);
      const data = await fetchSectionData("parents-details", studentId);
      setParentsDetails(data);
      await fetchStudentData(studentId);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSectionData, fetchStudentData]);

  const fetchUniversityDetails = useCallback(async (studentId) => {
    try {
      setIsLoading(true);
      const data = await fetchSectionData("university-details", studentId);
      setUniversityDetails(data);
      await fetchStudentData(studentId);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSectionData, fetchStudentData]);

  const fetchAttachmentsDetails = useCallback(async (studentId) => {
    try {
      setIsLoading(true);
      const data = await fetchSectionData("attachments", studentId);
      setAttachments(data);
      await fetchStudentData(studentId);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSectionData, fetchStudentData]);

  const fetchExpenseDetails = useCallback(async (studentId) => {
    try {
      setIsLoading(true);
      const data = await fetchSectionData("expenses-summary", studentId);
      setExpensesSummary(data);
      await fetchStudentData(studentId);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSectionData, fetchStudentData]);

  const fetchAssetsLiabilities = useCallback(async (studentId) => {
    try {
      setIsLoading(true);
      const data = await fetchSectionData("assets-liabilities", studentId);
      setAssetsLiabilities(data);
      await fetchStudentData(studentId);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSectionData, fetchStudentData]);

  const fetchAcademicResults = useCallback(async (studentId) => {
    try {
      setIsLoading(true);
      const data = await fetchSectionData("academic-results", studentId);
      setAcademicResults(data);
      await fetchStudentData(studentId);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSectionData, fetchStudentData]);

  const fetchVoluntaryServices = useCallback(async (studentId) => {
    try {
      setIsLoading(true);
      const data = await fetchSectionData("voluntary-services", studentId);
      setVoluntaryServices(data);
      await fetchStudentData(studentId);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSectionData, fetchStudentData]);

  const fetchPaymentsDetails = useCallback(async (studentId) => {
    try {
      setIsLoading(true);
      const data = await fetchSectionData("payments", studentId);
      setPayments(data);
      await fetchStudentData(studentId);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSectionData, fetchStudentData]);

  const fetchInterviewsDetails = useCallback(async (studentId) => {
    try {
      setIsLoading(true);
      const data = await fetchSectionData("interviews", studentId);
      setInterviews(data);
      await fetchStudentData(studentId);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSectionData, fetchStudentData]);

  const fetchTasks = useCallback(async (studentId) => {
    try {
      setIsLoading(true);
      const data = await fetchSectionData("tasks", studentId);
      setTasks(data);
      await fetchStudentData(studentId);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSectionData, fetchStudentData]);

  const handleDeleteStudent = async (studentId) => {
    if (isStudent) {
      setSelectedStudent(null);
      setSelectedStudentid(null);
      setStudentData(null);
    } else if (isAdmin) {
      const remainingStudents = studentDetails.filter((student) => student.id !== studentId);
      if (remainingStudents.length > 0) {
        const nextStudent = remainingStudents[0];
        setSelectedStudent(nextStudent);
        setSelectedStudentid(nextStudent.id);
        await fetchStudentData(nextStudent.id);
      } else {
        setSelectedStudent(null);
        setSelectedStudentid(null);
        setStudentData(null);
      }
      await fetchStudentDetails();
    }
  };

  const renderDrawer = () => (
    <DrawerForm
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      studentId={selectedStudentid}
      onSave={async (savedStudent) => {
        if (savedStudent && typeof savedStudent === "object" && savedStudent.id) {
          const formattedStudent = {
            ...savedStudent,
            ...Object.keys(savedStudent).reduce((acc, key) => {
              if (key.toLowerCase().includes("date") && savedStudent[key]) {
                acc[key] = formatDate(savedStudent[key]);
              } else {
                acc[key] = savedStudent[key];
              }
              return acc;
            }, {}),
          };
          setStudentDetails((prev) => {
            const existingIndex = prev.findIndex((s) => s.id === savedStudent.id);
            if (existingIndex >= 0) {
              const updatedDetails = [...prev];
              updatedDetails[existingIndex] = formattedStudent;
              return updatedDetails;
            } else {
              return [...prev, formattedStudent];
            }
          });
          setSelectedStudent(formattedStudent);
          setSelectedStudentid(formattedStudent.id);
          await fetchStudentData(formattedStudent.id);
        }
        setDrawerOpen(false);
        await fetchStudentDetails();
      }}
      onDelete={handleDeleteStudent}
    />
  );

  const tabSections = [
    { label: "Show all", key: "show_all" },
    { label: "About Me", key: "about-me" },
    { label: "Parents Details", key: "parents-details" },
    { label: "University Details", key: "university-details" },
    { label: "Attachments", key: "attachments" },
    { label: "Financial Details", key: "expenses-summary" },
    { label: "Assets & Liabilities", key: "assets-liabilities" },
    { label: "Academic Results", key: "academic-results" },
    { label: "Voluntary Services", key: "voluntary-services" },
    { label: "Tasks", key: "tasks" },
  ];

  if (isAdmin) {
    tabSections.splice(9, 0, { label: "Payments", key: "payments" }, { label: "Interviews", key: "interviews" });
  }

  const capitalizeWords = (str) => {
    if (str.toLowerCase() === "student id passport number") {
      return "ID/Passport Number";
    }
    if (str.toLowerCase() === "student willow relationship") {
      return "Willowton Group Relationship";
    }
    const formattedStr = str.replace(/^student /i, "").replace(/_/g, "");
    return formattedStr.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const dataForSection = (key) => {
    const mapping = {
      "about-me": aboutMe,
      "parents-details": parentsDetails,
      "university-details": universityDetails,
      "attachments": attachments,
      "expenses-summary": expensesSummary,
      "assets-liabilities": assetsLiabilities,
      "academic-results": academicResults,
      "voluntary-services": voluntaryServices,
      "payments": payments,
      "interviews": interviews,
      "tasks": tasks,
    };
    return mapping[key] || [];
  };

  const renderRegion = (sectionKey, data) => {
    if (!data) return null;

    const isAboutMe = sectionKey === "about-me";
    const isParents = sectionKey === "parents-details";
    const isUniversityDetails = sectionKey === "university-details";
    const isAttachments = sectionKey === "attachments";
    const isExpenses = sectionKey === "expenses-summary";
    const isAssetsLiabilities = sectionKey === "assets-liabilities";
    const isAcademicResults = sectionKey === "academic-results";
    const isVoluntaryServices = sectionKey === "voluntary-services";
    const isPayments = sectionKey === "payments";
    const isInterview = sectionKey === "interviews";
    const isTasks = sectionKey === "tasks";

    if ((isPayments || isInterview) && !isAdmin) return null;

    const section = tabSections.find((sec) => sec.key === sectionKey);
    const sectionLabel = section ? section.label : sectionKey;

    const handleEdit = (id) => {
      if (isAboutMe) {
        setEditingAboutMeId(id);
        setAboutMeDrawerOpen(true);
      }
      if (isParents) {
        setEditingParentId(id);
        setParentsDrawerOpen(true);
      }
      if (isUniversityDetails) {
        setEditingUniversityId(id);
        setUniversityDetailsDrawerOpen(true);
      }
      if (isAttachments) {
        setEditingAttachmentId(id);
        setAttachmentsDrawerOpen(true);
      }
      if (isExpenses) {
        setEditingExpenseDetailsId(id);
        setExpensesSummaryDrawerOpen(true);
      }
      if (isAssetsLiabilities) {
        setEditingAssetLiabilityId(id);
        setAssetsLiabilitiesDrawerOpen(true);
      }
      if (isAcademicResults) {
        setEditingAcademicResultId(id);
        setAcademicResultsDrawerOpen(true);
      }
      if (isVoluntaryServices) {
        setEditingVoluntaryServiceId(id);
        setVoluntaryServiceDrawerOpen(true);
      }
      if (isPayments) {
        setEditingPaymentId(id);
        setPaymentDrawerOpen(true);
      }
      if (isInterview) {
        setEditingInterviewId(id);
        setInterviewDrawerOpen(true);
      }
      if (isTasks) {
        setEditingTaskId(id);
        setTasksDrawerOpen(true);
      }
    };

    const handleAdd = () => {
      if (isAboutMe) {
        setEditingAboutMeId(null);
        setAboutMeDrawerOpen(true);
      }
      if (isParents) {
        setEditingParentId(null);
        setParentsDrawerOpen(true);
      }
      if (isUniversityDetails) {
        setEditingUniversityId(null);
        setUniversityDetailsDrawerOpen(true);
      }
      if (isAttachments) {
        setEditingAttachmentId(null);
        setAttachmentsDrawerOpen(true);
      }
      if (isExpenses) {
        setEditingExpenseDetailsId(null);
        setExpensesSummaryDrawerOpen(true);
      }
      if (isAssetsLiabilities) {
        setEditingAssetLiabilityId(null);
        setAssetsLiabilitiesDrawerOpen(true);
      }
      if (isAcademicResults) {
        setEditingAcademicResultId(null);
        setAcademicResultsDrawerOpen(true);
      }
      if (isVoluntaryServices) {
        setEditingVoluntaryServiceId(null);
        setVoluntaryServiceDrawerOpen(true);
      }
      if (isPayments) {
        setEditingPaymentId(null);
        setPaymentDrawerOpen(true);
      }
      if (isInterview) {
        setEditingInterviewId(null);
        setInterviewDrawerOpen(true);
      }
      if (isTasks) {
        setEditingTaskId(null);
        setTasksDrawerOpen(true);
      }
    };

    return (
      <SectionTable
        data={data}
        sectionKey={sectionKey}
        sectionLabel={sectionLabel}
        isDarkMode={isDarkMode}
        selectedStudentid={selectedStudentid}
        onEdit={selectedStudent ? handleEdit : null}
        onAdd={selectedStudent ? handleAdd : null}
      />
    );
  };

  const TabContent = ({ sectionKey, data }) => renderRegion(sectionKey, data);

  const renderTabContent = (tabValue) => {
    const section = tabSections[tabValue];
    return section.key === "show_all"
      ? tabSections
        .filter((s) => s.key !== "show_all")
        .map((sec, i) => (
          (isAdmin || (sec.key !== "payments" && sec.key !== "interviews")) && (
            <TabContent key={i} sectionKey={sec.key} data={dataForSection(sec.key)} />
          )
        ))
      : <TabContent sectionKey={section.key} data={dataForSection(section.key)} />;
  };

  const handleDownloadPDF = (async () => {
    if (!selectedStudent || !studentData) {
      return;
    }
    try {
      const blob = await pdf(<StudentPDFDocument studentData={studentData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const firstName = selectedStudent.student_name || "Unknown";
      const lastName = selectedStudent.student_surname || "User";
      a.download = `${firstName} ${lastName} - Student Details PDF.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
    }
  });

  const isStudentWithNoData = isStudent && !isLoading && !selectedStudent;
  const isUserWithData = (isAdmin || isStudent) && selectedStudent;

  return (
    <div>
      <Box
        sx={{
          padding: "12px",
          backgroundColor: isDarkMode ? "#1e293b" : "#e1f5fe",
          borderRadius: "8px",
          marginBottom: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid #ccc",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: isDarkMode ? "white" : "black" }}
        >
          Student Details
        </Typography>
        {isStudentWithNoData && (
          <Button
            variant="contained"
            onClick={() => {
              setSelectedStudentid(null);
              setDrawerOpen(true);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: isDarkMode ? "white" : "black",
              color: isDarkMode ? "black" : "white",
              padding: "2px 6px",
              textTransform: "none",
            }}
          >
            <AddIcon sx={{ marginRight: 1, fontSize: "small" }} />
            Start Application
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {isAdmin && (
          <Grid item xs={12} sm={3} md={2}>
            <Paper
              sx={{
                border: "1px solid #ccc",
                backgroundColor: isDarkMode ? "#1e293b" : "white",
                color: pageStyle.color,
              }}
            >
              <Box
                sx={{
                  backgroundColor: isDarkMode ? "#1e293b" : "#e1f5fe",
                  padding: "6px",
                  borderBottom: isDarkMode ? "1px solid white" : "1px solid #ccc",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: isDarkMode ? "white" : "#1e293b",
                    marginLeft: 1,
                  }}
                >
                  Search
                </Typography>
              </Box>
              <Box sx={{ padding: 2 }}>
                <TextField
                  label="Search"
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: isDarkMode ? "#1e293b" : "white",
                      "& fieldset": {
                        borderColor: isDarkMode ? "white" : "#1e293b",
                      },
                      "&:hover fieldset": {
                        borderColor: isDarkMode ? "white" : "#1e293b",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: isDarkMode ? "white" : "#1e293b",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: isDarkMode ? "white" : "#1e293b",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: isDarkMode ? "#B0B0B0" : "#666",
                    },
                  }}
                  placeholder="Search"
                  InputLabelProps={{ style: { color: isDarkMode ? "#ffffff" : "#000000" } }}
                />
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress sx={{ color: isDarkMode ? '#F7FAFC' : '#1e293b' }} />
                  </Box>
                ) : (
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {studentDetails
                      .filter(
                        (s) =>
                          s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.student_surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.student_id_passport_number?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((student, idx) => (
                        <Card
                          key={idx}
                          sx={{
                            mb: 0.5,
                            boxShadow: 0,
                            height: 55,
                            cursor: "pointer",
                            backgroundColor:
                              selectedStudent?.id === student.id
                                ? isDarkMode
                                  ? "white"
                                  : "#1e293b"
                                : "transparent",
                            color:
                              selectedStudent?.id === student.id
                                ? isDarkMode
                                  ? "#1e293b"
                                  : "white"
                                : "inherit",
                            "&:hover": {
                              backgroundColor: isDarkMode ? "white" : "#1e293b",
                              color: isDarkMode ? "#1e293b" : "white",
                            },
                          }}
                          onClick={async () => {
                            setSelectedStudent(student);
                            setSelectedStudentid(student.id);
                            setIsLoading(true);
                            await fetchStudentData(student.id);
                            const sectionKeys = [
                              "about-me",
                              "parents-details",
                              "university-details",
                              "attachments",
                              "expenses-summary",
                              "assets-liabilities",
                              "academic-results",
                              "voluntary-services",
                              "payments",
                              "interviews",
                              "tasks",
                            ].filter((key) => isAdmin || (key !== "payments" && key !== "interviews"));
                            const responses = await Promise.all(
                              sectionKeys.map((key) => fetchSectionData(key, student.id))
                            );
                            setAboutMe(responses[sectionKeys.indexOf("about-me")]);
                            setParentsDetails(responses[sectionKeys.indexOf("parents-details")]);
                            setUniversityDetails(responses[sectionKeys.indexOf("university-details")]);
                            setAttachments(responses[sectionKeys.indexOf("attachments")]);
                            setExpensesSummary(responses[sectionKeys.indexOf("expenses-summary")]);
                            setAssetsLiabilities(responses[sectionKeys.indexOf("assets-liabilities")]);
                            setAcademicResults(responses[sectionKeys.indexOf("academic-results")]);
                            setVoluntaryServices(responses[sectionKeys.indexOf("voluntary-services")]);
                            if (isAdmin) {
                              setPayments(responses[sectionKeys.indexOf("payments")]);
                              setInterviews(responses[sectionKeys.indexOf("interviews")]);
                            }
                            setTasks(responses[sectionKeys.indexOf("tasks")]);
                          }}
                        >
                          <CardContent sx={{ padding: "10px" }}>
                            <Typography variant="body2">
                              {student.student_id_passport_number}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                              {student.student_name} {student.student_surname}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </Box>
            </Paper>
          </Grid>
        )}

        {(isAdmin || selectedStudent) && (
          <Grid item xs={12} sm={9} md={isStudent ? 12 : 10}>
            <Paper
              sx={{
                border: "1px solid #ccc",
                backgroundColor: isDarkMode ? "#1e293b" : "white",
                color: pageStyle.color,
              }}
            >
              <Box
                sx={{
                  backgroundColor: isDarkMode ? "#1e293b" : "#e1f5fe",
                  borderBottom: isDarkMode ? "1px solid white" : "1px solid #ccc",
                  padding: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: isDarkMode ? "white" : "#1e293b", marginLeft: 1 }}
                >
                  Student Details Portal
                </Typography>
                {isUserWithData && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0, margin: 0, padding: 0 }}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setDrawerOpen(false);
                        setTimeout(() => setDrawerOpen(true), 50);
                        setSelectedStudentid(selectedStudent?.id);
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: isDarkMode ? "white" : "black",
                        color: isDarkMode ? "black" : "white",
                        padding: "2px 6px",
                        margin: 0,
                        textTransform: "none",
                      }}
                    >
                      <EditIcon sx={{ marginRight: 1, fontSize: "small" }} />
                      Edit
                    </Button>
                    {isAdmin && (
                    <Button
                      variant="contained"
                      onClick={handleDownloadPDF}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: isDarkMode ? "white" : "black",
                        color: isDarkMode ? "black" : "white",
                        padding: "2px 6px",
                        margin: 0,
                        textTransform: "none",
                        marginLeft: 1,
                      }}
                    >
                      <DownloadIcon sx={{ marginRight: 1, fontSize: "small" }} />
                      Download PDF
                    </Button>
                  )}
                  </Box>
                )}
              </Box>

              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 4 }}>
                  <CircularProgress sx={{ color: isDarkMode ? "white" : "black" }} />
                  <Typography variant="body1" sx={{ ml: 2, color: isDarkMode ? "white" : "black" }}>
                    Loading...
                  </Typography>
                </Box>
              ) : selectedStudent ? (
                <Box sx={{ padding: 1.5 }}>
                  <Grid container spacing={1}>
                    {Object.entries(selectedStudent).map(([key, value], i) => (
                      key !== "id" &&
                      key !== "user_id" &&
                      key !== "employment_status_attachment" && (
                        <React.Fragment key={i}>
                          <Grid item xs={6} sx={{ borderBottom: "1px solid #ccc", pb: "6px" }}>
                            <Typography variant="body1">
                              <strong>{capitalizeWords(key.replace(/_/g, " "))}</strong>
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sx={{ borderBottom: "1px solid #ccc", pb: "6px" }}>
                            <Typography variant="body1">{value}</Typography>
                          </Grid>
                        </React.Fragment>
                      )
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Typography variant="body1" sx={{ m: 2, fontWeight: "bold", color: isDarkMode ? "white" : "black" }}>
                  No Record Selected
                </Typography>
              )}

              {!isLoading && selectedStudent && (
                <Box sx={{ p: 1, overflowX: "auto" }}>
                  <Tabs
                    value={tabValue}
                    onChange={(event, newValue) => setTabValue(newValue)}
                    aria-label="tabs"
                    sx={{
                      "& .MuiTab-root": {
                        fontWeight: "600",
                        textTransform: "capitalize",
                        mr: -2,
                        color: isDarkMode ? "white" : "black",
                      },
                    }}
                  >
                    {tabSections.map((section, i) => (
                      <Tab key={i} label={section.label} />
                    ))}
                  </Tabs>
                </Box>
              )}

              {!isLoading && selectedStudent && (
                <Box sx={{ p: 2 }}>{renderTabContent(tabValue)}</Box>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>

      {renderDrawer()}

      <AboutusDrawer
        open={aboutMeDrawerOpen}
        onClose={() => {
          setAboutMeDrawerOpen(false);
          setEditingAboutMeId(null);
        }}
        studentId={selectedStudentid}
        aboutMeId={editingAboutMeId}
        onSave={() => {
          if (selectedStudentid) {
            fetchAboutMe(selectedStudentid);
          }
          setAboutMeDrawerOpen(false);
          setEditingAboutMeId(null);
        }}
      />

      <ParentsDrawer
        open={parentsDrawerOpen}
        onClose={() => {
          setParentsDrawerOpen(false);
          setEditingParentId(null);
        }}
        studentId={selectedStudentid}
        parentId={editingParentId}
        onSave={() => {
          if (selectedStudentid) {
            fetchParentsDetails(selectedStudentid);
          }
          setParentsDrawerOpen(false);
          setEditingParentId(null);
        }}
      />

      <UniversityDetailsDrawer
        open={universityDetailsDrawerOpen}
        onClose={() => {
          setUniversityDetailsDrawerOpen(false);
          setEditingUniversityId(null);
        }}
        studentId={selectedStudentid}
        universityDetailsId={editingUniversityId}
        onSave={() => {
          if (selectedStudentid) {
            fetchUniversityDetails(selectedStudentid);
          }
          setUniversityDetailsDrawerOpen(false);
          setEditingUniversityId(null);
        }}
      />

      <AttachmentsDrawer
        open={attachmentsDrawerOpen}
        onClose={() => {
          setAttachmentsDrawerOpen(false);
          setEditingAttachmentId(null);
        }}
        studentId={selectedStudentid}
        attachmentId={editingAttachmentId}
        onSave={() => {
          if (selectedStudentid) {
            fetchAttachmentsDetails(selectedStudentid);
          }
          setAttachmentsDrawerOpen(false);
          setEditingAttachmentId(null);
        }}
      />

      <ExpenseDetailsDrawer
        open={expenseDetailsDrawerOpen}
        onClose={() => {
          setExpensesSummaryDrawerOpen(false);
          setEditingExpenseDetailsId(null);
        }}
        studentId={selectedStudentid}
        expenseDetailsId={editingExpenseDetailsId}
        onSave={() => {
          if (selectedStudentid) {
            fetchExpenseDetails(selectedStudentid);
          }
          setExpensesSummaryDrawerOpen(false);
          setEditingExpenseDetailsId(null);
        }}
      />

      <AssetsLiabilitiesDrawer
        open={assetsLiabilitiesDrawerOpen}
        onClose={() => {
          setAssetsLiabilitiesDrawerOpen(false);
          setEditingAssetLiabilityId(null);
        }}
        studentId={selectedStudentid}
        assetLiabilityId={editingAssetLiabilityId}
        onSave={() => {
          if (selectedStudentid) fetchAssetsLiabilities(selectedStudentid);
          setAssetsLiabilitiesDrawerOpen(false);
          setEditingAssetLiabilityId(null);
        }}
      />

      <AcademicResultsDrawer
        open={academicResultsDrawerOpen}
        onClose={() => {
          setAcademicResultsDrawerOpen(false);
          setEditingAcademicResultId(null);
        }}
        studentId={selectedStudentid}
        resultId={editingAcademicResultId}
        onSave={() => {
          if (selectedStudentid) fetchAcademicResults(selectedStudentid);
          setAcademicResultsDrawerOpen(false);
          setEditingAcademicResultId(null);
        }}
      />

      <VoluntaryServiceDrawer
        open={voluntaryServiceDrawerOpen}
        onClose={() => {
          setVoluntaryServiceDrawerOpen(false);
          setEditingVoluntaryServiceId(null);
        }}
        studentId={selectedStudentid}
        recordId={editingVoluntaryServiceId}
        onSave={() => {
          if (selectedStudentid) fetchVoluntaryServices(selectedStudentid);
          setVoluntaryServiceDrawerOpen(false);
          setEditingVoluntaryServiceId(null);
        }}
      />

      <PaymentDrawer
        open={paymentDrawerOpen}
        onClose={() => setPaymentDrawerOpen(false)}
        studentId={selectedStudentid}
        recordId={editingPaymentId}
        onSave={() => {
          if (selectedStudentid) {
            fetchPaymentsDetails(selectedStudentid);
          }
          setPaymentDrawerOpen(false);
          setEditingPaymentId(null);
        }}
      />

      <InterviewDrawer
        open={interviewDrawerOpen}
        onClose={() => setInterviewDrawerOpen(false)}
        studentId={selectedStudentid}
        recordId={editingInterviewId}
        onSave={() => {
          if (selectedStudentid) {
            fetchInterviewsDetails(selectedStudentid);
          }
          setInterviewDrawerOpen(false);
          setEditingInterviewId(null);
        }}
      />

      <TaskDetailsDrawer
        open={tasksDrawerOpen}
        onClose={() => {
          setTasksDrawerOpen(false);
          setEditingTaskId(null);
        }}
        studentId={selectedStudentid}
        taskId={editingTaskId}
        onSave={() => {
          if (selectedStudentid) {
            fetchTasks(selectedStudentid);
          }
          setTasksDrawerOpen(false);
          setEditingTaskId(null);
        }}
      />
    </div>
  );
};

export default StudentDetails;