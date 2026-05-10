import { api } from '../lib/api.js';

export const reservationsApi = {
  list: (tripId) => api.get(`/trips/${tripId}/reservations`),
  create: (tripId, data) => api.post(`/trips/${tripId}/reservations`, data),
  update: (reservationId, data) => api.patch(`/reservations/${reservationId}`, data),
  delete: (reservationId) => api.delete(`/reservations/${reservationId}`),
};
