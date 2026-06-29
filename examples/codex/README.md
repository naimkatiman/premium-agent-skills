# Codex example

Codex treats **skills** as the open authoring format and **plugins** as the
installable distribution unit. Two ways to use these skills:

## A. Repo-scoped skills (no install)

Codex scans `.agents/skills` up the repository tree. Drop the skill folders there:

```text
your-repo/
  .agents/
    skills/
      repo-improvement-architect/
        SKILL.md
      avatar-motion-forge/
        SKILL.md
```

Then ask Codex to "audit this repo for bounded improvements" or "design a premium
original mascot with idle/hover/active/success/error states" and the matching
skill activates via progressive disclosure.

## B. Plugin install

This repo ships a `.codex-plugin/plugin.json` manifest. Add it as a local
marketplace for testing, or install from the GitHub source per your Codex
version's plugin flow:

```text
codex plugin marketplace add naimkatiman/premium-agent-skills
```

## Notes

- Codex sandboxing and approvals apply: the repo-improvement skill stays
  read-only until you approve a write or a command.
- Skill content is identical across Claude Code and Codex, one `SKILL.md` source.
