import api from './api';

export const subjectService = {
  async getSubjects() {
    const response = await api.get('/subjects');
    return response.data;
  },

  async getSubject(id) {
    const response = await api.get(`/subjects/${id}`);
    return response.data;
  },

  async createSubject(data) {
    const response = await api.post('/subjects', data);
    return response.data;
  },

  async updateSubject(id, data) {
    const response = await api.put(`/subjects/${id}`, data);
    return response.data;
  },

  async deleteSubject(id) {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  },
};
