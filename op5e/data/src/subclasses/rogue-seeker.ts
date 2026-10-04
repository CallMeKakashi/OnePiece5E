import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/rogue/seeker";

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
      requirements: `Rogue (Seeker) ${level}`,
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

export const wellRead = feat(
  "feature/rogue/seeker/well-read", "Well Read", 3,
  `<p>When you choose this subclass at 3rd level, you become proficient in the History and Investigation skills if you aren't already, and gain expertise in them. If you are already proficient in them, you can choose two other skills.</p>`,
);

export const keenStrikes = feat(
  "feature/rogue/seeker/keen-strikes", "Keen Strikes", 3,
  `<p>Beginning at 3rd level, you can make calculated strikes with a precise weapon, relying on your keen intellect over brute force or manual dexterity. You can use your Intelligence modifier, rather than Dexterity when attacking with a ranged weapon, a melee weapon that has the finesse property, or an unarmed strike.</p><p>Additionally, you do not require advantage on the attack roll to gain your sneak attack damage against creatures with a lesser Intelligence ability score. You do not gain this benefit if you have disadvantage on the attack roll.</p>`,
);

export const seekVulnerability = feat(
  "feature/rogue/seeker/seek-vulnerability", "Seek Vulnerability", 6,
  `<p>Starting at 6th level, you can decipher the precise weak points of your foes. The following effects are added to your Devious Strike options.</p><p><strong>Vex (Cost: 3d6).</strong> The target must succeed on an Intelligence saving throw, or become vexed for 1 minute. While a creature is vexed, they take an additional 1d6 damage from weapon attacks. This effect ends early if you use this feature on another creature, or if you choose to end it (no action required).</p><p><strong>Discover (Cost: 1d6).</strong> You learn two of the following features of the target: Damage resistances, damage immunities, damage vulnerabilities, conditional immunities, current hit points, or armor class.</p>`,
);

export const rationalMind = feat(
  "feature/rogue/seeker/rational-mind", "Rational Mind", 9,
  `<p>Starting at 9th level, you gain advantage on any Intelligence (History) or Intelligence (Investigation) check if you move no more than half your speed on the same turn.</p>`,
);

export const mindfulEvasion = feat(
  "feature/rogue/seeker/mindful-evasion", "Mindful Evasion", 13,
  `<p>Starting at 13th level, your mental acuity allows you to block out harmful effects affecting your mind and body. When you are subjected to an effect that allows you to make an Intelligence or Wisdom saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.</p>`,
);

export const unmatchedErudition = feat(
  "feature/rogue/seeker/unmatched-erudition", "Unmatched Erudition", 17,
  `<p>Beginning at 17th level, your intellect aids you in all endeavors, whether mental or physical. You can add your Intelligence modifier to any ability check or saving throw you make that doesn't already use your Intelligence modifier.</p>`,
);

export const features: FeatureItem[] = [
  wellRead, keenStrikes, seekVulnerability, rationalMind, mindfulEvasion, unmatchedErudition,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Seeker",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Seekers are rogues who see little value in gold or power. Their treasure is that of knowledge, being pursuers of ancient secrets and knowledge hidden away in forgotten corners of the world, sometimes for centuries.</p><p>Daring adventurers, seekers brave the dangers of the world, not only from the ancient temples they explore but also from those who wish to keep the secrets of the past hidden. They excel at gathering information and have a vast array of knowledge at their disposal.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "seeker",
    classIdentifier: "rogue",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(wellRead) }, { uuid: fUuid(keenStrikes) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(seekVulnerability) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(rationalMind) }]),
      createItemGrant(SC_ID, 13, [{ uuid: fUuid(mindfulEvasion) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(unmatchedErudition) }]),
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
