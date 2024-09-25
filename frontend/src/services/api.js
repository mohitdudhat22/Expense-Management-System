import axios from 'axios';

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const login = async (email, password) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    setAuthToken(res.data.token);
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

export const register = async ({ email, password, username, role }) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, { email, password, username, role });
    localStorage.setItem('token', res.data.token);
    setAuthToken(res.data.token);
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    return false;
  }
};

export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  setAuthToken(token);
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const createExpense = async (expenseData) => {
  console.log(expenseData);
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/expenses`, expenseData);
    return response.data;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};

export const getExpenses = async (queryParams) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/expenses`, { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

export const updateExpense = async (id, expenseData) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/expenses/${id}`, {...expenseData, amount: parseFloat(expenseData.amount)});
    console.log('Update response:', response.data); 
    return response.data;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpenses = async (ids) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/expenses`, {
      data: { ids }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting expenses:', error);
    throw error;
  }
};
export const deleteOneExpenses = async (id) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/expenses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting expenses:', error);
    throw error;
  }
};
export const bulkUploadExpenses = async (expensesData) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/expenses/bulk`, expensesData);
    return response.data;
  } catch (error) {
    console.error('Error uploading expenses:', error);
    throw error;
  }
};

export const getMonthlyStats = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/expenses/stats/monthly`);
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    throw error;
  }
};

export const getCategoryStats = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/expenses/stats/category`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category stats:', error);
    throw error;
  }
};
