import type { SummonVariant } from "./make.js";

const e = (name: string, desc: string) => ({ name, desc });
const MULTI = (who: string) => e("Multiattack", `The ${who} makes a number of attacks equal to half this creation's level (rounded down).`);

const undead = (name: string, hp: number, speed: number, trait: ReturnType<typeof e>, action: ReturnType<typeof e>): SummonVariant => ({
  name, size: "Medium", type: "undead", ac: 12, hp, speed: `walk ${speed}`, stats: [14, 14, 14, 4, 10, 8],
  immune: ["necrotic", "poison"], condImmune: ["exhaustion", "frightened", "paralyzed", "poisoned"], languages: "understands the language you speak",
  traits: [trait, e("Undead Fortitude", "If damage reduces the Animated Undead to 0 hit points, it must make a Constitution saving throw with a DC of 5 + the damage taken, unless the damage is from a critical hit. On a success, the undead drops to 1 hit point instead.")],
  actions: [MULTI("Animated Undead"), action, e("Bone Spear", "Melee or Ranged Weapon Attack: +0 to hit, reach 5 ft./range 150 ft., one target. Hit: 1d6 + 3 piercing damage (plus the creation's level), and the creature must succeed on a Dexterity saving throw against your creation save DC or have its speed reduced by 10 ft. until the end of its next turn.")],
});

const beast = (name: string, size: string, hp: number, speed: string, trait: ReturnType<typeof e>, action: ReturnType<typeof e>): SummonVariant => ({
  name, size, type: "beast", ac: 12, hp, speed, stats: [18, 14, 16, 6, 14, 6], senses: "darkvision 60 ft.", languages: "understands the language you speak",
  traits: [trait], actions: [MULTI("beast"), action],
});

export const undeadAndBeasts: [string, SummonVariant[]][] = [
  ["Animated Undead", [
    undead("Hulking Animated Undead", 40, 20,
      e("Hulking Strength", "The creature's Strength score is equal to your creativity ability score (unless it was already higher). It has advantage on all Strength saving throws and checks, and its attacks have the Siege property."),
      e("Fatal Fist", "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1d10 + 3 bludgeoning damage (plus the creation's level), and the creature must succeed on a Strength saving throw against your creation save DC or be knocked prone or back 10 ft.")),
    undead("Rotten Animated Undead", 30, 30,
      e("Rotten Aura", "The creature's Constitution score is equal to your creativity ability score (unless it was already higher). Any creature other than you that starts its turn within 5 feet must succeed on a Constitution saving throw against your creation save DC or be poisoned until the start of its next turn."),
      e("Putrid Claw", "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 2d4 + 3 slashing damage (plus the creation's level), and the creature must succeed on a Constitution saving throw against your creation save DC or be unable to regain hit points until the end of its next turn.")),
    undead("Skeletal Animated Undead", 20, 40,
      e("Skeletal Construct", "(Your creativity ability modifier/day) The creature's Dexterity score is equal to your creativity ability score (unless it was already higher). As a bonus action it can repair itself with spare bones, regaining 2d8 + your creativity ability hit points."),
      e("Bone Slash", "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1d8 + 3 slashing damage (plus the creation's level).")),
  ]],
  ["Called Beast", [
    beast("Air Called Beast", "Medium", 30, "walk 30, fly 60",
      e("Bird of Prey", "The beast doesn't provoke opportunity attacks when it flies out of an enemy's reach, and has advantage on Wisdom (Perception) checks made with sight."),
      e("Rending Talon", "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 2d6 + 4 slashing damage (plus the creation's level), and the target must succeed on a Constitution saving throw against your creation save DC or have disadvantage on its next attack roll until the end of its next turn.")),
    beast("Land Called Beast", "Large", 40, "walk 40, climb 30",
      e("Apex Tactics", "If the beast moves at least 10 feet straight toward a creature and then hits it with an attack on the same turn, that target must succeed on a Strength saving throw against your creation save DC or be knocked prone. If the target is prone, the beast can make an additional attack against it as a bonus action. The beast has advantage on an attack roll against a creature if at least one of its allies is within 5 ft. of it and isn't incapacitated."),
      e("Mauling Claw", "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 2d8 + 4 bludgeoning, piercing or slashing damage (beast's choice) (plus the creation's level).")),
    beast("Water Called Beast", "Medium", 40, "walk 30, swim 40",
      e("Ocean Predator", "The beast can breathe only underwater. It has advantage on melee attack rolls against any creature that doesn't have all its hit points."),
      e("Strike of Depths", "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 2d6 + 4 piercing damage (plus the creation's level), and the creature must succeed on a Strength saving throw against your creation save DC or become grappled.")),
  ]],
];
