# Project: <NAME>
<PURPOSE>. Stack: <STACK>. Hosting: <HOSTING>.

## Commands
- Dev: `pnpm dev` | Build: `pnpm build`
- Test: `pnpm test` (single: `pnpm test <path>`)
- Typecheck: `pnpm typecheck` | Lint: `pnpm lint`
- All checks: `pnpm check`. Run before declaring any task done.
- E2E + accessibility: `pnpm test:e2e` | Lighthouse: `pnpm lighthouse` (CI runs check, build, E2E, audit, and a secret scan on every PR)

## Architecture
<Filled by /rafi:bootstrap-project from docs/stack-profile.md.>
- Details: @docs/architecture.md
- Deploy, rollback, backups, alerts: docs/runbook.md
- Stack-specific rules and audit checks: docs/stack-profile.md

## Conventions
- Coding rules live in `.claude/rules/`. Follow them.
- Validate all external input with a schema at the boundary.
- Env access only through the validated config module.
- Ask before adding a dependency.
- Never push to `main`. Work on a branch; `main` changes only through a merged PR with green CI.
- Commits follow Conventional Commits. A commit-msg hook enforces it.

## Workflow (commands come from the `rafi` plugin)
1. Specs live in `docs/prd/`, decisions in `docs/adr/`, idea discussions in `docs/discussions/`. `/rafi:discuss <topic>`: talk through a new idea or change against the current stack.
2. `/rafi:spec <feature>`: write the spec in `docs/prd/` (Claude asks, or I fill it). Then `/rafi:plan-feature <name>`: explore and plan. Wait for approval.
3. `/rafi:slice <name>`: implement one vertical slice with tests, checks, review, and audits. Schema changes: `/rafi:migration <change>`.
4. `/rafi:fix-issue <description>`: failing test first, then the fix.
   `/rafi:add-capability <concern>`: add icons, CMS, search, observability, rate limiting, and so on. Records the choice in `docs/stack-profile.md` and an ADR.
5. `/rafi:pr`: fill the PR body and CHANGELOG entry. CI must be green before merge.
6. `/rafi:release-check`: full gate before shipping.
7. `/rafi:retro`: end of session. Turn corrections into rules.
Anytime: `/rafi:status` (where am I, what next), `/rafi:deps` (review dependency updates), `/rafi:sync-template` (pull template updates).

## Audit triggers
| Change touches | Run |
|---|---|
| Auth, sessions, APIs, server actions, uploads, dependencies | `/rafi:security-audit diff` |
| Public pages, routes, metadata, URLs | `/rafi:seo-audit diff` |
| New queries, lists, pages, heavy dependencies | `/rafi:performance-audit diff` |
| UI components, forms, layout, color | `/rafi:accessibility-audit diff` |
| Database schema or existing data | `/rafi:migration <change>` |
| Any code, before commit | `/rafi:code-review` |
| Release or quarterly | `/rafi:release-check` |
Findings are logged in `docs/audits/`.

## Definition of done
- `pnpm check` passes and the build succeeds.
- Tests cover happy path, invalid input, unauthorized access, not-found, and boundaries. User-facing flows have an E2E test.
- Docs, `.env.example`, and `docs/runbook.md` are updated. User-facing changes have a `CHANGELOG.md` entry. Breaking changes are called out.
- Schema changes are safe while the previous version still runs, and have a rollback.
- Matching audits from the table above are clean or logged.

## Gotchas
- <Add non-obvious things that have burned you.>
