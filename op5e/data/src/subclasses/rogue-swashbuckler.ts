import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/rogue/swashbuckler";

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
      requirements: `Rogue (Swashbuckler) ${level}`,
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

export const fancyFootwork = feat(
  "feature/rogue/swashbuckler/fancy-footwork", "Fancy Footwork", 3,
  `<p>Starting at 3rd level, you learn how to land a strike and then slip away without reprisal. During your turn, if you make a melee attack against a creature, that creature can't make opportunity attacks against you for the rest of your turn.</p>`,
);

export const rakishAudacity = feat(
  "feature/rogue/swashbuckler/rakish-audacity", "Rakish Audacity", 3,
  `<p>Also at 3rd level, your confidence propels you into battle. You can give yourself a bonus to your initiative rolls equal to your Charisma modifier.</p><p>You also gain an additional way to use your Sneak Attack; you don't need advantage on the attack roll to use your Sneak Attack against a creature if you are within 5 feet of it, no other creatures are within 5 feet of you, and you don't have disadvantage on the attack roll. All the other rules still apply to you.</p>`,
);

export const slipperyDevil = feat(
  "feature/rogue/swashbuckler/slippery-devil", "Slippery Devil", 6,
  `<p>Starting at 6th level, you can decipher the precise weak points of your foes. The following effects are added to your Devious Strike options.</p><p><strong>Refuge (Cost: 2d6).</strong> After striking, you find yourself in a favorable position. You gain a +2 bonus to your AC until the start of your next turn.</p><p><strong>Taunt (Cost: 2d6).</strong> You weave your strikes with some spirited insults. The target must succeed a Wisdom saving throw or suffer disadvantage on attack rolls against creatures other than you until the start of your next turn.</p>`,
);

export const panache = feat(
  "feature/rogue/swashbuckler/panache", "Panache", 9,
  `<p>At 9th level, your charm becomes extraordinarily beguiling. As an action, you can make a Charisma (Persuasion) check contested by a creature's Wisdom (Insight) check. The creature must be able to hear you, and the two of you must share a language.</p><p>If you succeed on the check and the creature is hostile to you, it has disadvantage on attack rolls against targets other than you and can't make opportunity attacks against targets other than you. This effect lasts for 1 minute, until one of your companions attacks the target or affects it with a creation, or until you and the target are more than 60 feet apart.</p><p>If you succeed on the check and the creature isn't hostile to you, it is charmed by you for 1 minute. While charmed, it regards you as a friendly acquaintance. This effect ends immediately if you or your companions do anything harmful to it.</p>`,
  { activation: { type: "action", cost: 1, condition: "" } },
);

export const elegantManeuver = feat(
  "feature/rogue/swashbuckler/elegant-maneuver", "Elegant Maneuver", 13,
  `<p>At 13th level, as long as you are conscious, you always have advantage on Dexterity (Acrobatics) or Strength (Athletics) checks you make.</p>`,
);

export const masterDuelist = feat(
  "feature/rogue/swashbuckler/master-duelist", "Master Duelist", 17,
  `<p>At 17th level, your mastery of the blade lets you turn failure into success in combat. If you miss with an attack roll, you can roll it again with advantage. You can use this feature only once per turn.</p><p>You can use this feature a number of times equal to 1 + your Charisma modifier, regaining all expended uses when you finish a short or long rest.</p>`,
  {
    activation: { type: "special", cost: null, condition: "You miss with an attack roll (once per turn)" },
    uses: { value: null, max: "1 + @abilities.cha.mod", per: "sr", recovery: "", prompt: true },
  },
);

export const features: FeatureItem[] = [
  fancyFootwork, rakishAudacity, slipperyDevil, panache, elegantManeuver, masterDuelist,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Swashbuckler",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Speed and charm go hand in hand when one becomes a swashbuckler. They are nothing short of the archetypical pirate, who swings into battle with rakish audacity and no fear. Not only do you have the physical finesse in all your duels, but also the mental finesse and panache to get your way.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "swashbuckler",
    classIdentifier: "rogue",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(fancyFootwork) }, { uuid: fUuid(rakishAudacity) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(slipperyDevil) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(panache) }]),
      createItemGrant(SC_ID, 13, [{ uuid: fUuid(elegantManeuver) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(masterDuelist) }]),
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
