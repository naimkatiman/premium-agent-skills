# Claude Code example

## Install the plugin

From a Claude Code session:

```text
/plugin marketplace add naimkatiman/premium-agent-skills
/plugin install premium-agent-skills@premium-agent-skills
```

Or use the skills directly without the marketplace by copying `skills/` into your
project's `.claude/skills/` (project scope) or `~/.claude/skills/` (user scope).

## Use the skills

```text
/premium-agent-skills:repo-improvement-architect
Audit this repo for the smallest high-value change that improves CI reliability.
Constraints: no framework migration, no dependency upgrades above minor.
```

```text
/premium-agent-skills:avatar-motion-forge
Mascot: owl. Traits: precise, calm, premium.
Avoid: childish proportions, copied chat-assistant iconography.
States: idle, hover, active, success, error.
Output: 3 SVG concepts + a Lottie starter + a Rive state plan.
```

## Notes

- Skills declare `allowed-tools`; Claude Code enforces them. Repo Improvement
  Architect is read-only by default and only edits after you approve a scoped
  change.
- The skill returns its JSON contract first, then a human summary. Validate the
  JSON with `@premium-agent-skills/core` if you wire it into a pipeline.
