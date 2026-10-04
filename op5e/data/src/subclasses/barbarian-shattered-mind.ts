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
  `<p>At 3rd level, you augment your martial prowess with the ability to use creations. You have a notebook containing creations that show the first glimmerings of your true potential. See the medic creation list under "Gadgeteer Creations by Level". (Creativity is synonymous with 5th edition Spellcasting. See "Casting a Spell" in the Player's Handbook for the general rules of Spellcasting in Dungeons and Dragons 5th edition).</p>
<table>
<thead><tr><th>Player Level</th><th>Tricks Known</th><th>1st</th><th>2nd</th><th>3rd</th><th>4th</th><th>5th</th></tr></thead>
<tbody>
<tr><td>3rd</td><td>3</td><td>3</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td>4th</td><td>3</td><td>3</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td>5th</td><td>3</td><td>4</td><td>2</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td>6th</td><td>3</td><td>4</td><td>2</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td>7th</td><td>3</td><td>4</td><td>3</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td>8th</td><td>3</td><td>4</td><td>3</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td>9th</td><td>3</td><td>4</td><td>3</td><td>2</td><td>—</td><td>—</td></tr>
<tr><td>10th</td><td>4</td><td>4</td><td>3</td><td>2</td><td>—</td><td>—</td></tr>
<tr><td>11th</td><td>4</td><td>4</td><td>3</td><td>3</td><td>—</td><td>—</td></tr>
<tr><td>12th</td><td>4</td><td>4</td><td>3</td><td>3</td><td>—</td><td>—</td></tr>
<tr><td>13th</td><td>4</td><td>4</td><td>3</td><td>3</td><td>1</td><td>—</td></tr>
<tr><td>14th</td><td>5</td><td>4</td><td>3</td><td>3</td><td>1</td><td>—</td></tr>
<tr><td>15th</td><td>5</td><td>4</td><td>3</td><td>3</td><td>2</td><td>—</td></tr>
<tr><td>16th</td><td>5</td><td>4</td><td>3</td><td>3</td><td>2</td><td>—</td></tr>
<tr><td>17th</td><td>5</td><td>4</td><td>3</td><td>3</td><td>3</td><td>1</td></tr>
<tr><td>18th</td><td>5</td><td>4</td><td>3</td><td>3</td><td>3</td><td>1</td></tr>
<tr><td>19th</td><td>5</td><td>4</td><td>3</td><td>3</td><td>3</td><td>2</td></tr>
<tr><td>20th</td><td>5</td><td>4</td><td>3</td><td>3</td><td>3</td><td>2</td></tr>
</tbody></table>
<p><strong>Tricks (Cantrips).</strong> You know three tricks of your choice from the medic creations list. You learn additional medic tricks of your choice at higher levels, as shown in the Tricks Known column of the Shattered Mind table. At the end of a long rest, you can change one of the tricks you know for another from your creation list.</p>
<p><strong>Preparing and Using Creations (Preparing and Casting Spells).</strong> The Shattered Mind table shows how many creation slots you have to use your medic creations of 1st Level and higher. You regain all expended creation slots when you finish a long rest.</p>
<p>You prepare the list of medic creations that are available for you to cast. To do so, choose a number of medic creations from your notebook equal to your Intelligence modifier + half your Shattered Mind level rounded down (minimum of one creation). The creations must be of a level for which you have creation slots.</p>
<p>For example, if you are a 5th-level Shattered Mind, you have four 1st-level and two 2nd-level creation slots. With a Intelligence of 14, your list of prepared creations can include four creations of 1st or 2nd level, in any combination. If you prepare the 1st-level creation Cure Wounds, you can cast it using a 1st-level or a 2nd-level slot. Casting the creation doesn't remove it from your list of prepared creations.</p>
<p>You can change your list of prepared creations when you finish a long rest. Preparing a new list of medic creations requires time spent tinkering with your creation casting focuses: at least 1 minute per creation level for each creation on your list.</p>
<p><strong>Creative Ability (Spellcasting Ability).</strong> Intelligence is your creative ability for your medic creations, as you learn through careful study and observation, trial and error. You use your Intelligence whenever a creation refers to your creative ability. In addition, you use your Intelligence modifier when setting the saving throw DC for the medic creations you cast and when making an attack roll with one.</p>
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
<li>If you start your turn with fewer hit points than half your hit point maximum (rounded down), you must succeed on a DC 8 Wisdom saving throw or move directly toward the nearest creature and use the Attack action against that creature. If more than one creature is equally near to you, your target is randomly determined. After your attack either hits or misses, you regain control of yourself.</li>
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
    description: { value: `<p>They say some people can get lost in rage. That their very soul breaks, and their mind shatters like a piece of glass. Even the most brilliant of people find themselves broken, find themselves lost. Followers of the Shattered Mind are geniuses who have split their very essence, whether intentionally through experimentation, or through a series of unfortunate events.</p><p>When a mind splits, the two remaining identities split off and develop not just mentally, but even physically as well. These barbarians are often victims, victims of a cruel reality, or even victims of their own recklessness when it comes to playing god.</p>`, chat: "" },
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
