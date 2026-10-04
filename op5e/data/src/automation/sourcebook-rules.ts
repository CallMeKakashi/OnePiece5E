import type { Spec, EffectSpec } from "../../helpers/spec.js";

// Automation for the Chapter 6 devil-fruit rules, Haki rules, optional rules and Boons in data/src/feats/sourcebook-rules.ts.
// Where dnd5e cannot express a rule (size +1 category, reach, level-scaled duration, per-type tables) the activity note keeps the book wording.
const ABIL = ["str", "dex", "con", "int", "wis", "cha"];
const HIGHEST = "max(@abilities.str.mod, @abilities.dex.mod, @abilities.con.mod, @abilities.int.mod, @abilities.wis.mod, @abilities.cha.mod)";
const ATK_DMG = ["mwak", "rwak", "msak", "rsak"];
const dmgBonus = (v: string) => ATK_DMG.map((k) => ({ key: `system.bonuses.${k}.damage`, mode: 2, value: v }));
const rollMode = (path: string, v: string) => ({ key: `${path}.roll.mode`, mode: v === "-1" ? 3 : 4, value: v });
const DFU = "devil-fruit-uses";   // the Devil Fruit Uses feat: Zoan/Logia forms spend its uses, not their own
const LEVEL_DURATION = { op5e: { levelDuration: true } };   // scripts/compendium.mjs sets the effect length from the actor level when applied
const DURATION_NOTE = "Duration: 10 minutes (1 hour at 5th level, 8 hours at 10th, 24 hours at 15th, unlimited at 20th); the effect length follows your level automatically.";

const hybrid = (mult: number, who: string): Spec["activities"][number] => ({
  name: `Hybrid Form (${who})`, type: "heal", activation: "bonus", consumeUse: true, consumeTarget: DFU, duration: { value: 10, units: "minute" },
  healing: { formula: `${mult} * @details.level`, type: "temp" },
  effects: [{ name: "Zoan Hybrid Form", seconds: 600, flags: LEVEL_DURATION, changes: dmgBonus("+@prof") }],
  note: `${DURATION_NOTE} Temporary hit points equal to your level x${mult} (${who}). All your attacks deal extra damage equal to your proficiency bonus. Your choice of Strength, Dexterity or Constitution increases by 1 when you eat the fruit. Other beast features (natural weapons, senses, extra limbs, movement) are chosen by the player.`,
});
const fullBeast = (who: string, mult: number): Spec["activities"][number] => ({
  name: `Full Beast Form (${who})`, type: "transform", activation: "bonus", consumeUse: true, consumeTarget: DFU, duration: { value: 10, units: "minute" },
  transform: { hpMultiplier: mult },
  note: `${DURATION_NOTE} Pick your beast actor when prompted, or drag it onto this activity's profiles in the item sheet. Your statistics become the beast's stat block (you keep alignment, personality, Int, Wis and Cha, your proficiency bonus, and you merge skill and saving throw proficiencies). Hit points: (${mult} x your level) + the beast's Constitution modifier (${who}), and you return to your prior hit points when it ends (use Revert Original Form on the sheet).`,
});

const knee: EffectSpec["changes"] = [
  { key: "flags.midi-qol.disadvantage.ability.check.str", mode: 0, value: "1" },
  { key: "flags.midi-qol.disadvantage.ability.check.dex", mode: 0, value: "1" },
  rollMode("system.abilities.str.check", "-1"), rollMode("system.abilities.dex.check", "-1"),
];
const waist: EffectSpec["changes"] = [
  { key: "system.attributes.movement.walk", mode: 1, value: "0.5" },
  { key: "flags.midi-qol.disadvantage.attack.all", mode: 0, value: "1" },
  { key: "flags.midi-qol.disadvantage.ability.check.all", mode: 0, value: "1" },
  { key: "flags.midi-qol.disadvantage.ability.save.all", mode: 0, value: "1" },
  ...ABIL.flatMap((a) => [rollMode(`system.abilities.${a}.check`, "-1"), rollMode(`system.abilities.${a}.save`, "-1")]),
];
const BPS = ["bludgeoning", "piercing", "slashing"];

export const sourcebookRuleSpecs: Record<string, Spec> = {
  "feats/Devil Fruit Uses": {
    // Zoan/Logia: 1 use at 1st, +1 at every odd level (1,2,3,4,5,5,6,7,8,9,10,10 at 1,3,5,7,9,10,11,13,15,17,19,20). Paramecia add +1 (Paramecia Improved Usage).
    uses: { max: "floor((@details.level + 1) / 2)", per: "lr" },
    activities: [{ name: "Use Devil Fruit Ability", type: "utility", activation: "special", consumeUse: true, note: "Spend a use for a major devil fruit ability (passive immunities and basic fruit-boosted punches cost nothing). Zoans use a bonus action for hybrid form; untrained Logias can use a reaction to become intangible. Regain all uses on a long rest. Paramecia have one additional use (Paramecia Improved Usage)." }],
  },
  "feats/Devil Fruit Ability Check, Fruit-Fruit DC and Attack": {
    activities: [
      { name: "Devil Fruit Ability Check", type: "utility", activation: "special", roll: { formula: `1d20 + ${HIGHEST} + @prof`, name: "Devil Fruit Ability Check" },
        note: "Use instead of a skill (for example instead of Athletics to lift a boulder) at no use cost; you may add expertise to your devil fruit skill." },
      { name: "Fruit-Fruit DC", type: "save", activation: "special", targets: { type: "creature" }, save: { ability: ABIL, dc: `8 + ${HIGHEST} + @prof`, onSave: "none" }, note: "DC = 8 + highest ability modifier + proficiency bonus. Pick the save the fruit ability calls for." },
      { name: "Devil Fruit Attack (melee)", type: "attack", activation: "special", range: 5, attack: { type: "melee", bonus: `${HIGHEST} + @prof`, flat: true }, note: "1d20 + highest ability modifier + proficiency bonus." },
      { name: "Devil Fruit Attack (ranged)", type: "attack", activation: "special", attack: { type: "ranged", bonus: `${HIGHEST} + @prof`, flat: true }, note: "1d20 + highest ability modifier + proficiency bonus." },
    ],
  },
  "feats/Ocean's Scorn": {
    activities: [
      { name: "Seastone Weapon Hit (knee-deep)", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", dc: "20", onSave: "none" },
        effects: [{ name: "Seastone: Knee-Deep Weakness", onTargets: true, rounds: 2, changes: knee }], note: "Seastone-tipped weapon hit. On a failure the target suffers the knee-deep weaknesses (it cannot activate devil fruit abilities) until the end of its next turn, or until contact is broken if the source is stuck to it." },
      { name: "Large Seastone (waist-deep)", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", dc: "20", onSave: "none" },
        effects: [{ name: "Seastone: Waist-Deep Weakness", onTargets: true, rounds: 2, changes: [...knee, ...waist] }], note: "Large quantities of seastone, such as solid seastone handcuffs, grant the waist-deep weakness." },
    ],
    extraEffects: [
      { name: "Ocean's Scorn: No Swimming", transfer: true, changes: [{ key: "system.attributes.movement.swim", mode: 5, value: "0" }] },
      { name: "Ocean's Scorn: Knee-Deep in Water", transfer: true, disabled: true, changes: knee },
      { name: "Ocean's Scorn: Waist-Deep in Water", transfer: true, disabled: true, changes: [...knee, ...waist] },
      { name: "Ocean's Scorn: Submerged", transfer: true, disabled: true, statuses: ["paralyzed"], changes: [...knee, ...waist] },
    ],
  },
  "feats/Devil Fruit Awakening": {
    activities: [
      { name: "Awakened Transformation (Zoan)", type: "utility", activation: "action", duration: { value: 10, units: "minute" },
        effects: [{ name: "Awakened Transformation", seconds: 600, changes: [
          { key: "system.abilities.str.value", mode: 4, value: "18" }, { key: "system.abilities.dex.value", mode: 4, value: "18" }, { key: "system.abilities.con.value", mode: 4, value: "18" }] }],
        note: "Increase your size by 2 categories, reach +10 ft, and the damage dice of your weapons double; at the start of each of your turns you regain hit points equal to twice your Constitution modifier (minimum 2); if knocked unconscious you can keep moving and attacking but still make death saves; your temporary hit points double; Strength, Dexterity and Constitution become 18 if not already higher; afterwards you return to normal with 1 level of exhaustion." },
      { name: "Approaching Awakening", type: "utility", activation: "special", roll: { formula: "1d100", name: "Approaching Awakening (equal to or lower than your level succeeds)" },
        note: "From level 10, describe an action then roll a percentile; if the roll is equal to or lower than your level you gain your awakened fruit effects without spending a use and gain 1 level of exhaustion. Once until next dawn; retry after a long rest on failure." },
    ],
  },
  "feats/Zoan Hybrid Form": {
    activities: [hybrid(2, "regular or carnivorous zoan"), hybrid(3, "ancient zoan"), hybrid(4, "mythical zoan")],
  },
  "feats/Zoan Full Beast Form": {
    activities: [fullBeast("regular or carnivorous zoan", 5), fullBeast("ancient zoan", 6), fullBeast("mythical zoan", 7)],
  },
  "racial-features/Inner Beast": {
    uses: { max: "1", per: "lr" },
    activities: [
      { name: "Inner Beast", type: "utility", activation: "bonus", consumeUse: true, duration: { value: 1, units: "minute" },
        effects: [{ name: "Inner Beast", seconds: 60, changes: [rollMode("system.abilities.str.check", "1"), rollMode("system.abilities.dex.check", "1"), { key: "system.attributes.movement.walk", mode: 2, value: "10" }] }],
        note: "Advantage on Strength and Dexterity ability checks and +10 speed for 1 minute; your Electro deals extra lightning damage equal to your level while it lasts. Use this one when the full moon is not visible." },
      { name: "Inner Beast (Sulong, full moon)", type: "utility", activation: "bonus", consumeUse: true, duration: { value: 1, units: "minute" },
        effects: [{ name: "Sulong", seconds: 60, flags: { op5e: { exhaustOnEnd: true } }, changes: [rollMode("system.abilities.str.check", "1"), rollMode("system.abilities.dex.check", "1"), { key: "system.attributes.movement.walk", mode: 2, value: "10" }, { key: "system.abilities.str.value", mode: 2, value: "4" }, { key: "system.abilities.dex.value", mode: 2, value: "4" }] }],
        note: "Only when the full moon is visible: as Inner Beast, and your Strength and Dexterity increase by 4 (this can exceed 20 but not 30). When Sulong ends you suffer one level of exhaustion (added automatically when the effect ends)." },
    ],
  },
  "feats/Zoan Enhanced Form": {
    uses: { max: "1", per: "lr" },
    activities: [{ name: "Enhanced Form", type: "utility", activation: "bonus", consumeUse: true, consumeTarget: DFU, duration: { value: 1, units: "hour" },
      effects: [{ name: "Zoan Enhanced Form", seconds: 3600, flags: { op5e: { sizeUp: true } }, changes: dmgBonus("+1d8") }],
      note: "Spend a devil fruit use to access an Enhanced Form of your Hybrid Form or Full Beast Form: increase your size by 1 category (dimensions double, weight x8), attack reach +5 ft, and your attacks deal an extra 1d8 damage. Lasts 1 hour; regained at the end of a long rest. Your size goes up one category automatically; add the +5 ft reach by hand." }],
  },
  "feats/Zoan Endless Forms": {
    activities: [{ name: "Partial Beast Form", type: "utility", activation: "special", note: "Alter your appearance to partially take your beast form (only an arm into a hoof, or only the nose to enhance perception checks). Base Zoan forms no longer cost a fruit use; Enhanced Form is unlimited per day but still costs a devil fruit use." }],
  },
  "feats/Logia Elemental Domain": {
    uses: { max: "2", per: "lr" },
    activities: [
      { name: "Produce Element", type: "utility", activation: "action", note: "Produce a near-infinite amount of your element and manipulate it as part of the same action." },
      { name: "Elemental Body", type: "utility", activation: "bonus", consumeUse: true, consumeTarget: DFU, duration: { value: 1, units: "minute" },
        effects: [{ name: "Elemental Body", seconds: 60, changes: BPS.map((t) => ({ key: "system.traits.dr.value", mode: 2, value: t })) }],
        note: "Transform your body into a limitless form of your element: resistance to unimbued bludgeoning, piercing and slashing damage plus element-specific benefits (overcome by your element's weakness). Twice per long rest. Example, Rumble-Rumble: immunity to lightning damage; cannot be grappled or restrained unless the source has armament haki or is an insulator; advantage on Dexterity checks and saving throws." },
      { name: "Elemental Attack (2d8)", type: "damage", activation: "action", damage: [["(2 + floor((@details.level + 1) / 6))d8", ""]], note: "2d8 or 2d10 at 1st level, +1 die at 5th, 11th and 17th level. Damage type is your element's." },
      { name: "Elemental Attack (2d10)", type: "damage", activation: "action", damage: [["(2 + floor((@details.level + 1) / 6))d10", ""]], note: "2d8 or 2d10 at 1st level, +1 die at 5th, 11th and 17th level. Damage type is your element's." },
      { name: "Potent Use of Fruit", type: "utility", activation: "special", note: "You can spend a fruit use to make more potent use of your fruit. Lasting effects of your fruit last 1 minute." },
    ],
  },
  "feats/Logia Improved Elemental Domain": {
    activities: [
      { name: "Elemental Resistance (15th)", type: "utility", activation: "reaction", reactionWhen: "You take imbued damage", note: "15th level: expend a fruit use to gain resistance to one source of imbued damage." },
      { name: "Elemental Immunity (20th)", type: "utility", activation: "reaction", reactionWhen: "You take imbued damage", note: "20th level: use the 15th-level reaction without expending a use, and gain immunity to one source of imbued damage instead." },
    ],
    extraEffects: [{ name: "Passive Unimbued Immunity (10th)", transfer: true, disabled: true, changes: BPS.map((t) => ({ key: "system.traits.di.value", mode: 2, value: t })) }],
  },
  "feats/Paramecia Improved Usage": {
    uses: { max: "1", per: "lr" },
    activities: [{ name: "Extra Paramecia Fruit Use", type: "utility", activation: "special", consumeUse: true, note: "Paramecias gain an extra fruit use by default. Improved Usage (5th, 10th, 15th, 20th level) typically yields additional abilities (two drawings active at once, later three); fill the table by Ability Crafting." }],
  },
  "feats/Haki Learning and Affinity": {
    activities: [
      { name: "Learn Haki", type: "utility", activation: "special", note: "Haki is generally discovered at 8th level. You learn only one type first and it dictates your haki proficiency. Every two levels after, you may learn an additional step in a chosen type of haki, perhaps two after extremely intense and lifespan-taxing battles." },
      { name: "Haki Affinity", type: "utility", activation: "special", note: "Armament and Observation with affinity use your full proficiency bonus instead of half (rounded up). Affinity in Conqueror's unlocks Conqueror's Haki Master. Armament Haki overcomes only unimbued damage resistances and immunities, so it does not go through Barbarian resistances." },
    ],
  },
  "feats/Permanent Haki-Imbuement": {
    activities: [{ name: "Permanent Imbuement", type: "utility", activation: "special", note: "Permanently infuse your haki into a single weapon, creating a Black Blade (Armament) or a White Weapon (Observation)." }],
  },
  "feats/Higher Power Play (Unarmed Strike Cap)": {
    activities: [{ name: "Raise Unarmed Die Cap", type: "utility", activation: "special", note: "Unarmed strike damage die can be raised by 1 size, capped at 1d12; extend the cap so it can reach 2d8: 1d12 => 1d14 => 2d8." }],
  },

  "feats/Boon of Super Sonic Speed": {
    activities: [{ name: "Sprint Teleport", type: "utility", activation: "special", note: "When you use the Sprint feature of your Long Leg race, you may instead teleport the distance rather than run." }],
    extraEffects: [{ name: "Super Sonic Speed", transfer: true, changes: [{ key: "system.attributes.movement.walk", mode: 2, value: "30" }] }],
  },
  "feats/Boon of Enhanced Size": {
    activities: [{ name: "Reduce Damage", type: "utility", activation: "reaction", reactionWhen: "You take damage", roll: { formula: "1d12 + @abilities.con.mod + @details.level", name: "Damage reduction" }, note: "Reduce the damage by 1d12 + Constitution modifier + level." }],
    extraEffects: [{ name: "Enhanced Size (Large)", transfer: true, changes: [{ key: "system.traits.size", mode: 5, value: "lg" }] }],
  },
  "feats/Boon of the Tale Weaver": {
    activities: [{ name: "Cutting Words (free)", type: "utility", activation: "reaction", note: "When you use Cutting Words you do not need to expend a use of Bardic Inspiration. You also gain two additional 1st-level, two 2nd-level and one 3rd-level creation slot (add them to your creation slots by hand)." }],
  },
  "feats/Boon of One Thousand Blows": {
    activities: [{ name: "Opportunity Unarmed Strike", type: "attack", activation: "reaction", reactionWhen: "You are targeted by an attack", range: 5, attack: { type: "melee", ability: "str" }, damage: [["1d4 + @abilities.str.mod", "bludgeoning"]], note: "Make an opportunity attack with an unarmed strike (use your own unarmed strike damage). Flurry of Blows no longer costs Spirit Points." }],
  },
  "feats/Boon of the Tactician": {
    uses: { max: "@prof", per: null },
    activities: [{ name: "Superiority Die", type: "utility", activation: "special", consumeUse: true, roll: { formula: "1d8", name: "Superiority die" }, note: "Superiority dice equal to your proficiency bonus (d8s, added to any you have); learn maneuvers equal to half your proficiency bonus. You gain all the Fighter Fighting Styles." }],
  },
  "feats/Boon of Ultimate Armor": {
    activities: [{ name: "Mechanical Armor Bonus", type: "utility", activation: "special", roll: { formula: "ceil(@prof / 2)", name: "AC / weapon attack and damage bonus" }, note: "Armor made into your Mechanical Armor gains an AC bonus equal to half your proficiency bonus rounded up; weapons that are part of the armor add it to attack and damage rolls. Your armor also grants a bonus to creation attack rolls and save DCs; wearing it you gain the benefits of Guardian and Infiltrator at the same time. Apply by hand." }],
  },
  "feats/Boon of the Expert Hunter": {
    activities: [{ name: "Hunter's Bonus Action", type: "utility", activation: "bonus", note: "Take the Dash, Disengage, Hide or Search action. Also choose one option each from your Huntsmen's Tactics and Defensive Champion features that you don't have; you gain both." }],
  },
  "feats/Boon of Advanced Chemistry": {
    activities: [{ name: "Chemical Reactions d10", type: "damage", activation: "special", damage: [["1d10", ""]], note: "The d8 from Chemical Reactions becomes 1d10 and applies to both creation damage and creations that restore hit points. Also gain two additional 1st-level, two 2nd-level and one 3rd-level creation slot." }],
    extraEffects: [{ name: "Acid Resistance", transfer: true, changes: [{ key: "system.traits.dr.value", mode: 2, value: "acid" }] }],
  },
  "feats/Boon of Deadly Duelist": {
    activities: [{ name: "Reliable Attack", type: "utility", activation: "special", note: "When you make an attack roll with a weapon you are proficient with, you can treat a d20 roll of 5 or lower as a 5. When you use Uncanny Dodge against an attack, you instead take no damage." }],
  },
  "feats/Boon of Endless Conviction": {
    uses: { max: "2", per: null },
    activities: [{ name: "Restore Hit Points", type: "heal", activation: "reaction", reactionWhen: "A creature falls below 1 hit point within your aura of protection (including yourself)", consumeUse: true, healing: { formula: "@classes.savant.levels", type: "healing" },
      note: "Expend a use of Channel Conviction (these two are the additional uses) to restore hit points equal to your Savant level to that creature." }],
  },
  "feats/Boon of the Restless Heart": {
    activities: [{ name: "Strong Will Die", type: "utility", activation: "special", roll: { formula: "1d8", name: "Strong Will die" }, note: "Your d4s from the Strong Will racial feature become d8s." }],
    extraEffects: [{ name: "Restless Heart", transfer: true, changes: [{ key: "system.traits.ci.value", mode: 2, value: "charmed" }, { key: "system.traits.ci.value", mode: 2, value: "frightened" }, { key: "system.attributes.death.roll.mode", mode: 4, value: "1" }] }],
  },
  "feats/Boon of Electro Mastery": {
    activities: [{ name: "Electro Mastery", type: "utility", activation: "special", note: "All your attacks can benefit from your Electro racial feature; your attacks ignore resistance to lightning damage and treat immunity to lightning damage as resistance. Your Inner Beast feature can be used once per short or long rest." }],
    extraEffects: [{ name: "Lightning Resistance", transfer: true, changes: [{ key: "system.traits.dr.value", mode: 2, value: "lightning" }] }],
  },
  "feats/Boon of the Barrage": {
    activities: [
      { name: "Ranged Barrage", type: "attack", activation: "action", area: { type: "radius", size: 15 }, attack: { type: "ranged", ability: "dex" }, includeBase: true, damage: [], note: "Make a ranged attack against any number of creatures within 15 feet of a point you can see within your weapon's range, with a separate roll for each creature." },
      { name: "Melee Barrage", type: "attack", activation: "action", area: { type: "radius", size: 5 }, attack: { type: "melee", ability: "str" }, includeBase: true, damage: [], note: "Make melee attacks against any number of creatures within 5 feet of you, with a separate attack roll for each target." },
    ],
  },
};
