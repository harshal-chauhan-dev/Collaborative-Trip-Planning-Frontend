import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attachmentsApi } from '../../api/attachments.js';
import { useRole } from '../../hooks/useRole.js';
import { btn } from '../../lib/ui.js';

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export default function TripAttachments() {
  const { tripId } = useParams();
  const { can } = useRole();
  const qc = useQueryClient();
  const canEdit = can('editor');
  const fileRef = useRef();

  const { data, isLoading } = useQuery({
    queryKey: ['attachments', tripId],
    queryFn: () => attachmentsApi.list(tripId).then((d) => d.attachments),
  });

  const uploadMutation = useMutation({
    mutationFn: (file) => attachmentsApi.upload(tripId, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attachments', tripId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => attachmentsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attachments', tripId] }),
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
    e.target.value = '';
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h2 className="flex-1 text-xl font-bold text-gray-900">Files & Attachments</h2>
        {canEdit && (
          <>
            <button type="button" className={btn.primary} onClick={() => fileRef.current?.click()}>
              {uploadMutation.isPending ? 'Uploading…' : '+ Upload file'}
            </button>
            <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />
          </>
        )}
      </div>

      {uploadMutation.isError && (
        <p className="mb-3 text-sm text-red-600">{uploadMutation.error?.message}</p>
      )}

      {isLoading && <p className="text-sm text-gray-500">Loading…</p>}

      <div className="flex max-w-[700px] flex-col gap-2">
        {data?.map((att) => (
          <div
            key={att.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
          >
            <div className="min-w-0 flex flex-col gap-0.5">
              <span className="break-all font-medium text-[13px] text-gray-900">{att.fileName}</span>
              <span className="text-[11px] text-gray-500">
                {att.mimeType} · {formatSize(att.size)}
              </span>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <a
                href={attachmentsApi.downloadUrl(att.id)}
                className={btn.secondarySm}
                download={att.fileName}
              >
                Download
              </a>
              {canEdit && (
                <button type="button" className={btn.dangerSm} onClick={() => deleteMutation.mutate(att.id)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
        {data?.length === 0 && <p className="text-sm text-gray-500">No files uploaded yet.</p>}
      </div>
    </div>
  );
}
