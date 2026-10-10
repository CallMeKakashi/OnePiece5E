# Handoff: Goru Yamashita rebuilt (2026-10-10)

Continues [handoff 8](claude-2026-10-10-npc-rebuild-handoff-8.md); read handoffs 1 to 8 for workflow and gotchas. **Next: Mikey and Morrow** (ask every choice with AskUserQuestion; check each option exists in the packs first).

## Done this session

- **Goru Yamashita** built and live in `bb-rehearsal`, folder `OP5E/Driftroot`. Human Fighter 10 (Samurai), CR 5, Noble, Master at Arms, additional power Tough Customer, no fruit. AC 16, HP 138 (override, real about 75, CR 5 band 131-145), prof +4, scores 14/18/14/12/14/13 (the live sheet's, no ASIs, all feats).
- Choices (all asked): Odachi (it exists in the packs; I wrongly said it did not at first), two Katanas (second is a spare, unequipped), Light Crossbow, Heavy Longcoat, Explorer's Pack, Great Weapon Fighting. Feats Diplomat, Observant, Katana Master, Great Weapon Master, Permanent Haki-Imbuement (user dropped Mobile). Haki Armament Novice and Observation Novice. Skills Persuasion, Insight, Acrobatics, Athletics, History, Intimidation.
- Dropped by the user's choice: The Fang class, MistFrame, the air-elemental summon, the five Forms.
- Art is the user's pin (`Driftroot Isle/goru-new.jpg` and `goru-new-token.png`); it only loosely matches the brief. Logged in `docs/art-credits.md` (permission not asked).
- Files: `op5e/dev/generate-foundry-actor/build-goru-custom.ts`, `specs/goru-spec.json`, `Foundry/actors-json/goru.json` and `goru-chassis.json`, `op5e/docs/NPC-BUILDS.md` entry, vault page "Foundry build" section, `docs/rehearsal-migration-candidates.md` ticked. Commits `25a5698` (build) and `a469253` (art).

## Queue and open items

- Queue after Goru: Mikey/Morrow, Marine Ensign Mk III, Commander Leon, Drez Crown, Petty Officer Marine, SeaBeast Hermit Crab, Marine Warship (ship actor), Alice, Cassian Valehart, Dravos, Malphas + Thunderbird Form 2 (see `docs/rehearsal-migration-candidates.md`). Mikey is the spiked dog, Morrow is the same dog after Laziel's experiments; check the vault page first.
- Goru was not played in a real fight and has no CR damage bump. The Noble gaming-set choice was left as the wildcard `tool:game:*` (user wanted dice).
- Carried over from handoff 8: Veyl's walk speed, Serica's Dual Wielder AC, 24 needs-code compendium items, `package-lock.json` still says 0.2.11.

## Gotchas learned

- `sync-npc.mjs` keeps the existing portrait and token, so set art with `actor.update({img, "prototypeToken.texture.src"})` through a small `withFoundry` script, then HEAD-check the paths.
- `npc-validate.mjs` only reads the `Meridian Island` folder; it will not list a new actor elsewhere.
- Pinterest: add `&filter_genai=true` to a search URL for the "Less AI" filter; `i.pinimg.com/originals/...` gives the full image. Save art under `D:/foundry-pi/Foundry/foundrydata/Data/one-piece-5e/npcs/<folder>/`.
- Do not run a root-wide `find /`; it times out.
- A heredoc starting with `import` in a Bash call tripped the commit-message hook; keep commits in their own Bash call.
- Fighter feature ids: the Fighter's Great Weapon Fighting style is `class-features/72769d4989cf62a8` (others belong to Brawler, Bard, Savant, Barbarian).

## Suggested skills

- `generate-foundry-actor` and the op5e pipeline (NOT `level-up-npc`)
- `handoff` for the next handoff (save in `Agent Threads/`, commit with `git add -f <file>`)
