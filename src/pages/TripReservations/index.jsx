import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { reservationsApi } from '../../api/reservations.js';
import { useRole } from '../../hooks/useRole.js';
import { btn, form } from '../../lib/ui.js';

const KIND_ICONS = { flight: '✈️', hotel: '🏨', car: '🚗', other: '📌' };

const schema = z.object({
  kind: z.enum(['flight', 'hotel', 'car', 'other']),
  title: z.string().min(1),
  vendor: z.string().optional(),
  confirmationNumber: z.string().optional(),
  cost: z.string().regex(/^\d*(\.\d{1,2})?$/).optional().or(z.literal('')),
  currency: z.string().length(3),
  location: z.string().optional(),
  notes: z.string().optional(),
});

function ReservationForm({ onSubmit, onCancel, defaultValues }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { kind: 'other', currency: 'USD' },
  });

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-3">
        <div className={form.field}>
          <label className={form.label}>Kind</label>
          <select {...register('kind')} className={form.control}>
            <option value="flight">Flight</option>
            <option value="hotel">Hotel</option>
            <option value="car">Car</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className={form.field}>
          <label className={form.label}>Title *</label>
          <input {...register('title')} className={form.control} />
          {errors.title && <span className={form.error}>{errors.title.message}</span>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className={form.field}>
          <label className={form.label}>Vendor</label>
          <input {...register('vendor')} className={form.control} />
        </div>
        <div className={form.field}>
          <label className={form.label}>Confirmation #</label>
          <input {...register('confirmationNumber')} className={form.control} />
        </div>
      </div>
      <div className="grid grid-cols-[1fr_80px] gap-3">
        <div className={form.field}>
          <label className={form.label}>Cost</label>
          <input {...register('cost')} className={form.control} placeholder="0.00" />
        </div>
        <div className={form.field}>
          <label className={form.label}>Currency</label>
          <input {...register('currency')} className={form.control} maxLength={3} />
        </div>
      </div>
      <div className={form.field}>
        <label className={form.label}>Location</label>
        <input {...register('location')} className={form.control} />
      </div>
      <div className={form.field}>
        <label className={form.label}>Notes</label>
        <textarea {...register('notes')} className={form.textarea} rows={2} />
      </div>
      <div className={form.actions}>
        <button type="button" className={btn.secondary} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className={btn.primary}>
          Save
        </button>
      </div>
    </form>
  );
}

export default function TripReservations() {
  const { tripId } = useParams();
  const { can } = useRole();
  const qc = useQueryClient();
  const canEdit = can('editor');
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['reservations', tripId],
    queryFn: () => reservationsApi.list(tripId).then((d) => d.reservations),
  });

  const createMutation = useMutation({
    mutationFn: (data) => reservationsApi.create(tripId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reservations', tripId] });
      setShowCreate(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => reservationsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reservations', tripId] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => reservationsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations', tripId] }),
  });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Reservations</h2>
        {canEdit && (
          <button type="button" className={btn.primary} onClick={() => setShowCreate((s) => !s)}>
            + Add reservation
          </button>
        )}
      </div>

      {showCreate && (
        <div className="mb-5 max-w-[560px] rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-[15px] font-semibold text-gray-900">New reservation</h3>
          <ReservationForm onSubmit={(d) => createMutation.mutate(d)} onCancel={() => setShowCreate(false)} />
        </div>
      )}

      {isLoading && <p className="text-sm text-gray-500">Loading…</p>}

      <div className="flex max-w-[700px] flex-col gap-2.5">
        {data?.map((res) => (
          <div key={res.id} className="flex flex-col gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-3.5 shadow-sm">
            {editingId === res.id ? (
              <ReservationForm
                defaultValues={res}
                onSubmit={(d) => updateMutation.mutate({ id: res.id, data: d })}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base">{KIND_ICONS[res.kind] ?? '📌'}</span>
                    <span className="text-[14px] font-semibold">{res.title}</span>
                    {res.vendor && <span className="text-xs text-gray-500">{res.vendor}</span>}
                  </div>
                  {canEdit && (
                    <div className="flex gap-1">
                      <button type="button" className={btn.ghost} onClick={() => setEditingId(res.id)}>
                        ✏️
                      </button>
                      <button type="button" className={btn.ghost} onClick={() => deleteMutation.mutate(res.id)}>
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
                {res.confirmationNumber && (
                  <div className="text-xs text-gray-500">Confirmation: {res.confirmationNumber}</div>
                )}
                {res.location && <div className="text-xs text-gray-500">📍 {res.location}</div>}
                {res.cost && (
                  <div className="text-xs text-gray-500">
                    💰 {res.cost} {res.currency}
                  </div>
                )}
                {res.notes && <p className="whitespace-pre-wrap text-[13px] text-gray-900">{res.notes}</p>}
              </>
            )}
          </div>
        ))}
        {data?.length === 0 && <p className="text-sm text-gray-500">No reservations yet.</p>}
      </div>
    </div>
  );
}
