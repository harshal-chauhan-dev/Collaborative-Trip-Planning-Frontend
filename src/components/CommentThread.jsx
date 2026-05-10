import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../api/comments.js';
import { useAuth } from '../context/AuthContext.jsx';
import { btn, cx } from '../lib/ui.js';

const formatTime = (iso) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function CommentThread({ tripId, parentType, parentId, canComment = true }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [body, setBody] = useState('');

  const key = ['comments', tripId, parentType, parentId];

  const { data, isLoading } = useQuery({
    queryKey: key,
    queryFn: () => commentsApi.list(tripId, parentType, parentId).then((d) => d.comments),
  });

  const addMutation = useMutation({
    mutationFn: () => commentsApi.create(tripId, { parentType, parentId, body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      setBody('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId) => commentsApi.delete(tripId, commentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return (
    <div className="flex flex-col gap-2">
      {isLoading && <p className="text-xs text-gray-500">Loading comments…</p>}

      <div className="flex max-h-[200px] flex-col gap-1.5 overflow-y-auto">
        {data?.map((c) => (
          <div key={c.id} className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-2">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="text-xs font-semibold">{c.author?.name ?? 'Unknown'}</span>
              <span className="flex-1 text-[11px] text-gray-500">{formatTime(c.createdAt)}</span>
              {user?.id === c.authorId && (
                <button type="button" className={btn.ghostSm} onClick={() => deleteMutation.mutate(c.id)}>
                  ×
                </button>
              )}
            </div>
            <p className="whitespace-pre-wrap break-words text-[13px] text-gray-900">{c.body}</p>
          </div>
        ))}
        {data?.length === 0 && <p className="py-1 text-center text-xs text-gray-500">No comments yet</p>}
      </div>

      {canComment && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (body.trim()) addMutation.mutate();
          }}
          className="flex flex-col gap-1.5"
        >
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment…"
            className="min-h-[52px] resize-y rounded-md border border-gray-300 px-2 py-1.5 text-[13px] outline-none focus:border-blue-600"
            rows={2}
          />
          <button
            type="submit"
            disabled={!body.trim() || addMutation.isPending}
            className={cx(btn.primarySm, 'self-start')}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}
