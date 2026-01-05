import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to ALL requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('401 Unauthorized - Token may be invalid');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const donorAPI = {
  getAll: () => api.get('/donors'),
  getById: (id) => api.get(`/donors/${id}`),
  create: (donorData) => api.post('/donors', donorData),
  update: (id, donorData) => api.put(`/donors/${id}`, donorData),
  delete: (id) => api.delete(`/donors/${id}`),
  predict: (id) => api.post(`/donors/${id}/predict`),
  getEligible: () => api.get('/donors/eligible'),
  checkPhone: (phone) => api.get(`/donors/check-phone/${phone}`),
};

export const eventAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (eventData) => api.post('/events', eventData),
  update: (id, eventData) => api.put(`/events/${id}`, eventData),
  delete: (id) => api.delete(`/events/${id}`),
  getUpcoming: () => api.get('/events/upcoming'),
};

export const mlAPI = {
  predict: (data) => axios.post('http://localhost:8000/predict', data),
  predictBatch: (data) => axios.post('http://localhost:8000/predict-batch', data),
};

export default api;