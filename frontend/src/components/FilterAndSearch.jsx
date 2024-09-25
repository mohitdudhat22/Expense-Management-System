import { TextField, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { useExpense } from '../context/ExpenseContext';

function FiltersAndSearch() {
  const { state, dispatch } = useExpense();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_FILTERS', payload: { [name]: value } });
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: 'SET_FILTERS',
      payload: { dateRange: { ...state.filters.dateRange, [name]: value } },
    });
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
      <TextField
        name="searchTerm"
        label="Search"
        value={state.filters.searchTerm}
        onChange={handleFilterChange}
        size="small"
      />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Category</InputLabel>
        <Select
          name="category"
          value={state.filters.category}
          onChange={handleFilterChange}
          label="Category"
        >
          <MenuItem value="">All</MenuItem>
          {state.categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Payment Method</InputLabel>
        <Select
          name="paymentMethod"
          value={state.filters.paymentMethod}
          onChange={handleFilterChange}
          label="Payment Method"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="cash">Cash</MenuItem>
          <MenuItem value="credit">Credit</MenuItem>
        </Select>
      </FormControl>
      <TextField
        name="start"
        label="Start Date"
        type="date"
        value={state.filters.dateRange.start || ''}
        onChange={handleDateRangeChange}
        InputLabelProps={{ shrink: true }}
        size="small"
      />
      <TextField
        name="end"
        label="End Date"
        type="date"
        value={state.filters.dateRange.end || ''}
        onChange={handleDateRangeChange}
        InputLabelProps={{ shrink: true }}
        size="small"
      />
    </Box>
  );
}

export default FiltersAndSearch;