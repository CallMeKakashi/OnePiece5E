import { generateId } from "./id.js";
import { createDAEEffect, type EffectChangeInput } from "./effects.js";
import { transformDamagePart } from "./activities.js";

// Hand-written automation specs -> dnd5e 5.1 activities + effects. One spec per compendium item, keyed "pack/Name".
// Each activity is one "button": a save, an attack, a damage roll, a heal or a utility with effects.

export type Dmg = [formula: string, types: string | string[]];
export interface EffectSpec {
  name: string; changes?: EffectChangeInput[]; statuses?: string[]; seconds?: number; rounds?: number; transfer?: boolean;
  /** true: applies to the targets of the activity (failed save / hit); false: to the user */
  onTargets?: boolean; flags?: Record<string, unknown>;
}
export interface ActSpec {
  name: string;
  type: "utility" | "save" | "attack" | "damage" | "heal";
  activation?: "action" | "bonus" | "reaction" | "minute" | "special" | "";
  reactionWhen?: string;
  range?: number; rangeUnits?: "ft" | "touch" | "self" | "";
  /** area template: shape + size in ft */
  area?: { type: "radius" | "sphere" | "cone" | "line" | "cube" | "cylinder"; size: number };
  targets?: { count?: number | string; type?: "creature" | "enemy" | "ally" | "self" | "object" };
  save?: { ability: string | string[]; dc?: string; onSave?: "half" | "none" | "full" };
  attack?: { type: "melee" | "ranged"; bonus?: string };
  damage?: Dmg[];
  healing?: { formula: string; type?: "healing" | "temp" };
  duration?: { value: number; units: "round" | "minute" | "hour" | "day" | "inst" | "turn"; concentration?: boolean };
  effects?: EffectSpec[];
  /** consume one use of the item's own uses */
  consumeUse?: boolean;
  /** extra resource consumed, e.g. a spell slot */
  note?: string;
}
export interface Spec { activities: ActSpec[]; uses?: { max: string; per?: "sr" | "lr" | "day" | "round" | null }; extraEffects?: EffectSpec[] }

const id16 = (path: string) => generateId(`act/${path}`);
const types = (t: string | string[]) => (Array.isArray(t) ? t : [t]);
const part = (d: Dmg) => ({ ...transformDamagePart([d[0], types(d[1])[0]]), types: types(d[1]) });
const DC_DEFAULT = "8 + @prof + max(@abilities.str.mod, @abilities.dex.mod, @abilities.con.mod, @abilities.int.mod, @abilities.wis.mod, @abilities.cha.mod)";

export function buildFromSpec(key: string, spec: Spec) {
  const effects: ReturnType<typeof createDAEEffect>[] = [];
  const effectId = (e: EffectSpec, ai: number) => {
    const ex = effects.find((x) => x.name === e.name);
    if (ex) return ex._id;
    const fx = createDAEEffect(`${key}/${e.name}`, e.name, e.changes ?? [], { transfer: e.transfer ?? false, statuses: e.statuses, durationSeconds: e.seconds, durationRounds: e.rounds, flags: e.flags });
    effects.push(fx); return fx._id; void ai;
  };
  const activities: Record<string, unknown> = {};
  spec.activities.forEach((a, i) => {
    const id = id16(`${key}/${i}`);
    const act: Record<string, unknown> = {
      _id: id, type: a.type, name: a.name, sort: i,
      activation: { type: a.activation ?? "action", value: a.activation === "minute" ? 1 : 1, condition: a.reactionWhen ?? "", override: false },
      consumption: { targets: a.consumeUse ? [{ type: "itemUses", target: "", value: "1", scaling: { mode: "", formula: "" } }] : [], scaling: { allowed: false, max: "" }, spellSlot: false },
      description: { chatFlavor: a.note ?? "" },
      duration: { concentration: a.duration?.concentration ?? false, value: a.duration && a.duration.units !== "inst" ? String(a.duration.value) : "", units: a.duration?.units ?? "inst", special: "", override: !!a.duration },
      effects: (a.effects ?? []).map((e) => ({ _id: effectId(e, i), onSave: false })),
      range: { value: a.range ?? null, units: a.rangeUnits ?? (a.range ? "ft" : ""), special: "", override: false },
      target: {
        template: a.area ? { count: "1", contiguous: false, type: a.area.type, size: String(a.area.size), width: "", height: "", units: "ft" } : { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: String(a.targets?.count ?? ""), type: a.targets?.type ?? "", choice: false, special: "" }, prompt: true, override: !!(a.area || a.targets),
      },
      uses: { spent: 0, max: "", recovery: [] },
    };
    if (a.type === "save") {
      act.save = { ability: types(a.save!.ability), dc: { calculation: "", formula: a.save!.dc ?? DC_DEFAULT } };
      act.damage = { onSave: a.save!.onSave ?? "half", parts: (a.damage ?? []).map(part) };
    } else if (a.type === "attack") {
      act.attack = { ability: "", bonus: a.attack?.bonus ?? "", critical: { threshold: null }, flat: false, type: { value: a.attack?.type ?? "melee", classification: "weapon" } };
      act.damage = { critical: { allow: true, bonus: "" }, parts: (a.damage ?? []).map(part) };
    } else if (a.type === "damage") {
      act.damage = { critical: { allow: false, bonus: "" }, parts: (a.damage ?? []).map(part) };
    } else if (a.type === "heal") {
      const h = a.healing!; const p = transformDamagePart([h.formula, ""]);
      act.healing = { ...p, types: [h.type ?? "healing"] };
    } else {
      act.roll = { formula: "", name: "", prompt: false, visible: false };
    }
    activities[id] = act;
  });
  for (const e of spec.extraEffects ?? []) effectId(e, -1);
  return { activities, effects };
}

/** Applies a spec to a built document: replaces its activities, appends effects, optionally sets uses. */
export function applySpec<T extends { name: string; system: Record<string, unknown>; effects?: unknown[] }>(doc: T, spec: Spec, key: string): T {
  const built = buildFromSpec(key, spec);
  const system = { ...doc.system, activities: built.activities } as Record<string, unknown>;
  if (spec.uses) system.uses = { ...(system.uses as object), max: spec.uses.max, per: spec.uses.per ?? null, value: null, recovery: "", prompt: true };
  return { ...doc, system, effects: [...(doc.effects ?? []), ...built.effects] };
}
