import axiosInstance from './axiosInstance';

export const majorServices = {
  getAllMajors: async (page?: number, search?: string, department?: string) => {
    const params = new URLSearchParams();
    
    if (page) params.append('page', page.toString());
    if (search) params.append('search', search);
    if (department) params.append('department', department);
    params.append('includeFilters', 'true');
    params.append('limit', '9'); // Số lượng item trên mỗi trang
    
    return await axiosInstance.get('/majors', { params });
  },

  getMajorById: async (id: string) => {
    return await axiosInstance.get(`/majors/${id}`);
  }
};