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
import { useMediaQuery } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ThemeContext } from '../../config/ThemeContext';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parse } from 'date-fns';

const PaymentDrawer = ({ open, onClose, studentId, recordId, onSave }) => {
  const { isDarkMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState({});
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const isLargeScreen = useMediaQuery("(min-width:600px)");
  const drawerWidth = isLargeScreen ? 500 : 330;

  const user = JSON.parse(localStorage.getItem("user"));
  const createdBy = `${user?.first_name} ${user?.last_name}`;

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
        Payment_Created_By: createdBy,
        Student_Details_Portal_id: studentId
      });
      setSelectedDate(null);
    } else {
      fetch(`https://willowtonbursary.co.za/api/payments/id/${recordId}`)
        .then(res => res.json())
        .then(data => {
          const date = data.payments_date ? parse(data.payments_date, 'dd/MM/yyyy', new Date()) : null;
          setSelectedDate(date);
          setFormData({
            Payments_Expense_Type: data.payments_expense_type || "",
            Payments_Vendor: data.payments_vendor || "",
            Payments_Expense_Amount: data.payments_expense_amount || "",
            Payments_Date: data.payments_date || "",
            Payments_ET_Number: data.payments_et_number || "",
            Payments_Attachment_Name: data.payments_attachment_name || "",
            Proof_of_Payment: null,
            Payment_Created_By: data.payment_created_by || createdBy,
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

  const handleViewFile = () => {
    if (formData.id) {
      window.open(`https://willowtonbursary.co.za/api/payments/view/${formData.id}`, "_blank");
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
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!formData.id) return;
    try {
      await fetch(`https://willowtonbursary.co.za/api/payments/delete/${formData.id}`, {
        method: "DELETE"
      });
      onSave(null);
      onClose();
      setDeleteConfirmationOpen(false);
    } catch (err) {
      console.error("Failed to delete payment", err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    const formattedDate = newDate ? format(newDate, 'dd/MM/yyyy') : '';
    setFormData(prev => ({ ...prev, Payments_Date: formattedDate }));
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
            {/* Date Picker Field */}
            {/* <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  format="dd/MM/yyyy"
                  slots={{
                    textField: (params) => (
                      <TextField
                        {...params}
                        fullWidth
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
                    )
                  }}
                />
              </LocalizationProvider>
            </Grid> */}
{/* <Grid container spacing={2}> */}
  <Grid item xs={12} minWidth='100%'>
    <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth minWidth='100%'>
      <DatePicker
        label="Payments Date"
        value={selectedDate}
        onChange={handleDateChange}
        inputFormat="dd/MM/yyyy"
        fullWidth
        minWidth='100%'
        PopperProps={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 10],
              },
            },
          ],
        }}
        // slots={{
          // textField: (params) => (
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
              color: isDarkMode ? '#F7FAFC' : '#1E293B',
              borderRadius: '8px',
              width: '100%',
              minWidth: '100%',
              '& .MuiInputBase-input': {
                color: isDarkMode ? '#F7FAFC' : '#1E293B',
              },
              // Ensure the input takes full width
              '& .MuiInputBase-root': {
                width: '100%',
              },
            }}
            InputLabelProps={{
              style: { color: isDarkMode ? '#F7FAFC' : '#1E293B' },
            }}
          />
        )}
      // }
      />
    </LocalizationProvider>
  </Grid>
{/* </Grid> */}


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
      </Box>
    </Drawer>
  );
};

export default PaymentDrawer;