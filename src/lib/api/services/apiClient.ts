// src/lib/api/apiClient.ts
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "./endpoints";

const apiClient = axios.create({
  baseURL: BASE_URL, 
  // DO NOT set Content-Type globally here!
});

// Interceptor for token + FormData fix
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("token") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"]; 
  }

  return config;
});

// Error logging
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
