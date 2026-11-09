// Domain constants and date helpers for common-area reservations.

export const AREAS = [
  { id: 'party-room', name: 'Party Room' },
  { id: 'bbq-area', name: 'BBQ Area' },
];

export const SLOTS = [
  { id: 'morning', label: 'Morning (08:00 - 12:00)', startHour: 8 },
  { id: 'afternoon', label: 'Afternoon (13:00 - 17:00)', startHour: 13 },
  { id: 'evening', label: 'Evening (18:00 - 22:00)', startHour: 18 },
];

export const MAX_ACTIVE_RESERVATIONS = 2;
export const CANCELLATION_WINDOW_HOURS = 24;

export const STATUS = { CONFIRMED: 'Confirmed', CANCELED: 'Canceled' };

export const isValidArea = (id) => AREAS.some((area) => area.id === id);
export const isValidSlot = (id) => SLOTS.some((slot) => slot.id === id);

export function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return false;
  const date = new Date(`${value}T00:00:00`);
  // Rejects impossible dates such as 2026-02-31, which JS would roll over.
  return !Number.isNaN(date.getTime()) && formatDate(date) === value;
}

// Local calendar date as YYYY-MM-DD.
export function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function slotStart(date, slotId) {
  const { startHour } = SLOTS.find((slot) => slot.id === slotId);
  return new Date(`${date}T${String(startHour).padStart(2, '0')}:00:00`);
}
