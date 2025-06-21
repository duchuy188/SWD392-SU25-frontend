import axiosInstance from './axiosInstance';

export const testServices = {

  getAllTests: async () => {
    return await axiosInstance.get('/tests');
  },


  getTestById: async (testId: string) => {
    return await axiosInstance.get(`/tests/${testId}`);
  },


  submitTest: async (testId: string, answers: any) => {
    return await axiosInstance.post(`/tests/${testId}/submit`, answers);
  },


  getUserTestResults: async () => {
    return await axiosInstance.get('/tests/my-results');
  },

  getUserTestResultById: async (resultId: string) => {
    return await axiosInstance.get(`/tests/results/${resultId}`);
  }
};