# premium-agent-skills (plugin bundle)

This directory is the installable Claude Code / Codex plugin: `.claude-plugin/plugin.json`
plus the two skills. It is intentionally free of any `package.json` so the plugin
installer just copies it (no `npm install`, no workspace symlinks).

The npm/TypeScript project (schemas, validators, examples, tests, CI) lives at the
repository root and is developer tooling, not part of the installed plugin.

## Skills

- `skills/repo-improvement-architect/` — bounded, evidence-backed repo audits and CI triage.
- `skills/avatar-motion-forge/` — original premium mascot SVG + Lottie/Rive motion specs.

## Install

From the repository root marketplace:

```text
/plugin marketplace add naimkatiman/premium-agent-skills
/plugin install premium-agent-skills@premium-agent-skills
```

See the root [README](../../README.md) for Codex and OpenAI usage.
