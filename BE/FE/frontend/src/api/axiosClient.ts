import axios from "axios";
import { proxyConfig } from "@/utils/proxyConfig";

const axiosClient = axios.create({
  baseURL: proxyConfig.getBaseUrl(),
  timeout: proxyConfig.getTimeout(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    // Always get the current proxy mode settings
    config.baseURL = proxyConfig.getBaseUrl();
    config.timeout = proxyConfig.getTimeout();

    // Get token from localStorage first (for "remember me") or sessionStorage (for temporary sessions)
    let token = localStorage.getItem('accessToken');
    if (!token) {
      token = sessionStorage.getItem('accessToken');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle unauthorized error (401)
    if (
      error.response?.status === 401
    ) {
      // If we get a 401, token is invalid/expired
      // Clear auth from both localStorage and sessionStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('accessToken');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export { axiosClient };