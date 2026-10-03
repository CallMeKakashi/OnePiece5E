import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import type { ActSpec, EffectSpec } from "../../helpers/spec.js";
import type { FeatureItem } from "../../schemas/feature.js";

// Class content that the Sourcebook lists but the pack lacked: Battlemaster maneuvers, Gunslinger trick shots, Arms Dealer
// ammo, Gadgeteer mods / mastercraft mods / servant specialisations. Text is the book's; `acts` become activities through
// automation/class-content.ts (the same Def objects feed both, so text and mechanics cannot drift apart).

export interface Def { group: string; name: string; req: string; html: string; acts: ActSpec[] }

const slug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const defId = (d: Def) => generateId(`${d.group}/${slug(d.name)}`);
export const uuidOf = (d: Def) => compendiumUuid("class-features", defId(d));
const p = (...ps: string[]) => ps.map((x) => `<p>${x}</p>`).join("");

export function toFeature(d: Def): FeatureItem {
  return {
    _id: defId(d), name: d.name, type: "feat", img: "icons/svg/item-bag.svg",
    system: {
      description: { value: d.html, chat: "" }, source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" }, requirements: d.req,
      activation: { type: "", cost: null, condition: "" }, duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" }, range: { value: null, long: null, units: "" },
      uses: { value: null, max: "", per: null, recovery: "", prompt: true }, actionType: "",
      damage: { parts: [], versatile: "" }, save: { ability: "", dc: null, scaling: "spell" }, chatFlavor: "",
      recharge: { value: null, charged: false },
    },
    effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem;
}

const chg = (key: string, value: string, mode = 2) => ({ key, mode, value });
const R1 = { rounds: 1 }, R2 = { rounds: 2 };

// ================= Battlemaster maneuvers (S2/Martial Archetypes/Battlemaster.md) =================
export const MAN_DC = "8 + @prof + max(@abilities.str.mod, @abilities.dex.mod)";
const DIE = "@scale.battlemaster.superiority-die";
const BM = "feature/fighter/battlemaster/maneuver";
const dieRoll = (name: string, activation: ActSpec["activation"], note: string, extra = ""): ActSpec =>
  ({ name, type: "damage", activation, damage: [[DIE + extra, []]], note });
const manSave = (name: string, ability: string, note: string, effect?: EffectSpec, range?: number): ActSpec =>
  ({ name, type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability, dc: MAN_DC, onSave: "none" }, effects: effect ? [{ ...effect, onTargets: true }] : undefined, note, ...(range ? { range } : {}) });
const EXP = "Expend one superiority die (Superior Combatant > Expend Superiority Die). ";
const man = (name: string, text: string, acts: ActSpec[]): Def => ({ group: BM, name, req: "Battlemaster 3", html: p(text), acts });

export const maneuvers: Def[] = [
  man("Ambush", "When you make a Dexterity (Stealth) check or an initiative roll, you can expend one superiority die and add the die to the roll, provided you aren't incapacitated.",
    [dieRoll("Add Die to Stealth / Initiative", "special", EXP)]),
  man("Bait and Switch", "When you're within 5 feet of a creature on your turn, you can expend one superiority die and switch places with that creature, provided you spend at least 5 feet of movement and the creature is willing and isn't incapacitated. This movement doesn't provoke opportunity attacks.</p><p>Roll the superiority die. Until the start of your next turn, you or the other creature (your choice) gains a bonus to AC equal to the number rolled.",
    [dieRoll("Roll AC Bonus", "special", EXP + "Until the start of your next turn you or the other creature gains this bonus to AC.")]),
  man("Brace", "When a creature you can see moves into the reach you have with the melee weapon you're wielding, you can use your reaction to expend one superiority die and make one attack against the creature, using that weapon. If the attack hits, add the superiority die to the weapon's damage roll.",
    [{ name: "Brace Attack", type: "attack", activation: "reaction", reactionWhen: "A creature you can see moves into your melee weapon's reach", attack: { type: "melee" }, includeBase: true, damage: [[DIE, []]], note: EXP }]),
  man("Commander's Strike", "When you take the Attack action on your turn, you can forgo one of your attacks to direct one of your companions to strike. When you do so, choose a friendly creature who can see or hear you and expend one superiority die. That creature can immediately use its reaction to make one weapon attack, adding the superiority die to the attack's damage roll.",
    [dieRoll("Add Die to Companion's Damage", "special", EXP + "Forgo one of your attacks; a friendly creature who can see or hear you uses its reaction to make one weapon attack.")]),
  man("Commanding Presence", "When you make a Charisma (Intimidation), a Charisma (Performance), or a Charisma (Persuasion) check, you can expend one superiority die and add the superiority die to the ability check.",
    [dieRoll("Add Die to Charisma Check", "special", EXP)]),
  man("Disarming Attack", "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to disarm the target, forcing it to drop one item of your choice that it's holding. You add the superiority die to the attack's damage roll, and the target must make a Strength saving throw. On a failed save, it drops the object you choose. The object lands at its feet.",
    [dieRoll("Add Die to Damage", "special", EXP), manSave("Disarm (Strength Save)", "str", "On a failed save the target drops one held object of your choice; it lands at its feet.")]),
  man("Distracting Strike", "When you hit a creature with a weapon attack, you can expend one superiority die to distract the creature, giving your allies an opening. You add the superiority die to the attack's damage roll. The next attack roll against the target by an attacker other than you has advantage if the attack is made before the start of your next turn.",
    [dieRoll("Add Die to Damage", "special", EXP),
     { name: "Distract Target", type: "utility", activation: "special", targets: { count: 1, type: "creature" }, effects: [{ name: "Distracted", onTargets: true, ...R1 }], note: "The next attack roll against the target by an attacker other than you has advantage, if made before the start of your next turn." }]),
  man("Evasive Footwork", "Before or after you make an attack, you can, as a bonus action on your turn, expend a superiority dice. The attack you make deals extra damage equal to the superiority dice roll, and you don't provoke opportunity attacks until the end of your turn.",
    [dieRoll("Add Die to Damage", "bonus", EXP + "You don't provoke opportunity attacks until the end of your turn.")]),
  man("Feinting Attack", "You can expend one superiority die and use a bonus action on your turn to feint, choosing one creature within 5 feet of you as your target. You have advantage on your next attack roll against that creature this turn. If that attack hits, add the superiority die to the attack's damage roll.",
    [dieRoll("Feint: Add Die to Damage", "bonus", EXP + "Choose one creature within 5 feet; you have advantage on your next attack roll against it this turn. If that attack hits, add the die to its damage.")]),
  man("Goading Attack", "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to goad the target into attacking you. You add the superiority die to the attack's damage roll, and the target must make a Wisdom saving throw. On a failed save, the target has disadvantage on all attack rolls against targets other than you until the end of your next turn.",
    [dieRoll("Add Die to Damage", "special", EXP), manSave("Goad (Wisdom Save)", "wis", "On a failed save the target has disadvantage on all attack rolls against targets other than you until the end of your next turn.", { name: "Goaded", ...R2 })]),
  man("Grappling Strike", "Immediately after you hit a creature with a melee attack on your turn, you can expend one superiority die and then try to grapple the target as a bonus action. Add the superiority die to your Strength (Athletics) check.",
    [dieRoll("Add Die to Athletics Check", "bonus", EXP)]),
  man("Lunging Attack", "When you make a melee weapon attack on your turn, you can expend one superiority die to increase your reach for that attack by 5 feet. If you hit, you add the superiority die to the attack's damage roll.",
    [dieRoll("Add Die to Damage", "special", EXP + "Your reach for that attack is increased by 5 feet.")]),
  man("Maneuvering Attack", "When you hit a creature with a weapon attack, you can expend one superiority die to maneuver one of your comrades into a more advantageous position. You add the superiority die to the attack's damage roll, and you choose a friendly creature who can see or hear you. That creature can use its reaction to move up to half its speed without provoking opportunity attacks from the target of your attack.",
    [dieRoll("Add Die to Damage", "special", EXP + "A friendly creature who can see or hear you can use its reaction to move up to half its speed without provoking opportunity attacks from the target.")]),
  man("Pushing Attack", "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to drive the target back. You add the superiority die to the attack's damage roll, it then must make a Strength saving throw. On a failed save, you push the target up to 15 feet away from you.",
    [dieRoll("Add Die to Damage", "special", EXP), manSave("Push (Strength Save)", "str", "On a failed save you push the target up to 15 feet away from you.")]),
  man("Parry", "When another creature hits you with an attack, you can use your reaction and expend one superiority die to increase your AC by the number you roll on your superiority die + your Dexterity modifier for that attack.",
    [{ name: "Roll AC Bonus", type: "damage", activation: "reaction", reactionWhen: "Another creature hits you with an attack", damage: [[`${DIE} + @abilities.dex.mod`, []]], note: EXP + "Increase your AC by this number against that attack." }]),
  man("Menacing Attack", "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to frighten the target. You add the superiority die to the attack's damage roll, and the target must make a Wisdom saving throw. On a failed save, it is frightened of you until the end of your next turn.",
    [dieRoll("Add Die to Damage", "special", EXP), manSave("Frighten (Wisdom Save)", "wis", "On a failed save the target is frightened of you until the end of your next turn.", { name: "Frightened by Menacing Attack", statuses: ["frightened"], ...R2 })]),
  man("Precision Attack", "When you make a weapon attack roll against a creature, you can expend one superiority die to add it to the roll. You can use this maneuver before or after making the attack roll, but before any effects of the attack are applied.",
    [dieRoll("Add Die to Attack Roll", "special", EXP)]),
  man("Quick Toss", "As a bonus action, you can expend one superiority die and make a ranged attack with a weapon that has the thrown property. You can draw the weapon as part of making this attack. If you hit, add the superiority die to the weapon's damage roll.",
    [{ name: "Thrown Attack", type: "attack", activation: "bonus", attack: { type: "ranged" }, includeBase: true, damage: [[DIE, []]], note: EXP + "Use a weapon with the thrown property; you can draw it as part of the attack." }]),
  man("Rally", "On your turn, you can use a bonus action and expend one superiority die to bolster the resolve of one of your companions. When you do so, choose a friendly creature who can see or hear you (can include yourself). That creature gains temporary hit points equal to the superiority die roll + your Fighter level + your Charisma modifier.",
    [{ name: "Rally", type: "heal", activation: "bonus", targets: { count: 1, type: "creature" }, healing: { formula: `${DIE} + @classes.fighter.levels + @abilities.cha.mod`, type: "temp" }, note: EXP }]),
  man("Riposte", "When a creature targets you with a melee attack, you can use your reaction and expend one superiority die to make a melee weapon attack against the creature. If you hit, you add the superiority die to the attack's damage roll.",
    [{ name: "Riposte Attack", type: "attack", activation: "reaction", reactionWhen: "A creature targets you with a melee attack", attack: { type: "melee" }, includeBase: true, damage: [[DIE, []]], note: EXP }]),
  man("Sweeping Attack", "When you hit a creature with a melee weapon attack, you can expend one superiority die to attempt to damage adjacent creatures with the same attack. Your attack gains damage spread that only affects creatures of your choice and deals extra damage equal to your superiority die roll. The DC is equal to your Maneuver save DC.",
    [{ name: "Damage Spread", type: "save", activation: "special", area: { type: "radius", size: 5 }, targets: { type: "creature" }, save: { ability: "dex", dc: MAN_DC, onSave: "half" }, damage: [[DIE, []]],
       note: EXP + "Damage spread (a Dexterity save, as for cannon shots) affecting only creatures of your choice adjacent to the target. Each takes the attack's damage plus the die on a failure and half on a success; apply the weapon damage by hand." }]),
  man("Tactical Assessment", "When you make an Intelligence (Investigation), an Intelligence (History), or a Wisdom (Insight) check, you can expend one superiority die and add the superiority die to the ability check.",
    [dieRoll("Add Die to Check", "special", EXP)]),
  man("Trip Attack", "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to knock the target down. You add the superiority die to the attack's damage roll, it then must make a Strength saving throw. On a failed save, you knock the target prone.",
    [dieRoll("Add Die to Damage", "special", EXP), manSave("Trip (Strength Save)", "str", "On a failed save the target is knocked prone.", { name: "Knocked Prone", statuses: ["prone"], seconds: 6 })]),
];

// ================= Gunslinger trick shots (S2/Martial Archetypes/Gunslinger.md) =================
export const SHOT_DC = "8 + @prof + @abilities.dex.mod";
const GS = "feature/fighter/gunslinger/shot";
const GRIT = "Expend one grit point (Trick Shots > Expend Grit). Declare it before the attack roll. ";
const shotSave = (name: string, ability: string, note: string, effect?: EffectSpec, extra: Partial<ActSpec> = {}): ActSpec =>
  ({ name, type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability, dc: SHOT_DC, onSave: "none" }, effects: effect ? [{ ...effect, onTargets: true }] : undefined, note, ...extra });
const shot = (name: string, text: string, acts: ActSpec[], req = "Gunslinger 3"): Def => ({ group: GS, name, req, html: p(text), acts });
const util = (name: string, note: string, activation: ActSpec["activation"] = "special"): ActSpec => ({ name, type: "utility", activation, note });

export const shots: Def[] = [
  shot("Covering Fire", "When you make a firearm attack against a creature, you can expend one grit point to protect your allies as they move across the battlefield from your target. Choose a creature within 60ft of the target. That creature has the benefits of half cover from the target until the start of your next turn.",
    [util("Covering Fire", GRIT + "Choose a creature within 60 ft of the target; it has half cover from the target until the start of your next turn.")]),
  shot("Dazing Shot", "When you make a firearm attack against a creature, you can expend one grit point to attempt to dizzy your opponent. On a hit, the creature must make a Wisdom Saving throw. On a failure, it suffers the effects of the Slow creation until the end of your next turn.",
    [shotSave("Dazing Shot (Wisdom Save)", "wis", GRIT + "On a hit; on a failure the target suffers the effects of the Slow creation until the end of your next turn.", { name: "Slowed by Dazing Shot", ...R2 })]),
  shot("Deadeye Shot", "When you make a firearm attack against a creature, you can expend one grit point to gain advantage on the attack roll.",
    [util("Deadeye Shot", GRIT + "You have advantage on the attack roll.")]),
  shot("Deflecting Shot", "As a reaction to a creature making an attack against a creature you can see within 60 ft of you, you can expend one grit point to fire at the attacker, causing them to fumble and change targets. The target must succeed a Dexterity saving throw or must target a creature of your choice within their range instead.",
    [shotSave("Deflecting Shot (Dexterity Save)", "dex", "As a reaction to a creature attacking a creature you can see within 60 ft; expend one grit point. On a failure the attacker must target a creature of your choice within its range instead.", undefined, { activation: "reaction", reactionWhen: "A creature attacks a creature you can see within 60 feet", range: 60 })], "Gunslinger 7"),
  shot("Disarming Shot", "When you make a firearm attack against a creature, you can expend one grit point to attempt to shoot an object from their hands. On a hit, the creature suffers normal damage and must succeed on a Strength saving throw or drop 1 held object of your choice and have that object be pushed 10 feet away from you.",
    [shotSave("Disarming Shot (Strength Save)", "str", GRIT + "On a hit; on a failure the target drops 1 held object of your choice and it is pushed 10 feet away from you.")]),
  shot("Exhausting Shot", "When you make a firearm attack against a creature, you can expend one grit point to knock the wind out of the target. On a hit, the creature suffers normal damage and must make a Constitution saving throw. On a failure, they suffer the effects of the Bane creation for 1 minute, repeating the saving throw at the end of each of their turns, ending the effect on a success.",
    [shotSave("Exhausting Shot (Constitution Save)", "con", GRIT + "On a hit; on a failure the target suffers the effects of the Bane creation for 1 minute, repeating the save at the end of each of its turns.", { name: "Bane (Exhausting Shot)", seconds: 60 }, { duration: { value: 1, units: "minute" } })]),
  shot("Forceful Shot", "When you make a firearm attack against a creature, you can expend one grit point to attempt to trip them up and force them back. On a hit, the creature suffers normal damage and must succeed on a Strength saving throw or be pushed 15 feet away from you.",
    [shotSave("Forceful Shot (Strength Save)", "str", GRIT + "On a hit; on a failure the target is pushed 15 feet away from you.")]),
  shot("Piercing Shot", "When you make a firearm attack against a creature, you can expend one grit point to attempt to fire through multiple opponents. When you use this option, you don't make an attack roll for the attack. Instead, the arrow fires forward in a line, which is 5 feet wide and 60 feet long. Each creature in that line must make a Dexterity saving throw. On a failed save, a creature takes damage as if it were hit by the projectile. On a successful save, a target takes half as much damage.",
    [{ name: "Piercing Shot (Dexterity Save)", type: "save", activation: "special", area: { type: "line", size: 60 }, targets: { type: "creature" }, save: { ability: "dex", dc: SHOT_DC, onSave: "half" }, note: GRIT + "No attack roll. A failed save deals the firearm's damage as if it hit; a success deals half. Roll the firearm's damage by hand." }]),
  shot("Run and Gun", "When you make a firearm attack against a creature, you can expend one grit point to deftly dash through the battlefield through the torrent of bullets, allowing you to take either the Dash or Disengage action as part of the attack.",
    [util("Run and Gun", GRIT + "Take the Dash or Disengage action as part of the attack.")]),
  shot("Violent Shot", "When you make a firearm attack against a creature, you can expend one or more grit points to enhance the volatility of the attack. For each grit point expended, the attack gains a -1 to the firearm's attack roll. If the attack hits, you can roll one additional weapon damage die per grit point spent when determining the damage.",
    [util("Violent Shot", "Expend one or more grit points (Trick Shots > Expend Grit). For each point the attack takes -1 to the attack roll; on a hit roll one additional weapon damage die per grit point spent.")]),
  shot("Warning Shot", "When you make a firearm attack against a creature, you can expend one grit point to rattle them, either by striking them or leaving a bullet hole a little too close for comfort. On a hit or miss, the target must succeed a Wisdom saving throw or become frightened of you until the start of your next turn.",
    [shotSave("Warning Shot (Wisdom Save)", "wis", GRIT + "On a hit or miss; on a failure the target is frightened of you until the start of your next turn.", { name: "Frightened by Warning Shot", statuses: ["frightened"], ...R1 })]),
  shot("Wringing Shot", "When you make a firearm attack against a creature, you can expend one grit point to attempt to topple a moving target. On a hit, the creature suffers normal damage and must make a Strength saving throw or be knocked prone.",
    [shotSave("Wringing Shot (Strength Save)", "str", GRIT + "On a hit; on a failure the target is knocked prone.", { name: "Knocked Prone", statuses: ["prone"], seconds: 6 })]),
];

const gunsmith: Def = { group: "feature/fighter/gunslinger", name: "Gunsmith", req: "Gunslinger 3", acts: [],
  html: p("Upon choosing this archetype at 3rd level, you gain proficiency with Engineering (Intelligence) skill and Tinker's Tools. You may use them to craft ammunition at half the cost, repair damaged firearms, or even draft and create new ones (DM's discretion). Some extremely experimental and intricate firearms are only available through crafting.") };
const hemorrhaging: Def = { group: "feature/fighter/gunslinger", name: "Hemorrhaging Critical", req: "Gunslinger 18", acts: [],
  html: p("Upon reaching 18th level, whenever you score a critical hit on an attack with a firearm, the target additionally suffers half of the damage from the attack at the end of its next turn.") };

// ================= Arms Dealer (S2/Martial Archetypes/Arms Dealer.md) =================
export const ARS_DC = "8 + @prof + @abilities.int.mod";
const AD = "feature/fighter/arms-dealer/ammo";
const FL = "@classes.fighter.levels";
/** damage dice that step up at 18th level, e.g. 2d6 -> 4d6 */
const up = (lo: number, hi: number, die: number) => `(${lo} + ${hi - lo} * floor(${FL} / 18))d${die}`;
const AMMO = "Applies to one piece of ammo once per turn (Advanced Arsenal > Expend Use). ";
const ammo = (name: string, text: string, acts: ActSpec[], req = "Arms Dealer 3"): Def => ({ group: AD, name, req, html: p(text), acts });
const aSave = (name: string, ability: string, note: string, effect?: EffectSpec, extra: Partial<ActSpec> = {}): ActSpec =>
  ({ name, type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability, dc: ARS_DC, onSave: "none" }, effects: effect ? [{ ...effect, onTargets: true }] : undefined, note, ...extra });
const aDmg = (name: string, f: string, type: string | string[], note: string): ActSpec => ({ name, type: "damage", activation: "special", damage: [[f, type]], note });

export const ammos: Def[] = [
  ammo("Stasis Ammo", "The creature hit by the ammo must succeed on a Charisma saving throw or be banished. While banished in this way, its speed is 0, and it is incapacitated. At the end of its next turn, the target reappears in the space it vacated or in the nearest unoccupied space if that space is occupied.</p><p>At 18th level, this ammo deals an extra 2d8 force damage when it hits.",
    [aSave("Stasis (Charisma Save)", "cha", AMMO + "On a failure the target is banished: speed 0 and incapacitated. At the end of its next turn it reappears in the space it vacated or the nearest unoccupied space.", { name: "Banished by Stasis Ammo", statuses: ["incapacitated"], ...R2 }),
     aDmg("18th Level: Extra Force Damage", `(2 * floor(${FL} / 18))d8`, "force", "At 18th level this ammo deals an extra 2d8 force damage when it hits.")]),
  ammo("Hypnotic Ammo", "The creature hit by the ammo takes an extra 2d6 psychic damage, and choose one of your allies within 30 feet of the target. The target must succeed on a Wisdom saving throw, or it is charmed by the chosen ally until the start of your next turn. This effect ends early if the chosen ally attacks the charmed target, deals damage to it, or forces it to make a saving throw.</p><p>At 18th level, the extra damage of this ammo becomes 4d6 psychic damage instead.",
    [aDmg("Extra Psychic Damage", up(2, 4, 6), "psychic", AMMO),
     aSave("Hypnotic (Wisdom Save)", "wis", "Choose an ally within 30 feet of the target. On a failure the target is charmed by that ally until the start of your next turn; this ends early if the ally attacks it, damages it, or forces it to make a saving throw.", { name: "Charmed by Hypnotic Ammo", statuses: ["charmed"], ...R1 })]),
  ammo("Elemental Ammo", "The creature hit by the ammo takes an extra 2d8 fire, poison, acid, cold, or lightning damage, and the weapon damage also becomes that damage type.</p><p>At 18th level, this ammo deals 4d8 of the chosen type.",
    [aDmg("Extra Elemental Damage", up(2, 4, 8), ["fire", "poison", "acid", "cold", "lightning"], AMMO + "The weapon's own damage also becomes the chosen type.")]),
  ammo("Exploding Ammo", "The ammo detonates after your attack. Your attack with the ammo gains a damage spread of 10ft, DC equal to your Advanced Arsenal DC. The attack additionally deals an extra 2d6 fire, thunder, or force damage.</p><p>At 18th level, the extra damage of this ammo becomes 4d6 of the chosen type instead.",
    [{ name: "Damage Spread (Dexterity Save)", type: "save", activation: "special", area: { type: "radius", size: 10 }, targets: { type: "creature" }, save: { ability: "dex", dc: ARS_DC, onSave: "half" }, damage: [[up(2, 4, 6), ["fire", "thunder", "force"]]],
       note: AMMO + "Damage spread of 10 ft (Dexterity save, as for cannon shots); the extra damage is dealt to the attack's target as well." }]),
  ammo("Feeble Ammo", "The creature hit by the ammo takes an extra 2d6 necrotic damage. The target must also succeed on a Constitution saving throw, or the damage dealt by its weapon attacks is halved until the start of your next turn.</p><p>At 18th level, the extra damage of this ammo becomes 4d6 necrotic instead.",
    [aDmg("Extra Necrotic Damage", up(2, 4, 6), "necrotic", AMMO),
     aSave("Feeble (Constitution Save)", "con", "On a failure the damage dealt by the target's weapon attacks is halved until the start of your next turn.", { name: "Feeble", ...R1 })]),
  ammo("Grasping Ammo", "The creature hit by the arrow ammo an extra 2d6 piercing damage, its speed is reduced by 10 feet, and it takes 2d6 slashing damage the first time on each turn it moves 1 foot or more without teleporting. The target or any creature that can reach it can use its action to remove the brambles with a successful Strength (Athletics) check against your Advanced Arsenal save DC. Otherwise, the effect lasts for 1 minute or until you use this option again.</p><p>At 18th level, the extra damage of this ammo becomes 4d6 piercing instead.",
    [aDmg("Extra Piercing Damage", up(2, 4, 6), "piercing", AMMO),
     { name: "Brambles", type: "utility", activation: "special", targets: { count: 1, type: "creature" }, duration: { value: 1, units: "minute" }, effects: [{ name: "Grasping Brambles", onTargets: true, changes: [chg("system.attributes.movement.walk", "-10")], seconds: 60 }],
       note: "The target's speed is reduced by 10 feet for 1 minute or until you use this option again. Strength (Athletics) check against your Advanced Arsenal DC (an action) removes the brambles." },
     aDmg("Brambles: Movement Damage", up(2, 4, 6), "slashing", "The first time on each turn the target moves 1 foot or more without teleporting (2d6, 4d6 at 18th level).")]),
  ammo("Piercing Ammo", "When you use this option, you don't make an attack roll for the attack. Instead, the ammo fires forward in a line, which is 1 foot wide and 30 feet long, before disappearing. The arrow passes harmlessly through objects, ignoring cover. Each creature in that line must make a Dexterity saving throw. On a failed save, a creature takes damage as if it were hit by the ammo, plus an extra 1d6 piercing damage. On a successful save, a target takes half as much damage.</p><p>At 18th level, the extra damage of this ammo becomes 2d6 piercing instead.",
    [{ name: "Piercing Line (Dexterity Save)", type: "save", activation: "special", area: { type: "line", size: 30 }, targets: { type: "creature" }, save: { ability: "dex", dc: ARS_DC, onSave: "half" }, damage: [[`(1 + floor(${FL} / 18))d6`, "piercing"]], note: AMMO + "No attack roll. A failed save deals the ammo's damage as if it hit, plus this extra damage; a success deals half." }]),
  ammo("Homing Ammo", "When you use this option, you don't make an attack roll for the attack. Instead, choose one creature you have seen in the past minute.</p><p>The ammo flies toward that creature, moving around corners if necessary and ignoring three-quarters cover and half cover. If the target is within the weapon's range and there is a path large enough for the ammo to travel to the target, the target must make a Dexterity saving throw.</p><p>On a failed save, it takes damage as if it were hit by the ammo, plus an extra 1d6 force damage, and you learn the target's current location. On a successful save, the target takes half as much damage, and you don't learn its location.</p><p>At 18th level, this instead deals 2d6 force damage.",
    [{ name: "Homing Shot (Dexterity Save)", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "dex", dc: ARS_DC, onSave: "half" }, damage: [[`(1 + floor(${FL} / 18))d6`, "force"]], note: AMMO + "No attack roll; choose a creature you have seen in the past minute. A failed save deals the ammo's damage plus this extra damage and you learn its location; a success deals half and you do not." }]),
  ammo("Shadow Ammo", "The creature hit by the arrow takes an extra 2d6 psychic damage, and it must succeed on a Wisdom saving throw or be blinded until the start of your next turn.</p><p>At 18th level, this instead deals 4d6 psychic damage.",
    [aDmg("Extra Psychic Damage", up(2, 4, 6), "psychic", AMMO),
     aSave("Shadow (Wisdom Save)", "wis", "On a failure the target is blinded until the start of your next turn.", { name: "Blinded by Shadow Ammo", statuses: ["blinded"], ...R1 })]),
  ammo("Warp Ammo", "In the place of an attack, you can expend a use of your Advanced Arsenel to teleport to a point you can see within the short range of the ranged weapon you are using to fire the ammo.</p><p>At 18th level, you can choose to instead teleport to a space within the long range of your weapon.",
    [util("Warp", "In place of an attack, expend a use of Advanced Arsenal and teleport to a point you can see within the weapon's short range (long range at 18th level).", "action")], "Arms Dealer 7"),
];

const engineering: Def = { group: "feature/fighter/arms-dealer", name: "Engineering", req: "Arms Dealer 3", acts: [],
  html: p("Upon choosing this archetype at 3rd level, you gain proficiency with the Engineering (Intelligence) skill, Tinker's Tools, firearms, and cannons. You may use them to craft ammunition at half the cost and even draft and create new ones (DM's discretion).") };

// ================= Gadgeteer mods (S2/Class Features/Mods.md, S2/Mechanical Servant/Actions.md) =================
const GM = "feature/gadgeteer/mod";
const INT_DC = "8 + @prof + @abilities.int.mod";
const pre = (lvl?: number, sub?: string) => [lvl ? `${lvl}th-level gadgeteer` : "", sub ? `${sub} gadgeteer subclass` : ""].filter(Boolean).join(", ");
const mod = (name: string, item: string, text: string, acts: ActSpec[], lvl?: number, sub?: string): Def => ({
  group: GM, name, req: lvl ? `Gadgeteer ${lvl}` : "Gadgeteer 2",
  html: `<p><em>${pre(lvl, sub) ? `Prerequisite: ${pre(lvl, sub)}. ` : ""}Item: ${item}</em></p>${text}`, acts,
});
/** one "apply" activity per bonus tier (+1 / +2 at 8th or 10th / +3 at 16th) so the effect carries a fixed number */
const tiers = (label: string, lv2: number, changes: (n: number) => ReturnType<typeof chg>[], note: string): ActSpec[] =>
  [1, 2, 3].map((n) => ({
    name: `${label} +${n}${n === 2 ? ` (${lv2}th level)` : n === 3 ? " (16th level)" : ""}`, type: "utility" as const, activation: "special" as const,
    targets: { count: 1, type: "creature" as const }, effects: [{ name: `${label} +${n}`, onTargets: true, changes: changes(n) }], note,
  }));
const AC = (n: number) => chg("system.attributes.ac.bonus", `+${n}`);
const wpn = (n: number, k = ["mwak", "rwak"]) => k.flatMap((x) => [chg(`system.bonuses.${x}.attack`, `+${n}`), chg(`system.bonuses.${x}.damage`, `+${n}`)]);
const applyAc = (label: string, changes: ReturnType<typeof chg>[], note: string): ActSpec =>
  ({ name: `Apply ${label}`, type: "utility", activation: "special", targets: { count: 1, type: "creature" }, effects: [{ name: label, onTargets: true, changes }], note });
const NB = "bonus to attack and damage rolls made with it";

export const mods: Def[] = [
  mod("Armor of Mechanical Strength", "A suit of armor", p("A creature gains a +1 bonus to Armor Class while wearing this armor. This armor has a number of charges equal to your proficiency bonus. The wearer gains the following benefits:") +
    "<ul><li>When the wearer makes a Strength check or a Strength saving throw, it can use its Intelligence modifier in place of Strength.</li><li>If the creature would be knocked prone, grappled, or restrained, it can use its reaction to expend 1 charge to avoid being knocked prone, grappled, or restrained.</li></ul>" + p("The armor regains all expended charges at the end of a long rest."),
    [applyAc("Armor of Mechanical Strength", [AC(1)], "+1 AC while worn. The wearer may use Intelligence in place of Strength for Strength checks and saving throws."),
     { name: "Avoid Prone, Grappled or Restrained", type: "utility", activation: "reaction", reactionWhen: "You would be knocked prone, grappled, or restrained", consumeUse: true, note: "Expend 1 charge (charges = your proficiency bonus, regained on a long rest)." }], 6),
  mod("Burst Boots", "A pair of boots", p("While wearing these boots, a creature can teleport up to 15 feet as a bonus action to an unoccupied space the creature can see."),
    [{ name: "Burst Teleport", type: "utility", activation: "bonus", range: 15, note: "Teleport up to 15 feet to an unoccupied space you can see." }]),
  mod("Enhanced Creative Focus", "A creative focus", p("While holding this item, a creature gains a +1 bonus to creation attack rolls, and their creation save DC. In addition, the creature ignores half cover when making a creation attack.") + p("The bonus increases to +2 when you reach 8th level in this class, and to +3 at 16th level."),
    tiers("Enhanced Creative Focus", 8, (n) => [chg("system.bonuses.msak.attack", `+${n}`), chg("system.bonuses.rsak.attack", `+${n}`), chg("system.bonuses.spell.dc", `+${n}`)], "Bonus to creation attack rolls and creation save DC while holding the focus; ignores half cover when making a creation attack.")),
  mod("Enhanced Defenses", "A suit of armor or a shield", p("A creature gains a +1 bonus to Armor Class while wearing (armor) or wielding (shield) the infused item.") + p("The bonus increases to +2 when you reach 8th level in this class, and to +3 at 16th level."),
    tiers("Enhanced Defenses", 8, (n) => [AC(n)], "Bonus to Armor Class while wearing (armor) or wielding (shield) the item.")),
  mod("Enhanced Weapon", "A simple or martial weapon", p("This mastercraft weapon grants a +1 bonus to attack and damage rolls made with it.") + p("The bonus increases to +2 when you reach 8th level in this class, and to +3 at 16th level."),
    tiers("Enhanced Weapon", 8, (n) => wpn(n), "Applied as a bonus to all weapon attack and damage rolls while the creature wields the weapon; remove the effect when it is put down.")),
  mod("Propulsion Armor", "A suit of armor", p("A creature gains a +1 bonus to Armor Class while wearing this armor. The wearer of this armor gains these benefits:") +
    "<ul><li>The wearer's walking speed increases by 5 feet.</li><li>The armor includes gauntlets, each of which is a melee weapon that can be wielded only when the hand is holding nothing. The wearer is proficient with the gauntlets, and each one deals 1d8 force damage on a hit and has the thrown property, with a normal range of 20 feet and a long range of 60 feet. When thrown, the gauntlet detaches and flies at the attack's target, then immediately returns to the wearer and reattaches. The wearer of this armor can use their Intelligence modifier in place of Strength for attack and damage rolls made with these gauntlets.</li><li>The armor can't be removed against the wearer's will.</li><li>If the wearer is missing any limbs, the armor replaces those limbs - hands, arms, feet, legs, or similar appendages. The replacements function identically to the body parts they replace.</li></ul>",
    [applyAc("Propulsion Armor", [AC(1), chg("system.attributes.movement.walk", "5")], "+1 AC and +5 feet walking speed while worn."),
     { name: "Gauntlet", type: "attack", activation: "action", range: 5, attack: { type: "melee", ability: "int" }, damage: [["1d8 + @abilities.int.mod", "force"]], note: "Melee, or thrown (range 20/60 ft; the gauntlet returns to the wearer). Only wielded when the hand holds nothing." }], 6),
  mod("Awareness Visor", "Something you can wear on your head", "<p>While wearing this visor, the wearer gains the following benefits:</p><ul><li>The wearer has advantage on initiative rolls.</li><li>The wearer can't be surprised, provided it isn't incapacitated.</li><li>The wearer gains darkvision of 120ft. This darkvision enables you to see through the darkness of creations and similar creative effects.</li></ul>",
    [{ name: "Apply Awareness Visor", type: "utility", activation: "special", targets: { count: 1, type: "creature" }, effects: [{ name: "Awareness Visor", onTargets: true, changes: [chg("flags.dnd5e.initiativeAdv", "1", 5), chg("system.attributes.senses.ranges.darkvision", "120", 4)] }], note: "Advantage on initiative rolls, can't be surprised while not incapacitated, darkvision 120 ft (sees through the darkness of creations)." }], 6),
  mod("Replicate Mastercraft Item", "Varies",
    p("Using this mod, you replicate a particular \"magic\" item. You can learn this mod multiple times; each time you do so, choose a mastercraft item that you can make with it, picking from the Replicable Items tables. A table's title tells you the level you must be in the class to choose an item from the table. Alternatively, you can choose the \"magic\" item from among the common \"magic\" items in the game, not including potions or scrolls. See the item's description in the Dungeon Master's Guide for more information about it, including the type of object required for its making.") +
    "<h4>Replicable Items</h4>" +
    ([["2nd", "Alchemy Jug, Bag Of Holding, Boots of Winterlands, Cap Of Waterbreathing, Goggles Of Night, Rope Of Climbing, Sending Stones, Wand Of Magic Missiles, Wand Of Secrets, Pipes Of The Sewers, Bracers Of Archery, Mithril Armor, Boots of Striding and Springing, Eyes Of Charming, Necklace of Adaptation"],
      ["6th", "All Purpose Tool, Boots Of Elvenkind, Cloak Of Elvenkind, Cloak Of Manta Ray, Gloves Of Thievery, Ring Of Water Walking, Gloves Of Missile Snaring, Periapt Of Wound Closure, Ventilating Lungs, Arcane Propulsion Arm, Ring Of The Ram, Adamantine Armor, Wand of Binding, Ring of Evasion"],
      ["10th", "Ring of Spell Storing, Ring of Feather Falling, Cloak Of Protection, Eyes Of The Eagle, Gauntlets Of Ogre Power, Hat Of Disguise, Headband Of Intellect, Slippers Of Spiderclimbing, Winged Boots, Boots Of Speed, Bracers Of Defense, Cloak Of The Bat, Ring Of Free Action, Arcane Cannon, Ring Of Protection"],
      ["14th", "Amulet Of Health, Ring of Regeneration, Belt Of Hill Giant Strength, Boots Of Levitation, Carpet Of Flying, Cloak of Invisibility, Ring of Telekinesis"]] as const)
      .map(([l, t]) => `<p><strong>${l} level:</strong> ${t}.</p>`).join(""), []),
  // --- mastercraft mods (Mechanical Servant/Actions.md) ---
  mod("Focusing Suit", "A suit of armor or robes", p("While wearing this item, the wearer adds their Intelligence modifier to their Concentration saving throws."),
    [applyAc("Focusing Suit", [chg("system.attributes.concentration.bonuses.save", "+@abilities.int.mod")], "Adds the wearer's Intelligence modifier to Concentration saving throws.")]),
  mod("Repeating Magazine", "A simple or martial weapon with the ammunition property", p("This mastercraft weapon grants a + 1 bonus to attack and damage rolls made with it when it's used to make a ranged attack, and it ignores the loading property if it has it.") + p("If you load no ammunition in the weapon, it produces its own, automatically creating one piece of ammunition when you make a ranged attack with it. The ammunition created by the weapon vanishes the instant after it hits or misses a target."),
    [applyAc("Repeating Magazine", wpn(1, ["rwak"]), "+1 to ranged weapon attack and damage rolls while wielded.")]),
  mod("Glowing Weapon", "A simple or martial weapon", p(`This mastercraft weapon grants a + 1 ${NB}. While holding it, the wielder can take a bonus action to cause it to shed bright light in a 30-foot radius and dim light for an additional 30 feet. The wielder can extinguish the light as a bonus action.`) + p("The weapon has 6 charges. As a reaction immediately after being hit by an attack, the wielder can expend 1 charge and cause the attacker to be blinded until the end of the attacker's next turn unless the attacker succeeds on a Constitution saving throw against your creation save DC. The weapon regains all expended charges at the end of a long rest."),
    [applyAc("Glowing Weapon", wpn(1), "+1 to weapon attack and damage rolls while wielded."),
     { name: "Shed Light", type: "utility", activation: "bonus", note: "Bright light in a 30-foot radius and dim light for an additional 30 feet; extinguish as a bonus action." },
     { name: "Dazzle Attacker (Constitution Save)", type: "save", activation: "reaction", reactionWhen: "You are hit by an attack", consumeUse: true, targets: { count: 1, type: "creature" }, save: { ability: "con", dc: INT_DC, onSave: "none" }, effects: [{ name: "Blinded by Glowing Weapon", statuses: ["blinded"], onTargets: true, ...R2 }], note: "Expend 1 of the weapon's 6 charges (regained on a long rest). On a failure the attacker is blinded until the end of its next turn." }]),
  mod("Repulsion Shield", "A shield", p("A creature gains a +1 bonus to Armor Class while wielding this shield.") + p("The shield has 4 charges. While holding it, the wielder can use a reaction immediately after being hit by a melee attack to expend 1 of the shield's charges and push the attacker up to 15 feet away. The shield regains all expended charges at the end of a long rest."),
    [applyAc("Repulsion Shield", [AC(1)], "+1 AC while wielding the shield."),
     { name: "Repulse Attacker", type: "utility", activation: "reaction", reactionWhen: "You are hit by a melee attack", consumeUse: true, note: "Expend 1 of the shield's 4 charges (regained on a long rest); push the attacker up to 15 feet away." }], 6),
  mod("Resistant Armor", "A suit of armor", p("A creature gains a +1 bonus to Armor Class while this armor. In addition, while wearing this armor, a creature has resistance to one of the following damage types, which you choose when you mod the item: acid, bludgeoning, cold, fire, force, lightning, necrotic, piercing, poison, psychic, radiant, slashing, or thunder.") + p("At 10th level, the creature has resistance to two damage types from the list. At 16th level, this increases to three types from the list."),
    [applyAc("Resistant Armor", [AC(1)], "+1 AC while worn. Add the chosen damage resistances (one; two at 10th level; three at 16th level) to the wearer by hand.")], 6),
  mod("Loyal Weapon", "A simple or martial weapon with the thrown property", p(`This mastercraft weapon grants a +1 ${NB}, and it returns to the wielder's hand immediately after it is used to make a ranged attack.`) + p("In addition, the short and long ranges of this thrown weapon are doubled."),
    [applyAc("Loyal Weapon", wpn(1), "+1 to weapon attack and damage rolls while wielded; the weapon returns to the wielder's hand after a ranged attack and its thrown ranges are doubled.")]),
  mod("Creation Refueling Ring", "A ring", p("While wearing this ring, the creature can recover one expended creation slot as an action. The recovered slot can be of 3rd level or lower. Once used, the ring can't be used again until the wearer finishes a long rest.") + p("At 8th level, the slot recovered can be of 4th level or lower. At 16th, the slot recovered can be of 5th or lower."),
    [{ name: "Recover Creation Slot", type: "utility", activation: "action", consumeUse: true, note: "Recover one expended creation slot of 3rd level or lower (4th at 8th level, 5th at 16th level). Once per long rest." }]),
  mod("Reinforced Steel", "Your Iron Defender", p("You have reinforced the metal of your robotic companion, allowing them to better tank heavy hits. Your Iron Defender gains a +1 bonus to its AC, as well as increasing their hit point maximum by an amount equal to twice your level.") + p("At 10th level, the AC bonus increases to +2. At 16th level, the AC bonus increases to +3."),
    tiers("Reinforced Steel", 10, (n) => [AC(n)], "AC bonus for your Iron Defender. Also raise its hit point maximum by twice your gadgeteer level by hand."), 6, "Battle Smith"),
  mod("Extended Barrel", "Your Mechanical Cannon", p("You have extended the length and increased the power of your cannon's barrel, enabling it to fire further. The range of Elemental Culverine increases to a 30ft cone, the range of Force Ballista increases to 300ft, you add your Intelligence modifier to damage rolls made with the Force Ballista, and the radius of Protector increases to 20 ft."), [], 6, "Artillerist"),
  mod("Heavy Artillery", "Your Mechanical Cannon", p("You have increased the size and firepower of your cannon, granting it new uses in battle. It gains the following benefits:") + "<ul><li>Your cannon can double as a 12-pounder cannon as per the Cannon table of Mounts and Vehicles section in Chapter 4: Equipment and Items. In addition, you can use your bonus action to fire the cannon in this way.</li><li>Your Mechanical Cannon's size increases to Large, and the distance you can move it increases to 30ft.</li></ul>",
    [{ name: "Fire as 12-Pounder", type: "utility", activation: "bonus", note: "Fire the cannon as a 12-pounder cannon (see the Cannon table in Chapter 4)." }], 6, "Artillerist"),
  mod("Wrought Warden", "Your Mechanical Armor", p("You have improved upon the design of your armor, enabling you to better overpower your opponents. While your Mechanical Armor is in its Guardian model, you gain the following benefits:") +
    "<ul><li><strong>Enhanced Weapon.</strong> Your Thunder Gauntlets gain a +1 bonus to attack and damage rolls made with it. The bonus increases to +2 when you reach 10th level in this class, and to +3 at 16th level.</li><li><strong>Forceful Fist.</strong> When you hit a creature with your Thunder Gauntlets, you can instead choose to deal force damage instead of thunder. When you choose to deal force damage, the disorienting pulse changes into a concentrated blast of energy. Instead of imposing disadvantage on the target, you can choose to push the target backwards 10ft.</li><li><strong>Durable Field.</strong> While you have the temporary hit points of your Defensive Field feature active, you gain resistance to one of the damage types of your choice (choose when you activate the field): thunder, force, bludgeoning, piercing, or slashing.</li></ul>",
    tiers("Wrought Warden", 10, (n) => wpn(n, ["mwak"]), "Thunder Gauntlets bonus to attack and damage rolls (Guardian model)."), 6, "Armorer"),
  mod("Omega Operative", "Your Mechanical Armor", p("You have improved upon the design of your armor, enabling you to seek and maneuver across any field. While your Mechanical Armor is in its Infiltrator model, you gain the following benefits:") +
    "<ul><li><strong>Enhanced Weapon.</strong> Your Lightning Launcher gains a +1 bonus to attack and damage rolls made with it. The bonus increases to +2 when you reach 10th level in this class, and to +3 at 16th level.</li><li><strong>Laser Cannon.</strong> When you hit a creature with your Lightning Launcher, you can instead choose to deal radiant damage instead of lightning. When you choose to deal radiant damage, the electrical energy changes into a concentrated beam of light. Instead of removing the reactions of the target, you can choose to wreath the target in light until the start of your next turn. While wreathed in light that shines bright within 10ft radius and dim light 10ft thereafter, and the target doesn't benefit from the invisible condition, and cannot become hidden.</li><li><strong>Phase Step.</strong> As a bonus action, you can overcharge the energy of your armor, briefly enabling you to phase through solid matter until the end of your turn. While in this state of phase, opportunity attacks against you are made at disadvantage, and you can move through the space of solid objects and creatures. When you move through the space of an object or creature, you can choose to deal 1d10 radiant or lightning damage (your choice) to that target. An object or creature can only take damage in this way once per turn. If you end your turn in the space of an object or creature, you take 1d10 force damage and are shunted to the nearest open space.</li></ul>",
    [...tiers("Omega Operative", 10, (n) => wpn(n, ["rwak"]), "Lightning Launcher bonus to attack and damage rolls (Infiltrator model)."),
     { name: "Phase Step", type: "utility", activation: "bonus", duration: { value: 1, units: "turn" }, note: "Phase through solid matter until the end of your turn; opportunity attacks against you have disadvantage." },
     { name: "Phase Step: Damage", type: "damage", activation: "special", damage: [["1d10", ["radiant", "lightning"]]], note: "When you move through an object or creature's space, once per turn per target." },
     { name: "Phase Step: Shunt Damage", type: "damage", activation: "special", targets: { type: "self" }, damage: [["1d10", "force"]], note: "If you end your turn in the space of an object or creature; you are shunted to the nearest open space." }], 6, "Armorer"),
  mod("Chemistry Menagerie", "A set of Alchemist's tools", p("You improve the formulas and tools within your Alchemist's tools. While these tools are one your person, you gain the following additional Chemical Cocktail options:") +
    "<ul><li><strong>Flight.</strong> The drinker gains a flying speed of 30ft for 10 minutes.</li><li><strong>Growth/Reduction.</strong> The drinker gains their choice of the Enlarge or Reduce benefits of the Enlarge/Reduce creation for 10 minutes.</li><li><strong>Resistance.</strong> The drinker gains resistance to a damage type from the following list: fire, cold, acid, poison, lightning, necrotic, or radiant.</li><li><strong>Invisibility.</strong> The drinker gains the benefits of the Invisibility creation for 10 minutes, ending when they make an attack or use a creation.</li></ul>",
    [{ name: "Flight Cocktail", type: "utility", activation: "special", duration: { value: 10, units: "minute" }, targets: { count: 1, type: "creature" }, effects: [{ name: "Cocktail: Flight", onTargets: true, changes: [chg("system.attributes.movement.fly", "30", 4)], seconds: 600 }], note: "The drinker gains a flying speed of 30 ft for 10 minutes." },
     { name: "Invisibility Cocktail", type: "utility", activation: "special", duration: { value: 10, units: "minute" }, targets: { count: 1, type: "creature" }, effects: [{ name: "Cocktail: Invisibility", statuses: ["invisible"], onTargets: true, seconds: 600 }], note: "The drinker gains the benefits of the Invisibility creation for 10 minutes, ending when they make an attack or use a creation." },
     { name: "Growth / Reduction Cocktail", type: "utility", activation: "special", duration: { value: 10, units: "minute" }, targets: { count: 1, type: "creature" }, note: "The drinker gains their choice of the Enlarge or Reduce benefits of the Enlarge/Reduce creation for 10 minutes." },
     { name: "Resistance Cocktail", type: "utility", activation: "special", duration: { value: 10, units: "minute" }, targets: { count: 1, type: "creature" }, note: "Resistance to one damage type: fire, cold, acid, poison, lightning, necrotic, or radiant (apply by hand)." }], 6, "Alchemist"),
  mod("Versatile Elements", "Your Gadget Weapon", p("You have increased the versatility of your Gadget Weapon. When you use a creation that deals acid, cold, fire, lightning, poison, or thunder damage, you can swap the damage type with another one on the list. Your Gadget Weapon has a +1 bonus to attack and damage rolls, and grants you a +1 bonus to any Gadgeteer creation attack roll or save DC.") + p("In addition, when you use your action to activate a creation using your Gadget Weapon, you can make an attack with the Gadget Weapon as a bonus action.") + p("At 10th level, the +1 bonus increases to +2, and to +3 at 16th level."),
    tiers("Versatile Elements", 10, (n) => [...wpn(n), chg("system.bonuses.msak.attack", `+${n}`), chg("system.bonuses.rsak.attack", `+${n}`), chg("system.bonuses.spell.dc", `+${n}`)], "Bonus to Gadget Weapon attack and damage rolls and to Gadgeteer creation attack rolls and save DC."), 6, "Elementalist"),
  mod("Airborne Aegis", "Your Applied Aegis", p("Your Applied Aegis counts as a +1 shield. While wielding your Applied Aegis, you can use a bonus action to cause it to animate. The shield leaps into the air and hovers in your space to protect you as if you were wielding it, leaving your hands free. The shield remains animated for 1 minute, until you use a bonus action to end this effect, or until you are incapacitated or die, at which point the shield falls to the ground or into your hand if you have one free."),
    [{ name: "Animate Shield", type: "utility", activation: "bonus", duration: { value: 1, units: "minute" }, note: "The shield hovers in your space and protects you as if you were wielding it. Ends after 1 minute, as a bonus action, or if you are incapacitated or die." }], 6, "Safeguard"),
];

// ================= everything, for the pack and the choice pools =================
const extra: Def[] = [gunsmith, hemorrhaging, engineering];
export const allDefs: Def[] = [...maneuvers, ...shots, ...ammos, ...mods, ...extra];
export const classContentFeatures: FeatureItem[] = allDefs.map(toFeature);
export const gunsmithDef = gunsmith, hemorrhagingDef = hemorrhaging, engineeringDef = engineering;
export const maneuverUuids = maneuvers.map(uuidOf);
export const shotUuids = shots.map(uuidOf);
export const ammoUuids = ammos.map(uuidOf);
export const modUuids = mods.map(uuidOf);
