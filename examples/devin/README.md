# Devin example

Devin installs one plugin folder. This repo keeps that folder at
`plugins/premium-agent-skills/`, with `.devin-plugin/plugin.json` (Devin reads
this ahead of `.claude-plugin/plugin.json`).

## Install

```text
devin plugins install naimkatiman/premium-agent-skills#plugins/premium-agent-skills
```

Devin shows what the plugin adds before it installs. Add `-y` only when you
already trust the source and want to skip that prompt.

From Customize → Plugins → Add plugin → From repository, use
`naimkatiman/premium-agent-skills` and subdirectory
`plugins/premium-agent-skills`.

## Run reconcile

The plugin name is the slash-command namespace:

```text
/premium-agent-skills:reconcile
```

The skill sets `triggers: [user]`, so Devin runs it when you type it. A normal
request to commit, push, or open a PR does not start it. `reconcile audit` is
the read-only mode.

## Notes

- Installing the repository root without `#plugins/premium-agent-skills` does
  not install this plugin. The skills live in the subfolder.
- `devin plugins info premium-agent-skills` lists the three skills after install.
