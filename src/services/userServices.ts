import axiosInstance from "./axiosInstance";


export const userServices = {

  login: (email: string, password: string) => {
    return axiosInstance.post('/auth/login', { email, password });
  },

  register: (email: string, password: string, fullName: string) => {
    return axiosInstance.post('/auth/register', { email, password, fullName });
  },


  logout: () => {
    return axiosInstance.post('/auth/logout');
  },

  resetPassword: (email: string, resetToken: string, newPassword: string) => {
    return axiosInstance.post('/auth/reset-password', { email, resetToken, newPassword });
  },

  changePassword: (userId: string, oldPassword: string, newPassword: string) => {
    return axiosInstance.put(`/api/users/${userId}/password`, {
      oldPassword,
      newPassword
    });
  },

  forgotPassword: (email: string) => {
    return axiosInstance.post('/auth/forgot-password', { email });
  },

  verifyOtp: (email: string, otp: string) => {
    return axiosInstance.post('/auth/verify-otp', { email, otp });
  },
  

  // Google login
  googleLogin: (idToken: string) => {
    return axiosInstance.post('/auth/google-login', { idToken });
  },

  refreshToken: (refreshToken: string) => {
    return axiosInstance.post('/auth/refresh-token', { refreshToken });
  }
  
};
