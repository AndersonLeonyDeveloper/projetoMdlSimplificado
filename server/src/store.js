// In-memory data store. Everything resets when the process restarts
// or when POST /api/test/reset is called.

const DEFAULT_USERS = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Alice Admin', role: 'admin' },
  { id: 2, username: 'resident1', password: 'resident123', name: 'Rita Resident', role: 'resident' },
  { id: 3, username: 'resident2', password: 'resident123', name: 'Ron Resident', role: 'resident' },
];

function createState() {
  return {
    users: DEFAULT_USERS.map((user) => ({ ...user })),
    sessions: new Map(), // token -> userId
    loginAttempts: new Map(), // username -> { failures, lockedUntil }
    notices: [],
    reservations: [],
    nextNoticeId: 1,
    nextReservationId: 1,
    clockOffsetMs: 0,
  };
}

export const state = createState();

export function resetState() {
  Object.assign(state, createState());
}

// Current time, optionally shifted by the test API so that time-based rules
// (lockout expiry, 24-hour cancellation window) can be exercised quickly.
export function now() {
  return new Date(Date.now() + state.clockOffsetMs);
}

export function advanceClock(ms) {
  state.clockOffsetMs += ms;
}

export function publicUser(user) {
  const { password: _password, ...rest } = user;
  return rest;
}
