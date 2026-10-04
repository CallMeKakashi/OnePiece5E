import { generateId } from "./id.js";
import { createDAEEffect, type EffectChangeInput } from "./effects.js";
import { transformDamagePart } from "./activities.js";

// Hand-written automation specs -> dnd5e 5.1 activities + effects. One spec per compendium item, keyed "pack/Name".
// Each activity is one "button": a save, an attack, a damage roll, a heal or a utility with effects.

/** [formula, damage type(s), optional per-slot-level increase such as "1d8"] */
export type Dmg = [formula: string, types: string | string[], upcast?: string];
export interface EffectSpec {
  name: string; changes?: EffectChangeInput[]; statuses?: string[]; seconds?: number; rounds?: number; transfer?: boolean;
  /** true: applies to the targets of the activity (failed save / hit); false: to the user */
  onTargets?: boolean; flags?: Record<string, unknown>;
  /** passive effect that starts switched off: for rules dnd5e cannot evaluate itself (e.g. "while wearing no armor") the player toggles it */
  disabled?: boolean;
}
export interface ActSpec {
  name: string;
  type: "utility" | "save" | "attack" | "damage" | "heal" | "summon" | "transform";
  activation?: "action" | "bonus" | "reaction" | "minute" | "special" | "";
  reactionWhen?: string;
  range?: number; rangeUnits?: "ft" | "touch" | "self" | "";
  /** area template: shape + size in ft */
  area?: { type: "radius" | "sphere" | "cone" | "line" | "cube" | "cylinder"; size: number; /** line width in ft */ width?: number };
  targets?: { count?: number | string; type?: "creature" | "enemy" | "ally" | "self" | "object" };
  save?: { ability: string | string[]; dc?: string; onSave?: "half" | "none" | "full" };
  /** flat: bonus is the whole attack bonus (no ability/proficiency added by dnd5e) */
  attack?: { type: "melee" | "ranged"; bonus?: string; ability?: string; flat?: boolean };
  /** utility: an optional roll button (formula + label) */
  roll?: { formula: string; name?: string };
  damage?: Dmg[];
  /** weapon attacks: also roll the item's own base damage */
  includeBase?: boolean;
  healing?: { formula: string; type?: "healing" | "temp" };
  duration?: { value: number; units: "round" | "minute" | "hour" | "day" | "inst" | "turn"; concentration?: boolean };
  effects?: EffectSpec[];
  /** consume one use of the item's own uses */
  consumeUse?: boolean;
  /** identifier of another item on the actor whose uses are spent instead of this item's own */
  consumeTarget?: string;
  /** amount of uses consumed when consumeUse is set (formula, default "1") */
  consumeAmount?: string;
  /** extra resource consumed, e.g. a spell slot */
  note?: string;
  /** transform: the form's hit points are hpMultiplier x level + the beast's Con modifier (scripts/compendium.mjs sets them on transform) */
  transform?: { hpMultiplier: number };
  /** summon: names of premade actors in the summons pack; bonuses are item-roll-data formulas */
  summon?: { profiles: string[]; ac?: string; hp?: string; attackDamage?: string; saveDamage?: string; healing?: string; fixed?: boolean };
}
export interface Spec { /** replaces the description with clearer per-option HTML */ descriptionHtml?: string; activities: ActSpec[]; uses?: { max: string; per?: "sr" | "lr" | "day" | "round" | null }; extraEffects?: EffectSpec[] }

const id16 = (path: string) => generateId(`act/${path}`);
const types = (t: string | string[]) => (Array.isArray(t) ? t : [t]);
const part = (d: Dmg) => { const p = { ...transformDamagePart([d[0], types(d[1])[0]]), types: types(d[1]) }; if (d[2]) p.scaling = { mode: d[2].endsWith("/2") ? "half" : "whole", number: null, formula: d[2].replace(/\/2$/, "") }; return p; };
const DC_DEFAULT = "8 + @prof + max(@abilities.str.mod, @abilities.dex.mod, @abilities.con.mod, @abilities.int.mod, @abilities.wis.mod, @abilities.cha.mod)";

export interface SpecDefaults { activation?: string; range?: number | null; rangeUnits?: string; durationValue?: string; durationUnits?: string; concentration?: boolean; spell?: boolean }

export function buildFromSpec(key: string, spec: Spec, defaults: SpecDefaults = {}) {
  const effects: ReturnType<typeof createDAEEffect>[] = [];
  const effectId = (e: EffectSpec, ai: number) => {
    const ex = effects.find((x) => x.name === e.name);
    if (ex) return ex._id;
    const fx = createDAEEffect(`${key}/${e.name}`, e.name, e.changes ?? [], { transfer: e.transfer ?? false, statuses: e.statuses, durationSeconds: e.seconds, durationRounds: e.rounds, flags: e.flags, disabled: e.disabled });
    effects.push(fx); return fx._id; void ai;
  };
  const activities: Record<string, unknown> = {};
  spec.activities.forEach((a, i) => {
    const id = id16(`${key}/${i}`);
    const act: Record<string, unknown> = {
      _id: id, type: a.type, name: a.name, sort: i,
      activation: { type: a.activation ?? defaults.activation ?? "action", value: 1, condition: a.reactionWhen ?? "", override: false },
      consumption: { targets: a.consumeUse ? [{ type: "itemUses", target: a.consumeTarget ?? "", value: a.consumeAmount ?? "1", scaling: { mode: "", formula: "" } }] : [], scaling: { allowed: !!defaults.spell && (a.damage?.some((d) => d[2]) ?? false), max: "" }, spellSlot: !!defaults.spell && !a.consumeUse },
      description: { chatFlavor: a.note ?? "" },
      duration: a.duration
        ? { concentration: a.duration.concentration ?? defaults.concentration ?? false, value: a.duration.units !== "inst" ? String(a.duration.value) : "", units: a.duration.units, special: "", override: true }
        : { concentration: defaults.concentration ?? false, value: defaults.durationValue ?? "", units: defaults.durationUnits ?? "inst", special: "", override: false },
      effects: (a.effects ?? []).map((e) => ({ _id: effectId(e, i), onSave: false })),
      range: { value: a.range ?? defaults.range ?? null, units: a.rangeUnits ?? (a.range ? "ft" : (defaults.rangeUnits ?? "")), special: "", override: a.range !== undefined },
      target: {
        template: a.area ? { count: "1", contiguous: false, type: a.area.type, size: String(a.area.size), width: a.area.width ? String(a.area.width) : "", height: "", units: "ft" } : { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        // a buff whose effects are all for the user targets "self"; otherwise effects land on whoever is targeted
        affects: (() => {
          const selfOnly = !a.targets && !a.area && !!a.effects?.length && a.effects.every((e) => !e.onTargets);
          return { count: String(a.targets?.count ?? (selfOnly ? "1" : "")), type: a.targets?.type ?? (selfOnly ? "self" : ""), choice: false, special: "" };
        })(), prompt: true, override: !!(a.area || a.targets || (a.effects?.length && a.effects.every((e) => !e.onTargets))),
      },
      uses: { spent: 0, max: "", recovery: [] },
    };
    if (a.type === "save") {
      act.save = { ability: types(a.save!.ability), dc: { calculation: "", formula: a.save!.dc ?? DC_DEFAULT } };
      act.damage = { onSave: a.save!.onSave ?? "half", parts: (a.damage ?? []).map(part) };
    } else if (a.type === "attack") {
      act.attack = { ability: a.attack?.ability ?? "", bonus: a.attack?.bonus ?? "", critical: { threshold: null }, flat: a.attack?.flat ?? false, type: { value: a.attack?.type ?? "melee", classification: "weapon" } };
      act.damage = { critical: { allow: true, bonus: "" }, includeBase: a.includeBase ?? false, parts: (a.damage ?? []).map(part) };
    } else if (a.type === "damage") {
      act.damage = { critical: { allow: false, bonus: "" }, parts: (a.damage ?? []).map(part) };
    } else if (a.type === "heal") {
      const h = a.healing!; const p = transformDamagePart([h.formula, ""]);
      act.healing = { ...p, types: [h.type ?? "healing"] };
    } else if (a.type === "summon") {
      const sm = a.summon!;
      act.bonuses = { ac: sm.ac ?? "", hd: "", hp: sm.hp ?? "", attackDamage: sm.attackDamage ?? "", saveDamage: sm.saveDamage ?? "", healing: sm.healing ?? "" };
      act.creatureSizes = []; act.creatureTypes = [];
      act.match = { ability: "", attacks: !sm.fixed, proficiency: false, saves: !sm.fixed };
      act.profiles = sm.profiles.map((n) => ({ _id: generateId(`profile/${key}/${n}`).slice(0, 16), count: "1", cr: "", level: { min: null, max: null }, name: n, types: [], uuid: `Compendium.op5e.summons.Actor.${generateId(`monster/${n}`)}` }));
      act.summon = { identifier: "", mode: "", prompt: true };
    } else if (a.type === "transform") {
      // the player picks the beast actor when prompted (or the GM drags a beast onto this activity's profiles)
      act.profiles = []; act.transform = { customize: true, identifier: "", mode: "cr", preset: "" };
      act.settings = { keep: ["mental", "bio", "class", "feats"], merge: ["saves", "skills"], effects: [], other: [`op5e:hpmult:${a.transform?.hpMultiplier ?? 5}`], preset: null, spellLists: [], tempFormula: "", transformTokens: true, minimumAC: "" };
    } else {
      act.roll = { formula: a.roll?.formula ?? "", name: a.roll?.name ?? "", prompt: false, visible: !!a.roll };
    }
    activities[id] = act;
  });
  for (const e of spec.extraEffects ?? []) effectId(e, -1);
  return { activities, effects };
}

/** Applies a spec to a built document: replaces its activities, appends effects, optionally sets uses. */
export function applySpec<T extends { name: string; type?: string; system: Record<string, unknown>; effects?: unknown[] }>(doc: T, spec: Spec, key: string): T {
  const sys0 = doc.system as { activation?: { type?: string }; range?: { value?: number | null; units?: string }; duration?: { value?: string | number | null; units?: string }; components?: { concentration?: boolean } };
  const built = buildFromSpec(key, spec, {
    spell: doc.type === "spell" || (doc as { type?: string }).type === "spell", activation: sys0.activation?.type || undefined,
    range: sys0.range?.value ?? null, rangeUnits: sys0.range?.units ?? "", durationValue: sys0.duration?.value != null ? String(sys0.duration.value) : "",
    durationUnits: sys0.duration?.units || "inst", concentration: !!sys0.components?.concentration,
  });
  const system = { ...doc.system, activities: built.activities } as Record<string, unknown>;
  if (spec.descriptionHtml) system.description = { ...(system.description as object), value: spec.descriptionHtml };
  if (spec.uses) system.uses = { ...(system.uses as object), max: spec.uses.max, per: spec.uses.per ?? null, value: null, recovery: "", prompt: true };
  return { ...doc, system, effects: [...(doc.effects ?? []), ...built.effects] };
}
