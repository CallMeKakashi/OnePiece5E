import { generateId } from "./id.js";
import { actorArt } from "./actor-art.js";
import { PRIMARY_ACTIVITY_ID, transformDamagePart } from "./activities.js";

export interface StatblockEntry { name: string; desc: string }
export interface Statblock {
  name: string; size: string; type: string; alignment?: string; ac: number; hp: number; speed?: string;
  stats: number[]; cr: number; traits?: StatblockEntry[]; actions?: StatblockEntry[];
  skills?: Record<string, number>[]; damage_resistances?: string | string[]; senses?: string | string[]; condition_immunities?: string | string[];
}
export interface SourceRef { book: string; file: string; heading: string }

const SIZE: Record<string, string> = { tiny: "tiny", small: "sm", medium: "med", large: "lg", huge: "huge", gargantuan: "grg" };
const ABIL = ["str", "dex", "con", "int", "wis", "cha"];
const ABIL_NAME: Record<string, string> = { STR: "str", DEX: "dex", CON: "con", INT: "int", WIS: "wis", CHA: "cha" };
const SKILL: Record<string, string> = { Acrobatics: "acr", "Animal Handling": "ani", Arcana: "arc", Athletics: "ath", Deception: "dec", History: "his", Insight: "ins", Intimidation: "itm", Investigation: "inv", Medicine: "med", Nature: "nat", Perception: "prc", Performance: "prf", Persuasion: "per", Religion: "rel", "Sleight of Hand": "slt", Stealth: "ste", Survival: "sur" };
const DMG = new Set(["acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic", "piercing", "poison", "psychic", "radiant", "slashing", "thunder"]);

const ACTIVATION = { type: "action", value: 1, condition: "", override: false };
const baseActivity = (type: string, name: string, extra: object) => ({
  _id: PRIMARY_ACTIVITY_ID, type, name, sort: 0, activation: ACTIVATION,
  consumption: { targets: [], scaling: { allowed: false, max: "" }, spellSlot: false },
  description: { chatFlavor: "" }, duration: { concentration: false, value: null, units: "inst", special: "", override: false },
  effects: [], range: { value: null, units: "", special: "", override: false },
  target: { template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" }, affects: { count: "", type: "", choice: false, special: "" }, prompt: true, override: false },
  uses: { spent: 0, max: "", recovery: [] }, ...extra,
});

/** Parse "Melee Weapon Attack: +5 to hit. Hit: 1d6 +3 slashing" and "DC 15 WIS save" prose into activities. Unparsed prose stays in the description. */
export function actionActivities(desc: string): Record<string, unknown> {
  const atk = desc.match(/(Melee|Ranged)(?: Weapon)? Attack:\s*\+?(-?\d+) to hit/i);
  const hit = desc.match(/Hit:\s*(\d+d\d+)\s*([+-]\s*\d+)?\s*([a-z]+)?/i);
  if (atk) {
    const type = hit?.[3]?.toLowerCase();
    const part = hit ? transformDamagePart([`${hit[1]}${hit[2] ? ` ${hit[2].replace(/\s+/g, " ")}` : ""}`.replace(/ \+0$/, ""), DMG.has(type ?? "") ? type! : ""]) : null;
    return { [PRIMARY_ACTIVITY_ID]: baseActivity("attack", "Attack", {
      attack: { ability: "", bonus: atk[2], critical: { threshold: null }, flat: true, type: { value: atk[1].toLowerCase(), classification: "weapon" } },
      damage: { critical: { allow: true, bonus: "" }, parts: part ? [part] : [] },
    }) };
  }
  const save = desc.match(/DC (\d+) (STR|DEX|CON|INT|WIS|CHA) sav/i);
  if (save) return { [PRIMARY_ACTIVITY_ID]: baseActivity("save", "Save", {
    save: { ability: [ABIL_NAME[save[2].toUpperCase()]], dc: { calculation: "", formula: save[1] } },
    damage: { onSave: "half", parts: [] },
  }) };
  return {};
}

const featItem = (actorKey: string, e: StatblockEntry, activation: "passive" | "action") => {
  const activities = activation === "action" ? actionActivities(e.desc) : {};
  return {
    _id: generateId(`${actorKey}/${activation}/${e.name}`), name: e.name, type: "feat", img: "icons/svg/item-bag.svg",
    system: { description: { value: `<p>${e.desc}</p>`, chat: "" }, type: { value: "monster", subtype: "" }, activities, uses: { spent: 0, recovery: [], max: "" } },
    effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
  };
};

export function statblockToActor(sb: Statblock, source: SourceRef) {
  const key = `monster/${sb.name}`, id = generateId(key);
  const movement: Record<string, number> = {};
  for (const m of (sb.speed ?? "").matchAll(/(walk|climb|swim|fly|burrow)\s+(\d+)/gi)) movement[m[1].toLowerCase()] = Number(m[2]);
  const skills: Record<string, { value: number }> = {};
  for (const s of sb.skills ?? []) for (const [n, v] of Object.entries(s)) if (SKILL[n]) skills[SKILL[n]] = { value: 1 };
  const arr = (a?: string | string[]) => (Array.isArray(a) ? a : a ? [a] : []);
  const csv = (a?: string | string[]) => arr(a).flatMap((s) => s.split(",").map((x) => x.trim().toLowerCase())).filter(Boolean);
  const darkvision = Number(arr(sb.senses).join(" ").match(/darkvision\s+(\d+)/i)?.[1] ?? 0);
  const items = [...(sb.traits ?? []).map((t) => featItem(key, t, "passive")), ...(sb.actions ?? []).map((a) => featItem(key, a, "action"))];
  return {
    _id: id, name: sb.name, type: "npc", img: actorArt(sb.name, sb.type),
    system: {
      abilities: Object.fromEntries(ABIL.map((a, i) => [a, { value: sb.stats[i] ?? 10 }])),
      attributes: { ac: { calc: "flat", flat: sb.ac }, hp: { value: sb.hp, max: sb.hp, formula: "" }, movement: { ...movement, units: "ft" }, senses: { ranges: { darkvision }, units: "ft" } },
      details: { cr: sb.cr, type: { value: sb.type.toLowerCase() }, alignment: sb.alignment ?? "", source: { book: "OP5e Monster Manual", custom: source.file } },
      traits: { size: SIZE[sb.size.toLowerCase()] ?? "med", dr: { value: csv(sb.damage_resistances).filter((d) => DMG.has(d)), custom: "" }, ci: { value: csv(sb.condition_immunities), custom: "" } },
      skills,
    },
    items, effects: [], prototypeToken: { name: sb.name, actorLink: false, texture: { src: actorArt(sb.name, sb.type) } }, flags: { op5e: { source } }, folder: null, sort: 0, ownership: { default: 0 },
  };
}
