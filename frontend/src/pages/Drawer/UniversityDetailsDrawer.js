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

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
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

  useEffect(() => {
    if (open) {
      if (universityDetailsId) {
        fetch(`${API_BASE_URL}/university-details/id/${universityDetailsId}`)
          .then((res) => res.json())
          .then((data) => {
            const normalizedData = {
              ...data,
              // Normalize previous_bursary_org_X fields to "Yes" or "No"
              // previous_bursary_org_1: data.previous_bursary_org_1 ? "Yes" : "No",
              // previous_bursary_org_2: data.previous_bursary_org_2 ? "Yes" : "No",
              // previous_bursary_org_3: data.previous_bursary_org_3 ? "Yes" : "No",
              // previously_funded: data.previously_funded ? "Yes" : "No",
              // tuition: data.tuition ? "Yes" : "No",
              // accommodation: data.accommodation ? "Yes" : "No",
              // textbooks: data.textbooks ? "Yes" : "No",
              // travel: data.travel ? "Yes" : "No",
            };
            setFormData(normalizedData);
          });
      } else {
        const initialData = {
          student_details_portal_id: studentId,
          Institution_name: "",
          name_of_Course: "",
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
          total_university_expense: "",
          previous_bursary_org_1: "",
          previous_bursary_org_1_name: "",
          previous_bursary_org_1_amount: "",
          previous_bursary_org_1_contact: "",
          previous_bursary_org_2: "",
          previous_bursary_org_2_name: "",
          previous_bursary_org_2_amount: "",
          previous_bursary_org_2_contact: "",
          previous_bursary_org_3: "",
          previous_bursary_org_3_name: "",
          previous_bursary_org_3_amount: "",
          previous_bursary_org_3_contact: "",
          Application_Process_Status: "",
        };
        setFormData(initialData);
      }
    } else {
      setFormData({});
    }
  }, [open, studentId, universityDetailsId]);

  // Calculate total university expense whenever relevant fields change
  useEffect(() => {
  const amountFields = [
    'tuition_amount',
    'accommodation_fee',
    'textbooks_fee',
    'travel_fee'
  ];

  const total = amountFields.reduce((sum, field) => {
    const value = parseFloat(formData[field]) || 0;
    return sum + value;
  }, 0);

  if (formData.total_university_expense !== total) {
    setFormData((prev) => ({
      ...prev,
      total_university_expense: total
    }));
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  formData.tuition_amount,
  formData.accommodation_fee,
  formData.textbooks_fee,
  formData.travel_fee
]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutocompleteChange = (name, value) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      const conditionalField = conditionalFields.find(field => field.select === name);
      if (conditionalField && value === "No") {
        newFormData[conditionalField.amount] = "";
      }

      // Handle Previous Bursary Org fields
      const bursaryFields = bursaryConditionalFields.find(field => field.select === name);
      if (bursaryFields && value !== "Yes") {
        newFormData[bursaryFields.name] = "";
        newFormData[bursaryFields.amount] = "";
        newFormData[bursaryFields.contact] = "";
      }

      return newFormData;
    });
  };

  const handleSave = async () => {
    const isUpdate = !!formData.id;
    const url = isUpdate
      ? `${API_BASE_URL}/university-details/update/${formData.id}`
      : `${API_BASE_URL}/university-details/insert`;
    const method = isUpdate ? "PUT" : "POST";

    const body = {
      ...formData,
      // Convert Yes/No to boolean for API
      // previous_bursary_org_1: formData.previous_bursary_org_1 === "Yes",
      // previous_bursary_org_2: formData.previous_bursary_org_2 === "Yes",
      // previous_bursary_org_3: formData.previous_bursary_org_3 === "Yes",
      // previously_funded: formData.previously_funded === "Yes",
      // tuition: formData.tuition === "Yes",
      // accommodation: formData.accommodation === "Yes",
      // textbooks: formData.textbooks === "Yes",
      // travel: formData.travel === "Yes",
    };
    if (!isUpdate) delete body.id;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const result = await res.json();
      onSave(result);
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
        `${API_BASE_URL}/university-details/delete/${formData.id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        onSave(null);
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

  const bursaryConditionalFields = [
    {
      select: "previous_bursary_org_1",
      name: "previous_bursary_org_1_name",
      amount: "previous_bursary_org_1_amount",
      contact: "previous_bursary_org_1_contact"
    },
    {
      select: "previous_bursary_org_2",
      name: "previous_bursary_org_2_name",
      amount: "previous_bursary_org_2_amount",
      contact: "previous_bursary_org_2_contact"
    },
    {
      select: "previous_bursary_org_3",
      name: "previous_bursary_org_3_name",
      amount: "previous_bursary_org_3_amount",
      contact: "previous_bursary_org_3_contact"
    }
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
    const isConditionalamount = conditionalFields.some(field => field.amount === key);
    const isBursarySelect = bursaryConditionalFields.some(field => field.select === key);
    const isBursaryField = bursaryConditionalFields.some(field =>
      field.name === key || field.amount === key || field.contact === key
    );

    if (isConditionalSelect) {
      let customLabel = label;
      if (key === "tuition") {
        customLabel = "Are you in need of financial assistance to cover your tuition fees?";
      } else if (key === "accommodation") {
        customLabel = "Are you in need of financial assistance to cover your accommodation fees?";
      } else if (key === "textbooks") {
        customLabel = "Are you in need of financial assistance to cover your textbooks fees?";
      } else if (key === "travel") {
        customLabel = "Are you in need of financial assistance to cover your travel fees?";
      } else if (key === "previously_funded") {
        customLabel = "Were you previously Funded by the Willowton SANZAF Bursary Fund?";
      }

      return (
        <Grid item xs={12} key={index}>
          <Autocomplete
            value={formData[key] || ""}
            onChange={(e, newValue) => handleAutocompleteChange(key, newValue)}
            options={yesNoOptions}
            renderInput={(params) => (
              <TextField {...params} label={customLabel} sx={fieldStyles} InputLabelProps={inputLabelProps} />
            )}
          />
        </Grid>
      );
    }

    if (isBursarySelect) {
      return (
        <Grid item xs={12} key={index}>
          <Autocomplete
            value={formData[key] || ""}
            onChange={(e, newValue) => handleAutocompleteChange(key, newValue)}
            options={yesNoOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Were you funded by an organization previously?"
                sx={fieldStyles}
                InputLabelProps={inputLabelProps}
              />
            )}
          />
        </Grid>
      );
    }

    if (isBursaryField) {
      const relatedBursary = bursaryConditionalFields.find(field =>
        field.name === key || field.amount === key || field.contact === key
      );
      if (formData[relatedBursary.select] !== "Yes") return null;
    }

    if (isConditionalamount) {
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

    if (key === "total_university_expense") {
      return (
        <Grid item xs={12} key={index}>
          <TextField
            name={key}
            label={label}
            fullWidth
            value={formData[key] || ""}
            sx={fieldStyles}
            InputLabelProps={inputLabelProps}
            InputProps={{ readOnly: true }}
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