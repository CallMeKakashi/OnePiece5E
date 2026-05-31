import type { FeatureItem } from "../../../schemas/feature.js";
import { generateId } from "../../../helpers/id.js";

function feat(
  idPath: string,
  name: string,
  description: string,
  overrides: Partial<FeatureItem["system"]> = {},
): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: overrides.requirements ?? "",
      activation: overrides.activation ?? { type: "", cost: null, condition: "" },
      duration: overrides.duration ?? { value: null, units: "" },
      target: overrides.target ?? { value: null, width: null, units: "", type: "" },
      range: overrides.range ?? { value: null, long: null, units: "" },
      uses: overrides.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: overrides.actionType ?? "",
      damage: overrides.damage ?? { parts: [], versatile: "" },
      save: overrides.save ?? { ability: "", dc: null, scaling: "spell" },
      chatFlavor: overrides.chatFlavor ?? "",
      recharge: overrides.recharge ?? { value: null, charged: false },
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null,
      duplicateSource: null,
      coreVersion: "13",
      systemId: "dnd5e",
      systemVersion: "5.1.10",
      createdTime: null,
      modifiedTime: null,
      lastModifiedBy: null,
    },
  };
}

export const inspiredInnovationFeatures: FeatureItem[] = [
  feat(
    "additional-power/inspired-innovation",
    "Inspired Innovation",
    `<p><em>Prerequisites: 3rd level, a Charisma, Intelligence, or Wisdom score of 14 or higher, and proficiency in a specific skill</em></p>
<p>You have studied under a person, or even the teachings of multiple people who honed the ability of creativity, either by the arts, medical training, or mechanical knowledge.</p>
<p>Choose a class with creativity, requiring proficiency in a certain skill: Gadgeteer (Intelligence)(Engineering), Medic (Wisdom)(Medicine), Marksman (Wisdom)(Survival), or Bard (Charisma)(Performance).</p>
<p>You gain the benefits of the Creativity feature of that class, however the progression of the creativity is at most that of a half-caster. If the class you chose has tricks, you learn a number of tricks according to the table below.</p>
<p>You prepare the list of creations that are available for you to use, choosing from the specified class creation list. When you do so, choose a number of creations equal to your Creativity modifier + half your level, rounded down (minimum of one). The creations must be of a level for which you have creation slots.</p>
<p>If you already have the ability to use Creativity, you instead can now choose from both creation lists. If the Creativity from your main class doesn't have tricks, you can gain the tricks of the chosen class for this power, as per the table below.</p>
<p>If the chosen creation class requires the use of an apparatus, you must also utilize that apparatus to use the creations.</p>
<table>
<caption>Inspired Innovation Creations</caption>
<thead><tr><th>Player Level</th><th>Tricks Known*</th><th>1st</th><th>2nd</th><th>3rd</th><th>4th</th><th>5th</th></tr></thead>
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
</tbody>
</table>`,
    { requirements: "Level 3, Charisma/Intelligence/Wisdom 14, Proficiency in specific skill" },
  ),
];
