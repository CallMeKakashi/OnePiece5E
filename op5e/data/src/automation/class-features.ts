import type { ActSpec, EffectSpec, Spec } from "../../helpers/spec.js";

// Hand-written automation for multi-option class features. One activity per option; effects carry buffs/conditions.
// Trigger rules that need numbers from another roll (e.g. "damage equal to the damage you took") stay in the clear option text.

const MIN = (n = 1) => ({ value: n, units: "minute" as const });
const CHA_DC = "8 + @prof + @abilities.cha.mod";
const WIS_DC = "8 + @prof + @abilities.wis.mod";
const attackBonus = (name: string, bonus: string): EffectSpec => ({
  name, changes: ["mwak", "rwak", "msak", "rsak"].map((k) => ({ key: `system.bonuses.${k}.attack`, mode: 2, value: `+${bonus}` })),
});
const extraDamage = (name: string, dice: string, type: string): EffectSpec => ({
  name, changes: ["mwak", "rwak", "msak", "rsak"].map((k) => ({ key: `system.bonuses.${k}.damage`, mode: 2, value: `+${dice}[${type}]` })),
});
const opt = (title: string, body: string) => `<h4>${title}</h4><p>${body}</p>`;
const status = (name: string, id: string, rounds?: number): EffectSpec => ({ name, statuses: [id], rounds, seconds: rounds ? undefined : 60 });

export const classFeatureSpecs: Record<string, Spec> = {
  "class-features/Area Strike": {
    activities: [{ name: "Destructive Wave", type: "save", activation: "action", consumeUse: true,
      save: { ability: "dex", dc: "8 + @prof + max(@abilities.str.mod, @abilities.dex.mod)", onSave: "half" },
      note: "Replace one melee attack with a wave in the shape chosen with Area of Effect. Each creature in the area takes the damage of the replaced melee attack (half on a success)." }],
  },

  "class-features/Channel Conviction: Caustic Spite": {
    activities: [
      { name: "Manifest Soul", type: "utility", activation: "bonus", duration: MIN(), consumeUse: true, effects: [extraDamage("Manifest Soul: Acid", "1d8", "acid")],
        note: "For 1 minute your weapon attacks and creations deal an extra 1d8 acid damage." },
      { name: "Spiteful Corrosion", type: "utility", activation: "special", duration: MIN(), consumeUse: true, targets: { count: 1, type: "creature" },
        effects: [{ name: "Corroded Armor", onTargets: true, changes: [{ key: "system.attributes.ac.bonus", mode: 2, value: "-2" }], seconds: 60 }],
        note: "When you deal acid damage to a creature: its AC is reduced by 2 for 1 minute. It can use an action to make a Strength check against your creation DC to scrape the acid off." },
    ],
  },

  "class-features/Channel Conviction: Necrotic Mania": {
    activities: [
      { name: "Consuming Gloom", type: "utility", activation: "bonus", duration: MIN(), consumeUse: true, effects: [attackBonus("Consuming Gloom", "@abilities.cha.mod")],
        note: "For 1 minute: bright light within 20 ft of the weapon becomes dim, dim light becomes darkness; add your Charisma modifier to the weapon's attack rolls; you see normally in all darkness." },
      { name: "Feed on Despair", type: "save", activation: "action", consumeUse: true, area: { type: "radius", size: 20 }, targets: { type: "creature" },
        save: { ability: "cha", dc: CHA_DC, onSave: "half" }, damage: [["2d10 + @classes.savant.levels + @abilities.cha.mod", "necrotic"]],
        note: "Creatures of your choice within 20 ft. You then gain temporary hit points equal to the damage dealt to one of them." },
    ],
  },

  "class-features/Channel Conviction: Radiant Superiority": {
    activities: [
      { name: "Blazing Light", type: "utility", activation: "bonus", duration: MIN(), consumeUse: true, effects: [attackBonus("Blazing Light", "@abilities.cha.mod")],
        note: "For 1 minute your weapon sheds bright light in a 20 ft radius and dim light for another 20 ft; add your Charisma modifier to its attack rolls." },
      { name: "Commanding Presence: Charm", type: "save", activation: "action", consumeUse: true, range: 30, duration: MIN(), targets: { type: "creature" },
        save: { ability: "wis", dc: CHA_DC, onSave: "none" }, effects: [{ ...status("Charmed by Commanding Presence", "charmed"), onTargets: true }],
        note: "Each creature of your choice you can see within 30 ft. It can repeat the save at the end of each of its turns." },
      { name: "Commanding Presence: Fear", type: "save", activation: "action", consumeUse: true, range: 30, duration: MIN(), targets: { type: "creature" },
        save: { ability: "wis", dc: CHA_DC, onSave: "none" }, effects: [{ ...status("Frightened by Commanding Presence", "frightened"), onTargets: true }],
        note: "Each creature of your choice you can see within 30 ft. It can repeat the save at the end of each of its turns." },
    ],
  },

  "class-features/Channel Conviction: Thundering Resolve": {
    descriptionHtml: "<p>At 3rd level you gain these two Channel Conviction options (each uses your Channel Conviction use):</p>"
      + opt("Echoing Rebuke (reaction)", "When a creature hits you with a melee attack, you gain resistance to all the damage dealt. The attacker must then succeed on a Constitution saving throw (DC 8 + proficiency bonus + Charisma modifier) or take thunder damage equal to the damage dealt, calculated before your resistance. Roll the save with the activity and apply the damage by hand.")
      + opt("Reverberating Smite", "When you hit with a melee attack and use your Ardent Smite, each creature of your choice within 15 ft of your target makes a Strength saving throw. It takes the damage of your Ardent Smite + your savant level on a failed save, half on a success. On a failure it is also pulled up to 10 ft to an empty square within 5 ft of you. The activity rolls the savant-level part; add your Ardent Smite dice by hand."),
    activities: [
      { name: "Echoing Rebuke", type: "save", activation: "reaction", reactionWhen: "A creature hits you with a melee attack", consumeUse: true, save: { ability: "con", dc: CHA_DC, onSave: "none" }, targets: { count: 1, type: "creature" } },
      { name: "Reverberating Smite", type: "save", activation: "special", consumeUse: true, area: { type: "radius", size: 15 }, targets: { type: "creature" },
        save: { ability: "str", dc: CHA_DC, onSave: "half" }, damage: [["@classes.savant.levels", "thunder"]] },
    ],
  },

  "class-features/Channel Conviction: Venomous Duality": {
    activities: [
      { name: "Manifest Soul", type: "utility", activation: "bonus", duration: MIN(), consumeUse: true, note: "For 1 minute your weapon attacks and creations force the target to make a Constitution saving throw; on a failure it is poisoned for 1 minute." },
      { name: "Venom Strike", type: "save", activation: "special", duration: MIN(), targets: { count: 1, type: "creature" }, save: { ability: "con", dc: CHA_DC, onSave: "none" },
        effects: [{ ...status("Poisoned by Venom Strike", "poisoned"), onTargets: true }], note: "Target of a weapon attack or creation while Manifest Soul is active. It can repeat the save at the end of each of its turns." },
      { name: "Antivenom", type: "heal", activation: "action", consumeUse: true, range: 5, rangeUnits: "touch", targets: { count: 1, type: "creature" },
        healing: { formula: "2 * @classes.savant.levels + @abilities.cha.mod", type: "temp" },
        note: "Touch a willing creature and absorb poison or disease from it, or inhale airborne poison in a 20-ft sphere around you. You gain the temporary hit points." },
    ],
  },

  "class-features/Cloak of Miasma": {
    activities: [
      { name: "Cloak of Miasma", type: "utility", activation: "bonus", duration: MIN(), consumeUse: true,
        effects: [{ name: "Cloak of Miasma", changes: [{ key: "system.traits.di.value", mode: 2, value: "poison" }, { key: "system.traits.ci.value", mode: 2, value: "poisoned" }], seconds: 60 }],
        note: "You and friendly creatures in your Toxic Aura are immune to poison damage and the poisoned condition. You can use it again by expending a 5th-level creation slot." },
      { name: "Toxic Aura Save", type: "save", activation: "special", duration: { value: 1, units: "minute" }, targets: { type: "creature" }, save: { ability: "con", dc: CHA_DC, onSave: "none" },
        effects: [{ ...status("Poisoned by Toxic Aura", "poisoned"), onTargets: true }], note: "A creature that moves into or starts its turn in your Toxic Aura; poisoned until it leaves the aura." },
    ],
  },

  "class-features/Conqueror's Haki Novice": {
    activities: [
      { name: "Overwhelming Presence", type: "save", activation: "bonus", consumeUse: true, area: { type: "radius", size: 0 }, targets: { type: "creature" }, duration: MIN(),
        save: { ability: "wis", onSave: "none" }, effects: [{ ...status("Knocked Out by Overwhelming Presence", "unconscious"), onTargets: true }],
        note: "Radius = half your proficiency bonus (rounded down) x 10 ft (full proficiency bonus x 10 with affinity). Failure: unconscious for 1 minute, waking if damaged or shaken awake." },
      { name: "Overwhelming Presence: Clash", type: "utility", activation: "reaction", reactionWhen: "Another creature uses Overwhelming Presence", consumeUse: true,
        note: "Both radii double and creatures forced to save do so with disadvantage. Allies in either radius can automatically succeed." },
      { name: "Subjugate Foe: Knock Prone", type: "save", activation: "special", range: 60, targets: { count: 1, type: "creature" }, save: { ability: "wis", onSave: "half" },
        damage: [["1d6", "force"]], effects: [{ name: "Prone", statuses: ["prone"], onTargets: true, rounds: 1 }], note: "Once per turn in place of a Shove attack." },
      { name: "Subjugate Foe: Shove Back", type: "save", activation: "special", range: 60, targets: { count: 1, type: "creature" }, save: { ability: "wis", onSave: "half" },
        damage: [["1d6", "force"]], note: "Once per turn in place of a Shove attack. On a failure the creature is shoved 10 ft backwards." },
    ],
    extraEffects: [{ name: "Unshakeable Will", transfer: true, changes: [{ key: "system.traits.ci.value", mode: 2, value: "frightened" }] }],
  },

  "class-features/Conqueror's Haki Apprentice": {
    activities: [
      { name: "Domination", type: "save", activation: "action", range: 60, duration: { value: 1, units: "hour", concentration: true }, targets: { count: 1, type: "creature" },
        save: { ability: "wis", onSave: "none" }, effects: [{ ...status("Dominated", "charmed"), onTargets: true, seconds: 3600 }],
        note: "A beast you can see within range of Overwhelming Presence; the DM may rule it fails automatically. Telepathic link; spend your action for total control until the end of your next turn." },
      { name: "Crushing Will", type: "utility", activation: "reaction", reactionWhen: "A creature within range uses a devil fruit ability",
        note: "Make an ability check with your highest score against DC 8 + target's proficiency bonus + target's highest ability modifier. Automatic success if the target's level is at most your proficiency bonus. Uses: half your proficiency bonus (full with affinity)." },
    ],
  },

  "class-features/Conqueror's Haki Master": {
    activities: [
      { name: "Kingdom Come", type: "utility", activation: "special", consumeUse: true, effects: [extraDamage("Kingdom Come", "2d6", "force")],
        note: "Attacks have a 10 ft damage spread (Overwhelming Presence DC, creatures of your choice immune), melee attacks gain 5 ft of reach, and all attacks and creations deal an extra 2d6 force damage." },
      { name: "Ascendant Resilience", type: "utility", activation: "special", note: "Three Legendary Resistances, regained at the end of a long rest." },
      { name: "Conquer Foe", type: "utility", activation: "special", note: "Subjugate Foe reaches creatures within 1 mile you can see. A creature that fails its save by 5 or more has disadvantage on attack rolls, ability checks and saving throws until the end of its next turn." },
    ],
  },

  "class-features/Death Wink": {
    activities: [
      { name: "Death Wink", type: "attack", activation: "special", range: 30, attack: { type: "ranged" }, damage: [["@scale.brawler.brawling-die + @abilities.dex.mod", "bludgeoning"]],
        note: "Replaces one of your unarmed strikes. The first creature you hit each turn makes a Strength saving throw against your Spirit DC (below)." },
      { name: "Death Wink: Pushed Back", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "str", dc: WIS_DC, onSave: "none" }, note: "On a failure the creature is pushed back 10 ft." },
      { name: "Death Wink: Knocked Prone", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "str", dc: WIS_DC, onSave: "none" },
        effects: [{ name: "Prone", statuses: ["prone"], onTargets: true, rounds: 1 }] },
    ],
  },

  "class-features/Diamond Dust": {
    activities: [
      { name: "Diamond Dust", type: "utility", activation: "bonus", duration: MIN(), consumeUse: true,
        effects: [{ name: "Diamond Dust", changes: [{ key: "system.traits.di.value", mode: 2, value: "cold" }], seconds: 60 }],
        note: "Immune to cold damage; the damage of Bitter Chill is doubled and counts as a creation. Use again by expending a 5th-level creation slot." },
      { name: "Winter Aura Slow", type: "save", activation: "special", targets: { type: "creature" }, save: { ability: "str", dc: CHA_DC, onSave: "none" },
        effects: [{ name: "Frozen in Place", onTargets: true, rounds: 1, changes: [{ key: "system.attributes.movement.walk", mode: 5, value: "0" }] }],
        note: "A creature that moves into or starts its turn in your Aura of Winter or Touch of Winter; on a failure its speed is 0 until the end of your next turn." },
    ],
  },

  "class-features/Dragon Grip": {
    activities: [
      { name: "Grapple", type: "utility", activation: "special", consumeUse: true, targets: { count: 1, type: "creature" },
        effects: [{ name: "Grappled by Dragon Grip", statuses: ["grappled"], onTargets: true }], note: "After landing a successful strike, grapple the target with advantage." },
      { name: "Crushing Grip", type: "damage", activation: "special", damage: [["1d4", "bludgeoning"]], note: "A creature you are grappling takes this at the start of each of its turns." },
    ],
  },

  "class-features/Duplicitious Strike": {
    activities: [
      { name: "Daze (3d6)", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", dc: "8 + @prof + @abilities.dex.mod", onSave: "none" }, effects: [{ ...status("Dazed", "stunned", 2), onTargets: true }], note: "Cost: 3d6 of Sneak Attack dice. Stunned until the end of your next turn." },
      { name: "Knock Out (6d6)", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", dc: "8 + @prof + @abilities.dex.mod", onSave: "none" }, effects: [{ ...status("Knocked Out", "unconscious"), onTargets: true }], note: "Cost: 6d6 of Sneak Attack dice. Unconscious for 1 minute; wakes early if damaged or shaken awake." },
      { name: "Obscure (3d6)", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "dex", dc: "8 + @prof + @abilities.dex.mod", onSave: "none" }, effects: [{ ...status("Obscured", "blinded", 2), onTargets: true }], note: "Cost: 3d6 of Sneak Attack dice. Blinded until the end of your next turn." },
    ],
  },

  "class-features/Endemic Surge": {
    activities: [
      { name: "Endemic Surge", type: "heal", activation: "action", duration: { value: 1, units: "hour" }, healing: { formula: "5 * @classes.medic.levels", type: "temp" },
        effects: [{ name: "Endemic Surge", changes: [{ key: "system.traits.dr.value", mode: 2, value: "necrotic" }, { key: "system.traits.dr.value", mode: 2, value: "poison" }, ...["mwak", "rwak", "msak", "rsak"].map((k) => ({ key: `system.bonuses.${k}.damage`, mode: 2, value: "+1d6[necrotic]" }))], seconds: 3600 }],
        note: "Expend a use of Experimental Medicine instead of transforming. Resistance to necrotic and poison; Infection Radius damage dice are rolled twice; attacks and creations deal an extra 1d6 necrotic damage. Lasts as long as an Experimental Medicine transformation." },
    ],
  },

  "class-features/Experimental Medicine": {
    activities: [
      { name: "Hulking Strength", type: "heal", activation: "action", consumeUse: true, healing: { formula: "4 * @classes.medic.levels", type: "temp" }, duration: { value: 1, units: "hour" },
        effects: [{ name: "Hulking Strength", changes: [{ key: "system.abilities.str.value", mode: 4, value: "@abilities.wis.value" }] }],
        note: "Strength becomes your Wisdom score if higher; unarmed strikes and melee weapons deal 1d8 of the weapon's type. Lasts half your Medic level in hours, or until you drop to 0 HP or end it as a bonus action." },
      { name: "Nimble Dexterity", type: "heal", activation: "action", consumeUse: true, healing: { formula: "4 * @classes.medic.levels", type: "temp" }, duration: { value: 1, units: "hour" },
        effects: [{ name: "Nimble Dexterity", changes: [{ key: "system.abilities.dex.value", mode: 4, value: "@abilities.wis.value" }, { key: "system.attributes.movement.walk", mode: 2, value: "10" }] }],
        note: "Dexterity becomes your Wisdom score if higher; speed +10 ft. Lasts half your Medic level in hours." },
      { name: "Resilient Constitution", type: "heal", activation: "action", consumeUse: true, healing: { formula: "4 * @classes.medic.levels", type: "temp" }, duration: { value: 1, units: "hour" },
        effects: [{ name: "Resilient Constitution", changes: [{ key: "system.abilities.con.value", mode: 4, value: "@abilities.wis.value" }, { key: "system.abilities.con.save.roll.mode", mode: 4, value: "1" }] }],
        note: "Constitution becomes your Wisdom score if higher; advantage on Constitution saving throws. Lasts half your Medic level in hours." },
    ],
  },
};
void ({} as ActSpec);
