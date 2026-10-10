# Handoff: NPC rebuild, review/fix pass complete (2026-10-10)

Supersedes the open-items list in [handoff 3](claude-2026-10-10-npc-rebuild-handoff-3.md); read handoffs 1 to 3 for workflow, gotchas and the Sourcebook-strict rules. Next NPC: **Kaen Solaris** (Omen Guardians), then Vesper; the full queue is in [docs/rehearsal-migration-candidates.md](../docs/rehearsal-migration-candidates.md).

## State

- Nine NPCs are built and live in `bb-rehearsal` (Cadence, Facade, Soefra, Khael, Cecilia, Vex, Tariq, Irik, Saeva), reviewed by read-only agents, fixed from the Sourcebook, re-imported and checked live. Commits `98d0556`, `c3d999b`, `8a6b818` on `future-work` (not pushed). Build facts per NPC: `op5e/docs/NPC-BUILDS.md` and the vault actor pages.
- Tickets on CallMeKakashi/OnePiece5E: closed #50, #51 (won't fix), #53, #54. Open: [#49](https://github.com/CallMeKakashi/OnePiece5E/issues/49) (Blazing Bullet burn cannot auto-end on save), [#52](https://github.com/CallMeKakashi/OnePiece5E/issues/52) (Rage Strength-only by name), [#55](https://github.com/CallMeKakashi/OnePiece5E/issues/55) (Sourcebook text needed for Shatter, Compulsion, Healing Word, Mass Healing Word, Thunderwave), [#56](https://github.com/CallMeKakashi/OnePiece5E/issues/56) (GM login and live fight test).

## Lessons from this session

- **Workflow that worked:** ask every choice with AskUserQuestion; fan out one builder-editing agent per NPC group (distinct files, no Foundry), then import sequentially yourself (shared "Automation" login). Run long import loops in the background.
- **Foundry rejects embedded activity ids that are not 16 characters.** A longer id made `createEmbeddedDocuments` silently return `[]`, dropping the item with no error (Soefra's Mesmerizing Words). Bisect by stripping activities.
- Strict rule: follow the Sourcebook, invent nothing. Ask the user whenever the Sourcebook has no rule (balance features, limits).
- The pipeline picks only one Deckhand skill; the Sourcebook gives two plus a tool kit, so add the second skill and the tool in the custom builder.
- Human NPCs need the +1/+1/+1 (or +2/+1) trait applied; ask which scores per NPC.
- dnd5e effects cannot end on a successful save or limit a damage bonus to one ability or to tricks; document instead.
- Vex has no vault page; the live folder for Soefra is `OP5E/Soundless 5`.
- Agent Threads is gitignored but earlier handoffs are tracked: use `git add -f`.

## Still unverified

Activity details (dice, DCs) were checked from JSON, not by rolling in Foundry. Multiclass proficiency rules do not exist in the Sourcebook. Several Bard creations have no Sourcebook text (#55). Nothing has been played in a real fight.

## Suggested skills

- `generate-foundry-actor` (level-up-npc was deleted as obsolete) for each queued NPC
- `ponytail` (minimal builder scripts)
- `handoff` (next handoff), `diagnosing-bugs` if an import silently drops an item
