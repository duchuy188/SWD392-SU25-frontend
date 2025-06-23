import axios from "axios";
import { userServices } from "./userServices";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  withCredentials: true,
});

// Flag to track if a token refresh is in progress
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Helper function to add callbacks to the subscriber list
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Helper function to execute all subscribers
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// Helper function to check token expiration
const isTokenExpired = (): boolean => {
  const tokenCreatedAt = localStorage.getItem('edubot_tokenCreatedAt');
  const tokenExpiresIn = localStorage.getItem('edubot_tokenExpiresIn');

  if (!tokenCreatedAt || !tokenExpiresIn) {
    return true;
  }

  const createdAt = parseInt(tokenCreatedAt);
  const expiresIn = parseInt(tokenExpiresIn);
  const now = Date.now();

  return (now - createdAt) >= expiresIn;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('edubot_accessToken');
    if (accessToken && !isTokenExpired()) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and not a refresh token request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('edubot_refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Check if token is expired
          if (isTokenExpired()) {
            throw new Error('Token has expired');
          }

          const response = await userServices.refreshToken(refreshToken);
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

          localStorage.setItem('edubot_accessToken', newAccessToken);
          localStorage.setItem('edubot_refreshToken', newRefreshToken);

          // Update token creation time
          const now = Date.now();
          localStorage.setItem('edubot_tokenCreatedAt', now.toString());
          localStorage.setItem('edubot_tokenExpiresIn', '3600000'); // 1 hour

          // Update the Authorization header for future requests
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          
          // Notify all subscribers about the new token
          onRefreshed(newAccessToken);
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          isRefreshing = false;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          
          // Clear storage
          localStorage.removeItem('edubot_user');
          localStorage.removeItem('edubot_accessToken');
          localStorage.removeItem('edubot_refreshToken');
          localStorage.removeItem('edubot_refreshTimer');
          localStorage.removeItem('edubot_tokenCreatedAt');
          localStorage.removeItem('edubot_tokenExpiresIn');
          
          // Chỉ redirect nếu không đang ở trang login
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      } else {
        // If a refresh is already in progress, wait for it to complete
        return new Promise(resolve => {
          addRefreshSubscriber(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;