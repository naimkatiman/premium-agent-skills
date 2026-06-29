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

1. Edit `skills/<name>/SKILL.md`. Keep the base instructions tight; push detail
   into `references/`.
2. If you add an output field, update the Zod schema in `packages/core/src/` and
   its tests.
3. Add or update an eval case in `skills/<name>/evals/evals.json`.
4. Run `npm run verify`.

## Adding an asset

- Place SVGs in `assets/icons/`. They must pass `npm run validate:svg` (no paint
  id referenced without `url(#...)`).
- Place motion JSON in `assets/motion/`. It must pass `npm run validate:json`.

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
