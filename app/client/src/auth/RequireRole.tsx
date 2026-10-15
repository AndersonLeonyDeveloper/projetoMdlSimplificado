import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import type { Role } from '../types';
import { homePathFor, useAuth } from './AuthContext';

export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <p data-testid="loading">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={homePathFor(user)} replace />;

  return <>{children}</>;
}
