import api from './api';

export const ratingService = {
  async rateNote(noteId, rating) {
    const response = await api.post(`/notes/${noteId}/ratings`, { rating });
    return response.data;
  },

  async getRatings(noteId) {
    const response = await api.get(`/notes/${noteId}/ratings`);
    return response.data;
  },
};
