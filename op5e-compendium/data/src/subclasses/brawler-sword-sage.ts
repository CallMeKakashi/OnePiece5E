import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/brawler/sword-sage";

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
      requirements: `Brawler (Sword Sage) ${level}`,
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

export const combatMastery = feat(
  "feature/brawler/sword-sage/combat-mastery", "Combat Mastery", 3,
  `<p>Starting at 3rd level, you gain proficiency in all martial weapons, and all weapons that you are proficient in count as brawler weapons. In addition, you can draw and stow a weapon as part of making an attack with it.</p>`,
);

export const fightingStyle = feat(
  "feature/brawler/sword-sage/fighting-style", "Fighting Style", 3,
  `<p>Starting at 3rd level, your training gives you experience in a range of fighting styles and enables you to refocus yourself through meditation. You may choose one fighting style from the Sword Sage Brawler Styles section, and may change your fighting style whenever you complete a long rest.</p>`,
);

export const sageStrikes = feat(
  "feature/brawler/sword-sage/sage-strikes", "Sage Strikes", 6,
  `<p>At 6th level, whenever you use Flurry of Blows or your bonus action attack from Brawling, you can replace the unarmed strikes with an attack with a brawler weapon.</p>`,
);

export const spiritStrike = feat(
  "feature/brawler/sword-sage/spirit-strike", "Spirit Strike", 6,
  `<p>At 6th level, you can utilize your innate fighting spirit to attack like an unstoppable bastion. When you hit a target with a brawler weapon, you can spend 1 Spirit point to cause the weapon to deal an extra 2d6 damage to the target of that weapon's damage type.</p>`,
  {
    damage: { parts: [["2d6", ""]], versatile: "" },
  },
);

export const perfectedForm = feat(
  "feature/brawler/sword-sage/perfected-form", "Perfected Form", 11,
  `<p>At 11th level, you have mastered and refined more styles of combat, making you all the more versatile. You can choose one additional fighting style, and may now change fighting style(s) whenever you complete a short rest.</p>`,
);

export const spiritWarrior = feat(
  "feature/brawler/sword-sage/spirit-warrior", "Spirit Warrior", 17,
  `<p>At 17th level, your mastery of spirit and combat allows you to enter a state of pure focus, rendering you an ultimate warrior one with body, mind, spirit, and blade.</p>
<p>At the start of your turn, you may spend five Spirit points so that for the next minute you may take an extra bonus action on each of your turns.</p>
<p>In addition, for the duration, once per turn, when you use your Spirit Strike feature, you may ignore the Spirit point cost.</p>
<p>This ability ends early if you are incapacitated or killed.</p>`,
  {
    activation: { type: "special", cost: 1, condition: "Start of your turn" },
    duration: { value: 1, units: "minute" },
  },
);

export const features: FeatureItem[] = [
  combatMastery, fightingStyle, sageStrikes, spiritStrike, perfectedForm, spiritWarrior,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Sword Sage",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Sword Sages are brawlers that have extensively trained with multiple weapons and fighting styles, so much so that they can use a weapon as effectively as their own hand. Their flexibility in combat makes them dangerous in any situation.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "sword-sage",
    classIdentifier: "brawler",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(combatMastery) }, { uuid: fUuid(fightingStyle) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(sageStrikes) }, { uuid: fUuid(spiritStrike) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(perfectedForm) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(spiritWarrior) }]),
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
