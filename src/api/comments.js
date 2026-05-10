import { api } from '../lib/api.js';

export const commentsApi = {
  list: (tripId, parentType, parentId) =>
    api.get(`/trips/${tripId}/comments?parentType=${parentType}&parentId=${parentId}`),
  create: (tripId, data) => api.post(`/trips/${tripId}/comments`, data),
  delete: (tripId, commentId) => api.delete(`/trips/${tripId}/comments/${commentId}`),
};
