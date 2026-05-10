import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { membersApi } from '../../api/members.js';
import { useRole } from '../../hooks/useRole.js';
import { useAuth } from '../../context/AuthContext.jsx';
import RoleBadge from '../../components/RoleBadge.jsx';
import { btn, form } from '../../lib/ui.js';

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['editor', 'viewer']),
});

export default function TripMembers() {
  const { tripId } = useParams();
  const { role: myRole } = useRole();
  const { user } = useAuth();
  const qc = useQueryClient();
  const isOwner = myRole === 'owner';
  const [showInvite, setShowInvite] = useState(false);
  const [inviteResult, setInviteResult] = useState(null);

  const { data: membersData } = useQuery({
    queryKey: ['members', tripId],
    queryFn: () => membersApi.list(tripId).then((d) => d.members),
  });

  const { data: invitesData } = useQuery({
    queryKey: ['invites', tripId],
    queryFn: () => membersApi.listInvites(tripId).then((d) => d.invites),
    enabled: isOwner,
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(inviteSchema), defaultValues: { role: 'viewer' } });

  const inviteMutation = useMutation({
    mutationFn: (data) => membersApi.invite(tripId, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['members', tripId] });
      qc.invalidateQueries({ queryKey: ['invites', tripId] });
      setInviteResult(res);
      reset();
    },
    onError: (err) => setError('root', { message: err.message }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => membersApi.updateRole(tripId, userId, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['members', tripId] }),
  });

  const removeMutation = useMutation({
    mutationFn: (userId) => membersApi.remove(tripId, userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['members', tripId] }),
  });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Members</h2>
        {isOwner && (
          <button
            type="button"
            className={btn.primary}
            onClick={() => {
              setShowInvite((s) => !s);
              setInviteResult(null);
            }}
          >
            + Invite
          </button>
        )}
      </div>

      {showInvite && (
        <div className="mb-6 flex max-w-[460px] flex-col gap-3.5 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-[14px] font-semibold text-gray-900">Invite member</h3>

          {inviteResult && !inviteResult.directlyAdded && (
            <div className="rounded-md border border-green-200 bg-green-50 p-3">
              <p className="mb-1 text-xs font-medium text-green-700">Share this invite link (valid 7 days):</p>
              <code className="break-all text-[11px] text-green-900">
                {`${window.location.origin}/invite?token=${inviteResult.invite.token}`}
              </code>
            </div>
          )}

          {inviteResult?.directlyAdded && (
            <p className="text-[13px] font-medium text-green-700">
              {inviteResult.user.name} has been added as {inviteResult.role}.
            </p>
          )}

          <form className={form.stack} onSubmit={handleSubmit((d) => inviteMutation.mutate(d))}>
            <div className={form.field}>
              <label className={form.label}>Email address</label>
              <input {...register('email')} type="email" className={form.control} />
              {errors.email && <span className={form.error}>{errors.email.message}</span>}
            </div>
            <div className={form.field}>
              <label className={form.label}>Role</label>
              <select {...register('role')} className={form.control}>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            {errors.root && <span className={form.error}>{errors.root.message}</span>}
            <div className={form.actions}>
              <button type="button" className={btn.secondary} onClick={() => setShowInvite(false)}>
                Close
              </button>
              <button type="submit" disabled={isSubmitting} className={btn.primary}>
                {isSubmitting ? 'Inviting…' : 'Send invite'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex max-w-[600px] flex-col gap-1.5">
        {membersData?.map((member) => (
          <div
            key={member.id}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
          >
            <div className="min-w-0 flex flex-1 flex-col gap-0.5">
              <span className="text-[13px] font-semibold">{member.name}</span>
              <span className="text-[11px] text-gray-500">{member.email}</span>
            </div>
            <RoleBadge role={member.role} />
            {isOwner && member.id !== user?.id && member.role !== 'owner' && (
              <div className="flex items-center gap-2">
                <select
                  value={member.role}
                  onChange={(e) => updateRoleMutation.mutate({ userId: member.id, role: e.target.value })}
                  className="rounded-md border border-gray-300 px-1.5 py-1 text-xs outline-none focus:border-blue-600"
                >
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button type="button" className={btn.dangerSm} onClick={() => removeMutation.mutate(member.id)}>
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isOwner && invitesData?.length > 0 && (
        <div className="mt-7 max-w-[600px]">
          <h3 className="mb-3 text-[14px] font-semibold text-gray-900">Pending invites</h3>
          {invitesData.map((inv) => (
            <div
              key={inv.id}
              className="mb-1.5 flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px]"
            >
              <span>{inv.email}</span>
              <RoleBadge role={inv.role} />
              <span className="text-[11px] text-gray-500">
                Token:{' '}
                <code>
                  {inv.token.slice(0, 8)}…
                </code>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
