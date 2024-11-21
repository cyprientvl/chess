import { ApiUrl } from '@/constants/ApiUrl';
import axios, { type InternalAxiosRequestConfig } from 'axios';
const axiosInstance = axios.create({
  baseURL: ApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
