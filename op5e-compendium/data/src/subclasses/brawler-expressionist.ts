import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/brawler/expressionist";

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
      requirements: `Brawler (Expressionist) ${level}`,
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

export const expressionistCreativity = feat(
  "feature/brawler/expressionist/creativity", "Creativity", 3,
  `<p>At 3rd level, you augment your martial prowess with the ability to use creations (spells). You prepare and cast gadgeteer creations using Wisdom as your creative ability.</p>
<p><strong>Creation save DC</strong> = 8 + your proficiency bonus + your Wisdom modifier</p>
<p><strong>Creation Attack modifier</strong> = your proficiency bonus + your Wisdom modifier</p>
<p>You know three tricks (cantrips) from the gadgeteer creation list. You learn additional tricks at higher levels. You prepare a number of creations equal to your Wisdom modifier + half your Expressionist level (rounded down, minimum 1). You regain all expended creation slots when you finish a long rest.</p>`,
);

export const spiritualGimmicks = feat(
  "feature/brawler/expressionist/spiritual-gimmicks", "Spiritual Gimmicks", 3,
  `<p>Starting at 3rd level, you gain proficiency in Intelligence (Engineering) checks and Tinker's Tools, or expertise if you already have proficiency. Any brawler weapon or Tinker's Tool you wield can count as a creative focus for your creations.</p>
<p>Your creative spirit allows you to modify your creations in the following ways:</p>
<ul>
<li>Use a creation with a casting time of one action as a bonus action by spending spirit points equal to its level (1 for tricks).</li>
<li>Double the range of a creation (or change touch to 30 ft) for 1 spirit point.</li>
<li>Use a creation without verbal or somatic components for 1 spirit point.</li>
<li>Target a second creature with a single-target creation for spirit points equal to its level (1 for tricks).</li>
<li>Protect creatures of your choice (up to Wisdom modifier) from your area creation's full force for 1 spirit point; they auto-succeed on the save and take no damage on half-damage saves.</li>
</ul>`,
);

export const potentExpression = feat(
  "feature/brawler/expressionist/potent-expression", "Potent Expression", 6,
  `<p>Starting at 6th level, you can seamlessly weave your creations with your martial arts. You can add your Wisdom modifier to any damage rolls made with creations.</p>
<p>In addition, when you use a creation, you can use your bonus action to make an unarmed strike or use Flurry of Blows.</p>`,
);

export const flexibleSpirit = feat(
  "feature/brawler/expressionist/flexible-spirit", "Flexible Spirit", 11,
  `<p>At 11th level, your creative spirit can act as fuel towards your tricks and creations. As an action, you can transform spirit points into creation slots. You can create creation slots no higher in level than 5th. Any creation slot you create with this feature vanishes when you finish a short or long rest.</p>
<p>Conversion rates: 1st — 2 SP, 2nd — 3 SP, 3rd — 5 SP, 4th — 6 SP, 5th — 7 SP.</p>`,
  {
    activation: { type: "action", cost: 1, condition: "" },
  },
);

export const signatureCreations = feat(
  "feature/brawler/expressionist/signature-creations", "Signature Creations", 17,
  `<p>At 17th level, you have mastered your creative style, enabling you to recreate low creations at will.</p>
<p>Choose a 1st and 2nd level Gadgeteer creation that you have prepared; you can now use those creations at their lowest level without expending a creation slot.</p>
<p>You can spend 8 hours of downtime adjusting your creations, allowing you to switch your Signature Creations.</p>`,
);

export const features: FeatureItem[] = [
  expressionistCreativity, spiritualGimmicks, potentExpression, flexibleSpirit, signatureCreations,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Expressionist",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>While brawlers tend to make their mark on the world with their fists, Expressionists take an alternative approach. These brawlers mix their spiritual experiences with their own forms of art, weaving these experiences into tactics and techniques they could use in everyday life.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "expressionist",
    classIdentifier: "brawler",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(expressionistCreativity) }, { uuid: fUuid(spiritualGimmicks) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(potentExpression) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(flexibleSpirit) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(signatureCreations) }]),
    ) as any,
    spellcasting: { progression: "third", ability: "wis" },
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as SubclassItem;
