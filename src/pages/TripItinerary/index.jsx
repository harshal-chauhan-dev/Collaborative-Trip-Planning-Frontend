import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { itineraryApi } from '../../api/itinerary.js';
import { useRole } from '../../hooks/useRole.js';
import DayColumn from '../../components/DayColumn.jsx';

export default function TripItinerary() {
  const { tripId } = useParams();
  const { can } = useRole();
  const qc = useQueryClient();
  const canEdit = can('editor');

  const { data, isLoading } = useQuery({
    queryKey: ['days', tripId],
    queryFn: () => itineraryApi.listDays(tripId).then((d) => d.days),
  });

  const reorderMutation = useMutation({
    mutationFn: ({ dayId, items }) => itineraryApi.reorderActivities(tripId, dayId, items),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const day = data?.find((d) => d.activities.some((a) => a.id === active.id));
    if (!day) return;

    const oldIndex = day.activities.findIndex((a) => a.id === active.id);
    const newIndex = day.activities.findIndex((a) => a.id === over.id);

    const reordered = arrayMove(day.activities, oldIndex, newIndex);
    const items = reordered.map((a, i) => ({ id: a.id, position: i }));

    qc.setQueryData(['days', tripId], (prev) =>
      prev?.map((d) => (d.id === day.id ? { ...d, activities: reordered } : d)),
    );

    reorderMutation.mutate({ dayId: day.id, items });
  };

  if (isLoading) return <p className="text-sm text-gray-500">Loading itinerary…</p>;

  return (
    <div>
      <h2 className="mb-5 text-xl font-bold text-gray-900">Itinerary</h2>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {data?.map((day) => (
            <DayColumn key={day.id} day={day} tripId={tripId} canEdit={canEdit} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
