# Wizard extension (Create OPC)

## Files
- NEW scripts/wizard/create.mjs: PACKS, draft defaults, ursa/point-buy validation, subclass lookup (op5e.subclasses by system.classIdentifier, level from the class's own Subclass advancement), prospective-actor prerequisite check, `createFromDraft`.
- NEW scripts/wizard/auto-advance.mjs: headless runner (port of advance-lib `__op5eRun`) + `commitManager` (diffs manager.clone onto the actor, no UI).
- scripts/wizard/apply-advancements.mjs: `runManager` (UI+wait, or auto), `levelClassTo` (forLevelChange one level at a time), class forced to level 1 on import, wait timeout 30 min.
- scripts/wizard/WizardApp.mjs, templates/wizard.hbs, styles/module.css: class step (level 1-20, subclass select enabled at the class's subclass level, optional second class "Optional (DM approval)", total <= 20, HP mode, auto-apply testing checkbox), haki step (only when a class level >= 8), Ursa Array method + button, fork step disables unmet Additional Power roots with reason.
- scripts/haki-advancement.mjs: `setHakiPreselection(levelToBranch)`; the existing pool filter then narrows to the chosen branch's next tier (falls back to the full pool if invalid).
- scripts/character-creator.mjs: API adds `createFromDraft(draft, opts)`, `unmetPrerequisites`, `buildProspectiveActor`.
- NEW dev/harness/wizard.mjs -> reports/execution-wizard.json.

## Behaviour
Create at L1, import species/background/role/class(es) at L1 through forNewItem, then `forLevelChange(actor, classItemId, 1)` per level. Manual mode renders the manager and waits for `dnd5e.advancementManagerComplete` (as before); Haki is surfaced by the existing preRender hook, nothing duplicated. Auto mode (opts.auto or the checkbox) picks defaults: avg HP (max at first character level), ASI to highest score, subclass from draft, Haki from draft else first valid, feats filtered by unmetPrerequisites. `opts.hpMode:"roll"` rolls and takes max(roll, average) in auto mode. Additional Power: pre-refused before anything is created if ability/race/level prerequisites fail on the draft; imported last and re-checked fully on the real actor (refusal notified, noted as REFUSED). Starting gear: left to dnd5e's class/background advancements (nothing added).

## Not verified (nothing was run against Foundry)
- `commitManager` is my reimplementation of the manager's completion (system diff + item create/update/delete, keepId); dnd5e's `preCommitAdvancementUpdates` hook is not fired in auto mode.
- Manual mode: subclass is chosen in the native Subclass step (no preselect hook), and HP uses the native dialog (its own Roll button); the wizard only announces the presets.
- Haki: `collectPriorHakiSlugsForChoiceLevel` only sees the current manager's steps, so in a one-level-per-manager level-up previously chosen Haki is not considered by the native pool filter (possible pre-existing gap; auto mode unions actor-owned slugs).
- `forLevelChange` second argument assumed to be the class item id (as levelup.mjs uses).
- tsc --noEmit reports pre-existing errors in data/src/subclasses only; node --check passes on all touched .mjs.
