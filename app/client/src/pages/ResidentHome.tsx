import { Link } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import { Layout } from '../components/Layout';
import { residentNav } from '../navigation';

export function ResidentHome() {
  const { user } = useAuth();

  return (
    <Layout nav={residentNav}>
      <h1 data-testid="resident-home-title">Resident home</h1>
      <p>Welcome, {user?.name}.</p>
      <div className="grid">
        <Link className="card tile" to="/notices" data-testid="tile-notices">
          Community notices
        </Link>
        <Link className="card tile" to="/reservations" data-testid="tile-reservations">
          My reservations
        </Link>
      </div>
    </Layout>
  );
}
