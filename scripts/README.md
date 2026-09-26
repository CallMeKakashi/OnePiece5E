# Discord export script

Exports selected Discord channels to `Discord/exports/` as Obsidian-friendly markdown. Channel registry: [[Discord/_index|Discord/_index]].

## Setup

```powershell
Copy-Item discord-channels.example.json discord-channels.json
# Edit discord-channels.json if you need local overrides (gitignored)

python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Set `DISCORD_BOT_TOKEN` in `../.env`.

## Channels (example config)

| Channel | Channel ID | Export slug | Purpose |
|---------|------------|-------------|---------|
| `#world-lore` | `1382564722293080124` | `world-lore` | In-world headlines → [[Timeline|Timeline]] newspapers |
| `#downtime-actions` | `1382564699228606474` | `downtime-actions` | Between-session character actions |
| `🎨│character-art` | `1453435491117432916` | `character-art` | PC art, tokens, portrait references |
| `🍈│devil-fruit-dex` | `1382564751527251968` | `devil-fruit-dex` | Campaign devil fruit registry |
| `🧬│bounty-posters` | `1382564599877861389` | `bounty-posters` | Marine bounty poster images |

## Run

```powershell
python discord_export.py
python discord_export.py --channels 1382564722293080124 1453435491117432916
```

## Reconcile (after export)

```powershell
python discord_reconcile.py            # new messages vs last commit
python discord_reconcile.py --since HEAD~1
```

Writes `Discord/reconcile.md`: only messages new since the given revision, each with a checkbox and the vault notes its names match. It never edits notes. Review it and update notes by hand, then commit the exports so the next run starts from them.

Do **not** use `discord_vault_sync.py` / `discord_vault_sync_full.py`: they overwrite curated notes from hardcoded, stale data.
