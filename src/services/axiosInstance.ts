import axios from "axios";
import { userServices } from "./userServices";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('edubot_accessToken');
    if (accessToken) {
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
      originalRequest._retry = true; // Mark the request as retried

      try {
        const refreshToken = localStorage.getItem('edubot_refreshToken');
        if (refreshToken) {
          const response = await userServices.refreshToken(refreshToken);
          const newAccessToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken;

          localStorage.setItem('edubot_accessToken', newAccessToken);
          localStorage.setItem('edubot_refreshToken', newRefreshToken);

          // Update the Authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Retry the original request
          return axiosInstance(originalRequest);
        } else {
          // No refresh token, redirect to login
          localStorage.removeItem('edubot_user');
          localStorage.removeItem('edubot_accessToken');
          localStorage.removeItem('edubot_refreshToken');
          window.location.href = '/login'; // Redirect to login page
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Clear local storage and redirect to login on refresh failure
        localStorage.removeItem('edubot_user');
        localStorage.removeItem('edubot_accessToken');
        localStorage.removeItem('edubot_refreshToken');
        window.location.href = '/login'; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;