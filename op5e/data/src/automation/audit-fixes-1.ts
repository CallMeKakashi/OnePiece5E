import type { Spec } from "../../helpers/spec.js";

// Verified fixes from compendium audit chunk 1 (2026-10-10). Only concrete mismatches against the rules text; false positives were dropped.
const MIN = { value: 1, units: "minute" as const };
const ALL_DMG = ["acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic", "piercing", "poison", "psychic", "slashing", "thunder"];
const SPIRIT_DC = "8 + @prof + @abilities.wis.mod";
const resist = (types: string[]) => types.map((v) => ({ key: "system.traits.dr.value", mode: 2, value: v }));
const BRAWL_DIE = "1d@scale.brawler.brawling-die.faces";
const WEAPON_DMG = ["mwak", "rwak", "msak", "rsak"];

/** Level 20 savant "once per long rest" bonus-action forms: restate the single activity with its self effect. */
const capstone = (name: string, changes: { key: string; mode: number; value: string }[], note: string): Spec => ({ activities: [
  { name, type: "utility", activation: "bonus", consumeUse: true, duration: MIN, effects: [{ name, seconds: 60, changes }], note },
] });

export const auditFixSpecs1: Record<string, Spec> = {
  "class-features/Proof of Mettle": { activities: [
    { name: "Proof of Mettle", type: "save", activation: "special", consumeUse: true, area: { type: "radius", size: 20 }, targets: { type: "creature" },
      save: { ability: "wis", dc: "8 + @prof + @abilities.str.mod", onSave: "none" }, duration: MIN,
      effects: [{ name: "Frightened by Proof of Mettle", seconds: 60, statuses: ["frightened"], onTargets: true }],
      note: "While raging, on a critical hit or when you reduce a creature to 0 hit points with a weapon attack. Each creature of your choice within 20 feet is frightened of you for 1 minute or until it can no longer see you; it repeats the save at the end of each of its turns. Once per rage." },
  ] },

  "class-features/Absolute Authority": capstone("Absolute Authority", [{ key: "system.traits.di.value", mode: 2, value: "radiant" }, ...resist(ALL_DMG.filter((d) => d !== "radiant"))],
    "For 1 minute: immune to radiant, resistant to all other damage. Once when you miss with a weapon or creation attack on your turn, reroll it. One additional attack with the Attack action. Reusable after a long rest, or by expending a 5th-level creation slot."),
  "class-features/Spiteful Destroyer": capstone("Spiteful Destroyer", [{ key: "system.traits.di.value", mode: 2, value: "acid" }],
    "For 1 minute: immune to acid damage. Weapon hits permanently reduce non-imbued armor/shield AC by 1 (cumulative); Corrosive Defenses damage is doubled and ignores acid resistance and immunity. Reusable after a long rest, or by expending a 5th-level creation slot."),
  "class-features/Dashing Saviour": capstone("Dashing Saviour", [{ key: "system.traits.di.value", mode: 2, value: "fire" }],
    "For 1 minute: immune to fire damage; shed bright light 30 feet and dim light 30 feet more; a creature starting its turn in the bright light can take 10 fire damage; Heroic Rush targets 1 + your Charisma modifier creatures (minimum two). Reusable after a long rest, or by expending a 5th-level creation slot."),
  "class-features/Fateweaver": capstone("Fateweaver", [
    { key: "system.traits.di.value", mode: 2, value: "psychic" },
    { key: "flags.midi-qol.grants.disadvantage.attack.all", mode: 5, value: "1" },
    { key: "flags.midi-qol.advantage.ability.save.all", mode: 5, value: "1" },
  ], "For 1 minute: immune to psychic; attack rolls against you have disadvantage; advantage on all saving throws. Roll two d20 fate dice on activation; once per turn replace any d20 of a creature you can see with one. Reusable after a long rest, or by expending a 5th-level creation slot."),
  "class-features/Rider of Storms": capstone("Rider of Storms", [
    { key: "system.traits.di.value", mode: 2, value: "lightning" },
    { key: "system.attributes.movement.fly", mode: 4, value: "60" },
  ], "For 1 minute: immune to lightning; flying speed 60 ft (opportunity attacks against you have disadvantage while flying); one additional attack with the Attack action. Reusable after a long rest, or by expending a 5th-level creation slot."),

  "class-features/Legendary Flourish": { activities: [
    { name: "Shielding Hymn", type: "utility", activation: "reaction", reactionWhen: "a creature within 5 ft of you is hit by an attack", consumeUse: true, consumeTarget: "bardic-inspiration",
      roll: { formula: "@scale.bard.bardic-inspiration + @abilities.cha.mod + @classes.bard.levels", name: "Damage reduction" },
      note: "Reduce the damage by a roll of your Bardic Inspiration die + Charisma modifier + bard level." },
    { name: "Stampeding Anthem", type: "utility", activation: "special", consumeUse: true, consumeTarget: "bardic-inspiration",
      effects: [{ name: "Stampeding Anthem", rounds: 1, changes: [{ key: "system.attributes.movement.walk", mode: 2, value: "20" }] }],
      note: "As part of making an attack with a simple or martial weapon: +20 ft movement speed until the end of your turn (use the damage button on a hit)." },
    { name: "Stampeding Anthem: damage", type: "damage", activation: "special", damage: [["@scale.bard.bardic-inspiration + @abilities.cha.mod", ""]],
      note: "The attack deals additional damage equal to a roll of your Bardic Inspiration die + Charisma modifier. The Bardic Inspiration use was spent on Stampeding Anthem." },
    { name: "Piercing Ballad", type: "utility", activation: "special", consumeUse: true, consumeTarget: "bardic-inspiration", roll: { formula: "@scale.bard.bardic-inspiration", name: "Attack roll bonus" },
      note: "As part of making an attack with a simple or martial weapon, add a roll of your Bardic Inspiration die to the attack roll." },
    { name: "Flourish temporary hit points", type: "heal", activation: "special", healing: { formula: "@scale.bard.bardic-inspiration + @abilities.cha.mod", type: "temp" },
      note: "When you use one of these flourishes, gain temporary hit points equal to one roll of your Bardic Inspiration die + Charisma modifier." },
  ] },

  "class-features/Tides of War": { uses: { max: "3", per: "lr" }, activities: [
    { name: "Tides of War", type: "save", activation: "action", consumeUse: true, targets: { type: "creature" },
      save: { ability: "dex", dc: "8 + @prof + max(@abilities.str.mod, @abilities.dex.mod)", onSave: "half" }, damage: [["(@prof)d10", "bludgeoning"]],
      note: "Line of water (proficiency bonus x 20) ft long and 5 ft wide. Failed save: (proficiency bonus)d10 bludgeoning, half on a success." },
  ] },

  "class-features/Water Heart": { activities: [
    { name: "Water Heart", type: "save", activation: "action", range: 120, area: { type: "sphere", size: 20 }, targets: { type: "creature" },
      save: { ability: "dex", dc: SPIRIT_DC, onSave: "half" }, damage: [["4d6", "bludgeoning"]],
      effects: [{ name: "Prone (Water Heart)", statuses: ["prone"], onTargets: true }],
      note: "Failed save: 4d6 bludgeoning and the creature falls prone; half damage on a success. If you spend at least 1 spirit point, a tube of water links you to the sphere's center until the start of your next turn." },
    { name: "Water Heart: spirit point (+2d6)", type: "damage", activation: "special", consumeUse: true, consumeTarget: "spirit", damage: [["2d6", "bludgeoning"]],
      note: "As part of this action, spend up to your proficiency bonus in spirit points: use this button once per point spent for an additional 2d6 damage each." },
  ] },

  "class-features/Brick Fist": { activities: [
    { name: "Brick Fist", type: "save", activation: "action", range: 5, rangeUnits: "touch", targets: { count: 1, type: "creature" },
      save: { ability: "con", dc: SPIRIT_DC, onSave: "half" }, damage: [[`${BRAWL_DIE} + @abilities.wis.mod`, "bludgeoning"]],
      note: "In place of an unarmed strike. This damage cannot be resisted or reduced except by certain Haki abilities. While underwater, a creature without a swimming speed has disadvantage on the save." },
    { name: "Brick Fist: spirit point die", type: "damage", activation: "special", consumeUse: true, consumeTarget: "spirit", damage: [[BRAWL_DIE, "bludgeoning"]],
      note: "Spend up to your proficiency bonus in spirit points: use once per point spent to add one brawler die to the damage." },
  ] },

  "class-features/Hand of Harm": { activities: [
    { name: "Hand of Harm", type: "damage", activation: "special", consumeUse: true, damage: [[`${BRAWL_DIE} + @abilities.wis.mod`, "necrotic"]],
      note: "When you hit with an unarmed strike. With no uses remaining you can instead spend 1 spirit point (spend it by hand)." },
  ] },

  "class-features/Color of Observation Novice": {
    activities: [{ name: "Color of Observation Novice", type: "utility", activation: "special", consumeUse: true,
      note: "Spend an Observation Point to add half your proficiency bonus (rounded down; full with Observation affinity) to an attack roll or save DC. Sense Presence: in place of the Search action, sense living creatures within 60 feet." }],
    extraEffects: [{ name: "Sense Presence: +5 passive Perception", transfer: true, changes: [{ key: "system.skills.prc.bonuses.passive", mode: 2, value: "5" }] }],
  },

  "class-features/Channel Conviction: Mindful Insight": { activities: [
    { name: "Future's Ward", type: "utility", activation: "reaction", reactionWhen: "an ally is the target of an attack or is forced to roll a saving throw", consumeUse: true,
      note: "Impose disadvantage on the attack roll (target also subtracts your Charisma modifier, minimum 1), or grant the ally advantage on the save (ally adds your Charisma modifier, minimum 1)." },
    { name: "Powerful Premonition", type: "utility", activation: "bonus", consumeUse: true, duration: MIN,
      note: "For 1 minute, you can use your bonus action, and the bonus action used to activate this feature, to use the Mind Slash trick." },
  ] },

  "class-features/Channel Conviction: Burning Passion": { activities: [
    { name: "Manifest Soul", type: "utility", activation: "bonus", consumeUse: true, duration: MIN,
      effects: [{ name: "Manifest Soul: Fire", seconds: 60, changes: WEAPON_DMG.map((k) => ({ key: `system.bonuses.${k}.damage`, mode: 2, value: "+@abilities.cha.mod[fire]" })) }],
      note: "For 1 minute your weapon attacks and creations deal extra fire damage equal to your Charisma modifier. You can end this on your turn as part of another action; it ends if you no longer hold the weapon or fall unconscious." },
    { name: "Soul Burn", type: "heal", activation: "action", consumeUse: true, area: { type: "radius", size: 30 }, targets: { type: "creature" }, healing: { formula: "2d6 + @abilities.cha.mod + @classes.savant.levels", type: "temp" },
      note: "Each creature of your choice within 30 feet gains the temporary hit points, and while it has them it has advantage on saving throws against being frightened." },
  ] },

  "class-features/Channel Conviction: Venomous Duality": { activities: [
    { name: "Manifest Soul", type: "utility", activation: "bonus", consumeUse: true, duration: MIN,
      note: "For 1 minute your weapon attacks and creations force the target to make a Constitution saving throw (use Venom Strike); on a failure it is poisoned for 1 minute, repeating the save at the end of each of its turns." },
    { name: "Venom Strike", type: "save", activation: "special", targets: { type: "creature" }, save: { ability: "con", dc: "8 + @prof + @abilities.cha.mod", onSave: "none" },
      effects: [{ name: "Poisoned by Venom Strike", seconds: 60, statuses: ["poisoned"], onTargets: true }] },
    { name: "Antivenom", type: "heal", activation: "action", consumeUse: true, targets: { type: "creature" }, healing: { formula: "2 * @classes.savant.levels + @abilities.cha.mod", type: "temp" },
      note: "Touch a willing creature or inhale airborne poison in a 20-foot sphere around you; the poison or disease is cleared and you gain the temporary hit points." },
  ] },

  "class-features/Channel Conviction: Caustic Spite": { activities: [
    { name: "Manifest Soul", type: "utility", activation: "bonus", consumeUse: true, duration: MIN,
      effects: [{ name: "Manifest Soul: Acid", seconds: 60, changes: WEAPON_DMG.map((k) => ({ key: `system.bonuses.${k}.damage`, mode: 2, value: "+1d8[acid]" })) }],
      note: "For 1 minute your weapon attacks and creations deal an extra 1d8 acid damage. You can end this on your turn as part of another action." },
    { name: "Spiteful Corrosion", type: "utility", activation: "special", consumeUse: true, targets: { count: 1, type: "creature" }, duration: MIN,
      effects: [{ name: "Corroded Armor", seconds: 60, onTargets: true, changes: [{ key: "system.attributes.ac.bonus", mode: 2, value: "-2" }] }],
      note: "When you deal acid damage to a creature: for 1 minute its AC is reduced by 2. It can use an action to make a Strength check against your creation DC to end this effect." },
  ] },

  "class-features/Blinding Flare": { activities: [
    { name: "Blinding Flare", type: "save", activation: "special", consumeUse: true, targets: { count: 1, type: "creature" },
      save: { ability: "con", dc: "8 + @prof + @abilities.cha.mod", onSave: "none" },
      effects: [{ name: "Blinded by Blinding Flare", rounds: 1, statuses: ["blinded"], onTargets: true }],
      note: "When you deal radiant damage to a creature. On a failed save it is blinded until the end of its next turn." },
  ] },

  "class-features/Fighting Style: Protection": { activities: [
    { name: "Fighting Style: Protection", type: "utility", activation: "reaction", reactionWhen: "a creature you can see attacks a target other than you within 5 feet of you",
      note: "You must be wielding a shield. The attacker rerolls the attack roll and uses the lower result." },
  ] },

  "class-features/Violent Shot": { activities: [
    { name: "Violent Shot", type: "utility", activation: "special", consumeUse: true, consumeTarget: "trick-shots",
      note: "Expend one or more grit points: each grit point gives -1 to the firearm attack roll, and if it hits you roll one additional weapon damage die per grit point spent. Use once per grit point spent." },
  ] },

  "class-features/Ignite": { activities: [
    { name: "Ignite", type: "damage", activation: "special", consumeUse: true, consumeTarget: "foxfire-points", damage: [["1d8", "fire"]],
      note: "When you hit with a melee weapon attack, expend a Foxfire Point for an extra 1d8 fire damage. At 10th level you can instead ignite all melee weapons you wield for 1 minute (each of their attacks deals the extra 1d8 fire damage)." },
  ] },

  "class-features/Flame Render": { activities: [
    { name: "Flame Render", type: "utility", activation: "reaction", reactionWhen: "you are targeted by a fire-based attack or creation", consumeUse: true, consumeTarget: "foxfire-points",
      note: "Spend a Foxfire Point to cut the flames, reducing the fire damage to 0 and extinguishing any lingering flames it would have created." },
  ] },

  "class-features/Mountain Stance": { activities: [
    { name: "Anchor", type: "utility", activation: "special", effects: [{ name: "Mountain Stance", rounds: 1 }],
      note: "If you moved half your speed or less this turn, you can't be moved against your will until the start of your next turn." },
    { name: "Brace for damage", type: "utility", activation: "reaction", reactionWhen: "you take damage", consumeUse: true, consumeTarget: "spirit", roll: { formula: "1d10 + @abilities.str.mod", name: "Damage reduction" },
      note: "Until the start of your next turn, spend a spirit point whenever you take damage to reduce it by 1d10 + your Strength modifier." },
  ] },

  "class-features/Mending Mark": { activities: [
    { name: "Mending Mark", type: "utility", activation: "bonus", consumeUse: true, consumeTarget: "favored-mark", targets: { count: 1, type: "creature" }, duration: { value: 1, units: "hour" },
      note: "Expend a use of Favored Mark to place a Mending Mark for 1 hour or until you use this feature on another creature. Your hit-point-restoring creations heal an additional roll of your Favored Mark die on it, and it has advantage on saving throws with the ability you choose (Strength, Dexterity or Constitution)." },
  ] },
};
