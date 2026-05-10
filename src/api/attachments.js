import { api } from '../lib/api.js';

export const attachmentsApi = {
  list: (tripId, parentType, parentId) => {
    const params = new URLSearchParams();
    if (parentType) params.set('parentType', parentType);
    if (parentId) params.set('parentId', parentId);
    const qs = params.toString();
    return api.get(`/trips/${tripId}/attachments${qs ? `?${qs}` : ''}`);
  },
  upload: async (tripId, file, parentType = 'trip', parentId) => {
    const form = new FormData();
    form.append('file', file);
    form.append('parentType', parentType);
    if (parentId) form.append('parentId', parentId);

    const res = await fetch(`/api/trips/${tripId}/attachments`, {
      method: 'POST',
      credentials: 'include',
      body: form,
    });

    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error?.message ?? 'Upload failed');
    }

    return res.json();
  },
  downloadUrl: (attachmentId) => `/api/attachments/${attachmentId}/download`,
  delete: (attachmentId) => api.delete(`/attachments/${attachmentId}`),
};
