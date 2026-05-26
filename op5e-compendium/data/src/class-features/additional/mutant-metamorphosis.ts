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

export const mutantMetamorphosisFeatures: FeatureItem[] = [
  feat(
    "additional-power/mutant-metamorphosis",
    "Mutant Metamorphosis",
    `<p><em>Prerequisites: Medic class</em></p>
<p>Diving deep into the modification of organisms, a master of medicine can freely alter their body's functions, gaining access to a whole new world of possibilities.</p>`,
    { requirements: "Medic" },
  ),
  feat(
    "additional-power/mutant-metamorphosis/mutation-points",
    "Mutation Points",
    `<p>You have a pool of Mutation Points which you can expend to augment your transformations when you use your Experimental Medicine feature. This pool of points equals your level + your Wisdom modifier, all of which you regain at the end of a long rest.</p>
<p>When you enter one of your Experimental Medicine forms, you can expend a number of your Mutation Points to take on additional benefits from your transformation.</p>
<ul>
<li><strong>Extended Arms.</strong> You can increase your reach by 5ft. (Costs 2 points)</li>
<li><strong>Thicker Skin.</strong> You gain a +1 bonus to your AC. (Costs 2 points)</li>
<li><strong>Sharp Strikes.</strong> You gain a +1 bonus to your unarmed strikes for each point you spend on this option. (Costs 1 to a maximum of 3)</li>
<li><strong>Gills and Fins.</strong> You gain a swim speed equal to your walking speed and you can breathe underwater. (Costs 2 Points)</li>
<li><strong>Nightvision.</strong> You gain darkvision of 120ft. (Cost 2 points)</li>
<li><strong>Deft Feet.</strong> You ignore the effects of difficult terrain. (Costs 2 points)</li>
<li><strong>Mighty Leap.</strong> Your jump distances increase by 10ft. (Costs 1 point)</li>
<li><strong>Echolocation.</strong> You gain blindsight of 30ft, though it ceases to function if you are deafened. (Costs 5 points)</li>
<li><strong>Keen Hearing.</strong> You gain advantage on hearing based perception checks. (Costs 2 points)</li>
<li><strong>Keen Smell.</strong> You gain advantage on smell based perception checks. (Costs 2 points)</li>
<li><strong>Keen Sight.</strong> You gain advantage on sight based perception checks. (Costs 3 points)</li>
</ul>`,
    {
      requirements: "Mutant Metamorphosis",
      uses: { value: null, max: "@details.level + @abilities.wis.mod", per: "lr", recovery: "", prompt: true },
    },
  ),
];
