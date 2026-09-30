# claude-template

A ready-made starting folder for every new project. You copy it, open it with Claude Code, and Claude builds the project for you in small, checked steps, following your own standards for security, speed, SEO, accessibility, and code quality.

You do not need to know Claude Code, plugins, or CI to use this. Follow the sections in order.

> **When you copy this template into a new project, replace this README** with the project's own. `/rafi:bootstrap-project` does that for you. Keep the workflow sections in `docs/workflow.md` if you want to.

## Contents
1. [What this is](#1-what-this-is)
2. [How the three pieces fit together](#2-how-the-three-pieces-fit-together)
3. [Words you will see](#3-words-you-will-see)
4. [What you need before starting](#4-what-you-need-before-starting)
5. [One-time setup on your computer](#5-one-time-setup-on-your-computer)
6. [Start a new project](#6-start-a-new-project)
7. [Publish the project to GitHub](#7-publish-the-project-to-github)
8. [The daily workflow](#8-the-daily-workflow)
9. [Other situations](#9-other-situations)
10. [Which command, when](#10-which-command-when)
11. [The safety nets](#11-the-safety-nets)
12. [Scripts, tools, and other stacks](#12-scripts-tools-and-other-stacks)
13. [What is in this repo](#13-what-is-in-this-repo)
14. [Using the template in an existing repo](#14-using-the-template-in-an-existing-repo)
15. [Keeping projects up to date](#15-keeping-projects-up-to-date)
16. [Troubleshooting](#16-troubleshooting)
17. [FAQ](#17-faq)
18. [Known caveats](#18-known-caveats)

---

## 1. What this is

Think of it as a workshop that is already set up. Every project you build starts with the same:
- **Rules for Claude** (`CLAUDE.md` and `.claude/rules/`): how to write code, what to test, what never to do.
- **Guard rails**: Claude cannot read your `.env` secrets, force-push, or run `rm -rf`. Every commit is scanned for leaked secrets and must have a proper message.
- **Checks you run yourself**: type check, lint, tests, build, browser tests, speed test (`pnpm check` and the scripts in section 12). A local secret scan runs on commit (gitleaks). Nothing runs automatically on GitHub.
- **Folders for planning**: `docs/prd/` for what to build, `docs/architecture.md` for how it is built, `docs/adr/` for why you chose things.
- **A set of `/rafi:` commands** (from your plugin) that run the whole process: plan, build a piece, review, audit, ship.

## 2. How the three pieces fit together

```
   github.com/therafiniac/claude-plugins        github.com/therafiniac/claude-template
   (the toolkit: commands, audits, stacks)      (the starter files for each project)
                    |                                          |
        installed once into Claude Code                copied for each new project
                    |                                          |
                    +----------------> YOUR PROJECT <----------+
                                            ^
                                            |
                          ~/.claude/  (your personal defaults, set up once)
```

| Piece | What it holds | You touch it when |
|---|---|---|
| **Plugin** (`claude-plugins` repo) | The `/rafi:` commands, the five audit standards, the agents, the hooks, the stack profiles | You want to improve your toolkit. Everything updates in all projects |
| **Template** (this repo) | Project rules, permissions, git hooks, docs folders | You want to change what every new project starts with |
| **Personal defaults** (`~/.claude/`) | How Claude talks to you, plus a block on reading secrets | Once per computer |

## 3. Words you will see

| Word | Plain meaning |
|---|---|
| **Repo** (repository) | A project folder that git tracks. Also the copy of it on GitHub |
| **Clone** | Download a copy of a repo to your computer |
| **Commit** | A saved snapshot of your changes, with a message |
| **Branch** | Your own line of work, so `main` stays clean until you are ready |
| **Push / pull** | Upload your commits to GitHub / download others |
| **Pull request (PR)** | A page on GitHub that shows your branch's changes and the check results, before you merge them into `main` |
| **CI** | Checks that GitHub runs automatically on every push. Also called GitHub Actions |
| **Hook** | A small script that runs automatically at a moment, for example before a commit |
| **Plugin** | A package of commands and rules you install into Claude Code |
| **Skill / slash command** | Something you run by typing `/name` in Claude Code |
| **Agent (subagent)** | A helper Claude hands a job to, for example the code reviewer |
| **PRD** | Product Requirements Document: a half-page spec saying what to build and when it is done |
| **Slice** | One small, complete piece of a feature: data, logic, screen, and tests |
| **Audit** | A review against a checklist: security, SEO, performance, accessibility |
| **Stack** | The technologies a project uses: framework plus database |
| **`git switch` vs `git checkout`** | Both change branches. `git checkout` also does other jobs (restoring files), which confuses people. Git 2.23 split it into `git switch` (branches) and `git restore` (files). `git switch -c name` equals `git checkout -b name`. Use either |

## 4. What you need before starting

**Accounts:** a GitHub account, and Claude Code installed and logged in.

**Tools (Fedora):**
```bash
sudo dnf install git nodejs jq
curl -fsSL https://get.pnpm.io/install.sh | sh -
```
Then open a new terminal so `pnpm` is on your path. If the pnpm script does not work, use `sudo npm install -g pnpm`.

Install **gitleaks**, the secret scanner used by the commit hook:
```bash
sudo dnf install gitleaks
```
If dnf does not have it, download the `linux_x64` `.tar.gz` from the gitleaks Releases page on GitHub, then:
```bash
tar -xzf gitleaks_*_linux_x64.tar.gz
sudo mv gitleaks /usr/local/bin/
```

**Check everything is installed:**
```bash
git --version && node --version && pnpm --version && jq --version && gitleaks version && claude --version
```

| Tool | What it is for |
|---|---|
| `git` | Version control |
| `node` | Runs JavaScript projects. The project pins its version in `.nvmrc` |
| `pnpm` | Installs packages. Like npm, but faster and stricter |
| `jq` | The plugin's hooks read JSON with it |
| `gitleaks` | Blocks commits that contain secrets |

On Ubuntu use `apt` instead of `dnf`. On macOS use `brew install git node jq gitleaks pnpm`.

## 5. One-time setup on your computer

### 5.1 Let git talk to GitHub (SSH key)
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
cat ~/.ssh/id_ed25519.pub
```
Press Enter through the questions. Copy the line that `cat` prints. On GitHub go to **Settings → SSH and GPG keys → New SSH key**, paste it, and save. Test it:
```bash
ssh -T git@github.com
```
It should greet you by username. If you prefer, skip SSH and use the `https://github.com/...` URLs. Git will then ask for your username and a personal access token instead of a password.

### 5.2 Install your personal defaults
These come from the `global-claude` folder of your setup download.
```bash
./global-claude/install.sh
```
It copies `CLAUDE.md` and `settings.json` into `~/.claude/` and backs up anything that was there. From then on, in every project:
- Claude gives short, direct answers, plans before big changes, and asks before adding a dependency.
- Claude is blocked from reading `.env` files, `~/.ssh`, and `~/.aws`, and from force-pushing.

Check it worked: open Claude Code anywhere and type `/memory`. Your `~/.claude/CLAUDE.md` should be listed.

### 5.3 Install your plugin
```bash
claude plugin marketplace add therafiniac/claude-plugins
claude plugin install rafi@rafi-tools
```
Restart Claude Code. Type `/rafi:` and you should see the commands. This works in every project on this computer. See the plugin repo's README for details.

## 6. Start a new project

### 6.1 Copy the template into a new folder
```bash
cd ~/projects
git clone git@github.com:therafiniac/claude-template.git my-blog
cd my-blog
rm -rf .git
git init -b main
```
What this does: downloads the template into `my-blog`, deletes the template's history so the folder starts fresh, and starts a new history on a branch called `main`. Nothing is created on GitHub yet.

### 6.2 Open Claude Code
```bash
claude
```
Accept the "trust this folder" question. If it offers to install the `rafi` plugin, accept.

Quick checks:
1. Type `/rafi:`. You should see `bootstrap-project`, `plan-feature`, `slice`, and more.
2. Ask: "read the .env file". Claude must refuse. If it does not, stop and fix `.claude/settings.json`.

### 6.3 Only have an idea, not a stack?
```
/rafi:brainstorm portfolio site for a sanskrit teacher
```
Claude asks about users, main flows, who edits content, and your budget and constraints, a few questions at a time. It proposes 2–3 approaches, then a full stack table: framework, database, hosting, and every capability (styling, icons, CMS, search, …) with alternatives. It writes `docs/brainstorm.md` and no code. Bootstrap then reads that file instead of asking again. Skip this step if you already know your stack.

### 6.4 Is your stack in the list?
The plugin knows these building blocks:

| Kind | Available |
|---|---|
| Framework | `nextjs` (public and SEO sites), `astro` (blogs, docs, marketing sites), `react-spa` (React frontend for an API that already exists), `react-express` (React plus Express in one repo, for apps behind login), `wordpress` (custom themes and plugins) |
| Database | `mongodb`, `postgres` |
| Capabilities | `styling` (Tailwind, typography, plain CSS), `icons` (Lucide, Simple Icons, Iconify, Heroicons, Phosphor), `cms` (none, Keystatic, Decap, Sanity, Payload), `search` (Pagefind, Postgres full-text, Meilisearch, Algolia) |

You pick one framework and one database. Next.js with Postgres, Next.js with MongoDB, and React with Express and MongoDB (MERN) are all just combinations. `astro`, `react-spa`, and `wordpress` usually need no database profile: answer "none" when asked. Capabilities are proposed for you with a default per framework. You confirm or swap them.

**Something else, like Django or MySQL?** Create the profile first:
```
/rafi:add-stack Django
```
Claude interviews you, reads the official documentation, drafts a profile, and waits for your approval. Then continue with 6.5 and give it the draft path when asked.

**A library that is not in the capabilities, like a payment provider?** Run `/rafi:add-capability payments`. It drafts the capability the same way.

### 6.5 Build the base project
```
/rafi:bootstrap-project blog website
```
The words after the command are just your idea in a few words. Claude asks these questions in one message:

| Question | Example answer |
|---|---|
| Project name | `my-blog` |
| One-line purpose | Personal blog with tags and an admin who writes posts |
| Framework | `nextjs` |
| Database | `postgres` |
| Hosting | Railway |
| Auth needed | Yes: admin only, email and password |
| Database name | `my_blog` |
| Non-goals | No comments, newsletter, or multiple authors |

If you ran `/rafi:brainstorm`, it asks only what `docs/brainstorm.md` leaves out.

Next Claude shows a **capabilities table**: styling, icons, CMS, search, and so on, each with a proposed option and alternatives that fit your framework. Confirm or swap.

Then Claude shows a **scaffold plan**: folders, packages with a reason for each, scripts. **Read it and approve or change it.** Nothing is written before you approve.

After approval Claude creates the project, fills `CLAUDE.md`, writes your stack profile into `docs/stack-profile.md`, replaces this README with a project README, writes `docs/architecture.md` and a first decision record, and asks you the PRD questions: who uses it, what is in and out, and what "done" means. It does not invent your answers. Finally it installs packages, turns on the commit hooks, and runs the checks.

### 6.6 Check that it works
```bash
pnpm check
pnpm dev
```
Open http://localhost:3000. If `pnpm check` fails, paste the error into Claude and ask it to fix it.

### 6.7 First commit
```bash
git add -A
git commit -m "chore: scaffold project"
```
The commit message must look like `type: description`. Two things can block this commit:
- gitleaks is not installed. Install it (section 4). One-time bypass: `SKIP_GITLEAKS=1 git commit -m "chore: scaffold project"`
- The message does not follow the format.

## 7. Publish the project to GitHub

Do this when you want a backup, want CI to run, or want to deploy.

1. Go to **github.com/new**. Enter the repo name, choose **Private**, and leave every checkbox unticked (no README, no .gitignore, no license). Click **Create repository**.
2. In your project folder run the two lines GitHub shows under "push an existing repository":
   ```bash
   git remote add origin git@github.com:therafiniac/my-blog.git
   git push -u origin main
   ```
3. Nothing runs automatically. Run `pnpm check` (and `pnpm test:e2e` / `pnpm lighthouse` if you want them) yourself, before and after you push.

That is all. There are no secrets, branch rules, or other GitHub settings to configure.

## 8. The daily workflow

The loop, in one picture:

```
   spec (PRD) -> plan -> build one slice -> read the changes -> commit
                          ^                                        |
                          +---------- next slice <-----------------+
                                                                   |
                                        push -> checks -> merge -> deploy
```

### 8.1 Start a feature
```bash
git switch -c feat/tag-pages
```
This gives you your own branch, so `main` stays working.

### 8.2 Write the spec
Copy `docs/prd/_template.md` to `docs/prd/tags.md` and fill it in. Half a page is enough:
```md
# PRD: Post tags
## Users
Blog readers, and the admin who writes posts.
## Scope
Each post has tags. A page at /tags/[tag] lists posts with that tag.
## Non-goals
Tag search, tag colors, tag editing by readers.
## Acceptance criteria
- [ ] Given a post tagged "css", when I open /tags/css, then I see that post.
- [ ] Given a tag with no posts, when I open its page, then I get a 404.
- [ ] Given a non-admin user, when they try to edit tags, then they are denied.
```
If you cannot write a testable "done" rule, the feature is not clear enough to build yet.

### 8.3 Plan
```
/clear
/rafi:plan-feature tag pages
```
`/clear` starts a fresh chat so old context does not confuse Claude. Claude reads your PRD and code, then proposes slices in order, the files to touch, the tests to write, and the risks. **Read the plan. Approve it or edit it.** It writes no code yet.

### 8.4 Build one slice at a time
```
/rafi:slice data model for tags
```
Claude then:
1. builds only that slice
2. writes tests for it
3. runs `pnpm check` until it passes
4. asks the code reviewer to look at the changes
5. runs the audits that match what changed (security, SEO, performance, accessibility)
6. reports in a few lines, and suggests a commit message

It never commits by itself.

### 8.5 Read the changes and commit
You own every line, so read the diff. In the terminal:
```bash
git diff
```
Or use your editor's source control panel. Then:
```bash
git add -A
git commit -m "feat: add tag data model"
```
Before the commit goes through, the hooks scan for secrets, format your files, and check the message.

| Message type | Use for |
|---|---|
| `feat:` | A new feature |
| `fix:` | A bug fix |
| `docs:` | Documentation only |
| `refactor:` | Code change with no behavior change |
| `test:` | Tests only |
| `chore:` | Setup, tooling, dependencies |

Example: `feat: add tag page`. Keep the first line short.

### 8.6 Next slice
```
/clear
/rafi:slice tag page route
```
Repeat 8.4 to 8.6 until the feature is done.

### 8.7 Push and merge
```bash
git push -u origin feat/tag-pages
```
On GitHub you will see a **Compare & pull request** button. Click it, then **Create pull request**. There are no automated checks on the PR — run `pnpm check` yourself first. **You are the gate.** Merge when you're satisfied, then **Delete branch**. If you want to skip pull requests for small changes, merge locally with `git switch main`, `git merge feat/tag-pages`, `git push`.

Finally, update your computer:
```bash
git switch main
git pull
```
Railway deploys `main` automatically once you connect it.

### 8.8 An example session
```
you:    /clear
you:    /rafi:plan-feature tag pages
claude: (reads PRD) Plan: 3 slices. 1) tag model and repo, 2) /tags/[tag] page, 3) tags on the admin form ... Approve?
you:    Approved. Split slice 3 in two: form field first, then saving.
you:    /rafi:slice tag model and repo
claude: Done. pnpm check passes. Reviewer: 0 blockers. Security audit: no findings. Suggested commit: feat: add tag model
you:    (reads git diff, then runs) git commit -am "feat: add tag model"
you:    /clear
you:    /rafi:slice tags page route
```

## 9. Other situations

### A bug
```
/rafi:fix-issue the tag page shows an empty list for tags with capital letters
```
Claude writes a failing test first, explains the root cause in one sentence, makes the smallest fix, and runs the checks.

### A quick review of your own changes
```
/rafi:code-review
```

### Changed something outside a slice
Run the matching audit yourself (see section 10).

### Before launching
```
/rafi:release-check
```
Claude runs every check, the browser tests, the speed test, and all four audits at full size, then gives a "ship or hold" verdict. Fix every Critical and High finding. Then do the manual checks yourself:
- environment variables are set in your hosting
- walk through the main flows with the keyboard only
- test with a screen reader if you can
- you know how to roll back

### After a rough session
```
/rafi:retro
```
Claude looks at your corrections and repeated instructions and proposes rules to add to `CLAUDE.md`. You approve which to keep. This is how the setup gets better over time.

### Weekly and quarterly
- **Weekly:** GitHub opens pull requests from Dependabot to update packages. Read each one, check that its checks are green, and merge.
- **Quarterly:** run the four audits with `full`, trim `CLAUDE.md`, and run `/context` to see whether the setup is eating too much of Claude's memory.

### Habits that keep this efficient
- One task per chat. `/clear` between tasks.
- `Shift+Tab` switches Claude into Plan Mode, where it can only read.
- `/rewind` (or press Esc twice) undoes a bad turn. That is faster than arguing.
- If you correct Claude twice for the same thing, add it to the `Gotchas` section in `CLAUDE.md`.

## 10. Which command, when

| Situation | Command |
|---|---|
| An idea, but no stack decided | `/rafi:brainstorm <idea>` |
| Starting a project | `/rafi:bootstrap-project <idea>` |
| Your framework or database is not in the list | `/rafi:add-stack <name>` first |
| Adding icons, CMS, search, and so on later, or a library not in the catalog | `/rafi:add-capability <concern>` |
| Planning a feature | `/rafi:plan-feature <name>` |
| Building a piece | `/rafi:slice <name>` (runs review and audits for you) |
| A bug | `/rafi:fix-issue <description>` |
| Quick review of your changes | `/rafi:code-review` |
| Changed login, APIs, uploads, or packages outside a slice | `/rafi:security-audit diff` |
| Changed public pages, URLs, or metadata | `/rafi:seo-audit diff` |
| Added queries, lists, or heavy libraries | `/rafi:performance-audit diff` |
| Changed UI, forms, or colors | `/rafi:accessibility-audit diff` |
| Before launch | `/rafi:release-check` |
| End of a rough session | `/rafi:retro` |

The audit commands take a scope: `diff` (your current branch against `main`, the default), `full` (everything), or a path such as `src/features/tags`. Each audit writes its findings to `docs/audits/` in your project.

The code reviewer, security auditor, and test writer agents and the two hooks run on their own. You never call them.

## 11. The safety nets

| Layer | What it does | How strong |
|---|---|---|
| `CLAUDE.md` and `.claude/rules/` | Tell Claude the conventions | Advisory. Claude can still ignore them |
| `.claude/settings.json` | Blocks reading `.env` and secrets, force-push, `rm -rf` | A guard rail, not a sandbox |
| Plugin hooks | Formats each edited file, runs a type check when Claude finishes a turn | Automatic |
| Commit hooks (`.husky/`) | Secret scan, lint and format staged files, message format | Blocks the commit on your computer |

Anything that must never happen belongs in a hook or a check, not only in `CLAUDE.md`. There is no GitHub-side check anymore — run `pnpm check`, `pnpm test:e2e`, and `pnpm lighthouse` yourself when you want them.

## 12. Scripts, tools, and other stacks

Every project defines these scripts in `package.json`. Claude, the hooks, and CI all rely on the names.

| Script | Meaning |
|---|---|
| `dev`, `build` | Run in development, build for production |
| `typecheck`, `lint`, `test` | Individual checks |
| `check` | `typecheck` + `lint` + `test`. Run before saying anything is done |
| `test:e2e` | Browser tests, including accessibility checks |
| `lighthouse` | Speed, SEO, and accessibility scoring |
| `prepare` | `husky`. Turns on the commit hooks |

The project also has `.nvmrc` (Node version), a `packageManager` field, and `.env.example` (variable names with safe placeholder values that pass validation). CI copies it to `.env`, so never put real secrets in it.

**A stack that is not Node and pnpm** (Python, Go, and so on): run `/rafi:add-stack`. The profile lists which template files to change. Two tiny files make the hooks work anywhere. Each holds one command on its first line:
- `.claude/typecheck-cmd`, the quick check run when Claude finishes a turn, for example `mypy .`
- `.claude/format-cmd`, the formatter. The edited file path is added at the end, for example `ruff format`

You will also rewrite the `.github/workflows/` files for that language.

## 13. What is in this repo

| Path | Purpose | Edit it? |
|---|---|---|
| `CLAUDE.md` | Project memory. Bootstrap fills the placeholders. Keep it under 100 lines | Yes, especially `Gotchas` |
| `.claude/settings.json` | Turns on the plugin, allows safe commands, blocks dangerous ones | Rarely |
| `.claude/rules/code-standards.md` | Coding rules Claude always sees | Yes |
| `.claude/rules/testing.md` | Test rules, loaded only when Claude touches test files | Yes |
| `.husky/pre-commit`, `.husky/commit-msg` | Commit hooks | Rarely |
| `commitlint.config.cjs`, `.lintstagedrc.json` | Commit message rule, files to lint and format at commit time | Rarely |
| `.github/dependabot.yml` | Weekly package update pull requests | Rarely |
| `.github/pull_request_template.md` | Checklist shown on every pull request | Yes |
| `.github/CODEOWNERS` | Who owns the code | Yes |
| `docs/prd/` | Feature specs. `_template.md` is the starting point | Yes |
| `docs/architecture.md` | How the system is built | Yes |
| `docs/adr/` | Records of why you chose things | Yes |
| `docs/brainstorm.md` | Created by `/rafi:brainstorm`. Bootstrap reads it | Yes |
| `docs/stack-profile.md` | Created by bootstrap, extended by add-capability. The audits read it | Yes |
| `docs/audits/` | Created by the audits. Findings logs | Read only |

## 14. Using the template in an existing repo

1. Install the plugin (section 5.3).
2. Copy these from this template into your repo: `CLAUDE.md`, `.claude/`, `.github/`, `.husky/`, `commitlint.config.cjs`, `.lintstagedrc.json`, `docs/`.
3. Run `/rafi:add-stack` or `/rafi:bootstrap-project` for the stack profile, or write `docs/stack-profile.md` by hand.
4. Make sure `package.json` has the scripts from section 12, then run `pnpm install` and `pnpm run prepare`.

## 15. Keeping projects up to date

- **Toolkit changes** (commands, audits, stack profiles): update the plugin (see the plugin README). Every project picks it up on the next Claude Code restart.
- **Template changes** (rules, CI, hooks): existing projects do not update themselves. Compare the files and copy the changed ones by hand.

## 16. Troubleshooting

| Symptom | Fix |
|---|---|
| `/rafi:` commands are missing | Run `/plugin`. If it is not installed: `claude plugin marketplace add therafiniac/claude-plugins`, then `claude plugin install rafi@rafi-tools`, then restart Claude Code. The plugin repo is private, so git must be logged in to GitHub |
| A plugin change is not showing up | The version in the plugin repo was not raised. See the plugin README |
| `git clone` says "Permission denied (publickey)" | Set up the SSH key (5.1), or use the `https://` URL |
| Commit hooks do not run | `pnpm run prepare`, then check that `git config core.hooksPath` prints `.husky/_` |
| Commit blocked: "gitleaks is not installed" | Install it (section 4). One-time bypass: `SKIP_GITLEAKS=1 git commit ...` |
| Commit blocked: gitleaks found a secret | Remove the secret from the file, put it in `.env`, and if it was ever pushed, rotate it |
| Commit rejected by commitlint | Use `type: description`, for example `feat: add tag page` |
| `pnpm: command not found` | Install pnpm (section 4) and open a new terminal |
| pnpm says a package's build script was ignored | Run `pnpm approve-builds` and allow the package |
| `pnpm check` fails right after bootstrap | Paste the error into Claude and ask it to fix it |
| `pnpm build` fails on env validation | Fix `.env.example` so its values pass validation |
| The Stop hook keeps blocking Claude | Fix the type error it reports. It retries once per turn and cannot loop |
| Claude keeps ignoring a rule | The rule is too long or should be enforced. Shorten `CLAUDE.md`, or turn the rule into a hook or lint rule |
| Claude asks for permission on every command | Add the command to the `allow` list in `.claude/settings.json` |

## 17. FAQ

**Do I need the GitHub CLI (`gh`)?** No. Everything here uses plain git and the GitHub website.

**Do I need a paid GitHub plan?** No. Nothing here needs branch protection or paid features.

**Why is it a folder I copy instead of a "template repository" button?** The button creates a repo on GitHub straight away, with this README inside. Copying the folder keeps the project on your computer until you decide to publish it.

**Why pnpm and not npm?** It is faster, uses less disk space, and is stricter about dependencies. The scripts, hooks, and CI all assume it. Switching means editing all of them.

**Can I use a database other than MongoDB or Postgres?** Yes. Run `/rafi:add-stack MySQL` (or any name) and choose "database" when asked.

**Can I skip the browser and speed tests?** Yes. Delete `.github/workflows/e2e.yml` and `lighthouse.yml`.

**Can I turn off CI completely?** Yes. Delete `.github/workflows/`. The local hooks and the `/rafi:` audits still work.

**What does `/clear` do?** It starts a fresh conversation. Use it between tasks so old context does not confuse Claude.

**Where does my code live?** In your project folder on your computer, and on GitHub once you publish it. Claude edits the files on your computer.

**How do I remove the plugin?** `claude plugin uninstall rafi@rafi-tools`, or turn it off with `claude plugin disable rafi@rafi-tools`.

**Does this work in VS Code?** Yes. It is the same Claude Code, so the same commands work in its terminal.

## 18. Known caveats

- gitleaks `git --pre-commit --staged` has a reported bug (issue #2281) that can miss staged secrets. There is no CI scan as a backstop anymore, so a missed secret depends on you catching it before or after push.
- There is no automated check on Dependabot PRs. Read the diff and run `pnpm check` locally before merging one.
- The Stop hook, the forked audit skills, and plugin loading were validated structurally and by script tests, not over a long live session. Watch them in your first real project.
- `CODEOWNERS` and `.claude/settings.json` mention `therafiniac`. Change both if your GitHub username changes.
