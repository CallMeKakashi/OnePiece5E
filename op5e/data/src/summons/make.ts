import { statblockToActor, type Statblock, type StatblockEntry } from "../../helpers/actor.js";

// Premade summon actors for the creations (Appendix A). One actor per variant, built at the creation's base level;
// the summon activity adds level scaling (AC, HP, damage) from the slot used. Attack bonus and DC come from the summoner (match.attacks/saves).
export interface SummonVariant {
  name: string; size: string; type: string; ac: number; hp: number; speed: string; stats: number[];
  resist?: string[]; immune?: string[]; condImmune?: string[]; senses?: string; languages?: string;
  traits?: StatblockEntry[]; actions?: StatblockEntry[];
}
const ABIL = ["str", "dex", "con", "int", "wis", "cha"];

export function summon(v: SummonVariant, file: string) {
  const sb: Statblock = { name: v.name, size: v.size, type: v.type, ac: v.ac, hp: v.hp, speed: v.speed, stats: v.stats, cr: 0, traits: v.traits, actions: v.actions,
    damage_resistances: v.resist, condition_immunities: v.condImmune, senses: v.senses ?? "darkvision 60 ft." };
  const a = statblockToActor(sb, { book: "OP5e Sourcebook", file: `Appendix A Creations/${file}`, heading: v.name }) as any;
  a.system.traits.di = { value: v.immune ?? [], custom: "" };
  a.system.traits.languages = { value: [], custom: v.languages ?? "" };
  a.system.attributes.hp.formula = "";
  a.system.details.cr = 0;
  // prototype token: linked-off, hostile-less default friendly
  a.prototypeToken = { ...a.prototypeToken, disposition: 1 };
  void ABIL;
  return a;
}
