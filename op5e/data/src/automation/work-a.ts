import type { ActSpec, EffectSpec, Spec } from "../../helpers/spec.js";

// Task A: Multipod Ambidextrous, Blade Master hews, Storm Herald storm choices, Black Blade / White Weapon, dial weapons and dials.
// Mutually exclusive choices use flags.op5e.effectGroup (scripts/effect-groups.mjs removes the other effects of the group).
const CON_DC = "8 + @prof + @abilities.con.mod";
const LVL = "@classes.barbarian.levels";
const group = (g: string) => ({ op5e: { effectGroup: g } });
const dr = (...types: string[]) => types.map((t) => ({ key: "system.traits.dr.value", mode: 2, value: t }));

// ---- Fishman Multipod: Two Weapon Fighting style benefit for the extra arms
const ambidextrous: Spec = {
  activities: [
    { name: "Off-Hand Damage Modifier", type: "damage", activation: "bonus", damage: [["max(@abilities.str.mod, @abilities.dex.mod)", []]],
      note: "Two weapon fighting: add your damage modifier to the damage of the off-hand (bonus action) attack. You can still attack only once with your bonus action, cannot dual wield two-handed weapons and do not benefit from multiple shields." },
  ],
};

// ---- Blade Master hews (once per turn when you hit with a weapon attack; the book gives no "known" count, all four are available)
const HEW = "Once per turn, when you hit with a weapon attack (Masterful Hew). ";
const cleave = (name: string, radius: number, raging: boolean, note: string): ActSpec => ({
  name, type: "damage", activation: "special", area: { type: "radius", size: radius }, targets: { type: "creature" },
  damage: [[raging ? "@abilities.str.mod + @prof" : "@abilities.str.mod", []]], note: HEW + note });
const hewSpecs: Record<string, Spec> = {
  "class-features/Cleaving Hew": { activities: [
    cleave("Cleave", 5, false, "Each other creature within 5 feet of the target (other than you) takes damage equal to your Strength modifier, of the same type as the weapon."),
    cleave("Cleave (Raging)", 5, true, "While raging add your rage damage bonus to this damage."),
    cleave("Cleave (Raging, 10th level)", 10, true, "At 10th level, while raging, the cleave reaches each creature within 10 feet, other than you."),
  ] },
  "class-features/Crushing Hew": { activities: [
    { name: "Grapple or Shove", type: "utility", activation: "special", note: HEW + "Make a grapple or shove attack against the target as part of the same attack. While raging you count as one size larger for it." },
    { name: "Crushing Damage (Raging, 10th level)", type: "damage", activation: "special", damage: [["@prof", []]], note: "At 10th level, while raging, when you successfully grapple or shove a creature with this hew you deal your rage damage bonus to it." },
  ] },
  "class-features/Savage Hew": { activities: [
    { name: "Savage Hew", type: "utility", activation: "special", note: HEW + "Roll damage for the attack twice and choose the higher number." },
    { name: "Raging Bonus", type: "damage", activation: "special", damage: [["@prof", []]], note: "While raging you double your rage damage bonus on this attack: this is the extra copy." },
    { name: "Raging Bonus (10th level)", type: "damage", activation: "special", damage: [["floor(@details.level / 2)", []]], note: "At 10th level, while raging, you gain a bonus to the damage roll equal to half your level (rounded down)." },
  ] },
  "class-features/Sprinting Hew": { activities: [
    { name: "Sprinting Hew", type: "utility", activation: "special", note: HEW + "Move up to half your speed before or after the attack (up to your full speed at 10th level while raging). While raging this movement does not provoke opportunity attacks." },
  ] },
};

// ---- Storm Herald: after each long rest choose one storm; each choice is one effect of a group so a new choice replaces the old
const storm = (g: string, label: string, opt: string, changes: EffectSpec["changes"] = []): EffectSpec => ({ name: `${label}: ${opt}`, changes, flags: group(g) });
const choose = (g: string, label: string, opt: string, changes: EffectSpec["changes"] = []): ActSpec => ({
  name: `Choose ${opt} (after a long rest)`, type: "utility", activation: "special", effects: [storm(g, label, opt, changes)],
  note: `Whenever you finish a long rest you choose firestorm, thunderstorm, or blizzard. This marks ${opt} as your ${label}; choosing another storm replaces it.` });
const DICE = `(1 + min(1, floor(${LVL} / 5)) + min(1, floor(${LVL} / 11)) + min(1, floor(${LVL} / 17)))`;
const stormSpecs: Record<string, Spec> = {
  "class-features/Raging Storm": { activities: [{ name: "Raging Storm Aura", type: "utility", activation: "bonus", area: { type: "radius", size: 10 },
    note: "While raging, your 10-foot aura (not through total cover) has the effect of the storm you chose: use that storm's feature (Raging Storm: Firestorm / Thunderstorm / Snowstorm). It activates when you enter your rage and again on each of your turns as a bonus action. Save DC = 8 + proficiency bonus + Constitution modifier." }] },
  "class-features/Raging Storm: Firestorm": { activities: [
    choose("storm-raging", "Raging Storm", "Firestorm"),
    { name: "Firestorm Aura", type: "damage", activation: "bonus", area: { type: "radius", size: 10 }, targets: { type: "enemy" }, damage: [[`${DICE}d6`, "fire"]], note: "All creatures in your aura other than you take this damage. Activates when you enter your rage and again as a bonus action each turn." }] },
  "class-features/Raging Storm: Thunderstorm": { activities: [
    choose("storm-raging", "Raging Storm", "Thunderstorm"),
    { name: "Thunderstorm Aura", type: "save", activation: "bonus", range: 10, targets: { count: 1, type: "creature" }, save: { ability: "dex", dc: CON_DC, onSave: "half" }, damage: [[`${DICE}d12`, ["lightning", "thunder"]]], note: "Choose one other creature you can see in your aura; lightning or thunder (your choice)." }] },
  "class-features/Raging Storm: Snowstorm": { activities: [
    choose("storm-raging", "Raging Storm", "Snowstorm"),
    { name: "Snowstorm Aura", type: "heal", activation: "bonus", area: { type: "radius", size: 10 }, healing: { formula: `${DICE}d6`, type: "temp" }, note: "You and each other creature of your choice in your aura gain icy-armor temporary hit points." }] },
  "class-features/Stormy Soul: Firestorm": { activities: [
    choose("storm-soul", "Stormy Soul", "Firestorm", dr("fire")),
    { name: "Ignite Object", type: "utility", activation: "action", note: "Touch a flammable object that isn't being worn or carried by anyone else and set it on fire. You also don't suffer the effects of extreme heat." }] },
  "class-features/Stormy Soul: Thunderstorm": { activities: [
    choose("storm-soul", "Stormy Soul", "Thunderstorm", dr("lightning", "thunder")),
    { name: "Summon Weather", type: "utility", activation: "action", area: { type: "radius", size: 10 }, note: "Summon wind, rainfall and the faint sounds of thunder in the distance within a 10-foot radius of you; the rainwater vanishes 1 minute after you leave the area." }] },
  "class-features/Stormy Soul: Snowstorm": { activities: [
    choose("storm-soul", "Stormy Soul", "Snowstorm", dr("cold")),
    { name: "Shape Ice", type: "utility", activation: "action", area: { type: "cube", size: 5 }, note: "Freeze and shape water in a 5-foot cube into ice sculptures, which melt after 1 minute. Fails if a creature is in the cube. You also don't suffer the effects of extreme cold." }] },
  "class-features/Fury of the Storm: Firestorm": { activities: [
    choose("storm-fury", "Fury of the Storm", "Firestorm"),
    { name: "Fury (Dexterity Save)", type: "save", activation: "reaction", reactionWhen: "A creature in your aura hits you with an attack", targets: { count: 1, type: "creature" }, save: { ability: "dex", dc: CON_DC, onSave: "half" }, damage: [[LVL, "fire"]], note: "Fire damage equal to your barbarian level on a failed save, half on a success." }] },
  "class-features/Fury of the Storm: Thunderstorm": { activities: [
    choose("storm-fury", "Fury of the Storm", "Thunderstorm"),
    { name: "Fury (Strength Save)", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "str", dc: CON_DC, onSave: "half" }, damage: [[`floor(${LVL} / 2)`, ["lightning", "thunder"]]],
      effects: [{ name: "Knocked Prone by Fury of the Storm", statuses: ["prone"], onTargets: true, seconds: 6 }], note: "Once per turn, when you hit a creature in your aura. On a failed save it takes lightning or thunder damage equal to half your barbarian level and is knocked prone; on a success half damage and not prone." }] },
  "class-features/Fury of the Storm: Snowstorm": { activities: [
    choose("storm-fury", "Fury of the Storm", "Snowstorm"),
    { name: "Fury (Constitution Save)", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", dc: CON_DC, onSave: "half" }, damage: [[`floor(${LVL} / 2)`, "cold"]],
      effects: [{ name: "Numbing Frost", onTargets: true, rounds: 1, changes: [{ key: "system.attributes.movement.walk", mode: 5, value: "0" }] }], note: "Whenever your Raging Storm aura is activated, choose one creature you can see in it. On a failed save it takes cold damage equal to half your barbarian level and its speed is 0 until the start of your next turn; on a success half damage and speed unchanged." }] },
};

// ---- Black Blade / White Weapon (items/special-gear.ts supplies the Longsword chassis)
const gear: Record<string, Spec> = {
  "items/Black Blade": { activities: [
    { name: "Attack", type: "attack", activation: "action", attack: { type: "melee" }, includeBase: true, damage: [["2", []]],
      note: "Black Blades deal +2 damage by default. They are not haki-imbued, so they do not bypass resistances and immunities. Virtually indestructible. The Longsword is only the default shape: a Black Blade can be any melee weapon." }] },
  "items/White Weapon (Non-Canon)": { activities: [
    { name: "Attack", type: "attack", activation: "action", attack: { type: "melee", bonus: "2" }, includeBase: true, damage: [],
      note: "White Weapons permanently have a +2 bonus to attack rolls. The Longsword is only the default shape: a White Weapon can be any weapon." }] },
  "items/Heat Javelin": { activities: [
    { name: "Attack", type: "attack", activation: "action", attack: { type: "melee" }, includeBase: true, damage: [], note: "A +1 lance enhanced with a heat dial." },
    { name: "Attack (Heated)", type: "attack", activation: "action", attack: { type: "melee" }, includeBase: true, damage: [["2d6", "fire"]], note: "After using a bonus action to heat the weapon up (turn it off as a bonus action), it deals an extra 2d6 fire damage." },
    { name: "Heat Up / Cool Down", type: "utility", activation: "bonus", note: "Toggle the heat on or off." }] },
  "items/Flash Gun": { activities: [
    { name: "Attack", type: "attack", activation: "action", attack: { type: "ranged" }, includeBase: true, damage: [], note: "A +1 gun. Once per turn it fires its first bullet with advantage against an enemy that sees the flash. An enemy that can see without eyes is unaffected." }] },
  "items/Eisen Whip": { activities: [
    { name: "Attack", type: "attack", activation: "action", attack: { type: "melee" }, includeBase: true, damage: [], note: "A +1 weapon; attacks have a range of 60 feet despite being melee and can travel around corners. Used as rope or barbed wire it can bind people." },
    { name: "Reshape", type: "utility", activation: "bonus", note: "Change the weapon into any pre-existing melee weapon (or any shape in general)." },
    { name: "Shield (Creation)", type: "utility", activation: "action", consumeUse: true, note: "Cast the Shield creation using Wisdom, Intelligence, or Charisma. 3 uses, regained after a long rest." }] },
  // Dials that attach to weapons: only one "+1" weapon bonus applies (the book: it doesn't stack with already +1 weapons)
  "items/Heat Dial": { activities: [
    { name: "Attach to Weapon", type: "utility", activation: "action", effects: [{ name: "Heat Dial Attached", flags: group("weapon-plus-one"), changes: ["mwak", "rwak"].flatMap((k) => [{ key: `system.bonuses.${k}.attack`, mode: 2, value: "+1" }, { key: `system.bonuses.${k}.damage`, mode: 2, value: "+1" }]) }],
      note: "Attached to a weapon, the weapon deals fire damage instead of its normal damage and becomes a +1 mastercraft weapon. This doesn't stack with already +1 weapons. Change the weapon's damage type to fire by hand." }] },
  "items/Jet Dial": { activities: [
    { name: "Attach to Weapon", type: "utility", activation: "action", effects: [{ name: "Jet Dial Attached", flags: group("weapon-plus-one"), changes: ["mwak", "rwak"].flatMap((k) => [{ key: `system.bonuses.${k}.attack`, mode: 2, value: "+1" }, { key: `system.bonuses.${k}.damage`, mode: 2, value: "+1" }]) }],
      note: "Placed on a weapon or used as part of an unarmed strike, the Jet Dial makes it a +1 weapon and raises its damage dice size by 1 (d6 becomes d8, and so on): raise the die by hand." },
    { name: "Gust of Wind", type: "utility", activation: "action", consumeUse: true, note: "Cast the Gust of Wind creation using Wisdom, Intelligence, or Charisma. 3 charges, regained at the end of a long rest." }] },
};

export const workASpecs: Record<string, Spec> = {
  "racial-features/Ambidextrous": ambidextrous,
  ...hewSpecs,
  ...stormSpecs,
  ...gear,
};
