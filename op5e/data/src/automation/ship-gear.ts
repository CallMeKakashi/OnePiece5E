import type { ActSpec, Spec } from "../../helpers/spec.js";

// Cannons, cannon shot and the named ranked/cursed/special gear (Chapter 4 Cannons, Chapter 8 Special Items).
// Base item / magical bonus / damage override are set in items/special-gear.ts; activities and effects are here.

// ---- cannons: Dexterity attack, splash save (DC = 8 + number of damage dice), recoil on ships not designed for the cannon
const CANNONS: [string, number, number][] = [
  ["Swivel Gun", 2, 8], ["8-pounder", 2, 10], ["12-pounder", 3, 10], ["18-pounder", 4, 10],
  ["24-pounder", 6, 10], ["36-pounder", 8, 10], ["42-pounder", 10, 10], ["64-pounder", 15, 10],
];

const cannonSpecs: Record<string, Spec> = {};
for (const [name, n, d] of CANNONS) {
  const dice = `${n}d${d}`;
  const avg = Math.floor((n * (d + 1)) / 2);
  cannonSpecs[`items/${name}`] = {
    activities: [
      { name: "Fire Cannon", type: "attack", activation: "action", attack: { type: "ranged", ability: "dex" }, includeBase: true, damage: [],
        note: "Ranged cannon attack = d20 + your proficiency bonus + Dexterity modifier. Without cannon proficiency you do not add proficiency. Damage type and spread depend on the shot loaded." },
      { name: "Splash Damage", type: "save", activation: "special", save: { ability: "dex", dc: String(8 + n), onSave: "half" }, damage: [[dice, "bludgeoning"]],
        note: `If the target is hit, each other creature in the shot's damage spread makes a DEX save (DC ${8 + n} = 8 + ${n} damage dice): full ${dice} on a failure, half on a success. Change the damage type to match the shot.` },
      { name: "Recoil (ship not designed for it)", type: "damage", activation: "special", damage: [[String(avg), "bludgeoning"]],
        note: `If a ship fires a cannon it is not designed for, the ship takes bludgeoning damage equal to the cannon's average damage (${avg}) each time it fires.` },
    ],
  };
}

// ---- cannon shot: damage type and spread (damage dice come from the cannon)
const shot = (note: string, area?: ActSpec["area"]): Spec => ({
  activities: [{ name: "Load and Fire", type: "utility", activation: "special", area, consumeUse: false, note }],
});
const SHOT_TAIL = " Cone and line spreads start at the cannon's muzzle; sphere spreads start at the impact point. A line is as long as the cannon's normal range.";
const shotSpecs: Record<string, Spec> = {
  "items/Round Shot": shot("Bludgeoning damage, sphere spread (5 feet radius)." + SHOT_TAIL, { type: "sphere", size: 5 }),
  "items/Grapeshot": shot("Piercing damage, cone spread (30 feet)." + SHOT_TAIL, { type: "cone", size: 30 }),
  "items/Chain Shot": shot("Bludgeoning damage, line spread (5 feet wide)." + SHOT_TAIL),
  "items/Exploding Shell": shot("Fire damage, sphere spread (20 feet radius)." + SHOT_TAIL, { type: "sphere", size: 20 }),
};

// ---- helpers for the named gear
const swing = (note = ""): ActSpec => ({ name: "Attack", type: "attack", activation: "action", attack: { type: "melee" }, includeBase: true, damage: [], note });
const WIS_DC = "8 + @prof + @abilities.wis.mod";

export const shipGearSpecs: Record<string, Spec> = {
  ...cannonSpecs,
  ...shotSpecs,

  "items/Distortion": {
    activities: [
      swing("Cursed: the wielder's vision is distorted, and all attacks against the wielder are made with advantage."),
      { name: "Blur Vision (curse overcome)", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "wis", dc: WIS_DC, onSave: "none" },
        effects: [{ name: "Blurred Vision", onTargets: true, rounds: 1 }],
        note: "Once per turn, when you hit a creature, it makes a WIS save. On a failure it has disadvantage on attacks against you; on a success it is unaffected that turn." },
    ],
  },
  "items/The Faithful One": {
    activities: [swing("Cursed: whenever you attack with it, roll 1d20. On a 1 the blade vanishes and hides within 120 feet of you. Once the curse is overcome it returns to your hand as a free action.")],
  },
  "items/Lucky Day": {
    activities: [
      swing("Sentient, counts as a Small Humanoid, proficient in Stealth; its unarmed strikes deal the same damage as its blade."),
      { name: "Lucky Clovers", type: "utility", activation: "bonus", note: "Create lucky clovers to reroll attack rolls, skill checks and saving throws, like the Lucky feat, limited by the Devil Fruit Uses Lucky Day has left." },
    ],
  },
  "items/Wyvern's Wrath": {
    activities: [
      swing(),
      { name: "Curse Damage", type: "damage", activation: "special", damage: [["1d8", "psychic"]], note: "Cursed: at the start of each of your turns while using the weapon in combat, you take 1d8 psychic damage." },
      { name: "Curse Overcome Bonus", type: "attack", activation: "action", attack: { type: "melee" }, includeBase: true, damage: [["1d8", "psychic"]], note: "Once the curse is overcome, the weapon deals an extra 1d8 psychic damage instead." },
    ],
  },
  "items/Kopesh": {
    activities: [swing("Effectively unbreakable."), ],
    // +3 weapon (attack and damage) plus a further +2 to damage, per the book
    extraEffects: [{ name: "Kopesh +2 Damage", transfer: true, changes: [{ key: "system.bonuses.mwak.damage", mode: 2, value: "+2" }] }],
  },
  "items/Dead Man's Blade (Gambler Blade/Defender)": {
    activities: [
      swing(),
      ...[1, 2, 3].map((n): ActSpec => ({
        name: `Gambler: +${n}`, type: "utility", activation: "special",
        effects: [{ name: `Gambler Bonus +${n}`, rounds: 1, changes: [
          { key: "system.bonuses.mwak.attack", mode: 2, value: `+${n}` }, { key: "system.bonuses.mwak.damage", mode: 2, value: `+${n}` },
          { key: "system.attributes.ac.bonus", mode: 2, value: `-${n}` }] }],
        note: `On your first attack choose a bonus of +${n} to attack and damage; you take -${n} AC until the start of your next turn. (Curse overcome: always +3, and you may move bonus to AC.)`,
      })),
    ],
  },
  "items/Seastone Weapon (Tipped)": {
    activities: [swing("A hit ignores the target's devil fruit immunities and resistances."), { name: "Seastone Weakness", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", dc: "20", onSave: "none" },
      note: "When the weapon deals damage to a devil fruit user: CON save. On a failure they suffer the knee-deep weakness of Ocean's Scorn. Continuous while the weapon is embedded or they are grappled with it. Armament haki to reduce the damage or gain advantage on the save means automatic success." }],
  },
  "items/Seastone Weapon (Full)": {
    activities: [swing("A hit ignores the target's devil fruit immunities and resistances."), { name: "Seastone Weakness", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", dc: "20", onSave: "none" },
      note: "As a Tipped seastone weapon: CON save when a devil fruit user takes damage; a failure inflicts the knee-deep weakness of Ocean's Scorn." }],
  },
  "items/Seastone Armor": {
    activities: [{ name: "Seastone Grapple Save", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", dc: "20", onSave: "none" },
      note: "When you are grappling a devil fruit user, the target makes this save when grappled and at the end of each of its turns while grappled. If you are a devil fruit user you make it at the end of each of your turns." }],
  },

  // Defiance of the Red World: three tiers, one item doc each
  "items/Defiance of the Red World": {
    activities: [{ name: "Fire", type: "attack", activation: "action", attack: { type: "ranged" }, includeBase: true, damage: [["1d6", "necrotic"]], note: "Dormant. Ignores the reload property; it produces its own bone bullets." }],
  },
  "items/Defiance of the Red World (Wakened)": {
    uses: { max: "@prof", per: "lr" },
    activities: [
      { name: "Fire", type: "attack", activation: "action", attack: { type: "ranged" }, includeBase: true, damage: [["1d8", "necrotic"]], note: "Wakened. Ignores the reload property." },
      { name: "Mark Creature", type: "utility", activation: "bonus", consumeUse: true, targets: { count: 1, type: "creature" }, duration: { value: 1, units: "hour", concentration: true },
        effects: [{ name: "Marked by Defiance", onTargets: true, seconds: 3600 }],
        note: "Mark a creature you can see. It has disadvantage on ability checks and saving throws of one ability score you choose. Move the mark to another creature as a bonus action." },
    ],
  },
  "items/Defiance of the Red World (Exalted)": {
    activities: [
      { name: "Fire", type: "attack", activation: "action", attack: { type: "ranged" }, includeBase: true, damage: [["1d10", "necrotic"]], note: "Exalted. Ignores the reload property. Cannot be disarmed; extends or retracts from your body." },
      { name: "Siphon Life", type: "utility", activation: "special", note: "When the necrotic damage of the weapon is dealt to a creature, you regain hit points equal to the necrotic damage." },
    ],
  },

  // The Silver Seer: three stages, one item doc each
  "items/The Silver Seer": {
    activities: [
      { name: "Don the Shield (CHA under 18)", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "cha", dc: "18", onSave: "half" }, damage: [["3d10", "psychic"]],
        effects: [{ name: "Blinded by the Silver Seer", statuses: ["blinded"], onTargets: true, seconds: 60 }],
        note: "A creature with Charisma under 18 that tries to don the shield: it doffs itself; on a failure the creature takes 3d10 psychic damage and is blinded for 1 minute, repeating the save each turn." },
      { name: "Stirring Curse Save", type: "save", activation: "special", save: { ability: "cha", dc: "18", onSave: "none" },
        note: "When you roll initiative or a Perception check: on a failure disadvantage on all initiative and Perception checks for 1 hour; on a success advantage for 1 hour. You learn the Protection Fighting Style." },
    ],
  },
  "items/The Silver Seer (Wakened)": {
    activities: [
      { name: "Daily Ability Curse Save", type: "save", activation: "special", save: { ability: "cha", dc: "18", onSave: "none" },
        note: "At dawn the shield picks a random ability score. When you make a saving throw with it, make this save: on a failure you automatically fail the save; on a success you take half damage on a failure and none on a success." },
    ],
    extraEffects: [{ name: "Wakened Senses", transfer: true, changes: [{ key: "system.attributes.init.roll.mode", mode: 4, value: "1" }, { key: "system.skills.prc.roll.mode", mode: 4, value: "1" }] }],
  },
  "items/The Silver Seer (Ascendant)": {
    activities: [
      { name: "Chosen Ability Ward", type: "utility", activation: "special", area: { type: "radius", size: 10 },
        note: "At dawn choose the ability score. No Charisma save is needed: on saves with it you and allies within 10 feet take half damage on a failure and none on a success." },
    ],
    extraEffects: [{ name: "Wakened Senses", transfer: true, changes: [{ key: "system.attributes.init.roll.mode", mode: 4, value: "1" }, { key: "system.skills.prc.roll.mode", mode: 4, value: "1" }] }],
  },

  "items/Mechanical Shield (Animated Shield)": {
    descriptionHtml: "<p>This shield has been engineered by a brilliant mechanic, allowing it to be used hands-free. It is a very rare make.</p><p>While holding this shield, you can speak its command word as a bonus action to cause it to animate. The shield leaps into the air and hovers in your space to protect you as if you were wielding it, leaving your hands free. It remains animated for 1 minute, until you use a bonus action to end the effect, or until you are incapacitated or die, at which point the shield falls to the ground or into your hand if you have one free.</p>",
    activities: [
      { name: "Animate Shield", type: "utility", activation: "bonus", duration: { value: 1, units: "minute" }, note: "Speak the command word. The shield hovers in your space and protects you as if wielded." },
      { name: "End Animation", type: "utility", activation: "bonus", note: "The shield falls to the ground or into a free hand." },
    ],
  },
  "items/Gadget Ring (Ring of Spell Storing)": {
    descriptionHtml: "<p>This rare item holds the components to hold creations within them, allowing the wearer to utilize them.</p><p>The ring stores creations built into it, holding them until the attuned wearer uses them. It can store up to 5 levels worth of creations at a time.</p><p>Any creature can add a creation of 1st through 5th level into the ring by touching the ring as the creation is used. The creation has no effect, other than to be stored in the ring. If the ring can't hold the creation, it is expended without effect. The level of the slot used determines how much space it uses.</p><p>While wearing this ring, you can use any creation stored in it. The creation uses the slot level, creativity save DC, creation attack bonus and creativity ability of the original activator, but is otherwise treated as if you cast it. A creation used from the ring is no longer stored in it, freeing up space.</p>",
    activities: [
      { name: "Store Creation", type: "utility", activation: "special", note: "Touch the ring as a 1st to 5th level creation is used. It uses space equal to the slot level (5 levels total). If it does not fit, it is expended without effect." },
      { name: "Use Stored Creation", type: "utility", activation: "action", note: "Use a stored creation with the original activator's slot level, DC, attack bonus and ability. It is then removed from the ring." },
    ],
  },
  "items/Raid Suit": {
    activities: [
      { name: "Glove Strike", type: "attack", activation: "action", attack: { type: "melee", bonus: "2" }, damage: [["1d6 + 2", ""]], note: "The gloves of the suit count as simple weapons, each a +2 that deals 1d6 damage." },
    ],
    extraEffects: [{ name: "Raid Suit Speed", transfer: true, changes: [{ key: "system.attributes.movement.walk", mode: 2, value: "10" }] }],
  },
  "items/Bracers of Defense": {
    activities: [],
    // book: +2 AC "if you are wearing no armor and using no shield": dnd5e can't test that, so the effect starts off — switch it on while that holds
    extraEffects: [{ name: "Bracers of Defense (turn on only while wearing no armor and no shield)", transfer: true, disabled: true, changes: [{ key: "system.attributes.ac.bonus", mode: 2, value: "2" }] }],
  },
  "items/Jet Dial Bracers": {
    activities: [{ name: "Shove (Jet Dial)", type: "utility", activation: "action", note: "Advantage on shove attempts; you can shove a creature two sizes larger than yourself." }],
    extraEffects: [{ name: "Jet Dial Strikes", transfer: true, changes: [
      { key: "system.bonuses.mwak.attack", mode: 2, value: "+2" }, { key: "system.bonuses.mwak.damage", mode: 2, value: "+2+1d6" },
      { key: "system.bonuses.rwak.attack", mode: 2, value: "+2" }, { key: "system.bonuses.rwak.damage", mode: 2, value: "+2+1d6" }] }],
  },
};
