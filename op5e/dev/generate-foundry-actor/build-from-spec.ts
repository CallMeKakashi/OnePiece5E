#!/usr/bin/env node
/**
 * Build workshop Foundry actor JSON from build spec (op5e / dnd5e 5.1).
 *
 * Usage:
 *   node node_modules/tsx/dist/cli.mjs dev/generate-foundry-actor/build-from-spec.ts \
 *     --spec @dev/generate-foundry-actor/specs/ace-spec.json \
 *     --out ../Foundry/actors-json/ace.json
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { buildActor } from "./build-actor.js";
import { parseBuildSpec } from "./build-spec.schema.js";

function parseArgs(): { spec: unknown; out?: string } {
  const specIdx = process.argv.indexOf("--spec");
  const outIdx = process.argv.indexOf("--out");
  if (specIdx === -1) throw new Error("Missing --spec");
  let raw = process.argv[specIdx + 1] ?? "";
  if (raw.startsWith("@")) raw = readFileSync(raw.slice(1), "utf8");
  return { spec: JSON.parse(raw), out: outIdx >= 0 ? process.argv[outIdx + 1] : undefined };
}

const { spec: rawSpec, out } = parseArgs();
const spec = parseBuildSpec(rawSpec);
const actor = await buildActor(spec);
const json = JSON.stringify(actor, null, 2);

if (out) {
  mkdirSync(dirname(resolve(out)), { recursive: true });
  writeFileSync(out, json, "utf8");
  console.log(`Wrote ${out} (${actor.items.length} items, ${actor.system.currency.gp} gp Berries)`);
} else {
  console.log(json);
}
