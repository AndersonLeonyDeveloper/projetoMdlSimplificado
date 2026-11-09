import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import type { TranslationKey } from '../i18n/en';
import { useI18n } from '../i18n/I18nProvider';
import { WaveIcon } from './icons';

interface NavItem {
  to: string;
  label: TranslationKey;
  testId: string;
}

export function Layout({ nav, children }: { nav: NavItem[]; children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

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
          {t('app.name')}
        </div>
        <nav className="nav">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end data-testid={item.testId}>
              {t(item.label)}
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
            {user?.name} ({user ? t(`role.${user.role}`) : ''})
          </span>
        </div>
        <button type="button" onClick={handleLogout} data-testid="logout-button">
          {t('nav.logout')}
        </button>
      </header>
      <main className="content">{children}</main>
    </div>
  );
}
