import type { ActSpec, Spec } from "../../helpers/spec.js";
import { specs as a } from "../summons/group-a.js";
import { specs as b } from "../summons/group-b.js";
import { specs as c } from "../summons/group-c.js";
import { specs as d } from "../summons/group-d.js";

// Summon creations: link premade actors in the summons pack (data/src/summons). Scaling is per slot level above the creation's base level.
const L = "@item.level";
const above = (base: number) => `(${L} - ${base})`;
const sum = (name: string, profiles: string[], base: number, hpPer: number, acBase = 0): ActSpec => ({
  name, type: "summon", summon: { profiles, ac: `${L}${acBase ? ` + ${acBase}` : ""}`, hp: `${hpPer} * ${above(base)}`, attackDamage: L },
});

export const summonSpecs: Record<string, Spec> = {
  ...a, ...b, ...c, ...d,
  "creations/Animate Dead": { activities: [sum("Animate Undead", ["Hulking Animated Undead", "Rotten Animated Undead", "Skeletal Animated Undead"], 3, 10)] },
  "creations/Call Beast": { activities: [sum("Call Beast", ["Air Called Beast", "Land Called Beast", "Water Called Beast"], 2, 10)] },
};
