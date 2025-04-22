import React, { useEffect, useState, useContext } from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMediaQuery } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ThemeContext } from '../../config/ThemeContext'; // Import ThemeContext

const InterviewDrawer = ({ open, onClose, studentId, recordId, onSave }) => {
  const { isDarkMode } = useContext(ThemeContext);  // Access theme context

  const [formData, setFormData] = useState({});
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  // Check for larger or smaller screen size
  const isLargeScreen = useMediaQuery("(min-width:600px)");

  // Drawer width based on screen size
  const drawerWidth = isLargeScreen ? 500 : 330;

  // Get the first name and last name from localStorage (assuming the user object is stored there)
  const user = JSON.parse(localStorage.getItem("user"));
  // const createdBy = user.first_name + ' ' + user.last_name; // Concatenate first name and last name
  const createdBy = `${user?.first_name} ${user?.last_name}`;

  const questions = [
    "Briefly describe the applicant's family & social financial conditions?",
    "Employment Status Score",
    "Year of Study",
    "Degree/Diploma Name",
    "Number of Years to Qualify",
    "Reason for Choosing the Course",
    "Field of Study Score",
    "APS Score (Matric) or University Average",
    "Number of Failed Modules",
    "Academic Results Score",
    "Have you worked on any special projects or initiatives?",
    "What extracurricular activities have you participated in?",
    "How do you plan to contribute to your community post-graduation?",
    "How would you inspire others to make an impact?",
    "Community Work Involvement Score",
    "How will you use your education and skills to make an impact?",
    "Can you share academic awards or scholarships received?",
    "Describe a role model and why they inspire you?",
    "Why do you believe you deserve this bursary?",
    "If not awarded this bursary, what are your plans?",
    "Motivation Score",
    "Total Score",
    "Comments Section",
    "Overall Impression"
  ];

  useEffect(() => {
    if (!open) return;

    if (!recordId) {
      setFormData({
        Interviewer_Name: '',
        Year_of_Interview: '',
        Interview_Q01: '',
        Interview_Q02: '',
        Interview_Q03: '',
        Interview_Q04: '',
        Interview_Q05: '',
        Interview_Q06: '',
        Interview_Q07: '',
        Interview_Q08: '',
        Interview_Q09: '',
        Interview_Q10: '',
        Interview_Q11: '',
        Interview_Q12: '',
        Interview_Q13: '',
        Interview_Q14: '',
        Interview_Q15: '',
        Interview_Q16: '',
        Interview_Q17: '',
        Interview_Q18: '',
        Interview_Q19: '',
        Interview_Q20: '',
        Interview_Q21: '',
        Interview_Q22: '',
        Interview_Q23: '',
        Interview_Q24: '',
        Interview_Created_By: createdBy,  // Set created_by field to first and last name of logged-in user
        Date_Stamp: '',
        Student_Details_Portal_id: studentId
      });
    } else {
      fetch(`https://willowtonbursary.co.za/api/interviews/id/${recordId}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            Interviewer_Name: data.interviewer_name || '',
            Year_of_Interview: data.year_of_interview || '',
            Interview_Q01: data.interview_q01 || '',
            Interview_Q02: data.interview_q02 || '',
            Interview_Q03: data.interview_q03 || '',
            Interview_Q04: data.interview_q04 || '',
            Interview_Q05: data.interview_q05 || '',
            Interview_Q06: data.interview_q06 || '',
            Interview_Q07: data.interview_q07 || '',
            Interview_Q08: data.interview_q08 || '',
            Interview_Q09: data.interview_q09 || '',
            Interview_Q10: data.interview_q10 || '',
            Interview_Q11: data.interview_q11 || '',
            Interview_Q12: data.interview_q12 || '',
            Interview_Q13: data.interview_q13 || '',
            Interview_Q14: data.interview_q14 || '',
            Interview_Q15: data.interview_q15 || '',
            Interview_Q16: data.interview_q16 || '',
            Interview_Q17: data.interview_q17 || '',
            Interview_Q18: data.interview_q18 || '',
            Interview_Q19: data.interview_q19 || '',
            Interview_Q20: data.interview_q20 || '',
            Interview_Q21: data.interview_q21 || '',
            Interview_Q22: data.interview_q22 || '',
            Interview_Q23: data.interview_q23 || '',
            Interview_Q24: data.interview_q24 || '',
            Interview_Created_By: data.interview_created_by || createdBy,  // Ensure `created_by` is set
            Date_Stamp: data.date_stamp || '',
            id: data.id,
            Student_Details_Portal_id: data.student_details_portal_id || studentId
          });
        });
    }
  }, [open, recordId, studentId, createdBy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const isUpdate = !!formData.id;
    const url = isUpdate
      ? `https://willowtonbursary.co.za/api/interviews/update/${formData.id}`
      : `https://willowtonbursary.co.za/api/interviews/insert`;
    const method = isUpdate ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      const result = await res.json();
      onSave(result);
      onClose();
    } else {
      console.error("Failed to save interview");
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirmationOpen(true); // Open confirmation dialog
  };

  const handleDeleteConfirm = async () => {
    if (!formData.id) return;
    try {
      await fetch(`https://willowtonbursary.co.za/api/interviews/delete/${formData.id}`, {
        method: "DELETE"
      });
      onSave(null);
      onClose();
      setDeleteConfirmationOpen(false); // Close confirmation dialog
    } catch (err) {
      console.error("Failed to delete interview", err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false); // Close confirmation dialog
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{
        width: drawerWidth,
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
            Interview Details
          </Typography>
        </Box>

        {/* Form Content */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Interviewer Name"
                name="Interviewer_Name"
                fullWidth
                value={formData.Interviewer_Name || ""}
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
                label="Year of Interview"
                name="Year_of_Interview"
                fullWidth
                value={formData.Year_of_Interview || ""}
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
            {questions.map((question, i) => {
              const questionNumber = (i + 1).toString().padStart(2, '0');
              return (
                <Grid item xs={12} key={i}>
                  <TextField
                    label={question}
                    name={`Interview_Q${questionNumber}`}
                    fullWidth
                    value={formData[`Interview_Q${questionNumber}`] || ""}
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
            {/* Interview_Created_By field is not rendered here */}
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

export default InterviewDrawer;
