import { api } from '../lib/api.js';

export const tripsApi = {
  list: () => api.get('/trips'),
  create: (data) => api.post('/trips', data),
  get: (tripId) => api.get(`/trips/${tripId}`),
  update: (tripId, data) => api.patch(`/trips/${tripId}`, data),
  delete: (tripId) => api.delete(`/trips/${tripId}`),
};
