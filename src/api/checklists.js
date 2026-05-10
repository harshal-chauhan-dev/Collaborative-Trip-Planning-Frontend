import { api } from '../lib/api.js';

export const checklistsApi = {
  list: (tripId) => api.get(`/trips/${tripId}/checklists`),
  create: (tripId, data) => api.post(`/trips/${tripId}/checklists`, data),
  update: (checklistId, data) => api.patch(`/checklists/${checklistId}`, data),
  delete: (checklistId) => api.delete(`/checklists/${checklistId}`),
  createItem: (checklistId, data) => api.post(`/checklists/${checklistId}/items`, data),
  updateItem: (checklistId, itemId, data) =>
    api.patch(`/checklists/${checklistId}/items/${itemId}`, data),
  deleteItem: (checklistId, itemId) => api.delete(`/checklists/${checklistId}/items/${itemId}`),
  reorderItems: (checklistId, items) =>
    api.post(`/checklists/${checklistId}/items/reorder`, items),
};
