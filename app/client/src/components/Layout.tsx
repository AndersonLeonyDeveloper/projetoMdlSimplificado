import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import { WaveIcon } from './icons';

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
        <div className="brand">
          <span className="brand-mark">
            <WaveIcon />
          </span>
          Lagoon Community
        </div>
        <nav className="nav">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end data-testid={item.testId}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <span className="spacer" />
        <div className="user">
          <span className="avatar" aria-hidden="true">
            {user?.name
              .split(' ')
              .map((part) => part[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </span>
          <span data-testid="current-user">
            {user?.name} ({user?.role})
          </span>
        </div>
        <button type="button" onClick={handleLogout} data-testid="logout-button">
          Log out
        </button>
      </header>
      <main className="content">{children}</main>
    </div>
  );
}
