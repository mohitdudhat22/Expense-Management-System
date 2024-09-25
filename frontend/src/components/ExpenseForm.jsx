import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Autocomplete } from '@mui/material';
import { useExpense } from '../contexts/ExpenseContext';

function ExpenseForm() {
  const navigate = useNavigate();
  const { state, dispatch } = useExpense();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: '',
    category: '',
    paymentMethod: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch({
        type: 'ADD_EXPENSE',
        payload: { ...formData, id: Date.now(), amount: parseFloat(formData.amount) },
      });
      // navigate('/list');
    }
  };

  const validateForm = () => {
    // Add your validation logic here
    return true;
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
      <TextField
        fullWidth
        margin="normal"
        name="description"
        label="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        name="date"
        label="Date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
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