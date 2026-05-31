import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/rogue/thief";

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
      requirements: `Rogue (Thief) ${level}`,
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

export const fastHands = feat(
  "feature/rogue/thief/fast-hands", "Fast Hands", 3,
  `<p>Starting at 3rd level, you can use the bonus action granted by your Cunning Action to make a Dexterity (Sleight of Hand) check, use your thieves' tools to disarm a trap or open a lock, or take the Use an Object action.</p>`,
);

export const secondStoryWork = feat(
  "feature/rogue/thief/second-story-work", "Second-story Work", 3,
  `<p>When you choose this archetype at 3rd level, you gain a climbing speed equal to your walking speed. In addition, when you make a running jump, the distance you cover increases by a number of feet equal to your Dexterity modifier.</p>`,
);

export const outOfSight = feat(
  "feature/rogue/thief/out-of-sight", "Out Of Sight", 6,
  `<p>At 6th level, you gain the following additional Devious Strike options:</p><ul><li><strong>Vanish (Cost: 1d6).</strong> You immediately take the Hide action as part of this attack.</li><li><strong>Pilfer (Cost: 2d6).</strong> You can immediately make a Dexterity (Sleight of Hand) check to steal one item the target is carrying (not wielding).</li></ul>`,
);

export const supremeSneak = feat(
  "feature/rogue/thief/supreme-sneak", "Supreme Sneak", 9,
  `<p>Starting at 9th level, when you move at no more than half your speed, you have advantage on Dexterity (Stealth) and Dexterity (Sleight of Hand) checks.</p>`,
);

export const outfoxingAction = feat(
  "feature/rogue/thief/outfoxing-action", "Outfoxing Action", 13,
  `<p>Starting at 13th level, you can use Cunning Action twice on each of your turns instead of once.</p>`,
);

export const thiefsReflexes = feat(
  "feature/rogue/thief/thiefs-reflexes", "Thief's Reflexes", 17,
  `<p>When you reach 17th level, you have become adept at laying ambushes and quickly escaping danger. You can take two turns during the first round of any combat. You take your first turn at your normal initiative and your second turn at your initiative minus 10. You can't use this feature when you are surprised.</p>`,
);

export const features: FeatureItem[] = [
  fastHands, secondStoryWork, outOfSight, supremeSneak, outfoxingAction, thiefsReflexes,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Thief",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>You hone your skills in the larcenous arts. Burglars, bandits, cutpurses, and other criminals typically follow this archetype, but so do rogues who prefer to think of themselves as professional treasure seekers or dungeon delvers.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "thief",
    classIdentifier: "rogue",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(fastHands) }, { uuid: fUuid(secondStoryWork) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(outOfSight) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(supremeSneak) }]),
      createItemGrant(SC_ID, 13, [{ uuid: fUuid(outfoxingAction) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(thiefsReflexes) }]),
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
