import React, { createContext, useContext, useReducer, useCallback, useEffect, useState } from 'react';
import { 
  getExpenses, 
  createExpense, 
  updateExpense as updateExpenseApi, 
  deleteOneExpenses as deleteOneExpensesApi, 
  deleteExpenses as deleteExpensesApi, 
} from './../services/api';  // Adjust the path to where your api.js file is located

const ExpenseContext = createContext();

const initialState = {
  expenses: [],
  categories: ['Food', 'Transportation', 'Entertainment', 'Bills', 'Other'],
  filters: {
    category: '',
    dateRange: { start: null, end: null },
    paymentMethod: '',
    searchTerm: '',
  },
  chartData: {
    monthly: [],
    category: [],
  },
  statistics: {
    totalExpenses: 0,
    averageExpense: 0,
    highestExpense: 0,
    lowestExpense: 0,
  },
};

function expenseReducer(state, action) {
  switch (action.type) {
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense._id === action.payload._id ? action.payload : expense
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense._id !== action.payload),
      };
    case 'DELETE_EXPENSES':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => !action.payload.includes(expense._id)),
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'UPDATE_CHART_DATA':
      return { ...state, chartData: action.payload };
    case 'UPDATE_STATISTICS':
      return { ...state, statistics: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    default:
      return state;
  }
}

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async (filters = {}) => {
    setLoading(true);
    const response = await getExpenses(filters);
    dispatch({ type: 'SET_EXPENSES', payload: response });
    setLoading(false);
  }, []);

  const addExpense = useCallback(async (expense) => {
    const response = await createExpense(expense);
    dispatch({ type: 'ADD_EXPENSE', payload: response });
  }, []);

  const updateExpense = useCallback(async (id, expenseData) => {
    const updatedExpense = await updateExpenseApi(id, expenseData);
    if (updatedExpense) {
      dispatch({ type: 'UPDATE_EXPENSE', payload: updatedExpense });
    } else {
      console.error('No updated expense returned from API');
    }
  }, []);

  const deleteOneExpenses = useCallback(async (expenseId) => {
    await deleteOneExpensesApi([expenseId]);
    dispatch({ type: 'DELETE_EXPENSE', payload: expenseId });
  }, []);

  const deleteExpenses = useCallback(async (ids) => {
    await deleteExpensesApi(ids);
    dispatch({ type: 'DELETE_EXPENSES', payload: ids });
  }, []);

  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const addCategory = useCallback((category) => {
    dispatch({ type: 'ADD_CATEGORY', payload: category });
  }, []);

  // Function to calculate chart data
  const calculateChartData = (expenses) => {
    const { category, dateRange } = state.filters; // Get filters
    const monthlyData = {};
    const categoryData = {};

    expenses.forEach(expense => {
      // Apply date range filter
      const expenseDate = new Date(expense.createdAt);
      if (dateRange.start && expenseDate < new Date(dateRange.start)) return;
      if (dateRange.end && expenseDate > new Date(dateRange.end)) return;

      // Apply category filter
      if (category && expense.category !== category) return;

      const month = expenseDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      monthlyData[month] = (monthlyData[month] || 0) + parseFloat(expense.amount);
      categoryData[expense.category] = (categoryData[expense.category] || 0) + parseFloat(expense.amount);
    });

    const monthlyChartData = Object.entries(monthlyData).map(([month, total]) => ({ month, total }));
    const categoryChartData = Object.entries(categoryData).map(([category, total]) => ({ category, total }));

    return { monthlyChartData, categoryChartData };
  };

  // Update chart data whenever expenses change
  useEffect(() => {
    const { monthlyChartData, categoryChartData } = calculateChartData(state.expenses);
    dispatch({
      type: 'UPDATE_CHART_DATA',
      payload: { monthly: monthlyChartData, category: categoryChartData },
    });
  }, [state.expenses]);

  const contextValue = {
    state,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteOneExpenses,
    deleteExpenses,
    setFilters,
    addCategory,
    dispatch,
  };

  return (
    <ExpenseContext.Provider value={contextValue}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
}
