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
  DialogTitle,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ThemeContext } from '../../config/ThemeContext'; // Import ThemeContext

const ExpenseDetailsDrawer = ({ open, onClose, studentId, expenseDetailsId, onSave }) => {
  const { isDarkMode } = useContext(ThemeContext);  // Access theme context

  const [formData, setFormData] = useState({
    Father_Monthly_Salary: '',
    Mother_Monthly_Salary: '',
    Spouse_Monthly_Salary: '',
    Applicant_Monthly_Salary: '',
    Rent_Income: '',
    Grants: '',
    Other_Income: '',
    Rent_Bond_Expense: '',
    Rates_Expense: '',
    Utilities_Expense: '',
    Groceries_Expense: '',
    Transport_Petrol_Expense: '',
    Telephone_Expense: '',
    Medical_Aid_Expense: '',
    Insurance_Expense: '',
    Other_Expense: '',
    total_income: 0,
    total_expenses: 0,
  });

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  useEffect(() => {
    if (open && expenseDetailsId) {
      fetch(`http://localhost/api/expense-details/id/${expenseDetailsId}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setFormData({
              Father_Monthly_Salary: data.father_monthly_salary || '',
              Mother_Monthly_Salary: data.mother_monthly_salary || '',
              Spouse_Monthly_Salary: data.spouse_monthly_salary || '',
              Applicant_Monthly_Salary: data.applicant_monthly_salary || '',
              Rent_Income: data.rent_income || '',
              Grants: data.grants || '',
              Other_Income: data.other_income || '',
              Rent_Bond_Expense: data.rent_bond_expense || '',
              Rates_Expense: data.rates_expense || '',
              Utilities_Expense: data.utilities_expense || '',
              Groceries_Expense: data.groceries_expense || '',
              Transport_Petrol_Expense: data.transport_petrol_expense || '',
              Telephone_Expense: data.telephone_expense || '',
              Medical_Aid_Expense: data.medical_aid_expense || '',
              Insurance_Expense: data.insurance_expense || '',
              Other_Expense: data.other_expense || '',
              total_income: Number(data.total_income) || 0,
              total_expenses: Number(data.total_expenses) || 0,
            });
          }
        })
        .catch(error => console.error('Error fetching expense details:', error));
    } else {
      setFormData({
        Father_Monthly_Salary: '',
        Mother_Monthly_Salary: '',
        Spouse_Monthly_Salary: '',
        Applicant_Monthly_Salary: '',
        Rent_Income: '',
        Grants: '',
        Other_Income: '',
        Rent_Bond_Expense: '',
        Rates_Expense: '',
        Utilities_Expense: '',
        Groceries_Expense: '',
        Transport_Petrol_Expense: '',
        Telephone_Expense: '',
        Medical_Aid_Expense: '',
        Insurance_Expense: '',
        Other_Expense: '',
        total_income: 0,
        total_expenses: 0,
      });
    }
  }, [open, expenseDetailsId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      
      // Recalculate total income and total expenses
      const incomeFields = [
        'Father_Monthly_Salary', 'Mother_Monthly_Salary', 'Spouse_Monthly_Salary',
        'Applicant_Monthly_Salary', 'Rent_Income', 'Grants', 'Other_Income'
      ];
      const expenseFields = [
        'Rent_Bond_Expense', 'Rates_Expense', 'Utilities_Expense', 'Groceries_Expense',
        'Transport_Petrol_Expense', 'Telephone_Expense', 'Medical_Aid_Expense', 'Insurance_Expense', 'Other_Expense'
      ];

      const totalIncome = incomeFields.reduce((total, key) => total + (parseFloat(newFormData[key]) || 0), 0);
      const totalExpenses = expenseFields.reduce((total, key) => total + (parseFloat(newFormData[key]) || 0), 0);

      newFormData.total_income = totalIncome;
      newFormData.total_expenses = totalExpenses;

      return newFormData;
    });
  };

  const handleSave = () => {
    // Calculate total income and total expenses if not already set
    const totalIncome = Object.keys(formData)
      .filter(key => key.includes("Salary") || key.includes("Income"))
      .reduce((total, key) => total + (parseFloat(formData[key]) || 0), 0);
  
    const totalExpenses = Object.keys(formData)
      .filter(key => key.includes("Expense"))
      .reduce((total, key) => total + (parseFloat(formData[key]) || 0), 0);
  
    const updatedFormData = {
      ...formData,
      total_income: totalIncome.toString(),
      total_expenses: totalExpenses.toString()
    };
  
    const stringFormData = Object.keys(updatedFormData).reduce((acc, key) => {
      const value = updatedFormData[key];
      acc[key] = value !== '' ? value.toString() : value;  // Convert to string
      return acc;
    }, {});
  
    const url = expenseDetailsId
      ? `http://localhost/api/expense-details/update/${expenseDetailsId}`
      : `http://localhost/api/expense-details/insert`;
  
    const method = expenseDetailsId ? 'PUT' : 'POST';
  
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...stringFormData, student_details_portal_id: studentId }),
    })
      .then(res => res.json())
      .then(savedData => {
        onSave(savedData);
        onClose();
      })
      .catch(error => {
        console.error('Error saving expense details:', error);
      });
  };
  
  const handleDeleteClick = () => {
    setDeleteConfirmationOpen(true); // Open confirmation dialog
  };

  const handleDeleteConfirm = async () => {
    if (!expenseDetailsId) return;
    try {
      await fetch(`http://localhost/api/expense-details/delete/${expenseDetailsId}`, {
        method: 'DELETE',
      });
      onSave(null);
      onClose();
      setDeleteConfirmationOpen(false); // Close the confirmation dialog
    } catch (err) {
      console.error('Error deleting expense details:', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false); // Close the confirmation dialog
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: isDarkMode ? '#2D3748' : '#fff' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #ccc', backgroundColor: isDarkMode ? '#1E293B' : '#e1f5fe' }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDarkMode ? '#F7FAFC' : '#1E293B' }}>
            Financial Details
          </Typography>
        </Box>

        {/* Form Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <Grid container spacing={2}>
            {/* Income Fields */}
            {['Father_Monthly_Salary', 'Mother_Monthly_Salary', 'Spouse_Monthly_Salary', 'Applicant_Monthly_Salary', 'Rent_Income', 'Grants', 'Other_Income'].map((key, idx) => {
              const label = key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
              return (
                <Grid item xs={12} key={idx}>
                  <TextField
                    label={label}
                    name={key}
                    type="number"
                    value={formData[key]}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{ inputMode: 'decimal' }}
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

            {/* Expense Fields */}
            {['Rent_Bond_Expense', 'Rates_Expense', 'Utilities_Expense', 'Groceries_Expense', 'Transport_Petrol_Expense', 'Telephone_Expense', 'Medical_Aid_Expense', 'Insurance_Expense', 'Other_Expense'].map((key, idx) => {
              const label = key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
              return (
                <Grid item xs={12} key={idx}>
                  <TextField
                    label={label}
                    name={key}
                    type="number"
                    value={formData[key]}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{ inputMode: 'decimal' }}
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

            {/* Read-only Total Income and Total Expenses Fields */}
            <Grid item xs={12}>
              <TextField
                label="Total Income"
                value={formData.total_income.toFixed(2)} // Display total income
                fullWidth
                variant="outlined"
                sx={{
                  backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                  color: isDarkMode ? '#F7FAFC' : '#1E293B',
                  borderRadius: '8px',
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#F7FAFC' : '#1E293B',
                  }
                }}
                InputProps={{
                  readOnly: true, // Make Total Income field read-only
                }}
                InputLabelProps={{ style: { color: isDarkMode ? '#F7FAFC' : '#1E293B' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Total Expenses"
                value={formData.total_expenses.toFixed(2)} // Display total expenses
                fullWidth
                variant="outlined"
                sx={{
                  backgroundColor: isDarkMode ? '#1A202C' : '#ffffff',
                  color: isDarkMode ? '#F7FAFC' : '#1E293B',
                  borderRadius: '8px',
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#F7FAFC' : '#1E293B',
                  }
                }}
                InputProps={{
                  readOnly: true, // Make Total Expenses field read-only
                }}
                InputLabelProps={{ style: { color: isDarkMode ? '#F7FAFC' : '#1E293B' } }}
              />
            </Grid>
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
            {expenseDetailsId && (
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
            startIcon={expenseDetailsId ? <SaveIcon /> : <AddIcon />}
            variant="contained"
            size="small"
          >
            {expenseDetailsId ? 'Save' : 'Create'}
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

export default ExpenseDetailsDrawer;
