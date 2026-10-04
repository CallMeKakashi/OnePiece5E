import type { ActSpec, EffectSpec, Spec } from "../../helpers/spec.js";

// Mechanics corrected against the Sourcebook (Chapter 2 Classes): Devious Strike options as real activities with their
// sneak-attack-dice cost, class resources that the maneuver / ammo / trick-shot activities consume, and rogue subclass fixes.
// Text lives in the owning feature .ts; counts that dnd5e can express (uses, activation) are set there too.

const DEV_DC = "8 + @abilities.dex.mod + @prof";
const TARGET = { count: 1, type: "creature" as const };
const UNTIL_NEXT_TURN_END = { rounds: 2 };
const MIN = { value: 1, units: "minute" as const };
const ABIL = ["str", "dex", "con", "int", "wis", "cha"];
const dis = (path: string) => ({ key: `${path}.roll.mode`, mode: 3, value: "-1" });
const adv = (path: string) => ({ key: `${path}.roll.mode`, mode: 4, value: "1" });
const onT = (e: EffectSpec): EffectSpec => ({ ...e, onTargets: true });

const note = (c: string, text: string) => `Devious Strike option (forgo ${c} of your Sneak Attack dice before rolling; the effect occurs immediately after the attack's damage is dealt). ${text}`;
/** a Devious Strike option that forces a saving throw */
const devSave = (name: string, c: string, ability: string, text: string, effect?: EffectSpec, extra: Partial<ActSpec> = {}): ActSpec => ({
  name: `${name} (Cost: ${c})`, type: "save", activation: "special", targets: TARGET, save: { ability, dc: DEV_DC, onSave: "none" },
  effects: effect ? [onT(effect)] : undefined, note: note(c, text), ...extra,
});
/** a Devious Strike option without a save; effect (if any) lands on the target unless self */
const devUtil = (name: string, c: string, text: string, effect?: EffectSpec, onTarget = false): ActSpec => ({
  name: `${name} (Cost: ${c})`, type: "utility", activation: "special", note: note(c, text),
  ...(onTarget ? { targets: TARGET } : {}), effects: effect ? [onTarget ? onT(effect) : effect] : undefined,
});

const reaction = (name: string, when: string, text: string, extra: Partial<ActSpec> = {}): ActSpec =>
  ({ name, type: "utility", activation: "reaction", reactionWhen: when, consumeUse: true, note: text, ...extra });

export const workGSpecs: Record<string, Spec> = {
  // ---- Rogue class: Devious Strike ----
  "class-features/Devious Strike": { activities: [
    devSave("Trip", "1d6", "dex", "If the target is Large or smaller, it must succeed on a Dexterity saving throw or have the Prone condition.", { name: "Prone (Trip)", statuses: ["prone"] }),
    devUtil("Withdraw", "1d6", "Immediately after the attack, you move up to half your speed without provoking Opportunity Attacks."),
  ] },
  "class-features/Duplicitious Strike": { activities: [
    devSave("Daze", "3d6", "con", "On a failure, on its next turn the target can do only one of the following: move, or take an action, or take a Bonus Action.", { name: "Dazed", ...UNTIL_NEXT_TURN_END }),
    devSave("Knock Out", "6d6", "con", "On a failure the target has the Unconscious condition for 1 minute or until it takes any damage. The Unconscious target repeats the save at the end of its turns, ending the effect on itself on a success.", { name: "Knocked Out", statuses: ["unconscious"], seconds: 60 }, { duration: MIN }),
    devSave("Obscure", "3d6", "dex", "On a failure the target has the Blinded condition until the end of its next turn.", { name: "Blinded (Obscure)", statuses: ["blinded"], ...UNTIL_NEXT_TURN_END }),
  ] },

  // ---- Rogue subclasses: Devious Strike options ----
  "class-features/Cutthroat Tactics": { activities: [
    devSave("Poison", "2d6", "con", "The damage type of your Sneak Attack damage dice becomes poison. On a failure the target is poisoned for 1 minute and repeats the save at the end of each of its turns, ending the effect on a success. You must have a poisoner's kit on your person.", { name: "Poisoned (Poison Strike)", statuses: ["poisoned"], seconds: 60 }, { duration: MIN }),
    devUtil("Lock Down", "1d6", "You strike the target in the legs, reducing its movement speed by 15 ft until the end of its next turn.", { name: "Locked Down", changes: [{ key: "system.attributes.movement.walk", mode: 2, value: "-15" }], ...UNTIL_NEXT_TURN_END }, true),
  ] },
  "class-features/Street Rules": { activities: [
    devSave("Sap", "2d6", "con", "On a failure the target's movement speed falls to 0 and it cannot use reactions until the end of its next turn.", { name: "Sapped", changes: [{ key: "system.attributes.movement.walk", mode: 5, value: "0" }], ...UNTIL_NEXT_TURN_END }),
    devSave("Daze", "2d6", "con", "On a failure the target is deafened for 1 minute, repeating the save at the end of each of its turns, ending the effect on a success. While deafened in this way it has disadvantage on saves made to maintain concentration.", { name: "Deafened (Daze)", statuses: ["deafened"], seconds: 60 }, { duration: MIN }),
  ] },
  "class-features/Bully Blitz": { activities: [
    { name: "Drain", type: "utility", activation: "special", targets: TARGET, effects: [onT({ name: "Stunned (Drain)", statuses: ["stunned"], ...UNTIL_NEXT_TURN_END })],
      note: "If the target of Sap fails the save by 5 or more, it is instead stunned until the end of its next turn." },
    { name: "Concuss", type: "utility", activation: "special", targets: TARGET, duration: MIN,
      effects: [onT({ name: "Concussed", seconds: 60, changes: ABIL.map((a) => dis(`system.abilities.${a}.check`)) })],
      note: "If the target of Daze fails the save by 5 or more, it suffers disadvantage on all ability checks in addition to disadvantage on saves to maintain concentration while deafened in this way." },
  ] },
  "class-features/Master Bladework": { activities: [
    devSave("Disarm", "2d6", "str", "On a failed save the target drops a held object of your choice. The object lands at its feet."),
    devSave("Guard Break", "3d6", "dex", "On a failed save you disrupt the target's defenses: until the start of your next turn its AC is reduced by 2.", { name: "Guard Broken", changes: [{ key: "system.attributes.ac.bonus", mode: 2, value: "-2" }], rounds: 1 }),
  ] },
  "class-features/Crafty One": { activities: [
    devUtil("Epiphany", "2d6", "After making this Devious Strike, you can use a Gadgeteer trick you know as a bonus action."),
    devUtil("Subterfuge", "2d6", "When you use a creation for this Devious Strike, you activate it without any somatic or verbal components."),
  ] },
  "class-features/Interrogation Tactics": { activities: [
    devSave("Interrogate", "2d6", "cha", "On a failure the target is unable to speak a deliberate lie for 10 minutes. You know whether it succeeded or failed. To impose this effect without injuring the creature, you can attack it simply to touch it, dealing no damage on a hit.", { name: "Unable to Lie", seconds: 600 }),
    devSave("Terrorize", "3d6", "wis", "On a failure the target becomes frightened by you until the end of its next turn.", { name: "Frightened (Terrorize)", statuses: ["frightened"], ...UNTIL_NEXT_TURN_END }),
  ] },
  "class-features/Circus Tricks": { activities: [
    devUtil("Acrobatics", "2d6", "After making the attack, your jump distance is tripled until the end of your turn."),
    devUtil("Juggling", "2d6", "You take the Use an Object action, or use an item that normally requires an action (such as a Small Medkit), as part of the attack. The creature you chose for Opening Act can also apply any Devious Strike options you know, following the same rules."),
  ] },
  "class-features/Twisted Surgery": { activities: [
    devSave("Bleed", "2d6", "con", "On a failure the target begins bleeding for 1 minute, repeating the save at the end of each of its turns, ending the effect on a success. While bleeding it takes 2d6 necrotic damage at the start of each of its turns. Undead and constructs automatically succeed this saving throw.", { name: "Bleeding", seconds: 60 }, { duration: MIN }),
    { name: "Bleeding: Damage", type: "damage", activation: "special", damage: [["2d6", "necrotic"]], note: "At the start of each of the bleeding target's turns." },
    devUtil("Pierce", "1d6", "You strike through your target's defenses; this attack ignores damage resistances."),
  ] },
  "class-features/Keen Combatant": { activities: [
    devUtil("Scheme", "2d6", "As part of the Devious Strike, you take one of your Cunning Action options."),
    devUtil("Focus", "1d6", "If this attack was made using your Steady Aim feature, you ignore the movement restrictions."),
  ] },
  "class-features/Seek Vulnerability": { activities: [
    devSave("Vex", "3d6", "int", "On a failure the target becomes vexed for 1 minute. While vexed it takes an additional 1d6 damage from weapon attacks. This effect ends early if you use this feature on another creature, or if you choose to end it (no action required).", { name: "Vexed", seconds: 60 }, { duration: MIN }),
    devUtil("Discover", "1d6", "You learn two of the following features of the target: damage resistances, damage immunities, damage vulnerabilities, conditional immunities, current hit points, or armor class."),
  ] },
  "class-features/Slippery Devil": { activities: [
    devUtil("Refuge", "2d6", "After striking, you find yourself in a favorable position. You gain a +2 bonus to your AC until the start of your next turn.", { name: "Refuge", changes: [{ key: "system.attributes.ac.bonus", mode: 2, value: "2" }], rounds: 1 }),
    devSave("Taunt", "2d6", "wis", "On a failure the target suffers disadvantage on attack rolls against creatures other than you until the start of your next turn.", { name: "Taunted", rounds: 1 }),
  ] },
  "class-features/Out Of Sight": { activities: [
    devUtil("Under Cover", "2d6", "If you are hidden, this attack doesn't reveal your position if you end the turn behind cover."),
    devUtil("Diversion", "1d6", "Until the end of your next turn, the next attack roll against the target is made with advantage."),
  ] },
  "class-features/Willy-Nilly": { activities: [
    { name: "Volatile (Cost: 1d6)", type: "utility", activation: "special", roll: { formula: "1d6", name: "Volatile damage type (1 Acid, 2 Cold, 3 Fire, 4 Lightning, 5 Poison, 6 Thunder)" },
      note: note("1d6", "Your attack is infused with a dangerous element. Roll 1d6: the result is the damage type of your Sneak Attack (1 Acid, 2 Cold, 3 Fire, 4 Lightning, 5 Poison, 6 Thunder).") },
    devUtil("Quick Draw", "1d6", "As part of the attack you can use your Risky Gambit feature. You can still only activate Risky Gambit once per turn."),
  ] },

  // ---- Rogue subclasses: other features ----
  "class-features/Deadly Strike": { activities: [
    { name: "Deadly Strike (Constitution Save)", type: "save", activation: "special", targets: TARGET, save: { ability: "con", dc: DEV_DC, onSave: "none" },
      note: "When you hit a creature with an attack and score a critical hit, it must make this saving throw (DC 8 + your Dexterity modifier + your proficiency bonus). On a failed save, double the damage of your attack against the creature." },
  ] },
  "class-features/Master Director": { activities: [
    reaction("Halve Damage", "A creature that can hear you within 60 ft is hit by an attack", "Halve the damage of the attack against them.", { range: 60 }),
    reaction("Reroll Save at Advantage", "A creature that can hear you within 60 ft fails a saving throw", "They reroll the saving throw at advantage.", { range: 60 }),
    reaction("Add Charisma to Check", "A creature that can hear you within 60 ft fails an ability check", "Add your Charisma modifier to the result.", { range: 60, roll: { formula: "@abilities.cha.mod", name: "Charisma modifier" } }),
  ] },
  "class-features/Denouement": { activities: [
    { name: "Temporary Hit Points", type: "heal", activation: "special", consumeUse: true, targets: { count: 1, type: "creature" }, healing: { formula: "@details.level", type: "temp" },
      note: "You, or the Opening Act ally, reduce a creature to 0 hit points or land a critical hit: the creature that made the attack gains temporary hit points equal to your level." },
    { name: "Bonus Damage on Next Attack", type: "damage", activation: "special", consumeUse: true, damage: [["@details.level", []]],
      note: "The creature's next attack deals additional damage equal to your level (reduced a creature to 0 hit points or landed a critical hit)." },
    { name: "Free Movement", type: "utility", activation: "special", consumeUse: true,
      note: "The creature can move 30 ft in a direction of their choice without provoking opportunity attacks (reduced a creature to 0 hit points or landed a critical hit)." },
  ] },
  "class-features/Patchwork": { activities: [
    { name: "Heal", type: "heal", activation: "bonus", consumeUse: true, consumeAmount: "max(1, @abilities.wis.mod)", range: 5, rangeUnits: "touch", targets: { count: 1, type: "creature" },
      healing: { formula: "(max(1, @abilities.wis.mod))d8 + @abilities.wis.mod", type: "healing" },
      note: "Using your Cunning Action, touch a creature and spend a number of dice from the pool equal to your Wisdom modifier (minimum of one). The target regains hit points equal to the total of those dice + your Wisdom modifier." },
    { name: "Remove Disease or Poison", type: "utility", activation: "bonus", consumeUse: true, range: 5, rangeUnits: "touch", targets: { count: 1, type: "creature" },
      note: "Expend one die from the pool to remove one disease or poison from a creature." },
  ] },
  "class-features/Miracle Worker": { activities: [
    { name: "Life-Saving Surgery", type: "utility", activation: "minute", range: 5, rangeUnits: "touch", targets: { count: 1, type: "creature" },
      note: "A creature that died within the last hour. Requires medicine and anesthetics worth at least 1 000 000 beri (100gp), or free if the death occurred within 10 minutes. Concentrate for 1 minute as on a creation. On success the creature returns to life with 1 hit point and is cured of poisons and diseases." },
  ] },
  "class-features/Elegant Maneuver": {
    activities: [],
    extraEffects: [{ name: "Elegant Maneuver", transfer: true, changes: [adv("system.skills.acr"), adv("system.skills.ath")] }],
  },
  "class-features/Agile Reflexes": { activities: [
    { name: "Read the Attacker", type: "utility", activation: "special", reactionWhen: "A creature hits you with an attack",
      effects: [{ name: "Agile Reflexes", changes: [{ key: "system.attributes.ac.bonus", mode: 2, value: "@abilities.wis.mod" }], rounds: 1 }],
      note: "When a creature hits you with an attack, you gain a bonus to AC equal to your Wisdom modifier against all subsequent attacks made by that creature for the rest of the turn. Remove the effect at the end of the turn." },
  ] },
  "class-features/Martial Metre": { activities: [
    { name: "Resist Prone or Grappled", type: "save", activation: "special", targets: { count: 1, type: "self" }, save: { ability: "dex", dc: "15", onSave: "none" },
      note: "Whenever you are knocked prone or grappled, make a Dexterity saving throw (DC 15) to avoid being knocked prone or grappled on a success. Your second reaction (Uncanny Dodge only, regained at the start of each of your turns) is not tracked." },
  ] },
  "class-features/Weapon Weave": {
    activities: [],
    extraEffects: [{ name: "Weapon Weave", transfer: true, changes: [{ key: "system.bonuses.mwak.attack", mode: 2, value: "+@prof" }] }],
  },

  // ---- Fighter: class resources the maneuver / ammo / trick-shot activities spend ----
  "class-features/Superior Combatant": {
    uses: { max: "@scale.battlemaster.superiority-dice", per: "sr" },
    activities: [{ name: "Expend Superiority Die", type: "utility", activation: "special", consumeUse: true, roll: { formula: "@scale.battlemaster.superiority-die", name: "Superiority die" },
      note: "Expend one superiority die (you have four d8s, a fifth at 7th level and a sixth at 15th; d10s at 10th level, d12s at 18th). Regain all expended dice on a short or long rest." }],
  },
  "class-features/Relentless Combatant": {
    uses: { max: "1", per: "lr" },
    activities: [{ name: "Regain Superiority Dice", type: "utility", activation: "bonus", consumeUse: true, note: "Regain all your expended Superiority Dice. Reset the Superior Combatant uses by hand." }],
  },
  "class-features/Advanced Arsenal": {
    uses: { max: "1 + @abilities.int.mod", per: "sr" },
    activities: [{ name: "Expend Use", type: "utility", activation: "special", consumeUse: true,
      note: "Once per turn when you fire a piece of ammo from a ranged weapon as part of the Attack action, apply one of your Advanced Arsenal options. Advanced Arsenal save DC = 8 + your proficiency bonus + your Intelligence modifier." }],
  },
  "class-features/Trick Shots": {
    uses: { max: "1 + @abilities.wis.mod", per: "sr" },
    activities: [{ name: "Expend Grit", type: "utility", activation: "special", consumeUse: true,
      note: "Expend one grit point; declare the trick shot before the attack roll. Regain 1 grit when you roll a 20 on a firearm attack or deal a killing blow with a firearm to a creature of significant threat (DM's discretion); all grit after a short or long rest." }],
  },
};
