# Work F: Starting Rules, Party Diversity, optional rulings

Not run (hard rules): no build, harness or Foundry. Only `node --check` on every touched .mjs (all pass).

## Files
- scripts/wizard/create.mjs: DEFAULT_START_LEVEL = 3; draft field `freeFeatId`; after class levels the feat is validated with `unmetPrerequisites` against the real actor (setting `prerequisiteMode` respected: enforce refuses, warn only notes) and added with `importFromPackWithAdvancements`. Refusal deletes the actor and throws "does not meet the requirements ..." (no half-built character). Non-general feats are refused too.
- scripts/wizard/WizardApp.mjs: free-feat select (op5e.feats, system.type.value "feat", requirements shown), saved on the class step; non-blocking Party Diversity lists (species and classes of characters owned by other non-GM users) on species and class steps.
- templates/wizard.hbs: Starting Rules hint (level 1 still allowed), feat select, Party Diversity hints, feat on the review step.
- dev/harness/wizard.mjs: cases for default level 3 (level omitted), qualifying feats (Alert, Skulker Dex 15) and Skulker with Dex 8 refused with no actor left behind.
- scripts/optional-rules.mjs (new) + one import and one call line in scripts/compendium.mjs init: world settings, all default OFF, hints quote the book.
- dev/harness/optional-rules.mjs (new): writes reports/execution-optional-rules.json, restores all settings off.
- styles/module.css: untouched (not needed).

## Behaviours
- Critical Saving Throws (Midi): hook `midi-qol.postCheckSaves`. Midi already tracks `criticalSaves`/`fumbleSaves` per token. Nat 20: moved to saves, removed from failedSaves, added to superSavers (a saved super saver takes 0 damage, and effects only go to failedSaves). Nat 1: forced into failedSaves, removed from superSavers (full damage). Extra damage die: `midi-qol.preTargetDamageApplication` rolls one die of the first damage die size, adds it to the damage item (hpDamage, newHP, totalDamage, damageDetail). Without Midi: `dnd5e.rollSavingThrow` posts a chat note only (roll.isCritical/isFumble); no note when Midi is active.
- Siege vs Constructs: same damage hook; item with weapon type `siege` or text "Siege weapon/property" (the op5e ship cannons say so in their text) against `details.type.value === "construct"` gets +1d8 of the first damage type.
- Unreasonable Strength: wraps the character data model `prepareBaseData` and multiplies `attributes.encumbrance.multipliers.maximum` by total class levels (min 1); other multipliers, size and Powerful Build still stack. Push/lift/drag (dnd5e computes no push value) are not modelled.

## Not implementable
- Creations and Objects, Allied Space Occupancy, Destroying Special Objects: pure table rules, no dnd5e hook (token movement/targeting of objects/immunity by item rarity), so no settings; the text is in the vault reference journals.
- Extra critical-fumble die and siege die ignore the target's resistances/immunities (added after Midi's calculation); ceiling noted here, upgrade by adding to `ditem.rawDamageDetail` before Midi's calc if needed.
- A real save cannot be forced to a natural 20/1, so the harness calls the registered Midi hook handlers with a stand-in workflow.
- Old saved wizard drafts keep their stored level (only new drafts default to 3).
