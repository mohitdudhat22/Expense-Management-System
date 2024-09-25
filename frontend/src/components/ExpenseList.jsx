import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, TextField, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useExpense } from '../contexts/ExpenseContext';

function ExpenseList() {
  const { state, dispatch } = useExpense();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

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
    setEditingId(expense.id);
    setEditFormData(expense);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: editFormData });
    setEditingId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
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
                  active={orderBy === 'description'}
                  direction={orderBy === 'description' ? order : 'asc'}
                  onClick={() => handleSort('description')}
                >
                  Description
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
              <TableRow key={expense.id}>
                <TableCell>
                  {editingId === expense.id ? (
                    <TextField
                      name="date"
                      type="date"
                      value={editFormData.date}
                      onChange={handleEditChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  ) : (
                    expense.date
                  )}
                </TableCell>
                <TableCell>
                  {editingId === expense.id ? (
                    <TextField
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                    />
                  ) : (
                    expense.description
                  )}
                </TableCell>
                <TableCell>
                  {editingId === expense.id ? (
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
                  {editingId === expense.id ? (
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
                  {editingId === expense.id ? (
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
                      <IconButton onClick={() => handleDelete(expense.id)}>
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
