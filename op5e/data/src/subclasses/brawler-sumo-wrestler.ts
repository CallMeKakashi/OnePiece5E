import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/brawler/sumo-wrestler";

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
      requirements: `Brawler (Sumo Wrestler) ${level}`,
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

export const sumoStance = feat(
  "feature/brawler/sumo-wrestler/sumo-stance", "Sumo Stance", 3,
  `<p>Beginning at 3rd level, you gain proficiency in the Intimidation or Athletics skills. If you already had proficiency in these skills, you gain Expertise in them instead.</p>
<p>Furthermore, any class ability or saving throw that utilizes your Dexterity modifier, you can instead use your Strength modifier. This includes your Unarmored Defense, Deflect Missiles, and Dexterity saving throws.</p>
<p>Additionally, when you gain the Evasion feature at 7th level, your Strength saving throws also benefit from the feature.</p>`,
);

export const mountainStance = feat(
  "feature/brawler/sumo-wrestler/mountain-stance", "Mountain Stance", 3,
  `<p>At 3rd level, if you move half your movement speed or less on your turn, you can anchor your heels into the ground. Until the beginning of your next turn, you can't be moved against your will. Additionally, until the start of your next turn, you can spend a spirit point whenever you take damage to reduce the damage taken by 1d10 + your Strength modifier.</p>
<p>Additionally, you are considered one size larger for the purposes of shoving or grappling and have advantage on Strength checks to grapple and shove.</p>`,
);

export const surfacePressure = feat(
  "feature/brawler/sumo-wrestler/surface-pressure", "Surface Pressure", 6,
  `<p>By 6th level, your presence not only adds physical but mental pressure on the enemies. When you successfully shove a creature, you deal bludgeoning damage to them equal to your Martial Arts Die.</p>
<p>At the start of each of your turns, any creature you have grappled takes bludgeoning damage equal to your Martial Arts Die.</p>
<p>Additionally, attacks made against you before you have taken a turn in combat have disadvantage.</p>`,
);

export const savageSlam = feat(
  "feature/brawler/sumo-wrestler/savage-slam", "Savage Slam", 11,
  `<p>Beginning at 11th level, you can drop your full weight on a foe like a falling meteorite. Once on each of your turns when you make an unarmed strike, you can deal twice the number of damage dice on a hit and the target must make a Strength saving throw, getting knocked prone on a failure, but you also knock yourself prone after the attack.</p>`,
  {
    save: { ability: "str", dc: null, scaling: "wis" },
  },
);

export const unstoppableTitan = feat(
  "feature/brawler/sumo-wrestler/unstoppable-titan", "Unstoppable Titan", 17,
  `<p>By 17th level, you are a master of the art of sumo, an unmovable titan. Whenever you take damage, you can reduce it by 1d10 + your Strength modifier. You can expend spirit points in addition to this ability to reduce the damage by 1d10 per spirit point expended.</p>`,
);

export const features: FeatureItem[] = [
  sumoStance, mountainStance, surfacePressure, savageSlam, unstoppableTitan,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Sumo Wrestler",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Sumo Wrestlers stand their ground and maintain perfect discipline and form to meet whatever challenge they face. In contrast to other brawlers, who are typically lithe and nimble, sumo wrestlers are rotund and rippling with muscle, a necessity for grappling with the mightiest contenders.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "sumo-wrestler",
    classIdentifier: "brawler",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(sumoStance) }, { uuid: fUuid(mountainStance) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(surfacePressure) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(savageSlam) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(unstoppableTitan) }]),
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
