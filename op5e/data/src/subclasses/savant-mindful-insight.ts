import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/savant/mindful-insight";

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
      requirements: `Savant (Mindful Insight) ${level}`,
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

export const psychicSoul = feat(
  "feature/savant/mindful-insight/psychic-soul", "Psychic Soul", 1,
  `<p>Beginning when you unlock this ardent soul at 1st level, you gain resistance to psychic damage. You also learn the Whisper and Mind Slash tricks if you don't already know them.</p>`,
);

export const channelConvictionMindful = feat(
  "feature/savant/mindful-insight/channel-conviction", "Channel Conviction: Mindful Insight", 3,
  `<p>At 3rd level, you gain the following two Channel Conviction options:</p>
<ul>
<li><strong>Future's Ward.</strong> As a reaction when an ally is the target of an attack or is forced to roll a saving throw, you can use your Channel Conviction to peer into the future. You can impose disadvantage on the attack roll, or grant the ally advantage on the saving throw. If you impose disadvantage, the target must additionally subtract your Charisma modifier from its roll. If you grant advantage, the ally may add your Charisma modifier to its roll.</li>
<li><strong>Powerful Premonition.</strong> As a bonus action, you can empower your psychic prowess. For 1 minute, you can use your bonus action to use the Mind Slash trick.</li>
</ul>`,
  { uses: { value: null, max: "1", per: "sr", recovery: "", prompt: true } },
);

export const auraOfWarding = feat(
  "feature/savant/mindful-insight/aura-of-warding", "Aura of Warding", 7,
  `<p>Starting at 7th level, you and friendly creatures within 10 feet of you have resistance to the damage of creations while you are conscious.</p>
<p>At 18th level, the range of this aura increases to 30 feet.</p>`,
);

export const exposingSmite = feat(
  "feature/savant/mindful-insight/exposing-smite", "Exposing Smite", 15,
  `<p>Beginning at 15th level, when you deal damage to a creature with Ardent Smite, you scry its mind for weaknesses. The next attack made against the target by a creature other than you then has advantage.</p>`,
);

export const fateweaver = feat(
  "feature/savant/mindful-insight/fateweaver", "Fateweaver", 20,
  `<p>At 20th level, you can ascend to a higher state of mind. As a bonus action, you gain the following benefits for 1 minute:</p>
<ul>
<li>You are immune to psychic damage.</li>
<li>Attack rolls against you have disadvantage, and you have advantage on all saving throws.</li>
<li>Immediately when you activate this feature, roll two d20, called fate dice, and record the rolls. At any point before the transformation ends, you can replace any d20 roll made by a creature you can see with one of these fate dice. You can only do this once per turn, and any unused fate dice disappear at the end of the transformation.</li>
</ul>
<p>Once you use this bonus action, you can't use it again until you finish a long rest, unless you expend a 5th-level creation slot to use it again.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: true },
  },
);

export const features: FeatureItem[] = [
  psychicSoul, channelConvictionMindful, auraOfWarding, exposingSmite, fateweaver,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Mindful Insight",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>These savants have been blessed with the arts of premonition, able to scry the future through crystal balls or tarot cards, and they are sometimes referred to as "oracles".</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "mindful-insight",
    classIdentifier: "savant",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 1, [{ uuid: fUuid(psychicSoul) }]),
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(channelConvictionMindful) }]),
      createItemGrant(SC_ID, 7, [{ uuid: fUuid(auraOfWarding) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(exposingSmite) }]),
      createItemGrant(SC_ID, 20, [{ uuid: fUuid(fateweaver) }]),
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
