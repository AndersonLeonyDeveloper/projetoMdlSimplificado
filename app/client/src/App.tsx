import { Navigate, Route, Routes } from 'react-router-dom';

import { RequireRole } from './auth/RequireRole';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { NoticesPage } from './pages/NoticesPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { ResidentHome } from './pages/ResidentHome';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <RequireRole role="admin">
            <AdminDashboard />
          </RequireRole>
        }
      />

      <Route
        path="/admin/notices"
        element={
          <RequireRole role="admin">
            <NoticesPage canManage />
          </RequireRole>
        }
      />

      <Route
        path="/notices"
        element={
          <RequireRole role="resident">
            <NoticesPage canManage={false} />
          </RequireRole>
        }
      />

      <Route
        path="/admin/reservations"
        element={
          <RequireRole role="admin">
            <ReservationsPage isAdmin />
          </RequireRole>
        }
      />

      <Route
        path="/reservations"
        element={
          <RequireRole role="resident">
            <ReservationsPage isAdmin={false} />
          </RequireRole>
        }
      />

      <Route
        path="/home"
        element={
          <RequireRole role="resident">
            <ResidentHome />
          </RequireRole>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
