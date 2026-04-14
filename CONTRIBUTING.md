# Contributing Guide

This guide defines the team workflow for branches, commits, and pull requests.

## Branch model

- `main`: stable branch for release-ready code.
- `development`: integration branch for completed features.
- `feature/<module-or-task>`: short-lived branch for one task or feature.

Create feature branches from `development`:

```bash
git checkout development
git pull --ff-only origin development
git checkout -b feature/<name>
```

## Daily branch sync

Keep your feature branch updated with `development` at least once per day.

Option A (preferred for a linear history):

```bash
git checkout feature/<name>
git fetch origin
git rebase origin/development
```

Option B (simpler, no history rewrite):

```bash
git checkout feature/<name>
git fetch origin
git merge origin/development
```

Use one approach consistently across the team.

## Commit quality

- Commit small, focused changes.
- Use clear commit messages.
- Do not mix unrelated backend and frontend changes in one commit when possible.

Suggested commit style:

```text
feat(bookings): add booking approval endpoint
fix(auth): validate Google token audience
docs(api): update Swagger endpoint notes
```

## Pull request rules

- Open PRs from `feature/*` into `development`.
- Require at least one review.
- Ensure tests pass before merge.
- Keep PR scope small enough to review in one sitting.

## Merge policy

- Prefer fast-forward only merges when merging locally:

```bash
git checkout development
git pull --ff-only origin development
git merge --ff-only feature/<name>
git push origin development
```

- If fast-forward fails, sync your feature branch first, then retry.

## Cleanup after merge

After a feature is merged:

```bash
git branch -d feature/<name>
git push origin --delete feature/<name>
```

This keeps local and remote branch lists clean.

## Safety rules

- Never force-push shared branches (`development`, `main`).
- Force-push only your own feature branch and only after rebasing.
- Before risky operations, always check:

```bash
git status -sb
git branch -vv
git log --oneline --graph --decorate -n 20
```

## Conflict handling

- Resolve conflicts in your feature branch, not directly in `development`.
- Re-run tests after conflict resolution.
- Ask for a review when conflict resolution changes business logic.

## Definition of done

A task is done when all are true:

- Code is committed to a feature branch.
- Branch is up to date with `development`.
- Tests pass locally.
- PR is reviewed and merged into `development`.
- Feature branch is deleted.
