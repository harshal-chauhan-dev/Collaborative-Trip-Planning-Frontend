import { api } from '../lib/api.js';

export const membersApi = {
  list: (tripId) => api.get(`/trips/${tripId}/members`),
  invite: (tripId, data) => api.post(`/trips/${tripId}/members/invites`, data),
  listInvites: (tripId) => api.get(`/trips/${tripId}/members/invites`),
  acceptInvite: (token) => api.post('/invites/accept', { token }),
  updateRole: (tripId, userId, role) => api.patch(`/trips/${tripId}/members/${userId}`, { role }),
  remove: (tripId, userId) => api.delete(`/trips/${tripId}/members/${userId}`),
};
