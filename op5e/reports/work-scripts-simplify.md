# work-scripts-simplify

Changed:
- scripts/wizard/WizardApp.mjs: steps now name, images, species, background, class, abilities, finish. Removed role/fork/haki steps, additional-power/role index and hakiLevels, related form handling.
- scripts/wizard/create.mjs: removed role import, additional-power tree/refusal, prospective-actor/prereq helpers, setHakiPreselection. withDefaults drops old roleFeatId/fork/haki fields from drafts. createFromDraft opts.haki / opts.fruit steer the auto mode only.
- scripts/wizard/auto-advance.mjs: ItemChoice picks only pool entries where system.validatePrerequisites(clone,{added,level}) === true. Prefers "No Devil Fruit" (or opts.fruit) for a "Devil Fruit" choice, the preset branch for Haki (name match), otherwise pool order (first role).
- scripts/wizard/apply-advancements.mjs: passes opts.fruit through.
- scripts/character-creator.mjs: dropped buildProspectiveActor export.
- scripts/compendium.mjs: removed registerOp5eHakiAdvancementHooks.
- templates/wizard.hbs: removed role/haki/fork steps and finish-summary lines. styles/module.css had nothing to remove.
- dev/harness/advance-lib.mjs, levelup.mjs, wizard.mjs: updated as specified (wizard.mjs refusal case removed; role assertions; L1 role and devil-fruit assertions in levelup).
Deleted: scripts/haki-advancement.mjs, scripts/haki-advancement-lib.mjs (nothing else imported them; data/helpers/haki-advancement.ts is separate and untouched).
rebuild-pcs.mjs needed no change.

Not verified: only `node --check` was run. Nothing ran in Foundry.
- Haki/Devil Fruit choice detection is by item name (the title /devil fruit/i, "No Devil Fruit", branch word in the item name). It depends on W-data's final names.
- The `added` argument to validatePrerequisites only holds items chosen in the same ItemChoice; its expected format (identifier vs uuid) is unconfirmed.
- The levelup devil-fruit assertion matches /devil fruit/i on item names.
- dist/ still has the old files until the next build.
