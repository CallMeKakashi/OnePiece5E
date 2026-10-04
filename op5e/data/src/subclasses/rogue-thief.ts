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
  `<p>Starting at 3rd Level, you can use the bonus action granted by your Cunning Action to make a Dexterity (Sleight of Hand) check, use your thieves' tools, take the Use an Object action, or to use an item that normally requires an action (such as a Small Medkit).</p>`,
);

export const secondStoryWork = feat(
  "feature/rogue/thief/second-story-work", "Second-story Work", 3,
  `<p>When you choose this archetype at 3rd Level, you gain the ability to climb faster than normal; you gain a climbing that is equal to your movement speed.</p><p>In addition, when you make a running jump, the distance you cover increases by a number of feet equal to your Dexterity modifier.</p>`,
);

export const outOfSight = feat(
  "feature/rogue/thief/out-of-sight", "Out Of Sight", 6,
  `<p>Starting at 6th level, you are able to stay out of view, and cause diversions to help your allies in a fight. The following effects are added to your Devious Strike options.</p><p><strong>Under Cover (Cost: 2d6).</strong> If you are hidden, this attack doesn't reveal your position if you end the turn behind cover.</p><p><strong>Diversion (Cost: 1d6).</strong> Until the end of your next turn, then next attack roll against the target is made with advantage.</p>`,
);

export const supremeSneak = feat(
  "feature/rogue/thief/supreme-sneak", "Supreme Sneak", 9,
  `<p>Starting at 9th level, you have advantage on a Dexterity (Stealth) and Dexterity (Sleight of Hand) checks if you move no more than half your speed on the same turn.</p>`,
);

export const outfoxingAction = feat(
  "feature/rogue/thief/outfoxing-action", "Outfoxing Action", 13,
  `<p>By 13th level, your cunning skills and your ability to think on your feet have made you incredibly difficult to catch. When you use either the Cunning Action or Fast Hands features, you may choose to use an additional option as part of the same bonus action (both must be different options).</p><p>For example, you can take both the dash and disengage actions, the dash and hide actions, or the attempt a Sleight of Hand check from Fast Hands followed by the disengage action.</p>`,
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
    description: { value: `<p>You hone your skills in the larcenous arts. Burglars, bandits, cutpurses, and other criminals typically follow this archetype, but so do rogues who prefer to think of themselves as professional treasure seekers, explorers, delvers, and investigators. In addition to improving your agility and stealth , you learn skills useful for delving into ancient ruins, and evaluating rare treasures.</p>`, chat: "" },
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
