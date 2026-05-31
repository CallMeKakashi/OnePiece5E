import { generateId } from "../../helpers/id.js";
import { createDAEEffect, addBonus, customChange, upgradeValue } from "../../helpers/effects.js";
import type { FeatureItem } from "../../schemas/feature.js";

function rf(
  idPath: string,
  name: string,
  desc: string,
  req: string,
  extra: Partial<FeatureItem["system"]> = {},
  effects: FeatureItem["effects"] = [],
): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "race", subtype: "" },
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
      ...extra,
    },
    effects,
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null, duplicateSource: null,
      coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10",
      createdTime: null, modifiedTime: null, lastModifiedBy: null,
    },
  } as unknown as FeatureItem;
}

// ── Base ──

export const augmentedPowerfulBuild = rf(
  "feature/race/augmented/powerful-build",
  "Powerful Build",
  `<p>You count as one size larger when determining your carrying capacity and the weight you can push, drag, lift, and for grapple and shove attempts.</p>`,
  "Augmented",
);

// ── Cyborg ──

export const mechanicalImprovements = rf(
  "feature/race/augmented/cyborg/mechanical-improvements",
  "Mechanical Improvements",
  `<p>You were created to go beyond human limits. You gain the following benefits:</p>
<ul>
<li>You have advantage on saving throws against being poisoned, and you have resistance to poison damage.</li>
<li>You don't need to eat, drink, or breathe. You are immune to disease.</li>
<li>You don't need to sleep, and creations and other effects can't put you to sleep.</li>
<li>You have darkvision out to 60 feet.</li>
</ul>`,
  "Augmented (Cyborg)",
  {},
  [createDAEEffect("race/augmented/cyborg/mechanical-improvements", "Mechanical Improvements", [
    customChange("system.traits.dr.value", "poison"),
    upgradeValue("system.attributes.senses.darkvision", 60),
  ])],
);

export const integratedArmor = rf(
  "feature/race/augmented/cyborg/integrated-armor",
  "Integrated Armor",
  `<p>Your body has built-in defensive layers, which can be enhanced with armor. You gain a +1 bonus to Armor Class. You can don only armor with which you have proficiency. To don armor, you must incorporate it into your body over the course of 1 hour, which can be done as part of a rest. To doff armor, you must spend 1 hour removing it. While you live, your armor can't be removed from your body against your will.</p>`,
  "Augmented (Cyborg)",
  {},
  [createDAEEffect("race/augmented/cyborg/integrated-armor", "Integrated Armor", [
    addBonus("system.attributes.ac.bonus", 1),
  ])],
);

export const integratedToolbox = rf(
  "feature/race/augmented/cyborg/integrated-toolbox",
  "Integrated Toolbox",
  `<p>You can integrate a weapon, item, or a set of tools into you with 10 minutes of uninterrupted work, which can be done as part of any rest. Once integrated, you can draw or stow the item as part of any action that involves its use, and you cannot be disarmed of it against your will. You can integrate a number of items equal to 1 + your proficiency bonus.</p>`,
  "Augmented (Cyborg)",
);

// ── Chimera ──

export const beastBody = rf(
  "feature/race/augmented/chimera/beast-body",
  "Beast Body",
  `<p>You gain a movement speed based on the animal that you embody. Choose one of the following when you select this race:</p>
<ul>
<li>A flying speed of 30 feet.</li>
<li>A swimming speed of 30 feet and the ability to breathe underwater.</li>
<li>A climbing speed of 30 feet and a burrow speed of 10 feet.</li>
</ul>`,
  "Augmented (Chimera)",
);

export const chimeraDarkvision = rf(
  "feature/race/augmented/chimera/darkvision",
  "Darkvision",
  `<p>Your bestial side enhances your senses. You have darkvision out to 60 feet and can see in dim light as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.</p>`,
  "Augmented (Chimera)",
  {},
  [createDAEEffect("race/augmented/chimera/darkvision", "Darkvision", [
    upgradeValue("system.attributes.senses.darkvision", 60),
  ])],
);

export const chimeraNaturalWeapons = rf(
  "feature/race/augmented/chimera/natural-weapons",
  "Natural Weapons",
  `<p>You have natural weapons in the shape of sharp talons, claws, fangs, or all of the above. You can use these natural weapons to make unarmed strikes, and they deal 1d6 + your Strength or Dexterity modifier bludgeoning, piercing, or slashing damage on hit. You can choose whether to use Strength or Dexterity when attacking with these natural weapons, but must use the same ability score for both the attack and damage roll.</p>`,
  "Augmented (Chimera)",
  {
    actionType: "mwak",
    damage: { parts: [["1d6 + @mod", "slashing"]], versatile: "" },
  },
);

// ── Artificial Human ──

export const acceleratedHealing = rf(
  "feature/race/augmented/artificial-human/accelerated-healing",
  "Accelerated Healing",
  `<p>When you regain hit points for any reason, including using hit dice, you regain a number of additional hit points equal to your proficiency bonus.</p>`,
  "Augmented (Artificial Human)",
);

export const naturalArmor = rf(
  "feature/race/augmented/artificial-human/natural-armor",
  "Natural Armor",
  `<p>Your skin alone is tough enough to block swords and bullets. While you're not wearing armor, your armor class is calculated as 13 + your Dexterity modifier. You can use your natural armor to determine your AC if the armor you wear would leave you with a lower AC.</p>`,
  "Augmented (Artificial Human)",
);

export const sparkOfWar = rf(
  "feature/race/augmented/artificial-human/spark-of-war",
  "Spark of War",
  `<p>When you deal damage to a target, you may choose to deal extra acid, cold, fire, lightning, poison, thunder, radiant, or necrotic damage equal to your proficiency bonus. You choose which type when you create your character.</p>
<p>You can use this trait a number of times equal to your proficiency bonus. You regain all expended uses when you finish a short or long rest.</p>`,
  "Augmented (Artificial Human)",
  { uses: { value: null, max: "@prof", per: "sr", recovery: "", prompt: true } },
);

// ── Revived ──

export const revivedDarkvision = rf(
  "feature/race/augmented/revived/darkvision",
  "Darkvision",
  `<p>You have darkvision out to 60 feet and can see in dim light as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.</p>`,
  "Augmented (Revived)",
  {},
  [createDAEEffect("race/augmented/revived/darkvision", "Darkvision", [
    upgradeValue("system.attributes.senses.darkvision", 60),
  ])],
);

export const deathlessNature = rf(
  "feature/race/augmented/revived/deathless-nature",
  "Deathless Nature",
  `<p>You do not require air, food, or water. Additionally, you do not require sleep, and creations and devil fruits cannot put you to sleep. You can finish a long rest in 4 hours if you spend those hours in an inactive, motionless state, during which you retain consciousness.</p>`,
  "Augmented (Revived)",
);

export const graveFortitude = rf(
  "feature/race/augmented/revived/grave-fortitude",
  "Grave Fortitude",
  `<p>You have advantage on death saving throws, and on saving throws against poisons and disease. Additionally, you have resistance to poison damage.</p>`,
  "Augmented (Revived)",
  {},
  [createDAEEffect("race/augmented/revived/grave-fortitude", "Grave Fortitude", [
    customChange("system.traits.dr.value", "poison"),
  ])],
);

export const augmentedFeatures: FeatureItem[] = [
  augmentedPowerfulBuild,
  mechanicalImprovements, integratedArmor, integratedToolbox,
  beastBody, chimeraDarkvision, chimeraNaturalWeapons,
  acceleratedHealing, naturalArmor, sparkOfWar,
  revivedDarkvision, deathlessNature, graveFortitude,
];
