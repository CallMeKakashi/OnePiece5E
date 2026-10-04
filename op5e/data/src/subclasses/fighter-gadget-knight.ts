import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";

const SUB = "subclass/fighter/gadget-knight";
const F = "feature/fighter/gadget-knight";

function fUuid(path: string): string {
  return compendiumUuid("class-features", generateId(path));
}

function feat(slug: string, name: string, desc: string, req: string): FeatureItem {
  return {
    _id: generateId(`${F}/${slug}`),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: req,
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
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null, duplicateSource: null, coreVersion: "13",
      systemId: "dnd5e", systemVersion: "5.1.10",
      createdTime: null, modifiedTime: null, lastModifiedBy: null,
    },
  };
}

const gadgeteerSpellcasting = feat(
  "gadgeteer-spellcasting", "Gadgeteer Spellcasting",
  `<p>At 3rd level, when you choose this subclass, you augment your martial prowess with the ability to use creations. You have a notebook containing creations that show the first glimmerings of your true potential. See the gadgeteer creation list under "Gadgeteer Creations by Level". (Creativity is synonymous with 5th edition Spellcasting. See "Casting a Spell" in the Player's Handbook for the general rules of Spellcasting in Dungeons and Dragons 5th edition).</p>
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
<p><strong>Tricks (Cantrips).</strong> You know three tricks, one of which is Mirrored Hand and the other two are of your choice from the gadgeteer creations list. You learn additional gadgeteer tricks of your choice at higher levels, as shown in the Tricks Known column of the Gadget Knight table. At the end of a long rest, you can change one of the tricks you know for another from your creation list.</p>
<p><strong>Preparing and Using Creations (Preparing and Casting Spells).</strong> The Gadget Knight table shows how many creation slots you have to use your gadgeteer creations of 1st Level and higher. You regain all expended creation slots when you finish a long rest.</p>
<p>You prepare the list of gadgeteer creations that are available for you to cast. To do so, choose a number of gadgeteer creations from your notebook equal to your Intelligence modifier + half your Gadget Trickster level rounded down (minimum of one creation). The creations must be of a level for which you have creation slots.</p>
<p>For example, if you are a 5th-level Gadget Knight, you have four 1st-level and two 2nd-level creation slots. With an Intelligence of 14, your list of prepared creations can include four creations of 1st or 2nd level, in any combination. If you prepare the 1st-level creation Cure Wounds, you can cast it using a 1st-level or a 2nd-level slot. Casting the creation doesn't remove it from your list of prepared creations.</p>
<p>You can change your list of prepared creations when you finish a long rest. Preparing a new list of gadgeteer creations requires time spent tinkering with your creation casting focuses: at least 1 minute per creation level for each creation on your list.</p>
<p><strong>Creative Ability (Spellcasting Ability).</strong> Intelligence is your creative ability for your gadgeteer creations, as you learn through careful study and observation, trial and error. You use your Intelligence whenever a creation refers to your creative ability. In addition, you use your Intelligence modifier when setting the saving throw DC for the gadgeteer creations you cast and when making an attack roll with one.</p>
<p>Creation save DC = 8 + your proficiency bonus + your Intelligence modifier</p>
<p>Creation Attack modifier = your proficiency bonus + your Intelligence modifier</p>`,
  "Gadget Knight 3",
);

const warMechanic = feat(
  "war-mechanic", "War Mechanic",
  `<p>At 3rd level, you gain proficiency with your choice of smith's tools, carpenter's tools, or tinkerer's tools, as well as the Engineering skill.</p>
<p>In addition, you gain the ability to further enhance your weapons with your creations. You can complete the augmentation process over the course of 1 hour, which can be done during a short rest. The weapon must be within your reach during the process. Choose one of the augments below:</p>
<ul>
<li><strong>Kickback.</strong> When you hit a creature of large or smaller size with your augmented weapon, you can push them away 10ft in a straight line.</li>
<li><strong>Breakdown.</strong> Once per turn, when you hit a creature with your augmented weapon, you can inflict disadvantage on their next attack roll until the start of your next turn.</li>
<li><strong>Lockup.</strong> When you hit a creature with your augmented weapon, their movement speed is reduced by 10ft until the start of your next turn.</li>
</ul>
<p>You can have up to two augmented weapons. If you attempt to augment a third weapon, you must remove the augment from one of the other two.</p>`,
  "Gadget Knight 3",
);

const creativeCombatant = feat(
  "creative-combatant", "Creative Combatant",
  `<p>Starting at 7th level, you begin to seemlessly mix your tricks with your attacks. When you take the Attack action on your turn, you can replace one of the attacks with a use one of your Gadget Knight tricks that has a casting time of an action.</p>`,
  "Gadget Knight 7",
);

const rechargingSurge = feat(
  "recharging-surge", "Recharging Surge",
  `<p>At 10th level, your ingenuity and fight spirit fuels your creations. When you use your Action Surge feature, you regain one expended creation slot of up to 3rd level.</p>`,
  "Gadget Knight 10",
);

const improvedCreativeCombatant = feat(
  "improved-creative-combatant", "Improved Creative Combatant",
  `<p>At 15th level, when you take the Attack action on your turn, you can replace two of the attacks with a use of one of your level 1 or level 2 creations that has a casting time of an action.</p>`,
  "Gadget Knight 15",
);

const masterOfWar = feat(
  "master-of-war", "Master of War",
  `<p>At 18th level, when you hit a creature with an attack using a weapon, that creature has Disadvantage on the next saving throw it makes against the next creation you use.</p>
<p>In addition, the creation slot you recover with your Recharging Surge can be up to 5th level.</p>`,
  "Gadget Knight 18",
);

export const gadgetKnight: SubclassItem = {
  _id: generateId(SUB),
  name: "Gadget Knight",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>Not all fighters are brutes who rely only on strength of arms to battle foes. Those known as gadget knights incorporate genius creativity and handy craftsmanship in their fighting style, creating useful gadgets that give them an upper hand in any fight.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "gadget-knight",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
      createItemGrant(SUB, 3, [
        { uuid: fUuid(`${F}/gadgeteer-spellcasting`) },
        { uuid: fUuid(`${F}/war-mechanic`) },
      ]),
      createItemGrant(SUB, 7, [
        { uuid: fUuid(`${F}/creative-combatant`) },
      ]),
      createItemGrant(SUB, 10, [
        { uuid: fUuid(`${F}/recharging-surge`) },
      ]),
      createItemGrant(SUB, 15, [
        { uuid: fUuid(`${F}/improved-creative-combatant`) },
      ]),
      createItemGrant(SUB, 18, [
        { uuid: fUuid(`${F}/master-of-war`) },
      ]),
    ),
    spellcasting: { progression: "half", ability: "int" },
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  _stats: {
    compendiumSource: null, duplicateSource: null, coreVersion: "13",
    systemId: "dnd5e", systemVersion: "5.1.10",
    createdTime: null, modifiedTime: null, lastModifiedBy: null,
  },
};

export const gadgetKnightFeatures: FeatureItem[] = [
  gadgeteerSpellcasting,
  warMechanic,
  creativeCombatant,
  rechargingSurge,
  improvedCreativeCombatant,
  masterOfWar,
];
