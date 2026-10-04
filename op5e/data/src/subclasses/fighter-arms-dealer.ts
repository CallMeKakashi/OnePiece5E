import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, createItemChoiceRestricted, createScaleValue, mergeAdvancements } from "../../helpers/advancement.js";
import { ammoUuids, engineeringDef, uuidOf } from "../class-features/class-content.js";

const SUB = "subclass/fighter/arms-dealer";
const F = "feature/fighter/arms-dealer";

function fUuid(path: string): string {
  return compendiumUuid("class-features", generateId(path));
}

function feat(slug: string, name: string, desc: string, req: string): FeatureItem {
  return {
    _id: generateId(`${F}/${slug}`),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: req,
      activation: { type: "", cost: null, condition: "" },
      duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" },
      range: { value: null, long: null, units: "" },
      uses: { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: "",
      damage: { parts: [], versatile: "" },
      save: { ability: "", dc: null, scaling: "spell" },
      chatFlavor: "",
      recharge: { value: null, charged: false },
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null, duplicateSource: null, coreVersion: "13",
      systemId: "dnd5e", systemVersion: "5.1.10",
      createdTime: null, modifiedTime: null, lastModifiedBy: null,
    },
  };
}

const engineeringProficiency = feat(
  "engineering-proficiency", "Engineering Proficiency",
  `<p>Upon choosing this archetype at 3rd level, you gain proficiency with the Engineering (Intelligence) skill, Tinker's Tools, firearms, and cannons. You may use them to craft ammunition at half the cost and even draft and create new ones (DM's discretion).</p>`,
  "Arms Dealer 3",
);

const advancedArsenal = feat(
  "advanced-arsenal", "Advanced Arsenal",
  `<p>At 3rd level, you learn to craft special effects with some of your shots. When you gain this feature, you learn two Advanced Arsenal options of your choice.</p>
<p>Once per turn when you fire a piece of ammo from a ranged weapon as part of the Attack action, you can apply one of your Advanced Arsenal options to that piece of ammo. You decide to use the option when the ammo hits, unless the option doesn't involve an attack roll. If an option requires a saving throw, your Advanced Arsenal save DC equals 8 + your proficiency bonus + your Intelligence modifier.</p>
<p>You have a number uses of this ability equal to 1 + your Intelligence Modifier, and you regain all expended uses of it when you finish a short or long rest.</p>
<p>You gain an additional Advanced Arsenal option of your choice when you reach certain levels in this class: 7th, 10th, 15th, and 18th level.</p>
<h4>Stasis Ammo</h4>
<p>The creature hit by the ammo must succeed on a Charisma saving throw or be banished. While banished in this way, its speed is 0, and it is incapacitated. At the end of its next turn, the target reappears in the space it vacated or in the nearest unoccupied space if that space is occupied.</p>
<p>At 18th level, this ammo deals an extra 2d8 force damage when it hits.</p>
<h4>Hypnotic Ammo</h4>
<p>The creature hit by the ammo takes an extra 2d6 psychic damage, and choose one of your allies within 30 feet of the target. The target must succeed on a Wisdom saving throw, or it is charmed by the chosen ally until the start of your next turn. This effect ends early if the chosen ally attacks the charmed target, deals damage to it, or forces it to make a saving throw.</p>
<p>At 18th level, the extra damage of this ammo becomes 4d6 psychic damage instead.</p>
<h4>Elemental Ammo</h4>
<p>The creature hit by the ammo takes an extra 2d8 fire, poison, acid, cold, or lightning damage, and the weapon damage also becomes that damage type.</p>
<p>At 18th level, this ammo deals 4d8 of the chosen type.</p>
<h4>Exploding Ammo</h4>
<p>The ammo detonates after your attack. Your attack with the ammo gains a damage spread of 10ft, DC equal to your Advanced Arsenal DC. The attack additionally deals an extra 2d6 fire, thunder, or force damage.</p>
<p>At 18th level, the extra damage of this ammo becomes 4d6 of the chosen type instead.</p>
<h4>Feeble Ammo</h4>
<p>The creature hit by the ammo takes an extra 2d6 necrotic damage. The target must also succeed on a Constitution saving throw, or the damage dealt by its weapon attacks is halved until the start of your next turn.</p>
<p>At 18th level, the extra damage of this ammo becomes 4d6 necrotic instead.</p>
<h4>Grasping Ammo</h4>
<p>The creature hit by the arrow ammo an extra 2d6 piercing damage, its speed is reduced by 10 feet, and it takes 2d6 slashing damage the first time on each turn it moves 1 foot or more without teleporting. The target or any creature that can reach it can use its action to remove the brambles with a successful Strength (Athletics) check against your Advanced Arsenal save DC. Otherwise, the effect lasts for 1 minute or until you use this option again.</p>
<p>At 18th level, the extra damage of this ammo becomes 4d6 piercing instead.</p>
<h4>Piercing Ammo</h4>
<p>When you use this option, you don't make an attack roll for the attack. Instead, the ammo fires forward in a line, which is 1 foot wide and 30 feet long, before disappearing. The arrow passes harmlessly through objects, ignoring cover. Each creature in that line must make a Dexterity saving throw. On a failed save, a creature takes damage as if it were hit by the ammo, plus an extra 1d6 piercing damage. On a successful save, a target takes half as much damage.</p>
<p>At 18th level, the extra damage of this ammo becomes 2d6 piercing instead.</p>
<h4>Homing Ammo</h4>
<p>When you use this option, you don't make an attack roll for the attack. Instead, choose one creature you have seen in the past minute.</p>
<p>The ammo flies toward that creature, moving around corners if necessary and ignoring three-quarters cover and half cover. If the target is within the weapon's range and there is a path large enough for the ammo to travel to the target, the target must make a Dexterity saving throw.</p>
<p>On a failed save, it takes damage as if it were hit by the ammo, plus an extra 1d6 force damage, and you learn the target's current location. On a successful save, the target takes half as much damage, and you don't learn its location.</p>
<p>At 18th level, this instead deals 2d6 force damage.</p>
<h4>Shadow Ammo</h4>
<p>The creature hit by the arrow takes an extra 2d6 psychic damage, and it must succeed on a Wisdom saving throw or be blinded until the start of your next turn.</p>
<p>At 18th level, this instead deals 4d6 psychic damage.</p>
<h4>Warp Ammo (7th level)</h4>
<p>In the place of an attack, you can expend a use of your Advanced Arsenal to teleport to a point you can see within the short range of the ranged weapon you are using to fire the ammo.</p>
<p>At 18th level, you can choose to instead teleport to a space within the long range of your weapon.</p>`,
  "Arms Dealer 3",
);

const reboundingShots = feat(
  "rebounding-shots", "Rebounding Shots",
  `<p>At 7th level, you learn how to direct an errant ammo toward a new target. Once per turn, when you make an attack roll with a piece of ammunition and miss, you can reroll the attack roll against a different target within 60 feet of the original target.</p>`,
  "Arms Dealer 7",
);

const mastercraftedShots = feat(
  "mastercrafted-shots", "Mastercrafted Shots",
  `<p>At 7th level, you have learned to improve your Advanced Arsenal to deadly perfection. Each of your Advanced Arsenal ammo's gain a bonus to attack and damage rolls equal to half your proficiency bonus rounded down.</p>`,
  "Arms Dealer 7",
);

const advancedArmory = feat(
  "advanced-armory", "Advanced Armory",
  `<p>At 10th level, you have enhanced your defensive capabilities. When a creature hits you with an attack roll, you can use your reaction to roll a d6. On a 4 or higher, the attack instead misses you, regardless of its roll.</p>`,
  "Arms Dealer 10",
);

const constantShots = feat(
  "constant-shots", "Constant Shots",
  `<p>Starting at 15th level, if you roll Initiative and have no uses of Advanced Arsenal remaining, you regain two uses of it.</p>`,
  "Arms Dealer 15",
);

const improvedAdvancedArsenal = feat(
  "improved-advanced-arsenal", "Improved Advanced Arsenal",
  `<p>At 18th level, your Advanced Arsenal shots improve as listed in each option.</p>`,
  "Arms Dealer 18",
);

export const armsDealer: SubclassItem = {
  _id: generateId(SUB),
  name: "Arms Dealer",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>The inventive Arms Dealer devotes their fighting style to crafting creative ammunition to create a well equipped arsenal. Arms Dealer are able to use a balance of not only craft their shots, but also their keen skills with ranged combat to defeat even the most powerful foes.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "arms-dealer",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
      createItemGrant(SUB, 3, [
        { uuid: fUuid(`${F}/engineering-proficiency`) },
        { uuid: fUuid(`${F}/advanced-arsenal`) },
      ]),
      createItemGrant(SUB, 3, [{ uuid: uuidOf(engineeringDef) }], "engineering"),
      createItemChoiceRestricted(SUB, 3, ammoUuids, { count: 2, replacement: true, label: "Advanced Arsenal (level 3)" }),
      createItemChoiceRestricted(SUB, 7, ammoUuids, { count: 1, replacement: true, label: "Advanced Arsenal (level 7)" }),
      createItemChoiceRestricted(SUB, 10, ammoUuids, { count: 1, replacement: true, label: "Advanced Arsenal (level 10)" }),
      createItemChoiceRestricted(SUB, 15, ammoUuids, { count: 1, replacement: true, label: "Advanced Arsenal (level 15)" }),
      createItemChoiceRestricted(SUB, 18, ammoUuids, { count: 1, replacement: true, label: "Advanced Arsenal (level 18)" }),
      createItemGrant(SUB, 7, [
        { uuid: fUuid(`${F}/rebounding-shots`) },
        { uuid: fUuid(`${F}/mastercrafted-shots`) },
      ]),
      createItemGrant(SUB, 10, [
        { uuid: fUuid(`${F}/advanced-armory`) },
      ]),
      createItemGrant(SUB, 15, [
        { uuid: fUuid(`${F}/constant-shots`) },
      ]),
      createItemGrant(SUB, 18, [
        { uuid: fUuid(`${F}/improved-advanced-arsenal`) },
      ]),
    ),
    spellcasting: { progression: "none", ability: "" },
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  _stats: {
    compendiumSource: null, duplicateSource: null, coreVersion: "13",
    systemId: "dnd5e", systemVersion: "5.1.10",
    createdTime: null, modifiedTime: null, lastModifiedBy: null,
  },
};

export const armsDealerFeatures: FeatureItem[] = [
  engineeringProficiency,
  advancedArsenal,
  reboundingShots,
  mastercraftedShots,
  advancedArmory,
  constantShots,
  improvedAdvancedArsenal,
];
