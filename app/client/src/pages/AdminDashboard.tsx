import { Link } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import { ArrowIcon, CalendarIcon, MegaphoneIcon } from '../components/icons';
import { Layout } from '../components/Layout';
import { adminNav } from '../navigation';

export function AdminDashboard() {
  const { user } = useAuth();

  return (
    <Layout nav={adminNav}>
      <h1 data-testid="admin-dashboard-title">Admin dashboard</h1>
      <p className="lead">Welcome, {user?.name}.</p>
      <div className="grid">
        <Link className="card tile" to="/admin/notices" data-testid="tile-manage-notices">
          <span className="tile-icon">
            <MegaphoneIcon />
          </span>
          Manage notices
          <span className="tile-desc">Publish, edit and remove community announcements.</span>
          <span className="tile-arrow">
            <ArrowIcon />
          </span>
        </Link>
        <Link className="card tile" to="/admin/reservations" data-testid="tile-all-reservations">
          <span className="tile-icon">
            <CalendarIcon />
          </span>
          View all reservations
          <span className="tile-desc">See every common-area booking across the community.</span>
          <span className="tile-arrow">
            <ArrowIcon />
          </span>
        </Link>
      </div>
    </Layout>
  );
}
