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
  `<p>Starting at 3rd level, you are difficult to pin down during a fight. You can move up to half your speed as a reaction when an enemy ends its turn within 5 feet of you. This movement doesn't provoke opportunity attacks.</p><p>In addition your movement speed increases by 10 feet. If you have a climbing or swimming speed, this increase applies to that speed as well.</p>`,
  { activation: { type: "reaction", cost: 1, condition: "Enemy ends turn within 5ft" } },
);

export const survivalist = feat(
  "feature/rogue/scout/survivalist", "Survivalist", 3,
  `<p>When you choose this archetype at 3rd level, you gain proficiency in the Nature and Survival skills if you don't already have them. Your proficiency bonus is doubled for any ability check you make that uses either of those proficiencies.</p>`,
);

export const keenCombatant = feat(
  "feature/rogue/scout/keen-combatant", "Keen Combatant", 6,
  `<p>Starting at 6th level, you can react and act fast in combat. The following effects are added to your Devious Strike options.</p><p><strong>Scheme (Cost: 2d6).</strong> As part of the Devious Strike, you take one of your Cunning Action options.</p><p><strong>Focus (Cost: 1d6).</strong> If this attack was made using your Steady Aim feature, you ignore the movement resistrictions.</p>`,
);

export const superiorHunter = feat(
  "feature/rogue/scout/superior-hunter", "Superior Hunter", 9,
  `<p>At 9th level, you gain advantage on any Wisdom (Perception) or Wisdom (Survival) checks if you move no more than half your speed on the same turn.</p>`,
);

export const ambushMaster = feat(
  "feature/rogue/scout/ambush-master", "Ambush Master", 13,
  `<p>Starting at 13th level, you excel at leading ambushes and acting first in a fight.</p><p>You have advantage on initiative rolls. In addition, the first creature you hit during the first round of combat becomes easier for you and others to strike; attack rolls against that target have advantage until the start of your next turn.</p>`,
);

export const suddenStrike = feat(
  "feature/rogue/scout/sudden-strike", "Sudden Strike", 17,
  `<p>Starting at 17th level, you can strike with deadly speed. When you take the attack action, you can make another attack as a bonus action. This attack can benefit from your Sneak Attack even if you have already used it this turn, but you can't use your Sneak Attack against the same target more than once in a turn.</p>`,
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
    description: { value: `<p>Skilled in stealth and movement, allowing you to scout ahead of your companions during expeditions. Rogues who embrace this archetype are at home in nearly any environment. Typically these outlanders and lookouts who aid their crew with keen eyes and quick feet. Able to weave through the battlefield like greased lightning and cut an opening for the rest of the crew.</p>`, chat: "" },
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
