import axios from 'axios';
import Cookies from 'js-cookie';
import { refreshTokenApi } from '../services';

const authClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const excludeEndpoints = ['/login', '/register'];

let refreshPromise: Promise<string | null> | null = null;

// request interceptor to add Authorization header to all requests except specified endpoints
axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token && !excludeEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// response interceptor to handle 401 Unauthorized and other errors globally
axiosClient.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;

  if (originalRequest.url.includes('/auth/login')) {
    return Promise.reject(error); 
  }

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshTokenApi( 
        Cookies.get('refresh_token') 
      ).then(res => {
        const newToken = res.token;
        Cookies.set('access_token', newToken, { path: '/' });
        Cookies.set('refresh_token', res.refreshToken, { path: '/' });
        return newToken;
      }).catch(() => {
        Cookies.remove('access_token', { path: '/' });
        Cookies.remove('refresh_token', { path: '/' });
        return null;
      }).finally(() => {
        refreshPromise = null;
      });
    }

    const newToken = await refreshPromise;
    if (newToken) {
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosClient(originalRequest);
    } else {
      return Promise.reject(error);
    }
  }
  return Promise.reject(error);
  
});

export { axiosClient, authClient };