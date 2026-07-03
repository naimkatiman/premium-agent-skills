# Premium Agent Skills

Two open-source Agent Skills for Claude Code, Codex, and OpenAI-style tool
integrations:

- **Repo Improvement Architect**, repo audits, CI triage, and bounded,
  evidence-backed refactor plans.
- **Avatar Motion Forge**, original premium agent-avatar creation, SVG concepts,
  and Lottie/Rive motion-state planning.

Built on the open Agent Skills format (`SKILL.md` + optional `references/`,
`scripts/`, `evals/`), so the same skill content runs across skills-capable
agents instead of being locked to one runtime.

## Why this exists

A skill is the stable unit of reuse. Plugins, MCP, and function tools are just
adapters around it. This repo keeps the value in two `SKILL.md` files and exposes
them three ways: a Claude Code plugin, a Codex plugin, and OpenAI function-tool
or MCP integrations.

## Skills

### Repo Improvement Architect

Turns a repository, diff, issue, or failing CI run into a prioritized improvement
plan plus the smallest safe next change, with evidence and verification steps.
Read-only by default; it edits only after you approve a scoped change.

- Skill: [`plugins/premium-agent-skills/skills/repo-improvement-architect/SKILL.md`](plugins/premium-agent-skills/skills/repo-improvement-architect/SKILL.md)
- Output contract: [`references/output-schema.md`](plugins/premium-agent-skills/skills/repo-improvement-architect/references/output-schema.md)

### Avatar Motion Forge

Turns a mascot brief into 2–3 original SVG concepts plus a state-driven motion
spec (idle, hover, active, success, error), a Lottie starter, and a Rive
storyboard. Enforces an originality gate; it will not clone an existing product
mascot.

- Skill: [`plugins/premium-agent-skills/skills/avatar-motion-forge/SKILL.md`](plugins/premium-agent-skills/skills/avatar-motion-forge/SKILL.md)
- Originality gate: [`references/originality-checklist.md`](plugins/premium-agent-skills/skills/avatar-motion-forge/references/originality-checklist.md)

## Install

### Claude Code

```text
/plugin marketplace add naimkatiman/premium-agent-skills
/plugin install premium-agent-skills@premium-agent-skills
```

See [`examples/claude-code`](examples/claude-code/).

### Codex

```text
codex plugin marketplace add naimkatiman/premium-agent-skills
```

Or drop the skill folders under `.agents/skills/` in your repo. See
[`examples/codex`](examples/codex/).

### OpenAI (Responses API / Agents SDK)

```bash
cd examples/openai-js && npm install && OPENAI_API_KEY=... npm run responses
```

JavaScript and Python examples live in [`examples/openai-js`](examples/openai-js/)
and [`examples/openai-python`](examples/openai-python/). A remote-MCP config is in
[`examples/openai-js/mcp.json`](examples/openai-js/mcp.json).

## Repository layout

```text
plugins/premium-agent-skills/   installable plugin bundle (no package.json):
  .claude-plugin/plugin.json     Claude Code plugin manifest
  skills/                        the two skill folders (SKILL.md + references/scripts/evals)
.claude-plugin/marketplace.json  marketplace manifest (source -> plugins/premium-agent-skills)
.codex-plugin/plugin.json        Codex plugin manifest
packages/core/                   shared Zod schemas + validators for the output contracts
packages/openai-tools/           function-tool and MCP definitions
examples/                        Claude Code, Codex, OpenAI JS/Python integration demos
assets/                          original SVG concepts + Lottie starter
scripts/                         JSON and SVG validators used by the verify chain
```

The plugin bundle under `plugins/premium-agent-skills/` deliberately carries no
`package.json`; the npm/TypeScript project at the repo root is developer tooling
and is not part of the installed plugin.

## Develop

```bash
npm install
npm run verify     # typecheck + tests + JSON + SVG validation
```

Individual gates: `npm run typecheck`, `npm run test`, `npm run validate:json`,
`npm run validate:svg`.

## Security and permissions

- Read-only by default. File writes, command execution, and network access are
  approval-gated, not assumed.
- No telemetry, no prompt or asset upload by default. Artifacts are generated
  locally.
- See [`SECURITY.md`](SECURITY.md).

## Originality and IP

Avatar Motion Forge produces original work only. It refuses to clone or closely
imitate any existing product mascot, and every generated mascot ships with a
divergence note. See [`originality-checklist.md`](skills/avatar-motion-forge/references/originality-checklist.md).

## Status

| Component | Status |
|---|---|
| Repo Improvement Architect | beta |
| Avatar Motion Forge | beta |
| Lottie starter assets | shipped |
| Rive production exports | roadmap (v0.2) |
| Hosted MCP server | not included in v0.1.0 |

## License

MIT. See [`LICENSE`](LICENSE).
