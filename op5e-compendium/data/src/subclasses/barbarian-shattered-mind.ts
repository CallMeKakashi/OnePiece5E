import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/barbarian/shattered-mind";

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
      requirements: `Barbarian (Shattered Mind) ${level}`,
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

export const creativitySpellcasting = feat(
  "feature/barbarian/shattered-mind/creativity", "Creativity (Spellcasting)", 3,
  `<p>At 3rd level, you augment your martial prowess with the ability to use creations. You have a notebook containing creations that show the first glimmerings of your true potential. See the medic creation list under "Gadgeteer Creations by Level".</p>
<p>You know three tricks of your choice from the medic creations list. You learn additional medic tricks of your choice at higher levels.</p>
<p>You prepare the list of medic creations that are available for you to cast. To do so, choose a number of medic creations from your notebook equal to your Intelligence modifier + half your Shattered Mind level rounded down (minimum of one creation).</p>
<p><strong>Creation save DC</strong> = 8 + your proficiency bonus + your Intelligence modifier</p>
<p><strong>Creation Attack modifier</strong> = your proficiency bonus + your Intelligence modifier</p>`,
);

export const shatteredDuality = feat(
  "feature/barbarian/shattered-mind/shattered-duality", "Shattered Duality", 3,
  `<p>Also at 3rd level, your body is home to two creatures, one who specializes in creativity, while the other specializes in destructive force.</p>
<p>You gain proficiency in Wisdom (Medicine) checks and Alchemist Tools, or expertise if you were already proficient in each respectively. Your Unarmored AC becomes 10 + your Intelligence modifier + your Constitution modifier.</p>
<p><strong>Master Brain.</strong> While you are not raging, you gain the following benefits:</p>
<ul>
<li>When you deal damage or restore hit points with a creation, you add your rage damage modifier to the result.</li>
<li>You have advantage on maintaining Concentration on creations.</li>
<li>Your proficiency in Strength saving throws becomes proficiency in Intelligence (unless you were already proficient in Intelligence saves, in which case choose Charisma or Wisdom).</li>
</ul>
<p><strong>Monster Brain.</strong> While you are raging, you gain the following benefits:</p>
<ul>
<li>Your size category increases by one size.</li>
<li>You gain temporary hit points equal to your level + Constitution modifier.</li>
<li>When you hit a creature with a melee weapon attack, you can overload your attack with a vile substance by expending a creation slot, dealing an extra 1d10 damage for each slot level. The damage type is your choice of acid, poison, or necrotic.</li>
<li>If you start your turn with fewer hit points than half your hit point maximum (rounded down), you must succeed on a DC 8 Wisdom saving throw or move directly toward the nearest creature and use the Attack action against that creature.</li>
</ul>`,
);

export const recklessBrilliance = feat(
  "feature/barbarian/shattered-mind/reckless-brilliance", "Reckless Brilliance", 6,
  `<p>Starting at 6th level, your intelligence and strength shine through your respective forms.</p>
<p><strong>Mad Genius.</strong> While you are not raging:</p>
<ul>
<li>Your Reckless Attack feature now works on attack rolls made with creations.</li>
<li>You have advantage on all Intelligence saving throws.</li>
</ul>
<p><strong>Bound Hulk.</strong> While you are raging:</p>
<ul>
<li>You gain resistance to acid, poison, or necrotic damage (choose when you enter your rage).</li>
</ul>`,
);

export const brutalFlair = feat(
  "feature/barbarian/shattered-mind/brutal-flair", "Brutal Flair", 10,
  `<p>Beginning at 10th level, your two minds continue to develop their own skills and personalities.</p>
<p><strong>Mind Matter.</strong> While you are not raging, when you hit with a critical hit with a creation attack, the creation counts as if it were cast one level higher. For tricks, additional damage die. The same applies against a creature who critically fails on a saving throw from your creations. This increases to two levels higher at 13th level, and three levels higher at 17th level.</p>
<p><strong>Painless Insanity.</strong> While you are raging, critical hits made against you count as normal hits.</p>`,
);

export const trueMind = feat(
  "feature/barbarian/shattered-mind/true-mind", "True Mind", 14,
  `<p>Beginning at 14th level, your minds now cooperate with each other. You gain the following benefits:</p>
<ul>
<li>Your Intelligence score increases by 2, to a maximum of 30.</li>
<li>You no longer need to make the Wisdom save while your hit points are below half while raging.</li>
<li>When you enter a rage, roll 1d4. You regain a temporary creation slot of that level that lasts until your rage ends.</li>
</ul>`,
);

export const features: FeatureItem[] = [
  creativitySpellcasting, shatteredDuality, recklessBrilliance, brutalFlair, trueMind,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Path of the Shattered Mind",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>They say some people can get lost in rage. That their very soul breaks, and their mind shatters like a piece of glass. Followers of the Shattered Mind are geniuses who have split their very essence, whether intentionally through experimentation, or through a series of unfortunate events.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "shattered-mind",
    classIdentifier: "barbarian",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(creativitySpellcasting) }, { uuid: fUuid(shatteredDuality) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(recklessBrilliance) }]),
      createItemGrant(SC_ID, 10, [{ uuid: fUuid(brutalFlair) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(trueMind) }]),
    ) as any,
    spellcasting: { progression: "third", ability: "int" },
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as SubclassItem;
