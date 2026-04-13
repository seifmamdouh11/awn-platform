import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor for automatic token injection
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Only redirect if not already on login page to avoid loops
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    
    if (error.response?.status === 403 && error.response?.data?.code === "ACCOUNT_SUSPENDED") {
      localStorage.removeItem("token");
      if (typeof window !== "undefined") {
        window.location.href = "/login/volunteer?error=suspended";
      }
    }

    return Promise.reject(error);
  }
);

export const isAxiosError = axios.isAxiosError;
export default api;
