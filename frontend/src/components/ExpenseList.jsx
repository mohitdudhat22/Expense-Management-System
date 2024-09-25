import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, TextField, IconButton, Button } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon, Check as CheckIcon, Clear as ClearIcon, Upload as UploadIcon } from '@mui/icons-material';
import { useExpense } from '../contexts/ExpenseContext';
import { CSVLink } from 'react-csv';
import { bulkUploadExpenses } from '../services/api';

function ExpenseList() {
  const { state, fetchExpenses, updateExpense, deleteOneExpenses, deleteExpenses } = useExpense();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [file, setFile] = useState(null); // State for the uploaded file

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setEditFormData({...expense});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    if (!editFormData._id) {
      console.error('No ID found in editFormData:', editFormData);
      return;
    }
    await updateExpense(editFormData._id, editFormData);
    setEditingId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    await deleteOneExpenses(id);
  };

  const handleBulkDelete = async () => {
    await deleteExpenses(selectedIds);
    setSelectedIds([]);
  };

  const handleSelectExpense = (id) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const handleToggleSelectMode = () => {
    setSelectMode((prev) => !prev);
    setSelectedIds([]);
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0]; // Get the selected file
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
    setFile(selectedFile); // Set the selected file
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const parsedData = parseCSV(text); // Parse CSV data
      console.log(parsedData); // Log the parsed data
      try {
        const response = await bulkUploadExpenses(parsedData); // Send parsed data to API
        alert(response.message); // Show success message
        fetchExpenses(); // Refresh the expenses list
        setFile(null); // Clear the file input
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file. Please try again.');
      }
    };
    reader.readAsText(selectedFile); // Read the file as text
  };

  const parseCSV = (text) => {
    const lines = text.split('\n');
    const result = [];
    const headers = lines[0].split(','); // Get headers from the first line

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentLine = lines[i].split(',');

      headers.forEach((header, index) => {
        obj[header.trim()] = currentLine[index].trim(); // Map headers to values
      });

      if (obj.amount && obj.category && obj.paymentMethod) { // Validate required fields
        result.push(obj);
      }
    }
    return result; // Return parsed data
  };

  const csvData = state.expenses.map(({ _id, createdAt, amount, category, paymentMethod }) => ({
    _id,
    createdAt,
    amount,
    category,
    paymentMethod,
  }));

  const sortedExpenses = [...state.expenses].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedExpenses = sortedExpenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#1a1a1a', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleToggleSelectMode} 
            startIcon={selectMode ? <ClearIcon /> : <CheckIcon />}
            sx={{ backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}
          >
            {selectMode ? 'Exit Select Mode' : 'Select Expenses'}
          </Button>
          <CSVLink data={csvData} filename="expenses.csv">
            <Button variant="contained" color="primary" startIcon={<CheckIcon />} sx={{ backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}>
              Export CSV
            </Button>
          </CSVLink>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleBulkDelete} 
            disabled={selectedIds.length === 0} 
            startIcon={<DeleteIcon />} 
            sx={{ backgroundColor: '#dc3545', '&:hover': { backgroundColor: '#c82333' } }}
          >
            Delete Selected
          </Button>
                        <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                id="bulk-upload" 
              />
              <label htmlFor="bulk-upload">
                <Button variant="contained" component="span" startIcon={<UploadIcon />}>
                  Upload CSV
                </Button>
              </label>
        </div>
      </div>
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {selectMode && <TableCell>Select</TableCell>}
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderBy === 'date' ? order : 'asc'}
                  onClick={() => handleSort('date')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'amount'}
                  direction={orderBy === 'amount' ? order : 'asc'}
                  onClick={() => handleSort('amount')}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'category'}
                  direction={orderBy === 'category' ? order : 'asc'}
                  onClick={() => handleSort('category')}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedExpenses.map((expense) => (
              <TableRow key={expense._id}>
                {selectMode && (
                  <TableCell>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(expense._id)} 
                      onChange={() => handleSelectExpense(expense._id)} 
                    />
                  </TableCell>
                )}
                <TableCell>{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{expense.amount}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.paymentMethod}</TableCell>
                <TableCell>
                  {editingId === expense._id ? (
                    <>
                      <IconButton onClick={handleEditSave}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={handleEditCancel}>
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => handleEdit(expense)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(expense._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={state.expenses.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default ExpenseList;