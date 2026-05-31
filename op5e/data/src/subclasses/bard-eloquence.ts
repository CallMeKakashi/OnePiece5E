import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/bard/eloquence";

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
      requirements: `Bard (Eloquence) ${level}`,
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

export const silverTongue = feat(
  "feature/bard/eloquence/silver-tongue", "Silver Tongue", 3,
  `<p>Starting at 3rd level, you are a master at saying the right thing at the right time. When you make a Charisma (Persuasion) or Charisma (Deception) check, you can treat a d20 roll of 9 or lower as a 10.</p>`,
);

export const mootWords = feat(
  "feature/bard/eloquence/moot-words", "Moot Words", 3,
  `<p>Also at 3rd level, you can spin words that discourage a creature and cause it to doubt itself. As a bonus action, you can expend one use of your Bardic Inspiration and choose one creature you can see within 60 feet of you. Roll the Bardic Inspiration die. The creature must subtract the number rolled from the next attack roll, ability check, or saving throw, of your choice, it makes before the start of your next turn.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    range: { value: 60, long: null, units: "ft" },
  },
);

export const dependableInspiration = feat(
  "feature/bard/eloquence/dependable-inspiration", "Dependable Inspiration", 6,
  `<p>At 6th level, your inspiring words are so persuasive that others feel driven to succeed. When a creature adds one of your Bardic Inspiration dice to its ability check, attack roll, or saving throw and the roll fails, the creature can keep the Bardic Inspiration die.</p>`,
);

export const universalSpeech = feat(
  "feature/bard/eloquence/universal-speech", "Universal Speech", 6,
  `<p>Also at 6th level, your songs and speech can reach the hearts and souls of any creature. As an action, choose one or more creatures within 60 feet of you, up to a number equal to your Charisma modifier (minimum of one creature). You can communicate with the chosen creatures, regardless of the language you speak, for 1 hour.</p>
<p>Once you use this feature, you can't use it again until you finish a long rest, unless you expend a creation slot to use it again.</p>`,
  {
    activation: { type: "action", cost: 1, condition: "" },
    range: { value: 60, long: null, units: "ft" },
    duration: { value: 1, units: "hour" },
    uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: true },
  },
);

export const infectiousInspiration = feat(
  "feature/bard/eloquence/infectious-inspiration", "Infectious Inspiration", 14,
  `<p>At 14th level, when you successfully inspire someone, the power of your eloquence can now spread to someone else.</p>
<p>When a creature within 60 feet of you adds one of your Bardic Inspiration dice to its ability check, attack roll, or saving throw and the roll succeeds, you can use your reaction to encourage a different creature (other than yourself) that can hear you within 60 feet of you, giving it a Bardic Inspiration die without expending any of your Bardic Inspiration uses.</p>
<p>You can use this reaction a number of times equal to 1 + your Charisma modifier (minimum of once), and you regain all expended uses when you finish a long rest.</p>`,
  {
    activation: { type: "reaction", cost: 1, condition: "Creature succeeds with Bardic Inspiration" },
    range: { value: 60, long: null, units: "ft" },
    uses: { value: null, max: "1 + @abilities.cha.mod", per: "lr", recovery: "", prompt: true },
  },
);

export const features: FeatureItem[] = [
  silverTongue, mootWords, dependableInspiration, universalSpeech, infectiousInspiration,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "College of Eloquence",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Bards of the college of eloquence are masters of speech, their silver tongues granting them the ability to talk their way out of almost any situation, whether to persuade the guard to look the other way or by discouraging the enemy. Most members tend to be politicians, poets, and writers seeking inspiration and adventure upon the high seas.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "eloquence",
    classIdentifier: "bard",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(silverTongue) }, { uuid: fUuid(mootWords) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(dependableInspiration) }, { uuid: fUuid(universalSpeech) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(infectiousInspiration) }]),
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
