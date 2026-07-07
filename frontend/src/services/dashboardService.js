import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const dashboardService = {
  getDashboardStats: () => {
    const token = localStorage.getItem('token'); // Retrieve token if your Spring Security setup requires JWT headers
    
    return axios.get(`${API_BASE_URL}/dashboard`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }
};