import type { FeatureItem } from "../../../schemas/feature.js";
import { generateId } from "../../../helpers/id.js";

function feat(
  idPath: string,
  name: string,
  description: string,
  overrides: Partial<FeatureItem["system"]> = {},
): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: overrides.requirements ?? "",
      activation: overrides.activation ?? { type: "", cost: null, condition: "" },
      duration: overrides.duration ?? { value: null, units: "" },
      target: overrides.target ?? { value: null, width: null, units: "", type: "" },
      range: overrides.range ?? { value: null, long: null, units: "" },
      uses: overrides.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: overrides.actionType ?? "",
      damage: overrides.damage ?? { parts: [], versatile: "" },
      save: overrides.save ?? { ability: "", dc: null, scaling: "spell" },
      chatFlavor: overrides.chatFlavor ?? "",
      recharge: overrides.recharge ?? { value: null, charged: false },
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null,
      duplicateSource: null,
      coreVersion: "13",
      systemId: "dnd5e",
      systemVersion: "5.1.10",
      createdTime: null,
      modifiedTime: null,
      lastModifiedBy: null,
    },
  };
}

export const foxfireStyleFeatures: FeatureItem[] = [
  feat(
    "additional-power/foxfire-style",
    "Foxfire Style",
    `<p>Foxfire Style is a unique sword fighting style that allows the user to use their blade as an apparatus of pyrokinesis, allowing them to burn and slash their enemies, as well as rend even the most potent flames asunder. While it is based in swords, it can be used with any melee weapon you are wielding.</p>`,
    { requirements: "" },
  ),
  feat(
    "additional-power/foxfire-style/foxfire-points",
    "Foxfire Points",
    `<p>When you gain this ability, you gain a number of Foxfire points equal to your proficiency bonus. You can expend these Foxfire points to fuel your Foxfire features. You regain all expended Foxfire points at the end of a long rest.</p>
<p>When you reach 5th level, your expended Foxfire points are regained at the end of a short or long rest.</p>`,
    {
      requirements: "Foxfire Style",
      uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
    },
  ),
  feat(
    "additional-power/foxfire-style/ignite",
    "Ignite",
    `<p>When you gain this ability, you can coat your weapon in a destructive layer of fire. When you hit with a melee weapon attack, you can expend a Foxfire Point to deal an extra 1d8 fire damage.</p>
<p>At 10th level, you can cause your flames to remain. When you use this feature, instead of igniting one attack, you can ignite all melee weapons you are wielding for 1 minute. For the duration, their melee weapon attacks now deal an extra 1d8 fire damage.</p>`,
    {
      requirements: "Foxfire Style",
      damage: { parts: [["1d8", "fire"]], versatile: "" },
    },
  ),
  feat(
    "additional-power/foxfire-style/flame-render",
    "Flame Render",
    `<p>When you gain this ability you can cut flames as if they were a tangible substance. As a reaction to being targeted by a fire-based attack/creation, such as the Fireball creation or an attack that deals fire damage, the user can spend a Foxfire Point to cut the flames, reducing the fire damage to 0 and extinguishing any lingering flames that would have been created.</p>
<p>In addition, any creature made of flames (such as a fire elemental), your weapon attacks can bypass all their resistances and immunities to bludgeoning, piercing, and slashing damage.</p>`,
    {
      requirements: "Foxfire Style",
      activation: { type: "reaction", cost: 1, condition: "Targeted by fire attack/creation" },
    },
  ),
  feat(
    "additional-power/foxfire-style/eternal-flames",
    "Eternal Flames",
    `<p>At 15th level, you begin to further master your flames, allowing you to ignite your sword on command. When you wield a melee weapon, it deals an extra 1d8 fire damage.</p>
<p>This can stack with the damage gained from using your Ignite feature, allowing you to deal 2d8 fire damage.</p>`,
    {
      requirements: "Foxfire Style 15",
      damage: { parts: [["1d8", "fire"]], versatile: "" },
    },
  ),
  feat(
    "additional-power/foxfire-style/magma-blade",
    "Magma Blade",
    `<p>You have mastered the Foxfire style completely, able to produce flames that rival the deepest sources of magma. Your melee weapon attacks ignore resistance to fire damage, and treat immunities to fire damage as resistances.</p>`,
    { requirements: "Foxfire Style 20" },
  ),
];
