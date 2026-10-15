const KNOWN_BUGS = ['lockout', 'reservation-limit', 'cancel-window'];

function parseBugs(value) {
  if (!value) return new Set();
  if (value === '1' || value === 'all') return new Set(KNOWN_BUGS);
  return new Set(value.split(',').map((name) => name.trim()).filter(Boolean));
}

export const config = {
  port: Number(process.env.PORT) || 3001,
  // Test-only endpoints (reset, seed, clock) are disabled in production.
  testApiEnabled: process.env.NODE_ENV !== 'production',
  // Intentionally planted defects, used to practice the bug lifecycle.
  // BUGS=1 enables all of them; BUGS=lockout,cancel-window enables a subset.
  bugs: parseBugs(process.env.BUGS),
};

export const hasBug = (name) => config.bugs.has(name);
