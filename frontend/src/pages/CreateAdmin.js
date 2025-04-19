import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Drawer,
  TextField,
  Grid,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { ThemeContext } from '../config/ThemeContext';  // Import ThemeContext

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
  const { isDarkMode } = useContext(ThemeContext);  // Access theme context
  const [users, setUsers] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("https://localhost/api/users");
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  // Fetch user by ID for editing
  const fetchUserById = async (id) => {
    const response = await fetch(`https://localhost/api/users/${id}`);
    const data = await response.json();
    setEditUser(data);
  };

  // Formik for handling user form
  const formik = useFormik({
    initialValues: {
      first_name: editUser ? editUser.first_name : "",
      last_name: editUser ? editUser.last_name : "",
      email_address: editUser ? editUser.email_address : "",
      password: "",
      user_type: "Admin",  // Set "Admin" as the default value for user_type
    },
    validationSchema: validationSchema,
    enableReinitialize: true, // Reinitialize when `editUser` changes
    onSubmit: async (values) => {
      const response = editUser
        ? await fetch(`https://localhost/api/users/${editUser.user_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          })
        : await fetch("https://localhost/api/users", {
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
    },
  });
  
  const handleCreateClick = () => {
    setEditUser(null); // Clear any selected user for new creation
    setDrawerOpen(true); // Open the drawer for creating new user
  };

  const handleEditClick = (user) => {
    fetchUserById(user.user_id); // Fetch user data by ID for editing
    setDrawerOpen(true); // Open the drawer for editing user details
  };

  const handleDeleteClick = () => {
    setDeleteConfirmationOpen(true); // Open confirmation dialog
  };

  const handleDeleteConfirm = async () => {
    if (!editUser) return;
    try {
      await fetch(`https://localhost/api/users/${editUser.user_id}`, {
        method: "DELETE",
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== editUser.user_id));
      setDeleteConfirmationOpen(false);
      setDrawerOpen(false);
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false); // Close confirmation dialog
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ backgroundColor: isDarkMode ? '#2D3748' : '#F7FAFC', minHeight: '100vh' }}>
      {/* Header Section with Button */}
      <Box sx={{ border: '1px solid #ccc', padding: "12px", backgroundColor: isDarkMode ? '#1E293B' : '#e1f5fe', borderRadius: "8px", marginBottom: "12px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: isDarkMode ? '#F7FAFC' : '#1E293B' }}>Create Admin</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateClick}
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: isDarkMode ? 'white' : 'black',//'#1E293B',
            color: isDarkMode ? 'black' : 'white',//'#fff',
            fontSize: "0.75rem",
            padding: "2px 6px",
            textTransform: "none",
          }}
        >
          <AddIcon sx={{ marginRight: 1, fontSize: 15 }} />
          Create
        </Button>
      </Box>

      {/* User Table */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer sx={{ width: "100%" }}>
            <Table sx={{ backgroundColor: isDarkMode ? '#1A202C' : '#ffffff', borderRadius: '8px' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ padding: "10px", color: isDarkMode ? '#F7FAFC' : '#1E293B', fontWeight: 'bold' }}></TableCell>
                  <TableCell sx={{ padding: "10px", color: isDarkMode ? '#F7FAFC' : '#1E293B', fontWeight: 'bold' }}>First Name</TableCell>
                  <TableCell sx={{ padding: "10px", color: isDarkMode ? '#F7FAFC' : '#1E293B', fontWeight: 'bold' }}>Last Name</TableCell>
                  <TableCell sx={{ padding: "10px", color: isDarkMode ? '#F7FAFC' : '#1E293B', fontWeight: 'bold' }}>Email Address</TableCell>
                  <TableCell sx={{ padding: "10px", color: isDarkMode ? '#F7FAFC' : '#1E293B', fontWeight: 'bold' }}>User Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell sx={{ padding: "5px" }}>
                      <Button
                        onClick={() => handleEditClick(user)}
                        sx={{ cursor: "pointer", fontSize: "1rem" }}
                      >
                        <EditIcon />
                      </Button>
                    </TableCell>
                    <TableCell sx={{ padding: "10px", color: isDarkMode ? '#F7FAFC' : '#1E293B' }}>{user.first_name}</TableCell>
                    <TableCell sx={{ padding: "10px", color: isDarkMode ? '#F7FAFC' : '#1E293B' }}>{user.last_name}</TableCell>
                    <TableCell sx={{ padding: "10px", color: isDarkMode ? '#F7FAFC' : '#1E293B' }}>{user.email_address}</TableCell>
                    <TableCell sx={{ padding: "10px", color: isDarkMode ? '#F7FAFC' : '#1E293B' }}>{user.user_type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Drawer for creating or editing user */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
        <Box sx={{ width: 400, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: isDarkMode ? '#2D3748' : '#ffffff' }}>
          <Box sx={{ p: 2, borderBottom: "1px solid #ccc" }}>
            <Typography variant="h6" sx={{ color: isDarkMode ? '#F7FAFC' : '#1E293B' }}>{editUser ? "Edit User" : "Create User"}</Typography>
          </Box>

          {/* Form Content */}
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
                    sx={{ backgroundColor: isDarkMode ? '#1A202C' : '#ffffff', color: isDarkMode ? '#F7FAFC' : '#1E293B' 
                      ,'& .MuiInputBase-input': {
                        color: isDarkMode ? 'white' : '#1e293b',  // Text color inside the input field
                      }
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
                    sx={{ backgroundColor: isDarkMode ? '#1A202C' : '#ffffff', color: isDarkMode ? '#F7FAFC' : '#1E293B' 
                      ,'& .MuiInputBase-input': {
                        color: isDarkMode ? 'white' : '#1e293b',  // Text color inside the input field
                      }
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
                    sx={{ backgroundColor: isDarkMode ? '#1A202C' : '#ffffff', color: isDarkMode ? '#F7FAFC' : '#1E293B' 
                      ,'& .MuiInputBase-input': {
                        color: isDarkMode ? 'white' : '#1e293b',  // Text color inside the input field
                      }
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
                    sx={{ backgroundColor: isDarkMode ? '#1A202C' : '#ffffff', color: isDarkMode ? '#F7FAFC' : '#1E293B' 
                      ,'& .MuiInputBase-input': {
                        color: isDarkMode ? 'white' : '#1e293b',  // Text color inside the input field
                      }
                    }}
                    InputLabelProps={{ style: { color: isDarkMode ? '#ffffff' : '#000000' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                <TextField
                  label="User Type"
                  value="Admin" // Default value
                  disabled // Makes the field non-editable
                  fullWidth
                  sx={{
                    backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',  // Background color
                    color: isDarkMode ? 'white' : '#1E293B',  // Label color
                    marginTop: 2,
                    '& .MuiInputBase-input': {
                      color: isDarkMode ? 'white' : '#1E293B',  // Text color inside the input field
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? '#ffffff' : '#000000',  // Label color
                    },
                    '& .MuiInputBase-root.Mui-disabled': {
                      backgroundColor: isDarkMode ? '#1A202C' : '#ffffff', // Background color for disabled state
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: isDarkMode ? 'white' : '#1E293B',  // Text color inside the input field when disabled
                    },
                    display: 'none'
                  }}
                  InputLabelProps={{
                    style: { color: isDarkMode ? '#ffffff' : '#000000' }
                  }}
                />

                </Grid>
              </Grid>
            </form>
          </Box>

          {/* Footer */}
          <Divider />
          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", marginTop: "auto" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                onClick={handleCloseDrawer}
                startIcon={<CloseIcon />}
                size="small"
                variant="outlined"
                sx={{ borderColor: isDarkMode ? '#F7FAFC' : '#1E293B' }}
              >
                Close
              </Button>
              {editUser && (
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
