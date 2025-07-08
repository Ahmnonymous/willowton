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
} from "../../components/lov";
import { ThemeContext } from '../../config/ThemeContext';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parse } from 'date-fns';

const StudentDetailDrawer = ({ open, onClose, studentId, onSave, onDelete }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [whatsappError, setWhatsappError] = useState("");
  const [alternativeError, setAlternativeError] = useState("");
  const [emergencyError, setEmergencyError] = useState("");
  const [emergencyContactOption, setEmergencyContactOption] = useState("");
  const isLargeScreen = useMediaQuery("(min-width:600px)");
  const drawerWidth = isLargeScreen ? 500 : 330;
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userType = user?.user_type; // student or admin
  const isAdmin = userType === "admin";

  const relationshipTypes = [
    "Staff",
    "Dependent of Staff",
    "Family",
    "Referral",
    "Director/Board Member or stakeholder"
  ];

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
    student_company_of_employment: "",
    student_current_salary: "",
    student_number_of_siblings: "",
    student_siblings_bursary: "",
    student_willow_relationship: "",
    relation_type: "",
    relation_hr_contact: "",
    relation_branch: "",
    relation_name: "",
    relation_surname: "",
    relation_employee_code: "",
    relation_reference: "",
    student_emergency_contact_name: "",
    student_emergency_contact_number: "",
    student_emergency_contact_relationship: "",
    student_emergency_contact_address: "",
    student_date_stamp: "",
    student_status: "Pending",
    student_status_comment: "",
  });

  const statusOptions = ["Received", "Pending", "Approved", "Declined"];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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
              student_status: data.student_status || "Pending",
              student_status_comment: data.student_status_comment || "",
              relation_type: data.relation_type || "",
              relation_hr_contact: data.relation_hr_contact || "",
              relation_branch: data.relation_branch || "",
              relation_name: data.relation_name || "",
              relation_surname: data.relation_surname || "",
              relation_employee_code: data.relation_employee_code || "",
              relation_reference: data.relation_reference || "",
            }));
            setEmergencyContactOption(data.student_emergency_contact_name ? "Add new" : "");
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
          student_company_of_employment: '',
          student_current_salary: '',
          student_number_of_siblings: '',
          student_siblings_bursary: '',
          student_willow_relationship: '',
          relation_type: '',
          relation_hr_contact: '',
          relation_branch: '',
          relation_name: '',
          relation_surname: '',
          relation_employee_code: '',
          relation_reference: '',
          student_emergency_contact_name: '',
          student_emergency_contact_number: '',
          student_emergency_contact_relationship: '',
          student_emergency_contact_address: '',
          student_date_stamp: '',
          student_status: 'Pending',
          student_status_comment: '',
        });
        setEmergencyContactOption("");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    if (["student_whatsapp_number", "student_alternative_number", "student_emergency_contact_number"].includes(name)) {
      sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prevState) => ({ ...prevState, [name]: sanitizedValue }));

    if (name === "student_email_address") {
      setEmailError(value && !validateEmail(value) ? "Please enter a valid email address" : "");
    }

    if (name === "student_whatsapp_number") {
      setWhatsappError(sanitizedValue && !validateNumber(sanitizedValue) ? "WhatsApp number must be exactly 10 digits" : "");
    }
    if (name === "student_alternative_number") {
      setAlternativeError(sanitizedValue && !validateNumber(sanitizedValue) ? "Alternative number must be exactly 10 digits" : "");
    }
    if (name === "student_emergency_contact_number") {
      setEmergencyError(sanitizedValue && !validateNumber(sanitizedValue) ? "Emergency contact number must be exactly 10 digits" : "");
    }

    if (name === "student_willow_relationship") {
      if (value === "No") {
        setFormData((prevState) => ({
          ...prevState,
          relation_type: "",
          relation_hr_contact: "",
          relation_branch: "",
          relation_name: "",
          relation_surname: "",
          relation_employee_code: "",
          relation_reference: "",
        }));
      }
    }
    // if (name === "relation_type" && formData.student_willow_relationship === "Yes") {
    //   // setFormData((prevState) => ({
    //   //   ...prevState,
    //   //   relation_hr_contact: "",
    //   //   relation_branch: "",
    //   //   relation_name: "",
    //   //   relation_surname: "",
    //   //   relation_employee_code: "",
    //   //   relation_reference: "",
    //   // }));
    //   null;
    // }
  };

  const handleEmergencyContactChange = (e, newValue) => {
    setEmergencyContactOption(newValue);
    if (newValue === "Same as above") {
      setFormData((prevState) => ({
        ...prevState,
        student_emergency_contact_name: formData.student_name,
        student_emergency_contact_number: formData.student_whatsapp_number,
        student_emergency_contact_relationship: "Self",
        student_emergency_contact_address: formData.student_home_address,
      }));
      setEmergencyError(formData.student_whatsapp_number && !validateNumber(formData.student_whatsapp_number) ? "Emergency contact number must be exactly 10 digits" : "");
    } else {
      setFormData((prevState) => ({
        ...prevState,
        student_emergency_contact_name: "",
        student_emergency_contact_number: "",
        student_emergency_contact_relationship: "",
        student_emergency_contact_address: "",
      }));
      setEmergencyError("");
    }
  };

  const handleSave = async () => {
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

    const userId = user?.user_id;

    const url = studentId
      ? `https://willowtonbursary.co.za/api/student-details/update/${studentId}`
      : `https://willowtonbursary.co.za/api/student-details/insert`;

    const method = studentId ? "PUT" : "POST";
    const dataToSend = studentId ? formData : { ...formData, user_id: userId };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
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
    setDeleteConfirmationOpen(true);
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
    setDeleteConfirmationOpen(false);
  };

  const filteredFinanceType = formData.student_religion === "Islam" 
    ? financeType 
    : financeType.filter(type => type !== "Zakah");

  const renderField = (key, index) => {
    const fieldStyles = {
      backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
      color: isDarkMode ? '#F7FAFC' : '#1E293B',
      borderRadius: '8px',
      '& .MuiInputBase-input': {
        color: isDarkMode ? '#F7FAFC' : '#1E293B',
      },
    };
    const inputLabelProps = { style: { color: isDarkMode ? '#ffffff' : '#000000' } };

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
              sx={fieldStyles}
              InputLabelProps={inputLabelProps}
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
            sx={fieldStyles}
            InputLabelProps={inputLabelProps}
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
            sx={fieldStyles}
            InputLabelProps={inputLabelProps}
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
            sx={fieldStyles}
            InputLabelProps={inputLabelProps}
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
            inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
            sx={fieldStyles}
            InputLabelProps={inputLabelProps}
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
            inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
            sx={fieldStyles}
            InputLabelProps={inputLabelProps}
          />
        </Grid>
      );
    }

    if (key === "student_emergency_contact_name") {
      return (
        <Grid item xs={12} key={index}>
          <Autocomplete
            value={emergencyContactOption}
            onChange={handleEmergencyContactChange}
            options={["Same as above", "Add new"]}
            renderInput={(params) => (
              <TextField {...params} label="Emergency Contact" sx={fieldStyles} InputLabelProps={inputLabelProps} />
            )}
          />
          {emergencyContactOption === "Add new" && (
            <TextField
              label="Student Emergency Contact Name"
              name="student_emergency_contact_name"
              fullWidth
              value={formData.student_emergency_contact_name || ""}
              onChange={handleChange}
              sx={{ ...fieldStyles, marginTop: 2 }}
              InputLabelProps={inputLabelProps}
            />
          )}
        </Grid>
      );
    }

    if (key === "student_emergency_contact_number" && emergencyContactOption === "Add new") {
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
            inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
            sx={fieldStyles}
            InputLabelProps={inputLabelProps}
          />
        </Grid>
      );
    }

    if (key === "student_emergency_contact_relationship" && emergencyContactOption === "Add new") {
      return (
        <Grid item xs={12} key={index}>
          <TextField
            label="Student Emergency Contact Relationship"
            name="student_emergency_contact_relationship"
            fullWidth
            value={formData.student_emergency_contact_relationship || ""}
            onChange={handleChange}
            sx={fieldStyles}
            InputLabelProps={inputLabelProps}
          />
        </Grid>
      );
    }

    if (key === "student_emergency_contact_address" && emergencyContactOption === "Add new") {
      return (
        <Grid item xs={12} key={index}>
          <TextField
            label="Student Emergency Contact Address"
            name="student_emergency_contact_address"
            fullWidth
            value={formData.student_emergency_contact_address || ""}
            onChange={handleChange}
            sx={fieldStyles}
            InputLabelProps={inputLabelProps}
          />
        </Grid>
      );
    }

    if (key === "student_status") {
      return (
        <Grid item xs={12} key={index}>
          <Autocomplete
            value={formData[key] || "Pending"}
            onChange={(e, newValue) => handleChange({ target: { name: key, value: newValue } })}
            options={statusOptions}
            renderInput={(params) => (
              <TextField {...params} label="Student Status" sx={fieldStyles} InputLabelProps={inputLabelProps} />
            )}
            disabled={!isAdmin}
          />
        </Grid>
      );
    }

    if (key === "student_status_comment") {
      return (
        <Grid item xs={12} key={index}>
          <TextField
            label="Status Comment"
            name="student_status_comment"
            fullWidth
            multiline
            rows={4}
            value={formData.student_status_comment || ""}
            onChange={handleChange}
            sx={fieldStyles}
            InputLabelProps={inputLabelProps}
            disabled={!isAdmin}
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
            renderInput={(params) => (
              <TextField
                {...params}
                label="Does the student have any relationship to the Willowton Group?"
                sx={fieldStyles}
                InputLabelProps={inputLabelProps}
              />
            )}
          />
        </Grid>
      );
    }

    // Hide relation fields unless student_willow_relationship is "Yes"
    if (formData.student_willow_relationship !== "Yes") {
      if ([
        "relation_type",
        "relation_hr_contact",
        "relation_branch",
        "relation_name",
        "relation_surname",
        "relation_employee_code",
        "relation_reference"
      ].includes(key)) {
        return null;
      }
    }

    if (key === "relation_type" && formData.student_willow_relationship === "Yes") {
      return (
        <Grid item xs={12} key={index}>
          <Autocomplete
            value={formData[key] || ""}
            onChange={(e, newValue) => handleChange({ target: { name: key, value: newValue } })}
            options={relationshipTypes}
            renderInput={(params) => (
              <TextField {...params} label="Relationship Type" sx={fieldStyles} InputLabelProps={inputLabelProps} />
            )}
          />
        </Grid>
      );
    }

    // Show fields based on relation_type
    if (formData.student_willow_relationship === "Yes") {
      if (formData.relation_type === "Staff" || formData.relation_type === "Dependent of Staff") {
        if (["relation_hr_contact", "relation_branch", "relation_name", "relation_surname", "relation_employee_code"].includes(key)) {
          const labels = {
            relation_hr_contact: "HR Contact",
            relation_branch: "Branch",
            relation_name: "Name",
            relation_surname: "Surname",
            relation_employee_code: "Employee Code",
          };
          return (
            <Grid item xs={12} key={index}>
              <TextField
                label={labels[key]}
                name={key}
                fullWidth
                value={formData[key] || ""}
                onChange={handleChange}
                sx={fieldStyles}
                InputLabelProps={inputLabelProps}
              />
            </Grid>
          );
        }
      }

      if (formData.relation_type === "Family") {
        if (key === "relation_name") {
          return (
            <Grid item xs={12} key={index}>
              <TextField
                label="Who are you related to"
                name={key}
                fullWidth
                value={formData[key] || ""}
                onChange={handleChange}
                sx={fieldStyles}
                InputLabelProps={inputLabelProps}
              />
            </Grid>
          );
        }
        if (key === "relation_reference") {
          return (
            <Grid item xs={12} key={index}>
              <TextField
                label="How are you related"
                name={key}
                fullWidth
                value={formData[key] || ""}
                onChange={handleChange}
                sx={fieldStyles}
                InputLabelProps={inputLabelProps}
              />
            </Grid>
          );
        }
      }

      if (formData.relation_type === "Director/Board Member or stakeholder") {
        if (key === "relation_name") {
          return (
            <Grid item xs={12} key={index}>
              <TextField
                label="Please provide the person's name"
                name={key}
                fullWidth
                value={formData[key] || ""}
                onChange={handleChange}
                sx={fieldStyles}
                InputLabelProps={inputLabelProps}
              />
            </Grid>
          );
        }
      }

      if (formData.relation_type === "Referral") {
        if (key === "relation_reference") {
          return (
            <Grid item xs={12} key={index}>
              <TextField
                label="Reference Relation"
                name={key}
                fullWidth
                value={formData[key] || ""}
                onChange={handleChange}
                sx={fieldStyles}
                InputLabelProps={inputLabelProps}
              />
            </Grid>
          );
        }
        if (key === "relation_name") {
          return (
            <Grid item xs={12} key={index}>
              <TextField
                label="Name"
                name={key}
                fullWidth
                value={formData[key] || ""}
                onChange={handleChange}
                sx={fieldStyles}
                InputLabelProps={inputLabelProps}
              />
            </Grid>
          );
        }
      }
    }

    if (key === "student_nationality") {
      return (
        <Grid item xs={12} key={index}>
          <Autocomplete
            value={formData[key] || ""}
            onChange={(e, newValue) => handleChange({ target: { name: key, value: newValue } })}
            options={nationality}
            renderInput={(params) => (
              <TextField {...params} label={key.replace(/_/g, " ").toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} sx={fieldStyles} />
            )}
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
            renderInput={(params) => (
              <TextField {...params} label={key.replace(/_/g, " ").toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} sx={fieldStyles} InputLabelProps={inputLabelProps} />
            )}
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
            renderInput={(params) => (
              <TextField {...params} label={key.replace(/_/g, " ").toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} sx={fieldStyles} InputLabelProps={inputLabelProps} />
            )}
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
            renderInput={(params) => (
              <TextField {...params} label={key.replace(/_/g, " ").toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} sx={fieldStyles} InputLabelProps={inputLabelProps} />
            )}
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
            options={filteredFinanceType}
            renderInput={(params) => (
              <TextField {...params} label={key.replace(/_/g, " ").toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} sx={fieldStyles} InputLabelProps={inputLabelProps} />
            )}
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
            renderInput={(params) => (
              <TextField {...params} label={key.replace(/_/g, " ").toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} sx={fieldStyles} InputLabelProps={inputLabelProps} />
            )}
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
            renderInput={(params) => (
              <TextField {...params} label={key.replace(/_/g, " ").toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} sx={fieldStyles} InputLabelProps={inputLabelProps} />
            )}
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
            renderInput={(params) => (
              <TextField {...params} label={key.replace(/_/g, " ").toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} sx={fieldStyles} InputLabelProps={inputLabelProps} />
            )}
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
            renderInput={(params) => (
              <TextField {...params} label={key.replace(/_/g, " ").toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} sx={fieldStyles} InputLabelProps={inputLabelProps} />
            )}
          />
        </Grid>
      );
    }

    let label = key.replace(/_/g, " ").toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    return (
      <Grid item xs={12} key={index}>
        <TextField
          label={label}
          name={key}
          fullWidth
          value={formData[key] || ""}
          onChange={handleChange}
          sx={fieldStyles}
          InputLabelProps={inputLabelProps}
        />
      </Grid>
    );
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: drawerWidth, height: "100%", display: "flex", flexDirection: "column", backgroundColor: isDarkMode ? '#2D3748' : '#fff' }}>
        <Box sx={{ padding: 2, borderBottom: "1px solid #ccc", backgroundColor: isDarkMode ? '#1E293B' : '#e1f5fe' }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDarkMode ? '#F7FAFC' : '#1E293B' }}>
            Student Details
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
          <Grid container spacing={2}>
            {Object.keys(formData).map((key, index) => renderField(key, index))}
          </Grid>
        </Box>

        <Divider />
        <Box sx={{ padding: 2, borderTop: "1px solid #ccc", display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              size="small"
              sx={{ borderColor: isDarkMode ? '#F7FAFC' : '#1E293B', color: isDarkMode ? '#F7FAFC' : '#1E293B' }}
              startIcon={<CloseIcon />}
            >
              Close
            </Button>

            {studentId && (
              <Button
                onClick={handleDeleteClick}
                variant="outlined"
                size="small"
                sx={{ borderColor: '#F7FAFC', color: 'red' }}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            )}
          </Box>

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

        <Dialog
          open={deleteConfirmationOpen}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this student record?
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