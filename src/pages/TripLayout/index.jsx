import { NavLink, Outlet, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripsApi } from '../../api/trips.js';
import RoleBadge from '../../components/RoleBadge.jsx';
import { btn } from '../../lib/ui.js';

const NAV_ITEMS = [
  { to: '', label: 'Overview', end: true },
  { to: 'itinerary', label: 'Itinerary' },
  { to: 'checklists', label: 'Checklists' },
  { to: 'reservations', label: 'Reservations' },
  { to: 'attachments', label: 'Files' },
  { to: 'budget', label: 'Budget' },
  { to: 'members', label: 'Members' },
];

export default function TripLayout() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => tripsApi.get(tripId),
  });

  const deleteMutation = useMutation({
    mutationFn: () => tripsApi.delete(tripId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      navigate('/trips');
    },
  });

  if (isLoading) {
    return <div className="p-10 text-sm text-gray-500">Loading trip…</div>;
  }

  if (isError) {
    return <div className="p-10 text-sm text-gray-500">Trip not found.</div>;
  }

  const { trip, role } = data;

  const handleDelete = () => {
    if (window.confirm(`Delete "${trip.title}"? This cannot be undone.`)) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-[220px] shrink-0 flex-col gap-4 border-r border-gray-200 bg-white px-3 py-4">
        <div className="flex flex-col gap-2.5">
          <button type="button" className={btn.ghostSm + ' self-start'} onClick={() => navigate('/trips')}>
            ← All trips
          </button>
          <div className="flex flex-col gap-1 py-1">
            <h2 className="break-words text-[15px] font-bold leading-snug text-gray-900">{trip.title}</h2>
            <RoleBadge role={role} />
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'block rounded-md px-2.5 py-2 text-[13px] font-medium no-underline transition-colors hover:no-underline',
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {role === 'owner' && (
          <div className="border-t border-gray-200 pt-2">
            <button type="button" className={btn.dangerSm} onClick={handleDelete}>
              Delete trip
            </button>
          </div>
        )}
      </aside>

      <main className="min-h-0 flex-1 overflow-auto px-8 py-7">
        <Outlet context={{ trip, role }} />
      </main>
    </div>
  );
}
