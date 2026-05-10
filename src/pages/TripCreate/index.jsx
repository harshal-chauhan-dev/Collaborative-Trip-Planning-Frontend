import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tripsApi } from '../../api/trips.js';
import { btn, form } from '../../lib/ui.js';

const schema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Required'),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Required'),
    travelerCount: z.coerce.number().int().min(1),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  });

export default function TripCreate() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { travelerCount: 1 } });

  const mutation = useMutation({
    mutationFn: tripsApi.create,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      navigate(`/trips/${data.trip.id}`);
    },
    onError: (err) => setError('root', { message: err.message }),
  });

  return (
    <div className="flex min-h-screen justify-center bg-gray-50 px-6 py-10">
      <div className="w-full max-w-[480px] rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-[22px] font-bold text-gray-900">New trip</h1>

        <form className={form.stack} onSubmit={handleSubmit((d) => mutation.mutate(d))}>
          <div className={form.field}>
            <label className={form.label}>Trip title</label>
            <input {...register('title')} className={form.control} placeholder="Summer in Japan" />
            {errors.title && <span className={form.error}>{errors.title.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className={form.field}>
              <label className={form.label}>Start date</label>
              <input {...register('startDate')} type="date" className={form.control} />
              {errors.startDate && <span className={form.error}>{errors.startDate.message}</span>}
            </div>

            <div className={form.field}>
              <label className={form.label}>End date</label>
              <input {...register('endDate')} type="date" className={form.control} />
              {errors.endDate && <span className={form.error}>{errors.endDate.message}</span>}
            </div>
          </div>

          <div className={form.field}>
            <label className={form.label}>Number of travelers</label>
            <input {...register('travelerCount')} type="number" min={1} className={form.control} />
          </div>

          {errors.root && <span className={form.error}>{errors.root.message}</span>}

          <div className={form.actions}>
            <button type="button" className={btn.secondary} onClick={() => navigate('/trips')}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={btn.primary}>
              {isSubmitting ? 'Creating…' : 'Create trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
