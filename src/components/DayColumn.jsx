import { useState } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { itineraryApi } from '../api/itinerary.js';
import ActivityCard from './ActivityCard.jsx';
import CommentThread from './CommentThread.jsx';
import { btn } from '../lib/ui.js';

const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

export default function DayColumn({ day, tripId, canEdit }) {
  const qc = useQueryClient();
  const [addingActivity, setAddingActivity] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [activityTitle, setActivityTitle] = useState('');

  const { setNodeRef } = useDroppable({ id: day.id });

  const addMutation = useMutation({
    mutationFn: (data) => itineraryApi.createActivity(tripId, day.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['days', tripId] });
      setActivityTitle('');
      setAddingActivity(false);
    },
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!activityTitle.trim()) return;
    addMutation.mutate({ title: activityTitle.trim() });
  };

  return (
    <div className="flex min-w-[260px] max-w-[300px] shrink-0 flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-gray-900">{formatDate(day.dayDate)}</span>
        <button type="button" className={btn.ghostSm} onClick={() => setShowComments((s) => !s)}>
          💬
        </button>
      </div>

      {day.notes && <p className="text-xs italic text-gray-500">{day.notes}</p>}

      <div ref={setNodeRef} className="flex min-h-[40px] flex-col gap-1.5">
        <SortableContext items={day.activities.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {day.activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} tripId={tripId} canEdit={canEdit} />
          ))}
        </SortableContext>

        {day.activities.length === 0 && (
          <p className="py-2 text-center text-xs text-gray-500">No activities yet</p>
        )}
      </div>

      {canEdit && (
        <div className="mt-1">
          {addingActivity ? (
            <form onSubmit={handleAdd} className="flex flex-col gap-1.5">
              <input
                autoFocus
                value={activityTitle}
                onChange={(e) => setActivityTitle(e.target.value)}
                placeholder="Activity title"
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-[13px] outline-none focus:border-blue-600"
              />
              <div className="flex gap-1.5">
                <button type="submit" className={btn.primarySm}>
                  Add
                </button>
                <button type="button" className={btn.secondarySm} onClick={() => setAddingActivity(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button type="button" className={btn.ghostSm} onClick={() => setAddingActivity(true)}>
              + Add activity
            </button>
          )}
        </div>
      )}

      {showComments && (
        <div className="mt-1 border-t border-gray-200 pt-2">
          <CommentThread tripId={tripId} parentType="day" parentId={day.id} canComment />
        </div>
      )}
    </div>
  );
}
