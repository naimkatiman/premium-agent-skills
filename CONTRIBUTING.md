# Contributing

Thanks for your interest. This repo ships two Agent Skills plus thin adapters.
Keep changes small and single-concern.

## Ground rules

- One concern per pull request. Skill content, tooling, and CI ship separately.
- Skills are instruction-first. Scripts are optional helpers, not the essence.
- For Avatar Motion Forge, every mascot contribution must pass the originality
  checklist and include a divergence note. Submit only assets you have the right
  to license under MIT.

## Local setup

```bash
npm install
npm run verify
```

`npm run verify` runs the full gate: TypeScript typecheck, vitest, JSON
validation, and SVG sanity checks. All four must pass before a PR.

## Adding or editing a skill

1. Edit `plugins/premium-agent-skills/skills/<name>/SKILL.md`. Keep the base
   instructions tight; push detail into `references/`.
2. If you add an output field, update the Zod schema in `packages/core/src/` and
   its tests.
3. Add or update an eval case in
   `plugins/premium-agent-skills/skills/<name>/evals/evals.json`.
4. Run `npm run verify`.

The installable plugin lives under `plugins/premium-agent-skills/` and carries no
`package.json`; the npm/TypeScript project at the repo root is developer tooling.

## Adding an asset

- Place SVGs in `assets/icons/`. They must pass `npm run validate:svg` (no paint
  id referenced without `url(#...)`).
- Place motion JSON in `assets/motion/`. It must pass `npm run validate:json`.

## Dependency changes (avoid the Windows lockfile trap)

When you bump a dependency, regenerate `package-lock.json` in a way that keeps
optional, platform-specific transitive deps for every OS. A plain `npm install`
on Windows prunes Linux-only optionals (for example `@emnapi/core`,
`@emnapi/runtime`), which then breaks `npm ci` on Linux CI with an out-of-sync
error.

Safe options:

- Regenerate the lockfile on Linux (or WSL), or
- For a single-package bump, restore the committed lockfile and surgically edit
  only the changed entry, then confirm with `npm ci` locally.

Verify with `npm ci` (not just `npm install`) before opening the PR; `npm ci` is
what CI runs and it enforces lockfile sync.

## Commit style

Conventional commits, outcome-first:

```text
feat(repo-architect): emit verification commands for pnpm workspaces
fix(avatar): reference owl tuft gradient with url(#owlB)
```

## Pull requests

- Describe the observable change, not just the mechanism.
- Link any issue it closes.
- Confirm `npm run verify` passes in the description.
