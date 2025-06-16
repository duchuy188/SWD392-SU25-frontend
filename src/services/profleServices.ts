import axiosInstance from "./axiosInstance";


export const profileServices = {

  getProfile: () => {
    return axiosInstance.get('/auth/profile');
  },

  updateProfile: async (fullName: string, phone: string, address: string, profilePicture: File | null) => {
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('phone', phone);
    formData.append('address', address);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    const response = await axiosInstance.put('/auth/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
