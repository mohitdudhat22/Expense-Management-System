import React, { createContext, useContext, useReducer, useCallback } from 'react';

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

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  const updateChartData = useCallback(() => {
    const monthlyData = {};
    const categoryData = {};

    state.expenses.forEach((expense) => {
      // Monthly data
      const month = expense.date.slice(0, 7); // YYYY-MM
      monthlyData[month] = (monthlyData[month] || 0) + expense.amount;

      // Category data
      categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
    });

    const chartData = {
      monthly: Object.entries(monthlyData).map(([month, total]) => ({ month, total })),
      category: Object.entries(categoryData).map(([category, total]) => ({ category, total })),
    };

    dispatch({ type: 'UPDATE_CHART_DATA', payload: chartData });
  }, [state.expenses]);

  const updateStatistics = useCallback(() => {
    const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageExpense = totalExpenses / state.expenses.length || 0;
    const highestExpense = Math.max(...state.expenses.map(expense => expense.amount), 0);
    const lowestExpense = Math.min(...state.expenses.map(expense => expense.amount), 0);

    dispatch({
      type: 'UPDATE_STATISTICS',
      payload: { totalExpenses, averageExpense, highestExpense, lowestExpense },
    });
  }, [state.expenses]);

  const addExpense = useCallback((expense) => {
    dispatch({ type: 'ADD_EXPENSE', payload: { ...expense, id: Date.now() } });
    updateChartData();
    updateStatistics();
  }, [updateChartData, updateStatistics]);

  const updateExpense = useCallback((updatedExpense) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: updatedExpense });
    updateChartData();
    updateStatistics();
  }, [updateChartData, updateStatistics]);

  const deleteExpense = useCallback((expenseId) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: expenseId });
    updateChartData();
    updateStatistics();
  }, [updateChartData, updateStatistics]);

  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const addCategory = useCallback((category) => {
    dispatch({ type: 'ADD_CATEGORY', payload: category });
  }, []);

  const contextValue = {
    state,
    addExpense,
    updateExpense,
    deleteExpense,
    setFilters,
    addCategory,
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