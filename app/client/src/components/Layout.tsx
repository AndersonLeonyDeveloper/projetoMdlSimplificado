import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';

interface NavItem {
  to: string;
  label: string;
  testId: string;
}

export function Layout({ nav, children }: { nav: NavItem[]; children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    // Replace the history entry so "back" does not return to a protected page.
    navigate('/login', { replace: true });
  }

  return (
    <div className="layout">
      <header className="header">
        <strong>Lagoon Community</strong>
        <nav className="nav">
          {nav.map((item) => (
            <Link key={item.to} to={item.to} data-testid={item.testId}>
              {item.label}
            </Link>
          ))}
        </nav>
        <span className="spacer" />
        <span data-testid="current-user">
          {user?.name} ({user?.role})
        </span>
        <button type="button" onClick={handleLogout} data-testid="logout-button">
          Log out
        </button>
      </header>
      <main className="content">{children}</main>
    </div>
  );
}
