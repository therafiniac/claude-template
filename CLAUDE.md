# Project: <NAME>
<PURPOSE>. Stack: <STACK>. Hosting: <HOSTING>.

## Commands
- Dev: `pnpm dev` | Build: `pnpm build`
- Test: `pnpm test` (single: `pnpm test <path>`)
- Typecheck: `pnpm typecheck` | Lint: `pnpm lint`
- All checks: `pnpm check`. Run before declaring any task done.
- E2E + accessibility: `pnpm test:e2e` | Lighthouse: `pnpm lighthouse` (CI runs both)

## Architecture
<Filled by /rafi:bootstrap-project from docs/stack-profile.md.>
- Details: @docs/architecture.md
- Stack-specific rules and audit checks: docs/stack-profile.md

## Conventions
- Coding rules live in `.claude/rules/`. Follow them.
- Validate all external input with a schema at the boundary.
- Env access only through the validated config module.
- Ask before adding a dependency.
- Commits follow Conventional Commits. A commit-msg hook enforces it.

## Workflow (commands come from the `rafi` plugin)
1. Specs live in `docs/prd/`, decisions in `docs/adr/`.
2. `/rafi:plan-feature <name>`: explore and plan. Wait for approval.
3. `/rafi:slice <name>`: implement one vertical slice with tests, checks, review, and audits.
4. `/rafi:fix-issue <description>`: failing test first, then the fix.
5. `/rafi:release-check`: full gate before shipping.
6. `/rafi:retro`: end of session. Turn corrections into rules.

## Audit triggers
| Change touches | Run |
|---|---|
| Auth, sessions, APIs, server actions, uploads, dependencies | `/rafi:security-audit diff` |
| Public pages, routes, metadata, URLs | `/rafi:seo-audit diff` |
| New queries, lists, pages, heavy dependencies | `/rafi:performance-audit diff` |
| UI components, forms, layout, color | `/rafi:accessibility-audit diff` |
| Any code, before commit | `/rafi:code-review` |
| Release or quarterly | `/rafi:release-check` |
Findings are logged in `docs/audits/`.

## Definition of done
- `pnpm check` passes and the build succeeds.
- Tests cover happy path, invalid input, unauthorized access, not-found, and boundaries. User-facing flows have an E2E test.
- Docs and `.env.example` are updated. Breaking changes are called out.
- Matching audits from the table above are clean or logged.

## Gotchas
- <Add non-obvious things that have burned you.>
