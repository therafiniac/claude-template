# Runbook
How to deploy, roll back, and recover this project. Filled by `/rafi:bootstrap-project`; keep it current. `/rafi:release-check` fails while `<placeholders>` remain. Never write secret values here, only where they live.

## Service overview
| Part | Where it runs | URL or name |
|---|---|---|
| Web app | <host and service name> | <production URL> |
| Worker | <none, or host and service name> | |
| Database | <none, or provider and plan> | |
| File storage | <none, or provider and bucket> | |

## Deploy
- Trigger: <e.g. merging to `main` deploys automatically through the host's Git integration>
- Build command: <e.g. `pnpm build`>
- Pre-deploy step: <e.g. `pnpm db:migrate`, or none>
- Health check: <path, e.g. `/api/health`>, expected <200 and `{"status":"ok"}`>

## Roll back
1. <e.g. in the host's dashboard, redeploy the previous successful deployment>
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
