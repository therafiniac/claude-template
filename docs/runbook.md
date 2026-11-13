# Runbook
How to deploy, roll back, and recover this project. Filled by `/rafi:bootstrap-project`; keep it current. `/rafi:release-check` fails while `<placeholders>` remain. Never write secret values here, only where they live.

## Environments
| Part | Production (`main`) | Staging (`dev`) |
|---|---|---|
| Web app | <host, service, URL> | <host, service, URL> |
| Worker | <none, or service> | <none, or service> |
| Database | <none, or provider and plan> | <separate instance> |
| File storage | <none, or bucket> | <separate bucket> |
Staging has its own env vars, database, and third-party test keys. It never holds production data or keys.

## Deploy
- Trigger: a push to `main` deploys production; a push to `dev` deploys staging (the host's Git integration).
- Build command: <e.g. `pnpm build`>
- Pre-deploy step: <e.g. `pnpm db:migrate`, or none>
- Health check: <path, e.g. `/api/health`>, expected <200 and `{"status":"ok"}`>

## Release
1. `/rafi:release-check` on `dev`, and try the main flows on staging.
2. `/rafi:release` (or `/rafi:release <x.y.z> branch` for a release branch): version, changelog, `dev` → `main` with `--no-ff`, tag `vX.Y.Z`.
3. Watch the production deploy and the health check.
Production emergency: `/rafi:hotfix <name>` (from `main`, merged back into `dev`).

## Roll back
1. Fastest: in the host's dashboard, redeploy the previous successful deployment. Durable: `git revert -m 1 <merge commit>` on a `hotfix/` branch and release it as a patch.
2. If the bad release ran a migration: follow its rollback in the Pending migrations section or its ADR. Never roll the app back past a contract (drop) phase.
3. Confirm the health check and the main flow, then note the incident below.

## Environment variables and secrets
Names and purpose are in `.env.example` and `docs/architecture.md`. Values live in: <host's env settings, and CI secrets if any>.
Rotate a secret: create the new value at the provider → set it in the host → redeploy → revoke the old value → note the date here.

## Backups and restore
- What is backed up: <database, file storage, or "nothing stateful">
- How and how often: <provider's automatic backups, retention>
- Restore steps: <exact steps>
- Last restore test: <date, or "never" until tested>

## Monitoring and alerts
- Errors: <e.g. Sentry project link>
- Logs: <where the host shows them>
- Uptime: <monitor service, what it checks, who gets the alert>

## Pending migrations
Phases of breaking schema changes not yet finished (`/rafi:migration` adds and removes entries).
- none

## Contacts
- Owner: <name and how to reach them>
- Hosting, domain, and third-party accounts: <who holds the logins>

## Incident log
| Date | What happened | Impact | Fix | Follow-up |
|---|---|---|---|---|
