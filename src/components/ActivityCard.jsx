import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { itineraryApi } from '../api/itinerary.js';
import { btn } from '../lib/ui.js';

export default function ActivityCard({ activity, tripId, canEdit }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: activity.title, location: activity.location ?? '' });

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.id,
    disabled: !canEdit,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const updateMutation = useMutation({
    mutationFn: (data) => itineraryApi.updateActivity(activity.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['days', tripId] });
      setEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => itineraryApi.deleteActivity(activity.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['days', tripId] }),
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-2 rounded-md border border-gray-200 bg-white px-3 py-2.5 shadow-sm"
    >
      {canEdit && (
        <span
          className="shrink-0 cursor-grab select-none pt-0.5 text-base leading-none text-gray-400 active:cursor-grabbing"
          {...attributes}
          {...listeners}
          title="Drag to reorder"
        >
          ⠿
        </span>
      )}

      <div className="min-w-0 flex-1">
        {editing ? (
          <form onSubmit={handleUpdate} className="flex flex-col gap-1.5">
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded border border-gray-300 px-2 py-1 text-[13px] outline-none focus:border-blue-600"
              required
            />
            <input
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              className="w-full rounded border border-gray-300 px-2 py-1 text-[13px] outline-none focus:border-blue-600"
              placeholder="Location"
            />
            <div className="flex gap-1.5">
              <button type="submit" className={btn.primarySm}>
                Save
              </button>
              <button type="button" className={btn.secondarySm} onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="break-words font-medium text-gray-900">{activity.title}</div>
            {activity.location && (
              <div className="mt-0.5 text-xs text-gray-500">📍 {activity.location}</div>
            )}
            {(activity.startTime || activity.endTime) && (
              <div className="mt-0.5 text-xs text-gray-500">
                🕐 {activity.startTime ?? ''}
                {activity.endTime ? ` – ${activity.endTime}` : ''}
              </div>
            )}
          </>
        )}
      </div>

      {canEdit && !editing && (
        <div className="flex shrink-0 gap-0.5">
          <button type="button" className={btn.ghost} onClick={() => setEditing(true)} title="Edit">
            ✏️
          </button>
          <button type="button" className={btn.ghost} onClick={() => deleteMutation.mutate()} title="Delete">
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}
