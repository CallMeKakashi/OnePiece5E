import type { ActSpec, EffectSpec, Spec } from "../../helpers/spec.js";

// Batch 2 of multi-option class feature automation (see class-features.ts).
const MIN = (n = 1) => ({ value: n, units: "minute" as const });
const ALL_SPELL_ATTACKS = ["mwak", "rwak", "msak", "rsak"];
const dmgBonus = (name: string, expr: string, seconds?: number): EffectSpec => ({ name, seconds, changes: ALL_SPELL_ATTACKS.map((k) => ({ key: `system.bonuses.${k}.damage`, mode: 2, value: expr })) });
const ELEMENTS = ["bludgeoning", "piercing", "slashing", "fire", "lightning", "thunder", "acid", "cold"];
const INT_DC = "8 + @prof + @abilities.int.mod";
const CON_DC = "8 + @prof + @abilities.con.mod";
const WIS_DC = "8 + @prof + @abilities.wis.mod";
// barbarian storm dice: 1 at 3rd, 2 at 5th, 3 at 11th, 4 at 17th
const T = (n: number) => `min(1, floor(@classes.barbarian.levels / ${n}))`;
const STORM = `(1 + ${T(5)} + ${T(11)} + ${T(17)})`;
// Forgemaster die: d6, d8 at 6th, d10 at 10th, d12 at 14th
const FORGE_FACES = `(6 + 2 * ${T(6)} + 2 * ${T(10)} + 2 * ${T(14)})`;

const sixKing: ActSpec[] = Array.from({ length: 10 }, (_, i) => ({
  name: `Six King Gun (${i + 1} spirit point${i ? "s" : ""})`, type: "save" as const, activation: "action" as const,
  area: { type: "line" as const, size: 30 }, targets: { type: "creature" as const }, consumeUse: true, consumeTarget: "spirit", consumeAmount: String(i + 1),
  save: { ability: "con", dc: WIS_DC, onSave: "half" as const }, damage: [[`${(i + 1) * 2}d10`, "force"]] as [string, string][],
  note: i === 0 ? "A blast 5 ft wide and 30 ft long. A creature reduced to 0 hit points by this damage dies immediately. Spend the spirit points on the Spirit feature." : undefined,
}));

export const classFeatureSpecs2: Record<string, Spec> = {
  "class-features/Favored Mark": {
    activities: [
      { name: "Mark a Target", type: "utility", activation: "bonus", duration: { value: 1, units: "hour" }, consumeUse: true, targets: { count: 1, type: "creature" },
        note: "Mark a creature you can see for 1 hour or until you mark another. No disadvantage on long-range ranged attacks against it, and advantage on Investigation and Perception checks to spot it. If it drops to 0 hit points, use your reaction to mark another without spending a use." },
      { name: "Favored Mark Damage", type: "damage", activation: "special", damage: [["@scale.marksman.favored-mark", ""]], note: "Once per turn when you hit the marked target with a weapon attack." },
    ],
  },

  "class-features/Flexible Body": {
    activities: [
      { name: "Alter Appearance", type: "utility", activation: "bonus", note: "Change your features and height (not your size category) to appear as a different race without gaining its benefits." },
      { name: "Redistribute Physical Scores", type: "utility", activation: "bonus", note: "Lower Strength, Dexterity or Constitution (minimum 8) and move those points to another physical score, up to 20 (24 at 20th level)." },
      { name: "Strength 20+ Benefit", type: "utility", activation: "special", effects: [dmgBonus("Strength 20+", "+1d4")], note: "Weapon attacks deal an extra 1d4 damage and gain the Siege property." },
      { name: "Dexterity 20+ Benefit", type: "utility", activation: "special", effects: [{ name: "Dexterity 20+", changes: [{ key: "system.attributes.movement.walk", mode: 2, value: "10" }] }], note: "Movement speed +10 ft and you don't provoke opportunity attacks." },
      { name: "Constitution 20+ Benefit", type: "utility", activation: "special", effects: [{ name: "Constitution 20+", changes: ["bludgeoning", "piercing", "slashing"].map((t) => ({ key: "system.traits.dr.value", mode: 2, value: t })) }], note: "Resistance to bludgeoning, piercing and slashing damage." },
    ],
  },

  "class-features/Forgemaster's Armor": {
    activities: [
      { name: "Forge Armor", type: "utility", activation: "special", note: "Over a long rest, transform a set of light or medium armor into your Forgemaster's Armor and choose its damage type." },
      { name: "Wear Forgemaster's Armor", type: "utility", activation: "special", effects: [{ name: "Forgemaster's Armor", changes: [{ key: "system.attributes.ac.bonus", mode: 2, value: "1" }] }], note: "+1 AC while you wear it." },
      { name: "Armor Strike", type: "attack", activation: "bonus", range: 5, attack: { type: "melee", ability: "str" },
        damage: [[`1d${FORGE_FACES} + @abilities.str.mod`, ELEMENTS]],
        note: "One melee weapon attack with your armor against a target within 5 feet; choose the damage type you set when you forged it." },
      { name: "Armor Grapple Damage", type: "damage", activation: "special", damage: [[`1d${FORGE_FACES}`, ELEMENTS]], note: "When your grapple check succeeds the target takes this damage." },
    ],
  },

  "class-features/Formal Noodle Suit": {
    activities: [
      { name: "Form Noodle Suit", type: "heal", activation: "bonus", consumeUse: true, healing: { formula: "2 * @details.level", type: "temp" }, duration: { value: 24, units: "hour" },
        note: "Consume a bag of flour. The suit lasts 24 hours or until its temporary hit points are gone; your Noodle Strike attacks gain a bonus to attack and damage rolls equal to half your proficiency bonus, rounded up." },
      { name: "Noodle Restrain", type: "save", activation: "reaction", reactionWhen: "You are hit by a melee attack", targets: { count: 1, type: "creature" },
        save: { ability: "str", dc: "8 + @abilities.str.mod + @prof", onSave: "none" }, effects: [{ name: "Restrained by Noodles", statuses: ["restrained"], onTargets: true, seconds: 60 }],
        note: "On a failure the attacker is restrained; the escape DC is the same." },
    ],
  },

  "class-features/Fuel the Fire": {
    activities: [
      { name: "Ignite", type: "save", activation: "special", consumeUse: true, targets: { count: 1, type: "creature" },
        save: { ability: "con", dc: CON_DC, onSave: "none" }, effects: [{ name: "Set Ablaze", statuses: ["burning"], onTargets: true, seconds: 60 }],
        note: "Once per turn when you deal fire damage to a creature or flammable object. On a failure the target is set ablaze." },
      { name: "Burning Damage", type: "damage", activation: "special", damage: [["1d6", "fire"]], note: "The burning target takes this at the start of each of its turns." },
      { name: "Put Out the Fire", type: "utility", activation: "special", note: "The burning creature can spend all its movement to make a Dexterity (Acrobatics) check against your Fuel the Fire DC, ending the effect on a success." },
    ],
  },

  "class-features/Mechanical Cannon": {
    activities: [
      { name: "Create Cannon", type: "utility", activation: "action", range: 5, note: "Using woodcarver's tools or smith's tools, create a Small or Tiny cannon (AC 18, hit points = 5 x your gadgeteer level, immune to poison and psychic) on a horizontal surface within 5 feet. Once per long rest unless you expend a creation slot." },
      { name: "Summon Cannon", type: "summon", summon: { profiles: ["Mechanical Cannon"], hp: "5 * (@classes.gadgeteer.levels - 1)" } },
      { name: "Elemental Culverin", type: "save", activation: "bonus", area: { type: "cone", size: 15 }, targets: { type: "creature" },
        save: { ability: "dex", dc: INT_DC, onSave: "half" }, damage: [["3d8", ["fire", "cold", "lightning", "acid", "thunder", "poison"]]], note: "The cannon exhales energy in an adjacent 15-foot cone." },
      { name: "Force Ballista", type: "attack", activation: "bonus", range: 120, attack: { type: "ranged", ability: "int" }, damage: [["3d8", "force"]], note: "Ranged creation attack from the cannon. On a hit the target is also pushed up to 5 feet." },
      { name: "Protector", type: "heal", activation: "bonus", area: { type: "radius", size: 20 }, healing: { formula: "1d8 + @abilities.int.mod", type: "temp" }, note: "The cannon and each creature of your choice within 20 feet of it." },
    ],
  },

  "class-features/Monstrous Transformation": {
    activities: [
      { name: "Monstrous Transformation", type: "heal", activation: "bonus", consumeUse: true, healing: { formula: "8 * @classes.medic.levels", type: "temp" }, duration: { value: 1, units: "hour" },
        effects: [{ name: "Monstrous Transformation", changes: [
          { key: "system.traits.size", mode: 5, value: "lg" },
          { key: "system.abilities.str.value", mode: 4, value: "@abilities.wis.value" }, { key: "system.abilities.dex.value", mode: 4, value: "@abilities.wis.value" }, { key: "system.abilities.con.value", mode: 4, value: "@abilities.wis.value" },
          { key: "system.attributes.movement.walk", mode: 2, value: "10" }, { key: "system.abilities.con.save.roll.mode", mode: 4, value: "1" },
          ...["mwak"].flatMap((k) => [{ key: `system.bonuses.${k}.attack`, mode: 2, value: "+ceil(@prof / 2)" }, { key: `system.bonuses.${k}.damage`, mode: 2, value: "+ceil(@prof / 2)" }]),
        ] }],
        note: "Your creature type becomes monstrosity. Temporary hit points are doubled (8 x Medic level). You gain all three Experimental Medicine enhancements. You cannot use creations. When it ends you gain one level of exhaustion." },
      { name: "Lose Control Check", type: "save", activation: "special", save: { ability: "int", dc: "15", onSave: "none" }, targets: { type: "self" }, note: "At the start of each of your turns. On a failure you lose control until the start of your next turn and must move toward and attack the closest creature." },
    ],
  },

  "class-features/Pain is Power": {
    activities: [
      { name: "Light Yourself on Fire", type: "utility", activation: "bonus", duration: MIN(), effects: [dmgBonus("Pain is Power", "+2d6[fire]", 60)],
        note: "For 1 minute all your attacks deal an extra 2d6 fire damage. Damage you take that isn't fire damage is reduced by your Constitution modifier per instance." },
      { name: "Burning Pain", type: "damage", activation: "special", targets: { type: "self" }, damage: [["2d6", "fire"]], note: "You take this at the end of each of your turns while burning." },
    ],
  },

  "class-features/Perfected Armor": {
    activities: [
      { name: "Guardian Pulse", type: "damage", activation: "reaction", reactionWhen: "A creature you can see within 30 feet attacks a creature", range: 30, consumeUse: true,
        damage: [["2d8 + @abilities.int.mod", "thunder"]], note: "Overwhelm the attacker with a concentrated pulse. Your thunder gauntlets also deal 2d8." },
      { name: "Infiltrator Flight", type: "utility", activation: "special", effects: [{ name: "Infiltrator Flight", changes: [{ key: "system.attributes.movement.fly", mode: 4, value: "@attributes.movement.walk" }] }],
        note: "Flying speed equal to your walking speed; a creature you fly out of reach of has disadvantage on opportunity attacks against you. Your lightning launcher deals 3d6." },
    ],
  },

  "class-features/Power Jolt": {
    activities: [
      { name: "Force Jolt", type: "damage", activation: "special", consumeUse: true, damage: [["2d6", "force"]], note: "When you hit with a mastercraft weapon attack or your iron defender hits. Once per turn." },
      { name: "Healing Jolt", type: "heal", activation: "special", consumeUse: true, range: 30, targets: { count: 1, type: "creature" }, healing: { formula: "2d6", type: "healing" }, note: "A creature or object you can see within 30 feet of the target. Once per turn." },
    ],
  },

  "class-features/Raging Storm": {
    activities: [
      { name: "Firestorm", type: "damage", activation: "bonus", area: { type: "radius", size: 10 }, targets: { type: "enemy" }, damage: [[`${STORM}d6`, "fire"]], note: "All creatures in your aura other than you take this damage. Activates when you enter your rage and again as a bonus action each turn." },
      { name: "Thunderstorm", type: "save", activation: "bonus", range: 10, targets: { count: 1, type: "creature" }, save: { ability: "dex", dc: CON_DC, onSave: "half" }, damage: [[`${STORM}d12`, ["lightning", "thunder"]]], note: "Choose one other creature you can see in your aura." },
      { name: "Snowstorm", type: "heal", activation: "bonus", area: { type: "radius", size: 10 }, healing: { formula: `${STORM}d6`, type: "temp" }, note: "You and each other creature of your choice in your aura." },
    ],
  },

  "class-features/Release The Beast": {
    activities: [
      { name: "Beast Mode: Regain Hit Points", type: "heal", activation: "special", consumeUse: true, healing: { formula: "floor(@attributes.hp.max / 2)", type: "healing" }, duration: MIN(),
        note: "Once per long rest when you drop to 0 hit points. Beast Mode lasts 1 minute: one extra attack with the Attack action, +10 fire damage against creatures under Fuel the Fire, fire immunity treated as resistance, free Numbed Nerves, and Vengeful Flames at will." },
      { name: "Beast Mode: Temporary Hit Points", type: "heal", activation: "special", healing: { formula: "66", type: "temp" } },
      { name: "Aura of Fear", type: "save", activation: "special", area: { type: "radius", size: 20 }, targets: { type: "creature" }, duration: MIN(),
        save: { ability: "wis", dc: CON_DC, onSave: "none" }, effects: [{ name: "Frightened by Beast Mode", statuses: ["frightened"], onTargets: true, seconds: 60 }],
        note: "Creatures of your choice aware of the aura. A creature repeats the save at the end of each of its turns; once it succeeds or the effect ends it is immune for 24 hours." },
    ],
  },

  "class-features/Six King Gun": { activities: sixKing },
};
void ({} as Spec);
