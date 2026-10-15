# Lagoon Community Simplified

A small residential-community web app (React + Express) built as a **system under test** to practice a
QA automation workflow: user stories and acceptance criteria, Playwright E2E/API tests, CI/CD, defect
tracking and AI-assisted testing.

The app is intentionally small. The goal is the testing pipeline, not the product.

## Modules

| Epic | Description |
| --- | --- |
| Login | Admin and Resident roles, account lockout, role-based access |
| Notices | Admins publish/edit/delete notices; residents read, paginate and filter |
| Reservations | Residents book the Party Room or BBQ Area, with conflict, limit and cancellation rules |

The user stories and acceptance criteria are in [`docs/stories.md`](docs/stories.md).

## Running locally

Requires Node.js 20+.

```bash
npm run install:all
npm run dev:server   # API on http://localhost:3001
npm run dev:client   # UI on http://localhost:5173 (proxies /api to the server)
```

The data lives in memory and resets whenever the server restarts.

### Demo users

| Username | Password | Role |
| --- | --- | --- |
| `admin` | `admin123` | Admin |
| `resident1` | `resident123` | Resident |
| `resident2` | `resident123` | Resident |

## Test-support API

Available unless `NODE_ENV=production`. Meant for automated test data setup.

| Endpoint | Purpose |
| --- | --- |
| `POST /api/test/reset` | Restores the initial state (users only, no notices or reservations) |
| `POST /api/test/seed` | Body `{ "notices": 12, "reservations": [{ "username": "resident1", "area": "bbq-area", "slot": "morning", "daysFromNow": 3 }] }`. Reservations bypass business rules |
| `POST /api/test/advance-clock` | Body `{ "minutes": 6 }`. Moves the server clock forward (lockout expiry, 24-hour cancellation rule) |

## Planted bugs

Start the server with `BUGS=1` (or a comma-separated subset) to enable intentional defects. `GET /api/health`
lists the active ones.

| Flag | Defect | Related criteria |
| --- | --- | --- |
| `lockout` | Account is locked after the 4th failed attempt instead of the 3rd | S2 · AC3 |
| `reservation-limit` | A third active reservation is accepted | S9 · AC3 |
| `cancel-window` | Reservations can be canceled less than 24 hours in advance | S10 · AC2 |

```bash
npm run dev:server:bugs
```

## Project layout

```
server/   Express API (in-memory store)
client/   React + Vite + TypeScript UI
docs/     User stories and pending work
```

Elements in the UI expose `data-testid` attributes for stable selectors.
