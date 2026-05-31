/**
 * Audit build generation — reads subclass/power data at audit time (no hand-maintained matrix).
 *
 * Tiers:
 * - Tier 0: curated TEST_BUILDS (11) — fast CI via npm test / audit:characters
 * - Tier 1: AUTO_SUBCLASS_SMOKE — one minimal build per subclass (~80)
 * - Tier 2: AUTO_POWER_HOST — one L20 host per additional-power root (~47)
 *
 * Full coverage: npm run audit:characters:full (Tier 0 + 1 + 2, deduped by id)
 */
import subclasses from "../../data/src/subclasses/index.ts";
import { additionalPowerFeatures } from "../../data/src/class-features/additional/index.ts";
import type { TestBuild } from "./audit-lib.js";
import { TEST_BUILDS } from "./test-matrix.js";

export type AuditTier = "curated" | "subclass-smoke" | "power-host";

export interface AuditBuildSets {
  curated: TestBuild[];
  subclassSmoke: TestBuild[];
  powerHost: TestBuild[];
  full: TestBuild[];
}

/** Slug for findAdditionalPower — strips punctuation from display name. */
export function powerNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** One minimal legal build per subclass from compendium index. */
export function generateSubclassSmokeBuilds(): TestBuild[] {
  return (subclasses as { system?: { classIdentifier?: string; identifier?: string }; name?: string }[]).map(
    (sub) => {
      const classId = String(sub.system?.classIdentifier ?? "").toLowerCase();
      const subclassId = String(sub.system?.identifier ?? "").toLowerCase();
      const label = String(sub.name ?? `${classId} ${subclassId}`);
      return {
        id: `smoke-${classId}-${subclassId}`,
        label: `Smoke / ${label}`,
        classIdentifier: classId,
        subclassIdentifier: subclassId,
        style: "npc" as const,
      };
    },
  );
}

type HostPick = { classIdentifier: string; subclassIdentifier: string };

/** Explicit host for subclass-specific power prereqs. Keys are normalized requirement substrings. */
const SUBCLASS_HOST_OVERRIDES: Record<string, HostPick> = {
  "battlesmith gadgeteer": { classIdentifier: "gadgeteer", subclassIdentifier: "battle-smith" },
  "okama kenpo brawler": { classIdentifier: "brawler", subclassIdentifier: "okama-kenpo" },
  "sumo wrestler brawler": { classIdentifier: "brawler", subclassIdentifier: "sumo-wrestler" },
  "six powers master brawler": { classIdentifier: "brawler", subclassIdentifier: "open-hand" },
  "fishman karate brawler": { classIdentifier: "brawler", subclassIdentifier: "open-hand" },
};

/** Default L20 host per class when only a class (or class N) prereq is present. */
const CLASS_DEFAULT_HOST: Record<string, HostPick> = {
  barbarian: { classIdentifier: "barbarian", subclassIdentifier: "berserker" },
  bard: { classIdentifier: "bard", subclassIdentifier: "lore" },
  brawler: { classIdentifier: "brawler", subclassIdentifier: "open-hand" },
  fighter: { classIdentifier: "fighter", subclassIdentifier: "champion" },
  gadgeteer: { classIdentifier: "gadgeteer", subclassIdentifier: "alchemist" },
  marksman: { classIdentifier: "marksman", subclassIdentifier: "sniper" },
  medic: { classIdentifier: "medic", subclassIdentifier: "field-surgeon" },
  rogue: { classIdentifier: "rogue", subclassIdentifier: "assassin" },
  savant: { classIdentifier: "savant", subclassIdentifier: "burning-passion" },
};

const GENERIC_HOST: HostPick = { classIdentifier: "fighter", subclassIdentifier: "champion" };

/** Resolve minimal L20 host from power root requirements text. */
export function resolvePowerHost(requirements: string): HostPick {
  const req = requirements.trim().toLowerCase();
  if (!req) return GENERIC_HOST;

  for (const [needle, host] of Object.entries(SUBCLASS_HOST_OVERRIDES)) {
    if (req.includes(needle)) return host;
  }

  for (const [classId, host] of Object.entries(CLASS_DEFAULT_HOST)) {
    if (new RegExp(`\\b${classId}\\b`).test(req)) return host;
  }

  // Thematic fallbacks for non-class prereqs
  if (req.includes("fire damage") || req.includes("burn")) {
    return CLASS_DEFAULT_HOST.savant;
  }
  if (req.includes("deception") || req.includes("acrobatics")) {
    return CLASS_DEFAULT_HOST.rogue;
  }
  if (req.includes("ranged") || req.includes("marksman")) {
    return CLASS_DEFAULT_HOST.marksman;
  }
  if (req.includes("unarmored") || req.includes("natural armor")) {
    return CLASS_DEFAULT_HOST.barbarian;
  }
  if (req.includes("improvised") || req.includes("thrown weapon")) {
    return CLASS_DEFAULT_HOST.fighter;
  }

  return GENERIC_HOST;
}

export function getAdditionalPowerRoots(): { name: string; slug: string; requirements: string }[] {
  return additionalPowerFeatures
    .filter((f) => f.flags?.op5e?.additionalPowerRoot)
    .map((f) => ({
      name: String(f.name ?? ""),
      slug: powerNameToSlug(String(f.name ?? "")),
      requirements: String(f.system?.requirements ?? ""),
    }));
}

/** One L20 host build per additional-power tree root. */
export function generateAdditionalPowerBuilds(): TestBuild[] {
  return getAdditionalPowerRoots().map((root) => {
    const host = resolvePowerHost(root.requirements);
    return {
      id: `power-${root.slug}`,
      label: `Power / ${root.name} on ${host.classIdentifier}/${host.subclassIdentifier}`,
      classIdentifier: host.classIdentifier,
      subclassIdentifier: host.subclassIdentifier,
      additionalPowerSlug: root.slug,
      style: "player" as const,
    };
  });
}

function dedupeById(builds: TestBuild[]): TestBuild[] {
  const seen = new Set<string>();
  const out: TestBuild[] = [];
  for (const b of builds) {
    if (seen.has(b.id)) continue;
    seen.add(b.id);
    out.push(b);
  }
  return out;
}

/** Curated (11), subclass smoke (~80), power host (~47), and combined full set. */
export function getAuditBuildSets(): AuditBuildSets {
  const curated = [...TEST_BUILDS];
  const subclassSmoke = generateSubclassSmokeBuilds();
  const powerHost = generateAdditionalPowerBuilds();
  const full = dedupeById([...curated, ...subclassSmoke, ...powerHost]);
  return { curated, subclassSmoke, powerHost, full };
}

export function getAuditBuilds(mode: "curated" | "full" = "curated"): TestBuild[] {
  const sets = getAuditBuildSets();
  return mode === "full" ? sets.full : sets.curated;
}
