import api from './api';

export const noteService = {
  async getNotes(params = {}) {
    const response = await api.get('/notes', { params });
    return response.data;
  },

  async searchNotes(keyword, page = 0, size = 9) {
    const response = await api.get('/notes/search', {
      params: { keyword, page, size },
    });
    return response.data;
  },

  async getTopRatedNotes() {
    const response = await api.get('/notes/top-rated');
    return response.data;
  },

  async getRecentNotes() {
    const response = await api.get('/notes/recent');
    return response.data;
  },

  async getMyNotes(page = 0, size = 9) {
    const response = await api.get('/notes/my-notes', {
      params: { page, size },
    });
    return response.data;
  },

  async getNoteById(id) {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  async uploadNote(formData) {
    const response = await api.post('/notes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateNote(id, formData) {
    const response = await api.put(`/notes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteNote(id) {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  async downloadNote(id, defaultFileName = 'note_document') {
    const response = await api.get(`/notes/${id}/download`, {
      responseType: 'blob',
    });

    // Extract filename from Content-Disposition if present
    let filename = defaultFileName;
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.indexOf('filename=') !== -1) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    // Trigger local download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
