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
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

export const register = async (email, password) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, { email, password, username, role });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    return false;
  }
};

export const getUserProfile = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`);
  return response.data;
};
