# Handoff: Commander Leon built (2026-10-10)

Continues [handoff 11](claude-2026-10-10-npc-rebuild-handoff-11.md); read handoffs 1 to 11 for workflow and gotchas. **Next: Drez Crown** (ask every choice with AskUserQuestion; check each option exists in the packs first; after each NPC add the `op5e/docs/NPC-BUILDS.md` entry and the vault "Foundry build" section, tick `docs/rehearsal-migration-candidates.md`, commit, then go to the next one).

## Done this session

- **Commander Leon** is live in `bb-rehearsal`, folder `OP5E/Marines`. Commits `a9f8409` (build) and `3eaa08f` (art, token). Details are in `op5e/docs/NPC-BUILDS.md` and `op5e/dev/generate-foundry-actor/build-leon-custom.ts` (specs `leon-spec.json` Fighter 6 Samurai, `leon-brawler-spec.json` Brawler 6 Six Powers Master); not repeated here. Not pushed yet.
- Art is the user's pin (`Marines/leon-new.jpg`, token cropped locally); it only loosely matches the brief (no long hair, burn scars or katana). Logged in `docs/art-credits.md`. The user's brief wants a katana, but the old sheet and build use a rapier; not resolved.

## Queue and open items

- Queue: Drez Crown, Petty Officer Marine, SeaBeast Hermit Crab, Marine Warship (ship actor), Alice, Cassian Valehart, Dravos, Malphas + Thunderbird Form 2 (`docs/rehearsal-migration-candidates.md`).
- Carried over from handoffs 10 and 11: the old "Morrow" actor in the rehearsal world, the transform chat-card click, Veyl's walk speed, Serica's Dual Wielder AC, 24 needs-code compendium items, `package-lock.json` still says 0.2.11, Ensign vault file still named Mk III.
- Leon: HP 210 is an override (real about 130). The Heavy Longcoat gives AC 16, so he fights unarmoured (Brawler Unarmored Defense 18) and the coat is carried. Phase 2 ignition is the Logia transformation, not a separate form. His vault page still has the legacy statblock.

## Gotchas learned

- **Multiclass = two specs.** Build each class half with `actor:build`, merge in the custom script (keep class, subclass and named features of the second half; dedupe Role, Haki, Extra Attack). `powerFork` only accepts `neither|fork|style`; use `neither` and add the fruit by hand.
- Pipeline choice steps do not cover Haki, ASIs, Fighting Style or feats; add them in the custom script by pack id or name (Fighting Style: Dueling `e9178a9c2b55cc91` is the Fighter one; others are per class).
- Six Powers Master gets all six techniques by Brawler 6; Enhanced Technique is level 11 only.
- `packs-src/devil-fruits` has real fruit items (Mera Mera no Mi exists); Logia feats are in `feats` (Logia Elemental Domain, Improved, Devil Fruit Uses table: Logia 6 uses at level 11). Fruit-Fruit DC uses the highest ability modifier, so set spellcasting to that ability.
- **Art search:** Pinterest "Less AI" search pages scrape with `a[href*="/pin/"] img` (scroll several times); pin API fetches and `originals` URLs fail, use the `736x` path. Tile thumbnails with PIL and number them; Read the sheet to pre-filter. User refines by trait (burn scar, blond, male, black and white); a pasted pin ends the search. Token: circle crop 400x400 RGBA, check it with Read; art goes to `D:/foundry-pi/Foundry/foundrydata/Data/one-piece-5e/npcs/Marines/`.
- A Bash `rm` on a relative glob after `cd` is blocked by a safety check; skip it (use fresh folders).

## Suggested skills

- `generate-foundry-actor` and the op5e pipeline (NOT `level-up-npc`)
- `handoff` for the next handoff (save in `Agent Threads/`, commit with `git add -f <file>`)
