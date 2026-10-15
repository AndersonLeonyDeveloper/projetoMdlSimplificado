import { forbidden, unauthorized } from '../errors.js';
import { state } from '../store.js';

export function authenticate(req, _res, next) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;
  const userId = token ? state.sessions.get(token) : undefined;
  const user = state.users.find((candidate) => candidate.id === userId);

  if (!user) return next(unauthorized());

  req.token = token;
  req.user = user;
  next();
}

export const requireRole = (role) => (req, _res, next) =>
  req.user.role === role ? next() : next(forbidden());
