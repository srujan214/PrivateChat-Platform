import axios from "axios";

export const API_BASE = "http://localhost:8080";
export const WS_URL = "http://localhost:8080/ws";
const api = axios.create({ baseURL: `${API_BASE}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;