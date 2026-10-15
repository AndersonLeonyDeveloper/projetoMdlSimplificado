# Plano: mini-app para exercitar o fluxo de QA Automation (Playwright + CI + IA)

## Contexto
Vaga: QA Automation Engineer (Playwright & AI). Pede: suites E2E/regressão em produção com Playwright, CI/CD, uso de IA no fluxo de QA, bug lifecycle, Claude Code/Cursor.
O projeto `projetoMdl` (React+antd+Express, condomínio) é grande demais para treinar o fluxo de ponta a ponta com rapidez. Este repositório é um app **pequeno**, separado, cujo objetivo é o pipeline (fases 1–6), não a aplicação.

## App sob teste (SUT) — pequeno, ~1 dia
- Tema: **mini-condomínio** (domínio já conhecido; reaproveitar regras de `projetoMdl/regras-de-negocio/`). Backend Express + SQLite/in-memory, front React/Vite.
- 3 módulos apenas:
  1. **Login** com papéis admin/morador (sucesso, erro, bloqueio após N tentativas, permissão por papel).
  2. **Avisos**: admin faz CRUD; morador só lê e filtra (CRUD, validações, lista paginada).
  3. **Reserva de área comum** (salão/churrasqueira): conflito de horário, limite por morador, cancelamento, data passada (módulo mais rico em cenários de exceção).
- Meta: ~15–20 testes (E2E + API). Um erro de API simulável para `page.route`.
- `data-testid` desde o início; endpoints `POST /api/test/reset` e `POST /api/test/seed` para data setup.
- **Bugs plantados** (flag via env `BUGS=1`) para exercitar bug lifecycle e RCA.

## Fluxo mapeado às fases
1. **Planejamento**: 3–4 User Stories com ACs em `docs/stories/*.md`; usar Claude Code para extrair cenários → `docs/cenarios.md`.
2. **Ambiente**: branch `feature/test-*` por story, `.env.example`, `playwright.config.ts` com `baseURL` via env.
3. **Código**: Page Objects, fixtures Playwright, camada de API (`request` context) para setup, cenários feliz + exceção; um teste de API puro e um teste com `page.route` (mock).
4. **Validação local**: `--headed`, `--ui`, headless, `--repeat-each=10` para caçar flakiness; trace viewer.
5. **Git/PR**: Conventional Commits, PR template, branch protection exigindo CI verde, auto-revisão com `/code-review`.
6. **CI**: `.github/workflows/e2e.yml` — trigger em PR/push; `npm ci`, `npx playwright install --with-deps chromium`, sobe o app (`webServer` no config), roda headless, sharding opcional; upload de `playwright-report`, traces e vídeos como artefatos; publicar HTML no GitHub Pages; badge no README. Quality gate = job obrigatório.

## Estrutura Jira
```
Epic: Módulo (Login | Avisos | Reservas)
 └─ Story: "Como morador, quero reservar o salão…"
      ├─ AC1..ACn (checklist/campo na própria Story)
      ├─ Test Case (link "tests") ── TC-01, TC-02…
      ├─ Bug (link "found by" → o TC que falhou)
      └─ Sub-tasks: "Automatizar TC-01", "Revisar PR"
```
- **AC** não é ticket separado: fica na Story, numerado (AC1, AC2…).
- **Test Case** é um tipo de issue próprio (ou Xray/Zephyr), ligado à Story por link; não há "ticket pai dos TCs".
  - Campos: pré-condições, steps, esperado, severidade, tipo (funcional/regressão/negativo), camada (E2E/API), AC coberto, label `automated`.
  - Status: Draft → Ready → Automated → Deprecated. O resultado pass/fail vem do CI.
- **Bug**: repro steps, esperado/atual, ambiente, versão afetada, severidade ≠ prioridade, link para TC e Story.
  - Workflow: Open → In Analysis → In Fix → Ready for Retest → Closed (+ Rejected / Duplicate).
- **Ponte com Playwright**: ID Jira no título (`[MDL-12] ...`) ou annotation `jira`. O pipeline lê Stories/ACs/TCs via REST (JQL) ou MCP Atlassian; em falha de CI abre/atualiza o Bug com o RCA da IA.

## Camada de IA (diferencial para a vaga)
- Geração de cenários a partir de ACs (prompt versionado em `ai/prompts/`).
- **Agente de RCA**: script (Claude API ou Claude Code headless) que lê o JSON/trace de falha do CI e comenta no PR a causa provável. Disparado em `if: failure()`.
- Opcional: Playwright MCP / agents (planner-generator-healer) para gerar e consertar testes; documentar o que a IA acertou/errou.

## Entregáveis para o portfólio
README com diagrama do pipeline, link do report, GIF do trace, tabela de bugs achados (ID, severidade, status, lifecycle) e seção "Como usei IA".

## Ordem de execução sugerida
1. Scaffold SUT + seed/reset + flag de bugs (meio dia).
2. Playwright + Page Objects + 6–8 testes + testes de API.
3. CI GitHub Actions + artefatos + report.
4. Plantar bugs, deixar o CI falhar, abrir issues e fechar via PR (bug lifecycle).
5. Agente de RCA no CI.

## Verificação
- `npx playwright test` passa local (headed e headless) e com `--repeat-each=10` sem flaky.
- Com `BUGS=1`, os testes correspondentes falham e geram trace/vídeo.
- PR de teste mostra check verde/vermelho e artefatos baixáveis; report publicado.

## Decisões tomadas
- Stack do SUT: reaproveitar React + Express.
- Linguagem de teste: TypeScript (padrão da vaga).
