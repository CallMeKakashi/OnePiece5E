# Sync scripts

Python automation bridging the vault to Discord, Foundry, and the published wiki. Part of the multi-context Blood & Brine repo — see [CONTEXT-MAP.md](../CONTEXT-MAP.md).

## Language

**Sync scripts**:
Python automation in `scripts/` bridging the vault to Discord, Foundry, and the published wiki. A mix of recurring sync jobs (Discord export, Foundry actor/statblock sync, Quartz publish) and one-time migrations — check the specific script before assuming either.
_Avoid_: Confusing with `op5e/scripts/` (op5e's own build scripts — same folder name, different project)

**Quartz**:
The static site generator that builds the published GitHub Pages wiki from vault content, run on the `v4` branch.
_Avoid_: Crediting "Obsidian plugins" for the published site — those are for local authoring only

**planning branch / v4 branch**:
`planning` is the live working branch for this vault (content + tooling). `v4` is an orphan branch — unrelated git history — holding only the Quartz `content/` tree, synced from `planning` by content-copy, not merge.
_Avoid_: Treating `v4` as mergeable with `planning`

