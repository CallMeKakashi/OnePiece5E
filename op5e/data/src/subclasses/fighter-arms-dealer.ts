import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";

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
  `<p>When you choose this archetype at 3rd level, you gain proficiency with tinker's tools and smith's tools. If you already have proficiency with either, you gain expertise with it instead (add double your proficiency bonus).</p>`,
  "Arms Dealer 3",
);

const advancedArsenal = feat(
  "advanced-arsenal", "Advanced Arsenal",
  `<p>At 3rd level, you learn to craft special ammunition. During a short or long rest, you can create a number of special ammo types equal to your Intelligence modifier (minimum of 1). The ammunition lasts until your next rest. Choose from the following types:</p>
<ul>
<li><strong>Explosive Round.</strong> On hit, each creature within 5 feet of the target (including the target) must make a Dexterity saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or take 1d8 fire damage.</li>
<li><strong>Piercing Round.</strong> The attack ignores half cover and three-quarters cover. On hit, the target takes an additional 1d6 piercing damage.</li>
<li><strong>Concussive Round.</strong> On hit, the target must succeed on a Constitution saving throw or be stunned until the end of its next turn.</li>
<li><strong>Smoke Round.</strong> On hit, the round creates a 10-foot radius sphere of smoke centered on the target, heavily obscuring the area for 1 minute.</li>
</ul>`,
  "Arms Dealer 3",
);

const reboundingShots = feat(
  "rebounding-shots", "Rebounding Shots",
  `<p>Starting at 7th level, when you miss with a ranged weapon attack using special ammunition, the ammunition is not expended. Additionally, when you hit a target with a ranged weapon attack, you can cause the projectile to ricochet to another target within 15 feet of the original target. Make a second attack roll against the new target. On a hit, it takes half the damage of the original attack.</p>
<p>You can use the ricochet a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a short or long rest.</p>`,
  "Arms Dealer 7",
);

const mastercraftedShots = feat(
  "mastercrafted-shots", "Mastercrafted Shots",
  `<p>Also at 7th level, the damage of your special ammunition types increases. Explosive Rounds deal 2d8, Piercing Rounds deal 2d6, and Concussive Rounds impose disadvantage on the saving throw if the target is Large or smaller.</p>`,
  "Arms Dealer 7",
);

const advancedArmory = feat(
  "advanced-armory", "Advanced Armory",
  `<p>At 10th level, your expertise in arms crafting extends to defensive gear. As a reaction when you are hit by an attack, you can roll a d6 and add it to your AC against that attack, potentially causing it to miss. You can use this reaction a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a short or long rest.</p>`,
  "Arms Dealer 10",
);

const constantShots = feat(
  "constant-shots", "Constant Shots",
  `<p>At 15th level, you have perfected your ammunition-crafting process. You can now create special ammunition as a bonus action during combat, in addition to during rests. You also gain one additional use of each special ammunition type per rest.</p>
<p>Additionally, your ranged weapon attacks score a critical hit on a roll of 19 or 20 when using special ammunition.</p>`,
  "Arms Dealer 15",
);

const improvedAdvancedArsenal = feat(
  "improved-advanced-arsenal", "Improved Advanced Arsenal",
  `<p>At 18th level, your special ammunition reaches its ultimate form. You gain two additional ammunition types:</p>
<ul>
<li><strong>Railgun Round.</strong> The attack targets every creature in a 5-foot wide, 60-foot long line. Each creature must make a Dexterity saving throw. On a failure, a creature takes 4d10 force damage; on a success, half damage.</li>
<li><strong>Gravity Round.</strong> On hit, the target and every creature within 15 feet must succeed on a Strength saving throw or be pulled to the center of the effect and knocked prone. Affected creatures take 3d8 force damage.</li>
</ul>
<p>Additionally, all your existing special ammunition damage dice increase by one die size.</p>`,
  "Arms Dealer 18",
);

export const armsDealer: SubclassItem = {
  _id: generateId(SUB),
  name: "Arms Dealer",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>The Arms Dealer is a fighter who specializes in engineering advanced weapons and ammunition. Through tinkering and craftsmanship, these fighters create devastating ranged options that turn the tide of battle.</p>",
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
