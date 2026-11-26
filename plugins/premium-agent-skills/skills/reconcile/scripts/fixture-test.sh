#!/usr/bin/env bash
# Disposable fixture for the reconcile default mode.
# Usage: fixture-test.sh [new-directory]
# Builds a throwaway origin, primary checkout and worktrees inside a directory
# that must not exist yet (default: a fresh mktemp directory), then checks the
# snapshot, fast-forward and cleanup steps. Never touches any other repository.
set -u
export MSYS_NO_PATHCONV=1
if [ $# -ge 1 ]; then
  ROOT="$1"
  if [ -e "$ROOT" ]; then echo "refusing: $ROOT already exists" >&2; exit 2; fi
  mkdir -p "$ROOT"
else
  ROOT=$(mktemp -d)
fi
echo "fixture: $ROOT"
cd "$ROOT"
q() { git "$@" >/dev/null 2>&1; }
pass=0; fail=0
check() { if eval "$2"; then echo "PASS $1"; pass=$((pass+1)); else echo "FAIL $1"; fail=$((fail+1)); fi; }

q init --bare -b master origin.git
q clone origin.git seed; cd seed
git config user.email f@x; git config user.name f
printf 'a\n' > collide.txt; printf 'b\n' > keep.txt; printf 'c\n' > same.txt
q add -A; q commit -m base; q push origin master
cd ..; q clone origin.git primary; cd primary; git config user.email f@x; git config user.name f
# merged branch + worktree, unmerged branch + worktree, missing registration
q branch merged-br; q worktree add ../wt-merged merged-br
q worktree add -b unmerged-br ../wt-unmerged; (cd ../wt-unmerged && echo u > u.txt && git add u.txt && git -c user.email=f@x -c user.name=f commit -qm u)
q worktree add -b gone-br ../wt-gone; rm -rf ../wt-gone
q worktree add -b locked-br ../wt-locked; q worktree lock ../wt-locked --reason "active owner"
# upstream moves
cd ../seed; printf 'A2\n' > collide.txt; printf 'c2\n' > same.txt; q commit -am up; q push origin master
cd ../primary
# local work: collides, unchanged-upstream, identical, local-only untracked
printf 'local\n' > collide.txt; printf 'b-local\n' >> keep.txt; printf 'c2\n' > same.txt; mkdir -p new; printf 'n\n' > new/only.txt
q fetch origin master
check "ff blocked while dirty" "! git merge --ff-only origin/master >/dev/null 2>&1"

# manifest + classes
: > ../manifest.tsv
git status --porcelain=v1 --untracked-files=all | while IFS= read -r l; do st="${l:0:2}"; f="${l:3}"; w=$(git hash-object "$f"); u=$(git rev-parse -q --verify "origin/master:$f"); h=$(git rev-parse -q --verify "HEAD:$f"); if [ -z "$u" ]; then c=LOCAL-ONLY; elif [ "$w" = "$u" ]; then c=IDENTICAL; elif [ "$h" = "$u" ]; then c=UNCHANGED-UPSTREAM; else c=COLLIDES; fi; printf '%s\t%s\t%s\t%s\n' "$c" "$st" "$w" "$f" >> ../manifest.tsv; done
check "classes" "[ \"\$(cut -f1 ../manifest.tsv | sort | tr '\n' ' ')\" = 'COLLIDES IDENTICAL LOCAL-ONLY UNCHANGED-UPSTREAM ' ]"

q stash push --include-untracked -m "reconcile-fixture pre-ff"
S=$(git rev-parse 'stash@{0}')
bad=0; while IFS=$'\t' read -r c st w f; do if [ "$st" = "??" ]; then g=$(git rev-parse -q --verify "$S^3:$f"); else g=$(git rev-parse -q --verify "$S:$f"); fi; [ "$g" = "$w" ] || bad=1; done < ../manifest.tsv
check "snapshot hashes verified" "[ $bad = 0 ]"
git update-ref refs/recovery/reconcile-primary-fixture "$S"
check "tree clean after stash" "[ -z \"\$(git status --porcelain --untracked-files=all)\" ]"
q merge --ff-only --no-overwrite-ignore origin/master
check "ff to origin" "[ \"\$(git rev-list --left-right --count master...origin/master | tr -s '\t ' ' ')\" = '0 0' ]"
check "untracked recoverable" "[ \"\$(git show refs/recovery/reconcile-primary-fixture^3:new/only.txt)\" = n ]"
check "tracked recoverable" "git show refs/recovery/reconcile-primary-fixture:keep.txt | grep -q b-local"

# cleanup pass
q worktree remove ../wt-merged
check "merged clean worktree removed" "[ ! -d ../wt-merged ]"
check "unmerged worktree kept" "! git merge-base --is-ancestor \$(git -C ../wt-unmerged rev-parse HEAD) origin/master && [ -d ../wt-unmerged ]"
# missing, unlocked, HEAD retained by branch ref -> clear that one registration
check "missing registration listed" "git worktree list --porcelain | grep -q wt-gone"
q worktree remove ../wt-gone
check "missing registration cleared" "! git worktree list --porcelain | grep -q wt-gone"
check "locked worktree kept" "git worktree list --porcelain | grep -A4 wt-locked | grep -q locked"
q branch -d merged-br; q branch -d gone-br
check "merged branches deleted" "! git show-ref -q refs/heads/merged-br && ! git show-ref -q refs/heads/gone-br"
check "unmerged branch refused by -d" "! git branch -d unmerged-br >/dev/null 2>&1 && git show-ref -q refs/heads/unmerged-br"
check "stash kept" "git stash list | grep -q reconcile-fixture"
echo "pass=$pass fail=$fail"
[ "$fail" = 0 ]
