import type { Spec } from "../../helpers/spec.js";

// Audit chunk 4 (compendium audit 2026-10-10), verified against corrected pack data. Only concrete mismatches are restated here.
const BPS = ["bludgeoning", "piercing", "slashing"];
const ch = (key: string, value: string, mode = 2) => ({ key, mode, value });
const MENTAL_DC = "8 + @prof + max(@abilities.int.mod, @abilities.wis.mod, @abilities.cha.mod)";
const ALL_DMG = ["acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic", "piercing", "poison", "psychic", "radiant", "slashing", "thunder"];
type Act = Spec["activities"][0];
const heal = (name: string, formula: string, note: string, activation: Act["activation"] = "action", extra: Partial<Act> = {}): Act =>
  ({ name, type: "heal", activation, healing: { formula }, note, ...extra });

export const auditFixSpecs4: Record<string, Spec> = {
  // ---- healing spells that were utility activities
  "creations/Heal": { activities: [heal("Heal", "70", "The target regains 70 hit points and is cured of blindness, deafness and diseases. No effect on constructs or undead. 7th level or higher: +15 healing per slot level above 6th.", "action", { targets: { count: 1, type: "creature" } })] },
  "creations/Hymn of Healing": { activities: [heal("Hymn of Healing", "2d10 + @mod", "Up to six creatures regain 2d10 + your creative modifier. No effect on undead or constructs. 3rd level or higher: +1d10 per slot level above 2nd.", "minute", { targets: { count: 6, type: "creature" } })] },
  "creations/Mass Healing Word": { activities: [heal("Mass Healing Word", "2d6 + @mod", "Up to six creatures regain 2d6 + your creative modifier. No effect on undead or constructs. 4th level or higher: +1d6 per slot level above 3rd.", "bonus", { targets: { count: 6, type: "creature" } })] },
  "creations/Aura of Vitality": { activities: [
    { name: "Aura of Vitality", type: "utility", activation: "action", area: { type: "radius", size: 30 }, note: "Healing energy radiates from you in a 30-foot aura that moves with you." },
    heal("Aura of Vitality: heal", "2d6", "Bonus action: one creature in the aura (including you) regains 2d6 hit points.", "bonus"),
  ] },
  "creations/Repair Vessel": { activities: [heal("Repair Vessel", "60", "Restore 60 hit points to a damaged ship and restore its hit point maximum by the same amount. 3rd level or higher: +20 per slot level above 2nd.")] },
  "creations/Regenerate": { activities: [
    heal("Regenerate", "4d8 + 15", "The target regains 4d8 + 15 hit points. Severed parts are restored after 2 minutes.", "minute", { targets: { count: 1, type: "creature" } }),
    heal("Regenerate: each turn", "1", "For the duration the target regains 1 hit point at the start of each of its turns.", "special"),
  ] },
  "creations/Enduring Spirit": { activities: [heal("Enduring Spirit", "10", "Gain 10 temporary hit points for the duration. 3rd level: 20; 5th: 30; 7th: 40; 9th: 50.", "bonus", { healing: { formula: "10", type: "temp" }, duration: { value: 1, units: "hour" } })] },

  // ---- buff spells with a bogus Strength save: utility + effects
  "creations/Haste": { activities: [{ name: "Haste", type: "utility", activation: "action", targets: { count: 1, type: "ally" }, duration: { value: 1, units: "minute", concentration: true },
    effects: [{ name: "Haste", seconds: 60, onTargets: true, changes: [ch("system.attributes.ac.bonus", "2"), ch("system.attributes.movement.walk", "2", 1), ch("flags.midi-qol.advantage.ability.save.dex", "1", 0)] }],
    note: "Speed doubled, +2 AC, advantage on Dexterity saves, and an additional action each turn (one weapon attack, Dash, Disengage, Hide or Use an Object only). When it ends the target can't move or take actions until after its next turn." }] },
  "creations/Floating Shield": { activities: [{ name: "Floating Shield", type: "utility", activation: "bonus", targets: { count: 1, type: "creature" },
    effects: [{ name: "Floating Shield", seconds: 600, onTargets: true, changes: [ch("system.attributes.ac.bonus", "2")] }],
    note: "+2 bonus to AC for the duration. Higher slots lengthen the duration (3rd: 1 hour concentration; 5th: 8 hours; 7th: 24 hours; 9th: 7 days, no concentration)." }] },
  "creations/Circle of Power": { activities: [{ name: "Circle of Power", type: "utility", activation: "action", area: { type: "sphere", size: 30 }, duration: { value: 10, units: "minute", concentration: true },
    effects: [{ name: "Circle of Power", seconds: 600, onTargets: true, changes: [ch("flags.midi-qol.advantage.ability.save.all", "1", 0)] }],
    note: "Each friendly creature in the 30-foot sphere (including you) has advantage on all saving throws; when an affected creature succeeds on a save that would halve damage it takes no damage, and half on a failure." }] },
  "creations/Guidance": { activities: [{ name: "Guidance", type: "utility", activation: "action", targets: { count: 1, type: "creature" }, roll: { formula: "1d4", name: "Guidance die" },
    note: "Once before the creation ends the target can roll a d4 and add it to one ability check or saving throw, before or after rolling. The trick then ends." }] },
  "creations/Bless": { activities: [{ name: "Bless", type: "utility", activation: "action", targets: { count: 3, type: "creature" }, duration: { value: 1, units: "minute", concentration: true },
    effects: [{ name: "Bless", seconds: 60, onTargets: true, changes: [...["mwak", "rwak", "msak", "rsak"].map((t) => ch(`system.bonuses.${t}.attack`, "+1d4")), ch("system.bonuses.abilities.save", "+1d4")] }],
    note: "Targets add a d4 to attack rolls and saving throws. Each slot level above 1st targets one additional creature." }] },
  "creations/Intellect Fortress": { activities: [{ name: "Intellect Fortress", type: "utility", activation: "action", targets: { count: 1, type: "creature" }, duration: { value: 1, units: "hour", concentration: true },
    effects: [{ name: "Intellect Fortress", seconds: 3600, onTargets: true, changes: [ch("system.traits.dr.value", "psychic"), ...["int", "wis", "cha"].map((a) => ch(`flags.midi-qol.advantage.ability.save.${a}`, "1", 0))] }],
    note: "You or one willing creature has resistance to psychic damage and advantage on Intelligence, Wisdom and Charisma saving throws. Each slot level above 3rd targets one additional creature (within 30 feet of each other)." }] },
  "creations/Protection from Poison": { activities: [{ name: "Protection from Poison", type: "utility", activation: "action", targets: { count: 1, type: "creature" },
    effects: [{ name: "Protection from Poison", seconds: 3600, onTargets: true, changes: [ch("system.traits.dr.value", "poison")] }],
    note: "Neutralize one poison on the target. For the duration the target has resistance to poison damage and advantage on saving throws against being poisoned (apply that manually). 4th level: 8 hours; 6th: 24 hours." }] },
  "creations/Foresight": { activities: [{ name: "Foresight", type: "utility", targets: { count: 1, type: "creature" },
    effects: [{ name: "Foresight", seconds: 28800, onTargets: true, changes: [
      ch("flags.midi-qol.advantage.attack.all", "1", 0), ch("flags.midi-qol.advantage.ability.check.all", "1", 0), ch("flags.midi-qol.advantage.ability.save.all", "1", 0), ch("flags.midi-qol.grants.disadvantage.attack.all", "1", 0)] }],
    note: "For 8 hours the target can't be surprised, has advantage on attack rolls, ability checks and saving throws, and other creatures have disadvantage on attack rolls against it." }] },
  "creations/Beacon of Hope": { activities: [{ name: "Beacon of Hope", type: "utility", activation: "action", duration: { value: 1, units: "minute", concentration: true },
    effects: [{ name: "Beacon of Hope", seconds: 60, onTargets: true, changes: [ch("flags.midi-qol.advantage.ability.save.wis", "1", 0), ch("system.attributes.death.roll.mode", "1", 4)] }],
    note: "Each chosen creature has advantage on Wisdom saving throws and death saving throws, and regains the maximum number of hit points possible from any healing." }] },
  "creations/Irresistible Dance": { activities: [{ name: "Irresistible Dance", type: "save", activation: "action", targets: { count: 1, type: "creature" }, save: { ability: "wis", onSave: "none" }, duration: { value: 1, units: "minute", concentration: true },
    effects: [{ name: "Irresistible Dance", seconds: 60, onTargets: true, changes: [ch("flags.midi-qol.disadvantage.ability.save.dex", "1", 0), ch("flags.midi-qol.disadvantage.attack.all", "1", 0), ch("flags.midi-qol.grants.advantage.attack.all", "1", 0)] }],
    note: "On a failed save the target must use all its movement to dance in place, has disadvantage on Dexterity saves and attack rolls, and attacks against it have advantage. As an action it can repeat the Wisdom save to end the creation." }] },

  // ---- wrongly-typed save activities with no save in the text
  "creations/Disguise": { activities: [{ name: "Disguise", type: "utility", activation: "action", rangeUnits: "self", note: "Change your appearance. A creature must use its action to inspect you and succeed on an Intelligence (Investigation) check against your creation save DC to see through it; on a failure it can't try again for 1 hour." }] },
  "creations/Raise Dead": { activities: [{ name: "Raise Dead", type: "utility", note: "Return a creature dead no longer than 24 days to life with 1 hit point. It takes a -4 penalty to attack rolls, saving throws and ability checks, reduced by 1 after each long rest." }] },
  "creations/Shapechange": { activities: [{ name: "Shapechange", type: "utility", activation: "action", rangeUnits: "self", duration: { value: 1, units: "hour", concentration: true }, note: "Assume the form of a creature with a challenge rating equal to your level or lower (no constructs or undead)." }] },
  "creations/Time Stop": { activities: [{ name: "Time Stop", type: "utility", activation: "action", rangeUnits: "self", note: "You take 5 turns in a row. Creatures frozen in time count as incapacitated, automatically fail all saving throws and ability contests, and attacks against them have advantage." }] },

  // ---- resistance / immunity / speed buffs
  "creations/Prime Ward": { activities: [
    { name: "Prime Ward", type: "utility", activation: "action", duration: { value: 1, units: "minute" },
      effects: [{ name: "Prime Ward", seconds: 60, changes: ["acid", "cold", "fire", "lightning", "thunder"].map((t) => ch("system.traits.dr.value", t)) }],
      note: "You have resistance to acid, cold, fire, lightning and thunder damage for the duration." },
    { name: "Prime Ward: immunity", type: "utility", activation: "reaction", reactionWhen: "you take damage of one of the warded types",
      note: "Gain immunity to that damage type, including the triggering damage. Your resistances end until the end of your next turn, when you lose the immunity and regain the resistances if the creation is still active." },
  ] },
  "creations/Defending Ward": { activities: [{ name: "Defending Ward", type: "utility", activation: "action", duration: { value: 1, units: "round" },
    effects: [{ name: "Defending Ward", seconds: 6, changes: BPS.map((t) => ch("system.traits.dr.value", t)) }],
    note: "Until the end of your next turn, you have resistance against bludgeoning, piercing and slashing damage." }] },
  "creations/Invulnerability": { activities: [{ name: "Invulnerability", type: "utility", activation: "action", duration: { value: 10, units: "minute" },
    effects: [{ name: "Invulnerability", seconds: 600, changes: ALL_DMG.map((t) => ch("system.traits.di.value", t)) }],
    note: "You are immune to all damage until the creation ends." }] },
  "creations/Fly": { activities: [{ name: "Fly", type: "utility", activation: "action", targets: { count: 1, type: "creature" }, duration: { value: 10, units: "minute", concentration: true },
    effects: [{ name: "Fly", seconds: 600, onTargets: true, changes: [ch("system.attributes.movement.fly", "60", 4)] }],
    note: "The target gains a flying speed of 60 feet. It falls when the creation ends if still aloft. Each slot level above 3rd targets one additional creature." }] },
  "creations/Boost": { activities: [{ name: "Boost", type: "utility", activation: "action", targets: { count: 1, type: "creature" }, duration: { value: 1, units: "hour" },
    effects: [{ name: "Boost", seconds: 3600, onTargets: true, changes: [ch("system.attributes.movement.walk", "10")] }],
    note: "The target's speed increases by 10 feet. Each slot level above 1st targets one additional creature." }] },
  "creations/Allure": { activities: [{ name: "Allure", type: "utility", activation: "action", duration: { value: 1, units: "minute" },
    effects: [{ name: "Allure", seconds: 60, changes: [ch("system.skills.per.bonuses.check", "+1d6")] }],
    note: "1d6 bonus to Persuasion checks against creatures that are not hostile towards you (apply only against such creatures)." }] },
  "creations/Pass Without a Trace": { activities: [{ name: "Pass Without a Trace", type: "utility", activation: "action", area: { type: "radius", size: 30 }, duration: { value: 1, units: "hour" },
    effects: [{ name: "Pass Without a Trace", seconds: 3600, onTargets: true, changes: [ch("system.skills.ste.bonuses.check", "+10")] }],
    note: "Each creature of your choice in the 30-foot aura (including you) has a +10 bonus to Dexterity (Stealth) checks, can't be tracked except by magical means, and leaves no traces." }] },
  "creations/Aid": { activities: [{ name: "Aid", type: "utility", activation: "action", targets: { count: 3, type: "creature" }, duration: { value: 8, units: "hour" },
    effects: [{ name: "Aid", seconds: 28800, onTargets: true, changes: [ch("system.attributes.hp.bonuses.overall", "5")] }],
    note: "Each target's hit point maximum increases by 5 (the effect adds it). Also raise current hit points by 5 manually. Each slot level above 2nd adds 5 more." }] },
  "creations/Kinetic Jaunt": { activities: [
    { name: "Kinetic Jaunt", type: "utility", activation: "bonus", duration: { value: 1, units: "minute" },
      effects: [{ name: "Kinetic Jaunt", seconds: 60, changes: [ch("system.attributes.movement.walk", "10")] }],
      note: "Walking speed +10 feet, no opportunity attacks, and you can move through other creatures' spaces." },
    { name: "Kinetic Jaunt: shunted", type: "damage", activation: "special", damage: [["1d8", "bludgeoning"]], note: "If you end your turn in another creature's space, you are shunted to the last unoccupied space you occupied and take this damage." },
  ] },
  "creations/Blazing Stride": { activities: [
    { name: "Blazing Stride", type: "utility", activation: "action", duration: { value: 1, units: "minute" },
      effects: [{ name: "Blazing Stride", seconds: 60, changes: [ch("system.attributes.movement.walk", "20")] }],
      note: "Speed +20 feet and moving doesn't provoke opportunity attacks. Each slot level above 3rd adds 5 feet." },
    { name: "Blazing Stride: trail of heat", type: "damage", activation: "special", damage: [["1d6", "fire", "1d6"]], note: "A creature or object you move within 5 feet of takes this damage, once per turn." },
  ] },

  // ---- embodiments
  "creations/Embody Frost": { activities: [
    { name: "Embody Frost", type: "utility", activation: "action", duration: { value: 10, units: "minute" },
      effects: [{ name: "Embody Frost", seconds: 600, changes: [ch("system.traits.di.value", "cold"), ch("system.traits.dr.value", "fire")] }],
      note: "Immune to cold damage, resistance to fire damage. Ice and snow difficult terrain costs you no extra movement; the ground in 15 feet around you is difficult terrain for others." },
    { name: "Freezing Wind", type: "save", activation: "bonus", area: { type: "cone", size: 20 }, save: { ability: "con", onSave: "half" }, damage: [["4d6", "cold"]],
      effects: [{ name: "Freezing Wind: slowed", seconds: 6, onTargets: true, changes: [ch("system.attributes.movement.walk", "0.5", 1)] }],
      note: "20-foot cone of freezing wind. A creature that fails has its speed halved until the start of your next turn." },
  ] },
  "creations/Embody Stone": { activities: [
    { name: "Embody Stone", type: "utility", activation: "action", duration: { value: 10, units: "minute" },
      effects: [{ name: "Embody Stone", seconds: 600, changes: BPS.map((t) => ch("system.traits.dr.value", t)) }],
      note: "Resistance to bludgeoning, piercing and slashing damage. Move through earth and stone as if it were air." },
    { name: "Earthquake", type: "save", activation: "bonus", area: { type: "radius", size: 20 }, save: { ability: "dex", onSave: "half" }, damage: [["4d6", "bludgeoning"]],
      effects: [{ name: "Earthquake: prone", statuses: ["prone"], onTargets: true }],
      note: "Other creatures on the ground in a 20-foot radius that fail are knocked prone and take the damage; on a success they take half and aren't knocked prone." },
  ] },
  "creations/Embody Flames": { activities: [
    { name: "Embody Flames", type: "utility", activation: "action", duration: { value: 10, units: "minute" },
      effects: [{ name: "Embody Flames", seconds: 600, changes: [ch("system.traits.di.value", "fire"), ch("system.traits.dr.value", "cold")] }],
      note: "Shed bright light 30 feet and dim light 30 feet more. Immune to fire damage, resistance to cold damage." },
    { name: "Embody Flames: scorching aura", type: "damage", activation: "special", damage: [["2d10", "fire"]], note: "A creature that moves within 10 feet of you for the first time on a turn or ends its turn there takes this damage." },
    { name: "Line of Fire", type: "save", activation: "bonus", area: { type: "line", size: 30, width: 5 }, save: { ability: "dex", onSave: "half" }, damage: [["4d8", "fire"]], note: "30-foot by 5-foot line of fire." },
  ] },

  // ---- damage spells missing parts
  "creations/Acid Reflex": { activities: [
    { name: "Acid Reflex", type: "save", activation: "reaction", reactionWhen: "which you take in response to being damaged by a creature within 60 feet of you that you can see", targets: { count: 1, type: "creature" }, save: { ability: "con", onSave: "half" }, damage: [["5d4", "acid", "1d4"]] },
    { name: "Acid Reflex: end of next turn", type: "damage", activation: "special", damage: [["3d4", "acid", "1d4"]], note: "On a failed save the target takes this additional damage at the end of its next turn." },
  ] },
  "creations/Energy Surge": { activities: [{ name: "Energy Surge", type: "save", activation: "action", area: { type: "radius", size: 30 }, save: { ability: "con", onSave: "half" },
    damage: [["5d6", "thunder"], ["5d6", ["radiant", "necrotic"]]], effects: [{ name: "Energy Surge: prone", statuses: ["prone"], onTargets: true }],
    note: "5d6 thunder plus 5d6 radiant or necrotic (your choice), and knocked prone on a failed save; half damage and not prone on a success." }] },
  "creations/Toxic Trigger": { activities: [
    { name: "Toxic Trigger", type: "damage", activation: "bonus", damage: [["1d10", "poison", "1d10"]], note: "After you hit with a ranged weapon attack, deal this extra poison damage." },
    { name: "Toxic Trigger: Constitution save", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", onSave: "none" },
      note: "On a failure the target must use its full movement on its next turn to move toward the closest creature in range and use its action to attack it." },
  ] },
  "creations/Frigid Bullet": { activities: [
    { name: "Frigid Bullet", type: "damage", activation: "bonus", damage: [["1d6", "cold", "1d6"]], note: "After you hit with a ranged weapon attack, deal this extra cold damage." },
    { name: "Frigid Bullet: Constitution save", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", onSave: "none" }, duration: { value: 1, units: "minute" },
      effects: [{ name: "Frigid Bullet: restrained", statuses: ["restrained"], seconds: 60, onTargets: true }],
      note: "On a failure the target is restrained for the duration and can't take reactions while restrained." },
  ] },
  "creations/Giant's Hand": { activities: [
    { name: "Clenched Fist", type: "attack", activation: "bonus", range: 5, attack: { type: "melee" }, damage: [["4d8 + @mod", "bludgeoning", "2d8"]], note: "The hand makes a melee creation attack. Move the hand up to 60 feet first." },
    { name: "Grasping Hand: crush", type: "damage", activation: "bonus", damage: [["2d8", "bludgeoning", "2d8"]], note: "While the hand grapples a target, it crushes it for this damage." },
  ] },

  // ---- items
  "items/Boots of Speed": { activities: [{ name: "Click Heels", type: "utility", activation: "bonus", consumeUse: true,
    effects: [{ name: "Boots of Speed", changes: [ch("system.attributes.movement.walk", "2", 1)] }],
    note: "Double your walking speed; creatures making opportunity attacks against you have disadvantage. Click again to end it. Each use represents one minute of the boots' 10-minute total; spend one more use for every further minute active." }],
    uses: { max: "10", per: "lr" } },
  "items/The Raging Drum": { activities: [
    { name: "Commanding Beat", type: "utility", activation: "action", consumeUse: true, consumeAmount: "1", note: "1 charge: cast Command using your Creativity DC." },
    { name: "Broken Battle Bridge", type: "utility", activation: "action", consumeUse: true, consumeAmount: "3", note: "3 charges: cast Fear using your Creativity DC." },
  ] },
  "items/Pocket Hospital": { activities: [
    ...[1, 2, 3, 4].map((n): Act => ({ name: `Cure Wounds (${n}${["st", "nd", "rd", "th"][n - 1]} level)`, type: "utility", activation: "action", consumeUse: true, consumeAmount: String(n), note: `${n} charge${n > 1 ? "s" : ""}: cast Cure Wounds at level ${n} (up to 4th) using your creativity save DC.` })),
    { name: "Lesser Restoration", type: "utility", activation: "action", consumeUse: true, consumeAmount: "2", note: "2 charges." },
    { name: "Mass Cure Wounds", type: "utility", activation: "action", consumeUse: true, consumeAmount: "5", note: "5 charges." },
  ] },
  "items/Defender Field (Staff of Defense)": { activities: [
    { name: "Gadget Armor", type: "utility", activation: "action", consumeUse: true, consumeAmount: "1", note: "1 charge: cast Gadget Armor, no components." },
    { name: "Shield", type: "utility", activation: "action", consumeUse: true, consumeAmount: "2", note: "2 charges: cast Shield, no components." },
  ], extraEffects: [{ name: "Defender Field: +1 AC", transfer: true, changes: [ch("system.attributes.ac.bonus", "1")] }] },
  "items/Impact Dial": { activities: [
    { name: "Absorb Impact", type: "utility", activation: "reaction", reactionWhen: "you are hit by a weapon attack (bludgeoning, piercing or slashing)", consumeUse: true, note: "Absorb the impact and take no damage. Can store 1 attack at a time. Each absorbed hit uses one of the dial's 3 uses." },
    { name: "Release Impact", type: "utility", activation: "action", note: "Release the stored impact as an unarmed strike dealing the absorbed damage as force; you take half that damage. On a 1 when using the last use, the dial is destroyed." },
  ] },
  "items/Energy Steroids": { activities: [{ name: "Energy Steroids", type: "utility", activation: "action", consumeUse: true, duration: { value: 10, units: "minute" },
    effects: [{ name: "Energy Steroids", seconds: 600, changes: ["str", "dex", "con"].map((a) => ch(`system.abilities.${a}.value`, "2")) }],
    note: "All physical ability scores +2 for 10 minutes (taking more resets the duration and adds another +2, max 30). When it wears off you gain 5 levels of exhaustion and lose 2^(steroids taken) years of life." }],
    uses: { max: "1" } },
  "items/King Crab Casserole": { activities: [{ name: "King Crab Casserole", type: "utility", activation: "action", consumeUse: true, duration: { value: 1, units: "hour" },
    effects: [{ name: "King Crab Casserole", seconds: 3600, changes: BPS.map((t) => ch("system.traits.dr.value", t)) }],
    note: "Resistance to bludgeoning, piercing and slashing damage for 1 hour." }], uses: { max: "1" } },
  "items/Incendiary Ammo": { activities: [
    { name: "Incendiary Ammo", type: "damage", activation: "action", consumeUse: true, damage: [["1d6", "fire"]], note: "+1 ammo dealing an additional 1d6 fire damage." },
    { name: "Incendiary Ammo: ignite", type: "save", activation: "special", save: { ability: "con", dc: MENTAL_DC, onSave: "none" }, duration: { value: 1, units: "minute" }, note: "On a failure the target ignites for 1 minute (use the burn button at the end of each of its turns); a creature can use an action to extinguish it." },
    { name: "Incendiary Ammo: burning", type: "damage", activation: "special", damage: [["1d6", "fire"]], note: "Ignited target takes this at the end of each of its turns." },
  ], uses: { max: "1" } },
  "items/Cold Ammo": { activities: [
    { name: "Cold Ammo", type: "damage", activation: "action", consumeUse: true, damage: [["1d6", "cold"]], note: "+1 ammo dealing an additional 1d6 cold damage." },
    { name: "Cold Ammo: freeze", type: "save", activation: "special", save: { ability: "con", dc: MENTAL_DC, onSave: "none" }, duration: { value: 1, units: "minute" },
      effects: [{ name: "Frozen by Cold Ammo", seconds: 60, onTargets: true, changes: [ch("system.attributes.movement.walk", "-10"), ch("flags.midi-qol.disadvantage.attack.all", "1", 0), ch("flags.midi-qol.disadvantage.ability.check.all", "1", 0)] }],
      note: "On a failure: speed reduced by 10 feet and disadvantage on ability checks and attack rolls for 1 minute (save each turn)." },
  ], uses: { max: "1" } },
  "items/Boxing Ammo": { activities: [{ name: "Boxing Ammo", type: "save", activation: "action", consumeUse: true, save: { ability: "str", dc: MENTAL_DC, onSave: "none" },
    effects: [{ name: "Boxing Ammo: prone", statuses: ["prone"], onTargets: true }],
    note: "+1 ammo. On a failure the target is knocked prone or knocked back 10 feet (prone is applied automatically)." }], uses: { max: "1" } },
  "items/Ensnarement Ammo": { activities: [{ name: "Ensnarement Ammo", type: "save", activation: "action", consumeUse: true, save: { ability: "str", dc: MENTAL_DC, onSave: "none" },
    effects: [{ name: "Ensnared", statuses: ["restrained"], onTargets: true }],
    note: "+1 ammo. On a failure the target is restrained; it can use its action to repeat the save each turn." }], uses: { max: "1" } },
  "items/Flash Dial": { activities: [{ name: "Flash Dial", type: "save", activation: "action", consumeUse: true, save: { ability: "con", dc: MENTAL_DC, onSave: "none" }, note: "Cast Blindness/Deafness (Blindness only) using WIS, INT or CHA." }] },
  "items/Burn Bazooka": { activities: [{ name: "Burn Bazooka", type: "save", activation: "action", consumeUse: true, save: { ability: "dex", dc: MENTAL_DC, onSave: "half" }, damage: [["3d6", "fire"]], note: "Elemental Blast (fire only) using WIS, INT or CHA." }] },
  "items/Raid Suit": { activities: [{ name: "Glove Strike", type: "attack", activation: "action", attack: { type: "melee", bonus: "2" }, damage: [["1d6 + 2", "bludgeoning"]], note: "The gloves count as simple +2 weapons." }],
    extraEffects: [{ name: "Raid Suit: +2 AC", transfer: true, changes: [ch("system.attributes.ac.bonus", "2")] }, { name: "Raid Suit Speed", transfer: true, changes: [ch("system.attributes.movement.walk", "10")] }] },
  "items/Milky Dial": { activities: [{ name: "Create Sea Clouds", type: "utility", activation: "action", note: "Create a 10 ft by 10 ft by 10 ft area of sea clouds that can be used for skating with dial vehicles." }] },
  "items/Rocket Ring (Ring of Jumping)": { activities: [{ name: "Jump", type: "utility", activation: "bonus", rangeUnits: "self", note: "Use the Jump creation from the ring at will; it can target only yourself." }] },
  "campaign-items/Sharkrazor Mantle": { activities: [
    { name: "Shark Bite", type: "attack", activation: "bonus", attack: { type: "melee", bonus: "@prof + max(@abilities.str.mod, @abilities.dex.mod)", flat: true }, damage: [["1d6 + max(@abilities.str.mod, @abilities.dex.mod)", "piercing"]],
      note: "After a melee attack while underwater, bite the same creature if it is below its hit point maximum (not a construct, plant or undead)." },
    { name: "Sharkskin: grappled", type: "damage", activation: "special", damage: [["3d4", "piercing"]], note: "A creature that grapples or restrains you takes this when it succeeds and again at the end of each of its turns while holding you." },
  ], extraEffects: [{ name: "Sharkrazor Mantle: swim 60 ft", transfer: true, changes: [ch("system.attributes.movement.swim", "60", 4)] }] },

  // ---- devil fruits
  "devil-fruits/Fura Fura no Mi": { activities: [
    { name: "Vertigo Field", type: "save", activation: "special", area: { type: "radius", size: 20 }, save: { ability: "con", dc: "16", onSave: "none" }, duration: { value: 1, units: "minute" }, note: "Aura (20 ft): creatures he chooses must succeed on the save or be affected by slow for 1 minute." },
    { name: "Temporal Deflection", type: "utility", activation: "reaction", reactionWhen: "he is hit by an attack", note: "Impose disadvantage on that attack roll." },
  ] },
  "devil-fruits/Phezu Phezu no Mi": { activities: [
    { name: "Flight of the Bumblebee", type: "save", activation: "special", save: { ability: "con", dc: "15", onSave: "none" }, damage: [["4d8", "force"]], note: "Recharge 5-6. Touched target; the user also heals 2d8 hit points (use the heal button)." },
    heal("Flight of the Bumblebee: heal", "2d8", "The user regains 2d8 hit points.", "special"),
    { name: "Requiem in D Minor", type: "save", activation: "special", save: { ability: "con", dc: "15", onSave: "none" }, damage: [["6d8", "force"]], note: "Once per day. He may distribute half the damage dealt as healing among creatures he touches within the next round." },
  ] },
};
