## What and why
<!-- One or two sentences. Link the PRD or issue. Base branch: dev (main only for release/ and hotfix/ branches). -->

## Checklist
- [ ] Branch is up to date with its base, `pnpm check` and `pnpm build` pass locally, and CI is green
- [ ] Commits follow `type(scope): subject` with no attribution lines
- [ ] Tests cover happy path, invalid input, unauthorized, not-found, boundaries
- [ ] User-facing flow has an E2E test
- [ ] Docs, `.env.example`, and `docs/runbook.md` updated. Breaking changes called out below
- [ ] `CHANGELOG.md` has an entry under Unreleased (user-facing changes only)
- [ ] Schema changes follow `/rafi:migration`: safe while the old version still runs, with a rollback
- [ ] Audits run for what this touches (security / SEO / performance / accessibility). Findings fixed or logged in `docs/audits/`

## How to test
<!-- Manual steps a reviewer can follow. -->

## Breaking changes
<!-- API contracts, schema, env vars. Write "none" if none. -->
