import { cx } from '../lib/ui.js';

const ROLE_LABELS = { owner: 'Owner', editor: 'Editor', viewer: 'Viewer' };

const ROLE_STYLES = {
  owner: 'bg-blue-100 text-blue-800',
  editor: 'bg-green-100 text-green-800',
  viewer: 'bg-gray-100 text-gray-700',
};

export default function RoleBadge({ role }) {
  return (
    <span
      className={cx(
        'inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        ROLE_STYLES[role] ?? 'bg-gray-100 text-gray-700',
      )}
    >
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}
