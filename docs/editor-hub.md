# Editor hub (vault maintenance)

Campaign-facing navigation lives on [[_index]]. This page is for Obsidian setup, templates, Discord exports, and agent tooling — **not** published to GitHub Pages.

## Templates

- [[Templates/_index|Edit templates]]

## Obsidian

- [[docs/obsidian-setup|Obsidian setup]] — hidden folders, CSS snippet, bookmarks

## Discord

- [[Discord/_index|Discord channels]] — channel IDs and export quarry

## Foundry VTT → Obsidian

Hub: [[Foundry/_index|Foundry bridge]]

### Active toolchain

| Piece | Role |
|-------|------|
| **Fantasy Statblocks** (community) | Renders ` ```statblock ` YAML in Live Preview |
| **Blood & Brine Foundry Sync** (custom plugin) | Runs Python sync on note open / command palette |
| `scripts/sync_foundry_live_markdown.py` | Live LevelDB → markdown fences |
| `scripts/sync_foundry_actor_registry.py` | Link Foundry actors to vault + Monster Manual |
| `scripts/foundry_statblock.py` | Foundry JSON → statblock YAML (imported by sync script) |
| `scripts/sync_foundry_statblocks.py` | Workshop JSON kits → `Rules/Stat blocks/` only |
| `.obsidian/plugins/blood-brine-foundry-statblock/foundry-read-actor.mjs` | Node helper to read Foundry LevelDB |

### Commands

```bash
# Per note (what the plugin runs on open)
python scripts/sync_foundry_live_markdown.py --note-only "World/Factions/Marines/Commander Leon.md"

# All linked notes (~117)
python scripts/sync_foundry_live_markdown.py

# Re-link Foundry actors after adding vault pages
python scripts/sync_foundry_actor_registry.py
```

### Removed (legacy)

HTTP relay, `foundry-live` JSON export, DOM statblock injection, and one-off slug scripts — superseded by LevelDB + markdown sync above.

## Other scripts

| Script | Purpose |
|--------|---------|
| `discord_export.py` | Export Discord channels → `Discord/exports/` |
| `discord_vault_sync_full.py` | Curate exports into vault notes |
| `refresh_devil_fruit_notes.py` | Devil fruit note maintenance |
| `sync_quartz_content.py` | GitHub Pages / Quartz publish |
| `set_publish_true.py` | Bulk `publish: true` frontmatter |
| `batch_transcript_slices.py` | Transcript tooling |

Discord setup: [[scripts/README]] (export script only).

## Agents

- [[CONTEXT]] — domain glossary (Session vs Episode, actors, factions)
- [[docs/agents/CORE|Agent core instructions]]
