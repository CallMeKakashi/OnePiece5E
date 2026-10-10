# Handoff: Serica and Veyl Corven built, art picked (2026-10-10)

Continues [handoff 5](claude-2026-10-10-npc-rebuild-handoff-5.md); read handoffs 1 to 5 for workflow and gotchas. Next queue item: **Chuckles** (Circle of Clowns), then Calder Voss, Goru Yamashita, Marine Ensign Mk III, Mikey, Morrow; full list in [docs/rehearsal-migration-candidates.md](../docs/rehearsal-migration-candidates.md).

## Done

- **Serica Corven** (Human, L12, CR 7, Barbarian 8 Cannoneer / Rogue 4 Swashbuckler, Mercenary, Master at Arms, Buki Buki no Mi) and **Veyl Corven** (Human, L12, CR 6, Rogue 8 Swashbuckler / Brawler 4 Six Powers Master, Acrobat, Helmsman, Soku Soku no Mi). Live in `bb-rehearsal`, folder `OP5E/Sixfold`, art imported. Full build facts: `op5e/docs/NPC-BUILDS.md` and the "Foundry build" sections on their vault pages.
- One script builds both: `op5e/dev/generate-foundry-actor/build-corven-custom.ts` (specs `serica-spec.json`, `serica-rogue-spec.json`, `veyl-spec.json`, `veyl-brawler-spec.json`). Intermediate halves in `Foundry/actors-json/*-chassis.json` and `*-part.json`.
- Art: Serica from pin 766878642841224858, Veyl from pin 8022105579783865, both in `D:/foundry-pi/Foundry/foundrydata/Data/one-piece-5e/npcs/Sixfolds/` (the existing art folder is `Sixfolds`, not `Sixfold`). Credits in `docs/art-credits.md`.

## Decisions worth knowing (all user-approved)

- Both Human with +1/+1/+1 (Serica) and +2 Dex +1 Wis (Veyl). Serica took one ASI bump (+2 Str) and two feats (Cannon Master, Savage Attacker); Veyl one bump (+1 Dex, +1 Wis) and two feats (Mobile, Alert). Feats that grant +1 Dex (Cannon Master, Graceful Dexterity, Alert) are already counted in the final scores.
- Background change: Serica started as Urchin but wanted another feat, so she is Mercenary (feat pool differs by background).
- Fruit powers: compendium items where one exists (Barrage, Construct Cannon, Burning Blade, Pistol; Water Walk, Fly, Haste, Thunderwave, Afterimage), homebrew for Snatch, Freight Train, Call and Response and the Speed-Speed effect. Each spends one of 7 Devil Fruit Uses except at-will Pon Pon Pon and Play with Fire. The user did NOT approve the at-will split explicitly; it was reported.
- CR pass: real HP was 117 and 87, so HP overrides to 161 (CR 7) and 146 (CR 6), no bonus feature. Estimated from DMG tables, not from play.
- Thumb Daggers do not exist, so Veyl's Dagger stands in. Serica carries no weapons; her two Glaives and Pistol are the formed weapons.

## Gotchas learned

- `Brawler Unarmed Strike` is refused on import while legacy `system.damage.parts` holds `@scale`; the builder now empties it when an activity carries the formula (same fix as Tyrell).
- `apply`-style edits to spec choices must target stepIds in `choices[]` directly once `pendingCount` is 0; a re-run of list-choices shows nothing to patch.
- Rogue grants 4 skills and expertise 2 at levels 1 and 6; the user initially picked fewer, check counts in `data/src/classes/<class>.ts`.
- Veyl live walk speed is 140 (30 + 90 Speed-Speed effect + Mobile + Unarmored Movement), not the fruit page's 120. Ask if they want it capped.
- Pinterest in the built-in pane is narrow; a fixed-position overlay of pin images (built by script) works as a contact sheet. The Less AI filter found nothing matching Veyl's brown leather jacket.
- Dual Wielder's +1 AC is not applied automatically (Serica shows AC 16).

## Open items

- Veyl's art does not match his brief (grey-blue hair, black turtleneck, no brown jacket); credit row says so. Offer a new search if they mind. Serica's pin shows only head and shoulders.
- Not played in a real fight; activities, Haste concentration, Construct Cannon and Afterimage summon (imported as `Afterimage` actor, `veyl-summon-afterimage.json`) verified from import output only.
- `package-lock.json` still says 0.2.11. GM login question from handoff 2 still unanswered. Permission status "Not asked" for all art.

## Suggested skills

- `generate-foundry-actor` for the next NPC (NOT `level-up-npc`, removed), and follow the handoff workflow (op5e pipeline, AskUserQuestion for every choice, Sourcebook strict)
- `ponytail` for minimal builder scripts, `diagnosing-bugs` if an import silently drops an item
- `handoff` for the next handoff (save in `Agent Threads/`, commit with `git add -f`)
