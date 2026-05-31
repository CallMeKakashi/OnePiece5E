# Obsidian setup — Blood & Brine

How the vault file explorer is trimmed for campaign prep without breaking templates or plugins.

## Design choices

| Decision | Choice |
|----------|--------|
| Scope of hiding | **Explorer only** (CSS) — search, graph, backlinks, Quick switcher still see hidden paths |
| `Discord/`, `Daily/` | Hidden in explorer |
| `Templates/` | Hidden; edit via [[Templates/_index]] |
| Root agent files | `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `CONTEXT.md` hidden |
| Foundry bridge | `Foundry/` hidden in explorer — see [[Foundry/_index]] |
| Foundry modules | `op5e/`, `op5e-compendium/` hidden (VTT code, not campaign lore) |
| Full vault ignore | **Not used** — avoids side effects on templating, sync, publish |
| Folder MOCs (Tier 1) | **`{Folder}/{Folder}.md`** — e.g. `Monster Manual/Monster Manual.md`, `Home.md` at vault root. Avoid `_index.md` in campaign folders; Obsidian folder-note plugins show that filename as `_index` in the sidebar instead of the folder name. Tier-2 hubs (`Templates/_index`, etc.) stay hidden in explorer. |

## Hidden folders

| Folder | Reason |
|--------|--------|
| `Categories/`, `Clippings/`, `References/`, `Notes/` | Tier 2 PKM infrastructure ([[docs/agents/CORE]]) |
| `Templates/` | Tier 2 — use [[Templates/_index]] instead |
| `docs/`, `scripts/` | Agent / tooling |
| `Discord/` | Export quarry — channel registry at [[Discord/_index]]; curated content lives in `Timeline/`, `World/` |
| `Daily/` | Daily-notes plugin storage — open via command/calendar, not tree |
| `Attachments/` | Images and PDFs — embedded via `![[]]`, no need to browse directly |
| `Foundry/` | VTT junctions + bridge docs — [[Foundry/_index]] via [[editor-hub]] |
| `op5e/`, `op5e-compendium/` | Foundry VTT modules (separate from campaign notes) |

## Campaign-visible folders (Tier 1)

`Sessions/`, `Transcripts/`, `Timeline/`, `World/`, `Journals/`, `Monster Manual/`, `Rules/`, `Sourcebook/`

## GitHub Pages

Publishable content is synced to the Quartz `v4` branch via [[../scripts/sync_quartz_content.py|sync_quartz_content.py]] (see `.github/workflows/sync-v4-from-planning.yml`). Editor-only links: [[editor-hub]].

## Implementation files

- **Snippet:** `.obsidian/snippets/hide-infrastructure-folders.css`
- **Enabled in:** `.obsidian/appearance.json`
- **Template hub:** [[Templates/_index]]
- **Campaign hub:** [[Home]]
- **Editor / tooling:** [[editor-hub]]

Plugin paths (unchanged by hiding):

| Plugin | Config | Path |
|--------|--------|------|
| Templates | `.obsidian/templates.json` | folder `Templates` |
| Daily notes | `.obsidian/daily-notes.json` | folder `Daily`, template `Templates/Daily Note Template` |
| ZK prefixer | `.obsidian/zk-prefixer.json` | `Templates/Journal Template` |
| **Fantasy Statblocks** | Community plugin `obsidian-5e-statblocks` | Renders ` ```statblock ` YAML fences |
| **Blood & Brine Foundry Sync** | `.obsidian/plugins/blood-brine-foundry-statblock/data.json` | Per-note Python sync on open |

### Fantasy Statblocks + Foundry Sync

Notes with `foundry_actor_id` get **`## Live sheet (Foundry)`** with a ` ```statblock ` block from the live Foundry world DB.

**Enable plugins manually** — `.obsidian/community-plugins.json` is **gitignored**.

1. Enable **Fantasy Statblocks** — required for rendering.
2. Enable **Blood & Brine Foundry Sync** — optional; syncs on note open.
3. Reload Obsidian (**Ctrl+R**), open a linked note in **Live Preview**.

Manual sync: `python scripts/sync_foundry_live_markdown.py` — details in [[Foundry/_index]] and [[editor-hub]].

Workshop build templates (`foundry_template_json`) are separate; refresh with `python scripts/sync_foundry_statblocks.py`.

## One-time setup (you)

1. **Enable the snippet:** **Settings → Appearance → CSS snippets** → turn **on** `hide-infrastructure-folders` (reload the list if it does not appear).
2. **ITS Theme + TTRPG look:** **Settings → Appearance → Themes** → select **ITS Theme** (vault default in `.obsidian/appearance.json`). Requires **Style Settings** plugin — **ITS Theme → Alternate Color Schemes → TTRPG** (vault default: **WOTC/Beyond**). Reload Obsidian (**Ctrl+R**) after changing theme.
3. **Fantasy Statblocks:** With **obsidian-5e-statblocks**, enable **Style Settings → ITS Theme → 3rd Party Plugins → Disable ITS Styled Statblocks** (vault default on) so plugin statblocks render correctly.
4. Reload Obsidian (Ctrl+R) or toggle the snippet off and on.
5. Open [[Home]] (campaign hub) and [[Templates/_index]].
6. **Bookmark** that note (right-click → Bookmark — or command palette → Bookmark).

### ITS Theme not applying?

- Confirm **Appearance → Themes** shows **ITS Theme** active (not Obsidian / Moonstone).
- Confirm **Style Settings → ITS Theme → ITS Theme Class** is on, and **TTRPG** is not set to empty.
- Community theme files live in `.obsidian/themes/ITS Theme/` (gitignored — reinstall via **Browse community themes** if the folder is missing).
- **Ctrl+R** reload after theme or Style Settings changes.

### Sidebar shows `_index` instead of folder names?

Campaign folders used `_index.md` as the map-of-content file. Folder-note behavior (Waypoint / Folder Notes / similar) displays the **index filename** in the file tree, so you see four `_index` folders instead of **Monster Manual**, **Journals**, etc.

**Fix (vault convention):** Tier-1 MOCs are now **`{Folder}/{Folder}.md`** plus root **`Home.md`**. Reload Obsidian (**Ctrl+R**). You should see **Home**, **Journals**, **Monster Manual**, **Rules**, **Sessions**, **Sourcebook**, **Timeline**, **Transcripts**, **World**.

If a plugin still collapses folders into index notes, set **Waypoint → Folder Note Style → Folder Name Inside** (saved in `.obsidian/plugins/waypoint/data.json`).

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
