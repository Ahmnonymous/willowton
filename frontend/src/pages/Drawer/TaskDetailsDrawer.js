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
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMediaQuery } from "@mui/material";
import { ThemeContext } from '../../config/ThemeContext';

const TaskDetailsDrawer = ({
  open,
  onClose,
  studentId,
  taskId,
  onSave,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const isLargeScreen = useMediaQuery("(min-width:600px)");
  const drawerWidth = isLargeScreen ? 500 : 330;

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.user_type === 'admin';
  const isStudent = user?.user_type === 'student';

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (open) {
      if (taskId) {
        fetch(`https://willowtonbursary.co.za/api/tasks/id/${taskId}`)
          .then((res) => res.json())
          .then((data) => {
            setFormData(data);
          });
      } else {
        const initialData = {
          student_details_portal_id: studentId,
          created_by: isAdmin ? user?.first_name || "" : "",
          task_comment: "",
          task_description: "",
          task_status: "",
        };
        setFormData(initialData);
      }
    } else {
      setFormData({});
    }
  }, [open, studentId, taskId, isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutocompleteChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!isAdmin) {
      setSuccessMessage("Only admins can create or edit tasks.");
      return;
    }

    const isUpdate = !!formData.id;
    const url = isUpdate
      ? `https://willowtonbursary.co.za/api/tasks/update/${formData.id}`
      : `https://willowtonbursary.co.za/api/tasks/insert`;
    const method = isUpdate ? "PUT" : "POST";

    const body = { ...formData };
    if (!isUpdate) delete body.id;

    try {
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
        console.error("Failed to save Task Details");
      }
    } catch (err) {
      console.error("Error saving Task Details", err);
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!formData.id || !isAdmin) {
      if (!isAdmin) setSuccessMessage("Only admins can delete tasks.");
      return;
    }

    try {
      const res = await fetch(
        `https://willowtonbursary.co.za/api/tasks/delete/${formData.id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        onSave(null);
        setSuccessMessage("Deleted successfully!");
        onClose();
        setDeleteConfirmationOpen(false);
      } else {
        console.error("Failed to delete Task Details");
      }
    } catch (err) {
      console.error("Error deleting Task Details", err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
  };

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

  const taskStatusOptions = ["Pending", "Completed"];

  const renderField = (key, index) => {
    if (key === "id" || key === "student_details_portal_id" || key === "task_date_stamp" || key === "created_by") {
      return null;
    }

    let label = key.replace(/_/g, " ");
    label = label
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    if (key === "task_status") {
      return (
        <Grid item xs={12} key={index}>
          <Autocomplete
            value={formData[key] || ""}
            onChange={(e, newValue) => handleAutocompleteChange(key, newValue)}
            options={taskStatusOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                sx={fieldStyles}
                InputLabelProps={inputLabelProps}
                disabled={isStudent}
              />
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
          disabled={isStudent}
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
            Task Details
          </Typography>
          {successMessage && (
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              {successMessage}
            </Typography>
          )}
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
            {formData.id && isAdmin && (
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
          {isAdmin && (
            <Button
              onClick={handleSave}
              startIcon={formData.id ? <SaveIcon /> : <AddIcon />}
              variant="contained"
              size="small"
            >
              {formData.id ? "Save" : "Create"}
            </Button>
          )}
        </Box>

        <Dialog open={deleteConfirmationOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this task?
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

export default TaskDetailsDrawer;