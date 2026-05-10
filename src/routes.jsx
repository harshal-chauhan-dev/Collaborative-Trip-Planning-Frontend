import { Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login/index.jsx';
import Register from './pages/Register/index.jsx';
import TripsList from './pages/TripsList/index.jsx';
import TripCreate from './pages/TripCreate/index.jsx';
import TripLayout from './pages/TripLayout/index.jsx';
import TripOverview from './pages/TripOverview/index.jsx';
import TripItinerary from './pages/TripItinerary/index.jsx';
import TripChecklists from './pages/TripChecklists/index.jsx';
import TripAttachments from './pages/TripAttachments/index.jsx';
import TripReservations from './pages/TripReservations/index.jsx';
import TripBudget from './pages/TripBudget/index.jsx';
import TripMembers from './pages/TripMembers/index.jsx';
import InviteAccept from './pages/InviteAccept/index.jsx';

const routes = [
  { path: '/', element: <Navigate to="/trips" replace /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/invite', element: <InviteAccept /> },
  {
    path: '/trips',
    element: (
      <ProtectedRoute>
        <TripsList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/trips/new',
    element: (
      <ProtectedRoute>
        <TripCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: '/trips/:tripId',
    element: (
      <ProtectedRoute>
        <TripLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <TripOverview /> },
      { path: 'itinerary', element: <TripItinerary /> },
      { path: 'checklists', element: <TripChecklists /> },
      { path: 'attachments', element: <TripAttachments /> },
      { path: 'reservations', element: <TripReservations /> },
      { path: 'budget', element: <TripBudget /> },
      { path: 'members', element: <TripMembers /> },
    ],
  },
];

export default routes;
