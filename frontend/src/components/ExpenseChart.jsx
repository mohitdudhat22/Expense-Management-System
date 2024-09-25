import { useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useExpense } from '../contexts/ExpenseContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function ExpenseChart() {
  const { state } = useExpense();

  const monthlyData = useMemo(() => {
    const data = {};
    state.expenses.forEach((expense) => {
      const month = expense.date.slice(0, 7); // YYYY-MM
      if (!data[month]) {
        data[month] = 0;
      }
      data[month] += expense.amount;
    });
    return Object.entries(data).map(([month, total]) => ({ month, total }));
  }, [state.expenses]);

  const categoryData = useMemo(() => {
    const data = {};
    state.expenses.forEach((expense) => {
      if (!data[expense.category]) {
        data[expense.category] = 0;
      }
      data[expense.category] += expense.amount;
    });
    return Object.entries(data).map(([category, value]) => ({ category, value }));
  }, [state.expenses]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Expense Analysis
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Monthly Expenses
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Expenses by Category
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}

export default ExpenseChart;