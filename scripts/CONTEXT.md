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

## Script inventory

Recurring:
- `discord_export.py`: exports selected Discord channels to markdown (`discord-channels.json`).
- `discord_reconcile.py`: writes `Discord/reconcile.md`, messages new since a git revision matched to vault notes.
- `sync_foundry_live_markdown.py`: syncs live Foundry world actors into vault notes as `statblock` fences.
- `sync_foundry_statblocks.py`: syncs workshop JSON into the vault (templates only, not live sheets).
- `sync_foundry_actor_registry.py`, `foundry_statblock.py`: actor registry and Foundry JSON to Fantasy Statblocks conversion.
- `sync_quartz_content.py`: copies publishable vault content from `planning` into `v4/content/`; `set_publish_true.py` sets `publish: true` for those folders.
- `refresh_devil_fruit_notes.py`: refreshes Devil Fruits notes (images, template).

One-time or historical (check before re-running): `migrate_mm_npcs_to_world.py`, `migrate_sessions.py`, `batch_transcript_slices.py` (episodes 10-25), `rebuild_sessions_hub.py`.

