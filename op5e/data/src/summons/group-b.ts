import type { SummonVariant } from "./make.js";
import type { ActSpec, Spec } from "../../helpers/spec.js";

const e = (name: string, desc: string) => ({ name, desc });
const L = "@item.level";

const swarm = (variant: string, ac: number, speed: string, trait: ReturnType<typeof e> | null, action: ReturnType<typeof e>): SummonVariant => ({
  name: `${variant} Gathered Swarm`, size: "Medium", type: "beast", ac, hp: 40, speed, stats: [6, 18, 12, 4, 12, 4],
  resist: ["bludgeoning", "piercing", "slashing"], condImmune: ["charmed", "frightened", "grappled", "paralyzed", "petrified", "prone", "restrained", "stunned"],
  languages: "understands the language you speak",
  traits: [e("Swarm", "The Gathered Swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny beast. The swarm can't regain hit points or gain temporary hit points."), ...(trait ? [trait] : [])],
  actions: [e("Multiattack", "The beast makes two attacks, or three if used with a 5th level creation slot. The Gathered Swarm loses one of these attacks when they have half or less their total hit points."), action],
});

export const families: [string, SummonVariant[]][] = [
  ["Created Servant", [{
    name: "Created Servant", size: "Tiny", type: "construct", ac: 15, hp: 8, speed: "walk 40, climb 40", stats: [8, 16, 12, 14, 12, 10],
    immune: ["poison"], condImmune: ["charmed", "exhaustion", "frightened", "poisoned"], senses: "darkvision 120 ft.", languages: "understands the languages you speak",
    traits: [
      e("Construct Nature", "The Created Servant doesn't require air, food, water or sleep, creations cannot put it to sleep, and is immune to diseases."),
      e("Channel Creations", "When you use a creation that has a range other than self, the Created Servant can deliver the creation as if it had used the creation while it is within 120 feet of you. If the creation requires an attack roll, you use your attack modifier for the roll."),
      e("Evasive", "When the Created Servant is forced to make a saving throw to take only half damage from an effect, it instead takes no damage on a successful save, and only takes half damage on a failed save."),
      e("Tracking", "The Created Servant knows the general direction of your position and will immediately seek you out to the best of its ability if the two of you are separated. Likewise, you know the general direction of the Created Servant's position, however you don't know the distance or obstacles that might be in the way."),
    ],
    actions: [e("Bash", "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1d4 + 2 force damage.")],
  }]],
  ["Tiny Servant", [{
    name: "Tiny Servant", size: "Tiny", type: "construct", ac: 15, hp: 10, speed: "walk 30, climb 30", stats: [4, 16, 10, 2, 10, 1],
    immune: ["poison", "psychic"], condImmune: ["blinded", "charmed", "deafened", "exhaustion", "frightened", "paralyzed", "petrified", "poisoned"], senses: "blindsight 60 ft.",
    actions: [e("Slam", "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1d4 + 3 bludgeoning damage.")],
  }]],
  ["Loyal Mount", [{
    name: "Loyal Mount", size: "Large", type: "beast", ac: 13, hp: 40, speed: "walk 50", stats: [18, 12, 14, 8, 14, 10], languages: "understands one of the languages you speak",
    traits: [e("Charge", "If the Loyal Mount moves at least 20 ft. straight toward a creature and then hits it with a Slam attack on the same turn, that target must succeed on a Strength saving throw against your creation DC or be knocked prone. If the target is prone, the Loyal Mount can make another attack with its Slam attack against it as a bonus action.")],
    actions: [e("Slam", "Melee Weapon Attack: +0 to hit, reach 10 ft., one target. Hit: 2d6 + 2 bludgeoning damage (your choice of bludgeoning, piercing, or slashing; plus the creation's level).")],
  }]],
  ["Gathered Swarm", [
    swarm("Rodent", 10, "walk 30, climb 20", null,
      e("Sick Bites", "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 2d4 + 4 piercing damage (plus the creation's level; piercing or slashing, beast's choice). Once per turn, when the swarm hits a creature with this attack, the target must make a Constitution saving throw against your creation save DC. On a failure, the target becomes diseased for 1 hour. While diseased, the target takes a -1 penalty to all attack rolls and ability checks.")),
    swarm("Winged", 10, "walk 20, climb 20, fly 50", null,
      e("Bites and Claws", "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 2d6 + 4 piercing damage (plus the creation's level; piercing or slashing, beast's choice). Once per turn, when the swarm hits a creature with this attack, the target must make a Constitution saving throw against your creation save DC. On a failure, the target's movement speed is reduced to 10 ft, unless it were already lower.")),
    swarm("Insect", 11, "walk 20, climb 20", null,
      e("Poison Stingers", "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 2d4 + 4 piercing damage (plus the creation's level; piercing or slashing, swarm's choice). Once per turn, when the swarm hits a creature with this attack, the target must make a Constitution saving throw against your creation save DC. On a failure, the target is poisoned until the end of their next turn.")),
    swarm("Fish", 10, "walk 20, climb 20, swim 40", e("Blood Frenzy", "The swarm has advantage on melee attack rolls against any creature that doesn't have all its hit points. In addition, the swarm can breathe only underwater."),
      e("Swarming Jaws", "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 2d6 + 4 piercing damage (plus the creation's level; piercing or slashing, beast's choice).")),
  ]],
];

const act = (name: string, profiles: string[], hp: string, ac?: string, attackDamage?: string): ActSpec => ({ name, type: "summon", summon: { profiles, ac, hp, attackDamage } });

export const specs: Record<string, Spec> = {
  // servants have fixed stats (PB-based, not slot-scaled) except HP 4/level for Created Servant
  "creations/Create Servant (R)": { activities: [act("Create Servant", ["Created Servant"], `4 * (${L} - 1)`)] },
  "creations/Tiny Servant (R)": { activities: [act("Animate Servant", ["Tiny Servant"], "")] },
  "creations/Find Mount": { activities: [act("Find Mount", ["Loyal Mount"], `10 * (${L} - 2)`, L, L)] },
  "creations/Gather Swarm": { activities: [act("Gather Swarm", ["Rodent Gathered Swarm", "Winged Gathered Swarm", "Insect Gathered Swarm", "Fish Gathered Swarm"], `10 * (${L} - 2)`, L, L)] },
};
