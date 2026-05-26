# Obsidian setup — Blood & Brine

How the vault file explorer is trimmed for campaign prep without breaking templates or plugins.

## Design choices

| Decision | Choice |
|----------|--------|
| Scope of hiding | **Explorer only** (CSS) — search, graph, backlinks, Quick switcher still see hidden paths |
| `Discord/`, `Daily/` | Hidden in explorer |
| `Templates/` | Hidden; edit via [[Templates/_index]] |
| Root agent files | `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` hidden; `CONTEXT.md` stays visible |
| Full vault ignore | **Not used** — avoids side effects on templating, sync, publish |

## Hidden folders

| Folder | Reason |
|--------|--------|
| `Categories/`, `Clippings/`, `References/`, `Notes/` | Tier 2 PKM infrastructure ([[docs/agents/CORE]]) |
| `Templates/` | Tier 2 — use [[Templates/_index]] instead |
| `docs/`, `scripts/` | Agent / tooling |
| `Discord/` | Export quarry — curated content lives in `Timeline/`, `World/` |
| `Daily/` | Daily-notes plugin storage — open via command/calendar, not tree |
| `Attachments/` | Images and PDFs — embedded via `![[]]`, no need to browse directly |

## Campaign-visible folders (Tier 1)

`Sessions/`, `Transcripts/`, `Timeline/`, `World/`, `Journals/`, `Rules/`, `source/`

## Implementation files

- **Snippet:** `.obsidian/snippets/hide-infrastructure-folders.css`
- **Enabled in:** `.obsidian/appearance.json`
- **Template hub:** [[Templates/_index]]
- **Campaign hub link:** [[_index#🔧 Maintenance]]

Plugin paths (unchanged by hiding):

| Plugin | Config | Path |
|--------|--------|------|
| Templates | `.obsidian/templates.json` | folder `Templates` |
| Daily notes | `.obsidian/daily-notes.json` | folder `Daily`, template `Templates/Daily Note Template` |
| ZK prefixer | `.obsidian/zk-prefixer.json` | `Templates/Journal Template` |

## One-time setup (you)

1. **Enable the snippet:** **Settings → Appearance → CSS snippets** → turn **on** `hide-infrastructure-folders` (reload the list if it does not appear).
2. Reload Obsidian (Ctrl+R) or toggle the snippet off and on.
3. Open [[Templates/_index]].
4. **Bookmark** that note (right-click → Bookmark — or command palette → Bookmark).

### Snippet not working?

- Confirm the vault is `blood&brine` and the file exists: `.obsidian/snippets/hide-infrastructure-folders.css`.
- Snippets must be **enabled in the Appearance UI** — `appearance.json` alone may not apply until you toggle it once.
- If folders still show: **Ctrl+Shift+I** → inspect a folder row → check which element has `data-path` → report the class name (Obsidian DOM changes between versions).

## Editing templates

- **Recommended:** [[Templates/_index]] (bookmarked)
- **Alternative:** Quick switcher → `Templates/Player Template` (etc.)
- **Emergency:** Disable snippet under Appearance → CSS snippets

## Changing this setup

Do not edit the snippet or `appearance.json` without updating this doc. Agents: see [[docs/agents/CORE]] (Obsidian explorer section).
