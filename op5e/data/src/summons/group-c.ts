import type { SummonVariant } from "./make.js";
import type { ActSpec, Spec } from "../../helpers/spec.js";

const e = (name: string, desc: string) => ({ name, desc });
const L = "@item.level";
const multi = (who: string) => e("Multiattack", `The ${who} makes a number of attacks equal to half this creation's level (rounded down).`);

// ---- Spawned Plant (Spawn Plant, base 2; HP 30 + 15/level above 2nd) ----
const plant = (name: string, o: Partial<SummonVariant>, trait: ReturnType<typeof e>, action: ReturnType<typeof e>): SummonVariant => ({
  name, size: "Medium", type: "plant", ac: 12, hp: 30, speed: "walk 30", stats: [16, 14, 18, 6, 14, 6],
  condImmune: ["blinded", "deafened", "exhaustion"], senses: "blindsight 60 ft.", languages: "understands the languages you speak",
  traits: [e("False Appearance", "While the plant remains motionless, it is indistinguishable from other plants of its kind."), trait],
  actions: [multi("plant"), action], ...o,
});
const plants: SummonVariant[] = [
  plant("Tree Spawned Plant", { size: "Large", ac: 13, resist: ["bludgeoning", "piercing"] },
    e("Enduring Bark", "When the plant has at least 1 hit point at the start of each of its turns, it gains a number of temporary hit points equal to twice the level of the creation + your creative ability modifier."),
    e("Big Branch", "Melee Weapon Attack: +0 to hit, reach 10 ft., one target. Hit: 1d12 + 3 bludgeoning damage (plus the creation's level; bludgeoning, piercing, or slashing, your choice). This attack has the Siege property.")),
  plant("Flower Spawned Plant", {},
    e("Thorny Stem", "Any creature that touches or hits the plant with a melee attack suffers 1d8 piercing damage."),
    e("Flying Thorns", "Ranged Weapon Attack: +0 to hit, range 60 ft., one target. Hit: 1d8 + 3 piercing damage (plus the creation's level).")),
  plant("Fungus Spawned Plant", {},
    e("Fungal Burst", "When the plant's hit points are reduced to 0, it explodes with deadly fungal spores. Each creature within 10 ft. must make a Constitution saving throw against your creation save DC. On a failure, they take 2d6 thunder and 2d6 poison damage, and become poisoned for 1 minute, repeating the saving throw at the end of each of their turns. On a success, a creature only takes half damage."),
    e("Violent Fungus", "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1d10 + 3 poison damage (plus the creation's level; poison or thunder, your choice). Any creature hit by this attack cannot gain temporary hit points until the end of their next turn.")),
  plant("Vine Spawned Plant", { speed: "walk 30, climb 30" },
    e("Lush Tendrils", "The plant has a number of vines equal to the level of the creation. Each tendril can be attacked (AC same as plant; 10 hit points; immunity to poison and psychic damage). Destroying a tendril deals no damage to the plant, but it doesn't grow back. A tendril can also be broken if a creature takes an action and succeeds on a Strength check against your creation save DC."),
    e("Lashing Vines", "Melee Weapon Attack: +0 to hit, reach 30 ft., one target. Hit: 1d10 + 3 bludgeoning damage (plus the creation's level; bludgeoning or slashing, your choice). Any creature hit is grappled; while grappled, it is restrained. The plant can only grapple as many targets as it has vines.")),
];

// ---- Summoned Yokai (Summon Yokai, base 3; HP 40 + 15/level above 3rd) ----
const yokai = (name: string, trait: ReturnType<typeof e>, action: ReturnType<typeof e>): SummonVariant => ({
  name, size: "Medium", type: "monstrosity", ac: 12, hp: 40, speed: "walk 40", stats: [14, 16, 16, 4, 10, 16],
  immune: ["necrotic", "force"], condImmune: ["frightened"], senses: "darkvision 120 ft.", languages: "understands the languages you speak",
  traits: [trait], actions: [multi("Summoned Yokai"), action,
    e("Dreadful Scream (1/Day)", "The Summoned Yokai screams. Each creature within 30 feet of it must succeed on a Wisdom saving throw against your creation save DC or be frightened of it for 1 minute. The frightened creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.")],
});
const yokais: SummonVariant[] = [
  yokai("Fury Summoned Yokai", e("Terror Frenzy", "If the Summoned Yokai hits a creature that is frightened by it with an attack, that attack is a critical hit."),
    e("Murderous Maul", "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1d12 + 3 psychic damage (plus the creation's level).")),
  yokai("Despair Summoned Yokai", e("Weight of Sorrow", "Any creature, other than you, that starts its turn within 5 feet of the spirit has its speed reduced by 20 until the start of that creature's next turn."),
    e("Hopeless Haymaker", "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1d10 + 3 force damage (plus the creation's level).")),
  yokai("Fear Summoned Yokai", e("Shadow Stealth", "While in dim light or darkness, the Summoned Yokai becomes invisible until the end of its next turn, or until it makes an attack."),
    e("Dead End Bolt", "Ranged Weapon Attack: +0 to hit, range 120 ft., one target. Hit: 1d10 + 3 necrotic damage (plus the creation's level).")),
];

// ---- Mechanical Cannon (class feature; AC 18, HP 5 x gadgeteer level, immune poison/psychic) ----
const cannon: SummonVariant = {
  name: "Mechanical Cannon", size: "Small", type: "construct", ac: 18, hp: 5, speed: "walk 0", stats: [10, 10, 10, 10, 10, 10],
  immune: ["poison", "psychic"], senses: "",
  traits: [e("Activation", "On each of your turns, you can take a bonus action to cause the cannon to activate if you are within 60 feet of it (see the Mechanical Cannon feature for Elemental Culverin, Force Ballista, Protector). If it has legs it can walk or climb up to 15 feet. It disappears at 0 hit points or after 1 hour; if forced to make a check or save, treat all ability scores as 10 (+0).")],
};

// ---- Experimental Ooze (Chemist feature; HP 7 + 5 x medic level + Wis mod, AC 12 + PB) ----
const ALL_COND = ["blinded", "charmed", "deafened", "exhaustion", "frightened", "grappled", "incapacitated", "invisible", "paralyzed", "petrified", "poisoned", "prone", "restrained", "stunned", "unconscious"];
// Per-type bonuses from the Experimental Ooze Type tables (Chemist, Experimental Ooze Actions): [base bonus, Enhanced Formula (10th level) bonus]
const OOZE_TYPE: Record<string, [string, string]> = {
  Acid: ["When the ooze deals damage to a creature with its Pseudopod attack, it regains a number of hit points equal to half the damage it deals.",
    "The ooze has an additional amount of hit points equal to your level."],
  Cold: ["When the ooze hits a creature with its Pseudopod attack, the target becomes grappled by it (escape DC equal to your creation save DC).",
    "Creatures grappled by the ooze are now restrained. In addition, any creature grappled by the ooze takes 1d8 cold damage at the start of each of their turns."],
  Fire: ["Any creature that hits the ooze with a melee attack within 5ft of it takes 1d8 fire damage.",
    "When the ooze hits a creature with its Pseudopod attack, the target must succeed a Constitution saving throw or become ignited for 1 minute, repeating the saving throw at the end of each of their turns, ending the effect on a success. While ignited the creature takes 2d4 fire damage at the start of each of their turns."],
  Poison: ["When the ooze hits a creature with either its Pseudopod or its Glob attack, the creature must make a Constitution saving throw against your creation save DC or become poisoned until the end of their next turn.",
    "The ooze can use its action to touch a creature being affected by a poison, ending the effect of the poison as they absorb it."],
  Lightning: ["The ooze's movement speed increases by 20ft and doesn't provoke opportunity attacks.",
    "If the ooze moved 20ft before making a Pseudopod attack, the target must succeed a Strength saving throw or become knocked prone if it is one size larger than the ooze or smaller."],
};
const ooze = (t: string): SummonVariant => ({
  name: `${t} Experimental Ooze`, size: "Medium", type: "ooze", ac: 12, hp: 7, speed: t === "Lightning" ? "walk 40, climb 20" : "walk 20, climb 20", stats: [11, 8, 15, 4, 11, 1],
  immune: t === "Poison" ? ["poison"] : [t.toLowerCase(), "poison"], condImmune: ALL_COND, senses: "blindsight 30 ft.", languages: "understands the languages you speak",
  traits: [e("Amorphous", "The ooze can move through a space as small as 1 inch in diameter without squeezing."),
    e("Chemical Bonds", "Whenever you, the ooze's creator, take damage and the Experimental Ooze is within 30 ft. of you, the ooze takes the damage instead. If this damage reduces it to 0 hit points, you take any remaining damage."),
    e("Ooze Type", `Immune to ${t.toLowerCase()} damage (the type chosen on summoning). Small or Medium; Large from 10th level (Enhanced Formula: Pseudopod 4d4 and Glob 2d8 + PB).`),
    e(`${t} Bonus`, OOZE_TYPE[t][0]),
    e(`${t} Bonus (Enhanced Formula, 10th level)`, OOZE_TYPE[t][1])],
  actions: [e("Pseudopod", `Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 2d4 ${t.toLowerCase()} damage (plus your proficiency bonus).`),
    e("Glob", `Ranged Weapon Attack: +0 to hit, range 30 ft., one target. Hit: 1d8 ${t.toLowerCase()} damage (plus your proficiency bonus).`)],
});
const oozes = ["Acid", "Cold", "Fire", "Poison", "Lightning"].map(ooze);

// ---- Afterimage (Blitzkrieg feature; same AC as the user, 1 hit point, immune to all conditions) ----
const afterimage: SummonVariant = {
  name: "Afterimage", size: "Medium", type: "humanoid", ac: 10, hp: 1, speed: "walk 30", stats: [10, 10, 10, 10, 10, 10], condImmune: ALL_COND, senses: "",
  traits: [e("Blurred image", "A blurred image of you. It has your AC, 1 hit point and immunity to all conditions, and it uses your saving throw bonuses. You mentally command it to move up to your speed (no action). If it is more than 30 feet from you at the end of your turn, it is destroyed.")],
};

export const families: [string, SummonVariant[]][] = [
  ["Spawned Plant", plants], ["Summoned Yokai", yokais], ["Mechanical Cannon", [cannon]], ["Afterimage", [afterimage]], ["Experimental Ooze", oozes],
];

const sum = (name: string, v: SummonVariant[], base: number, hpPer: number, ac?: string): ActSpec => ({
  name, type: "summon", summon: { profiles: v.map((x) => x.name), ac, hp: `${hpPer} * (${L} - ${base})`, attackDamage: L },
});
const [tree, ...otherPlants] = plants;
export const specs: Record<string, Spec> = {
  "creations/Spawn Plant": { activities: [sum("Spawn Plant", otherPlants, 2, 15, L), sum("Spawn Tree", [tree], 2, 15)] },
  "creations/Summon Yokai": { activities: [sum("Summon Yokai", yokais, 3, 15, L)] },
  "class-features/Experimental Ooze": { activities: [{ name: "Summon Ooze", type: "summon", summon: { profiles: oozes.map((o) => o.name), ac: "@prof", hp: "5 * @classes.medic.levels + @abilities.wis.mod", attackDamage: "@prof" } }] },
};
