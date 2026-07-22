import axios from "axios";
import { getApiBaseUrl } from "./base-url";

const BASE_URL = getApiBaseUrl();

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests from localStorage (fallback)
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (typeof config.headers.Authorization === "string" && /^Bearer\s*$/.test(config.headers.Authorization)) {
      delete config.headers.Authorization;
    }
  }
  return config;
});

export default axiosInstance;
