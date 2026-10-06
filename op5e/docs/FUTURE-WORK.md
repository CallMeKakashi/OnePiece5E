# Future work (agreed, not started)

Order is rough priority. "Now" items are being done straight after the current ship-check passes.

## Now (after the current test run)
1. **Merge the five walkthrough scripts into one, and run the real-UI checks automatically** (`dev/harness/walkthrough*.mjs` + `ui-lib.mjs`
   become one step-list script). Wire it into `scripts/ship-check.mjs` as a stage so Phase 3/4 UI checks run with every ship check.
2. **CI on every push** (`.github/workflows/ci.yml`): build, validate, regression, unit tests. The release workflow already exists.
   Open item: `module.json` manifest/download URLs point at `Blood-and-Brine/blood-brine` while the repo is `CallMeKakashi/OnePiece5E`.

## 1. Refresh characters from the compendium (DONE: `game.op5eRefreshActor(actor, {apply})`, issue #19)
Existing actors keep old copies of feats and items. A tool that updates an actor's items from the current compendium, keeping uses spent,
equipped state, quantities and custom edits, so a fix reaches existing PCs without rebuilding them.

## 1b. Devil Fruit casting (BUILT with assumptions, issue #20: scripts/fruit-casting.mjs; confirm or change the constants at its top)
Assumed answers: (a) 3 cantrips plus one leveled spell per character level; (b) highest spell level = Uses maximum; (c) no preparing, normal concentration; (d) Zoans cast only in Hybrid/Full Beast Form until level 20; (e) a spell costing more than the Uses left cannot be cast.

- Every Devil Fruit user is treated as a caster whose spell points are **Devil Fruit Uses**: a spell of level N costs N uses; cantrips are free.
- Each fruit's spell list is whatever fits the fruit's description, so the list **cannot be filtered**: on each new spell level unlocked, Paramecia and Logia users pick spells freely from any creation or spell available.
- Picks must not be limited to the OP5e compendium: the default dnd5e 2014 spell list (and feats and other items) must be selectable too, in every pick list the module offers.
- Open questions for the DM: (a) how many spells are picked per unlocked level; (b) which character levels unlock which spell level (own table, or the Devil Fruit Uses table: 1 use at 1st, 2 at 3rd, 3 at 5th, 4 at 7th, 5 at 9th); (c) do picked spells need preparing, and does concentration apply as usual; (d) do Zoans cast too, or only use their forms; (e) can a spell above the fruit's current Uses be cast at all.
- Zoans: same casting rules, plus the transform features, but their spell list can only be used while transformed (Hybrid or Full Beast form), not in the base form. From a certain level, when they can partially transform (the book's Zoan Endless Forms / Partial Beast Form is at 20th level: DM to confirm the level), they can cast in the base form too.
- Implementation sketch: spells on the actor consume `itemUses` of the Devil Fruit Uses feat (amount = spell level, 0 for cantrips); ItemChoice advancement per unlocked level whose pool is the full spell compendia (op5e creations + dnd5e spells); a setting for which packs count.

## 2. Standalone shop and trade module (not tied to this homebrew)
Goal: a separate Foundry module that works with any dnd5e world; default is stock dnd5e (gp/sp/cp), configurable to any item list and currency.

Exact requirements:
- **Currency:** default = dnd5e coins. Configurable currency set (name, abbreviation, conversion ratios, icon); a single-currency mode
  (like Berries) must work. Reads `CONFIG.DND5E.currencies` rather than hard-coding.
- **Shop definition:** a shop is an item list (any compendium or world items) with per-item price (default from the item, overridable),
  stock (unlimited or a number), and optional markup/discount percent per shop.
- **Customising the list:** GM edits a shop's list by drag and drop from any compendium; import/export a shop as JSON.
- **Buying and selling:** a player buys from a shop with their own character; the module checks funds, deducts the price, adds the item
  (quantity respected) and posts a chat receipt. Selling to a shop at a configurable sell ratio (default 50%).
- **Player and NPC trades:** player-to-player and player-to-NPC trades with both sides confirming; item and currency changes applied atomically.
  An NPC merchant sheet type or a flag on any actor, with its own gold.
- **Permissions:** players see only open shops; only the GM edits shops, stock and prices; all changes made by the GM client or via socketlib
  so players cannot write to other actors.
- **Never writes to compendiums.** Shops live in the world (or a world compendium).
- **Compatibility:** dnd5e 5.x, Foundry 13; no dependency on op5e. op5e would only supply a ready-made Berries currency set and item list.
- **Tests:** harness stages for buy, sell, trade, insufficient funds, out of stock, permissions as a player user.

## 3. Sync items created in a world into a compendium (DONE: `game.op5eSendToWorldPack(docs)` / `game.op5eImportFromWorldPack(world)`, issue #22)
Any item, feat or actor created in a world can be pushed into a compendium folder named after the world (for example folder "blood-and-brine"
inside an "OP5e World Items" pack), so it can be imported into another world.
- One command or button: "Send to world compendium"; keeps the original `_id`s and flags so re-sending updates instead of duplicating.
- Reverse direction: import a whole folder into another world.
- Must never write into the shared op5e compendiums.

## 4. Import an old character into Create OPC (PARTLY DONE: `game.op5eCarryOldCharacter(source, target, {apply})` carries gear, spells, loose feats, berries and exact proficiencies onto a Create OPC actor; issue #23. Still open: driving Create OPC itself from the old sheet, early Haki, fighting styles)
Take an existing actor (or exported actor JSON) and rebuild it through the Create OPC flow: map class, subclass, race, background, ability scores,
skills, Haki and fruit; list what had no equivalent (like the biography note the PC rebuild writes now). Builds on `dev/harness/rebuild-pcs.mjs`.

## 5. Sourcebook update pipeline
When the One Piece D&D book changes: re-run extraction, then produce a diff of what moved (new, removed, changed docs and rules), re-run the
ship check, and list the items needing a human decision. Builds on `scripts/extract-sourcebook.mjs` and the audit scripts.

## 6. Verification
- Side-by-side review sheet: sourcebook text next to what each automation does, sorted by risk, for human skimming.
- Assertion tests for the highest-risk rules (Haki tiers, Devil Fruit uses, summons, ships and cannons), written like `dev/harness/transform.mjs`.
- The 45 audit warnings (15 missing action types, 5 missing use counts, 25 text-only features).

## 6b. Text-only features (DONE, issue #26)
All 187 features the audit flagged were reviewed one by one with the DM (reports/text-only/output-*.json): 19 were false alerts, and every one the DM approved is now a passive effect, a toggle (starts off, switched on while its condition holds) or a button. About 55 stay text on purpose (choices made at the table, riders on other features or companions, rules Foundry cannot test). Checked live by dev/harness/text-batch4 to text-batch7.mjs. The audit (`node scripts/audit-text-only.mjs`) now lists what is left.

## 7. Known unfinished mechanics (status, issue #27)
- DONE: world copy script `node scripts/copy-world.mjs <src> <new>` (refuses the campaign world as a target or, without a flag, as a source).
- DONE: summons, ships and cannons assertions (`dev/harness/summons-ships.mjs`).
- OPEN, needs a separate Foundry install: dnd5e 5.2+ compatibility (Midi-QOL, Chris Premades).
- OPEN, manual: `vision-5e.defaultHearingRange` is rejected by game.settings.set (its validator wants a different formula syntax); set it in the settings window.
- OPEN: ship cannons driven through the legacy ship sheet in the real UI; items dnd5e cannot express (for example Multipod) stay as text notes.

- Full Beast Form: rolls its hit points only; a real transform with a stat block per fruit would swap the sheet.
- Sulong exhaustion on end, Enhanced Form size and reach, Approaching Awakening: manual notes.
- Ship cannons through the legacy ship sheet in the real UI.
- Items dnd5e cannot express (for example Multipod).
- Compatibility with dnd5e 5.2+ (Midi-QOL and Chris Premades want it): try in a separate Foundry copy.
- World copy script for rehearsals; official art from files the DM supplies.
