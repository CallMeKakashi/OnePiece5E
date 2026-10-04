// The automated ship-check stages, in order: [name, command, what it checks]. One list for the runner and the status page.
export const STAGES = [
  ["build", "npm run build", "Building the compendium packs"],
  ["validate+regression+unit", "node scripts/validate-packs.mjs && node scripts/regression.mjs && npm test", "Pack validation, nothing from the old baseline regressed, unit tests"],
  ["images", "node scripts/check-images.mjs", "Every image resolves"],
  ["source checks", "node scripts/check-armor.mjs && node scripts/check-class-tables.mjs && node scripts/check-items-vs-source.mjs && node scripts/check-races-vs-source.mjs && node scripts/check-automation-accuracy.mjs", "Armor, classes, items, races against the sourcebook"],
  ["sync to live world", "node dev/harness/sync-live.mjs --force", "Pushing the build into the running test world"],
  ["prerequisites", "node dev/harness/prereq.mjs", "Feat prerequisite cases"],
  ["wizard", "node dev/harness/wizard.mjs", "Create OPC wizard cases"],
  ["level-up", "node dev/harness/levelup.mjs", "Every class and subclass, level 1 to 20"],
  ["optional rules", "node dev/harness/optional-rules.mjs", "Optional rule toggles"],
  ["sweep", "node dev/harness/sweep-parallel.mjs", "Using every compendium document once"],
  ["rebuild PCs", "node dev/harness/rebuild-pcs.mjs", "Rebuilding the 10 campaign PCs"],
  ["transformations", "node dev/harness/transform.mjs", "Zoan Hybrid/Full Beast and Sulong on the PCs"],
];
