import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// GLOBAL INTERCEPTOR HANDSHAKE PIPELINE
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Inject Authorization Bearer token header token directly
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const expenseService = {
  getExpenses: async (userId, page, size, category) => {
    const params = { page, size };
    if (category && category.trim() !== '') {
      params.category = category;
    }
    // No more manual headers tracking blocks required here! Interceptor handles it.
    const response = await apiClient.get('/expenses', { params });
    return response.data;
  },

  createExpense: async (userId, expenseData) => {
    const response = await apiClient.post('/expenses', expenseData);
    return response.data;
  },

  deleteExpense: async (userId, expenseId) => {
    const response = await apiClient.delete(`/expenses/${expenseId}`);
    return response.data;
  }
};

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};