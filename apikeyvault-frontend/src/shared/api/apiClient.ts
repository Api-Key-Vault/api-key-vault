import axios, { type AxiosInstance } from "axios";

export const apiClient : AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});