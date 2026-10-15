import { Router } from 'express';

import { badRequest } from '../errors.js';
import { advanceClock, resetState, state } from '../store.js';

// Helpers for automated tests: data setup and time travel.
// Only mounted when config.testApiEnabled is true.
const router = Router();

router.post('/reset', (_req, res) => {
  resetState();
  res.status(204).end();
});

router.post('/seed', (req, res, next) => {
  const { notices = 0 } = req.body ?? {};

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

  res.status(201).json({ notices: state.notices.length });
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
