# premium-agent-skills (plugin bundle)

This directory is the installable plugin: `.claude-plugin/plugin.json` (Claude Code
and Grok) and `.devin-plugin/plugin.json` (Devin), plus the three skills.
Codex uses the repo-root `.codex-plugin/plugin.json`, which points at `skills/` here.
It is intentionally free of any `package.json` so the plugin
installer just copies it (no `npm install`, no workspace symlinks).

The npm/TypeScript project (schemas, validators, examples, tests, CI) lives at the
repository root and is developer tooling, not part of the installed plugin.

## Skills

- `skills/repo-improvement-architect/` — bounded, evidence-backed repo audits and CI triage.
- `skills/avatar-motion-forge/` — original premium mascot SVG + Lottie/Rive motion specs.
- `skills/reconcile/` — typed only (`/premium-agent-skills:reconcile`): verify production, snapshot and fast-forward the primary checkout, clean up local worktrees and merged branches.

## Install

Claude Code, from a session:

```text
/plugin marketplace add naimkatiman/premium-agent-skills
/plugin install premium-agent-skills@premium-agent-skills
```

Codex, in a terminal:

```text
codex plugin marketplace add naimkatiman/premium-agent-skills
codex plugin add premium-agent-skills@premium-agent-skills
```

Grok, in a terminal:

```text
grok plugin marketplace add naimkatiman/premium-agent-skills
grok plugin install premium-agent-skills --trust
```

Devin:

```text
devin plugins install naimkatiman/premium-agent-skills#plugins/premium-agent-skills
```

The command that starts reconcile depends on the agent. See the root [README](../../README.md).
