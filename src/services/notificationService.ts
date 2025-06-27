import axiosInstance from './axiosInstance';

export const notificationServices = {
  registerToken: (token: string, deviceType: string) => {
    return axiosInstance.post('/notifications/register-token', { token, deviceType });
  },

  unregisterToken: (token: string) => {
    return axiosInstance.post('/notifications/unregister-token', { token });
  },

 
};