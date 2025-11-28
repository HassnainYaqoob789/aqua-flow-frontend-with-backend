// // src/lib/api/apiClient.ts
// import axios from "axios";
// import Cookies from "js-cookie";
// import { BASE_URL } from "./endpoints";

// const apiClient = axios.create({
//   baseURL: BASE_URL, 
//   // DO NOT set Content-Type globally here!
// });

// // Interceptor for token + FormData fix
// apiClient.interceptors.request.use((config) => {
//   const token = Cookies.get("token") || localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   if (config.data instanceof FormData) {
//     delete config.headers["Content-Type"]; 
//   }

//   return config;
// });

// // Error logging
// apiClient.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     console.error("API Error:", error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

// export default apiClient;
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "./endpoints";
import { useToastStore } from "../../store/toastStore";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

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

apiClient.interceptors.response.use(
  (res) => {
    // Check for success message in response
    if (res.data?.message && res.config.method !== 'get') {
      useToastStore.getState().addToast(res.data.message, 'success');
    }
    return res;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    
    // Show error toast
    const message = error.response?.data?.message 
      || error.response?.data?.error 
      || error.message 
      || 'Something went wrong';
    
    useToastStore.getState().addToast(message, 'error');
    
    return Promise.reject(error);
  }
);

export default apiClient;