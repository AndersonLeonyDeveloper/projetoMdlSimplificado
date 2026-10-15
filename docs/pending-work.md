# Pending work (Trabalho pendente)

Status of the project against [`cronograma.md`](../cronograma.md).
(Situação do projeto em relação ao cronograma.)

## Done (Concluído)

- [x] User stories and acceptance criteria (`docs/stories.md`), also created in Jira.
- [x] API: auth with lockout, notices, reservations (all 10 stories).
- [x] UI: login, role-based routing, notices, reservations, with `data-testid` on key elements.
- [x] Test-support endpoints (`/api/test/reset`, `/seed`, `/advance-clock`).
- [x] Planted bugs behind the `BUGS` flag (`lockout`, `reservation-limit`, `cancel-window`).

## Not implemented yet (Ainda não implementado)

### Tests (deliberately left for later)
- [ ] Playwright setup: `playwright.config.ts` with `baseURL` from env, `webServer` for client and server, `.env.example`.
- [ ] TypeScript project for the tests (`test/playwright`), fixtures and Page Objects (Login, Notices, Reservations).
- [ ] API data setup layer (using `/api/test/reset`, `/seed`, `/advance-clock`).
- [ ] E2E scenarios per story (happy path + exceptions), titles prefixed with the Jira key, e.g. `[PROJMDL-4] ...`.
- [ ] API-level tests (e.g. 403 for resident writes on notices, S6 · AC4) and a `page.route` mock test.
- [ ] Local validation: headed, headless, `--repeat-each=10` for flakiness, trace viewer.
- [ ] Run the suite with `BUGS=1` and confirm S2·AC3, S9·AC3 and S10·AC2 fail.

### CI/CD
- [ ] GitHub Actions workflow `.github/workflows/e2e.yml` (install, browsers, run headless, artifacts).
- [ ] Upload `playwright-report`, traces and videos; optionally publish the HTML report.
- [ ] Branch protection requiring the E2E job (quality gate), README badge.

### Jira and process
- [ ] Create the Test Case issue type and the "tests / is tested by" link; fields from the plan.
- [ ] Create Test Cases linked to each Story (one per AC, at least).
- [ ] Bug workflow (Open, In Analysis, In Fix, Ready for Retest, Closed, Rejected, Duplicate) and bug fields.
- [ ] PR template and Conventional Commits convention for test branches (`feature/test-*`).

### AI layer
- [ ] Prompts versioned in `ai/prompts/` for scenario generation from ACs.
- [ ] Jira integration (REST/JQL or Atlassian MCP) to read Stories, ACs and Test Cases.
- [ ] RCA agent that reads the failure report in CI and comments on the PR / Jira bug.
- [ ] Optional: Playwright MCP / planner-generator-healer agents.

### Portfolio polish
- [ ] README: pipeline diagram, report link, trace GIF, table of bugs found, "How I used AI" section.

## Known limitations of the current app (Limitações conhecidas)

- The client was only type-checked and built (`tsc` + `vite build`); it has not been exercised in a browser yet.
  Run both dev servers and click through each story before writing tests.
- Data is in memory only; restarting the server clears everything.
- Passwords are stored in plain text and sessions are random tokens in memory. Acceptable for a test sandbox, not for real use.
- Admins cannot book or cancel reservations; the cancellation endpoint is owner-only.
