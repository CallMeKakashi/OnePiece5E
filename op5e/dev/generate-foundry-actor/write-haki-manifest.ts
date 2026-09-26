#!/usr/bin/env node
/** Regenerate op5e/data/generated/haki-manifest.json from TS source of truth. */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { exportHakiManifest } from "../../data/helpers/haki-advancement.ts";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../../data/generated/haki-manifest.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(exportHakiManifest(), null, 2)}\n`, "utf8");
console.log(`Wrote ${out}`);
