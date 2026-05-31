import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/rogue/scout";

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
      requirements: `Rogue (Scout) ${level}`,
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

export const skirmisher = feat(
  "feature/rogue/scout/skirmisher", "Skirmisher", 3,
  `<p>Starting at 3rd level, you are difficult to pin down during a fight. You can move up to half your speed as a reaction when an enemy ends its turn within 5 feet of you. This movement doesn't provoke opportunity attacks. Additionally, your walking speed increases by 10 feet.</p>`,
  { activation: { type: "reaction", cost: 1, condition: "Enemy ends turn within 5ft" } },
);

export const survivalist = feat(
  "feature/rogue/scout/survivalist", "Survivalist", 3,
  `<p>When you choose this archetype at 3rd level, you gain proficiency in Nature and Survival if you don't already have them. Your proficiency bonus is doubled for any ability check you make that uses either of those proficiencies.</p>`,
);

export const keenCombatant = feat(
  "feature/rogue/scout/keen-combatant", "Keen Combatant", 6,
  `<p>At 6th level, you gain the following additional Devious Strike options:</p><ul><li><strong>Mark Prey (Cost: 1d6).</strong> The target is marked until the end of your next turn. Attack rolls against the marked target have advantage if the attacker is within 5 feet of it.</li><li><strong>Pin Down (Cost: 2d6).</strong> The target must succeed on a Strength saving throw or have its speed reduced to 0 until the end of its next turn.</li></ul>`,
);

export const superiorHunter = feat(
  "feature/rogue/scout/superior-hunter", "Superior Hunter", 9,
  `<p>At 9th level, when you move at no more than half your speed, you have advantage on Wisdom (Perception) and Wisdom (Survival) checks.</p>`,
);

export const ambushMaster = feat(
  "feature/rogue/scout/ambush-master", "Ambush Master", 13,
  `<p>Starting at 13th level, you have advantage on initiative rolls. In addition, the first creature you hit during the first round of combat becomes easier for you and others to strike. Attack rolls against that target have advantage until the start of your next turn.</p>`,
);

export const suddenStrike = feat(
  "feature/rogue/scout/sudden-strike", "Sudden Strike", 17,
  `<p>At 17th level, if you take the Attack action on your turn, you can make one additional attack as a bonus action. This attack can benefit from your Sneak Attack even if you have already used it this turn, but not against the same target.</p>`,
  { activation: { type: "bonus", cost: 1, condition: "" } },
);

export const features: FeatureItem[] = [
  skirmisher, survivalist, keenCombatant, superiorHunter, ambushMaster, suddenStrike,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Scout",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>You are skilled in stealth and surviving far from the streets of a city, allowing you to scout ahead of your companions during expeditions. Rogues who embrace this archetype are at home in the wilderness and among barbarians and rangers.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "scout",
    classIdentifier: "rogue",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(skirmisher) }, { uuid: fUuid(survivalist) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(keenCombatant) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(superiorHunter) }]),
      createItemGrant(SC_ID, 13, [{ uuid: fUuid(ambushMaster) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(suddenStrike) }]),
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
