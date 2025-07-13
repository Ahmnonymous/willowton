import React, { useEffect, useState, useContext } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMediaQuery } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { ThemeContext } from '../../config/ThemeContext';  // Import ThemeContext
import { parentRelationship, employmentStatus, highestEducation } from "../../components/lov"; // Import LOVs

const ParentsDrawer = ({ open, onClose, studentId, parentId, onSave }) => {
  const { isDarkMode } = useContext(ThemeContext);  // Access theme context

  const [formData, setFormData] = useState({});
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [emailError, setEmailError] = useState(""); // State for email validation error
  const [cellNumberError, setCellNumberError] = useState(""); // State for cell number validation error

  // Check for larger or smaller screen size
  const isLargeScreen = useMediaQuery("(min-width:600px)");

  // Drawer width based on screen size
  const drawerWidth = isLargeScreen ? 500 : 330;

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Cell number validation function
  const validateCellNumber = (number) => {
    const cellRegex = /^\d{10}$/;
    return cellRegex.test(number);
  };

  useEffect(() => {
    if (open) {
      if (parentId) {
        fetch(`https://willowtonbursary.co.za/api/parents-details/id/${parentId}`)
          .then((res) => res.json())
          .then((data) => {
            setFormData(data);
            // Validate email and cell number on load
            if (data.parent_email_address) {
              setEmailError(validateEmail(data.parent_email_address) ? "" : "Please enter a valid email address");
            } else {
              setEmailError("");
            }
            if (data.parent_cell_number) {
              setCellNumberError(validateCellNumber(data.parent_cell_number) ? "" : "Cell number must be exactly 10 digits");
            } else {
              setCellNumberError("");
            }
          });
      } else {
        setFormData({
          student_details_portal_id: studentId,
          parent_relationship: "",
          parent_name: "",
          parent_surname: "",
          parent_cell_number: "",
          parent_email_address: "",
          parent_employment_status: "",
          parent_industry: "",
          parent_highest_education: "",
          parent_salary: "",
          parent_grant: "",
          parent_other_income: "",
        });
        setEmailError("");
        setCellNumberError("");
      }
    } else {
      setFormData({});
      setEmailError("");
      setCellNumberError("");
    }
  }, [open, parentId, studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate email on change
    if (name === "parent_email_address") {
      setEmailError(value && !validateEmail(value) ? "Please enter a valid email address" : "");
    }

    // Validate cell number on change
    if (name === "parent_cell_number") {
      // Allow only digits and limit to 10
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      setCellNumberError(numericValue && !validateCellNumber(numericValue) ? "Cell number must be exactly 10 digits" : "");
    }
  };

  const handleSave = async () => {
    // Prevent save if email or cell number is invalid
    if (formData.parent_email_address && !validateEmail(formData.parent_email_address)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (formData.parent_cell_number && !validateCellNumber(formData.parent_cell_number)) {
      setCellNumberError("Cell number must be exactly 10 digits");
      return;
    }

    const isUpdate = !!formData.id;
    const url = isUpdate
      ? `https://willowtonbursary.co.za/api/parents-details/update/${formData.id}`
      : "https://willowtonbursary.co.za/api/parents-details/insert";
    const method = isUpdate ? "PUT" : "POST";

    const body = { ...formData };
    if (!isUpdate) delete body.id;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const result = await res.json();
      onSave(result);
      // setsuccessmessage(isUpdate ? "Parent details updated successfully!" : "Parent details created successfully!");
      onClose();
    } else {
      console.error("Failed to save parent data");
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    setDeleteConfirmationOpen(false);
    const res = await fetch(`https://willowtonbursary.co.za/api/parents-details/delete/${formData.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      onSave(null);
      // setsuccessmessage("Parent details deleted successfully!");
      onClose();
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{
        width: drawerWidth,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: isDarkMode ? '#2D3748' : '#fff'
      }}>
        {/* Header */}
        <Box sx={{
          p: 2,
          borderBottom: "1px solid #ccc",
          backgroundColor: isDarkMode ? '#1E293B' : '#e1f5fe'
        }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDarkMode ? '#F7FAFC' : '#1E293B' }}>
            Parent Details
          </Typography>
          {successMessage && (
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              {successMessage}
            </Typography>
          )}
        </Box>

        {/* Form Content */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          <Grid container spacing={2}>
            {Object.entries(formData).map(([key, value]) => {
              if (key === "id" || key === "student_details_portal_id" || key === "parent_date_stamp") return null;

              let label = key.replace(/_/g, " ");
              label = label
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

              if (key === "parent_relationship") {
                return (
                  <Grid item xs={12} key={key}>
                    <Autocomplete
                      value={value || ""}
                      onChange={(e, newValue) => handleChange({ target: { name: key, value: newValue } })}
                      options={parentRelationship}
                      renderInput={(params) => <TextField {...params} label={label} sx={{
                        backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                        borderRadius: '8px',
                        color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        '& .MuiInputBase-input': {
                          color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        }
                      }}
                        InputLabelProps={{ style: { color: isDarkMode ? '#ffffff' : '#000000' } }}
                      />}
                    />
                  </Grid>
                );
              }
              if (key === "parent_employment_status") {
                return (
                  <Grid item xs={12} key={key}>
                    <Autocomplete
                      value={value || ""}
                      onChange={(e, newValue) => handleChange({ target: { name: key, value: newValue } })}
                      options={employmentStatus}
                      renderInput={(params) => <TextField {...params} label={label} sx={{
                        backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                        borderRadius: '8px',
                        color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        '& .MuiInputBase-input': {
                          color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        }
                      }}
                        InputLabelProps={{ style: { color: isDarkMode ? '#ffffff' : '#000000' } }}
                      />}
                    />
                  </Grid>
                );
              }
              if (key === "parent_highest_education") {
                return (
                  <Grid item xs={12} key={key}>
                    <Autocomplete
                      value={value || ""}
                      onChange={(e, newValue) => handleChange({ target: { name: key, value: newValue } })}
                      options={highestEducation}
                      renderInput={(params) => <TextField {...params} label={label} sx={{
                        backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                        borderRadius: '8px',
                        color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        '& .MuiInputBase-input': {
                          color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        }
                      }}
                        InputLabelProps={{ style: { color: isDarkMode ? '#ffffff' : '#000000' } }}
                      />}
                    />
                  </Grid>
                );
              }
              if (key === "parent_email_address") {
                return (
                  <Grid item xs={12} key={key}>
                    <TextField
                      name={key}
                      label={label}
                      type="email"
                      fullWidth
                      value={value || ""}
                      onChange={handleChange}
                      error={!!emailError}
                      helperText={emailError}
                      sx={{
                        backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                        color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        borderRadius: '8px',
                        '& .MuiInputBase-input': {
                          color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        }
                      }}
                      InputLabelProps={{ style: { color: isDarkMode ? '#ffffff' : '#000000' } }}
                    />
                  </Grid>
                );
              }
              if (key === "parent_cell_number") {
                return (
                  <Grid item xs={12} key={key}>
                    <TextField
                      name={key}
                      label={label}
                      type="tel"
                      fullWidth
                      value={value || ""}
                      onChange={handleChange}
                      error={!!cellNumberError}
                      helperText={cellNumberError}
                      inputProps={{
                        maxLength: 10,
                        pattern: "[0-9]*",
                      }}
                      sx={{
                        backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                        color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        borderRadius: '8px',
                        '& .MuiInputBase-input': {
                          color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        }
                      }}
                      InputLabelProps={{ style: { color: isDarkMode ? '#ffffff' : '#000000' } }}
                    />
                  </Grid>
                );
              }

              return (
                <Grid item xs={12} key={key}>
                  <TextField
                    name={key}
                    label={label}
                    fullWidth
                    value={value || ""}
                    onChange={handleChange}
                    sx={{
                      backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                      color: isDarkMode ? '#F7FAFC' : '#1E293B',
                      borderRadius: '8px',
                      '& .MuiInputBase-input': {
                        color: isDarkMode ? '#F7FAFC' : '#1E293B',
                      }
                    }}
                    InputLabelProps={{ style: { color: isDarkMode ? '#ffffff' : '#000000' } }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Footer */}
        <Divider />
        <Box sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between"
        }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={onClose}
              startIcon={<CloseIcon />}
              size="small"
              variant="outlined"
              sx={{
                borderColor: isDarkMode ? '#F7FAFC' : '#1E293B',
                color: isDarkMode ? '#F7FAFC' : '#1E293B',
              }}
            >
              Close
            </Button>
            {formData.id && (
              <Button
                onClick={() => setDeleteConfirmationOpen(true)}
                startIcon={<DeleteIcon />}
                size="small"
                color="error"
                variant="outlined"
                sx={{
                  borderColor: isDarkMode ? '#F7FAFC' : '#1E293B',
                  color: 'red',
                }}
              >
                Delete
              </Button>
            )}
          </Box>
          <Button
            onClick={handleSave}
            startIcon={formData.id ? <SaveIcon /> : <AddIcon />}
            variant="contained"
            size="small"
          >
            {formData.id ? "Save" : "Create"}
          </Button>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this record?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Drawer>
  );
};

export default ParentsDrawer;