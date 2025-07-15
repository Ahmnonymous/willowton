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
import { ThemeContext } from '../../config/ThemeContext';
import { semesters, highestEducation } from "../../components/lov";

const UniversityDetailsDrawer = ({
  open,
  onClose,
  studentId,
  universityDetailsId,
  onSave,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const isLargeScreen = useMediaQuery("(min-width:600px)");
  const drawerWidth = isLargeScreen ? 500 : 330;

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState({});
  // const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (open) {
      if (universityDetailsId) {
        fetch(`https://willowtonbursary.co.za/api/university-details/id/${universityDetailsId}`)
          .then((res) => res.json())
          .then((data) => {
            // Normalize the conditional fields to match yes_no options
            const normalizedData = {
              ...data,
              // Previously_Funded: yes_no.includes(data.Previously_Funded) ? data.Previously_Funded : "",
              // Tuition: yes_no.includes(data.Tuition) ? data.Tuition : "",
              // Accommodation: yes_no.includes(data.Accommodation) ? data.Accommodation : "",
              // Textbooks: yes_no.includes(data.Textbooks) ? data.Textbooks : "",
              // Travel: yes_no.includes(data.Travel) ? data.Travel : "",
            };
            setFormData(normalizedData);
          });
      } else {
        const initialData = {
          student_details_portal_id: studentId,
          Institution_Name: "",
          Name_of_Course: "",
          Intake_Year: "",
          Semester: "",
          NQF_Level: "",
          Current_Year: "",
          Student_Number: "",
          previously_funded: "",
          previously_funded_amount: "",
          tuition: "",
          tuition_amount: "",
          accommodation: "",
          accommodation_fee: "",
          textbooks: "",
          textbooks_fee: "",
          travel: "",
          travel_fee: "",
          Total_University_Expense: "",
          Other_Bursary_Org_1: "",
          Other_Bursary_Org_1_Contact: "",
          Other_Bursary_Org_2: "",
          Other_Bursary_Org_2_Contact: "",
          Other_Bursary_Org_3: "",
          Other_Bursary_Org_3_Contact: "",
          Previous_Bursary_Org_1: "",
          Previous_Bursary_Org_1_Amount: "",
          Previous_Bursary_Org_1_Contact: "",
          Previous_Bursary_Org_2: "",
          Previous_Bursary_Org_2_Amount: "",
          Previous_Bursary_Org_2_Contact: "",
          Previous_Bursary_Org_3: "",
          Previous_Bursary_Org_3_Amount: "",
          Previous_Bursary_Org_3_Contact: "",
          Application_Process_Status: "",
        };
        setFormData(initialData);
      }
    } else {
      setFormData({});
    }
  }, [open, studentId, universityDetailsId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutocompleteChange = (name, value) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      // Clear the corresponding amount field if the selection is "No"
      const conditionalField = conditionalFields.find(field => field.select === name);
      if (conditionalField && value === "No") {
        newFormData[conditionalField.amount] = "";
      }
      return newFormData;
    });
  };

  const handleSave = async () => {
    const isUpdate = !!formData.id;
    const url = isUpdate
      ? `https://willowtonbursary.co.za/api/university-details/update/${formData.id}`
      : `https://willowtonbursary.co.za/api/university-details/insert`;
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
      // setsuccessmessage(isUpdate ? "Updated successfully!" : "Created successfully!");
      onClose();
    } else {
      console.error("Failed to save University Details");
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!formData.id) return;

    try {
      const res = await fetch(
        `https://willowtonbursary.co.za/api/university-details/delete/${formData.id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        onSave(null);
        // setsuccessmessage("Deleted successfully!");
        onClose();
        setDeleteConfirmationOpen(false);
      } else {
        console.error("Failed to delete University Details");
      }
    } catch (err) {
      console.error("Error deleting University Details", err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
  };

  const yesNoOptions = ["Yes", "No"];

  const conditionalFields = [
    { select: "previously_funded", amount: "previously_funded_amount" },
    { select: "tuition", amount: "tuition_amount" },
    { select: "accommodation", amount: "accommodation_fee" },
    { select: "textbooks", amount: "textbooks_fee" },
    { select: "travel", amount: "travel_fee" },
  ];

  const fieldStyles = {
    backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
    color: isDarkMode ? '#F7FAFC' : '#1E293B',
    borderRadius: '8px',
    '& .MuiInputBase-input': {
      color: isDarkMode ? '#F7FAFC' : '#1E293B',
    },
    '& .MuiFormLabel-root': {
      color: isDarkMode ? '#F7FAFC' : '#1E293B',
    },
  };

  const inputLabelProps = { style: { color: isDarkMode ? '#F7FAFC' : '#1E293B' } };

  const renderField = (key, index) => {
    if (
      key === "id" ||
      key === "student_details_portal_id" ||
      key === "university_details_date_stamp"
    ) {
      return null;
    }

    let label = key.replace(/_/g, " ");
    label = label
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const isConditionalSelect = conditionalFields.some(field => field.select === key);
    const isConditionalAmount = conditionalFields.some(field => field.amount === key);

    if (isConditionalSelect) {
      return (
        <Grid item xs={12} key={index}>
          <Autocomplete
            value={formData[key] || ""}
            onChange={(e, newValue) => handleAutocompleteChange(key, newValue)}
            options={yesNoOptions}
            renderInput={(params) => (
              <TextField {...params} label={label} sx={fieldStyles} InputLabelProps={inputLabelProps} />
            )}
          />
        </Grid>
      );
    }

    if (isConditionalAmount) {
      const relatedSelect = conditionalFields.find(field => field.amount === key).select;
      if (formData[relatedSelect] !== "Yes") return null;
    }

    if (key === "Semester" || key === "semester") {
      return (
        <Grid item xs={12} key={index}>
          <Autocomplete
            value={formData[key] || ""}
            onChange={(e, newValue) => handleAutocompleteChange(key, newValue)}
            options={semesters}
            renderInput={(params) => (
              <TextField {...params} label={label} sx={fieldStyles} InputLabelProps={inputLabelProps} />
            )}
          />
        </Grid>
      );
    }

    if (key === "NQF_Level" || key === "nqf_level") {
      return (
        <Grid item xs={12} key={index}>
          <Autocomplete
            value={formData[key] || ""}
            onChange={(e, newValue) => handleAutocompleteChange(key, newValue)}
            options={highestEducation}
            renderInput={(params) => (
              <TextField {...params} label={label} sx={fieldStyles} InputLabelProps={inputLabelProps} />
            )}
          />
        </Grid>
      );
    }

    return (
      <Grid item xs={12} key={index}>
        <TextField
          name={key}
          label={label}
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
      <Box sx={{
        width: drawerWidth,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: isDarkMode ? '#2D3748' : '#fff'
      }}>
        <Box sx={{
          p: 2,
          borderBottom: "1px solid #ccc",
          backgroundColor: isDarkMode ? '#1E293B' : '#e1f5fe'
        }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDarkMode ? '#F7FAFC' : '#1E293B' }}>
            University Details
          </Typography>
          {/* {successMessage && (
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              {successMessage}
            </Typography>
          )} */}
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          <Grid container spacing={2}>
            {Object.keys(formData).map((key, index) => renderField(key, index))}
          </Grid>
        </Box>

        <Divider />
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
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
                onClick={handleDeleteClick}
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

        <Dialog open={deleteConfirmationOpen} onClose={handleDeleteCancel}>
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

export default UniversityDetailsDrawer;