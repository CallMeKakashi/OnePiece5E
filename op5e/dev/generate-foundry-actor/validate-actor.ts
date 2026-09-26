#!/usr/bin/env node
/** Validate workshop actor JSON against FOUNDRY-KB checklist. */
import { readFileSync } from "node:fs";

import { validateActor } from "./validate-actor-lib.js";

const file = process.argv[process.argv.indexOf("--file") + 1];
if (!file) {
  console.error("Usage: validate-actor.ts --file path/to/actor.json");
  process.exit(1);
}

const actor = JSON.parse(readFileSync(file, "utf8"));
const { ok, errors, warnings } = validateActor(actor);

console.log(`\nValidate: ${file}`);
if (errors.length) {
  console.log("\nERRORS:");
  errors.forEach((e) => console.log(`  ✗ ${e}`));
}
if (warnings.length) {
  console.log("\nWARNINGS:");
  warnings.forEach((w) => console.log(`  ⚠ ${w}`));
}
if (ok && !warnings.length) console.log("  ✓ All checks passed");
process.exit(ok ? 0 : 1);
