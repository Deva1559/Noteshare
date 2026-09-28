import api from './api';

export const adminService = {
  async getDashboard() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  async getStudents(page = 0, size = 15) {
    const response = await api.get('/admin/students', {
      params: { page, size },
    });
    return response.data;
  },

  async deleteNote(id) {
    const response = await api.delete(`/admin/notes/${id}`);
    return response.data;
  },
};
