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
import { ThemeContext } from '../../config/ThemeContext';  // Import ThemeContext

const AboutusDrawer = ({ open, onClose, studentId, aboutMeId, onSave }) => {
  const { isDarkMode } = useContext(ThemeContext);  // Access theme context

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState({});

  // Custom questions
  const questions = [
    "What inspired you to pursue your chosen field of study?*",
    "How do you plan to use your education and skills to make a significant impact in this field?*",
    "What special projects or initiatives have you undertaken in your academic life?*",
    "Can you tell me about any academic awards or scholarships you have received?*",
    "Provide examples or specific skills you have developed that demonstrates your commitment.*",
    "What extracurricular activities have you participated in, and how have they contributed to your personal and academic growth?*",
    "Once you have completed your studies, how will others benefit from it?*",
    "Can you describe any financial challenges you have faced that have affected your ability to pursue your education, and how these challenges have impacted your current financial situation?*",
    "Have you previously been awarded a bursary?*",
    "What do you think has been your most notable contribution to society thus far?*",
    "Why do you think serving the community is important?*",
    "Will you be doing any volunteer work during your studies?*",
    "Are you willing to assist someone in need?*",
    "Describe yourself in three words.*",
    "What is your greatest strength?*",
    "Describe your biggest mistake and what steps you have taken to rectify it.*",
    "What personal achievement makes you proud?*",
    "Are you self-motivated? Explain*",
    "1st choice of study.*",
    "2nd choice of study*",
    "3rd choice of study.*"
  ];

  useEffect(() => {
    if (open) {
      if (aboutMeId) {
        // Editing mode
        fetch(`https//willowtonbursary.co.za/api/about-me/id/${aboutMeId}`)
          .then((res) => res.json())
          .then((data) => {
            setFormData(data);
          });
      } else {
        // Creating new entry
        const initialData = {
          student_details_portal_id: studentId,
        };
        for (let i = 1; i <= 21; i++) {
          initialData[`about_me_q${i.toString().padStart(2, "0")}`] = "";
        }
        setFormData(initialData);
      }
    } else {
      // Cleanup when drawer closes
      setFormData({});
    }
  }, [open, studentId, aboutMeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const isUpdate = !!formData.id;
    const url = isUpdate
      ? `https//willowtonbursary.co.za/api/about-me/update/${formData.id}`
      : `https//willowtonbursary.co.za/api/about-me/insert`;
    const method = isUpdate ? "PUT" : "POST";

    const dataToSend = { ...formData };
    if (!isUpdate) delete dataToSend.id;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        const result = await res.json();
        onSave(result);
        onClose();
      } else {
        console.error("Failed to save About Me data");
      }
    } catch (err) {
      console.error("Error saving About Me data:", err);
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
        `https//willowtonbursary.co.za/api/about-me/delete/${formData.id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        onSave(null);
        onClose();
        setDeleteConfirmationOpen(false); // Close the confirmation dialog
      } else {
        console.error("Failed to delete About Me entry");
      }
    } catch (err) {
      console.error("Error deleting About Me entry:", err);
    }
  };

  // Handle cancel delete
  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false); // Close the confirmation dialog
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: isDarkMode ? '#2D3748' : '#fff'
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: "1px solid #ccc", backgroundColor: isDarkMode ? '#1E293B' : '#e1f5fe' }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDarkMode ? '#F7FAFC' : '#1E293B' }}>
            About Me
          </Typography>
        </Box>

        {/* Form Content */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          <Grid container spacing={2}>
            {questions.map((question, i) => {
              const qNum = (i + 1).toString().padStart(2, "0");
              const key = `about_me_q${qNum}`;

              return (
                <Grid item xs={12} key={key}>
                  <TextField
                    label={question}
                    name={key}
                    fullWidth
                    multiline
                    value={formData[key] || ""}
                    onChange={handleChange}
                    sx={{
                      backgroundColor: isDarkMode ? '#1A202C' : '#ffffff', // Dark/Light background
                      color: isDarkMode ? '#F7FAFC' : '#1E293B', // Text color
                      borderRadius: '8px', // Apply border-radius
                      '& .MuiInputBase-input': {
                        color: isDarkMode ? '#F7FAFC' : '#1E293B', // Input text color
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px', // Apply border-radius to root element
                      },
                      '& .MuiFormLabel-root': {
                        color: isDarkMode ? '#F7FAFC' : '#1E293B', // Label color
                      },
                    }}
                    InputLabelProps={{ style: { color: isDarkMode ? '#F7FAFC' : '#1E293B' } }} // Label color for dark/light mode
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Footer */}
        <Divider />
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #ccc",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={onClose}
              startIcon={<CloseIcon />}
              size="small"
              variant="outlined"
              sx={{
                borderColor: isDarkMode ? '#F7FAFC' : '#1E293B', // Border color for dark/light mode
                color: isDarkMode ? '#F7FAFC' : '#1E293B', // Text color
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
                  borderColor: isDarkMode ? '#F7FAFC' : '#1E293B', // Red border color for delete button
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
          Are you sure you want to delete this entry?
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

export default AboutusDrawer;
