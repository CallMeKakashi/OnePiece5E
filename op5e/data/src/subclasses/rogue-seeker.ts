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
  `<p>When you choose this archetype at 3rd level, you gain proficiency in History and Investigation if you don't already have them. Your proficiency bonus is doubled for any ability check you make using either of those skills.</p>`,
);

export const keenStrikes = feat(
  "feature/rogue/seeker/keen-strikes", "Keen Strikes", 3,
  `<p>At 3rd level, you can use your Intelligence modifier instead of Strength or Dexterity for weapon attack and damage rolls. Additionally, you can deal Sneak Attack damage to a creature if its Intelligence score is lower than yours, even without advantage or an adjacent ally (you still cannot have disadvantage).</p>`,
);

export const seekVulnerability = feat(
  "feature/rogue/seeker/seek-vulnerability", "Seek Vulnerability", 6,
  `<p>At 6th level, you gain the following additional Devious Strike options:</p><ul><li><strong>Analyze (Cost: 1d6).</strong> You learn the target's damage vulnerabilities, resistances, and immunities.</li><li><strong>Exploit Mind (Cost: 2d6).</strong> The target must succeed on an Intelligence saving throw or have disadvantage on its next attack roll or ability check.</li></ul>`,
);

export const rationalMind = feat(
  "feature/rogue/seeker/rational-mind", "Rational Mind", 9,
  `<p>At 9th level, you have advantage on Intelligence (History) and Intelligence (Investigation) checks. Additionally, you can't be charmed while conscious.</p>`,
);

export const mindfulEvasion = feat(
  "feature/rogue/seeker/mindful-evasion", "Mindful Evasion", 13,
  `<p>Starting at 13th level, your Evasion feature applies to Intelligence and Wisdom saving throws in addition to Dexterity saving throws.</p>`,
);

export const unmatchedErudition = feat(
  "feature/rogue/seeker/unmatched-erudition", "Unmatched Erudition", 17,
  `<p>At 17th level, you can add your Intelligence modifier to any ability check or saving throw that doesn't already include your Intelligence modifier.</p>`,
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
    description: { value: `<p>The Seeker is a scholar-rogue who uses intellect as their sharpest weapon. They study their enemies, exploit weaknesses, and outthink every obstacle.</p>`, chat: "" },
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
