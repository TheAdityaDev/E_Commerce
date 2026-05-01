import axios from "axios";


// dynamic base URL
const BASE_URL =
  window.location.hostname === "localhost"
    ? import.meta.env.VITE_API_LOCAL
    : import.meta.env.VITE_API_IP;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});
