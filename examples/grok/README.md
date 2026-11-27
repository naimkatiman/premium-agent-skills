# Grok example

Grok installs this repo as a marketplace. The catalog is
`.claude-plugin/marketplace.json` at the repository root. The plugin itself is
`plugins/premium-agent-skills/`.

## Install

```text
grok plugin marketplace add naimkatiman/premium-agent-skills
grok plugin install premium-agent-skills --trust
```

Or in the terminal UI: open `/marketplace`, add the source
`naimkatiman/premium-agent-skills`, then install `premium-agent-skills`.

`--trust` is required. Without it, Grok prints the source and stops.

## Run reconcile

Type the command. Grok does not start this skill on its own
(`disable-model-invocation: true`).

```text
/premium-agent-skills:reconcile
```

If a user skill is also named `reconcile`, the plugin form above is the one
that runs this package. `reconcile audit` is the read-only mode.

## Notes

- A new session, or `r` in the Plugins tab, picks up a plugin you just installed.
- The other two skills in the same plugin can still be selected by the model.
  Reconcile cannot.
