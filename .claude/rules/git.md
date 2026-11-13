# Git workflow
Applies to every branch, commit, merge, push, release, and hotfix. The `/rafi:branch`, `/rafi:commit`, `/rafi:merge`, `/rafi:release`, and `/rafi:hotfix` commands carry out these rules; follow them by hand the same way.

## Branches
| Branch | From | Merges into | Holds |
|---|---|---|---|
| `main` | none | none | Production. Every commit on it is a `--no-ff` merge and a tagged release `vX.Y.Z` |
| `dev` | `main`, once, after the scaffold commit | `main` (`--no-ff`) at release | Integration. Deploys to staging |
| `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`, `test/`, `perf/`, `ci/` + `<kebab-name>` | `dev` | `dev` (`--no-ff`) | One feature, fix, or change |
| `release/<x.y.z>` (optional) | `dev` | `main` (`--no-ff`), then back into `dev` | Release stabilization: version, changelog, release-only fixes |
| `hotfix/<name>` | `main` | `main` (`--no-ff`, patch tag), then back into `dev` | An urgent production fix |

- Never commit directly on `main` or `dev`. They change only through `--no-ff` merges.
- One branch per change. Delete it locally and on the remote after it is merged.
- Before merging a work branch: update it with `dev` (rebase if never pushed, otherwise merge `dev` into it), then `pnpm check`, `pnpm build`, `/rafi:code-review`, and the matching audits must pass.
- Never force-push `main` or `dev`. On your own work branch, only `--force-with-lease`.

## Commits
- Header: `type(scope): subject`. Scope is required, lowercase kebab-case (`feat(auth): add password reset`). Subject in imperative mood, lowercase start, no trailing period, header at most 72 characters.
- Types: `feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`, `style`, `revert`.
- Body (optional, wrapped at 72): why the change was made, not what the diff shows.
- Footer: `BREAKING CHANGE: <what breaks and what to do>` for breaking changes; `Refs: #<issue>` when there is one.
- One logical change per commit. Commit only after `pnpm check` passes.
- No attribution of any kind: no `Co-authored-by`, no tool or AI names, links, or "generated with" lines. Commits are authored by the repository owner's git identity. The commit-msg hook rejects attribution lines.

## Merge mode
The project's mode is set in `CLAUDE.md` (`Merge mode: local` or `Merge mode: github`).
- `local`: merge on this machine with `git merge --no-ff`, push the target branch, delete the work branch.
- `github`: push the work branch and open a pull request into `dev` (or `main` for a release or hotfix). Merge on GitHub with **Create a merge commit** only; squash and rebase merging are disabled in the repository settings.
Either way, the target branch's CI must be green before merging into `main`.

## Releases
- Version from Semantic Versioning, derived from commits since the last tag: any `BREAKING CHANGE` → major, else any `feat` → minor, else patch.
- `CHANGELOG.md`: the `[Unreleased]` section becomes `[x.y.z] - YYYY-MM-DD`.
- Tag the merge commit on `main` with an annotated tag: `git tag -a vX.Y.Z -m "vX.Y.Z"`, then push the tag.
- Without a release branch: prepare the version and changelog on `chore/release-x.y.z`, merge it into `dev`, then merge `dev` into `main`.
- With a release branch: only release fixes land on `release/x.y.z`; after the merge into `main`, merge it back into `dev`.

## Environments
- `dev` deploys to staging automatically. `main` deploys to production automatically.
- Each environment has its own env vars, database, and third-party keys. Staging never uses production data or keys.
