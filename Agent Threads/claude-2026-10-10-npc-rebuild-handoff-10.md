# Handoff: Mikey / Morrow built (2026-10-10)

Continues [handoff 9](claude-2026-10-10-npc-rebuild-handoff-9.md); read handoffs 1 to 9 for workflow and gotchas. **Next: Marine Ensign Mk III** (ask every choice with AskUserQuestion; check each option exists in the packs first; after each NPC add the `NPC-BUILDS.md` entry and vault "Foundry build" section, tick `docs/rehearsal-migration-candidates.md`, commit, then go to the next one).

## Done this session

- **Mikey** and **Morrow (Mikey transformed)** are live in `bb-rehearsal`, folder `OP5E/Driftroot`. Built by `op5e/dev/generate-foundry-actor/build-mikey-custom.ts` (monster-style, hand-authored homebrew feats, Kanto pattern; the monsters pack has no dog, so no Panther copy even though the user picked "Panther base"). Outputs `Foundry/actors-json/mikey.json` and `morrow.json`.
- Mikey: Medium beast, CR 1, AC 13, HP 32 (below the CR 1 band on purpose, a pet), 1x1 token, token linked. Morrow: Large, CR 3, AC 14, HP 60, STR 18, 2x2 token.
- The user's choices: one actor, CR 1 Large as the live sheet (later changed by the user: Mikey is **Medium**; Morrow is the larger, stronger form, so it became its own actor). Art is the user's pins (Mikey `.../pin/26669822789190376/`, Morrow `.../pin/472878029605756773/`), logged in `docs/art-credits.md`; the Morrow token is a head crop I made, the user did not pick the crop.
- Transform is a real dnd5e transform activity (`Transformation: Morrow`, bonus action, 1 minute, 1 per short rest) with `transform.mode: ""` and one profile pointing at `Actor.<MORROW_ID>`. Verified headless: the polymorph form has Morrow's stats, size lg, token and 60 HP; revert restores Mikey. The user's last bug (actor selector opening) was fixed by `mode: ""`; I did not click it in the UI.
- Docs: `op5e/docs/NPC-BUILDS.md` entry, `World/Factions/Velencruz/Morrow.md` "Foundry build" section, migration list ticked. Commits `29be14e`, `f9bce68`, `33243b9`, `0310131`.

## Queue and open items

- Queue: Marine Ensign Mk III, Commander Leon, Drez Crown, Petty Officer Marine, SeaBeast Hermit Crab, Marine Warship (ship actor), Alice, Cassian Valehart, Dravos, Malphas + Thunderbird Form 2 (`docs/rehearsal-migration-candidates.md`).
- The old pre-existing actor "Morrow" in the rehearsal world was left alone; it may be a stale copy worth deleting later (ask).
- The transform still needs the chat-card Transform button click (dnd5e flow); a no-click version needs a macro or hook (offered, not built).
- Carried over: Veyl's walk speed, Serica's Dual Wielder AC, 24 needs-code compendium items, `package-lock.json` still says 0.2.11.

## Gotchas learned

- `transform.mode: "cr"` makes dnd5e open the actor selector on every use; use `""` to go straight to the profile. A transform creates a separate polymorph actor "Name (Target)", so test the form actor, not the original.
- Transform targets need fixed ids (`generateId(...)`) and an import with `--keep-id`; import the target before the source.
- Do not copy Kanto's `actorLink: false` for a unique named actor.
- A heredoc in a Bash call that also contains `git commit` or starts with `import` trips the commit-message hook; keep commits in their own Bash call and write helper scripts with `printf`.
- Pinterest: the closeup image is `[data-test-id="closeup-image"] img`; `i.pinimg.com/originals/<path>.jpg` gives the full file. Save art under `D:/foundry-pi/Foundry/foundrydata/Data/one-piece-5e/npcs/<folder>/`.
- Foundry system source is at `D:/foundry-pi/Foundry/foundrydata/Data/systems/dnd5e/dnd5e.mjs` (grep with `cut`, it is huge).

## Suggested skills

- `generate-foundry-actor` and the op5e pipeline (NOT `level-up-npc`)
- `handoff` for the next handoff (save in `Agent Threads/`, commit with `git add -f <file>`)
