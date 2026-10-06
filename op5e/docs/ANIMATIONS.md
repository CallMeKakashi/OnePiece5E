# OP5e animations and sounds (issue #29)

Automated Animations (AA) plays an animation and sound when the used item's name matches an autorec label (case and whitespace ignored; longest label contained in the name wins; `exactMatch` entries need the full name). dnd5e-animations ships ~1,200 such labels, but most OP5e names are not among them. OP5e therefore ships its own autorec entries, cloned from the module's own entries, one per uncovered OP5e item.

## How it works

1. `data/animation-map.json` (human-reviewed) maps a category to an existing dnd5e-animations entry, written `menu:Label`. Lookup order per doc: `overrides` (exact name), `overridePatterns` (regex on name, optional `packs` filter, first match), then `categories`, most specific key first.
   Category keys are `<base>[:<shape>][:<damageType>|:school:<abbr>]`, where base is `attack:melee`, `attack:ranged`, `attack:spell`, `target` (save/damage without a template), `template`, `heal` or `summon`. Docs with several activities use the first of attack, save, damage, heal, summon, template.
2. `node scripts/generate-animations.mjs --packs <packs-src>` reads the built pack docs, skips docs the module already covers (exact name, a melee/range weapon-word hit like "Battleaxe" -> Axe, or a substring covering at least 60% of the name), clones the mapped entry (animation, sound, options), sets `label` to the OP5e item name, `advanced.exactMatch: true` (so it never hijacks other names) and `metaData.name = "OP5e Animations"`, and writes `assets/autorec-op5e.json`. It also refreshes `data/autorec-index.json`, the label snapshot the tests check against. Paths default to `packs-src/` and `D:/foundry-pi/.../dnd5e-animations/module/autorec.json`; override with `--packs`, `--autorec` or `OP5E_PACKS`, `OP5E_AUTOREC`.
3. `node scripts/audit-animations.mjs` writes `reports/animation-coverage.{json,md}` (per doc, grouped by pack, activity type, damage type and school; before and after).
4. At runtime `scripts/animations.mjs` (`registerOp5eAnimationsAutorec`, called from `compendium.mjs` on `init`): on `ready`, GM only, when `autoanimations` and `dnd5e-animations` are active, the world setting "Add OP5e animations to Automated Animations" is on, and the stored `animationsAutorecVersion` differs from the OP5e version, it merges `assets/autorec-op5e.json` into `aaAutorec-<menu>` and logs and notifies how many entries were added. Merge (`mergeAutorec` in `scripts/animations-lib.mjs`) never overwrites: an incoming entry is skipped if any existing entry in any menu has the same label (whitespace and case ignored) or id. Running it twice adds nothing.

## Overriding

- Your own AA entry with the item's name always wins (it is never replaced). To change one OP5e entry, edit it in the AA autorec menu; it stays as is. To get a fresh copy, delete it in AA, run `game.settings.set("op5e","animationsAutorecVersion","")` in the console and reload.
- Turn the whole thing off with the world setting. Entries already merged stay; delete them in AA (their `metaData.name` is "OP5e Animations").
- For the repo: add an `overrides` name or `overridePatterns` row in `data/animation-map.json`, run `node scripts/generate-animations.mjs`, run the tests.

## Limits

- Free JB2A and PSFX lack some assets; entries inherit whatever dnd5e-animations configured (Patreon JB2A/PSFX are best). Wildcard sounds need the player's file browser permission, see the dnd5e-animations readme.
- Docs without activities (the 39 devil fruits, which are loot) cannot animate on use; use the abilities they grant.
- The mapping is by activity and damage type, so a generic feature (for example a save-only class feature) gets a generic on-target effect. Iconic items are hand-picked in `overridePatterns`.
- Not verified without a live Foundry: that the merged entries play in the world, and the AA settings write path.
