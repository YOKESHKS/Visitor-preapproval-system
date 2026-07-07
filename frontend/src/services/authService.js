import api from '../api/api';
import { USER_STORAGE_KEY } from '../utils/constants';

export const authService = {

  login: async (email, password) => {

    const response = await api.post('/auth/login', {
      email,
      password
    });

    const user = response.data.data;

    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(user)
    );

    return user;
  },

  register: async (employeeData) => {
    return await api.post('/auth/register', employeeData);
  },

  logout: () => {
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  getCurrentUser: () => {
    const user = localStorage.getItem(USER_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(USER_STORAGE_KEY);
  }

};