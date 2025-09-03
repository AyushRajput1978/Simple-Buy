import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

import { logout } from './redux/reducer/authSlice';
import { store } from './redux/store';

// Define extended interface for your Axios instance with custom properties
interface CustomAxiosInstance extends AxiosInstance {
  show_notif: boolean;
  withCredentials: boolean;
}

interface ApiErrorResponse {
  message: string;
  // Add other possible error response properties here
  code?: string;
  status?: number;
}

const sessionId = localStorage.getItem('sessionId');
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT as string,
  headers: {
    'x-session-id': sessionId || undefined,
  },
  params: {},
});

// Cast to CustomAxiosInstance with proper initialization
const instance = axiosInstance as CustomAxiosInstance;

// Set default headers using interceptors
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authToken: string | undefined = Cookies.get('JWT');
  if (authToken) {
    // Use the proper Axios header methods
    config.headers.set('Authorization', `Bearer ${authToken}`);
  }
  return config;
});

// Initialize custom properties
instance.show_notif = true;
instance.withCredentials = true;

instance.interceptors.response.use(
  function (response: AxiosResponse) {
    return response;
  },
  function (error: AxiosError<ApiErrorResponse>) {
    const isLoginRequest = error?.config?.url?.includes('/login');

    if (error.response && error.response.status === 401) {
      if (!isLoginRequest) {
        const allCookies = Cookies.get();
        Object.keys(allCookies).forEach((cookieName) => {
          Cookies.remove(cookieName);
        });
        store.dispatch(logout());
        window.location.href = '/login';
      }
    } else {
      if (instance.show_notif) {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        alert(errorMessage);
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
