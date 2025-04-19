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
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { ThemeContext } from '../../config/ThemeContext';  // Import ThemeContext
import { semesters, highestEducation } from "../../components/lov"; // Import LOVs

const UniversityDetailsDrawer = ({
  open,
  onClose,
  studentId,
  universityDetailsId,
  onSave,
}) => {
  const { isDarkMode } = useContext(ThemeContext);  // Access theme context

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (open) {
      if (universityDetailsId) {
        // Editing mode
        fetch(`https://willowtonbursary.co.za/api/university-details/id/${universityDetailsId}`)
          .then((res) => res.json())
          .then((data) => {
            setFormData(data);
          });
      } else {
        // Creating new entry
        const initialData = {
          student_details_portal_id: studentId,
          Institution_Name: "",
          Name_of_Course: "",
          Intake_Year: "",
          Semester: "",
          NQF_Level: "",
          Current_Year: "",
          Student_Number: "",
          Previously_Funded: "",
          Previously_Funded_Amount: "",
          Tuition: "",
          Tuition_Amount: "",
          Accommodation: "",
          Accommodation_Fee: "",
          Textbooks: "",
          Textbooks_Fee: "",
          Travel: "",
          Travel_Fee: "",
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
      setSuccessMessage(isUpdate ? "Updated successfully!" : "Created successfully!");
      onClose();
    } else {
      console.error("Failed to save University Details");
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirmationOpen(true); // Open the dialog
  };

  // Handle the confirmation delete
  const handleDeleteConfirm = async () => {
    if (!formData.id) return;

    try {
      const res = await fetch(
        `https://willowtonbursary.co.za/api/university-details/delete/${formData.id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        onSave(null);
        setSuccessMessage("Deleted successfully!");
        onClose();
        setDeleteConfirmationOpen(false); // Close the confirmation dialog
      } else {
        console.error("Failed to delete University Details");
      }
    } catch (err) {
      console.error("Error deleting University Details", err);
    }
  };

  // Handle cancel delete
  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false); // Close the confirmation dialog
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{
        width: 400,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: isDarkMode ? '#2D3748' : '#fff' // Background color based on dark/light mode
      }}>
        {/* Header */}
        <Box sx={{
          p: 2,
          borderBottom: "1px solid #ccc",
          backgroundColor: isDarkMode ? '#1E293B' : '#e1f5fe'
        }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDarkMode ? '#F7FAFC' : '#1E293B' }}>
            University Details
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
              if (
                key === "id" ||
                key === "student_details_portal_id" ||
                key === "University_Details_Date_Stamp" // Exclude date_stamp field
              )
                return null;

              let label = key.replace(/_/g, " ");  // Replace underscores with spaces
              label = label
                .split(" ")  // Split by space
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize each word
                .join(" ");  // Rejoin into a string

              // Handling LOV fields with Autocomplete (e.g., Semester, NQF_Level)
              if (key === "Semester" || key === "semester") {
                return (
                  <Grid item xs={12} key={key}>
                    <Autocomplete
                      value={value || ""} // Ensure proper population for update
                      onChange={(e, newValue) => handleChange({ target: { name: key, value: newValue } })}
                      options={semesters} // List of semesters
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

              if (key === "NQF_Level" || key === "nqf_level") {
                return (
                  <Grid item xs={12} key={key}>
                    <Autocomplete
                      value={value || ""} // Ensure proper population for update
                      onChange={(e, newValue) => handleChange({ target: { name: key, value: newValue } })}
                      options={highestEducation} // List of NQF levels
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
                    InputLabelProps={{ style: { color: isDarkMode ? '#F7FAFC' : '#1E293B' } }}
                  />
                </Grid>
              );
            })}
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
                  color: 'red', // Red text color for delete button
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
      </Box>

      {/* Confirmation Dialog */}
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
    </Drawer>
  );
};

export default UniversityDetailsDrawer;
