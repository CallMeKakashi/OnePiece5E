# Claude Code — Blood & Brine

Obsidian vault for the **Blood & Brine** One Piece D&D campaign, plus two loosely-related sub-projects sharing this repo: the `op5e/` FoundryVTT module and `scripts/` sync automation. See [CONTEXT-MAP.md](./CONTEXT-MAP.md) for the three contexts and their glossaries.

## Read order

1. [CONTEXT-MAP.md](./CONTEXT-MAP.md) — context map, then the glossary for your context ([vault](./CONTEXT.md), [op5e](./op5e/CONTEXT.md), [scripts](./scripts/CONTEXT.md))
2. This file — operational rules
3. [Home.md](./Home.md) — campaign navigation hub (Dataview)

## Repo shape

This is not one project — it's three, sharing a git history:

| Context | Path | What |
|---------|------|------|
| Campaign vault | vault root (`Sessions/`, `World/`, `Timeline/`, `Sourcebook/`, `Devil Fruits/`, etc.) | Campaign content, published to GitHub Pages via Quartz |
| op5e | `op5e/` | Standalone FoundryVTT module — TypeScript, npm, vitest, its own build/release pipeline |
| Sync scripts | `scripts/` | Python — some recurring (Discord export, Foundry sync, Quartz publish), some one-time migrations |

Know which context a task is in before touching files — see **Danger zones** below for where these three have bled into each other before.

## Vault path

`f:/Documents/GitHub/blood&brine/`

## Default mode: read-only

Do **not** create, edit, delete, rename, or move any file unless the user explicitly approves that action.

## Folder tiers (vault)

### Tier 1 — campaign-primary (search/read by default)

- `Sessions/`
- `Transcripts/`
- `Timeline/`
- `World/` (includes `World/Factions/` — all actor and faction pages)
- `Journals/`
- `Rules/` (homebrew only)
- `Devil Fruits/` (campaign devil fruit registry)
- `Monster Manual/` (campaign creatures & NPC stat blocks)
- `Sourcebook/` (One Piece D&D reference)

### Tier 2 — hidden in explorer (do not read unless asked)

- `Categories/`
- `Clippings/`
- `References/`
- `Notes/`
- `Templates/`
- `Attachments/`

These folders support Obsidian workflows (templates, PKM, media). They are not primary campaign context.

## Obsidian explorer

The file explorer hides Tier 2 and tooling folders via CSS (**explorer only** — search and links unchanged). Template edits go through [obsidian-setup](./docs/obsidian-setup.md) and [Templates/_index](./Templates/_index.md). Do not change `.obsidian/snippets/` or `appearance.json` without user approval and updating that doc.

## Session vs Episode

- **Session** = table-play unit → `Sessions/`
- **Episode** = broadcast/recording unit → `Transcripts/`

Do not assume session numbers and episode numbers are 1:1. Match by title and user context.

## Knowledge sources for "what happened"

When reconstructing play, consider (in order of curation):

1. Session notes in `Sessions/`
2. Outlines (e.g. `Sessions/Outlines/`, `Sessions/This session.md`)
3. Transcripts in `Transcripts/` (large; load only when needed)

For **in-world chronology** (dates, headlines, between-session world reactions), use `Timeline/` — not a substitute for session notes. Newspaper text is in-fiction; cite `Sessions/` or `Transcripts/` for what happened at the table.

Linking and organizing these is in progress — do not reorganize without approval.

## Actors and factions

All named characters (PCs, crew, NPCs, antagonists) live under their faction in `World/Factions/`. Each faction has a folder containing a faction overview page and individual actor pages.

| Faction | Path | Notes |
|---------|------|-------|
| Blackhand | `World/Factions/Blackhand/` | Parent pirate org with sub-units |
| Lunarfolds | `World/Factions/Blackhand/Lunarfolds/` | Player party crew (Blackhand unit) |
| Gentle Giant Pirates | `World/Factions/Blackhand/Gentle Giant Pirates/` | Blackhand unit |
| Sixfold | `World/Factions/Sixfold/` | Mercenary organization |
| Marines | `World/Factions/Marines/` | Naval military |
| Motley Crew | `World/Factions/Motley Crew/` | Historical founding crew |
| Decibella Revolutionary | `World/Factions/Decibella Revolutionary/` | Rebellion group |
| Spider Nest Pirates | `World/Factions/Spider Nest Pirates/` | Pirate crew |
| Soundless 5 | `World/Factions/Soundless 5/` | Decibella Kingdom enforcers |
| Mugen Industries | `World/Factions/Mugen Industries/` | Industrial faction |

Actor pages use the template: Description → Role → Personal Quests → Backstory.

## Wikilinks

Use Obsidian `[[wikilinks]]` when suggesting note titles. Prefer **Title Case** filenames consistent with existing notes.

## Agent skills

### Issue tracker

GitHub Issues on `CallMeKakashi/OnePiece5E` via `gh`; external PRs are not a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Multi-context — `CONTEXT-MAP.md` at the root points to the vault, op5e and scripts glossaries. See `docs/agents/domain.md`.

## Danger zones

Real incidents from prior Codex/Cursor sessions (see [Agent Threads/](./Agent%20Threads/)) — read before working across the vault/op5e/scripts boundary:

- **Foundry workshop vs. live are two different actor stores.** `Foundry/actors-json` (junction → workshop `foundry-json`, build/import templates, **not** current) vs. `Foundry/world-actors` (junction → the live Foundry LevelDB world, **is** current at the table). See [Foundry/_index.md](./Foundry/_index.md). Never treat workshop JSON as reflecting current PC/NPC state.
- **Vault sync scripts can drop or corrupt existing note content.** `scripts/discord_vault_sync_full.py` has previously dropped portraits and corrupted a note mid-run. After running any `scripts/sync_*.py`, diff the affected notes before trusting the result.
- **Broad pattern edits in `op5e/` can silently touch unrelated entries.** A content-based regex patch aimed at 3 named tricks also blanked unrelated compendium entries. Patch by exact name/context, never by broad pattern, and run `npm test` in `op5e/` after.
- **The `&` in this repo's path (`blood&brine`) breaks shell invocations on Windows** when a script runs with `shell: true` and a non-absolute interpreter path — cmd.exe treats `&` as a command separator and silently truncates the path. Prefer `shell: false` / absolute paths in any new script or plugin invocation.
- **`planning` and `v4` are unrelated git histories.** `v4` is the Quartz/GitHub Pages branch, kept in sync by content-copy (`scripts/sync_quartz_content.py`), not merge. Never `git merge`, fast-forward, or reset between them — it would destroy one side's history. A separate `v4` worktree may exist elsewhere on disk; don't assume the current checkout is the only one.
- **Stale duplicate folders can look live.** A `DND/` folder (713 files, a full stale vault duplicate) sat in the repo since the initial commit, wasn't hidden by explorer CSS, and was mistaken for reintroduced content. If a folder's purpose is unclear, check `git log --follow` and ask before assuming it's authoritative.
- **op5e's test suite has a hidden dependency on the vault.** Its actor-export fixtures write into the vault's `Foundry/actors-json/`; tests fail if that folder/junction doesn't exist in the current checkout. Don't assume `op5e/` is fully self-contained.

## Graphify knowledge graphs

Two separate graphify contexts exist, matching the vault/op5e split above — never merge them into one graph:

| Context | Root | Scope | Built with |
|---------|------|-------|------------|
| Vault | `graphify-out/` (repo root) | Sessions, World, Timeline, Sourcebook, Devil Fruits, Monster Manual, Journals, root notes — scoped by `.graphifyignore` (excludes Transcripts/, Agent Threads/, Attachments/, op5e/, and tooling folders) | Semantic extraction (subagent-dispatched, no API key) |
| op5e | `op5e/graphify-out/` | The op5e TypeScript module | Local AST only (`--code-only`, no LLM needed) |

Query either with `graphify query "<question>"` / `graphify explain "<node>"` / `graphify path "A" "B"` run from the matching directory (repo root for the vault graph, `op5e/` for the op5e graph) — see `graph.json`, `GRAPH_REPORT.md`, and `graph.html` in each `graphify-out/`. Both are gitignored (regenerable); rerun via the `graphify` skill or `graphify extract <path>` to refresh after major content changes.

## Deferred work (do not start without approval)

- Linking Sessions ↔ Transcripts ↔ Outlines
- Homebrew glossary terms in `CONTEXT.md`
- Changing `Home.md` beyond approved maintenance links, or Obsidian config not documented in [obsidian-setup](./docs/obsidian-setup.md)

## Agent thread history

Prior Codex and Cursor conversations for this project are archived in [`Agent Threads/`](./Agent%20Threads/):

- `codex-2026-07-09-session-A.md` — exploratory session (vault overview, Foundry modules)
- `codex-2026-07-09-session-B.md` — Sourcebook refresh against the One Piece D&D 5e PDF
- `Cursor/` — 277 files covering Foundry actor generation, shorts pipeline, session wiki writing, statblock fixes, and more

Read relevant threads when the user asks about prior work or continuation of a task.

## Skills

### polish-session-note

Trigger: user says `/polish-session-note`, "polish session", "complete session notes", or names a specific session to write up. One session per invocation only.

Full instructions: [`.claude/agents/polish-session-note.md`](./.claude/agents/polish-session-note.md)

Incomplete sessions (as of 2026-08-18): Sessions 16–25 plus 24.5. Sessions 2–15 were completed in a prior Cursor run.

### generate-foundry-actor

Trigger: user says `/generate-foundry-actor`, "generate Foundry JSON", "build a workshop actor", or "create a compendium-backed character sheet".

Full instructions: [`.cursor/skills/generate-foundry-actor/SKILL.md`](./.cursor/skills/generate-foundry-actor/SKILL.md)
Supporting docs: [`REFERENCE.md`](./.cursor/skills/generate-foundry-actor/REFERENCE.md), [`FOUNDRY-KB.md`](./.cursor/skills/generate-foundry-actor/FOUNDRY-KB.md)
