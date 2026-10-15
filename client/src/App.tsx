import { Navigate, Route, Routes } from 'react-router-dom';

import { RequireRole } from './auth/RequireRole';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
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
