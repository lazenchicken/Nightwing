import axios from 'axios';

// Centralized API client using the VITE_API_BASE_URL environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default api;
