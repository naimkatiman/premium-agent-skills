# Security policy

## Posture

These skills are designed to run with least privilege:

- **Read-only by default.** Repo Improvement Architect inspects and plans; it
  edits files or runs commands only after explicit approval.
- **No network by default.** External calls (GitHub API, OpenAI API, remote MCP)
  are opt-in and require credentials you provide.
- **No telemetry.** Nothing is uploaded. Generated artifacts stay local.
- **Artifact writes are scoped.** Generators write to `assets/`, a chosen output
  path, or a temp directory, not arbitrary locations.

## Reporting a vulnerability

Report suspected vulnerabilities privately via GitHub Security Advisories
(repository → Security → Report a vulnerability) or by opening a minimal issue
that does not disclose exploit detail and asking a maintainer to follow up.

Please include:

- affected file or skill,
- reproduction steps,
- impact and any suggested fix.

We aim to acknowledge within a few days. Do not open a public issue containing a
working exploit.

## Hardening notes for integrators

- Keep API keys in environment variables or a secret manager; never commit them.
- When exposing these skills over MCP or a hosted service, require approval for
  write and command tools and allowlist outbound domains.
- Pin GitHub Actions to full commit SHAs and require status checks on protected
  branches.
