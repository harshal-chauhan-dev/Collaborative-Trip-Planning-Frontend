import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checklistsApi } from '../../api/checklists.js';
import { useRole } from '../../hooks/useRole.js';
import { btn, form } from '../../lib/ui.js';

function ChecklistCard({ checklist, canEdit, tripId }) {
  const qc = useQueryClient();
  const [newLabel, setNewLabel] = useState('');

  const toggleMutation = useMutation({
    mutationFn: ({ itemId, isDone }) =>
      checklistsApi.updateItem(checklist.id, itemId, { isDone }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['checklists', tripId] }),
  });

  const addItemMutation = useMutation({
    mutationFn: () => checklistsApi.createItem(checklist.id, { label: newLabel.trim() }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['checklists', tripId] });
      setNewLabel('');
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (itemId) => checklistsApi.deleteItem(checklist.id, itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['checklists', tripId] }),
  });

  const deleteChecklistMutation = useMutation({
    mutationFn: () => checklistsApi.delete(checklist.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['checklists', tripId] }),
  });

  const KIND_LABELS = { packing: '🧳 Packing', todo: '✅ To-do', other: '📋 Other' };

  return (
    <div className="flex flex-col gap-2.5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <span className="mb-0.5 block text-[11px] text-gray-500">
            {KIND_LABELS[checklist.kind] ?? checklist.kind}
          </span>
          <h3 className="text-[15px] font-semibold text-gray-900">{checklist.title}</h3>
        </div>
        {canEdit && (
          <button
            type="button"
            className={btn.ghostSm}
            onClick={() => deleteChecklistMutation.mutate()}
            title="Delete checklist"
          >
            🗑️
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {checklist.items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={item.isDone}
              onChange={() => toggleMutation.mutate({ itemId: item.id, isDone: !item.isDone })}
              className="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <span
              className={`flex-1 text-[13px] ${item.isDone ? 'text-gray-500 line-through' : 'text-gray-900'}`}
            >
              {item.label}
            </span>
            {canEdit && (
              <button type="button" className={btn.ghostSm} onClick={() => deleteItemMutation.mutate(item.id)}>
                ×
              </button>
            )}
          </div>
        ))}

        {checklist.items.length === 0 && <p className="text-xs text-gray-500">No items yet</p>}
      </div>

      {canEdit && (
        <form
          className="flex items-center gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            if (newLabel.trim()) addItemMutation.mutate();
          }}
        >
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Add item…"
            className="min-w-0 flex-1 rounded border border-gray-300 px-2 py-1 text-[13px] outline-none focus:border-blue-600"
          />
          <button type="submit" className={btn.secondarySm}>
            Add
          </button>
        </form>
      )}
    </div>
  );
}

export default function TripChecklists() {
  const { tripId } = useParams();
  const { can } = useRole();
  const qc = useQueryClient();
  const canEdit = can('editor');
  const [formState, setFormState] = useState({ title: '', kind: 'todo' });
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['checklists', tripId],
    queryFn: () => checklistsApi.list(tripId).then((d) => d.checklists),
  });

  const createMutation = useMutation({
    mutationFn: () => checklistsApi.create(tripId, formState),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['checklists', tripId] });
      setFormState({ title: '', kind: 'todo' });
      setShowCreate(false);
    },
  });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Checklists</h2>
        {canEdit && (
          <button type="button" className={btn.primary} onClick={() => setShowCreate((s) => !s)}>
            + New checklist
          </button>
        )}
      </div>

      {showCreate && (
        <form
          className="mb-5 flex max-w-[420px] flex-col gap-3.5 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (formState.title.trim()) createMutation.mutate();
          }}
        >
          <div className={form.field}>
            <label className={form.label}>Title</label>
            <input
              value={formState.title}
              onChange={(e) => setFormState((f) => ({ ...f, title: e.target.value }))}
              className={form.control}
              placeholder="Checklist name"
              required
            />
          </div>
          <div className={form.field}>
            <label className={form.label}>Kind</label>
            <select
              value={formState.kind}
              onChange={(e) => setFormState((f) => ({ ...f, kind: e.target.value }))}
              className={form.control}
            >
              <option value="todo">To-do</option>
              <option value="packing">Packing</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className={form.actions}>
            <button type="button" className={btn.secondary} onClick={() => setShowCreate(false)}>
              Cancel
            </button>
            <button type="submit" className={btn.primary}>
              Create
            </button>
          </div>
        </form>
      )}

      {isLoading && <p className="text-sm text-gray-500">Loading…</p>}

      <div className="grid gap-4 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
        {data?.map((cl) => (
          <ChecklistCard key={cl.id} checklist={cl} canEdit={canEdit} tripId={tripId} />
        ))}
        {data?.length === 0 && <p className="text-sm text-gray-500">No checklists yet.</p>}
      </div>
    </div>
  );
}
