# NPC builds (Meridian Island arc)

How the arc's NPCs were built, so any of them can be rebuilt or changed. Everything is standalone JSON (no `Compendium.op5e` references, no DAE flags) written to `Foundry/actors-json/` (gitignored, regenerable). All of them live in the world folder **Meridian Island**.

**Method.** Every class-based NPC uses the real pipeline (`npm run actor:build -- --spec @<spec> --out <file>`), so classes, subclasses, features, kit and Haki are real compendium data. A second spec builds the second class of a multiclass and the custom script merges it. The custom script then adds the homebrew, the Chapter 7 additional power, spells, and a CR balance pass. `refresh-from-packs.ts` copies the automation (activities, effects, uses) from the built packs onto the embedded features, because the pipeline embeds raw class data that has none; `standaloneSummons()` exports a summon actor and rewrites the profile to a world id.

Rules used for every build: every creation choice comes from the user (or an approved default list for the guards); non-fruit characters get one Chapter 7 additional power; the CR balance pass is automatic (a straight class build lands well under its CR, so HP is overridden to the DMG band and a labelled bespoke feature adds damage).

| NPC | Build | CR | Script | Specs |
|---|---|---|---|---|
| Kyle Sollen | Human Bard 11 (Lore) / Rogue 4 (Inquisitive), Sphinx-Sphinx Fruit (mythical zoan) | 13 | `build-kyle-sollen-custom.ts`, `build-kyle-sollen-sphinx.ts` | `kyle-sollen-spec.json`, `kyle-sollen-rogue-spec.json` |
| Sphinx (Full Beast / Hybrid) | Transform targets for Kyle (fixed ids, Kyle's profiles point at them) | n/a | `build-kyle-sollen-sphinx.ts` | n/a |
| Tyrell | Moose Mink Barbarian 8 (Pugilist) / Brawler 7 (Sumo Wrestler), Armorless Guardian | 12 | `build-tyrell-custom.ts` | `tyrell-spec.json`, `tyrell-brawler-spec.json` |
| The Gallows (ally) | Human Fighter 7 (Blitzkrieg) / Rogue 3 (Bruiser), Multiple Weapon Style | 8 | `build-gallows-custom.ts ally` | `gallows-spec.json`, `gallows-rogue-spec.json` |
| The Gallows (Boss) | Fighter 10 / Rogue 5, legendary actions + lair | 12 | `build-gallows-custom.ts boss` | `gallows-boss-spec.json`, `gallows-boss-rogue-spec.json` |
| Coast Guard, Pirate Guard, Judith, May, Jay, Shin | Guards of the island (see `prep-guards.mjs` for every pick) | 1/2, 3, 5, 6, 6, 8 | `prep-guards.mjs` then `build-guards-custom.ts` | written by `prep-guards.mjs` |
| Kanto (Fenrir) | Monster-style young multichromatic dragon, possessed oni | 14 | `build-kanto.ts` | none |

**Rebuild one NPC** (from `op5e/`): `npm run actor:build -- --spec @dev/generate-foundry-actor/specs/<slug>-spec.json --out ../Foundry/actors-json/<slug>-chassis.json` (and the rogue/brawler half the same way, `-rogue-part.json`), then `node node_modules/tsx/dist/cli.mjs dev/generate-foundry-actor/build-<slug>-custom.ts`. The guards: `node dev/generate-foundry-actor/prep-guards.mjs` then `build-guards-custom.ts [slug]`.

**Tools.** `dev/harness/import-npc.mjs <json> [--folder name] [--keep-id]` imports a new actor and prints the numbers Foundry computes; `dev/harness/sync-npc.mjs <json>` re-applies a rebuilt JSON onto the existing actor in place and keeps the portrait, token and folder; `dev/harness/fight-sim.mjs` is a rough Monte Carlo of Kyle + Tyrell against a party (not a real combat).

**Balance overrides (all labelled on the sheets).** Kyle: HP 255, vest base AC 13, Khopesh 4d8 + Sunbrand Verdict 4d6, bespoke Multiattack, Riddle 12d8, Sandstorm 10d8. Tyrell: HP 240, Bodyguard's Build +2d8. Gallows: HP 182 / 240, batons 2d6 / 3d6. Guards: HP at the low end of their CR band plus Veteran's Edge (+1d8 to +3d8 weapon damage). Kanto: HP 273, AC 18, DC 18.

**Known gaps.** The Machiavellian Misfit power (Shin) asks for 10 Rogue levels and he has 4 (the user's choice). Armor Class of Judith and the Coast Guard (17) is above their CR band. Pirate Guard HP (105) is heavy for a mook. Rough Monte Carlo only: none of the new NPCs has been played in a real fight. Placeholder art on Kanto; the Afterimage summon uses a stock icon.

**Moving them to another world.** `Foundry/actors-json/meridian-island-bundle.json` plus `meridian-island-import-macro.js` recreate the folder and all 14 actors with ids kept (the transforms and the Afterimage summon point at actors by id). The bundle is exported from the rehearsal world, so it carries the portraits and tokens set there.

## Validation and world cleanup (2026-10-08)
- `dev/harness/npc-validate.mjs` checks every Meridian Island NPC (and `--world` the whole world, read-only): HP and AC against the DMG band for the CR (HP bands: CR 1/2 36-49, 3 101-115, 5 131-145, 6 146-160, 8 176-190, 12 236-250, 13 251-265, 14 266-280), every damage formula and uses value, effects that really apply (Veteran's Edge, Bodyguard's Build), spells and slots, boss resources, transform and summon targets, one body armour equipped, and every image. All 14 pass.
- Fixes from it: HP of Kyle (255), Tyrell (240), the boss Gallows (240) and the Pirate Guard (105) moved to their real band; Coast Guard, Judith and Jay have the uniform armour (white coats, floral coats) and AC in band; the stale encumbered effect is gone and the encumbrance rule is off in the rehearsal world.
- `dev/harness/fix-images.mjs` repaired 954 broken or default image references in the rehearsal world (old Windows-sync and one-piece-5e paths matched to files that exist, the D&D Beyond importer icons replaced by the system's school icons and stock icons, stock creature icons for monsters whose art is gone, stock icons for items on the grey default). Every change is listed in `reports/image-fixes.json`.
- A harness bug deleted the real Baptiste from the rehearsal copy on Oct 7 (a name-based cleanup in `shop-approval.mjs`). He was restored from the blood-and-brine database files (copied first, not opened in place). The cleanups now delete only their own `[SA]`/`[DEMO]` scratch actors, and `import-npc.mjs` never deletes without `--replace`.
- Emulated fight: `dev/harness/fight-players.mjs` (one headless browser per player user, through the public site) plus the GM session in the Browser pane.
