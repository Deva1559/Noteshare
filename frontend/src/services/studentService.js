import api from './api';

export const studentService = {
  async getProfile() {
    const response = await api.get('/students/me');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/students/me', data);
    return response.data;
  },

  async getDashboard() {
    const response = await api.get('/students/dashboard');
    return response.data;
  },
};
