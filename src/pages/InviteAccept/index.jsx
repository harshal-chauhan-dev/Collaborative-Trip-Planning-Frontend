import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { membersApi } from '../../api/members.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { btn } from '../../lib/ui.js';

export default function InviteAccept() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const token = params.get('token');
  const [status, setStatus] = useState('idle');
  const [tripId, setTripId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading || !token || !user) return;

    setStatus('loading');

    membersApi
      .acceptInvite(token)
      .then((res) => {
        setTripId(res.tripId);
        setStatus('success');
      })
      .catch((err) => {
        setError(err.message);
        setStatus('error');
      });
  }, [token, user, loading]);

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-10">
        <p>No invite token provided.</p>
        <Link to="/trips">Go to trips</Link>
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-10">
        <p className="text-base text-gray-500">Please sign in to accept this invite.</p>
        <Link to={`/login?redirect=/invite?token=${token}`} className={btn.primary}>
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-10">
      {status === 'idle' || status === 'loading' ? (
        <p className="text-base text-gray-500">Processing invite…</p>
      ) : status === 'success' ? (
        <div className="flex flex-col items-center gap-4 text-base font-medium">
          <p>You have joined the trip!</p>
          <button type="button" className={btn.primary} onClick={() => navigate(`/trips/${tripId}`)}>
            View trip
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-3 text-sm text-red-600">{error}</p>
          <Link to="/trips">Go to my trips</Link>
        </div>
      )}
    </div>
  );
}
