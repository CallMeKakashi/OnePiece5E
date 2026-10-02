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

What happened at the table comes only from these, in this order:

1. **Transcripts** in `Transcripts/` (large; load only when needed), plus the DM's answers at the grill.
2. **Grilled session notes** (`Sessions/2026/<date>/Session NNN — …md`): `## Actual play outcomes` is the record. `## Prep (before play)` is the DM's plan, never fact.
3. **Outlines and loose prep files** (`Session DD-MM-26.md`, `Sesison Prep*`, `Sessions/Outlines/`, `Sessions/This session.md`) are pure prep. Link them as "planned", never state them as canon.

For **in-world chronology** (dates, headlines, between-session world reactions), use `Timeline/`. It is not session evidence, and newspaper text is in-fiction.

## Actors and factions

All named characters (PCs, crew, NPCs, antagonists) live under their faction in `World/Factions/`. The faction list and paths are in [CONTEXT.md](./CONTEXT.md#factions) (single source; do not duplicate it here). Actors sometimes sit in a different faction folder than expected (e.g. Fenris under `Blackhand/`, Facade and Malak Samum under `Braveheart Pirates/`), so search `World/` for an existing page before creating one.

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

Real incidents from prior Codex/Cursor sessions (see [Agent Threads/](./Agent%20Threads/)). Context-specific ones live next to the code: [op5e/CLAUDE.md](./op5e/CLAUDE.md) and [scripts/CLAUDE.md](./scripts/CLAUDE.md). Read them before working across the vault/op5e/scripts boundary. Cross-cutting ones:

- **Foundry workshop vs. live are two different actor stores.** `Foundry/actors-json` (junction to workshop `foundry-json`, build/import templates, **not** current) vs. `Foundry/world-actors` (junction to the live Foundry LevelDB world, **is** current at the table). See [Foundry/_index.md](./Foundry/_index.md). Never treat workshop JSON as current PC/NPC state.
- **Stale duplicate folders can look live.** A `DND/` folder (a full stale vault duplicate) once sat in the repo and was mistaken for reintroduced content. If a folder's purpose is unclear, check `git log --follow` and ask before assuming it's authoritative.
- **Do not merge `planning` and `v4`** (unrelated histories); details in [scripts/CLAUDE.md](./scripts/CLAUDE.md).

## Graphify knowledge graphs

Two separate graphify contexts exist, matching the vault/op5e split above — never merge them into one graph:

| Context | Root | Scope | Built with |
|---------|------|-------|------------|
| Vault | `graphify-out/` (repo root) | Sessions, World, Timeline, Sourcebook, Devil Fruits, Monster Manual, Journals, root notes — scoped by `.graphifyignore` (excludes Transcripts/, Agent Threads/, Attachments/, op5e/, and tooling folders) | Semantic extraction (subagent-dispatched, no API key) |
| op5e | `op5e/graphify-out/` | The op5e TypeScript module | Local AST only (`--code-only`, no LLM needed) |

Query either with `graphify query "<question>"` / `graphify explain "<node>"` / `graphify path "A" "B"` run from the matching directory (repo root for the vault graph, `op5e/` for the op5e graph) — see `graph.json`, `GRAPH_REPORT.md`, and `graph.html` in each `graphify-out/`. Both are gitignored (regenerable); rerun via the `graphify` skill or `graphify extract <path>` to refresh after major content changes.

## Deferred work (do not start without approval)

- Linking loose prep files/outlines to their session notes (grilled notes already link their transcripts)
- Homebrew glossary terms in `CONTEXT.md`
- Changing `Home.md` beyond approved maintenance links, or Obsidian config not documented in [obsidian-setup](./docs/obsidian-setup.md)

## Agent thread history

Prior Codex and Cursor conversations for this project are archived in [`Agent Threads/`](./Agent%20Threads/):

- `codex-2026-07-09-session-A.md` — exploratory session (vault overview, Foundry modules)
- `codex-2026-07-09-session-B.md` — Sourcebook refresh against the One Piece D&D 5e PDF
- `Cursor/` — 277 files covering Foundry actor generation, shorts pipeline, session wiki writing, statblock fixes, and more

Read relevant threads when the user asks about prior work or continuation of a task.

## Skills

### Grill workflow

Trigger: user says "grill", "next session grilling", or names a session to write up. One session per grill.

1. Read the full transcript in `Transcripts/<date>/` (often looped STT garbage; read in chunks). Never use the session note's prep as evidence.
2. Grill the DM one question at a time, each with a recommended answer. Do not write until the DM says go.
3. Fill the session note: TL;DR, Cast, Where/When, Actual play outcomes, Open threads, Loot & changes. Keep `## Prep (before play)`.
4. Update `Sessions/Open Threads.md` (rows plus the "Last updated" line) and back-update older sessions' `## Open threads` lines that this session settles or changes.
5. Search `World/` for an existing page before creating one (actors can sit under a different faction folder than expected). Add an `## Episode N` section to every actor or location that acted, and create pages for new NPCs and places.
6. Save any handoff in `Agent Threads/` as `claude-<date>-grill-session-NN-handoff.md`, not the OS temp folder.

Older tool: `/polish-session-note` ([`.claude/agents/polish-session-note.md`](./.claude/agents/polish-session-note.md)) remains available for one-off write-ups.

### generate-foundry-actor

Trigger: user says `/generate-foundry-actor`, "generate Foundry JSON", "build a workshop actor", or "create a compendium-backed character sheet".

Full instructions: [`.cursor/skills/generate-foundry-actor/SKILL.md`](./.cursor/skills/generate-foundry-actor/SKILL.md)
Supporting docs: [`REFERENCE.md`](./.cursor/skills/generate-foundry-actor/REFERENCE.md), [`FOUNDRY-KB.md`](./.cursor/skills/generate-foundry-actor/FOUNDRY-KB.md)
