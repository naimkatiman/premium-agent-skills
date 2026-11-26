---
name: reconcile
description: Use only when the user explicitly asks to reconcile a repository with origin and production, or to clean up local worktrees. Verifies what is deployed, snapshots and fast-forwards the primary checkout, removes proven obsolete worktrees and merged local branches, and reports. Do NOT use for ordinary commits, pushes, or PRs.
disable-model-invocation: true
---

# Reconcile repository and deployment state

Use the repository named by the user, or the current repository if they name none. Read its rules and release runbook before touching Git or querying providers. Use this workflow only on direct request.

## Modes

- `reconcile` (default) runs end to end without a confirmation round. It verifies production and origin, snapshots any local work in the primary checkout into a verified recovery ref, fast-forwards the primary checkout to the verified origin default, removes proven obsolete local worktrees and stale registrations, deletes safely merged local branches, and reports. Invoking it is the user's authorization for those local actions. Do not stop at a list of recommendations when the next step is one of them: carry it out, then report.
- `reconcile audit` reports the same evidence and candidates without changing local branches, worktrees, stashes, or remote refs. Use live ref queries and existing local objects. Mark comparisons that need a fetch as unverified.
- `reconcile cleanup` is the same as the default. It remains for compatibility.
- `reconcile remote-audit` reports deployment alignment and remote branch cleanup candidates using read-only probes.
- `reconcile remote-cleanup` authorizes guarded deletion of eligible merged branches on the verified origin. Remote modes operate on hosted branches only. Explicit natural-language requests carry the same scope.

The default never pushes, opens PRs, merges, deploys, applies migrations, deletes remote branches, drops stashes, or force-removes anything. Production mutations, protected merges, branch renames, pushes and remote deletions require separate authority from the user and the repository workflow. Record any scope you cannot complete and continue the independent safe actions.

## Guards and shells

- If a guard hook blocks a command, answer its questions in prose. If it blocks again, leave that step undone and report it. Never reach the same effect through a different command to avoid the guard.
- On Windows, read [`references/windows-shell.md`](references/windows-shell.md) before running Git commands. Git Bash path conversion and `node_modules` junctions both cause silent wrong results here.
- Prove the procedure on a disposable repository with [`scripts/fixture-test.sh`](scripts/fixture-test.sh) after changing this skill.

## 1. Establish Git and session state

Identify the primary checkout from the first entry in `git worktree list --porcelain`. A linked worktree's top level is that worktree. Run primary commands against its verified absolute path. Snapshot the primary and affected linked worktrees. Ask any session tracker and release queue the host provides which paths are in use, if available. Resolve Git operation markers through `git rev-parse --git-path`, including merge, rebase, cherry-pick, revert, bisect, and index-lock markers. Re-read the branch, HEAD, status, and ownership immediately before each mutation. Leave any shifted or uncertain checkout in place.

```text
git rev-parse --show-toplevel
git rev-parse --path-format=absolute --git-common-dir
git rev-parse HEAD
git symbolic-ref --quiet --short HEAD
git rev-parse --abbrev-ref --symbolic-full-name "@{upstream}"
git status --porcelain=v1 --untracked-files=all
git diff --stat
git diff --cached --stat
git stash list
git worktree list --porcelain
git remote get-url --push --all origin
git ls-remote --symref origin HEAD
```

An upstream query can fail on a detached branch or an untracked local branch. Treat the result as missing, never as equal. Reuse an already installed `ci-reconcile --snapshot` if available, and check staged, unstaged, and untracked state independently. A zero unstaged diff does not prove cleanliness. Inspect ignored data separately before cleanup.

Verify `origin` is the repository's canonical remote. Resolve the live default and its full SHA through the remote HEAD symref or repository hosting API. Use the established local `main` or `master` that tracks it. Prefer the same name when it tracks the verified origin branch. For a same-named branch without an upstream, check the repository rules and ancestry before adding tracking. A differently named protected origin branch can have a documented local alias. Verify its upstream mapping. If the mapping is ambiguous, ask and preserve the current branches. Names of production environments or Pages branches alone do not establish Git's default.

## 2. Verify what is running

Use the repository's release queue, deployment receipts, provider metadata and health probes. Find the active deployment by traffic or production alias for every affected target. Check each Worker, Pages site, service, and relevant live data change independently. Record deployment ID, actual source SHA or artifact evidence, and live probe. A PR head, timestamp, health response, or queued job alone does not prove the deployed source.

For Cloudflare: `wrangler deployments list` (the version at 100% and its message), `wrangler pages deployment list --project-name <p> --environment production` (the source column), and the same asset manifest on the immutable deployment URL, the pages.dev alias, and every custom domain.

When D1 or another migration system is relevant, read the full applied ledger by exact filename (`SELECT name FROM d1_migrations` is small and bounded) and compare it with the origin default's migration files, not the local checkout's. Report both directions:
- pending: origin files missing from the ledger;
- ledger-only: applied names with no file on origin. For each, find the source (`git log --all -- migrations/<name>`, `git grep <name> origin/<default>`), check whether that branch exists on origin or in a PR, and classify it as a documented renumber or as production-only data drift whose source lives only locally.

Compare each live source with the live origin default. Use commit ancestry and the diff for that target's deployable tree, shared dependencies, configuration and migrations. For squash merges or build commits outside default ancestry, require reviewed PR or artifact provenance and prove equivalent relevant contents. Different Worker and Pages SHAs can be compatible if each target's deployed content matches. Report any origin-only or production-only changes. Mark source or provider access you could not prove as unverified. Use not applicable only when the repository's release configuration confirms it has no deployed target.

For genuine drift, identify the exact missing commits or live changes and the owning release. If the user authorizes integration or deployment, use the repository's protected PR and release path on the reviewed scope. An already applied migration keeps its recorded filename and is reconciled through source review. Do not replay it or deploy an older source to force parity.

## 3. Align the primary checkout

Fetch the verified origin default. Compare with `git rev-list --left-right --count <local>...<remote>`.

- Ahead or diverged: preserve the history, report the exact counts, and skip the fast-forward.
- The desired branch is checked out in another worktree: confirm that checkout is clean, inactive, and yours to release before detaching it at its existing commit. Otherwise report the owner or blocker. Updating another worktree does not satisfy a request to update the primary one.
- Equal or strictly behind with a clean tree: `git switch --no-overwrite-ignore <local>` if needed, then `git merge --ff-only --no-overwrite-ignore <remote>`.
- Strictly behind with local work: in the default mode, take a verified snapshot and fast-forward.

### Snapshot local work before the fast-forward

1. Classify every path from `git status --porcelain=v1 --untracked-files=all` against the fetched default, and write the result to a scratch manifest (`class`, status code, `git hash-object <path>`, path):
   - `IDENTICAL`: the working file already equals `origin/<default>:<path>`;
   - `UNCHANGED-UPSTREAM`: local edit, upstream blob equals HEAD's;
   - `COLLIDES`: local edit and upstream changed the file;
   - `LOCAL-ONLY`: not on origin at all.
2. Check untracked directories for junctions, symlinks and nested repositories. If any exist, or an ignored path would be overwritten, leave the checkout in place and report it.
3. Re-check branch, HEAD and markers, then `git stash push --include-untracked -m "reconcile-<YYYYMMDD>: <branch> <short-sha> pre-ff snapshot (<n> paths)"`.
4. Verify every manifest row: tracked paths against `<stash>:<path>`, untracked paths against `<stash>^3:<path>`. Any mismatch means stop: do not fast-forward, and report the mismatch.
5. Pin it: `git update-ref refs/recovery/reconcile-primary-<YYYYMMDD> <stash-sha>` (add a suffix if the ref exists). Never drop the stash.
6. Confirm the tree is clean, then fast-forward as above and confirm 0 ahead / 0 behind.

Leave the primary checkout clean at the origin default. Do not restore snapshot files into it. Report each class with counts, list the `UNCHANGED-UPSTREAM` and `LOCAL-ONLY` paths by name (those hold work that is not on origin), and give the recovery commands: `git show <ref>:<path>` for tracked files and `git show <ref>^3:<path>` for untracked ones. A local-only harness file such as `.claude/settings.local.json` is reported with its diff so the user can re-apply it.

## 4. Clean up worktrees and local branches

Inventory every registration from `git worktree list --porcelain` and classify each one with a scratch script that runs `git status --porcelain` in each path and `git merge-base --is-ancestor <head> origin/<default>`: `MISSING`, `LOCKED`, `DIRTY`, `CLEAN-UNMERGED`, `CANDIDATE`. Save the table in the scratch directory and cite its path. `git worktree prune --dry-run --verbose` is a preview only.

**Always keep:** the primary checkout; worktrees owned by the release queue (its `state/worktrees/` paths and any path in an active job); paths an active session lists in the tracker; locked or leased worktrees whose lock is not proven stale; dirty, staged or untracked work; unique commits; open PR heads; worktrees other worktrees or release jobs depend on; ignored release evidence. Stashes are never dropped.

**Removable worktree (`CANDIDATE`):** verified absolute path and common Git directory, stable HEAD, clean tracked and untracked state, HEAD reachable from the verified default (or the exact head of a merged PR whose merge is on the default), not locked, not claimed by any session or release job. Before removal:
- list ignored contents (`git status --ignored --porcelain`). Generated output (`node_modules`, `build`, `dist`, `.wrangler`, caches) is disposable. Anything else, such as receipts, evidence, logs or `.env` files, means keep the worktree and report it;
- find junctions and other reparse points. Unlink each verified generated junction, then confirm its target still exists;
- remove by explicit path with `git worktree remove "<path>"`. Never pass `--force`. If Git refuses, keep the worktree and report why.

**Missing registration:** the directory is gone and the drive and canonical path are available. Clear it with `git worktree remove "<path>"` or a targeted `git worktree prune` only when all of these hold:
- no operation markers in its private Git directory;
- its HEAD is retained by the default, a branch ref, or a recovery ref;
- it is not locked, or its lock is stale: the lock is more than 7 days old, the lock owner is not active in the session tracker or release queue, and the HEAD is retained.

Unlock a stale lock with `git worktree unlock "<path>"`, then remove that one registration. Never run a broad prune. Keep any missing registration that fails a check, and report which check it failed.

**Local branches**, after the worktree pass: delete a branch with `git branch -d <name>` (never `-D`) only when its tip is reachable from the verified origin default (or is the exact head of a merged PR), it is not the default or an alias, it is not checked out in any remaining worktree, it is not an open PR head or base, and no recovery ref, release job or deployment receipt names it. Preserve any branch that Git or a guard refuses to delete.

Re-check each candidate's HEAD, status, lock, and session ownership immediately before acting on it. Measure the reclaimed disk space (sum of removed directory sizes before removal) and include it in the report.

## 5. Reconcile remote branches

Only in `remote-audit` and `remote-cleanup`.

1. Resolve all effective push URLs with `git remote get-url --push --all origin`. Require one verified destination and match its repository identity to the canonical origin and hosting API. Read the live default and full `refs/heads/` names with their commit IDs from that destination. Remote-tracking refs alone are insufficient.
2. Check current branch protection and rulesets, all open PR heads and bases, configured release and deployment branches, active release jobs and worktree owners, deployment evidence, and recovery refs. Preserve default branches and aliases, protected branches, active branches, and any branch with uncertain protection or dependencies.
3. An eligible tip is an ancestor of the verified current default or is the exact head of a merged PR whose merge commit remains on that default. Preserve any unaccounted commits and any source or rollback commit that would lose its only retained ref. Report each eligible full ref and expected full commit ID before applying. If the user names a narrower set, keep that scope.
4. In remote-audit, stop after the read-only inventory. In remote-cleanup, recheck the destination, default, every candidate tip, and every exclusion immediately before the repo-approved deletion. Use a deletion-only operation with one explicit expected-tip lease per full ref, atomic when batching. For Git push, use explicit deletion refspecs and disable automatic tag following with `--no-follow-tags`. Keep the hooks and protections active. Preserve any branch whose tip or eligibility changed, and any branch for which exact-tip protection is unsupported or denied. A rejected atomic batch requires a fresh inventory before any retry. [Git push documentation](https://git-scm.com/docs/git-push) [Git stale-tip deletion test](https://github.com/git/git/blob/v2.52.0/t/t5533-push-cas.sh#L161-L189)
5. Confirm absence of each approved ref on the same destination. For an exact `git ls-remote --exit-code --refs` lookup, exit 2 confirms no match. Verify an exit 0 result against the full ref and report other failures as unverified. Recheck the live default and the branches you intended to preserve.

## 6. Verify and report

Re-read live origin HEAD, local branch and HEAD, ahead or behind counts, and working-tree status. Compare the result with the deployed targets and recheck production if it changed. Re-list worktrees and branches to confirm each removal, each recovery ref, and each retained dependency target.

Report, answer first:
- local branch and SHA, origin branch and SHA, ahead/behind, tree status;
- each deployed target's live source and status, and the migration ledger result in both directions;
- the snapshot ref and its class counts, naming the paths that hold work not on origin;
- worktrees removed (count, disk space reclaimed), registrations cleared, local branches deleted;
- what was kept, grouped by reason (release queue, active session, locked, dirty, unmerged, ignored evidence, failed check);
- every step a guard blocked or you skipped, and why.

End with only the decisions that need the user (pushes, PRs, production drift, protected actions), each with your recommendation. Do not list as open anything this run was authorized to do. Claim complete synchronization only for the surfaces you verified. If the run made a decision worth keeping, record it in the repository's memory store.
