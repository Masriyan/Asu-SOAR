import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup response interceptors for global error handling (e.g., 401s)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error Response:", error.response);
    if (error.response?.status === 401) {
      // Handle unauthorized e.g. clear tokens, redirect to login
    }
    return Promise.reject(error);
  }
);
