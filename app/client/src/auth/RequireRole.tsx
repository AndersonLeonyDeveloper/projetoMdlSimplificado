import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useI18n } from '../i18n/I18nProvider';
import type { Role } from '../types';
import { homePathFor, useAuth } from './AuthContext';

export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user, loading } = useAuth();
  const { t } = useI18n();

  if (loading) return <p data-testid="loading">{t('common.loading')}</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={homePathFor(user)} replace />;

  return <>{children}</>;
}
