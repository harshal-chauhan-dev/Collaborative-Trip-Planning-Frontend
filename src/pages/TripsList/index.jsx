import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { tripsApi } from '../../api/trips.js';
import RoleBadge from '../../components/RoleBadge.jsx';
import { btn } from '../../lib/ui.js';

const formatDateRange = (start, end) => {
  const s = new Date(start + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const e = new Date(end + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${s} – ${e}`;
};

export default function TripsList() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: () => tripsApi.list().then((d) => d.trips),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <h1 className="text-lg font-bold text-gray-900">✈️ Trip Planner</h1>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-gray-500">Hi, {user?.name}</span>
          <button type="button" className={btn.secondarySm} onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-6 py-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">My Trips</h2>
          <button type="button" className={btn.primary} onClick={() => navigate('/trips/new')}>
            + New trip
          </button>
        </div>

        {isLoading && <p className="text-sm text-gray-500">Loading…</p>}

        {data?.length === 0 && (
          <p className="text-sm text-gray-500">
            No trips yet. <Link to="/trips/new">Create your first trip</Link>.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
          {data?.map((trip) => (
            <Link
              to={`/trips/${trip.id}`}
              key={trip.id}
              className="flex flex-col gap-1.5 rounded-lg border border-gray-200 bg-white p-4 text-gray-900 shadow-sm no-underline transition-shadow hover:shadow-md hover:no-underline"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[15px] font-semibold">{trip.title}</span>
                <RoleBadge role={trip.role} />
              </div>
              <div className="text-xs text-gray-500">{formatDateRange(trip.startDate, trip.endDate)}</div>
              <div className="text-xs text-gray-500">
                👥 {trip.travelerCount} traveler{trip.travelerCount !== 1 ? 's' : ''}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
