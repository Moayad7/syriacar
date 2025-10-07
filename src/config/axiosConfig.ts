// src/config/axiosConfig.ts

import axios, { AxiosInstance } from 'axios';
import { BASE_URL } from './env';

// Create an Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Set a timeout for requests (in milliseconds)
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers you need
    'Access-Control-Allow-Origin': 'http://localhost:8080',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  },
});

// Optional: Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify the request config here
    // For example, add an authorization token
    const token = localStorage.getItem('token'); // Example of getting a token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

// Optional: Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // You can modify the response data here if needed
    return response;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

export default axiosInstance;


