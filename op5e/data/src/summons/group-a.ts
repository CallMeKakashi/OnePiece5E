import type { SummonVariant } from "./make.js";
import type { Spec } from "../../helpers/spec.js";

const e = (name: string, desc: string) => ({ name, desc });
const MULTI = (who: string) => e("Multiattack", `The ${who} makes a number of attacks equal to half this creation's level (rounded down).`);
const ATK = (name: string, kind: string, reach: string, dmg: string, type: string, extra = "") =>
  e(name, `${kind} Weapon Attack: +0 to hit, ${reach}, one target. Hit: ${dmg} ${type} damage (plus the creation's level).${extra ? " " + extra : ""}`);

const OOZE_FORM = (t: string) => e("Ooze Form", `The ooze can move through a space as narrow as 1 inch wide without squeezing. In addition, a creature that touches the ooze or hits it with a melee attack takes 4 (1d8) ${t} damage.`);
const ooze = (color: string, di: string, trait: ReturnType<typeof e>, resist: string[] = []): SummonVariant => ({
  name: `${color} Concocted Ooze`, size: "Medium", type: "ooze", ac: 9, hp: 40, speed: "walk 20, climb 20", stats: [18, 8, 18, 6, 8, 6],
  resist, immune: ["poison", "acid", "necrotic"], condImmune: ["blinded", "charmed", "deafened", "exhaustion", "frightened", "prone", "grappled", "poisoned"],
  senses: "blindsight 60 ft.", languages: "understands the languages you speak",
  traits: [OOZE_FORM(di), trait],
  actions: [MULTI("ooze"), ATK("Pseudopod", "Melee", "reach 5 ft.", "3d4 + 4", di)],
});

const ELEM_COND = ["exhaustion", "frightened", "paralyzed", "petrified", "poisoned", "unconscious"];
const AMORPH = e("Amorphous Form", "The elemental can move through a space as narrow as 1 inch wide without squeezing.");
const elem = (el: string, speed: string, resist: string[], immune: string[], extraCond: string[], traits: ReturnType<typeof e>[], action: ReturnType<typeof e>): SummonVariant => ({
  name: `${el} Conjured Elemental`, size: "Medium", type: "elemental", ac: 12, hp: 40, speed, stats: [18, 16, 18, 6, 12, 6],
  resist, immune: ["poison", ...immune], condImmune: [...ELEM_COND, ...extraCond], languages: "understands the languages you speak",
  traits, actions: [MULTI("elemental"), action],
});
const AFW = ["grappled", "prone"];

const construct = (kind: string, size: string, speed: string, resist: string[], trait: ReturnType<typeof e>, action: ReturnType<typeof e>): SummonVariant => ({
  name: `${kind} Created Construct`, size, type: "construct", ac: 13, hp: 40, speed, stats: [18, 12, 18, 14, 12, 6],
  resist, immune: ["poison"], condImmune: ["charmed", "exhaustion", "frightened", "incapacitated", "paralyzed", "petrified", "poisoned"],
  languages: "understands the languages you speak", traits: [trait], actions: [MULTI("construct"), action],
});

export const families: [string, SummonVariant[]][] = [
  ["Concocted Ooze", [
    ooze("Green", "poison", e("Green Focus", "When the ooze has at least 1 hit point, any damaging or healing creation that the creature concentrating on the creation that created the ooze deals or heals an extra 1d4 for one roll of damage or healing if the target is within 30 ft. of the ooze.")),
    ooze("Black", "acid", e("Black Bits", "When the ooze is of Medium or larger size and is subjected to slashing damage, it can use its reaction to split apart into two new oozes if it has at least 10 hit points. Each new ooze has hit points equal to half the original ooze's, rounded down. New oozes are one size smaller than the original ooze."), ["slashing"]),
    ooze("Purple", "necrotic", e("Purple Absorption", "When the ooze deals damage to a creature, it absorbs its mass, regaining a number of hit points equal to the damage it dealt.")),
  ]],
  ["Conjured Elemental", [
    elem("Air", "walk 40, fly 40", ["lightning", "thunder"], [], AFW, [AMORPH],
      ATK("Air Strike", "Ranged", "range 120 ft.", "1d10 + 4", "bludgeoning", "(bludgeoning, piercing, or slashing, your choice)")),
    elem("Earth", "walk 40, burrow 40", ["bludgeoning", "piercing", "slashing"], [], [], [],
      ATK("Rock Crush", "Melee", "reach 5 ft.", "1d12 + 4", "bludgeoning", "(bludgeoning, piercing, or slashing, your choice). If the target is a creature of Large or smaller size, the elemental can choose to push it back 5 feet.")),
    elem("Fire", "walk 40", [], ["fire"], AFW, [AMORPH],
      ATK("Flame Touch", "Melee", "reach 5 ft.", "1d10 + 4", "fire", "If the target is a creature or a flammable object, it ignites. Until a creature takes an action or bonus action to douse the fire, the target takes 1d10 fire damage at the start of each of its turns.")),
    elem("Water", "walk 40, swim 40", ["acid", "cold"], [], AFW, [AMORPH],
      ATK("Water Whip", "Melee", "reach 30 ft.", "1d10 + 4", "bludgeoning", "(bludgeoning, piercing, or slashing, your choice). If the target is a creature of Large or smaller size, the elemental can choose to pull the creature 10 feet towards itself.")),
  ]],
  ["Created Construct", [
    construct("Juggernaut", "Medium", "walk 30", ["bludgeoning", "piercing", "slashing"],
      e("Unstoppable", "Any critical hit against the construct becomes a normal hit, and the construct has advantage on all Strength checks and saving throws."),
      ATK("Grand Strike", "Melee", "reach 5 ft.", "1d12 + 4", "bludgeoning", "(bludgeoning, piercing, or slashing, your choice). This attack scores critical hits on rolls of 19-20.")),
    construct("Mount", "Large", "walk 60", [],
      e("Locked In", "While both you and your construct are still at least 1 hit point, you cannot be dismounted from your construct against your will. Additionally, your construct ignores difficult terrain."),
      ATK("Crash", "Melee", "reach 5 ft.", "1d10 + 4", "bludgeoning", "(bludgeoning, piercing, or thunder, your choice). If the construct moves 10 feet in a straight line before making this attack, the target must make a Strength saving throw against your creation save DC, being knocked prone on a failure.")),
    construct("Turret", "Medium", "walk 30, climb 30", [],
      e("Search and Destroy", "The construct has advantage on all Wisdom (Perception) checks, and can take the Search action as a bonus action."),
      ATK("Sharp Shot", "Ranged", "range 120 ft.", "1d8 + 4", "force", "(force, radiant, or lightning, your choice). This attack ignores half cover.")),
  ]],
];

const L = "@item.level";
const sum = (name: string, profiles: string[], hpPer: number): Spec => ({
  activities: [{ name, type: "summon", summon: { profiles, ac: L, hp: `${hpPer} * (${L} - 3)`, attackDamage: L } }],
});
export const specs: Record<string, Spec> = {
  "creations/Concoct Ooze": sum("Concoct Ooze", ["Green", "Black", "Purple"].map((c) => `${c} Concocted Ooze`), 15),
  "creations/Conjure Elemental": sum("Conjure Elemental", ["Air", "Earth", "Fire", "Water"].map((c) => `${c} Conjured Elemental`), 10),
  "creations/Create Construct": sum("Create Construct", ["Juggernaut", "Mount", "Turret"].map((c) => `${c} Created Construct`), 15),
};
