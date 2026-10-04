# Work C summary

## Files
- Dream: scripts/wizard/WizardApp.mjs (step "dream" after background, useDream action, loadDreams), create.mjs (draft defaults, writeBiography: "Dream:" paragraph + flags.op5e.dream), templates/wizard.hbs, styles/module.css, data/generated/dreams.json (new, 10 roles x 6 dreams, hand-copied from Roles/*.md; roles' docs in op5e.backgrounds not parsed).
- Hybrid: species step fieldset (None / Appearance only / Combine traits); second species + checkboxes of op5e.racial-features whose system.requirements start with that race name (covers sub-races); imported after species via importFromPackWithAdvancements; biography paragraph. Book wording paraphrased in hint, no count enforced.
- Icons: assets/icons/devil-fruit{,-paramecia,-zoan,-logia}.svg (original, 256x256); data/src/devil-fruits/index.ts (type from fruit_type / flags.op5e.devilFruit.type, else default) and templates.ts; package.mjs (INCLUDE + dist sync) and deploy-foundry.mjs now copy assets/.
- Story-Classing, Rolling Hit Points and Ursa Array hints in wizard.hbs cite the Appendix B rulings.
- dev/harness/wizard.mjs: dream asserted on every case; two extra cases (hybrid appearance, hybrid traits). node --check ok.

## Not verified
- Nothing run in Foundry. FormDataExtended checkbox values (hybridFeat.<id>) assumed true/"on". fetchJsonWithTimeout path for dreams.json assumed.
- tsc: devil-fruits files clean; unrelated pre-existing errors elsewhere.
- Packs need a rebuild for the new fruit icons. Appended CSS via shell `cat >>` (append only).
- Hybrid features are imported as plain feats; those with no advancements fall back to createEmbeddedDocuments.
