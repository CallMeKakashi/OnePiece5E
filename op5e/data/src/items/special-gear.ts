import { generateId } from "../../helpers/id.js";
import type { FoundryItem } from "../../schemas/common.js";
import { weapons } from "./weapons.js";
import { armorItems } from "./armor.js";

// Structured mechanics for the named ranked/cursed/special gear in magic-items.ts (base item, magical bonus, damage override).
// Activities and effects live in automation/ship-gear.ts, keyed "items/<Name>".
type Sys = Record<string, unknown>;
type Doc = FoundryItem & { system: Sys };

const find = (list: FoundryItem[], name: string) => list.find((i) => i.name === name) as Doc | undefined;
const copy = <T>(x: T): T => JSON.parse(JSON.stringify(x));

/** Copy base-weapon fields from a real weapon, then apply magical bonus and damage override. */
function weapon(it: Doc, baseName: string | null, bonus: number, dmg?: [string, string][]) {
  const b = baseName ? find(weapons, baseName)?.system : undefined;
  if (baseName && !b) throw new Error(`special-gear: base weapon ${baseName} not found`);
  const bd = (b?.damage ?? { parts: [], versatile: "" }) as { parts: [string, string][]; versatile: string };
  it.system = {
    ...it.system,
    ...(b ? { type: copy(b.type), range: copy(b.range), weight: copy(b.weight), actionType: b.actionType, activation: copy(b.activation) } : { actionType: "mwak" }),
    properties: { ...(copy(b?.properties ?? {}) as object), mgc: true },
    magicalBonus: bonus,
    damage: { parts: copy(dmg ?? bd.parts), versatile: dmg ? "" : bd.versatile },
  };
}

/** Copy base-armor fields from a real armor. */
function armor(it: Doc, baseName: string, patch: Sys = {}, bonus = 0) {
  const b = find(armorItems, baseName)?.system;
  if (!b) throw new Error(`special-gear: base armor ${baseName} not found`);
  it.system = {
    ...it.system, type: copy(b.type), armor: copy(b.armor), strength: b.strength, stealth: b.stealth, weight: copy(b.weight),
    properties: { mgc: bonus > 0 }, magicalBonus: bonus || undefined, ...patch,
  };
}

function clone(it: Doc, id: string, name: string): Doc {
  const c = copy(it) as Doc;
  c._id = generateId(`items/magic/${id}`);
  c.name = name;
  return c;
}

export function applySpecialGear(items: FoundryItem[]): FoundryItem[] {
  const by = (n: string) => {
    const it = find(items, n);
    if (!it) throw new Error(`special-gear: item ${n} not found`);
    return it;
  };
  const extra: FoundryItem[] = [];

  weapon(by("Arched Horn"), "Sickle", 1);
  weapon(by("Orange Mile"), "Glaive", 1);
  weapon(by("Distortion"), "Rapier", 2);
  // the book calls Ocean's Mourning a cutlass but writes "+2 Sickle"; the cutlass is used here
  weapon(by("Ocean's Mourning"), "Cutlass", 2);
  weapon(by("Mountain Mist"), "Katana", 3, [["3d4", "slashing"]]);
  weapon(by("The Faithful One"), "Dagger", 3);
  weapon(by("Lucky Day"), "Longsword", 3);
  weapon(by("Wyvern's Wrath"), "Greatsword", 3, [["2d8", "slashing"]]);
  weapon(by("Kopesh"), "Scimitar", 3, [["2d6", "slashing"]]);
  weapon(by("Dead Man's Blade (Gambler Blade/Defender)"), null, 0);
  weapon(by("Seastone Weapon (Tipped)"), null, 2);
  weapon(by("Seastone Weapon (Full)"), null, 3);

  // Defiance of the Red World: the three tiers are separate docs (different dice and bonus)
  const defiance = by("Defiance of the Red World");
  weapon(defiance, "Rifle", 1, [["2d8", "piercing"]]);
  for (const [tier, bonus, die] of [["Wakened", 2, "2d10"], ["Exalted", 3, "2d12"]] as const) {
    const c = clone(defiance, `defiance-${tier.toLowerCase()}`, `Defiance of the Red World (${tier})`);
    weapon(c, "Rifle", bonus, [[die, "piercing"]]);
    extra.push(c);
  }

  // armor and shields
  armor(by("Serpent Armor (Serpent Scale)"), "Scale Mail", { armor: { value: 14, dex: null }, stealth: false });
  // base armor is not named in the book: Chain Mail (lowest heavy) is the chassis, the book's bonus is the magical bonus
  armor(by("Raid Suit"), "Chain Mail", { stealth: false }, 2);
  armor(by("Seastone Armor"), "Chain Mail", {}, 3);
  armor(by("Mechanical Shield (Animated Shield)"), "Shield");

  const seer = by("The Silver Seer");
  armor(seer, "Shield", {}, 1);
  for (const [tier, bonus] of [["Wakened", 2], ["Ascendant", 3]] as const) {
    const c = clone(seer, `silver-seer-${tier.toLowerCase()}`, `The Silver Seer (${tier})`);
    armor(c, "Shield", {}, bonus);
    extra.push(c);
  }
  return [...items, ...extra];
}
