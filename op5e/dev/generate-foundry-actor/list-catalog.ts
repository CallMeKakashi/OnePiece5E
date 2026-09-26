#!/usr/bin/env node
/**
 * List OP5e compendium catalog entries for Phase 1 intake.
 *
 * Usage:
 *   node node_modules/tsx/dist/cli.mjs dev/generate-foundry-actor/list-catalog.ts
 *   node node_modules/tsx/dist/cli.mjs dev/generate-foundry-actor/list-catalog.ts --class fighter
 */
import races from "../../data/src/races/index.ts";
import classes from "../../data/src/classes/index.ts";
import subclasses from "../../data/src/subclasses/index.ts";
import backgrounds from "../../data/src/backgrounds/index.ts";
import {
  HAKI_BRANCHES,
  HAKI_CHOICE_LEVELS,
  HAKI_TIERS,
} from "../../data/helpers/haki-advancement.ts";
import { additionalPowerFeatures } from "../../data/src/class-features/additional/index.ts";

function raceEntry(r: { name?: string; system?: { identifier?: string } }) {
  return {
    identifier: String(r.system?.identifier ?? ""),
    name: String(r.name ?? ""),
  };
}

function classEntry(c: { name?: string; system?: { identifier?: string } }) {
  return { identifier: String(c.system?.identifier ?? ""), name: String(c.name ?? "") };
}

function subclassEntry(s: {
  name?: string;
  system?: { identifier?: string; classIdentifier?: string };
}) {
  return {
    identifier: String(s.system?.identifier ?? ""),
    classIdentifier: String(s.system?.classIdentifier ?? ""),
    name: String(s.name ?? ""),
  };
}

function backgroundEntries() {
  const bgs: { slug: string; name: string }[] = [];
  const roles: { slug: string; name: string }[] = [];
  for (const doc of backgrounds as {
    name?: string;
    flags?: { op5e?: { shipRole?: boolean } };
  }[]) {
    const name = String(doc.name ?? "");
    if (doc.flags?.op5e?.shipRole === true || /^role:/i.test(name)) {
      const slug = name.replace(/^role:\s*/i, "").toLowerCase().replace(/\s+/g, "-");
      roles.push({ slug, name });
    } else {
      bgs.push({ slug: name, name });
    }
  }
  return { backgrounds: bgs.sort((a, b) => a.name.localeCompare(b.name)), roles: roles.sort((a, b) => a.name.localeCompare(b.name)) };
}

function powerEntries() {
  return (additionalPowerFeatures as { name?: string; flags?: { op5e?: { additionalPowerRoot?: boolean } } }[])
    .filter((f) => f.flags?.op5e?.additionalPowerRoot)
    .map((f) => {
      const name = String(f.name ?? "");
      const slug = name
        .toLowerCase()
        .replace(/,/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return { slug, name };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

const args = process.argv.slice(2);
const classFilter = args.includes("--class")
  ? args[args.indexOf("--class") + 1]?.toLowerCase()
  : null;

const { backgrounds: bgList, roles } = backgroundEntries();

const out: Record<string, unknown> = {
  races: (races as Parameters<typeof raceEntry>[0][]).map(raceEntry).sort((a, b) =>
    a.name.localeCompare(b.name),
  ),
  classes: (classes as Parameters<typeof classEntry>[0][]).map(classEntry).sort((a, b) =>
    a.name.localeCompare(b.name),
  ),
  subclasses: (subclasses as Parameters<typeof subclassEntry>[0][])
    .filter((s) => !classFilter || s.system?.classIdentifier?.toLowerCase() === classFilter)
    .map(subclassEntry)
    .sort((a, b) => a.name.localeCompare(b.name)),
  backgrounds: bgList,
  roles,
  additionalPowers: powerEntries(),
  haki: {
    choiceLevels: [...HAKI_CHOICE_LEVELS],
    branches: [...HAKI_BRANCHES],
    tiers: [...HAKI_TIERS],
  },
};

console.log(JSON.stringify(out, null, 2));
