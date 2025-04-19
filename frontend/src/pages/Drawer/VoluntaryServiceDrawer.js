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

const VoluntaryServiceDrawer = ({ open, onClose, studentId, recordId, onSave }) => {
  const { isDarkMode } = useContext(ThemeContext);  // Access theme context

  const [formData, setFormData] = useState({});
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (!recordId) {
      setFormData({
        Organisation: "",
        Contact_Person: "",
        Contact_Person_Number: "",
        Hours_Contributed: "",
        Proof_of_Service: null,
        Service_Attachment_Name: "",
        Student_Details_Portal_id: studentId
      });
    } else {
      fetch(`http://localhost/api/voluntary-service/id/${recordId}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            Organisation: data.organisation || "",
            Contact_Person: data.contact_person || "",
            Contact_Person_Number: data.contact_person_number || "",
            Hours_Contributed: data.hours_contributed || "",
            Proof_of_Service: null,
            Service_Attachment_Name: data.service_attachment_name || "",
            id: data.id,
            Student_Details_Portal_id: data.student_details_portal_id || studentId
          });
        });
    }
  }, [open, recordId, studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        Proof_of_Service: file,
        Service_Attachment_Name: file.name
      }));
    }
  };

  const handleSave = async () => {
    const isUpdate = !!formData.id;
    const url = isUpdate
      ? `http://localhost/api/voluntary-service/update/${formData.id}`
      : `http://localhost/api/voluntary-service/insert`;
    const method = isUpdate ? "PUT" : "POST";

    const body = new FormData();
    body.append("Organisation", formData.Organisation);
    body.append("Contact_Person", formData.Contact_Person);
    body.append("Contact_Person_Number", formData.Contact_Person_Number);
    body.append("Hours_Contributed", formData.Hours_Contributed);
    body.append("Student_Details_Portal_id", formData.Student_Details_Portal_id);
    if (formData.Proof_of_Service) {
      body.append("Proof_of_Service", formData.Proof_of_Service);
    }

    const res = await fetch(url, { method, body });
    if (res.ok) {
      const result = await res.json();
      onSave(result);
      onClose();
    } else {
      console.error("Failed to save voluntary service");
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirmationOpen(true); // Open confirmation dialog
  };

  const handleDeleteConfirm = async () => {
    if (!formData.id) return;
    try {
      await fetch(`http://localhost/api/voluntary-service/delete/${formData.id}`, {
        method: "DELETE"
      });
      onSave(null);
      onClose();
      setDeleteConfirmationOpen(false); // Close confirmation dialog
    } catch (err) {
      console.error("Failed to delete voluntary service", err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false); // Close confirmation dialog
  };

  const handleViewFile = () => {
    if (formData.id) {
      window.open(`http://localhost/api/voluntary-service/view/${formData.id}`, "_blank");
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
            Voluntary Service
          </Typography>
        </Box>

        {/* Form Content */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Organisation"
                name="Organisation"
                fullWidth
                value={formData.Organisation || ""}
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
                label="Contact Person"
                name="Contact_Person"
                fullWidth
                value={formData.Contact_Person || ""}
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
                label="Contact Number"
                name="Contact_Person_Number"
                fullWidth
                value={formData.Contact_Person_Number || ""}
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
                label="Hours Contributed"
                name="Hours_Contributed"
                fullWidth
                value={formData.Hours_Contributed || ""}
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
                name="Service_Attachment_Name"
                fullWidth
                value={formData.Service_Attachment_Name || ""}
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
              <Button variant="outlined" component="label" sx={{ width: '100%' }}>
                Upload Proof
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
            </Grid>
            {formData.id && formData.Service_Attachment_Name && (
              <Grid item xs={12}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleViewFile}
                  startIcon={<VisibilityIcon />}
                  sx={{ width: '100%' }}
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

export default VoluntaryServiceDrawer;
