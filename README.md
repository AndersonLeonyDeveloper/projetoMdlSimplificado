# Lagoon Community Simplified

A small residential-community web app (React + Express) built as a **system under test** to practice a
QA automation workflow: user stories and acceptance criteria, Playwright E2E/API tests, CI/CD, defect
tracking and AI-assisted testing.

The app is intentionally small. The goal is the testing pipeline, not the product.

## About the application

Lagoon Community is a simplified management portal for a residential condominium. It connects the
administration with the residents in a single place and has two user profiles:

- **Admin**: publishes community notices and has a read-only view of every reservation in the condominium.
- **Resident**: reads the notices and books the shared common areas (Party Room and BBQ Area).

**Main features**

- **Authentication and access control.** Login with role-based routing: each profile lands on its own
  home page and cannot open the other profile's pages. An account is locked for 5 minutes after 3 failed
  login attempts.
- **Notice board.** Admins create, edit and delete notices (with a confirmation dialog). Residents browse
  them with search by title and pagination (10 per page).
- **Common-area reservations.** Residents pick an area, a date and a time slot (morning, afternoon or
  evening). The app rejects conflicting bookings, limits each resident to 2 active reservations, and only
  allows cancellation up to 24 hours before the slot starts.

**Tech stack.** React 19, TypeScript, Vite and React Router on the front end; Node.js and Express on the
back end, with an in-memory store (no database). The UI supports light and dark mode and is responsive.

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
cd app
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
cd app
npm run dev:server:bugs
```

## Project layout

```
app/
  server/   Express API (in-memory store)
  client/   React + Vite + TypeScript UI
docs/       Study plan, user stories and pending work
test/
  playwright/   Playwright E2E project (own package.json and config; sits next to app/)
```

Elements in the UI expose `data-testid` attributes for stable selectors.

## Running the Playwright tests

Requires the app to be running (see "Running locally") and Node.js 20+.

```bash
cd test/playwright
npm install
npx playwright install      # first time only: downloads the browsers
npx playwright test         # or: npm test / npm run test:headed
npx playwright show-report  # HTML report of the last run
```
