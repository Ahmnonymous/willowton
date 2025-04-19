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

const PaymentDrawer = ({ open, onClose, studentId, recordId, onSave }) => {
  const { isDarkMode } = useContext(ThemeContext);  // Access theme context

  const [formData, setFormData] = useState({});
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (!recordId) {
      setFormData({
        Payments_Expense_Type: "",
        Payments_Vendor: "",
        Payments_Expense_Amount: "",
        Payments_Date: "",
        Payments_ET_Number: "",
        Payments_Attachment_Name: "",
        Proof_of_Payment: null,
        Payment_Created_By: "",
        Student_Details_Portal_id: studentId
      });
    } else {
      fetch(`https://willowtonbursary.co.za/api/payments/id/${recordId}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            Payments_Expense_Type: data.payments_expense_type || "",
            Payments_Vendor: data.payments_vendor || "",
            Payments_Expense_Amount: data.payments_expense_amount || "",
            Payments_Date: data.payments_date || "",
            Payments_ET_Number: data.payments_et_number || "",
            Payments_Attachment_Name: data.payments_attachment_name || "",
            Proof_of_Payment: null,
            Payment_Created_By: data.payment_created_by || "",
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
        Proof_of_Payment: file,
        Payments_Attachment_Name: file.name
      }));
    }
  };

  const handleSave = async () => {
    const isUpdate = !!formData.id;
    const url = isUpdate
      ? `https://willowtonbursary.co.za/api/payments/update/${formData.id}`
      : `https://willowtonbursary.co.za/api/payments/insert`;
    const method = isUpdate ? "PUT" : "POST";

    const body = new FormData();
    body.append("Payments_Expense_Type", formData.Payments_Expense_Type);
    body.append("Payments_Vendor", formData.Payments_Vendor);
    body.append("Payments_Expense_Amount", formData.Payments_Expense_Amount);
    body.append("Payments_Date", formData.Payments_Date);
    body.append("Payments_ET_Number", formData.Payments_ET_Number);
    body.append("Payments_Attachment_Name", formData.Payments_Attachment_Name);
    body.append("Payment_Created_By", formData.Payment_Created_By);
    body.append("Student_Details_Portal_id", formData.Student_Details_Portal_id);
    if (formData.Proof_of_Payment) {
      body.append("Proof_of_Payment", formData.Proof_of_Payment);
    }

    const res = await fetch(url, { method, body });
    if (res.ok) {
      const result = await res.json();
      onSave(result);
      onClose();
    } else {
      console.error("Failed to save payment");
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirmationOpen(true); // Open confirmation dialog
  };

  const handleDeleteConfirm = async () => {
    if (!formData.id) return;
    try {
      await fetch(`https://willowtonbursary.co.za/api/payments/delete/${formData.id}`, {
        method: "DELETE"
      });
      onSave(null);
      onClose();
      setDeleteConfirmationOpen(false); // Close confirmation dialog
    } catch (err) {
      console.error("Failed to delete payment", err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false); // Close confirmation dialog
  };

  const handleViewFile = () => {
    if (formData.id) {
      window.open(`https://willowtonbursary.co.za/api/payments/view/${formData.id}`, "_blank");
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
            Payment Details
          </Typography>
        </Box>

        {/* Form Content */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Expense Type"
                name="Payments_Expense_Type"
                fullWidth
                value={formData.Payments_Expense_Type || ""}
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
                label="Vendor"
                name="Payments_Vendor"
                fullWidth
                value={formData.Payments_Vendor || ""}
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
                label="Amount"
                name="Payments_Expense_Amount"
                fullWidth
                value={formData.Payments_Expense_Amount || ""}
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
                label="Date"
                name="Payments_Date"
                fullWidth
                value={formData.Payments_Date || ""}
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
                label="ET Number"
                name="Payments_ET_Number"
                fullWidth
                value={formData.Payments_ET_Number || ""}
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
                name="Payments_Attachment_Name"
                fullWidth
                value={formData.Payments_Attachment_Name || ""}
                disabled
                sx={{
                  backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                  color: isDarkMode ? '#F7FAFC' : '#1E293B',
                  borderRadius: '8px',
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#F7FAFC' : '#1E293B',
                  },
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: isDarkMode ? 'white' : '#1E293B',
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
            {formData.id && formData.Payments_Attachment_Name && (
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

export default PaymentDrawer;
