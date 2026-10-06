import type { Spec, EffectSpec } from "../../helpers/spec.js";

// Conditional text-only features, second group (issue #26, DM-approved list). Toggles are passive effects that start switched off; the player switches
// one on while its condition holds. Buttons are activities for the triggered parts. See text-batch5.ts for the first group.
const ch = (key: string, value: string, mode = 2) => ({ key, mode, value });
const toggle = (name: string, ...changes: ReturnType<typeof ch>[]): EffectSpec => ({ name, transfer: true, disabled: true, changes });
const MIDI = (what: string, value = "1") => ch(`flags.midi-qol.${what}`, value, 5);
const ABILITIES = ["str", "dex", "con", "int", "wis", "cha"];
/** advantage on saving throws, switched on for the save the feature names (dnd5e has no condition-specific save advantage) */
const advSaves = () => ABILITIES.map((a) => ch(`system.abilities.${a}.save.roll.mode`, "1", 4));
const DAMAGE_TYPES = ["acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic", "piercing", "poison", "radiant", "slashing", "thunder"];
const dieStep = (n: number) => ch("flags.op5e.unarmedDieStep", String(n), 4);   // upgrade: the larger step wins, so overlapping unarmed features never stack
// Ordnance Requiem damage dice by Bard level
const REQUIEM = "(2 + min(1, floor(@classes.bard.levels / 5)) + 2 * min(1, floor(@classes.bard.levels / 10)) + 3 * min(1, floor(@classes.bard.levels / 15)))d6";

export const batch6Specs: Record<string, Spec> = {
  "racial-features/Fear Factor": { activities: [], extraEffects: [toggle("Fear Factor: a creature one size smaller or more (advantage on Intimidation)", ch("system.skills.itm.roll.mode", "1", 4))] },
  "class-features/Fighting Style: Thrown Weapon Fighting": {
    activities: [{ name: "Thrown weapon hit", type: "utility", activation: "special", roll: { formula: "2", name: "+2 damage" }, note: "When you hit with a ranged attack using a thrown weapon, add 2 to the damage roll. You can draw the weapon as part of the attack." }],
  },
  "class-features/Fists of Fury": {
    activities: [{ name: "Fists of Fury: punish", type: "utility", activation: "special", targets: { count: 1, type: "enemy" }, duration: { value: 1, units: "round" }, note: "When you hit with an unarmed strike while raging: until the start of your next turn the target has disadvantage on attack rolls against creatures other than you.",
      effects: [{ name: "Fists of Fury: disadvantage against others", rounds: 1, onTargets: true }] }],
    extraEffects: [{ name: "Fists of Fury (d6 unarmed)", transfer: true, changes: [dieStep(1)] }, toggle("Fists of Fury: no weapon or shield (d8)", dieStep(2))],
  },
  "class-features/Ready to Rumble": { activities: [], extraEffects: [{ name: "Ready to Rumble (d8 unarmed)", transfer: true, changes: [dieStep(2)] }, toggle("Ready to Rumble: no weapon or shield (d10)", dieStep(3))] },
  "class-features/Gigantic Might": {
    activities: [{ name: "Gigantic Might: shockwave", type: "utility", activation: "special", roll: { formula: "@details.level", name: "Thunder damage to creatures within 5 ft of the target" }, note: "On a critical hit with a weapon attack while raging. The reach and size increase are applied by hand." }],
    extraEffects: [toggle("Gigantic Might (raging): +1d4 thunder on melee and thrown attacks", ch("system.bonuses.mwak.damage", "+1d4[thunder]"), ch("system.bonuses.rwak.damage", "+1d4[thunder]"))],
  },
  "feats/Grappler": {
    activities: [{ name: "Grappler: advantage on the grappled creature", type: "utility", activation: "special", duration: { value: 1, units: "round" }, note: "Advantage on attack rolls against the creature you are grappling (only against that creature). You can attempt a grapple as a bonus action.",
      effects: [{ name: "Grappler: advantage while grappling", rounds: 1, changes: [MIDI("advantage.attack.all")] }] }],
  },
  "class-features/Hardy Resolution": { activities: [], extraEffects: [toggle("Hardy Resolution (Swinging Stance): save against charmed, frightened, restrained, stunned or paralyzed", ...advSaves())] },
  "racial-features/Improved Ignite": { activities: [], extraEffects: [toggle("Improved Ignite (Ignited form): resistance to all damage except psychic", ...DAMAGE_TYPES.map((t) => ch("system.traits.dr.value", t)))] },
  "class-features/Inexorable Prowess": { activities: [], extraEffects: [toggle("Inexorable Prowess (raging): no disadvantage on weapon attacks against creatures you see", MIDI("fail.disadvantage.attack.mwak"), MIDI("fail.disadvantage.attack.rwak"))] },
  "class-features/Keen Eyes": { activities: [], extraEffects: [toggle("Keen Eyes: moved at most half your speed (advantage on Perception and Investigation)", ch("system.skills.prc.roll.mode", "1", 4), ch("system.skills.inv.roll.mode", "1", 4))] },
  "class-features/Pokerface": { activities: [], extraEffects: [toggle("Pokerface: moved at most half your speed (advantage on Deception and Sleight of Hand)", ch("system.skills.dec.roll.mode", "1", 4), ch("system.skills.slt.roll.mode", "1", 4))] },
  "class-features/Make Your Mark": {
    activities: [
      { name: "Mark", type: "utility", activation: "special", targets: { count: 1, type: "enemy" }, duration: { value: 1, units: "round" }, note: "When you hit with a melee weapon attack: the marked creature has disadvantage on attack rolls that don't target you while it is within your reach, until the end of your next turn.",
        effects: [{ name: "Marked", rounds: 2, onTargets: true }] },
      { name: "Punish the marked creature", type: "utility", activation: "bonus", roll: { formula: "floor(@classes.fighter.levels / 2)", name: "Extra damage" }, note: "On your next turn, after the marked creature damages someone other than you: a melee weapon attack against it with advantage; if it hits, add this damage." },
    ],
  },
  "class-features/Ordnance Requiem": {
    activities: [{ name: "Ordnance Requiem", type: "utility", activation: "special", consumeUse: true, consumeTarget: "bardic-inspiration", roll: { formula: REQUIEM, name: "Extra damage (weapon's damage type)" }, note: "When you hit with a weapon attack, once per round on your turn, expend one Bardic Inspiration use." }],
  },
  "class-features/Powerful Passion": {
    activities: [{ name: "Powerful Passion", type: "utility", activation: "special", roll: { formula: "1d8", name: "Extra Ardent Smite damage (your Ardent Soul's type)" }, note: "When you use Ardent Smite, add 1d8 for each use of this feature, up to 6d8 in total." }],
  },
  "class-features/Rampaging Vigor": {
    activities: [{ name: "Rampaging Vigor", type: "heal", activation: "special", healing: { formula: "max(1, @abilities.wis.mod + @classes.brawler.levels)", type: "temp" }, note: "When you reduce a creature to 0 hit points with an unarmed strike." }],
  },
  "class-features/Reckless Attack": {
    activities: [], extraEffects: [toggle("Reckless Attack: advantage on Strength melee attacks, attackers have advantage against you until your next turn", MIDI("advantage.attack.mwak"), MIDI("grants.advantage.attack.all"))],
  },
  "feats/Sharpshooter": { activities: [], extraEffects: [toggle("Sharpshooter: -5 to hit, +10 damage (ranged weapon you are proficient with)", ch("system.bonuses.rwak.attack", "-5"), ch("system.bonuses.rwak.damage", "+10"))] },
  "feats/Slasher": {
    activities: [
      { name: "Slasher: slow", type: "utility", activation: "special", targets: { count: 1, type: "enemy" }, duration: { value: 1, units: "round" }, note: "Once per turn when you hit with slashing damage: the target's speed is reduced by 10 feet until the start of your next turn.",
        effects: [{ name: "Slashed: speed -10 ft", rounds: 1, onTargets: true, changes: [ch("system.attributes.movement.walk", "-10")] }] },
      { name: "Slasher: grievous wound", type: "utility", activation: "special", targets: { count: 1, type: "enemy" }, duration: { value: 1, units: "round" }, note: "On a critical hit with slashing damage: the target has disadvantage on all attack rolls until the start of your next turn.",
        effects: [{ name: "Grievously wounded: disadvantage on attacks", rounds: 1, onTargets: true, changes: [MIDI("disadvantage.attack.all")] }] },
    ],
  },
  "class-features/Star of the Show": {
    activities: [{ name: "Star of the Show", type: "heal", activation: "special", range: 10, rangeUnits: "ft", targets: { count: "", type: "creature" }, healing: { formula: "max(1, @abilities.cha.mod)", type: "temp" }, note: "A creature of your choice that starts its turn in your 10-foot aura while you are conscious. The temporary hit points last until it leaves the aura." }],
  },
  "racial-features/Strong Faith": { activities: [], extraEffects: [toggle("Strong Faith: save against being charmed or frightened (advantage)", ...advSaves())] },
  "racial-features/Third Eye": { activities: [], extraEffects: [toggle("Third Eye: save against being blinded or charmed (advantage)", ...advSaves())] },
  "class-features/Supersonic": { activities: [], extraEffects: [toggle("Supersonic (Afterimage active): +10 ft speed", ch("system.attributes.movement.walk", "10"))] },
  "class-features/Third Wind": {
    activities: [{ name: "Third Wind", type: "heal", activation: "special", healing: { formula: "1d10 + @classes.fighter.levels", type: "temp" }, note: "When you use Second Wind, you also gain temporary hit points equal to the amount you rolled. If you already rolled, use that total instead." }],
  },
  "class-features/Tireless Spirit": {
    activities: [
      { name: "Regain Second Wind", type: "utility", activation: "special", consumeUse: true, consumeTarget: "second-wind", consumeAmount: "-1", note: "When you roll initiative with no uses of Second Wind remaining." },
      { name: "Second Wind bonus", type: "utility", activation: "special", roll: { formula: "max(1, @abilities.wis.mod)", name: "Extra hit points restored" }, note: "Whenever you use Second Wind, add this to the hit points restored." },
    ],
  },
};
