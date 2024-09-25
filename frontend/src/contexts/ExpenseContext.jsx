import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';

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
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
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
const BASE_API = import.meta.env.VITE_BASE_API;
export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  const fetchExpenses = useCallback(async () => {
    const response = await axios.get('/api/expenses');
    dispatch({ type: 'SET_EXPENSES', payload: response.data });
  }, []);

  const addExpense = useCallback(async (expense) => {
    const response = await axios.post('/api/expenses', expense);
    dispatch({ type: 'ADD_EXPENSE', payload: response.data });
  }, []);

  const updateExpense = useCallback(async (updatedExpense) => {
    const response = await axios.patch(`/api/expenses/${updatedExpense.id}`, updatedExpense);
    dispatch({ type: 'UPDATE_EXPENSE', payload: response.data });
  }, []);

  const deleteExpense = useCallback(async (expenseId) => {
    await axios.delete(`${BASE_API}/api/expenses/${expenseId}`);
    dispatch({ type: 'DELETE_EXPENSE', payload: expenseId });
  }, []);

  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const addCategory = useCallback((category) => {
    dispatch({ type: 'ADD_CATEGORY', payload: category });
  }, []);

  const contextValue = {
    state,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
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
