import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const auth = localStorage.getItem('auth');

  if (auth) {
    try {
      const { token } = JSON.parse(auth);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to parse auth token from localStorage', error);
    }
  }

  return config;
});

export default api;
