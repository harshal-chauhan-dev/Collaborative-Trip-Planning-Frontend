import { useOutletContext } from 'react-router-dom';

const fmt = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export default function TripOverview() {
  const { trip } = useOutletContext();

  const days =
    Math.round((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="max-w-[640px]">
      <h1 className="mb-6 text-[26px] font-bold text-gray-900">{trip.title}</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Start</span>
          <span className="text-[15px] font-semibold">{fmt(trip.startDate)}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">End</span>
          <span className="text-[15px] font-semibold">{fmt(trip.endDate)}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Duration</span>
          <span className="text-[15px] font-semibold">
            {days} day{days !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Travelers</span>
          <span className="text-[15px] font-semibold">{trip.travelerCount}</span>
        </div>
      </div>
    </div>
  );
}
