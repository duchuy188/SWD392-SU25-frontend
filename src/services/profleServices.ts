import axiosInstance from "./axiosInstance";


export const profileServices = {

  getProfile: () => {
    return axiosInstance.get('/auth/profile');
  },

  updateProfile: (fullName: string, phone: string, address: string, profilePicture: string) => {
    return axiosInstance.put('/auth/update', { 
      fullName, 
      phone, 
      address,
      profilePicture
    });
  }
};
