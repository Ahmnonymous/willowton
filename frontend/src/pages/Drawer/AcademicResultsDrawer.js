import React, { useEffect, useState, useContext } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ThemeContext } from '../../config/ThemeContext'; // Import ThemeContext

const AcademicResultsDrawer = ({ open, onClose, studentId, resultId, onSave }) => {
  const { isDarkMode } = useContext(ThemeContext);  // Access theme context

  const [formData, setFormData] = useState({});
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setFormData({});
      return;
    }

    if (!resultId) {
      setFormData({
        Results_Module: "",
        Results_Percentage: "",
        Results_Attachment: null,
        Results_Attachment_Name: "",
        Student_Details_Portal_id: studentId
      });
      return;
    }

    fetch(`http://localhost:5000/api/academic-results/id/${resultId}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          Results_Module: data.results_module || "",
          Results_Percentage: data.results_percentage || "",
          Results_Attachment: null,
          Results_Attachment_Name: data.results_attachment_name || "",
          id: data.id,
          Student_Details_Portal_id: data.student_details_portal_id || studentId
        });
      });
  }, [open, resultId, studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        Results_Attachment: file,
        Results_Attachment_Name: file.name
      }));
    }
  };

  const handleSave = async () => {
    const isUpdate = !!formData.id;
    const url = isUpdate
      ? `http://localhost:5000/api/academic-results/update/${formData.id}`
      : `http://localhost:5000/api/academic-results/insert`;
    const method = isUpdate ? "PUT" : "POST";

    const body = new FormData();
    body.append("Results_Module", formData.Results_Module);
    body.append("Results_Percentage", formData.Results_Percentage);
    body.append("Student_Details_Portal_id", formData.Student_Details_Portal_id);
    if (formData.Results_Attachment) {
      body.append("Results_Attachment", formData.Results_Attachment);
    }

    const res = await fetch(url, { method, body });

    if (res.ok) {
      const result = await res.json();
      onSave(result);
      onClose();
    } else {
      console.error("Failed to save academic result");
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirmationOpen(true); // Open confirmation dialog
  };

  const handleDeleteConfirm = async () => {
    if (!formData.id) return;
    try {
      await fetch(`http://localhost:5000/api/academic-results/delete/${formData.id}`, {
        method: "DELETE"
      });
      onSave(null);
      onClose();
      setDeleteConfirmationOpen(false); // Close confirmation dialog
    } catch (err) {
      console.error("Failed to delete academic result", err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false); // Close confirmation dialog
  };

  const handleViewFile = () => {
    if (formData.id) {
      window.open(`http://localhost:5000/api/academic-results/view/${formData.id}`, "_blank");
    }
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
          borderBottom: '1px solid #ccc',
          backgroundColor: isDarkMode ? '#1E293B' : '#e1f5fe'
        }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDarkMode ? '#F7FAFC' : '#1E293B' }}>
            Academic Result Details
          </Typography>
        </Box>

        {/* Form Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Result Module"
                name="Results_Module"
                fullWidth
                value={formData.Results_Module || ""}
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
            <Grid item xs={12}>
              <TextField
                label="Percentage"
                name="Results_Percentage"
                fullWidth
                value={formData.Results_Percentage || ""}
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
            <Grid item xs={12}>
              <TextField
                label="Attachment Name"
                name="Results_Attachment_Name"
                fullWidth
                value={formData.Results_Attachment_Name || ""}
                onChange={handleChange}
                disabled
                sx={{
                  backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                  color: isDarkMode ? '#F7FAFC' : '#1E293B',
                  borderRadius: '8px',
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#F7FAFC' : '#1E293B',
                  },
                  '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: isDarkMode ? 'white' : '#1E293B',  // Text color inside the input field when disabled
                    },
                }}
                InputLabelProps={{ style: { color: isDarkMode ? '#F7FAFC' : '#1E293B' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" sx={{ width: "100%" }}>
                Upload File
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
            </Grid>
            {formData.id && formData.Results_Attachment_Name && (
              <Grid item xs={12}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleViewFile}
                  startIcon={<VisibilityIcon />}
                  sx={{ width: "100%" }}
                >
                  View/Download File
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Footer */}
        <Divider />
        <Box sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
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
            {formData.id ? 'Save' : 'Create'}
          </Button>
        </Box>
      </Box>

      {/* Confirmation Dialog for Deletion */}
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

export default AcademicResultsDrawer;
