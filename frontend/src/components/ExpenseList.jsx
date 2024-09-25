import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, TextField, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useExpense } from '../contexts/ExpenseContext';

function ExpenseList() {
  const { state, fetchExpenses, updateExpense, deleteOneExpenses } = useExpense();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  console.log(state)
  useEffect(() => {
    fetchExpenses(); // Fetch expenses when the component mounts
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
    await deleteOneExpenses(id); // Call the context method to delete the expense
  };

  // Sort and paginate expenses
  const sortedExpenses = [...state.expenses].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedExpenses = sortedExpenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
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
                <TableCell>
                  {editingId === expense._id ? (
                    <TextField
                      name="date"
                      type="date"
                      value={new Date(editFormData.createdAt).toISOString().split('T')[0]} 
                      onChange={handleEditChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  ) : (
                    new Date(expense.createdAt).toLocaleDateString() 
                  )}
                </TableCell>
                <TableCell>
                  {editingId === expense._id ? (
                    <TextField
                      name="amount"
                      type="number"
                      value={editFormData.amount}
                      onChange={handleEditChange}
                    />
                  ) : (
                    expense.amount
                  )}
                </TableCell>
                <TableCell>
                  {editingId === expense._id ? (
                    <TextField
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditChange}
                    />
                  ) : (
                    expense.category
                  )}
                </TableCell>
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