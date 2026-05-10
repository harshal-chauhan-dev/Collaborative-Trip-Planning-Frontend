import { api } from '../lib/api.js';

export const expensesApi = {
  list: (tripId) => api.get(`/trips/${tripId}/expenses`),
  summary: (tripId) => api.get(`/trips/${tripId}/expenses/summary`),
  create: (tripId, data) => api.post(`/trips/${tripId}/expenses`, data),
  update: (expenseId, data) => api.patch(`/expenses/${expenseId}`, data),
  delete: (expenseId) => api.delete(`/expenses/${expenseId}`),
};
