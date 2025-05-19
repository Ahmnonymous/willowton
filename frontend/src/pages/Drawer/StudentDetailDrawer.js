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
import { useMediaQuery } from "@mui/material";
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
  yes_no,
} from "../../components/lov"; // Import LOVs
import { ThemeContext } from '../../config/ThemeContext';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parse } from 'date-fns';

const StudentDetailDrawer = ({ open, onClose, studentId, onSave, onDelete }) => {
  const { isDarkMode } = useContext(ThemeContext);  // Access theme context
  const [selectedDate, setSelectedDate] = useState(null);
  const [emailError, setEmailError] = useState(""); // State for email validation error
  const [whatsappError, setWhatsappError] = useState(""); // State for WhatsApp number validation error
  const [alternativeError, setAlternativeError] = useState(""); // State for alternative number validation error
  const [emergencyError, setEmergencyError] = useState(""); // State for emergency contact number validation error

  // Check for larger or smaller screen size
  const isLargeScreen = useMediaQuery("(min-width:600px)");

  // Drawer width based on screen size
  // const - Drawer width based on screen size
  const drawerWidth = isLargeScreen ? 500 : 330;

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
    student_date_of_birth: "",
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

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Number validation function for 10 digits
  const validateNumber = (number) => {
    const numberRegex = /^\d{10}$/;
    return numberRegex.test(number);
  };

  useEffect(() => {
    if (open) {
      if (studentId) {
        const fetchStudentData = async () => {
          try {
            const response = await fetch(`https://willowtonbursary.co.za/api/student-details/${studentId}`);
            const data = await response.json();
            const dates = data.student_date_of_birth ? parse(data.student_date_of_birth, 'MM/dd/yyyy', new Date()) : null;
            setSelectedDate(dates);
            setFormData((prev) => ({
              ...prev,
              ...data,
              student_date_of_birth: dates,
            }));
            // Validate fields on load
            setEmailError(data.student_email_address && !validateEmail(data.student_email_address) ? "Please enter a valid email address" : "");
            setWhatsappError(data.student_whatsapp_number && !validateNumber(data.student_whatsapp_number) ? "WhatsApp number must be exactly 10 digits" : "");
            setAlternativeError(data.student_alternative_number && !validateNumber(data.student_alternative_number) ? "Alternative number must be exactly 10 digits" : "");
            setEmergencyError(data.student_emergency_contact_number && !validateNumber(data.student_emergency_contact_number) ? "Emergency contact number must be exactly 10 digits" : "");
          } catch (error) {
            console.error("Error fetching student data:", error);
          }
        };
        fetchStudentData();
      } else {
        setSelectedDate(null);
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
          student_date_of_birth: '',
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
        setEmailError("");
        setWhatsappError("");
        setAlternativeError("");
        setEmergencyError("");
      }
    }
  }, [open, studentId]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    const formattedDate = newDate ? format(newDate, 'MM/dd/yyyy') : '';
    setFormData(prev => ({ ...prev, student_date_of_birth: formattedDate }));
  };

  useEffect(() => {
    if (formData.student_willow_relationship === 'No') {
      setFormData((prevState) => ({
        ...prevState,
        student_relationship_type: "",
        student_employee_name: "",
        student_employee_designation: "",
        student_employee_branch: "",
        student_employee_number: "",
      }));
    }
  }, [formData.student_willow_relationship]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    // Sanitize number inputs to allow only digits and limit to 10
    if (["student_whatsapp_number", "student_alternative_number", "student_emergency_contact_number"].includes(name)) {
      sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prevState) => ({ ...prevState, [name]: sanitizedValue }));

    // Validate email on change
    if (name === "student_email_address") {
      setEmailError(value && !validateEmail(value) ? "Please enter a valid email address" : "");
    }

    // Validate number fields on change
    if (name === "student_whatsapp_number") {
      setWhatsappError(sanitizedValue && !validateNumber(sanitizedValue) ? "WhatsApp number must be exactly 10 digits" : "");
    }
    if (name === "student_alternative_number") {
      setAlternativeError(sanitizedValue && !validateNumber(sanitizedValue) ? "Alternative number must be exactly 10 digits" : "");
    }
    if (name === "student_emergency_contact_number") {
      setEmergencyError(sanitizedValue && !validateNumber(sanitizedValue) ? "Emergency contact number must be exactly 10 digits" : "");
    }
  };

  const handleSave = async () => {
    // Prevent save if any field is invalid
    if (formData.student_email_address && !validateEmail(formData.student_email_address)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (formData.student_whatsapp_number && !validateNumber(formData.student_whatsapp_number)) {
      setWhatsappError("WhatsApp number must be exactly 10 digits");
      return;
    }
    if (formData.student_alternative_number && !validateNumber(formData.student_alternative_number)) {
      setAlternativeError("Alternative number must be exactly 10 digits");
      return;
    }
    if (formData.student_emergency_contact_number && !validateNumber(formData.student_emergency_contact_number)) {
      setEmergencyError("Emergency contact number must be exactly 10 digits");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));  // Get user data from localStorage
    const userId = user?.user_id; // Get the user_id from the logged-in user

    const url = studentId
      ? `https://willowtonbursary.co.za/api/student-details/update/${studentId}`  // URL for updating the student
      : `https://willowtonbursary.co.za/api/student-details/insert`;  // URL for inserting a new student

    const method = studentId ? "PUT" : "POST";  // Use PUT for update and POST for insert

    // If creating a new student, add user_id to the formData
    const dataToSend = studentId ? formData : { ...formData, user_id: userId };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),  // Send the appropriate data for insert or update
      });

      if (response.ok) {
        const savedStudent = await response.json();
        onSave(savedStudent);  // Callback to parent to handle after saving
        onClose();  // Close the drawer after saving
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
        onDelete(studentId);
        onClose();
        setDeleteConfirmationOpen(false);
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
      <Box sx={{ width: drawerWidth, height: "100%", display: "flex", flexDirection: "column", backgroundColor: isDarkMode ? '#2D3748' : '#fff' }}>
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
              if (key === "student_date_of_birth") {
                return (
                  <Grid item xs={12} key={index}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        wrapperClassName={"datepicker"}
                        className={"datepicker"}
                        label="Student Date of Birth"
                        name="student_date_of_birth"
                        value={selectedDate}
                        onChange={handleDateChange}
                        format="MM/dd/yyyy"
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
                    </LocalizationProvider>
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

              if (key === "student_id_passport_number") {
                return (
                  <Grid item xs={12} key={index}>
                    <TextField
                      label="Student ID/Passport Number"
                      name="student_id_passport_number"
                      type="text"
                      fullWidth
                      value={formData.student_id_passport_number || ""}
                      onChange={handleChange}
                      sx={{
                        backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                        color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        borderRadius: '8px',
                        '& .MuiInputBase-input': {
                          color: isDarkMode ? '#F7FAFC' : '#1E293B',
                        }
                      }}
                      InputLabelProps={{ style: { color: isDarkMode ? '#F7FAFC' : '#1E293B' } }}
                    />
                  </Grid>
                );
              }

              if (key === "student_email_address") {
                return (
                  <Grid item xs={12} key={index}>
                    <TextField
                      label="Student Email Address"
                      name="student_email_address"
                      type="email"
                      fullWidth
                      value={formData.student_email_address || ""}
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

              if (key === "student_whatsapp_number") {
                return (
                  <Grid item xs={12} key={index}>
                    <TextField
                      label="Student WhatsApp Number"
                      name="student_whatsapp_number"
                      type="tel"
                      fullWidth
                      value={formData.student_whatsapp_number || ""}
                      onChange={handleChange}
                      error={!!whatsappError}
                      helperText={whatsappError}
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

              if (key === "student_alternative_number") {
                return (
                  <Grid item xs={12} key={index}>
                    <TextField
                      label="Student Alternative Number"
                      name="student_alternative_number"
                      type="tel"
                      fullWidth
                      value={formData.student_alternative_number || ""}
                      onChange={handleChange}
                      error={!!alternativeError}
                      helperText={alternativeError}
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

              if (key === "student_emergency_contact_number") {
                return (
                  <Grid item xs={12} key={index}>
                    <TextField
                      label="Student Emergency Contact Number"
                      name="student_emergency_contact_number"
                      type="tel"
                      fullWidth
                      value={formData.student_emergency_contact_number || ""}
                      onChange={handleChange}
                      error={!!emergencyError}
                      helperText={emergencyError}
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

              if (['student_relationship_type', 'student_employee_name', 'student_employee_designation', 'student_employee_branch', 'student_employee_number'].includes(key)) {
                // Only render these fields if `student_willow_relationship` is 'Yes'
                if (formData.student_willow_relationship === "Yes") {
                  return (
                    <Grid item xs={12} key={index}>
                      <TextField
                        label={key.replace(/_/g, " ").toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
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
                } else {
                  return null;
                }
              }

              if (
                key === "student_date_stamp" || key === "id" || key === "user_id"
              ) return null;

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

              if (key === "student_willow_relationship") {
                return (
                  <Grid item xs={12} key={index}>
                    <Autocomplete
                      value={formData[key] || ""}
                      onChange={(e, newValue) => handleChange({ target: { name: key, value: newValue } })}
                      options={yes_no}
                      renderInput={(params) => <TextField {...params} label="Does the student have any relationship to the Willowton Group?" sx={{
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
                borderColor: isDarkMode ? '#F7FAFC' : '#1E293B',
                color: isDarkMode ? '#F7FAFC' : '#1E293B',
              }}
              startIcon={<CloseIcon />}
            >
              Close
            </Button>

            {studentId && (
              <Button
                onClick={handleDeleteClick}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: isDarkMode ? '#F7FAFC' : '#1E293B',
                  color: 'red',
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
            <Button onClick={!deleteConfirmationOpen} color="primary">
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