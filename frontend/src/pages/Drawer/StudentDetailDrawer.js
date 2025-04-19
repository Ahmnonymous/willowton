import React, { useState, useEffect, useContext } from "react";
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
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  studentType,
  religions,
  financeType,
  races,
  maritalStatus,
  employmentStatus,
  highestEducation,
  nationality,
  provinces,
} from "../../components/lov"; // Import LOVs
import { ThemeContext } from '../../config/ThemeContext';  // Import ThemeContext

const StudentDetailDrawer = ({ open, onClose, studentId, onSave }) => {
  const { isDarkMode } = useContext(ThemeContext);  // Access theme context

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_name: "",
    student_surname: "",
    student_nationality: "",
    student_id_passport_number: "",
    student_type: "",
    student_religion: "",
    student_finance_type: "",
    student_whatsapp_number: "",
    student_alternative_number: "",
    student_email_address: "",
    student_highest_education: "",
    student_home_address: "",
    student_suburb: "",
    student_area_code: "",
    student_province: "",
    student_dob: "",
    student_race: "",
    student_marital_status: "",
    student_employment_status: "",
    student_job_title: "",
    student_industry: "",
    student_company_of_employment: "",
    student_current_salary: "",
    student_number_of_siblings: "",
    student_siblings_bursary: "",
    student_willow_relationship: "",
    student_relationship_type: "",
    student_employee_name: "",
    student_employee_designation: "",
    student_employee_branch: "",
    student_employee_number: "",
    student_emergency_contact_name: "",
    student_emergency_contact_number: "",
    student_emergency_contact_relationship: "",
    student_emergency_contact_address: "",
    student_date_stamp: "",
  });

  useEffect(() => {
    if (open) {
      if (studentId) {
        const fetchStudentData = async () => {
          try {
            const response = await fetch(`https://willowtonbursary.co.za/api/student-details/${studentId}`);
            const data = await response.json();
            setFormData((prev) => ({
              ...prev,
              ...data,
              student_dob: data.student_dob ? data.student_dob.split("T")[0] : "",
            }));
          } catch (error) {
            console.error("Error fetching student data:", error);
          }
        };
        fetchStudentData();
      } else {
        setFormData({
          student_name: '',
          student_surname: '',
          student_nationality: '',
          student_id_passport_number: '',
          student_type: '',
          student_religion: '',
          student_finance_type: '',
          student_whatsapp_number: '',
          student_alternative_number: '',
          student_email_address: '',
          student_highest_education: '',
          student_home_address: '',
          student_suburb: '',
          student_area_code: '',
          student_province: '',
          student_dob: '',
          student_race: '',
          student_marital_status: '',
          student_employment_status: '',
          student_job_title: '',
          student_industry: '',
          student_company_of_employment: '',
          student_current_salary: '',
          student_number_of_siblings: '',
          student_siblings_bursary: '',
          student_willow_relationship: '',
          student_relationship_type: '',
          student_employee_name: '',
          student_employee_designation: '',
          student_employee_branch: '',
          student_employee_number: '',
          student_emergency_contact_name: '',
          student_emergency_contact_number: '',
          student_emergency_contact_relationship: '',
          student_emergency_contact_address: '',
          student_date_stamp: ''
        });
      }
    }
  }, [open, studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = async () => {
    const url = studentId
      ? `https://willowtonbursary.co.za/api/student-details/update/${studentId}`
      : `https://willowtonbursary.co.za/api/student-details/insert`;
    const method = studentId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedStudent = await response.json();
        onSave(savedStudent);
        onClose();
      } else {
        console.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving student data:", error);
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirmationOpen(true); // Open the dialog
  };

  const handleDeleteConfirm = async () => {
    if (!studentId) return;

    try {
      const response = await fetch(
        `https://willowtonbursary.co.za/api/student-details/delete/${studentId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        onSave(null);
        onClose();
        setDeleteConfirmationOpen(false); // Close the confirmation dialog
      } else {
        console.error("Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false); // Close the confirmation dialog
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, height: "100%", display: "flex", flexDirection: "column", backgroundColor: isDarkMode ? '#2D3748' : '#fff' }}>
        {/* Header */}
        <Box sx={{ padding: 2, borderBottom: "1px solid #ccc", backgroundColor: isDarkMode ? '#1E293B' : '#e1f5fe' }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDarkMode ? '#F7FAFC' : '#1E293B' }}>
            Student Details
          </Typography>
        </Box>

        {/* Form content */}
        <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
          <Grid container spacing={2}>
            {Object.keys(formData).map((key, index) => {
              if (key === "student_dob") {
                return (
                  <Grid item xs={12} key={index}>
                    <TextField
                      label="Student DOB"
                      name="student_dob"
                      type="date"
                      fullWidth
                      value={formData.student_dob || ""}
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
              }

              if (key === "student_number_of_siblings") {
                return (
                  <Grid item xs={12} key={index}>
                    <TextField
                      label="Number of Siblings"
                      name="student_number_of_siblings"
                      type="number"
                      fullWidth
                      value={formData.student_number_of_siblings || ""}
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
              }

              // Exclude `student_date_stamp` and `id`
              if (key === "student_date_stamp" || key === "id") return null;

              let label = key.replace(/_/g, " ").toLowerCase();
              label = label
                .split(" ") // Split by space
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
                .join(" "); // Rejoin into a string

              // Handling LOV fields with Autocomplete for other fields
              if (key === "student_nationality") {
                return (
                  <Grid item xs={12} key={index}>
                    <Autocomplete
                      value={formData[key] || ""}
                      onChange={(e, newValue) => handleChange({ target: { name: key, value: newValue } })}
                      options={nationality}
                      renderInput={(params) => <TextField {...params} label={label} sx={{
                        backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                        color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        borderRadius: '8px',
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

              if (key === "student_province") {
                return (
                  <Grid item xs={12} key={index}>
                    <Autocomplete
                      value={formData[key] || ""}
                      onChange={(e, newValue) => handleChange({ target: { name: key, value: newValue } })}
                      options={provinces}
                      renderInput={(params) => <TextField {...params} label={label} sx={{
                        backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                        color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        borderRadius: '8px',
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

              // Handling LOV fields with Autocomplete for other fields
              if (key === "student_type") {
                return (
                  <Grid item xs={12} key={index}>
                    <Autocomplete
                      value={formData[key] || ""}
                      onChange={(e, newValue) => handleChange({ target: { name: key, value: newValue } })}
                      options={studentType}
                      renderInput={(params) => <TextField {...params} label={label} sx={{
                        backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                        color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        borderRadius: '8px',
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

              if (key === "student_religion") {
                return (
                  <Grid item xs={12} key={index}>
                    <Autocomplete
                      value={formData[key] || ""}
                      onChange={(e, newValue) => handleChange({ target: { name: key, value: newValue } })}
                      options={religions}
                      renderInput={(params) => <TextField {...params} label={label} sx={{
                        backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                        color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        borderRadius: '8px',
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

              if (key === "student_finance_type") {
                return (
                  <Grid item xs={12} key={index}>
                    <Autocomplete
                      value={formData[key] || ""}
                      onChange={(e, newValue) => handleChange({ target: { name: key, value: newValue } })}
                      options={financeType}
                      renderInput={(params) => <TextField {...params} label={label} sx={{
                        backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                        color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        borderRadius: '8px',
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

              if (key === "student_race") {
                return (
                  <Grid item xs={12} key={index}>
                    <Autocomplete
                      value={formData[key] || ""}
                      onChange={(e, newValue) => handleChange({ target: { name: key, value: newValue } })}
                      options={races}
                      renderInput={(params) => <TextField {...params} label={label} sx={{
                        backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                        color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        borderRadius: '8px',
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

              if (key === "student_marital_status") {
                return (
                  <Grid item xs={12} key={index}>
                    <Autocomplete
                      value={formData[key] || ""}
                      onChange={(e, newValue) => handleChange({ target: { name: key, value: newValue } })}
                      options={maritalStatus}
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

              if (key === "student_employment_status") {
                return (
                  <Grid item xs={12} key={index}>
                    <Autocomplete
                      value={formData[key] || ""}
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

              if (key === "student_highest_education") {
                return (
                  <Grid item xs={12} key={index}>
                    <Autocomplete
                      value={formData[key] || ""}
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

              return (
                <Grid item xs={12} key={index}>
                  <TextField
                    label={label}
                    name={key}
                    fullWidth
                    value={formData[key] || ""}
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
        <Box sx={{ padding: 2, borderTop: "1px solid #ccc", display: "flex", justifyContent: "space-between" }}>
          {/* Left side: Close & Delete */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              size="small"
              sx={{
                borderColor: isDarkMode ? '#F7FAFC' : '#1E293B', // Border color for dark/light mode
                color: isDarkMode ? '#F7FAFC' : '#1E293B', // Text color
              }}
              startIcon={<CloseIcon />}
            >
              Close
            </Button>

            {studentId && (
              <Button
                onClick={handleDeleteClick} // Open the dialog
                variant="outlined"
                size="small"
                sx={{
                  borderColor: isDarkMode ? '#F7FAFC' : '#1E293B', // Red border color for delete button
                  color: 'red', // Red text color for delete button
                }}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            )}
          </Box>

          {/* Right side: Create or Save */}
          <Box sx={{ display: "flex", gap: 1 }}>
            {!studentId ? (
              <Button
                onClick={handleSave}
                variant="contained"
                size="small"
                color="primary"
                startIcon={<AddIcon />}
              >
                Create
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                variant="contained"
                size="small"
                color="primary"
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            )}
          </Box>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog
          open={deleteConfirmationOpen}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this record?
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
    </Drawer>
  );
};

export default StudentDetailDrawer;
