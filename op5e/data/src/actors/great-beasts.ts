import { statblockToActor } from "../../helpers/actor.js";
import type { Statblock, SourceRef } from "../../helpers/actor.js";

// Zoan Full Beast statblocks (Chapter 6). HP and attack bonuses scale with the user's level and Proficiency Bonus; the numeric hp below is the level-1 value
// ((N x 1) + Con modifier) and attack/save numbers are left in the description text, since the book gives formulas not numbers.
const src = (n: string): SourceRef => ({ book: "SOURCEBOOK", file: `Chapter 6 Devil Fruits/${n}`, heading: n });
const base = "Same as base form";
const blocks: [Statblock, string][] = [
  [{ name: "Great Bat", size: "medium", type: "beast", ac: 13, hp: 6, speed: "walk 10 ft., fly 60 ft.", stats: [16, 16, 12, 10, 10, 10], cr: 0,
    senses: "blindsight 60 ft.", skills: [{ Perception: 0 }, { Acrobatics: 0 }, { Stealth: 0 }],
    traits: [
      { name: "Hit Points", desc: "(5 x your level) + your Constitution modifier. Medium (or same size as your base form). INT/WIS/CHA, passive Perception and proficiency bonus same as base form. Languages: your languages, Bats." },
      { name: "Echolocation", desc: "You can't use your blindsight while deafened." },
      { name: "Keen Hearing", desc: "You have advantage on Wisdom (Perception) checks that rely on hearing." },
      { name: "Swift Flight", desc: "Opportunity attacks made against you while flying are made at disadvantage." },
    ],
    actions: [
      { name: "Bite", desc: "Melee Weapon Attack: +(Strength modifier + your proficiency bonus) to hit, reach 5 ft., one target. Hit: (1d8 + Strength modifier) piercing damage." },
      { name: "Screech", desc: "(Recharge 3 Rounds). In place of an attack, unleash a high-pitched cry. Each creature in a 15-foot cone makes a Constitution saving throw against your Bat-Bat DC. A creature takes a number of d6s equal to your proficiency bonus of thunder damage on a failed save, or half as much on a success." },
    ] }, "Great Bat"],
  [{ name: "Great Saber-Tooth", size: "large", type: "beast", ac: 12, hp: 9, speed: "walk 40 ft.", stats: [18, 14, 16, 10, 10, 10], cr: 0,
    senses: "darkvision 60 ft.", skills: [{ Perception: 0 }, { Athletics: 0 }, { Stealth: 0 }],
    traits: [
      { name: "Hit Points", desc: `(6 x your level) + your Constitution modifier. Large (or same size as your base form). INT/WIS/CHA and passive Perception: ${base}. Languages: your languages, Cats.` },
      { name: "Bloodthirst", desc: "Once on each of your turns when you damage a creature that has blood with your Fangs, you regain 1d6 hit points, provided you have less than half your hit points when you hit. Increased to 1d8 at 5th level, 1d10 at 10th, 1d12 at 15th; at 20th you can use it regardless of being under half hit points." },
      { name: "Keen Smell", desc: "You have advantage on Wisdom (Perception) checks that rely on smell." },
      { name: "Pounce", desc: "If you move at least 20 feet straight toward a creature and then hit it with a melee attack on the same turn, that target must succeed on a Strength saving throw against your Cat-Cat DC or be knocked prone. If the target is prone, you can make one Fangs attack against it as a bonus action." },
    ],
    actions: [
      { name: "Fangs", desc: "Melee Weapon Attack: +(Strength modifier + your proficiency bonus) to hit, reach 5 ft., one target. Hit: (1d10 + Strength modifier) piercing damage." },
      { name: "Claws", desc: "Melee Weapon Attack: +(Strength modifier + your proficiency bonus) to hit, reach 5 ft., one target. Hit: (2d6 + Strength modifier) slashing or piercing damage." },
    ] }, "Great Saber-Tooth"],
  [{ name: "Great Werewolf", size: "large", type: "monstrosity", ac: 13, hp: 10, speed: "walk 50 ft.", stats: [16, 16, 16, 10, 10, 10], cr: 0,
    skills: [{ Perception: 0 }, { Athletics: 0 }, { Stealth: 0 }],
    traits: [
      { name: "Hit Points", desc: `(7 x your level) + your Constitution modifier. Large (or same size as your base form), natural armor. INT/WIS/CHA and passive Perception: ${base}. Languages: your languages, Wolves.` },
      { name: "Supernatural Resistance", desc: "You gain resistance to unimbued bludgeoning, piercing and slashing damage. This resistance is ignored by silver. At 10th level this resistance extends to imbued bludgeoning, piercing and slashing damage." },
      { name: "Keen Hearing and Smell", desc: "You have advantage on Wisdom (Perception) checks that rely on hearing or smell." },
      { name: "Lycanthropy", desc: "When you hit a creature with Fangs you can choose to curse it. The target makes a Constitution saving throw against your Dog-Dog DC. On a failure it transforms into a werewolf and goes on a rampage: at the start of each of its turns it must move towards the nearest creature it can see and use its action to attack that creature (not itself). It adds your proficiency bonus to damage rolls, gains +10 walking speed, and your Supernatural Resistance and Keen Hearing and Smell. The curse lasts until the Remove Curse creation is used on it, a piece of silver, or the user dies. Once per long rest, twice at 10th level, three times at 20th level." },
    ],
    actions: [
      { name: "Fangs", desc: "Melee Weapon Attack: +(Strength modifier + your proficiency bonus) to hit, reach 5 ft., one target. Hit: (1d8 + Strength modifier) piercing damage." },
      { name: "Claws", desc: "Melee Weapon Attack: +(Strength modifier + your proficiency bonus) to hit, reach 5 ft., one target. Hit: (2d4 + Strength modifier) slashing or piercing damage." },
    ] }, "Great Werewolf"],
];
export default blocks.map(([sb, n]) => statblockToActor(sb, src(n)));
