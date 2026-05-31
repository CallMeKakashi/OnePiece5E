import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";

const SUB = "subclass/fighter/champion";
const F = "feature/fighter/champion";

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

const combatExpert = feat(
  "combat-expert", "Combat Expert",
  `<p>Beginning at 3rd level, your weapon attacks score a critical hit on a roll of 19 or 20.</p>`,
  "Champion 3",
);

const physicalSuperiority = feat(
  "physical-superiority", "Physical Superiority",
  `<p>At 3rd level, choose one of the following ability scores: Strength, Dexterity, or Constitution. You gain bonuses related to that ability score, reflecting your focus on physical excellence.</p>
<ul>
<li><strong>Strength.</strong> You gain a bonus to melee damage rolls and Strength checks equal to half your proficiency bonus (rounded up).</li>
<li><strong>Dexterity.</strong> You gain a bonus to AC and Dexterity checks equal to half your proficiency bonus (rounded up).</li>
<li><strong>Constitution.</strong> You gain bonus hit points per level equal to half your proficiency bonus (rounded up), and a bonus to Constitution checks.</li>
</ul>`,
  "Champion 3",
);

const signatureFightingStyle = feat(
  "signature-fighting-style", "Signature Fighting Style",
  `<p>At 7th level, your chosen fighting style improves with a signature enhancement, granting additional benefits based on which style you chose at 1st level.</p>`,
  "Champion 7",
);

const combatMaster = feat(
  "combat-master", "Combat Master",
  `<p>Starting at 10th level, your weapon attacks score a critical hit on a roll of 18-20.</p>`,
  "Champion 10",
);

const perfectedFightingStyles = feat(
  "perfected-fighting-styles", "Perfected Fighting Styles",
  `<p>At 15th level, you can choose a second Fighting Style option. Additionally, your fighting styles reach their perfected forms, granting improved versions of their benefits.</p>`,
  "Champion 15",
);

const invulnerable = feat(
  "invulnerable", "Invulnerable",
  `<p>At 18th level, you gain resistance to two damage types of your choice from the following: bludgeoning, piercing, slashing, fire, cold, lightning, thunder, acid, or poison.</p>`,
  "Champion 18",
);

export const champion: SubclassItem = {
  _id: generateId(SUB),
  name: "Champion",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>The archetypal Champion focuses on the development of raw physical power honed to deadly perfection. Those who model themselves on this archetype combine rigorous training with physical excellence to deal devastating blows.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "champion",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
      createItemGrant(SUB, 3, [
        { uuid: fUuid(`${F}/combat-expert`) },
        { uuid: fUuid(`${F}/physical-superiority`) },
      ]),
      createItemGrant(SUB, 7, [
        { uuid: fUuid(`${F}/signature-fighting-style`) },
      ]),
      createItemGrant(SUB, 10, [
        { uuid: fUuid(`${F}/combat-master`) },
      ]),
      createItemGrant(SUB, 15, [
        { uuid: fUuid(`${F}/perfected-fighting-styles`) },
      ]),
      createItemGrant(SUB, 18, [
        { uuid: fUuid(`${F}/invulnerable`) },
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

export const championFeatures: FeatureItem[] = [
  combatExpert,
  physicalSuperiority,
  signatureFightingStyle,
  combatMaster,
  perfectedFightingStyles,
  invulnerable,
];
