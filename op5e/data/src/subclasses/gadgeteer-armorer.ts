import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/gadgeteer/armorer";

function feat(idPath: string, name: string, level: number, description: string, extra: any = {}): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: `Gadgeteer (Armorer) ${level}`,
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
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem;
}

export const toolsOfTrade = feat(
  "feature/gadgeteer/armorer/tools-of-trade", "Tools of Trade", 3,
  `<p>When you adopt this specialization at 3rd level, you gain proficiency with heavy armor. You also gain proficiency with smith's tools. If you already have this tool proficiency, you gain proficiency with one other type of artisan's tools of your choice.</p>`,
);

export const mechanicalArmor = feat(
  "feature/gadgeteer/armorer/mechanical-armor", "Mechanical Armor", 3,
  `<p>Beginning at 3rd level, your metallurgical pursuits have led to you making armor a conduit for your creations. As an action, you can turn a suit of armor you are wearing into Mechanical Armor, provided you have smith's tools in hand. You gain the following benefits while wearing this armor:</p>
<ul>
<li>If the armor normally has a Strength requirement, the mechanical armor lacks this requirement for you.</li>
<li>You can use the mechanical armor as a creation focus for your gadgeteer creations.</li>
<li>The armor attaches to you and can't be removed against your will. It also expands to cover your entire body, although you can retract or deploy the helmet as a bonus action. The armor replaces any missing limbs, functioning identically to a body part it is replacing.</li>
</ul>
<p>You can doff or don the armor as an action. The armor continues to be Mechanical Armor until you die.</p>`,
  { activation: { type: "action", cost: 1, condition: "" } },
);

export const armorModels = feat(
  "feature/gadgeteer/armorer/armor-models", "Armor Models", 3,
  `<p>Beginning at 3rd level, you can customize your Mechanical Armor. When you do so, choose one of the following armor models: Guardian or Infiltrator. The model you choose gives you special benefits while you wear it. You can change the armor's model whenever you finish a short or long rest, provided you have smith's tools in hand.</p>
<p><strong>Guardian.</strong> You design your armor to be on the front line of conflict:</p>
<ul>
<li><strong>Hydraulics.</strong> When you make an ability check, saving throw, or weapon attack that uses Strength modifier, you can instead use your Intelligence modifier. Your Thunder Gauntlets use Intelligence as well.</li>
<li><strong>Thunder Gauntlets.</strong> Each of the armor's gauntlets counts as a simple melee weapon while you aren't holding anything in it, and it deals 1d8 thunder damage on a hit. As a bonus action, you can make an off-hand attack with the gauntlets, adding your modifier to the damage roll. A creature hit by the gauntlet has disadvantage on attack rolls against targets other than you until the start of your next turn.</li>
<li><strong>Defensive Field.</strong> As a bonus action, you can gain temporary hit points equal to twice your level in this class, replacing any temporary hit points you already have. You can use this bonus action a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.</li>
</ul>
<p><strong>Infiltrator.</strong> You customize your armor for subtle undertakings:</p>
<ul>
<li><strong>Zero Torque.</strong> When you make an ability check, saving throw, or weapon attack that uses Dexterity modifier, you can instead use your Intelligence modifier. Your Lightning Launcher and the Dexterity bonus to your AC uses Intelligence as well.</li>
<li><strong>Lightning Launcher.</strong> An electric node appears on one of your armored fists or on the chest. It counts as a simple ranged weapon, with a normal range of 90 feet and a long range of 300 feet, and it deals 2d6 lightning damage on a hit. Once per turn, when you deal lightning damage with this weapon, the target cannot take reactions until the start of your next turn.</li>
<li><strong>Powered Steps.</strong> Your walking speed increases by 10 feet.</li>
<li><strong>Dampening Field.</strong> You have advantage on Dexterity (Stealth) checks. If the armor normally imposes disadvantage on such checks, the advantage and disadvantage cancel each other.</li>
</ul>`,
);

export const armorerExtraAttack = feat(
  "feature/gadgeteer/armorer/extra-attack", "Extra Attack", 5,
  `<p>Starting at 5th level, you can attack twice, rather than once, whenever you take the Attack action on your turn.</p>
<p>If you ready your action to make an attack, you can attack the same number of times you would if you had taken the attack action on your turn.</p>`,
);

export const armorModifications = feat(
  "feature/gadgeteer/armorer/armor-modifications", "Armor Modifications", 9,
  `<p>At 9th level, you learn how to use your gadgeteer mods to specially modify your Mechanical Armor. That armor now counts as separate items for the purposes of your Mods feature: armor, boots, helmet, and the armor's special weapon. Each of those items can bear one of your mods, and the mods transfer over if you change your armor's model with the Armor Model feature. In addition, the maximum number of items you can mod at once increases by 2, but those extra items must be part of your Mechanical Armor.</p>`,
);

export const perfectedArmor = feat(
  "feature/gadgeteer/armorer/perfected-armor", "Perfected Armor", 15,
  `<p>At 15th level, your Mechanical Armor gains additional benefits based on its model:</p>
<p><strong>Guardian.</strong> When a creature you can see within 30 feet of you makes an attack against a creature (can include yourself), you can use your reaction to overwhelm the target with a concentrated pulse, dealing 2d8 + your Intelligence modifier thunder damage. You can use this reaction a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. Additionally, the damage of your thunder gauntlets increases to 2d8.</p>
<p><strong>Infiltrator.</strong> Your armor grants you a flying speed equal to your walking speed. If you use this flying speed to fly out of an enemy's reach, that creature has disadvantage on any opportunity attack against you. In addition, the damage of your lightning launcher increases to 3d6.</p>`,
  {
    activation: { type: "reaction", cost: 1, condition: "Guardian: Creature within 30 ft attacks" },
    uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
  },
);

export const features: FeatureItem[] = [
  toolsOfTrade, mechanicalArmor, armorModels, armorerExtraAttack, armorModifications, perfectedArmor,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Armorer",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Armorers modify armor to function almost like a second skin. The armor is enhanced to hone the gadgeteer's creations, unleash potent attacks, and generate a formidable defense.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "armorer",
    classIdentifier: "gadgeteer",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(toolsOfTrade) }, { uuid: fUuid(mechanicalArmor) }, { uuid: fUuid(armorModels) }]),
      createItemGrant(SC_ID, 5, [{ uuid: fUuid(armorerExtraAttack) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(armorModifications) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(perfectedArmor) }]),
    ) as any,
    spellcasting: { progression: "none", ability: "" },
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as SubclassItem;
