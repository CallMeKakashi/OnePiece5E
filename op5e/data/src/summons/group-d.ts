import type { SummonVariant } from "./make.js";
import type { Spec } from "../../helpers/spec.js";

// Class companions (Test Subject variants, Beastmaster beasts, Iron Defender) and Animate Objects. Sources: Sourcebook/Chapter 2 Classes/<name>/, Appendix A Creations.
// Attack bonuses and DC come from the summoner ("your creation attack modifier"); HP/AC bonuses are set in the summon activity below.
const e = (name: string, desc: string) => ({ name, desc });
const SAME = [10, 10, 10, 10, 10, 10]; // Clone: "equal to yours" (placeholder: scripts/summon-clone.mjs copies the summoner's scores when summoned)
const BOND = e("Primal Bond", "You can add your proficiency bonus to any ability check or saving throw that the beast makes.");
const CATK = (name: string, reach: string, dmg: string, extra = "") => e(name, `Melee Weapon Attack: +0 to hit, ${reach}, one target. Hit: ${dmg}.${extra ? " " + extra : ""}`);
const WIS_DMG = "1d8 + 0 bludgeoning, piercing, or slashing damage (your choice; add your Wisdom modifier)";

const clone: SummonVariant = { name: "Clone", size: "Medium", type: "humanoid", ac: 12, hp: 6, speed: "walk 30", stats: SAME, senses: "darkvision 60 ft.", languages: "understands and speaks the languages you speak",
  traits: [e("Stats", "Small or medium humanoid. Ability scores equal to yours; proficient in 3 skills you are proficient in. Armor Class 12 + PB; hit points 6 + six times your medic level (d10 Hit Dice equal to your medic level)."),
    e("Experimental Blood", "As a bonus action, the Test Subject can expend one of your Experimental Medicine uses and gain the benefits of one of the enhancements as per your Experimental Medicine feature."),
    e("Coordinated Assult", "As a reaction to seeing you use a creation, the Test Subject can make a weapon attack.")],
  actions: [CATK("Clobber", "reach 5 ft.", WIS_DMG)] };
const amalgamation: SummonVariant = { name: "Amalgamation", size: "Medium", type: "monstrosity", ac: 13, hp: 6, speed: "walk 40", stats: [16, 14, 14, 8, 12, 8], senses: "darkvision 60 ft.", languages: "understands the languages you speak",
  traits: [e("Stats", "Small or medium monstrosity. Athletics +(3 + PB), Perception +(1 + PB). Armor Class 13 + PB; hit points 6 + six times your medic level (d10 Hit Dice equal to your medic level)."),
    e("Animal Instincts", "As a bonus action, the Test Subject can take either the Hide or Disengage action."),
    e("Monster Blood", "As a bonus action, the Test Subject can expend one of your Experimental Medicine uses to transform for 1 minute. For that minute, the Test Subject gains the Enlarge benefits of the Enlarge/Reduce creation, and their attacks gain the siege property.")],
  actions: [CATK("Monster Strike", "reach 5 ft.", WIS_DMG, "The target becomes grappled, escape DC equals your creation DC.")] };
const flora: SummonVariant = { name: "Flora", size: "Medium", type: "plant", ac: 12, hp: 7, speed: "walk 30, climb 30", stats: [16, 12, 18, 8, 12, 8], senses: "darkvision 60 ft.", languages: "understands the languages you speak",
  traits: [e("Stats", "Small or medium plant. Athletics +(3 + PB), Stealth +(1 + PB). Armor Class 12 + PB; hit points 7 + seven times your medic level (d12 Hit Dice equal to your medic level)."),
    e("Protecive Wall", "As a reaction to seeing a creature make an attack against a creature within 10ft of the Test Subject, it can use its reaction to reroll the attack roll, having the lowest take effect."),
    e("Plant Blood", "As a bonus action, the Test Subject can expend one of your uses of your Experimental Medicine feature. For the next minute, the Test Subject regains 10 hit points at the start of each of its turns, unless it starts its turn with 0 hit points. If the Test Subject takes fire damage, the Test Subject doesn't regain these hit points at the start of their next turn.")],
  actions: [CATK("Vine Whip", "reach 10 ft.", WIS_DMG)] };

const beast = (kind: string, size: string, speed: string, stats: number[], traits: ReturnType<typeof e>[], action: ReturnType<typeof e>): SummonVariant => ({
  name: `Beast of the ${kind}`, size, type: "beast", ac: 13, hp: 6, speed, stats, senses: "darkvision 60 ft.", languages: "understands the languages you speak",
  traits: [e("Stats", "Armor Class 13 + PB; hit points 6 + six times your marksman level (d10 Hit Dice equal to your marksman level)."), ...traits, BOND], actions: [action] });
const air = beast("Air", "Small", "walk 10, fly 60", [6, 16, 13, 8, 14, 11], [e("Flyby", "The beast doesn't provoke opportunity attacks when it flies out of an enemy's reach.")],
  CATK("Shred", "reach 5 ft.", "1d6 + 3 + PB slashing damage"));
const land = beast("Land", "Large", "walk 40, climb 40", [16, 14, 15, 8, 14, 11], [
  e("Pack Tactics", "The beast has advantage on an attack roll against a creature if at least one of the beast's allies is within 5 ft. of the creature and the ally isn't incapacitated."),
  e("Charge", "If the beast moves at least 20 feet straight toward a target and then hits it with a maul attack on the same turn, the target takes an extra 1d6 slashing damage. If the target is a creature, it must succeed on a Strength saving throw against your creation save DC or be knocked prone.")],
  CATK("Maul", "reach 5 ft.", "1d12 + 3 + PB slashing damage"));
const sea = beast("Sea", "Medium", "walk 5, swim 60", [14, 14, 15, 8, 14, 11], [e("Amphibious", "The beast can breathe air and water.")],
  CATK("Binding Strike", "reach 5 ft.", "1d10 + 2 + PB piercing or bludgeoning damage", "In addition to damage, the target is grappled (escape DC equals your creation save DC). Until this grapple ends, the beast can't use this attack on another target."));

const defender: SummonVariant = { name: "Iron Defender", size: "Medium", type: "construct", ac: 16, hp: 5, speed: "walk 40", stats: [14, 12, 14, 8, 12, 6], condImmune: ["charmed", "frightened", "poisoned", "exhaustion"], immune: ["poison"],
  senses: "darkvision 60 ft.", languages: "understands the languages you speak",
  traits: [e("Stats", "Armor Class 16 (natural armor); hit points 5 + five times your gadgeteer level + your Intelligence modifier + 2. Saving throws Dex +1 + PB, Con +2 + PB. Athletics +2 + PB, Perception +1 + (PB x 2)."),
    e("Construct Nature", "The Iron Defender doesn't require air, food, water or sleep, and creations cannot put it to sleep."),
    e("Evasion", "When the Iron Defender is forced to make a Dexterity saving throw to take only half damage from an effect, it instead takes no damage on a successful save, and only takes half damage on a failed save."),
    e("Deflect Attack", "Reaction: the defender imposes disadvantage on the attack roll of one creature it can see that targets a creature within 5 feet of it.")],
  actions: [CATK("Force Empowered Rend", "reach 5 ft.", "1d8 + 3 + PB force damage"), e("Repair (3/day)", "The mechanisms inside the defender restore 2d8 + PB hit points to itself or to one construct or object within 5 feet of it.")] };

// Animate Objects: [size, HP, AC, attack bonus, damage, Str, Dex]
const OBJ: [string, number, number, number, string, number, number][] = [
  ["Tiny", 20, 18, 8, "1d4 + 4", 4, 18], ["Small", 25, 16, 7, "1d8 + 3", 8, 16], ["Medium", 45, 14, 6, "2d6 + 2", 12, 14],
  ["Large", 50, 12, 7, "2d10 + 3", 16, 10], ["Huge", 80, 10, 8, "2d12 + 4", 18, 6],
];
const objects: SummonVariant[] = OBJ.map(([size, hp, ac, hit, dmg, str, dex]) => ({
  name: `${size} Animated Object`, size, type: "construct", ac, hp, speed: "walk 30, fly 30", stats: [str, dex, 10, 3, 3, 1], senses: "blindsight 30 ft. (blind beyond this radius)",
  traits: [e("Animated Object", "Speed 30 ft.; if the object lacks legs or other appendages it can use for locomotion, it instead has a flying speed of 30 feet and can hover. If securely attached to a surface or larger object, its speed is 0. When it drops to 0 hit points, it reverts to its original object form, and any remaining damage carries over to its original object form.")],
  actions: [e("Slam", `Melee Weapon Attack: +${hit} to hit, reach 5 ft., one target. Hit: ${dmg} bludgeoning damage (the DM might rule that a specific object inflicts slashing or piercing damage based on its form).`)],
}));

export const families: [string, SummonVariant[]][] = [
  ["Clone", [clone]], ["Amalgamation", [amalgamation]], ["Flora", [flora]],
  ["Beasts", [air, land, sea]], ["Iron Defender", [defender]], ["Summoned Yokai/5th Level", objects],
];

const mk = (name: string, profiles: string[], hp: string, ac = "@prof", attackDamage = ""): Spec => ({ activities: [{ name, type: "summon", summon: { profiles, ac, hp, attackDamage } }] });
export const specs: Record<string, Spec> = {
  "class-features/Test Subject": mk("Summon Test Subject", ["Clone", "Amalgamation", "Flora"], "@classes.medic.levels * 6", "@prof", "@abilities.wis.mod"),
  "class-features/Bestial Companion": mk("Summon Beast", ["Beast of the Air", "Beast of the Land", "Beast of the Sea"], "@classes.marksman.levels * 6"),
  "class-features/Iron Defender": mk("Summon Iron Defender", ["Iron Defender"], "5 * @classes.gadgeteer.levels + @abilities.int.mod + 2", "0", "@prof"),
  "creations/Animate Objects": { activities: [{ name: "Animate Objects", type: "summon", summon: { profiles: objects.map((o) => o.name), fixed: true } }] },
};
