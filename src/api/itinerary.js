import { api } from '../lib/api.js';

export const itineraryApi = {
  listDays: (tripId) => api.get(`/trips/${tripId}/days`),
  updateDay: (tripId, dayId, data) => api.patch(`/trips/${tripId}/days/${dayId}`, data),
  createActivity: (tripId, dayId, data) =>
    api.post(`/trips/${tripId}/days/${dayId}/activities`, data),
  updateActivity: (activityId, data) => api.patch(`/activities/${activityId}`, data),
  deleteActivity: (activityId) => api.delete(`/activities/${activityId}`),
  reorderActivities: (tripId, dayId, items) =>
    api.post(`/trips/${tripId}/days/${dayId}/activities/reorder`, items),
};
