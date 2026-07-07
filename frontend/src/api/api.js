import axios from 'axios';
import { API_BASE_URL, USER_STORAGE_KEY } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const userSession = localStorage.getItem(USER_STORAGE_KEY);

    if (userSession) {
      const parsedUser = JSON.parse(userSession);

      if (parsedUser.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// IMPORTANT: Return the complete axios response
api.interceptors.response.use(
  (response) => response,
  (error) => {

    let message = 'An unexpected error occurred.';

    if (error.response?.data?.message) {
      message = error.response.data.message;
    }

    return Promise.reject({
      message,
      status: error.response?.status,
      raw: error
    });

  }
);

export default api;