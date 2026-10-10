# Handoff: Chuckles and Calder Voss built, Goru paused (2026-10-10)

Continues [handoff 6](claude-2026-10-10-npc-rebuild-handoff-6.md); read handoffs 1 to 6 for workflow and gotchas. The user wants a **validation pass on every NPC built after the last review fixes** (commit `98d0556`: Kaen, Vesper, Serica, Veyl, Chuckles, Calder) in a subagent, a report back, and only then **Goru Yamashita**.

## Done this session

- **Deleted the `level-up-npc` skill** (both `.claude/skills/` and `.agents/skills/`); the user called it old and it kept being picked. Use `generate-foundry-actor` plus the op5e pipeline from the handoffs. Copies under `.claude/worktrees/` were left alone.
- **Chuckles** (Human Brawler 5 Sumo Wrestler, Entertainer, Deckhand, CR 3, HP 78 override, AC 16, Armorless Guardian). Live in `OP5E/Circle of Clowns`, existing art. Builder `op5e/dev/generate-foundry-actor/build-chuckles-custom.ts`.
- **Calder Voss** (Lunarian Brawler 12 Six Powers Master, Marine/Soldier, Captain, CR 10, HP 175 override, AC 18, Flowing Mind). Live in `OP5E/Marines`, art is the user's Aerio pin (`Marines/calder-new.jpg`, credited in `docs/art-credits.md`). No legendary actions: the Sourcebook has none. Builder `build-calder-custom.ts`. Appearance text added to his vault page.
- Entries added to `op5e/docs/NPC-BUILDS.md`, the vault pages and the candidates doc. Commits: `724e33e`, `274d48b`, `a31ecfb`, `9493e49`.

## User rules reinforced this session (memory `npc-build-wrapup-feedback`)

- Run import and folder commands yourself; do not ask.
- After every NPC: NPC-BUILDS entry, vault "Foundry build" section, tick the candidates doc, commit everything, then the next NPC.
- Ask each creation choice with AskUserQuestion, but when the user answers "no preference" or dismisses, stop and let them redirect rather than spamming questions.
- Art: if no close Pinterest match, use the pin the user gave. Calling `git add -f "Agent Threads"` stages the whole gitignored folder; add only the specific handoff files with `-f`.

## Goru Yamashita (paused, nothing built)

Live sheet: CR 5, 95 HP, AC 16, odachi swordsman with MistFrame, an air-elemental summon and five sword Forms. Vault page: `World/World Map/East Blue/Driftroot Isle/🗡️ Goru Yamashita (formerly Goru Valencruz).md` (exiled noble, born Lazarus Valencruz, sword Urami, grandfather Nero, brother Nyx, dog Mikey = Morrow). His class "The Fang (custom class by Soda)" is not in the Sourcebook. I assumed Fighter Samurai, L8, Human, Noble, compendium only, and wrote `specs/goru-spec.json` with an empty `choices[]` (13 pending steps: Noble skills/tool/feat, armor, weapons, pack, class skills, role, fruit, Samurai proficiency, Haki). The user then interrupted before answering any; **re-confirm class, level and mist-tech handling before continuing**. Mikey/Morrow, Marine Ensign Mk III follow in the queue.

## Validation task for the next agent

Verify Kaen, Vesper, Serica, Veyl, Chuckles, Calder in `bb-rehearsal`: specs and builders under `op5e/dev/generate-foundry-actor/`, `validate-actor.ts` on `Foundry/actors-json/<slug>.json`, then live checks via `dev/harness` (items, activities, AC/HP/CR, art paths, no duplicate items, folder). Compare against Sourcebook rules (proficiency +2/+3/+4 by level, Human +1/+1/+1, Deckhand two skills plus tool). Report discrepancies; do not change the live world beyond fixes the user approves. Never touch `blood-and-brine`.

## Suggested skills

- `generate-foundry-actor` and the op5e pipeline for Goru (NOT `level-up-npc`)
- `diagnosing-bugs` if an import silently drops an item
- `handoff` for the next handoff
