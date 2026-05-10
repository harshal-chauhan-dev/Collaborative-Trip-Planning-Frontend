import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { expensesApi } from '../../api/expenses.js';
import { membersApi } from '../../api/members.js';
import { useRole } from '../../hooks/useRole.js';
import ExpenseSummary from '../../components/ExpenseSummary.jsx';
import { btn, form } from '../../lib/ui.js';

const schema = z.object({
  category: z.string().min(1),
  description: z.string().optional(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount'),
  currency: z.string().length(3),
  paidByUserId: z.string().uuid('Select a payer'),
  occurredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

function ExpenseForm({ onSubmit, onCancel, members }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { currency: 'USD' } });

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-3">
        <div className={form.field}>
          <label className={form.label}>Category *</label>
          <input {...register('category')} className={form.control} placeholder="Food, Transport…" />
          {errors.category && <span className={form.error}>{errors.category.message}</span>}
        </div>
        <div className={form.field}>
          <label className={form.label}>Date *</label>
          <input {...register('occurredOn')} type="date" className={form.control} />
          {errors.occurredOn && <span className={form.error}>{errors.occurredOn.message}</span>}
        </div>
      </div>
      <div className={form.field}>
        <label className={form.label}>Description</label>
        <input {...register('description')} className={form.control} />
      </div>
      <div className="grid grid-cols-[1fr_80px] gap-3">
        <div className={form.field}>
          <label className={form.label}>Amount *</label>
          <input {...register('amount')} className={form.control} placeholder="0.00" />
          {errors.amount && <span className={form.error}>{errors.amount.message}</span>}
        </div>
        <div className={form.field}>
          <label className={form.label}>Currency</label>
          <input {...register('currency')} className={form.control} maxLength={3} />
        </div>
      </div>
      <div className={form.field}>
        <label className={form.label}>Paid by *</label>
        <select {...register('paidByUserId')} className={form.control}>
          <option value="">Select…</option>
          {members?.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        {errors.paidByUserId && <span className={form.error}>{errors.paidByUserId.message}</span>}
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

export default function TripBudget() {
  const { tripId } = useParams();
  const { can } = useRole();
  const qc = useQueryClient();
  const canEdit = can('editor');
  const [showCreate, setShowCreate] = useState(false);

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses', tripId],
    queryFn: () => expensesApi.list(tripId).then((d) => d.expenses),
  });

  const { data: summaryData } = useQuery({
    queryKey: ['budget-summary', tripId],
    queryFn: () => expensesApi.summary(tripId).then((d) => d.summary),
  });

  const { data: membersData } = useQuery({
    queryKey: ['members', tripId],
    queryFn: () => membersApi.list(tripId).then((d) => d.members),
  });

  const createMutation = useMutation({
    mutationFn: (data) => expensesApi.create(tripId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expenses', tripId] });
      qc.invalidateQueries({ queryKey: ['budget-summary', tripId] });
      setShowCreate(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => expensesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expenses', tripId] });
      qc.invalidateQueries({ queryKey: ['budget-summary', tripId] });
    },
  });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Budget & Expenses</h2>
        {canEdit && (
          <button type="button" className={btn.primary} onClick={() => setShowCreate((s) => !s)}>
            + Add expense
          </button>
        )}
      </div>

      {showCreate && (
        <div className="mb-6 max-w-[560px] rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-[15px] font-semibold text-gray-900">New expense</h3>
          <ExpenseForm
            onSubmit={(d) => createMutation.mutate(d)}
            onCancel={() => setShowCreate(false)}
            members={membersData}
          />
        </div>
      )}

      {summaryData && (
        <div className="mb-7">
          <h3 className="mb-3 text-[15px] font-semibold text-gray-900">Summary</h3>
          <ExpenseSummary summary={summaryData} />
        </div>
      )}

      <h3 className="mb-3 text-[15px] font-semibold text-gray-900">All expenses</h3>

      {isLoading && <p className="text-sm text-gray-500">Loading…</p>}

      <div className="flex max-w-[700px] flex-col gap-1.5">
        {expenses?.map((exp) => (
          <div
            key={exp.id}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 shadow-sm"
          >
            <div className="min-w-0 flex flex-1 flex-col gap-0.5">
              <span className="text-[13px] font-semibold">{exp.category}</span>
              {exp.description && <span className="text-xs text-gray-800">{exp.description}</span>}
              <span className="text-[11px] text-gray-500">
                {exp.paidBy?.name} · {exp.occurredOn}
              </span>
            </div>
            <div className="whitespace-nowrap text-[14px] font-semibold tabular-nums">
              {parseFloat(exp.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} {exp.currency}
            </div>
            {canEdit && (
              <button type="button" className={btn.ghost} onClick={() => deleteMutation.mutate(exp.id)}>
                🗑️
              </button>
            )}
          </div>
        ))}
        {expenses?.length === 0 && <p className="text-sm text-gray-500">No expenses yet.</p>}
      </div>
    </div>
  );
}
