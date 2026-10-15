import { Router } from 'express';

import { badRequest, conflict, forbidden, notFound } from '../errors.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import {
  AREAS,
  CANCELLATION_WINDOW_HOURS,
  MAX_ACTIVE_RESERVATIONS,
  SLOTS,
  STATUS,
  formatDate,
  isValidArea,
  isValidDate,
  isValidSlot,
  slotStart,
} from '../reservations.rules.js';
import { now, state } from '../store.js';

const router = Router();

router.use(authenticate);

const isActive = (reservation) => reservation.status === STATUS.CONFIRMED;

const present = (reservation) => ({
  ...reservation,
  areaName: AREAS.find((area) => area.id === reservation.area).name,
  slotLabel: SLOTS.find((slot) => slot.id === reservation.slot).label,
  residentName: state.users.find((user) => user.id === reservation.userId)?.name,
});

router.get('/options', (_req, res) => {
  res.json({ areas: AREAS, slots: SLOTS });
});

// Which slots are already taken for an area on a given date.
router.get('/availability', (req, res, next) => {
  const { area, date } = req.query;
  if (!isValidArea(area)) return next(badRequest('A valid area is required'));
  if (!isValidDate(date)) return next(badRequest('A valid date (YYYY-MM-DD) is required'));

  const taken = state.reservations
    .filter((item) => isActive(item) && item.area === area && item.date === date)
    .map((item) => item.slot);

  res.json({ area, date, taken });
});

// Residents see their own reservations; admins see everyone's.
router.get('/', (req, res) => {
  const visible = state.reservations.filter(
    (item) => req.user.role === 'admin' || item.userId === req.user.id,
  );
  const sorted = [...visible].sort(
    (a, b) => slotStart(a.date, a.slot) - slotStart(b.date, b.slot) || a.id - b.id,
  );
  res.json({ items: sorted.map(present) });
});

router.post('/', requireRole('resident'), (req, res, next) => {
  const { area, date, slot } = req.body ?? {};

  if (!area || !date || !slot) {
    return next(badRequest('Area, date and time slot are required'));
  }
  if (!isValidArea(area)) return next(badRequest('Unknown area'));
  if (!isValidSlot(slot)) return next(badRequest('Unknown time slot'));
  if (!isValidDate(date)) return next(badRequest('Date must be a valid YYYY-MM-DD value'));

  if (date < formatDate(now())) {
    return next(badRequest('Reservations cannot be made for past dates', 'PAST_DATE'));
  }

  const taken = state.reservations.some(
    (item) => isActive(item) && item.area === area && item.date === date && item.slot === slot,
  );
  if (taken) {
    return next(conflict('This area is already booked for the selected time slot', 'RESERVATION_CONFLICT'));
  }

  const activeCount = state.reservations.filter(
    (item) => isActive(item) && item.userId === req.user.id,
  ).length;
  if (activeCount >= MAX_ACTIVE_RESERVATIONS) {
    return next(
      conflict(
        `You can have at most ${MAX_ACTIVE_RESERVATIONS} active reservations`,
        'RESERVATION_LIMIT_REACHED',
      ),
    );
  }

  const reservation = {
    id: state.nextReservationId++,
    userId: req.user.id,
    area,
    date,
    slot,
    status: STATUS.CONFIRMED,
    createdAt: now().toISOString(),
  };
  state.reservations.push(reservation);
  res.status(201).json(present(reservation));
});

// Cancels (does not delete) a reservation, keeping it in the history.
router.delete('/:id', requireRole('resident'), (req, res, next) => {
  const reservation = state.reservations.find((item) => item.id === Number(req.params.id));
  if (!reservation) return next(notFound('Reservation not found'));
  if (reservation.userId !== req.user.id) return next(forbidden());
  if (!isActive(reservation)) {
    return next(conflict('Reservation is already canceled', 'ALREADY_CANCELED'));
  }

  const hoursUntilStart = (slotStart(reservation.date, reservation.slot) - now()) / 3600000;
  if (hoursUntilStart < CANCELLATION_WINDOW_HOURS) {
    return next(
      conflict(
        `Reservations can only be canceled at least ${CANCELLATION_WINDOW_HOURS} hours in advance`,
        'CANCELLATION_WINDOW_CLOSED',
      ),
    );
  }

  reservation.status = STATUS.CANCELED;
  res.json(present(reservation));
});

export default router;
