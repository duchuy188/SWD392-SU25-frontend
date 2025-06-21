// src/services/chatService.ts
import axiosInstance from './axiosInstance';

export const chatServices = {
 
  sendMessage: async (message: string | File) => {
    const formData = new FormData();
    
    if (typeof message === 'string') {
      formData.append('message', message);
    } else {
      formData.append('image', message);
    }
    
    return await axiosInstance.post('/chat', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },


  createNewChat: async () => {
    return await axiosInstance.post('/chat/new');
  },


  getChatHistory: async () => {
    return await axiosInstance.get('/chat/history');
  },

  getChatById: async (chatId: string) => {
    return await axiosInstance.get(`/chat/${chatId}`);
  },

  deleteChat: async (chatId: string) => {
    return await axiosInstance.delete(`/chat/${chatId}`);
  }
};