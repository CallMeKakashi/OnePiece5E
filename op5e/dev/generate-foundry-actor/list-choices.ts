#!/usr/bin/env node
/**
 * List pending advancement choices for a build spec up to target level.
 */
import { readFileSync } from "node:fs";

import {
  findBackground,
  findClass,
  findRace,
  findRole,
  findSubclass,
  getCompendiumIndex,
  getSubclassLevel,
  type AnyDoc,
} from "../character-sheet-audit/audit-lib.ts";
import {
  allHakiSlugs,
  getAvailableHakiSlugs,
  hakiUuid,
} from "../../data/helpers/haki-advancement.ts";
import { compendiumUuid } from "../../data/helpers/uuid.ts";
import { parseBuildSpec, type BuildSpec } from "./build-spec.schema.js";

interface ChoiceStep {
  stepId: string;
  level: number;
  source: string;
  sourceName: string;
  type: string;
  title: string;
  hint: string;
  hakiChoice?: boolean;
  options: { uuid: string; name: string; slug: string }[];
}

const HAKI_UUID_TO_SLUG = new Map(allHakiSlugs().map((slug) => [hakiUuid(slug), slug]));

function parseArgs(): BuildSpec {
  const idx = process.argv.indexOf("--spec");
  if (idx === -1) {
    console.error("Missing --spec '<json>' or --spec @file.json");
    process.exit(1);
  }
  let raw = process.argv[idx + 1] ?? "";
  if (raw.startsWith("@")) raw = readFileSync(raw.slice(1), "utf8");
  return parseBuildSpec(JSON.parse(raw));
}

function getAdvancements(doc: AnyDoc): AnyDoc[] {
  const adv = doc.system?.advancement;
  return Array.isArray(adv) ? adv : [];
}

function slugFromUuid(uuid: string): string {
  const m = uuid.match(/\.([a-f0-9]{16})$/i);
  return m?.[1] ?? uuid;
}

function poolOptions(
  pool: unknown[],
  index: ReturnType<typeof getCompendiumIndex>,
): ChoiceStep["options"] {
  return (pool ?? [])
    .filter((p): p is { uuid: string } => typeof (p as { uuid?: string })?.uuid === "string")
    .map((p) => {
      const doc = index.byUuid.get(p.uuid);
      const name = doc?.name ? String(doc.name) : p.uuid;
      return { uuid: p.uuid, name, slug: slugFromUuid(p.uuid) };
    });
}

function collectHakiOwned(spec: BuildSpec): Set<string> {
  const owned = new Set<string>(spec.startingHaki ?? []);
  for (const choice of spec.choices ?? []) {
    for (const uuid of choice.uuids ?? []) {
      const slug = HAKI_UUID_TO_SLUG.get(uuid);
      if (slug) owned.add(slug);
    }
  }
  return owned;
}

function filterHakiOptions(
  pool: ChoiceStep["options"],
  owned: Set<string>,
): ChoiceStep["options"] {
  const validSlugs = new Set(getAvailableHakiSlugs(owned));
  return pool.filter((opt) => {
    const slug = HAKI_UUID_TO_SLUG.get(opt.uuid);
    return slug != null && validSlugs.has(slug);
  });
}

function isStepResolved(stepId: string, spec: BuildSpec): boolean {
  return (spec.choices ?? []).some((c) => c.stepId === stepId);
}

function walkDoc(
  doc: AnyDoc | undefined,
  source: string,
  sourceName: string,
  maxLevel: number,
  minLevel: number,
  spec: BuildSpec,
  index: ReturnType<typeof getCompendiumIndex>,
  pending: ChoiceStep[],
) {
  if (!doc) return;

  for (const adv of getAdvancements(doc)) {
    const level = Number(adv.level ?? 0);
    if (level < minLevel || level > maxLevel) continue;

    const stepId = String(adv._id ?? `${source}-${level}-${adv.type}-${adv.title}`);
    if (isStepResolved(stepId, spec)) continue;

    const cfg = (adv.configuration ?? {}) as Record<string, unknown>;
    const title = String(adv.title ?? adv.type ?? "Choice");
    const hint = String(adv.hint ?? "");

    if (adv.type === "ItemChoice") {
      const pool = poolOptions(cfg.pool as unknown[], index);
      const hakiChoice = cfg.op5eHakiChoice === true;
      const options = hakiChoice ? filterHakiOptions(pool, collectHakiOwned(spec)) : pool;
      if (options.length === 0) continue;
      pending.push({
        stepId,
        level,
        source,
        sourceName,
        type: "ItemChoice",
        title,
        hint: hint || (hakiChoice ? "Choose one Haki feat (branch upgrade or new Novice)." : ""),
        hakiChoice,
        options,
      });
    }

    if (adv.type === "Trait") {
      const choices = (cfg.choices as { count?: number; pool?: string[] }[]) ?? [];
      if (choices.length > 0) {
        pending.push({
          stepId,
          level,
          source,
          sourceName,
          type: "Trait",
          title,
          hint: hint || "Choose proficiencies or traits from the pool.",
          options: (choices[0]?.pool ?? []).map((entry) => ({
            uuid: entry,
            name: entry.replace(/^skills:/, "Skill: ").replace(/^tool:/, "Tool: "),
            slug: entry,
          })),
        });
      }
    }

    if (adv.type === "Subclass" && !spec.subclassIdentifier && !spec.subclassCustom) {
      const classId = spec.classIdentifier?.toLowerCase();
      const subs = index.subclasses.filter(
        (s) => String(s.system?.classIdentifier ?? "").toLowerCase() === classId,
      );
      pending.push({
        stepId,
        level,
        source,
        sourceName,
        type: "Subclass",
        title: title || "Subclass",
        hint: hint || "Choose a subclass.",
        options: subs.map((s) => ({
          uuid: compendiumUuid("subclasses", String(s._id)),
          name: String(s.name ?? ""),
          slug: String(s.system?.identifier ?? ""),
        })),
      });
    }
  }
}

const spec = parseArgs();

if (spec.buildPath === "monster-statblock") {
  console.log(JSON.stringify({ pending: [], note: "Monster path — no class advancements." }, null, 2));
  process.exit(0);
}

const level = spec.level;
const index = getCompendiumIndex();
const classDoc = findClass(spec.classIdentifier, index);
const raceDoc = findRace(spec.raceIdentifier, index);
const bgDoc = spec.backgroundSlug ? findBackground(spec.backgroundSlug, index) : undefined;
const roleDoc = spec.roleSlug ? findRole(spec.roleSlug, index) : undefined;

const pending: ChoiceStep[] = [];

walkDoc(raceDoc, "race", String(raceDoc?.name ?? spec.raceIdentifier), level, 0, spec, index, pending);
walkDoc(classDoc, "class", String(classDoc?.name ?? spec.classIdentifier), level, 0, spec, index, pending);

if (spec.backgroundSlug) {
  walkDoc(bgDoc, "background", String(bgDoc?.name ?? spec.backgroundSlug), level, 0, spec, index, pending);
}
if (spec.roleSlug) {
  walkDoc(roleDoc, "role", String(roleDoc?.name ?? spec.roleSlug), level, 0, spec, index, pending);
}

const subclassLevel = classDoc ? getSubclassLevel(classDoc) : 3;
if (spec.subclassIdentifier && !spec.subclassCustom && level >= subclassLevel) {
  const sub = findSubclass(spec.classIdentifier, spec.subclassIdentifier, index);
  walkDoc(sub, "subclass", String(sub?.name ?? spec.subclassIdentifier), level, subclassLevel, spec, index, pending);
}

pending.sort((a, b) => a.level - b.level || a.source.localeCompare(b.source));

console.log(
  JSON.stringify(
    {
      level,
      resolvedCount: (spec.choices ?? []).length,
      pendingCount: pending.length,
      pending,
    },
    null,
    2,
  ),
);
