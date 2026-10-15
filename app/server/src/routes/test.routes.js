import { Router } from 'express';

import { badRequest } from '../errors.js';
import { formatDate, isValidArea, isValidSlot } from '../reservations.rules.js';
import { advanceClock, now, resetState, state } from '../store.js';

// Helpers for automated tests: data setup and time travel.
// Only mounted when config.testApiEnabled is true.
const router = Router();

router.post('/reset', (_req, res) => {
  resetState();
  res.status(204).end();
});

router.post('/seed', (req, res, next) => {
  const { notices = 0, reservations = [] } = req.body ?? {};

  if (!Number.isInteger(notices) || notices < 0 || notices > 200) {
    return next(badRequest('notices must be an integer between 0 and 200'));
  }

  // Oldest first, so the highest number is the most recent notice.
  const base = Date.now() - notices * 60000;
  for (let i = 1; i <= notices; i += 1) {
    state.notices.push({
      id: state.nextNoticeId++,
      title: `Seeded notice ${i}`,
      body: `Body of seeded notice ${i}`,
      createdAt: new Date(base + i * 60000).toISOString(),
      updatedAt: null,
    });
  }

  // Reservations are inserted directly, bypassing business rules, so tests can
  // build states that the API would refuse (e.g. a booking starting in 2 hours).
  // Each item: { username, area, slot, date | daysFromNow, status? }
  for (const item of reservations) {
    const user = state.users.find((candidate) => candidate.username === item.username);
    const date =
      item.date ?? formatDate(new Date(now().getTime() + (item.daysFromNow ?? 0) * 86400000));

    if (!user || !isValidArea(item.area) || !isValidSlot(item.slot)) {
      return next(badRequest('Each reservation needs a valid username, area and slot'));
    }

    state.reservations.push({
      id: state.nextReservationId++,
      userId: user.id,
      area: item.area,
      date,
      slot: item.slot,
      status: item.status ?? 'Confirmed',
      createdAt: now().toISOString(),
    });
  }

  res.status(201).json({
    notices: state.notices.length,
    reservations: state.reservations.length,
  });
});

router.post('/advance-clock', (req, res, next) => {
  const { minutes } = req.body ?? {};

  if (!Number.isFinite(minutes) || minutes <= 0) {
    return next(badRequest('minutes must be a positive number'));
  }

  advanceClock(minutes * 60000);
  res.json({ offsetMinutes: state.clockOffsetMs / 60000 });
});

export default router;
