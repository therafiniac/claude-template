# claude-template

**A ready-made starting folder for every new project.** You copy it, open it with Claude Code, and Claude builds your project with you in small, checked steps. It follows fixed standards for security, speed, SEO, accessibility, and code quality, so you don't have to remember them.

> **Which README do I need?**
> - **This one** is the user guide: setup, your first project from idea to live site, and the daily routine. Start here.
> - The **[claude-plugins README](https://github.com/therafiniac/claude-plugins)** is the reference manual: every command, every library option, the audits, and how to change the toolkit itself.

> When you create a project from this template, this README gets replaced by the project's own. `/rafi:bootstrap-project` does that for you.

You don't need to know Claude Code, plugins, or git in depth. Read the sections in order the first time; after that, section 9 (the cheat sheet) is usually all you need.

## Contents
1. [What this is, in plain words](#1-what-this-is-in-plain-words)
2. [How the three pieces fit together](#2-how-the-three-pieces-fit-together)
3. [Words you will see](#3-words-you-will-see)
4. [Before you start: tools and accounts](#4-before-you-start-tools-and-accounts)
5. [One-time setup on your computer](#5-one-time-setup-on-your-computer)
6. [Your first project, start to finish (worked example)](#6-your-first-project-start-to-finish-worked-example)
7. [The daily workflow: building features](#7-the-daily-workflow-building-features)
8. [Other situations](#8-other-situations)
9. [Cheat sheet: which command, when](#9-cheat-sheet-which-command-when)
10. [The safety nets](#10-the-safety-nets)
11. [Scripts, and stacks that are not Node](#11-scripts-and-stacks-that-are-not-node)
12. [What is in this repo](#12-what-is-in-this-repo)
13. [Existing repos, and keeping projects up to date](#13-existing-repos-and-keeping-projects-up-to-date)
14. [Troubleshooting](#14-troubleshooting)
15. [FAQ](#15-faq)
16. [Known caveats](#16-known-caveats)

---

## 1. What this is, in plain words

Think of a carpenter's workshop that is already set up before each job: the tools are on the wall, the safety guards are fitted, and the checklist is pinned by the door. This template is that workshop for software. Every project you start from it gets:

| You get | What it means for you |
|---|---|
| **Rules for Claude** (`CLAUDE.md`, `.claude/rules/`) | Claude knows how you want code written, what to test, and what never to do, without you repeating it every chat |
| **Guard rails** (`.claude/settings.json`) | Claude cannot read your secret files (`.env`), cannot force-push, and cannot run `rm -rf` |
| **Commit checks** (`.husky/`) | Before any commit is saved, your computer scans it for leaked passwords or keys, tidies the code, and checks the message format |
| **Planning folders** (`docs/`) | A place for what to build (`docs/prd/`), how it's built (`docs/architecture.md`), and why you chose things (`docs/adr/`) |
| **The `/rafi:` commands** (from the plugin) | Typed commands that walk you through the whole process: shape the idea, set up the project, plan, build piece by piece, review, audit, and check before launch |

What it does **not** do: nothing runs automatically on GitHub. You decide when to commit, push, and merge. You run the checks yourself (one command: `pnpm check`).

## 2. How the three pieces fit together

Your setup has three parts. Each lives in a different place and changes at a different speed.

```
   claude-plugins repo                          claude-template repo (this one)
   THE TOOLKIT                                  THE STARTER FILES
   commands, audits, library catalog            rules, guard rails, commit checks, docs folders
                |                                              |
      installed ONCE into Claude Code                copied for EACH new project
                |                                              |
                +-------------------> YOUR PROJECT <-----------+
                                          ^
                                          |
                        ~/.claude/   YOUR PERSONAL DEFAULTS
                        how Claude talks to you, set up once per computer
```

| Piece | What it holds | You touch it when |
|---|---|---|
| **Plugin** (`claude-plugins`) | The `/rafi:` commands, the audit checklists, the helper agents, the automatic hooks, the catalog of frameworks, databases, and libraries | You want to improve the toolkit. Every project gets the improvement |
| **Template** (this repo) | Project rules, guard rails, commit checks, docs folders | You want to change what every *new* project starts with |
| **Personal defaults** (`~/.claude/`) | Your communication style for Claude, plus a block on reading secrets | Once per computer |

Why two repos instead of one? A plugin can carry commands, but it cannot carry a project's `CLAUDE.md`, rules, or permission settings. Those must sit inside the project folder, so they come from the template.

## 3. Words you will see

| Word | Plain meaning |
|---|---|
| **Repo** (repository) | A project folder that git tracks. Also the copy of it on GitHub |
| **Clone** | Download a copy of a repo to your computer |
| **Commit** | A saved snapshot of your changes, with a short message saying what changed |
| **Branch** | Your own line of work, so `main` stays working until you are ready |
| **Push / pull** | Upload your commits to GitHub / download commits from GitHub |
| **Pull request (PR)** | A page on GitHub showing a branch's changes before you merge them into `main` |
| **Hook** | A small script that runs automatically at a certain moment, for example just before a commit |
| **Claude Code** | Claude running in your terminal, able to read and edit files in your project |
| **Plugin** | A package of commands and rules you install into Claude Code once |
| **Slash command / skill** | Something you run by typing `/name` in Claude Code, for example `/rafi:slice` |
| **Agent (subagent)** | A helper Claude hands a job to, for example the code reviewer |
| **Stack** | The technologies a project uses: a framework, maybe a database, and libraries |
| **Framework** | The main building tool for the site or app, for example Astro or Next.js |
| **Capability** | One job a library does for your project: icons, fonts, search, forms, a CMS, payments, and so on. The plugin has a catalog of vetted options for each |
| **Stack profile** | The file `docs/stack-profile.md` in your project. It lists your chosen technologies and their rules, and the audits read it |
| **PRD** | Product Requirements Document: a half-page spec saying what to build and how you'll know it's done |
| **ADR** | Architecture Decision Record: a short note saying what you chose and why, so future-you remembers |
| **Slice** | One small, complete piece of a feature: data, logic, screen, and tests together |
| **Audit** | A review against a checklist: security, SEO, performance, or accessibility |
| **`pnpm`** | The tool that installs packages and runs the project's scripts. Like `npm`, but faster and stricter |
| **`git switch` vs `git checkout`** | Both change branches. `git switch -c name` is the newer, clearer form of `git checkout -b name`. Use either |

## 4. Before you start: tools and accounts

**Accounts:** a GitHub account, and Claude Code installed and logged in (`claude` works in your terminal).

**Tools.** Pick your system:

```bash
# Fedora
sudo dnf install git nodejs jq gitleaks
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Ubuntu / Debian
sudo apt install git nodejs jq
curl -fsSL https://get.pnpm.io/install.sh | sh -
# gitleaks: see "If gitleaks is not in your package manager" below

# macOS
brew install git node jq gitleaks pnpm
```

After installing pnpm, **open a new terminal** so your shell can find it. If the pnpm script fails, use `sudo npm install -g pnpm`.

**If gitleaks is not in your package manager:** download the `linux_x64` `.tar.gz` from the gitleaks Releases page on GitHub, then:
```bash
tar -xzf gitleaks_*_linux_x64.tar.gz
sudo mv gitleaks /usr/local/bin/
```

**Check everything is installed.** This prints one version per tool. If any line says "command not found", install that tool again.
```bash
git --version && node --version && pnpm --version && jq --version && gitleaks version && claude --version
```

| Tool | Why you need it |
|---|---|
| `git` | Saves the history of your project |
| `node` | Runs JavaScript projects. Each project pins its version in `.nvmrc` |
| `pnpm` | Installs packages and runs scripts such as `pnpm check` |
| `jq` | The plugin's automatic hooks read JSON with it |
| `gitleaks` | Blocks commits that contain passwords, API keys, or tokens |

## 5. One-time setup on your computer

Do these three steps once per computer. After that, every project just works.

### 5.1 Let git talk to GitHub (SSH key)
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
cat ~/.ssh/id_ed25519.pub
```
Press Enter through the questions. Copy the single line that `cat` prints. On GitHub go to **Settings → SSH and GPG keys → New SSH key**, paste it, and save. Then test:
```bash
ssh -T git@github.com
```
**Success looks like:** `Hi <your-username>! You've successfully authenticated...`

Prefer not to use SSH? Use the `https://github.com/...` addresses instead. Git will ask for your username and a personal access token (not your password).

### 5.2 Install your personal defaults
These live in the `global-claude` folder that comes with this setup.
```bash
./global-claude/install.sh
```
It copies `CLAUDE.md` and `settings.json` into `~/.claude/`, and backs up anything already there (as `*.bak.<number>`). From then on, in every project:
- Claude answers briefly and directly, plans before big changes, and asks before adding a dependency.
- Claude cannot read `.env` files, `~/.ssh`, or `~/.aws`, and cannot force-push.

**Check it worked:** open Claude Code anywhere and type `/memory`. You should see `~/.claude/CLAUDE.md` listed.

### 5.3 Install the plugin
```bash
claude plugin marketplace add therafiniac/claude-plugins
claude plugin install rafi@rafi-tools
```
The first line tells Claude Code where your toolkit lives. The second installs it. **Restart Claude Code**, then type `/rafi:`.
**Success looks like:** a list of commands such as `brainstorm`, `bootstrap-project`, `plan-feature`, `slice`.

The plugin repo is private, so step 5.1 must be done first, or git cannot download it.

## 6. Your first project, start to finish (worked example)

This section builds a real example so you can see every step. The idea: **a website for a Sanskrit teacher**, with lessons written in Markdown, both Roman (IAST) and Devanagari text, a search box, and a contact form. Your own project will follow the same steps.

> Conversations and outputs below are **examples**. Claude's exact wording and choices will differ for your project.

### 6.1 Copy the template into a new folder
```bash
mkdir -p ~/projects && cd ~/projects
git clone git@github.com:therafiniac/claude-template.git vidya-site
cd vidya-site
rm -rf .git
git init -b main
```
Line by line: make a projects folder, download the template into a folder called `vidya-site`, go into it, delete the template's own history, and start a fresh history on a branch called `main`. Nothing exists on GitHub yet; that comes later, when you choose.

### 6.2 Open Claude Code and run two safety checks
```bash
claude
```
Accept the "trust this folder" question. If it offers to install the `rafi` plugin, accept.

1. Type `/rafi:`. You should see the command list.
2. Type: `read the .env file`. **Claude must refuse.** If it reads it, stop and check `.claude/settings.json`.

### 6.3 Shape the idea (when you don't know the stack yet)
This step is for a **brand-new** project. If you already know exactly which framework and libraries you want, skip to 6.4. (Ideas for a project that already exists go through `/rafi:discuss` instead; see 8.2.) Otherwise:
```
/rafi:brainstorm website for a sanskrit teacher
```
Claude asks a few questions at a time. Example:

```
claude: A few questions to start:
        1. Who visits the site, and what do they come for?
        2. Who writes and edits the lessons? Are they comfortable with files and git?
        3. Which pages must exist in the first version?
        4. Budget for hosting and services per month?
you:    Students and parents. Lessons, a teacher bio, contact. The teacher edits
        lessons herself and is not technical. Home, lessons list, lesson page,
        about, contact. Budget: as close to zero as possible.
claude: Does text need both Roman transliteration (IAST) and Devanagari? Do you
        need search across lessons? Any payments or student logins?
you:    Both scripts. Search yes. No payments, no logins.
```

Then it proposes approaches, with trade-offs, and recommends one:

```
claude: A) Static site with Markdown lessons and a git-based editor
           Effort: low. Cost: free hosting. Easy: speed, SEO. Hard: live features.
        B) Full app with a database and logins
           Effort: high. Cost: a server. Not needed: no logins or payments.
        Recommendation: A.
you:    A.
```

Then the stack, built from the plugin's catalog. Each row has a proposed choice and alternatives that fit:

```
| Concern   | Proposed                         | Alternatives            | Why                              |
|-----------|----------------------------------|-------------------------|----------------------------------|
| Framework | astro (static)                   | nextjs                  | content site, fastest pages      |
| Database  | none                             | —                       | lessons are Markdown files       |
| Hosting   | Cloudflare Pages                 | Netlify                 | free static hosting              |
| Styling   | tailwind + tailwind-typography   | native-css              | long-form lesson text            |
| Icons     | lucide + simple-icons            | iconify-astro-icon      | UI icons + social logos          |
| Fonts     | astro-fonts (Latin-ext + Devanagari) | system-stack        | IAST diacritics and Devanagari   |
| CMS       | decap                            | keystatic, none         | teacher edits in a browser       |
| Search    | pagefind                         | —                       | built at build time, no server   |
| Forms     | web3forms (+ spam protection)    | formspree               | no server needed                 |
```

You can swap anything: `use iconify-astro-icon for icons` or `use keystatic instead`. When you confirm, Claude writes **`docs/brainstorm.md`**: the idea, users, pages, draft "done" rules, the chosen approach, and this table. **It writes no code.**

**Something you need isn't in the catalog?** Claude lists it as "not in catalog". Run `/rafi:add-capability <name>` (for a library) or `/rafi:add-stack <name>` (for a framework or database) first. See 8.4.

### 6.4 Build the base project
```
/rafi:bootstrap-project sanskrit teacher website
```
What happens, step by step:

1. **Questions.** If `docs/brainstorm.md` exists, Claude asks only what it leaves out (for example the project name). Without it, Claude asks everything in one message: name, purpose, framework, database, hosting, login needs, non-goals.
2. **Capabilities table.** The same kind of table as above. Confirm or swap.
3. **Scaffold plan.** Folders, every package with a reason, config files, scripts. Claude first checks the current official docs for each chosen library, so outdated instructions don't sneak in. **Read the plan and approve or change it. Nothing is written before you approve.**
4. **Build.** Claude runs the framework's official generator, then adds everything from the plan. Your template files (`CLAUDE.md`, rules, docs) are never overwritten.
5. **Docs.** It fills `CLAUDE.md`, writes `docs/stack-profile.md` (your stack table plus the rules for each choice), replaces this README with a project README, fills `docs/architecture.md`, and records the stack decision in `docs/adr/001-stack.md`.
6. **Spec.** It creates `docs/prd/<name>.md`, taking users, scope, and "done" rules from `docs/brainstorm.md` and asking you for anything missing. It never invents them.
7. **Install and check.** It installs packages, turns on the commit checks, runs `pnpm check` and `pnpm build`, and shows you the results.

If pnpm says a package wants to run an install script (for example `esbuild`), Claude lists it and asks before approving it.

### 6.5 Check that it works
```bash
pnpm check
pnpm dev
```
`pnpm check` runs the type check, lint, and tests; **success is no errors**. `pnpm dev` starts the site and prints an address (Astro: `http://localhost:4321`, Next.js: `http://localhost:3000`). Open it in your browser. If something fails, paste the error into Claude and ask it to fix it.

### 6.6 Your first commit
```bash
git add -A
git commit -m "chore: scaffold project"
```
Before the commit is saved, the commit checks run: a secret scan, code tidying, and a message-format check. Messages must look like `type: description` or `type(area): description`.

Two things can block this commit:
- **gitleaks is not installed.** Install it (section 4). One-time bypass: `SKIP_GITLEAKS=1 git commit -m "chore: scaffold project"`.
- **The message has the wrong shape.** Use for example `chore: scaffold project`.

### 6.7 Publish to GitHub (when you want a backup or to deploy)
1. Go to **github.com/new**. Enter the name, choose **Private**, and leave every box unticked (no README, no .gitignore, no license). Click **Create repository**.
2. Run the two lines GitHub shows under "push an existing repository", for example:
   ```bash
   git remote add origin git@github.com:therafiniac/vidya-site.git
   git push -u origin main
   ```
3. Connect the repo to your host (Cloudflare Pages, Netlify, Railway, …) in the host's dashboard. From then on, pushing to `main` deploys.

There are no GitHub secrets, branch rules, or Actions to configure.

## 7. The daily workflow: building features

Every feature follows the same loop:

```
   write the spec -> plan -> build one slice -> read the changes -> commit
                               ^                                     |
                               +------------ next slice <------------+
                                                                     |
                                        push -> merge -> deploy  <---+ (feature done)
```

**You don't have to memorize the order.** Every `/rafi:` command ends with a `Next:` line suggesting what to do next, based on what just happened. For example, after a slice: `Next: /clear, then /rafi:slice tag pages and links`. It's only a suggestion; Claude never runs it, and you can do something else.

The example feature: **tag pages**, so a visitor can see all lessons tagged "grammar".

### 7.1 Start a branch
```bash
git switch -c feat/lesson-tags
```
Your own line of work. `main` keeps working while you build.

### 7.2 Write the spec
```
/rafi:spec lesson tags
```
Claude first asks how you want to do it:
- **A) Claude asks you questions** in plain language (what problem it solves, who uses it, what's in and out, what the user sees, what happens when things go wrong), then writes the spec. Any "done" rule you didn't say yourself is marked **(proposed)** for you to keep, change, or remove.
- **B) You fill it in yourself.** Claude creates `docs/prd/lesson-tags.md` with hints in each section and waits. When you say "done", it reviews your spec and points out vague or missing "done" rules.

**You don't need to know the code to write a spec.** The spec says *what the visitor sees*, not *how it's built*. Like ordering a cake: you say "chocolate, two layers, 'Happy Birthday' on top" without knowing the recipe. The recipe is the plan (7.3), and Claude writes that. Each "done" rule is something you could check yourself by clicking around the finished site.

Either way, you end up with a half-page file like this:
```md
# PRD: Lesson tags
## Users
Students browsing lessons.
## Scope (in)
Each lesson has tags. A page at /tags/[tag] lists lessons with that tag.
## Non-goals
Tag search, tag colors.
## Acceptance criteria
- [ ] Given a lesson tagged "grammar", when I open /tags/grammar, then I see that lesson.
- [ ] Given a tag with no lessons, when I open its page, then I get a 404.
- [ ] Given tags in mixed case, when I open /tags/Grammar, then I see the same page as /tags/grammar.
```
The acceptance criteria are the most important part. **If you can't write a testable "done" rule, the feature isn't clear enough to build yet.**

### 7.3 Plan
```
/clear
/rafi:plan-feature lesson tags
```
`/clear` starts a fresh conversation so old context doesn't confuse Claude. Claude reads the spec and the code, and proposes a plan. Example:
```
claude: Plan, 2 slices:
        1) Tag field in the lessons collection schema + tag helper + unit tests.
           Files: src/content.config.ts, src/lib/tags.ts, src/lib/tags.test.ts
        2) /tags/[tag] page + links from lesson pages + E2E test.
           Files: src/pages/tags/[tag].astro, e2e/tags.spec.ts
        Risks: case differences in tags. Audits: SEO (new public pages), accessibility.
        Approve?
you:    Approved.
```
**Read the plan. Approve it or change it.** No code is written yet.

### 7.4 Build one slice
```
/rafi:slice tag field and helper
```
Claude:
1. restates the slice in three lines and builds only that
2. writes tests for it
3. runs `pnpm check` until it passes
4. asks the code-reviewer agent to review the changes, and fixes serious findings
5. runs the audits that match the change (here: none for a schema change)
6. reports in five lines or fewer, then a commit message on its own line, then a `Next:` suggestion

Example report:
```
Added tags (lowercased) to the lesson schema and a getLessonsByTag helper.
pnpm check: passes. Tests: 5 added.
Reviewer: approve, 0 blockers. Audits: none triggered.
feat(content): add lesson tags
Next: /clear, then /rafi:slice tag pages and links
```
**Claude never commits.** That's your job.

### 7.5 Read the changes, then commit
You own every line, so look at what changed:
```bash
git diff
```
(or your editor's Source Control panel). Then:
```bash
git add -A
git commit -m "feat(content): add lesson tags"
```

| Message type | Use for | Example |
|---|---|---|
| `feat` | A new feature | `feat(tags): add tag pages` |
| `fix` | A bug fix | `fix(tags): match tags case-insensitively` |
| `docs` | Documentation only | `docs(readme): add deploy steps` |
| `refactor` | Code change with no behavior change | `refactor(lib): split tag helpers` |
| `test` | Tests only | `test(tags): cover empty tag page` |
| `chore` | Setup, tooling, dependencies | `chore(deps): update astro` |

The part in brackets (the scope) is optional. Keep the first line short.

### 7.6 Next slice
```
/clear
/rafi:slice tag pages and links
```
Repeat 7.4 to 7.6 until every slice of the plan is done.

### 7.7 Push, merge, deploy
```bash
pnpm check
git push -u origin feat/lesson-tags
```
On GitHub, click **Compare & pull request**, then **Create pull request**. Nothing is checked automatically on GitHub: **you are the gate**, so make sure `pnpm check` passed before pushing. When satisfied, click **Merge pull request**, then **Delete branch**.

Prefer to skip pull requests for small changes? Merge on your computer:
```bash
git switch main
git merge feat/lesson-tags
git push
```

Either way, finish by updating your local `main`:
```bash
git switch main
git pull
```
If your host is connected, it deploys `main` automatically.

## 8. Other situations

### 8.1 A bug
```
/rafi:fix-issue the tag page shows nothing for tags with capital letters
```
Claude first writes a test that fails because of the bug, states the root cause in one sentence, makes the smallest fix, and runs `pnpm check`. It ends with a commit message such as `fix(tags): match tags case-insensitively`. If the cause is a security or data problem, it also runs a security review.

### 8.2 A new idea in the middle of a project
Weeks after launch, you wonder whether students could book classes online:
```
/rafi:discuss online class booking
```
Claude reads your existing stack, specs, and decisions, asks a few plain questions, and proposes 2–3 approaches that fit **what you already have**. It saves the conversation's outcome to `docs/discussions/<date>-online-class-booking.md` and suggests the next step: usually `/rafi:spec <feature>` for a new feature, or `/rafi:add-capability <concern>` if a new library is needed. It writes no code.

Use `/rafi:discuss` anytime in an existing project, even just to think something through. (`/rafi:brainstorm` is only for brand-new projects; in an existing one it points you to `/rafi:discuss`.)

### 8.3 Add a library later (search, a CMS, payments, …)
Months later, the teacher wants a newsletter signup form:
```
/rafi:add-capability forms
```
Claude reads your stack, proposes the option that fits (with alternatives), checks the current docs, shows a plan, and builds it after you approve. It records the choice in `docs/stack-profile.md` and in a new ADR, so the audits know about it.

### 8.4 A technology that isn't in the catalog
- **A library** (for example a different payment provider): `/rafi:add-capability payments paypal`. Claude interviews you, reads the official docs, and drafts it in the catalog format for your approval.
- **A framework or database** (for example Django or MySQL): `/rafi:add-stack Django`. Same idea, for a whole framework or database.

Drafts are saved in `docs/stack-drafts/`. To keep one for every future project, copy it into the plugin (see the plugin README, section 8).

### 8.5 A quick review of your own changes
```
/rafi:code-review
```

### 8.6 You changed something outside a slice
Run the matching audit yourself (see the cheat sheet). Audits only report; they never change your code.

### 8.7 Before launching
```
/rafi:release-check
```
Claude runs every check, the browser and speed tests (if the project has them), and all audits across the whole project, then gives a **ship** or **hold** verdict with the blockers listed. Fix every Critical and High finding. Then do these checks yourself, because code can't prove them:
- environment variables are set in your hosting
- walk through the main pages with the keyboard only (Tab, Enter, Esc)
- try a screen reader if you can
- search engine setup (for example Google Search Console)
- you know how to roll back a bad deploy

### 8.8 After a rough session
```
/rafi:retro
```
Claude looks at what you had to correct or repeat, and proposes up to seven rules for `CLAUDE.md` or `.claude/rules/`. You approve which to keep. This is how the setup gets smarter over time.

### 8.9 Weekly and quarterly habits
- **Weekly:** Dependabot opens pull requests to update packages. Nothing checks them automatically. To test one: `git fetch`, `git switch <its branch>`, `pnpm install`, `pnpm check`. Merge if it passes.
- **Quarterly:** run the four audits with `full`, trim `CLAUDE.md`, and run `/context` in Claude Code to see whether the setup uses too much of Claude's memory.

### 8.10 Habits that keep this efficient
- **One task per chat.** `/clear` between tasks.
- **`Shift+Tab`** switches Claude into Plan Mode, where it can only read and plan.
- **`/rewind`** (or Esc twice) undoes a bad turn. Faster than arguing.
- **Correcting Claude twice for the same thing?** Add a line to the `Gotchas` section of `CLAUDE.md`.

## 9. Cheat sheet: which command, when

| Situation | Command |
|---|---|
| An idea for a new project, no stack decided | `/rafi:brainstorm <idea>` |
| A new idea or change in an existing project, or just thinking something through | `/rafi:discuss <topic>` |
| Start a project | `/rafi:bootstrap-project <idea>` |
| Your framework or database isn't in the catalog | `/rafi:add-stack <name>` |
| Add icons, search, a CMS, payments, … later, or a library not in the catalog | `/rafi:add-capability <concern>` |
| Write a feature's spec (Claude asks, or you fill it) | `/rafi:spec <feature>` |
| Plan a feature | `/rafi:plan-feature <name>` |
| Build one piece | `/rafi:slice <name>` (runs review and audits for you) |
| Fix a bug | `/rafi:fix-issue <description>` |
| Review your changes | `/rafi:code-review` |
| Changed login, APIs, uploads, or packages outside a slice | `/rafi:security-audit diff` |
| Changed public pages, URLs, or page titles | `/rafi:seo-audit diff` |
| Added queries, lists, or heavy libraries | `/rafi:performance-audit diff` |
| Changed UI, forms, or colors | `/rafi:accessibility-audit diff` |
| Before launch | `/rafi:release-check` |
| End of a rough session | `/rafi:retro` |

**Audit scope:** `diff` (your branch compared with `main`, the default), `full` (the whole project), or a folder such as `src/pages/tags`. Each audit writes its findings to `docs/audits/` in your project.

The code reviewer, security auditor, and test writer agents, and the two hooks, run on their own. You never call them directly.

## 10. The safety nets

| Layer | What it does | How strong |
|---|---|---|
| `CLAUDE.md` and `.claude/rules/` | Tell Claude your conventions | Advice. Claude usually follows it but can slip |
| `.claude/settings.json` | Blocks reading `.env` and `secrets/`, force-push, `rm -rf` | A guard rail, not a sandbox |
| Plugin hooks | Tidy each file Claude edits; run a type check whenever Claude finishes a reply, so it fixes errors before handing back | Automatic |
| Commit checks (`.husky/`) | Secret scan, lint and format the files being committed, check the message | Blocks the commit on your computer |
| You | Read the diff, run `pnpm check` before pushing, merge | The final gate |

**Rule of thumb:** if something must *never* happen, it belongs in a hook or a check, not only in `CLAUDE.md`.

## 11. Scripts, and stacks that are not Node

Every project defines these scripts in `package.json`. Claude and the hooks rely on these exact names.

| Script | What it does |
|---|---|
| `pnpm dev` | Run the site locally while you work |
| `pnpm build` | Build the production version |
| `pnpm typecheck`, `pnpm lint`, `pnpm test` | The individual checks |
| `pnpm check` | `typecheck` + `lint` + `test`. **Run this before saying anything is done** |
| `pnpm test:e2e` | Browser tests, including automatic accessibility checks |
| `pnpm lighthouse` | Speed, SEO, and accessibility scores |
| `pnpm run prepare` | Turns on the commit checks. Usually runs on install; run it by hand if commits aren't being checked |

The project also has `.nvmrc` (which Node version), a `packageManager` field (which pnpm version), and `.env.example` (the names of the settings the app needs, with safe placeholder values). **Never put real secrets in `.env.example`**; real values go in `.env`, which is never committed.

**Not using Node and pnpm** (Python, Go, PHP, …)? Run `/rafi:add-stack <name>`. The profile it drafts lists which template files to change. Two tiny files make the plugin's hooks work with any language; each holds one command on its first line:
- `.claude/typecheck-cmd`: the quick check run when Claude finishes a reply, for example `mypy .`
- `.claude/format-cmd`: the formatter; the edited file's path is added at the end, for example `ruff format`

## 12. What is in this repo

| Path | What it is | Edit it? |
|---|---|---|
| `CLAUDE.md` | The project's memory for Claude. Bootstrap fills the `<placeholders>`. Keep it under 100 lines | Yes, especially `Gotchas` |
| `.claude/settings.json` | Turns on the plugin, allows safe commands without asking, blocks dangerous ones | Rarely |
| `.claude/rules/code-standards.md` | Coding rules Claude always follows | Yes |
| `.claude/rules/testing.md` | Test rules, loaded when Claude works on tests | Yes |
| `.husky/pre-commit` | Before each commit: secret scan, then lint and format the committed files | Rarely |
| `.husky/commit-msg` | Checks the commit message format | Rarely |
| `commitlint.config.cjs` | The commit message rules (Conventional Commits) | Rarely |
| `.lintstagedrc.json` | Which files get linted and formatted at commit time | Rarely |
| `.github/dependabot.yml` | Weekly package-update pull requests | Rarely |
| `.github/pull_request_template.md` | A checklist shown on every pull request | Yes |
| `.github/CODEOWNERS` | Who owns the code (your GitHub username) | Yes |
| `docs/prd/_template.md` | Starting point for feature specs | Yes |
| `docs/architecture.md` | How the system is built. Bootstrap fills it | Yes |
| `docs/adr/_template.md` | Starting point for decision records | Yes |

Files created later in each project:

| Path | Created by | What it is |
|---|---|---|
| `docs/brainstorm.md` | `/rafi:brainstorm` | The idea, pages, approach, and stack table. Bootstrap reads it |
| `docs/discussions/` | `/rafi:discuss` | One dated file per discussion: the problem, approaches, the choice, next step |
| `docs/stack-profile.md` | `/rafi:bootstrap-project`, extended by `/rafi:add-capability` | Your stack table and the rules for each choice. The audits read it |
| `docs/stack-drafts/` | `/rafi:add-stack`, `/rafi:add-capability` | Drafted profiles waiting to be used or copied into the plugin |
| `docs/audits/` | The audits | Findings logs. Rows are never deleted, only marked Fixed |

## 13. Existing repos, and keeping projects up to date

### Using this template in a repo that already exists
1. Install the plugin (5.3).
2. Copy these from this template into your repo: `CLAUDE.md`, `.claude/`, `.github/`, `.husky/`, `commitlint.config.cjs`, `.lintstagedrc.json`, `docs/`.
3. Create `docs/stack-profile.md`. Don't run `/rafi:bootstrap-project` here: it scaffolds a new project. Instead ask Claude to assemble the profile from the plugin's framework, database, and capability files that match what the repo already uses (same layout as bootstrap: a Stack table, then each file's rules). Run `/rafi:add-stack` or `/rafi:add-capability` first for anything the catalog lacks.
4. Make sure `package.json` has the scripts from section 11, then run `pnpm install` and `pnpm run prepare`.

### Keeping projects up to date
- **Toolkit changes** (commands, audits, the catalog) arrive by updating the plugin (plugin README, section 2). Every project picks them up after a Claude Code restart.
- **Template changes** (rules, guard rails, commit checks) don't reach existing projects on their own. Compare the files and copy the changed ones by hand.

## 14. Troubleshooting

| Symptom | Fix |
|---|---|
| `/rafi:` shows nothing | Run `/plugin` in Claude Code. If `rafi` is missing, repeat 5.3 and restart Claude Code. The plugin repo is private, so git must be logged in to GitHub (5.1) |
| A plugin change isn't showing up | Update the plugin: `claude plugin marketplace update rafi-tools`, then `claude plugin update rafi@rafi-tools`, then restart. If still missing, the plugin's version number wasn't raised |
| `git clone` says "Permission denied (publickey)" | Set up the SSH key (5.1), or use the `https://` address |
| Commit checks don't run | Run `pnpm run prepare`, then check that `git config core.hooksPath` prints `.husky/_` |
| Commit blocked: "gitleaks is not installed" | Install it (section 4). One-time bypass: `SKIP_GITLEAKS=1 git commit ...` |
| Commit blocked: gitleaks found a secret | Remove the secret from the file and put it in `.env`. If it was ever pushed, change (rotate) the secret at its provider |
| Commit rejected by commitlint | Use `type: description` or `type(area): description`, for example `feat(tags): add tag page` |
| `pnpm: command not found` | Install pnpm (section 4) and open a new terminal |
| pnpm says a package's build script was ignored | If you trust the package, run `pnpm approve-builds <package>` (or `pnpm approve-builds` to choose from a list). The approval is saved in `pnpm-workspace.yaml` |
| `pnpm check` fails right after bootstrap | Paste the error into Claude and ask it to fix it |
| `pnpm build` fails on settings validation | Fix `.env.example` (or `.env`) so its values pass the app's validation |
| Claude keeps getting stopped by the type check | Fix the type error it reports. It retries once per reply, so it can't loop |
| Claude keeps ignoring a rule | The rule is too long or should be enforced. Shorten `CLAUDE.md`, or turn the rule into a hook or lint rule |
| Claude asks permission for every command | Add the command to the `allow` list in `.claude/settings.json` |

## 15. FAQ

**Do I need the GitHub CLI (`gh`)?** No. Everything uses plain git and the GitHub website.

**Do I need a paid GitHub plan?** No.

**Why copy a folder instead of GitHub's "template repository" button?** The button creates a GitHub repo immediately, with this README inside. Copying keeps the project on your computer until you decide to publish it.

**Why pnpm and not npm?** It's faster, uses less disk space, and is stricter about dependencies. The scripts and hooks assume it; switching means editing them.

**Can I use a database other than MongoDB or Postgres?** Yes. Run `/rafi:add-stack MySQL` (or any name) and choose "database" when asked.

**Can I use a library that isn't in the catalog?** Yes. Run `/rafi:add-capability <concern> <library>`. See 8.4.

**Can I skip the browser and speed tests?** Yes. Don't add the `test:e2e` and `lighthouse` scripts, or remove them. `pnpm check` doesn't depend on them.

**What does `/clear` do?** Starts a fresh conversation. Use it between tasks so old context doesn't confuse Claude.

**Where does my code live?** In your project folder, and on GitHub once you push. Claude edits the files on your computer.

**How do I remove the plugin?** `claude plugin uninstall rafi@rafi-tools`, or pause it with `claude plugin disable rafi@rafi-tools`.

**Does this work in VS Code?** Yes. It's the same Claude Code, so the same commands work in its terminal.

## 16. Known caveats

- gitleaks' staged-files scan has a reported bug (issue #2281) that can miss a secret. There is no second scan on GitHub, so glance at your diff for keys before pushing.
- Nothing checks Dependabot pull requests automatically. Test them locally (8.9) before merging.
- The Stop hook, the audits, and plugin loading were tested with scripts and a dry-run project, not yet over a long real project. Watch them in your first real project.
- `CODEOWNERS` and `.claude/settings.json` mention `therafiniac`. Change both if your GitHub username changes.
