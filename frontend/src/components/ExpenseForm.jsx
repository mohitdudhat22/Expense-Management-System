import { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Autocomplete } from '@mui/material';
import { useExpense } from '../contexts/ExpenseContext';

function ExpenseForm() {
  const { addExpense, state } = useExpense(); // Use addExpense from context
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    paymentMethod: 'cash',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      addExpense({
        amount: parseFloat(formData.amount),
        category: formData.category,
        paymentMethod: formData.paymentMethod,
      });
      resetForm();
    }
  };

  const validateForm = () => {
    if (!formData.amount || !formData.category || !formData.paymentMethod) {
      alert("Please fill out all fields.");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      category: '',
      paymentMethod: 'cash',
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <TextField
        fullWidth
        margin="normal"
        name="amount"
        label="Amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        required
      />
      <Autocomplete
        fullWidth
        options={state.categories}
        renderInput={(params) => <TextField {...params} label="Category" margin="normal" />}
        value={formData.category}
        onChange={(event, newValue) => {
          setFormData((prevData) => ({ ...prevData, category: newValue }));
        }}
        required
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Payment Method</InputLabel>
        <Select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
        >
          <MenuItem value="cash">Cash</MenuItem>
          <MenuItem value="credit">Credit</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Add Expense
      </Button>
    </Box>
  );
}

export default ExpenseForm;
