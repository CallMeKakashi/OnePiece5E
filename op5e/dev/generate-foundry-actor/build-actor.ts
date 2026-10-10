/**
 * Generic Actor Build module — compendium source → standalone workshop actor JSON.
 */
import {
  findBackground,
  findClass,
  findItemByName,
  findRace,
  findRole,
  findSubclass,
  findByUuid,
  getCompendiumIndex,
  getSubclassLevel,
  type AnyDoc,
} from "../character-sheet-audit/audit-lib.js";
import { cr5AbilityScores } from "./build-from-spec-scores.js";
import type { BuildSpec } from "./build-spec.schema.js";
import { embedOwnedItem, embedGrants, type CompendiumDoc } from "./compendium-resolver.js";
import {
  applyTraitChoices,
  embedChoiceItems,
  embedEquipmentByName,
  embedStartingHaki,
} from "./apply-choices.js";
import { resolveDevilFruit, resolveSubclassCustom } from "./homebrew.js";
import { dedupeItems, EmbedRegistry, makeStandalone } from "./standalone.js";

const ABILITY_MAP: Record<string, string> = {
  acr: "dex",
  ath: "str",
  dec: "cha",
  ins: "wis",
  itm: "cha",
  inv: "int",
  prc: "wis",
  prf: "cha",
  per: "cha",
  slt: "dex",
  ste: "dex",
  his: "int",
  arc: "int",
  nat: "int",
  rel: "int",
};

function defaultSkills(): Record<string, { value: number; ability: string; bonuses: { check: string; passive: string } }> {
  return {};
}

function skillBlock(
  spec: BuildSpec,
): Record<string, { value: number; ability: string; bonuses: { check: string; passive: string } }> {
  const skills = defaultSkills();
  for (const [k, v] of Object.entries(spec.skills ?? {})) {
    skills[k] = {
      value: v,
      ability: ABILITY_MAP[k] ?? "int",
      bonuses: { check: "", passive: "" },
    };
  }
  return skills;
}

function toolBlock(
  spec: BuildSpec,
): Record<string, { value: number; ability: string; bonuses: { check: string; passive: string } }> {
  const tools: Record<string, { value: number; ability: string; bonuses: { check: string; passive: string } }> = {};
  for (const [k, v] of Object.entries(spec.tools ?? {})) {
    tools[k] = {
      value: v,
      ability: "dex",
      bonuses: { check: "", passive: "" },
    };
  }
  return tools;
}

function resolveBackground(spec: BuildSpec, index: ReturnType<typeof getCompendiumIndex>): AnyDoc | undefined {
  return (
    (spec.backgroundSlug ? findBackground(spec.backgroundSlug, index) : undefined) ??
    (spec.backgroundUuid ? findByUuid(spec.backgroundUuid, index) : undefined)
  );
}

function resolveRole(spec: BuildSpec, index: ReturnType<typeof getCompendiumIndex>): AnyDoc | undefined {
  return (
    (spec.roleSlug ? findRole(spec.roleSlug, index) : undefined) ??
    (spec.roleUuid ? findByUuid(spec.roleUuid, index) : undefined)
  );
}

function hitDie(classDoc: AnyDoc): string {
  return String((classDoc.system as { hitDice?: string })?.hitDice ?? "d8");
}

function estimateHp(level: number, hitDice: string, conMod = 2): number {
  const sides = Number(hitDice.replace("d", "")) || 8;
  const avg = Math.floor(sides / 2) + 1;
  return sides + conMod + (level - 1) * (avg + conMod);
}

function buildBiography(spec: BuildSpec, race: AnyDoc, cls: AnyDoc, subclassName?: string): string {
  if (spec.biography) return spec.biography;
  const parts = [spec.name, cls.name];
  if (subclassName) parts.push(subclassName);
  if (spec.devilFruit?.slug) parts.push(`${spec.devilFruit.slug} user`);
  return `<p>${parts.join(" — ")} (${race.name}).</p>`;
}

/** Build a standalone workshop actor from a validated BuildSpec. */
export async function buildActor(spec: BuildSpec): Promise<Record<string, unknown>> {
  if (spec.buildPath === "monster-statblock") {
    throw new Error("Monster statblock path not implemented — use class-based builds");
  }

  const registry = new EmbedRegistry();
  const index = getCompendiumIndex();
  const level = spec.level;
  const abilities = spec.abilities ?? cr5AbilityScores(spec.cr);
  const prof = 2 + Math.floor((level - 1) / 4);

  const race = findRace(spec.raceIdentifier, index);
  const cls = findClass(spec.classIdentifier, index);
  if (!race || !cls) throw new Error("Race or class not found in compendium index");

  const items: CompendiumDoc[] = [];
  const embed = (source: CompendiumDoc, opts: { equipped?: boolean; quantity?: number } = {}) =>
    embedOwnedItem(source, { ...opts, registry });

  items.push(embed(race as CompendiumDoc));

  const bg = resolveBackground(spec, index);
  if (bg) items.push(embed(bg as CompendiumDoc));

  let roleBeri = 0;
  const role = resolveRole(spec, index);
  if (role) {
    items.push(embed(role as CompendiumDoc));
    roleBeri = Number((role.flags as { op5e?: { startingBeri?: number } })?.op5e?.startingBeri ?? 0);
    items.push(...embedGrants(role as CompendiumDoc, "role", String(role.name), level, 0, registry));
  }

  const classDoc = structuredClone(cls) as CompendiumDoc;
  (classDoc.system as Record<string, unknown>).levels = level;
  items.push(embed(classDoc));

  const custom = resolveSubclassCustom(spec.subclassCustom);
  let subclassName: string | undefined;

  if (custom) {
    subclassName = custom.subclass.name;
    if (level >= custom.grantLevel) {
      for (const f of custom.features) {
        items.push(embed(f as unknown as CompendiumDoc));
      }
    }
    items.push(embed(custom.subclass as unknown as CompendiumDoc));
  } else if (spec.subclassIdentifier) {
    const sub = findSubclass(spec.classIdentifier, spec.subclassIdentifier, index);
    if (sub) {
      subclassName = String(sub.name ?? spec.subclassIdentifier);
      items.push(embed(sub as CompendiumDoc));
      const subLevel = getSubclassLevel(cls);
      items.push(...embedGrants(sub as CompendiumDoc, "subclass", subclassName, level, subLevel, registry));
    }
  }

  items.push(...embedGrants(cls as CompendiumDoc, "class", String(cls.name), level, 0, registry));
  if (bg) items.push(...embedGrants(bg as CompendiumDoc, "background", String(bg.name), level, 0, registry));

  items.push(...embedStartingHaki(spec.startingHaki, registry));
  items.push(...embedChoiceItems(spec, registry));

  for (const df of resolveDevilFruit(spec.devilFruit?.slug)) {
    items.push(embed(df as unknown as CompendiumDoc));
  }

  items.push(
    ...embedEquipmentByName(spec.equipment, registry, (name) => findItemByName(name, index)),
  );

  const bgBeri = Number((bg?.flags as { op5e?: { startingBeri?: number } })?.op5e?.startingBeri ?? 50_000);
  const currencyGp = spec.currencyGp ?? bgBeri + roleBeri;

  const skills = skillBlock(spec);
  const tools = toolBlock(spec);
  applyTraitChoices(spec, skills, tools);

  const img = spec.img ?? spec.portraitImg ?? spec.tokenImg ?? "";
  const hd = hitDie(cls);
  const conMod = Math.floor(((abilities.con ?? 10) - 10) / 2);
  const hp = estimateHp(level, hd, conMod);

  const actor = {
    name: spec.name,
    type: spec.actorKind === "pc" ? "character" : "npc",
    img,
    prototypeToken: img ? { texture: { src: spec.tokenImg ?? img } } : undefined,
    effects: [],
    flags: { op5e: { workshop: true, buildTool: "generate-foundry-actor" } },
    _stats: {
      compendiumSource: null,
      duplicateSource: null,
      coreVersion: "13",
      systemId: "dnd5e",
      systemVersion: "5.1.10",
      createdTime: null,
      modifiedTime: null,
      lastModifiedBy: null,
    },
    system: {
      abilities: Object.fromEntries(
        Object.entries(abilities).map(([k, v]) => [
          k,
          { value: v, proficient: 0, bonuses: { check: "", save: "" } },
        ]),
      ),
      attributes: {
        ac: { flat: null, calc: "default", formula: "" },
        hp: { value: hp, max: hp, temp: 0, tempmax: 0, formula: `${level}${hd}+${level * conMod}` },
        init: { ability: "dex", bonus: 0, roll: { min: null, max: null, mode: 0 } },
        movement: { burrow: 0, climb: 0, fly: 0, swim: spec.devilFruit?.slug ? 0 : 30, walk: 30, units: "ft", hover: false },
        attunement: { max: 3 },
        senses: { darkvision: 0, blindsight: 0, tremorsense: 0, truesight: 0, units: "ft", special: "" },
        spellcasting: "",
        exhaustion: 0,
        concentration: { ability: "", bonuses: { save: "" }, limit: 1 },
        death: { success: 0, failure: 0, ability: "", roll: { min: null, max: null, mode: 0 } },
        inspiration: false,
        prof,
      },
      details: {
        biography: { value: buildBiography(spec, race, cls, subclassName), public: "" },
        alignment: "neutral",
        ideal: "",
        bond: "",
        flaw: "",
        race: race.name,
        type: { value: "humanoid", subtype: "", custom: "", swarm: "", swarmSize: "" },
        cr: spec.cr ?? 5,
        level,
        spellLevel: 0,
      },
      skills,
      tools,
      traits: {
        size: "med",
        di: { value: [], bypasses: [], custom: "" },
        dr: { value: [], bypasses: [], custom: "" },
        dv: { value: [], bypasses: [], custom: "" },
        ci: { value: [], custom: "" },
        languages: { value: ["common"], custom: "" },
        weaponProf: { value: [], custom: "" },
        armorProf: { value: [], custom: "" },
      },
      currency: { pp: 0, gp: currencyGp, ep: 0, sp: 0, cp: 0 },
    },
    items: dedupeItems(items),
  };

  return makeStandalone(actor, registry);
}
