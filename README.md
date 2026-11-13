# claude-template

The starting folder for every new project. Copy it, open it in Claude Code, and build with the `/rafi:` commands from the [claude-plugins](https://github.com/therafiniac/claude-plugins) plugin. It brings the project rules, guard rails, git hooks, CI, and docs structure; the plugin brings the commands, audits, and stack catalog.

- **This README** is the user guide: setup, a first project, the git workflow, daily use.
- The **claude-plugins README** is the reference for every command, the catalog, the audits, and the hooks.

`/rafi:bootstrap-project` replaces this README with the project's own.

## Contents
1. [What you get](#1-what-you-get)
2. [Prerequisites](#2-prerequisites)
3. [One-time setup](#3-one-time-setup)
4. [Start a project](#4-start-a-project)
5. [Git workflow](#5-git-workflow)
6. [Build a feature](#6-build-a-feature)
7. [Release and hotfix](#7-release-and-hotfix)
8. [Other tasks](#8-other-tasks)
9. [Cheat sheet](#9-cheat-sheet)
10. [Safety nets](#10-safety-nets)
11. [Scripts and non-Node stacks](#11-scripts-and-non-node-stacks)
12. [Files](#12-files)
13. [Existing repos and template updates](#13-existing-repos-and-template-updates)
14. [Troubleshooting](#14-troubleshooting)
15. [FAQ](#15-faq)
16. [Known caveats](#16-known-caveats)

---

## 1. What you get

| Part | Files | Effect |
|---|---|---|
| Project memory | `CLAUDE.md`, `.claude/rules/` (code standards, testing, git) | Claude follows your conventions every session |
| Guard rails | `.claude/settings.json` | Blocks reading secrets, destructive commands; pre-approves safe ones; turns off commit and PR attribution |
| Git hooks | `.husky/`, `commitlint.config.cjs`, `.lintstagedrc.json` | Before each commit: no direct commits on `main`/`dev`, secret scan, lint and format, `type(scope): subject` message with no attribution |
| CI | `.github/workflows/ci.yml` | On every PR and on pushes to `dev` and `main`: check, build, E2E, `pnpm audit`, full-history secret scan |
| Updates | `.github/dependabot.yml` | Weekly package and action updates, targeting `dev` |
| Docs | `docs/prd/`, `docs/adr/`, `docs/architecture.md`, `docs/runbook.md`, `SECURITY.md`, `CHANGELOG.md` | Specs, decisions, architecture, operations, security contact, release notes |

The plugin adds the `/rafi:` commands, the guard hook, auto-formatting, and a type check after every reply.

## 2. Prerequisites

Accounts: GitHub, and Claude Code installed and logged in.

```bash
# Fedora
sudo dnf install git nodejs jq gitleaks
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Ubuntu / Debian (gitleaks: see below)
sudo apt install git nodejs jq
curl -fsSL https://get.pnpm.io/install.sh | sh -

# macOS
brew install git node jq gitleaks pnpm
```
Open a new terminal after installing pnpm (or `sudo npm install -g pnpm` if the script fails).

gitleaks without a package: download the `linux_x64` `.tar.gz` from the gitleaks GitHub Releases page, then `tar -xzf gitleaks_*_linux_x64.tar.gz && sudo mv gitleaks /usr/local/bin/`.

Verify:
```bash
git --version && node --version && pnpm --version && jq --version && gitleaks version && claude --version
```

| Tool | Used for |
|---|---|
| `git` | History, branches, hooks |
| `node`, `pnpm` | Running the project; each project pins versions in `.nvmrc` and `packageManager` |
| `jq` | The plugin's hooks |
| `gitleaks` | The pre-commit secret scan (CI downloads its own) |
| `gh` (optional) | Lets `/rafi:pr`, `/rafi:merge`, `/rafi:release` create PRs and GitHub Releases for you |

## 3. One-time setup

1. **GitHub SSH key**
   ```bash
   ssh-keygen -t ed25519 -C "<your email>"
   cat ~/.ssh/id_ed25519.pub        # add it on GitHub: Settings → SSH and GPG keys
   ssh -T git@github.com            # "Hi <username>! You've successfully authenticated"
   ```
2. **Git identity** (commits are authored by you, never by a tool):
   ```bash
   git config --global user.name "<your name>"
   git config --global user.email "<your GitHub email>"
   ```
3. **Personal defaults** (optional, from the `global-claude` folder of this setup): `./global-claude/install.sh` copies `CLAUDE.md` and `settings.json` into `~/.claude/`, backing up existing files. Check with `/memory` in Claude Code.
4. **Plugin**
   ```bash
   claude plugin marketplace add therafiniac/claude-plugins
   claude plugin install rafi@rafi-tools
   ```
   Restart Claude Code and type `/rafi:` to see the commands.

## 4. Start a project

### 4.1 Copy the template
```bash
mkdir -p ~/projects && cd ~/projects
git clone git@github.com:therafiniac/claude-template.git my-site
cd my-site
git rev-parse HEAD > .claude/template-version     # used later by /rafi:sync-template
rm -rf .git
git init -b main
```

### 4.2 Open Claude Code and check the guard rails
```bash
claude
```
Trust the folder; accept the plugin install if offered. Then type `/rafi:` (the commands appear) and `read the .env file` (Claude must refuse).

### 4.3 Shape the idea (skip if you know the stack)
```
/rafi:brainstorm booking site for a yoga studio
```
Answer the questions, pick an approach, confirm the stack table. Writes `docs/brainstorm.md`. No code.

### 4.4 Bootstrap
```
/rafi:bootstrap-project booking site for a yoga studio
```
1. Answers only what the brainstorm left out, including **merge mode**: `local` (Claude merges on your machine) or `github` (pull requests, you merge on GitHub).
2. Confirm the capabilities table.
3. Read and approve the scaffold plan. Nothing is written before approval.
4. Claude scaffolds, writes the stack profile and docs, installs, enables hooks, runs `pnpm check` and `pnpm build`, tests commitlint.
5. It commits `chore(scaffold): initial project` on `main` and creates `dev`.

Then check it yourself: `pnpm check && pnpm dev`, and open the printed URL.

### 4.5 Publish and configure GitHub
1. Create an empty **private** repo at github.com/new (no README, .gitignore, or license).
2. Push both branches (or ask Claude):
   ```bash
   git remote add origin git@github.com:<you>/my-site.git
   git push -u origin main
   git push -u origin dev
   ```
3. **Actions** tab: CI must be green on both branches.
4. **Settings → General**: default branch `dev`. In `github` merge mode, under Pull Requests allow only **merge commits** (untick squash and rebase) and tick **Automatically delete head branches**.
5. **Settings → Rules → Rulesets** for `main` and `dev`: require the `check` and `secret scan` status checks, block force pushes and deletion; in `github` mode also require a pull request. Free on public repos; private repos need GitHub Pro. Without it, the guard hook and git hooks still enforce the rules locally.
6. **Hosting**: production deploys from `main`, staging from `dev`. Each gets its own env vars, database, and third-party keys. Set the health check path and, with a database, the pre-deploy migrate command.
7. Fill the `<placeholders>` bootstrap listed in `docs/runbook.md` and `SECURITY.md`.

CI needs no secrets and fits GitHub's free Actions minutes for a small private project.

## 5. Git workflow

Full rules: `.claude/rules/git.md`.

```
main ──●────────────────────●──────────────●───   production, tagged vX.Y.Z
        \                  / \            /
dev      ●──●─────●──────●───●──────●────●─────   integration, deploys to staging
             \   / \    /            \  /
feat/a        ●─●   \  /    hotfix/x  ●●
fix/b                ●●
```

| Branch | From | Merges into | Purpose |
|---|---|---|---|
| `main` | none | none | Production. Only `--no-ff` merges, each tagged |
| `dev` | `main`, once | `main` at release (`--no-ff`) | Integration, staging |
| `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`, `test/`, `perf/`, `ci/` | `dev` | `dev` (`--no-ff`) | One change each |
| `release/x.y.z` (optional) | `dev` | `main`, then back into `dev` | Stabilize a release while `dev` moves on |
| `hotfix/<name>` | `main` | `main` (patch tag), then `dev` | Urgent production fix |

**Rules**
- Never commit directly on `main` or `dev`; never force-push them.
- Update a work branch with `dev` before merging; checks, review, and audits must pass.
- Delete branches after merging.
- Versions follow Semantic Versioning from commit types: `BREAKING CHANGE` → major, `feat` → minor, otherwise patch.

**Commits**: `type(scope): subject`
| Part | Rule | Example |
|---|---|---|
| type | `feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`, `style`, `revert` | `feat` |
| scope | required, lowercase kebab-case, the area changed | `auth` |
| subject | imperative, lowercase start, no period; header ≤ 72 chars | `add password reset` |
| body | optional: why, wrapped at 72 | |
| footer | `BREAKING CHANGE: ...`, `Refs: #12` | |

No `Co-authored-by`, tool names, or "generated with" lines. commitlint and the commit-msg hook reject them; `.claude/settings.json` turns off Claude's own attribution.

**Merge mode** (the `Merge mode:` line in `CLAUDE.md`, changeable any time):
| | `local` | `github` |
|---|---|---|
| Work branch → `dev` | Claude runs `git merge --no-ff` and pushes `dev` | Claude pushes and opens a PR into `dev`; you merge with **Create a merge commit** |
| `dev` → `main` | Claude merges and tags after your explicit yes | Claude opens the PR; you merge; `/rafi:release finish` tags |

Who pushes what: Claude pushes work branches and `dev`. `main` and tags only inside `/rafi:release` and `/rafi:hotfix`, after you say yes.

## 6. Build a feature

```
/rafi:branch feat lesson tags            # feat/lesson-tags from an up-to-date dev
/rafi:spec lesson tags                   # docs/prd/lesson-tags.md, committed
/clear
/rafi:plan-feature lesson tags           # slices, files, tests, audits; approve it
/clear
/rafi:slice tag field and helper         # code + tests + check + review + audits, committed and pushed
/clear
/rafi:slice tag pages and links          # repeat for every slice
/rafi:merge                              # update with dev, gate, --no-ff into dev (or PR)
```

| Step | What you do |
|---|---|
| spec | Choose **A** (Claude asks plain questions) or **B** (you fill, Claude reviews). Confirm or remove every **(proposed)** criterion. Each criterion is a `Given / When / Then` you could check by clicking |
| plan | Read it. Approve or change it. No code before approval |
| slice | Read the diff of each commit (`git show`). Each slice is one commit `type(scope): subject` |
| merge | Confirm the gate passed. In `github` mode, merge the PR once CI is green |

Every command ends with a `Next:` suggestion. Claude never runs it.

## 7. Release and hotfix

### Release
```
/rafi:release-check                      # on dev: checks, audits, operational readiness → ship or hold
/rafi:release                            # version from commits, you confirm
/rafi:release 2.0.0 branch               # or: explicit version, with a release/2.0.0 branch
/rafi:release finish                     # completes a release branch, or tags after a GitHub merge
```
Without a release branch: version and changelog go on `chore/release-x.y.z`, merged into `dev`, then `dev` → `main` `--no-ff`, tag `vX.Y.Z`, push after your yes, GitHub Release if `gh` is installed.
With a release branch: only release fixes land on `release/x.y.z`; `finish` merges it into `main`, tags, and merges it back into `dev`.

Before you say yes, do the manual checks release-check lists: env vars in hosting, keyboard and screen-reader pass, search console, a tested restore, the uptime alert, the rollback steps in `docs/runbook.md`.

### Hotfix
```
/rafi:hotfix login-crash                 # hotfix/login-crash from main, test-first fix, patch version
```
After your yes: `--no-ff` into `main`, patch tag, push, then `--no-ff` back into `dev`. In `github` mode it opens the PR and `/rafi:hotfix finish` tags after you merge.

### Roll back
Fastest: redeploy the previous deployment in the host's dashboard. Durable: revert the merge commit (`git revert -m 1 <merge>`) on a hotfix branch and release a patch. Never roll back past a migration's contract phase. Details in `docs/runbook.md`.

## 8. Other tasks

| Situation | Command | Result |
|---|---|---|
| A bug | `/rafi:fix-issue <description>` | Failing test, root cause, minimal fix, commit on `fix/<name>` |
| A new idea in an existing project | `/rafi:discuss <topic>` | 2–3 approaches for the current stack, saved to `docs/discussions/` |
| Add a library (search, CMS, payments, observability, rate limiting, file storage, background jobs, …) | `/rafi:add-capability <concern>` | Proposal, plan, build, stack profile + ADR |
| A library not in the catalog | `/rafi:add-capability <concern> <library>` | Draft entry in `docs/stack-drafts/` |
| A framework or database not in the catalog | `/rafi:add-stack <name>` | Draft profile in `docs/stack-drafts/` |
| Change the schema or existing data | `/rafi:migration <change>` | Expand → backfill → switch → contract, phase by phase, each with rollback |
| Commit work outside a command | `/rafi:commit` | Checked, scoped commit on a work branch, pushed |
| Where am I? | `/rafi:status` | Stage, branch, progress, open findings, one next step |
| Dependency updates | `/rafi:deps` | Release-notes review and checks per update; approved ones merged into `dev` |
| Template improvements | `/rafi:sync-template` | Three-way update of template-owned files |
| A client scope or progress report | `/rafi:scope` | `docs/scope/client-scope.md` and `work-scope.md` |
| After a rough session | `/rafi:retro` | Up to seven proposed rules, applied on approval |
| Review your own changes | `/rafi:code-review` | Blocker / Major / Minor / Nit, verdict |
| A change outside a slice | the matching audit (cheat sheet) | Findings in `docs/audits/` |

**Habits**
- One task per chat; `/clear` between tasks. `Shift+Tab` for plan mode; `/rewind` to undo a turn.
- Weekly: `/rafi:deps`. Monthly: `/rafi:sync-template`. Quarterly: the four audits with `full`, trim `CLAUDE.md`, check `/context`.
- Corrected Claude twice for the same thing: add it to `Gotchas` in `CLAUDE.md`, or run `/rafi:retro`.

## 9. Cheat sheet

| When | Command |
|---|---|
| New project idea | `/rafi:brainstorm <idea>` → `/rafi:bootstrap-project <idea>` |
| Start work | `/rafi:branch <type> <name>` |
| Spec, plan, build | `/rafi:spec` → `/rafi:plan-feature` → `/rafi:slice` (repeat) |
| Finish a branch | `/rafi:merge` (`/rafi:pr` for a PR only) |
| Bug / emergency | `/rafi:fix-issue` / `/rafi:hotfix` |
| Schema change | `/rafi:migration <change>` |
| Ship | `/rafi:release-check` → `/rafi:release` |
| Auth, APIs, uploads, packages changed | `/rafi:security-audit diff` |
| Public pages, URLs, metadata changed | `/rafi:seo-audit diff` |
| Queries, lists, heavy libraries added | `/rafi:performance-audit diff` |
| UI, forms, colors changed | `/rafi:accessibility-audit diff` |
| Lost track | `/rafi:status` |
| Maintenance | `/rafi:deps`, `/rafi:sync-template`, `/rafi:retro` |

Audit scope: `diff` (branch vs its base, default), `full`, or a path.

## 10. Safety nets

| Layer | Enforces | Strength |
|---|---|---|
| `CLAUDE.md`, `.claude/rules/` | Conventions, git workflow | Advice |
| `.claude/settings.json` | Deny reading `.env*` and `secrets/`, `rm -rf`, force push, `--no-verify`, `reset --hard`, `branch -D`; no attribution | Pattern-based guard rail |
| Plugin guard hook | Secret reads (also via `cat`, `grep`), force deletes in any spelling, hook skipping, lockfile edits, direct commits / ff merges / non-ff pulls / rebases on `main` and `dev`, pushing them unless the tip is a merge commit, force push, attribution in messages | Enforced on every tool call |
| Plugin format + type-check hooks | Formatting; type errors fixed before Claude finishes | Automatic |
| Git hooks (`.husky/`) | No direct commits on `main`/`dev`, secret scan, lint/format, commit format, no attribution; `mergeOptions --no-ff` on `main` and `dev` | Blocks the commit, for you too |
| CI | Check, build, E2E, audit, secret scan | Blocks merging when rulesets are on |
| You | Approve plans, read diffs, say yes to releases | Final gate |

If something must never happen, it belongs in a hook or CI, not only in `CLAUDE.md`.

## 11. Scripts and non-Node stacks

| Script | Does |
|---|---|
| `pnpm dev` / `pnpm build` | Run locally / production build |
| `pnpm typecheck`, `pnpm lint`, `pnpm test` | Individual checks (`pnpm test <path>` for one file) |
| `pnpm check` | typecheck + lint + test. Run before calling anything done |
| `pnpm test:e2e` | Playwright with axe accessibility checks |
| `pnpm lighthouse` | Speed, SEO, accessibility scores |
| `pnpm run prepare` | Enables the git hooks and `--no-ff` merge options; re-run if commits aren't checked |

Also present: `.nvmrc`, `packageManager` in `package.json`, `.env.example` (variable names with safe placeholder values that pass validation; never real secrets; real values in `.env`, never committed).

Non-Node stacks: `/rafi:add-stack <name>` drafts a profile listing which template files change. Two one-line files drive the plugin hooks: `.claude/typecheck-cmd` (for example `mypy .`) and `.claude/format-cmd` (for example `ruff format`).

## 12. Files

| Path | Purpose | Edit |
|---|---|---|
| `CLAUDE.md` | Project memory: commands, architecture, git summary, merge mode, workflow, audit triggers, definition of done, gotchas. Under 100 lines | Yes, especially Gotchas |
| `.claude/settings.json` | Plugin, permissions, attribution off | Rarely |
| `.claude/rules/code-standards.md` | Coding rules | Yes |
| `.claude/rules/testing.md` | Test rules (loaded for test files) | Yes |
| `.claude/rules/git.md` | Branches, commits, merge mode, releases, environments | Rarely |
| `.claude/template-version` | Template commit the project came from (4.1) | Updated by `/rafi:sync-template` |
| `.husky/pre-commit` | Protected-branch check, gitleaks, lint-staged | Rarely |
| `.husky/commit-msg` | Attribution check, commitlint | Rarely |
| `commitlint.config.cjs` | Conventional Commits, required scope, no attribution | Rarely |
| `.lintstagedrc.json` | What gets linted and formatted at commit | Rarely |
| `.github/workflows/ci.yml` | CI; bootstrap adds stack parts (e.g. a Postgres service) | Rarely |
| `.github/dependabot.yml` | Weekly updates into `dev` | Rarely |
| `.github/pull_request_template.md` | PR checklist | Yes |
| `.github/CODEOWNERS` | Code owner (your GitHub username) | Yes |
| `docs/prd/_template.md` | Spec template | Yes |
| `docs/adr/_template.md` | Decision record template | Yes |
| `docs/architecture.md` | System design; bootstrap fills it | Yes |
| `docs/runbook.md` | Environments, deploy, release, rollback, secrets, backups, alerts, pending migrations, incidents | Keep current |
| `SECURITY.md` | Vulnerability reporting contact | Once |
| `CHANGELOG.md` | User-facing changes per release | Via `/rafi:merge`, `/rafi:pr`, `/rafi:release` |

Created later: `docs/brainstorm.md`, `docs/discussions/`, `docs/stack-profile.md` (stack and its rules; audits read it), `docs/stack-drafts/`, `docs/audits/` (findings logs; rows never deleted), `docs/scope/`.

## 13. Existing repos and template updates

**Adopt the template in an existing repo**
1. Install the plugin (3.4).
2. Copy `CLAUDE.md`, `.claude/`, `.github/`, `.husky/`, `commitlint.config.cjs`, `.lintstagedrc.json`, `docs/`, `SECURITY.md`, `CHANGELOG.md`. Write the template's commit to `.claude/template-version`.
3. Create `docs/stack-profile.md` by asking Claude to assemble it from the matching catalog files (same layout bootstrap uses). Run `/rafi:add-stack` or `/rafi:add-capability` first for anything missing. Don't run bootstrap.
4. Ensure the scripts in section 11 exist, then `pnpm install && pnpm run prepare`.
5. Create `dev` from `main` (`git switch -c dev main && git push -u origin dev`) and apply 4.5.

**Keep projects current**
- Plugin changes reach every project after `claude plugin update rafi@rafi-tools` and a restart.
- Template changes: `/rafi:sync-template` in each project.

## 14. Troubleshooting

| Symptom | Fix |
|---|---|
| `/rafi:` shows nothing | `/plugin`; reinstall (3.4); restart. The plugin repo is private, so git must reach GitHub |
| Plugin change not showing | `claude plugin marketplace update rafi-tools && claude plugin update rafi@rafi-tools`, restart |
| `Permission denied (publickey)` | Set up the SSH key (3.1) or use `https://` URLs |
| Commits aren't checked | `pnpm run prepare`; `git config core.hooksPath` must print `.husky/_` |
| "Direct commits on main/dev are not allowed" | Working as intended: `git switch -c feat/<name> dev` (uncommitted work moves along), commit there |
| commitlint: scope may not be empty | Use `type(scope): subject`, e.g. `fix(auth): handle expired token` |
| Commit rejected for attribution | Remove `Co-authored-by` and similar lines |
| "gitleaks is not installed" | Install it (section 2). One-off bypass: `SKIP_GITLEAKS=1 git commit ...` |
| gitleaks found a secret | Move it to `.env`. If it was ever pushed, rotate it at the provider |
| "Blocked by rafi guard: …" | Follow the message. Run the command yourself if you really need it, or start a session with `RAFI_GUARD=off claude` |
| "pushing dev whose tip is not a merge commit" | A commit landed on `dev` directly or by fast-forward. Move it to a work branch and merge with `--no-ff` |
| CI: `pnpm install --frozen-lockfile` fails | Run `pnpm install` locally and commit `pnpm-lock.yaml` |
| CI: build fails but works locally | CI builds with `.env.example`; make its placeholder values pass validation |
| CI: `pnpm audit` fails | `pnpm why <pkg>`, then `/rafi:deps <pkg>`. If no fix exists and you accept the risk, record it in an ADR and ignore that advisory in pnpm's audit config |
| CI: secret scan fails | Rotate the secret first, then remove it. Cleaning history needs a rewrite; ask before doing that on shared branches |
| pnpm ignored a package's build script | If you trust it: `pnpm approve-builds <package>` |
| `pnpm check` fails right after bootstrap | Paste the error to Claude |
| Claude asks permission for every command | Add it to `allow` in `.claude/settings.json` |
| Claude keeps ignoring a rule | Shorten `CLAUDE.md`, or turn the rule into a hook or lint rule |

## 15. FAQ

**Do I need `gh`?** No. Without it, Claude gives you a compare URL to open the PR and the release notes to paste.

**Do I need a paid GitHub plan?** No. Only rulesets on a private repo need Pro; the local hooks enforce the same rules without it.

**Can I switch merge mode later?** Yes: change the `Merge mode:` line in `CLAUDE.md`. For `github`, also apply the settings in 4.5 step 4.

**Why `--no-ff`?** Every feature, release, and hotfix becomes one merge commit: the history shows what shipped together, and one `git revert -m 1` undoes it.

**Can I skip E2E and Lighthouse?** Yes: leave out the `test:e2e` and `lighthouse` scripts. CI skips E2E without a Playwright config.

**Another database or library?** `/rafi:add-stack <name>` or `/rafi:add-capability <concern> <library>`.

**Remove the plugin?** `claude plugin uninstall rafi@rafi-tools` (or `disable` to pause).

## 16. Known caveats

- gitleaks' staged-files scan can miss a secret (issue #2281). CI scans full history as a second line, after the push; glance at diffs before pushing anyway.
- CI checks Dependabot PRs, but green doesn't prove a major upgrade safe: use `/rafi:deps`.
- Actions are pinned to commit SHAs and updated by Dependabot. The gitleaks version and checksum in `ci.yml` are pinned by hand: update both together.
- `branch.<name>.mergeOptions --no-ff` is local git config set by `pnpm run prepare`; a fresh clone needs `pnpm install` before merging.
- `CODEOWNERS` and `.claude/settings.json` reference `therafiniac`. Change both if the username changes.
