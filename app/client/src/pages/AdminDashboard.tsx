import { Link } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import { Layout } from '../components/Layout';
import { adminNav } from '../navigation';

export function AdminDashboard() {
  const { user } = useAuth();

  return (
    <Layout nav={adminNav}>
      <h1 data-testid="admin-dashboard-title">Admin dashboard</h1>
      <p>Welcome, {user?.name}.</p>
      <div className="grid">
        <Link className="card tile" to="/admin/notices" data-testid="tile-manage-notices">
          Manage notices
        </Link>
        <Link className="card tile" to="/admin/reservations" data-testid="tile-all-reservations">
          View all reservations
        </Link>
      </div>
    </Layout>
  );
}
