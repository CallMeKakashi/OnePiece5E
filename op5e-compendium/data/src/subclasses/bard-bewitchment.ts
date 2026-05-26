import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/bard/bewitchment";

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
      requirements: `Bard (Bewitchment) ${level}`,
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

export const hypnoticFocus = feat(
  "feature/bard/bewitchment/hypnotic-focus", "Hypnotic Focus", 3,
  `<p>At 3rd level, instead of using an instrument as a focus for enrapturing your audience, you can instead utilize a particular object that you have had practice with, be it a set of painter's tools, or a special chakram on a string.</p>
<p>As part of a long rest, you can spend an hour practicing with an object of small or lesser size, transforming it into your hypnotic focus. This object remains as your hypnotic focus until you practice with another object for 1 hour over the course of a long rest.</p>
<p>While holding your Hypnotic Focus, whenever one of your Bardic Inspiration dice are rolled, you may roll twice and choose which one takes effect.</p>`,
);

export const mesmerizingWords = feat(
  "feature/bard/bewitchment/mesmerizing-words", "Mesmerizing Words", 3,
  `<p>At 3rd level, through focus and mystique you find your words sharpen, moving all that hear it. When you use a bard creation that deals damage or restores hit points you can expend a use of your Bardic Inspiration feature to add an extra die to the roll. The die is the same size as your Bardic Inspiration die.</p>`,
);

export const wideEnchantment = feat(
  "feature/bard/bewitchment/wide-enchantment", "Wide Enchantment", 6,
  `<p>At 6th level, your creations to enchant others can have far reaching effects. When you use an enchantment creation of 1st level or higher that targets only one creature, you can have it target a second creature within range.</p>`,
);

export const potentCreativity = feat(
  "feature/bard/bewitchment/potent-creativity", "Potent Creativity", 6,
  `<p>Also at 6th level, you can add your Charisma modifier to the damage you deal with any Bard trick.</p>`,
);

export const hypnoticMastery = feat(
  "feature/bard/bewitchment/hypnotic-mastery", "Hypnotic Mastery", 14,
  `<p>Starting at 14th level, you have mastered the difficult art of commanding the minds of others. You gain the following benefits:</p>
<ul>
<li>When you use your Mesmerizing Words feature, you no longer need to expend a Bardic Inspiration die to do so.</li>
<li>When you use an enchantment creation that specifies that it only affects creatures of the humanoid creature type, you may ignore that restriction.</li>
<li>If you are maintaining concentration on an enchantment creation, taking damage doesn't break your concentration.</li>
</ul>`,
);

export const features: FeatureItem[] = [
  hypnoticFocus, mesmerizingWords, wideEnchantment, potentCreativity, hypnoticMastery,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "College of Bewitchment",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Bards of the college of bewitchment are often labeled as practitioners of witchcraft, voo-doo, or some other supernatural gift. However, this is far from the case. Instead, their art influences the minds of all who experience it, causing them to believe the impossible to be possible.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "bewitchment",
    classIdentifier: "bard",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(hypnoticFocus) }, { uuid: fUuid(mesmerizingWords) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(wideEnchantment) }, { uuid: fUuid(potentCreativity) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(hypnoticMastery) }]),
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
