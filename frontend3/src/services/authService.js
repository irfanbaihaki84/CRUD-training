import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/signin`, {
    username,
    password,
  });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const signup = async (email, password, name) => {
  const response = await axios.post(`${API_URL}/signup`, {
    email,
    password,
    name,
  });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
  return Promise.resolve();
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const auth = {
  login,
  signup,
  logout,
  getCurrentUser,
};
