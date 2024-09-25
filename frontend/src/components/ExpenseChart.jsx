import React from 'react';
import { useExpense } from '../contexts/ExpenseContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { PieChart, Pie, Cell, Tooltip as PieTooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-2 border border-gray-700 rounded shadow-md">
        <p className="font-bold text-white">{`${label}`}</p>
        <p className="text-gray-300">{`Total: $${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const PieChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { category, total } = payload[0].payload.payload; // Accessing nested payload details
    return (
      <div className="bg-gray-800 p-2 border border-gray-700 rounded shadow-md">
        <p className="font-bold text-white">{`Category: ${category}`}</p>
        <p className="text-gray-300">{`Amount: ${total.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

function ExpenseChart() {
  const { state } = useExpense();
  const { monthly, category } = state.chartData;

  return (
    <div className="space-y-6 bg-black text-gray-200 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        Expense Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Expenses Line Chart */}
        <div className="bg-gray-900 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-center mb-4 text-gray-200">
            Monthly Expenses
          </h2>
          {monthly.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" stroke="#ccc">
                    <Label value="Month" offset={-5} position="insideBottom" fill="#ccc" />
                  </XAxis>
                  <YAxis stroke="#ccc">
                    <Label value="Total Expenses" angle={-90} position="insideLeft" fill="#ccc" />
                  </YAxis>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ color: '#ccc' }} />
                  <Line type="monotone" dataKey="total" stroke="#00C49F" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-400">No monthly expenses available.</p>
          )}
        </div>

        {/* Expenses by Category Pie Chart */}
        <div className="bg-gray-900 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-center mb-4 text-gray-200">
            Expenses by Category
          </h2>
          {category.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={category}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#8884d8"
                    label={({ name, value }) => `${value.toFixed(2)}`}
                  >
                    {category.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <PieTooltip content={<PieChartTooltip />} />
                  <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ color: '#ccc' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-400">No expenses available by category.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpenseChart;
