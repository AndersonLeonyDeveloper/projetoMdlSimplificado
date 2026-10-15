import { randomUUID } from 'node:crypto';
import { Router } from 'express';

import { badRequest, locked, unauthorized } from '../errors.js';
import { authenticate } from '../middleware/auth.js';
import { now, publicUser, state } from '../store.js';

export const MAX_FAILED_ATTEMPTS = 3;
export const LOCKOUT_MINUTES = 5;

const INVALID_CREDENTIALS = 'Invalid username or password';

const router = Router();

function getAttempts(username) {
  if (!state.loginAttempts.has(username)) {
    state.loginAttempts.set(username, { failures: 0, lockedUntil: null });
  }
  return state.loginAttempts.get(username);
}

router.post('/login', (req, res, next) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return next(badRequest('Username and password are required'));
  }

  const user = state.users.find((candidate) => candidate.username === username);
  // Unknown users get the same response as a wrong password.
  if (!user) return next(unauthorized(INVALID_CREDENTIALS));

  const attempts = getAttempts(username);

  if (attempts.lockedUntil) {
    if (attempts.lockedUntil > now()) {
      const minutes = Math.ceil((attempts.lockedUntil - now()) / 60000);
      return next(locked(`Account locked. Try again in ${minutes} minute(s).`));
    }
    attempts.failures = 0;
    attempts.lockedUntil = null;
  }

  if (user.password !== password) {
    attempts.failures += 1;
    if (attempts.failures >= MAX_FAILED_ATTEMPTS) {
      attempts.lockedUntil = new Date(now().getTime() + LOCKOUT_MINUTES * 60000);
    }
    return next(unauthorized(INVALID_CREDENTIALS));
  }

  attempts.failures = 0;
  const token = randomUUID();
  state.sessions.set(token, user.id);
  res.json({ token, user: publicUser(user) });
});

router.get('/me', authenticate, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.post('/logout', authenticate, (req, res) => {
  state.sessions.delete(req.token);
  res.status(204).end();
});

export default router;
