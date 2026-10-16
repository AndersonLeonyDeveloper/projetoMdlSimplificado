import { Link } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import { ArrowIcon, CalendarIcon, MegaphoneIcon } from '../components/icons';
import { Layout } from '../components/Layout';
import { residentNav } from '../navigation';

export function ResidentHome() {
  const { user } = useAuth();

  return (
    <Layout nav={residentNav}>
      <h1 data-testid="resident-home-title">Resident home</h1>
      <p className="lead">Welcome, {user?.name}.</p>
      <div className="grid">
        <Link className="card tile" to="/notices" data-testid="tile-notices">
          <span className="tile-icon">
            <MegaphoneIcon />
          </span>
          Community notices
          <span className="tile-desc">Stay up to date with the latest announcements.</span>
          <span className="tile-arrow">
            <ArrowIcon />
          </span>
        </Link>
        <Link className="card tile" to="/reservations" data-testid="tile-reservations">
          <span className="tile-icon">
            <CalendarIcon />
          </span>
          My reservations
          <span className="tile-desc">Book common areas and manage your bookings.</span>
          <span className="tile-arrow">
            <ArrowIcon />
          </span>
        </Link>
      </div>
    </Layout>
  );
}
