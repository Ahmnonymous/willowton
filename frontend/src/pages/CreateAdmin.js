import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
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
  Drawer,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropUpIcon from "@mui/icons-material/ArrowUpward";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme, useMediaQuery } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import * as XLSX from "xlsx";
import { ThemeContext } from '../config/ThemeContext';
import '../css/GenericTable.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Validation Schema for Form
const validationSchema = yup.object({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email_address: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().min(6, "Password should be at least 6 characters").required("Password is required"),
  user_type: yup.string().required("Please select user type"),
});

const UserReport = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [columns, setColumns] = useState(['first_name', 'last_name', 'email_address', 'user_type']);
  const [visibleColumns, setVisibleColumns] = useState(['first_name', 'last_name', 'email_address', 'user_type']);
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
  const userType = JSON.parse(localStorage.getItem("user"))?.user_type;

  const sentenceCase = useCallback((str) => {
    return str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }, []);

  const calculateColumnWidth = useCallback((col) => {
    const headerText = sentenceCase(col);
    const charCount = headerText.length;
    const pixelsPerChar = 10;
    const minWidth = 50;
    const calculatedWidth = charCount * pixelsPerChar + 40;
    return Math.max(minWidth, calculatedWidth);
  }, [sentenceCase]);

  const fetchUsers = useCallback(async () => {
    let apiUrl = userType === "admin" ? `${API_BASE_URL}/users` : `${API_BASE_URL}/users/${JSON.parse(localStorage.getItem("user"))?.user_id}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const records = userType === "admin" ? (Array.isArray(data) ? data : []) : [data];
      setUsers(records);
      if (records.length > 0) {
        const cols = ['first_name', 'last_name', 'email_address', 'user_type'];
        setColumns(cols);
        setVisibleColumns(cols);
        setColumnWidths(cols.reduce((acc, col) => ({
          ...acc,
          [col]: calculateColumnWidth(col),
        }), {}));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  }, [userType, calculateColumnWidth]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  const fetchUserById = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      const data = await response.json();
      setEditUser(data);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      first_name: editUser ? editUser.first_name : "",
      last_name: editUser ? editUser.last_name : "",
      email_address: editUser ? editUser.email_address : "",
      password: "",
      user_type: "admin",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = editUser
          ? await fetch(`${API_BASE_URL}/users/${editUser.user_id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            })
          : await fetch(`${API_BASE_URL}/users`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });
        if (response.ok) {
          const data = await response.json();
          setUsers((prevUsers) =>
            editUser
              ? prevUsers.map((user) => (user.user_id === data.user_id ? data : user))
              : [...prevUsers, data]
          );
          setDrawerOpen(false);
        } else {
          console.error("Failed to save data");
        }
      } catch (error) {
        console.error("Error saving user:", error);
      }
    },
  });

  const handleCreateClick = () => {
    setEditUser(null);
    setDrawerOpen(true);
  };

  const handleEditClick = (user) => {
    fetchUserById(user.user_id);
    setDrawerOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!editUser) return;
    try {
      await fetch(`${API_BASE_URL}/users/${editUser.user_id}`, {
        method: "DELETE",
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== editUser.user_id));
      setDeleteConfirmationOpen(false);
      setDrawerOpen(false);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

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
    const data = filteredUsers.map((user) =>
      Object.fromEntries(visibleColumns.map((col) => [sentenceCase(col), user[col]]))
    );
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'UserReport');
    XLSX.writeFile(wb, 'user_report.xlsx');
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

  const filteredUsers = users
    .filter((user) =>
      visibleColumns.some((col) => {
        const val = user[col];
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

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  useEffect(() => {
    setTotalRecords(filteredUsers.length);
  }, [filteredUsers]);

  const filteredColumns = columns.filter((col) => {
    const lowerTerm = columnSearchTerm.toLowerCase();
    const raw = col.toLowerCase();
    const formatted = sentenceCase(col).toLowerCase();
    return raw.includes(lowerTerm) || formatted.includes(lowerTerm);
  });

  return (
    // <Box sx={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC', minHeight: '100vh', p: 2 }}>
    <Box
          sx={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC', minHeight: '100vh', p: 2 }}
          className={isDarkMode ? 'dark-mode' : ''}
        >
      {/* Header Section with Search and Icons */}
      <Box sx={{ padding: "12px", backgroundColor: isDarkMode ? '#1e293b' : '#e1f5fe', borderRadius: "8px", marginBottom: "12px", border: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: isDarkMode ? 'white' : 'black', fontWeight: "bold" }}>
          User Information
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search input field */}
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
              {userType === "admin" && (
                <>
                  <Typography sx={{ color: isDarkMode ? 'white' : 'black', fontSize: '1rem' }}>|</Typography>
                  <Tooltip title="Create User">
                    <Button
                      variant="contained"
                      onClick={handleCreateClick}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: isDarkMode ? 'white' : 'black',
                        color: isDarkMode ? 'black' : 'white',
                        padding: "2px 6px",
                        textTransform: "none",
                        fontSize: '0.85rem',
                      }}
                    >
                      <AddIcon sx={{ mr: 0.5, fontSize: 15 }} />
                      Create
                    </Button>
                  </Tooltip>
                </>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Column Visibility Menu */}
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

      {/* Table */}
      <div className="generic-table-container">
        <table className="generic-table" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ color: isDarkMode ? 'white' : '#1e293b', width: 50, minWidth: 50 }}></th>
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
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr key={user.user_id}>
                  <td style={{ color: isDarkMode ? 'white' : '#1e293b', width: 50, minWidth: 50 }}>
                    <Button
                      onClick={() => handleEditClick(user)}
                      size="small"
                      sx={{ color: isDarkMode ? '#F7FAFC' : '#1E293B' }}
                    >
                      <EditIcon fontSize="small" />
                    </Button>
                  </td>
                  {visibleColumns.map((col) => {
  const isUserTypeCol = col === 'user_type';

  return (
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
      {isUserTypeCol ? (
        <span
          style={{
            backgroundColor: user[col] === 'student' ? '#1e88e5' : user[col] === 'admin' ? '#43a047' : '#9e9e9e',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            display: 'inline-block',
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
          }}
        >
          {user[col]}
        </span>
      ) : (
        user[col]
      )}
    </td>
  );
})}

                </tr>
              ))
            ) : (
              <tr><td colSpan={visibleColumns.length + 1} className="no-matching-records">No matching records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

      {/* Drawer for creating or editing user */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
        <Box sx={{ width: isSmallScreen ? 330 : 500, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: isDarkMode ? '#2D3748' : '#ffffff' }}>
          <Box sx={{ p: 2, borderBottom: "1px solid #ccc" }}>
            <Typography variant="h6" sx={{ color: isDarkMode ? '#F7FAFC' : '#1E293B' }}>{editUser ? "Edit User" : "Create User"}</Typography>
          </Box>
          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="First Name"
                    fullWidth
                    name="first_name"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                    helperText={formik.touched.first_name && formik.errors.first_name}
                    sx={{
                      backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                      '& .MuiInputBase-input': { color: isDarkMode ? 'white' : '#1e293b' },
                    }}
                    InputLabelProps={{ style: { color: isDarkMode ? '#ffffff' : '#000000' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Last Name"
                    fullWidth
                    name="last_name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                    helperText={formik.touched.last_name && formik.errors.last_name}
                    sx={{
                      backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                      '& .MuiInputBase-input': { color: isDarkMode ? 'white' : '#1e293b' },
                    }}
                    InputLabelProps={{ style: { color: isDarkMode ? '#ffffff' : '#000000' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email Address"
                    fullWidth
                    name="email_address"
                    value={formik.values.email_address}
                    onChange={formik.handleChange}
                    error={formik.touched.email_address && Boolean(formik.errors.email_address)}
                    helperText={formik.touched.email_address && formik.errors.email_address}
                    sx={{
                      backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                      '& .MuiInputBase-input': { color: isDarkMode ? 'white' : '#1e293b' },
                    }}
                    InputLabelProps={{ style: { color: isDarkMode ? '#ffffff' : '#000000' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    fullWidth
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    sx={{
                      backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                      '& .MuiInputBase-input': { color: isDarkMode ? 'white' : '#1e293b' },
                    }}
                    InputLabelProps={{ style: { color: isDarkMode ? '#ffffff' : '#000000' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="User Type"
                    value={editUser ? editUser.user_type : "admin"}
                    disabled
                    fullWidth
                    sx={{
                      backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                      '& .MuiInputBase-input': { color: isDarkMode ? 'white' : '#1E293B' },
                      '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: isDarkMode ? 'white' : '#1E293B' },
                    }}
                    InputLabelProps={{ style: { color: isDarkMode ? '#ffffff' : '#000000' } }}
                  />
                </Grid>
              </Grid>
            </form>
          </Box>
          <Divider />
          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", marginTop: "auto" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                onClick={handleCloseDrawer}
                startIcon={<CloseIcon />}
                size="small"
                variant="outlined"
                sx={{ borderColor: isDarkMode ? '#F7FAFC' : '#1E293B', color: isDarkMode ? '#F7FAFC' : '#1E293B' }}
              >
                Close
              </Button>
              {editUser && userType !== "student" && (
                <Button
                  onClick={handleDeleteClick}
                  startIcon={<DeleteIcon />}
                  size="small"
                  color="error"
                  variant="outlined"
                  sx={{ borderColor: isDarkMode ? '#F7FAFC' : '#1E293B' }}
                >
                  Delete
                </Button>
              )}
            </Box>
            <Button
              onClick={formik.handleSubmit}
              startIcon={editUser ? <SaveIcon /> : <AddIcon />}
              variant="contained"
              size="small"
              sx={{ backgroundColor: '#1976d2', color: 'white' }}
            >
              {editUser ? "Save" : "Create"}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Confirmation Dialog for Deletion */}
      <Dialog open={deleteConfirmationOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserReport;