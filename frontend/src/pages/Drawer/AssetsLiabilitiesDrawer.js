import React, { useState, useEffect, useContext } from 'react';
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

const AssetsLiabilitiesDrawer = ({ open, onClose, studentId, assetLiabilityId, onSave }) => {
  const { isDarkMode } = useContext(ThemeContext);  // Access theme context
  // Check for larger or smaller screen size
  const isLargeScreen = useMediaQuery("(min-width:600px)");

  // Drawer width based on screen size
  const drawerWidth = isLargeScreen ? 500 : 330;

  const [formData, setFormData] = useState({
    Gold_Silver: '',
    Cash_in_Bank: '',
    Investments: '',
    Liabilities: ''
  });

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  // const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (open && assetLiabilityId) {
      fetch(`https://willowtonbursary.co.za/api/assets-liabilities/id/${assetLiabilityId}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setFormData({
              Gold_Silver: data.gold_silver || '',
              Cash_in_Bank: data.cash_in_bank || '',
              Investments: data.investments || '',
              Liabilities: data.liabilities || ''
            });
          }
        })
        .catch(console.error);
    } else {
      setFormData({
        Gold_Silver: '',
        Cash_in_Bank: '',
        Investments: '',
        Liabilities: ''
      });
    }
  }, [open, assetLiabilityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const url = assetLiabilityId
      ? `https://willowtonbursary.co.za/api/assets-liabilities/update/${assetLiabilityId}`
      : `https://willowtonbursary.co.za/api/assets-liabilities/insert`;
    const method = assetLiabilityId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, student_details_portal_id: studentId })
    })
      .then(res => res.json())
      .then(savedData => {
        onSave(savedData);
        // setSuccessMessage(assetLiabilityId ? 'Updated successfully!' : 'Created successfully!');
        onClose();
      })
      .catch(console.error);
  };

  const handleDeleteClick = () => {
    setDeleteConfirmationOpen(true); // Open confirmation dialog
  };

  const handleDeleteConfirm = async () => {
    if (!assetLiabilityId) return;
    try {
      await fetch(`https://willowtonbursary.co.za/api/assets-liabilities/delete/${assetLiabilityId}`, {
        method: "DELETE"
      });
      onSave(null);
      // setSuccessMessage('Deleted successfully!');
      onClose();
      setDeleteConfirmationOpen(false); // Close the confirmation dialog
    } catch (err) {
      console.error("Error deleting asset/liability:", err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false); // Close the confirmation dialog
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: drawerWidth, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: isDarkMode ? '#2D3748' : '#fff' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #ccc', backgroundColor: isDarkMode ? '#1E293B' : '#e1f5fe' }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDarkMode ? '#F7FAFC' : '#1E293B' }}>
            Assets & Liabilities
          </Typography>
          {/* {successMessage && (
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              {successMessage}
            </Typography>
          )} */}
        </Box>

        {/* Form Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <Grid container spacing={2}>
            {Object.keys(formData).map((key, idx) => {
              const label = key
                .replace(/_/g, ' ')  // Replace underscores with spaces
                .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word

              return (
                <Grid item xs={12} key={idx}>
                  <TextField
                    label={label}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    fullWidth
                    type="number" // Allow numbers only (including decimals)
                    variant="outlined"
                    InputProps={{
                      inputMode: 'decimal', // Enable decimal input mode for numbers
                    }}
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

        {/* Footer */}
        <Divider />
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
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
            {assetLiabilityId && (
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
            startIcon={assetLiabilityId ? <SaveIcon /> : <AddIcon />}
            variant="contained"
            size="small"
          >
            {assetLiabilityId ? 'Save' : 'Create'}
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

export default AssetsLiabilitiesDrawer;
