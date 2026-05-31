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

export const emphaticObservationFeatures: FeatureItem[] = [
  feat(
    "additional-power/emphatic-observation",
    "Emphatic Observation",
    `<p><em>Prerequisites: 10th level, Color of Observation Apprentice</em></p>
<p>You gain the ability to sense the presence of creatures, specifically their true thoughts and emotions through the use of your Observation haki.</p>`,
    { requirements: "Color of Observation Apprentice 10" },
  ),
  feat(
    "additional-power/emphatic-observation/emphasized-empathy",
    "Emphasized Empathy",
    `<p>You gain proficiency in Wisdom (Insight) skill checks. If you were already proficient in Insight, you instead gain expertise.</p>
<p>When you use Sense Presence, you also gain a sense of the emotions and true thoughts of those within your Sense Presence. You learn the creature's alignment and its immediate surface-level thoughts.</p>
<p>If you use the ability on them a second time, you can look deeper, you gain Insight into their reasoning, their emotional state, and their mind (such as something it worries over, loves, or hates).</p>
<p>A creature that is currently being deceitful can attempt to fool the observation haki by making a deception check against your insight.</p>`,
    { requirements: "Emphatic Observation" },
  ),
];
