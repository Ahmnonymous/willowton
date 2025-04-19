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
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ThemeContext } from '../../config/ThemeContext'; // Import ThemeContext

const AttachmentsDrawer = ({ open, onClose, studentId, attachmentId, onSave }) => {
  const { isDarkMode } = useContext(ThemeContext);  // Access theme context

  const [formData, setFormData] = useState({});
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!open) {
      setFormData({});
      return;
    }

    if (!attachmentId) {
      setFormData({
        Attachments_Name: "",
        Attachments_Description: "",
        Attachment: null,
        Student_Details_Portal_id: studentId,
      });
      return;
    }

    // Editing mode
    fetch(`http://localhost:5000/api/attachments/id/${attachmentId}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          Attachments_Name: data.attachments_name || "",
          Attachments_Description: data.attachments_description || "",
          Attachment: null, // Don't preload binary data
          id: data.id,
          Student_Details_Portal_id: data.student_details_portal_id || studentId,
        });
      });
  }, [open, attachmentId, studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileNameWithoutExtension = file.name;
      setFormData((prev) => ({
        ...prev,
        Attachments_Name: fileNameWithoutExtension,
        Attachment: file,
      }));
    }
  };

  const handleSave = async () => {
    const isUpdate = !!formData.id;
    const url = isUpdate
      ? `http://localhost:5000/api/attachments/update/${formData.id}`
      : `http://localhost:5000/api/attachments/insert`;
    const method = isUpdate ? "PUT" : "POST";

    const body = new FormData();
    body.append("Attachments_Name", formData.Attachments_Name);
    body.append("Attachments_Description", formData.Attachments_Description);
    body.append("Student_Details_Portal_id", formData.Student_Details_Portal_id);
    if (formData.Attachment) {
      body.append("Attachment", formData.Attachment);
    }

    const res = await fetch(url, { method, body });

    if (res.ok) {
      const result = await res.json();
      onSave(result);
      setSuccessMessage(isUpdate ? "Updated successfully!" : "Created successfully!");
      onClose();
    } else {
      console.error("Failed to save attachment");
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirmationOpen(true); // Open confirmation dialog
  };

  const handleDeleteConfirm = async () => {
    if (!formData.id) return;
    try {
      await fetch(`http://localhost:5000/api/attachments/delete/${formData.id}`, {
        method: "DELETE",
      });
      onSave(null);
      setSuccessMessage("Deleted successfully!");
      onClose();
      setDeleteConfirmationOpen(false); // Close the confirmation dialog
    } catch (err) {
      console.error("Failed to delete attachment", err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false); // Close the confirmation dialog
  };

  const handleViewFile = () => {
    if (formData.id) {
      window.open(`http://localhost:5000/api/attachments/view/${formData.id}`, "_blank");
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, height: "100%", display: "flex", flexDirection: "column", backgroundColor: isDarkMode ? '#2D3748' : '#fff' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: "1px solid #ccc", backgroundColor: isDarkMode ? '#1E293B' : '#e1f5fe' }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDarkMode ? '#F7FAFC' : '#1E293B' }}>
            Attachment Details
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
            <Grid item xs={12}>
              <TextField
                label="Attachment Name"
                name="Attachments_Name"
                fullWidth
                disabled
                value={formData.Attachments_Name || ""}
                onChange={handleChange}
                sx={{
                  backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                  color: isDarkMode ? '#F7FAFC' : '#1E293B',
                  borderRadius: '8px',
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#F7FAFC' : '#1E293B',
                  },
                  '& .MuiFormLabel-root': {
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
              <TextField
                label="Description"
                name="Attachments_Description"
                fullWidth
                value={formData.Attachments_Description || ""}
                onChange={handleChange}
                sx={{
                  backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                  color: isDarkMode ? '#F7FAFC' : '#1E293B',
                  borderRadius: '8px',
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#F7FAFC' : '#1E293B',
                  },
                  '& .MuiFormLabel-root': {
                    color: isDarkMode ? '#F7FAFC' : '#1E293B',
                  },
                }}
                InputLabelProps={{ style: { color: isDarkMode ? '#F7FAFC' : '#1E293B' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" sx={{ width: "100%", borderColor: isDarkMode ? '#F7FAFC' : '#1E293B' }}>
                Upload File
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
            </Grid>
            {formData.id && (
              <Grid item xs={12}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleViewFile}
                  startIcon={<VisibilityIcon />}
                  sx={{ width: "100%", color: isDarkMode ? '#F7FAFC' : '#1E293B' }}
                >
                  View/Download File
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Footer */}
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
                color="error"
                size="small"
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

      {/* Delete Confirmation Dialog */}
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

export default AttachmentsDrawer;
