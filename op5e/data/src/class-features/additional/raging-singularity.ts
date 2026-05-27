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

export const ragingSingularityFeatures: FeatureItem[] = [
  feat(
    "additional-power/raging-singularity",
    "Raging Singularity",
    `<p><em>Prerequisites: Barbarian class</em></p>
<p>When faced with an indomitable threat, a living being has one of two choices: Fight or flight. A barbarian who can exude such primal menace sends out waves of terror while they rage, forcing all their enemies to make the same decision every prey animal must decide. To run from an inevitable threat, or to engage in mortal combat.</p>`,
    { requirements: "Barbarian" },
  ),
  feat(
    "additional-power/raging-singularity/ferocious-aura",
    "Ferocious Aura",
    `<p>While raging, you have an aura that extends 10 feet from you, but not through total cover, drawing all aggression towards yourself. Each creature of your choice that starts their turn within the aura must make a Wisdom Saving throw, DC = 8 + your Constitution modifier + your proficiency bonus. On a failure the creature has disadvantage on attack rolls against any creature other than you while they are within the aura until the start of your next turn.</p>
<p>If a creature is immune to the frightened condition, that creature automatically succeeds on this saving throw. If the creature has advantage on saving throws against being frightened, the creature also has advantage on this saving throw.</p>`,
    {
      requirements: "Raging Singularity",
      target: { value: 10, width: null, units: "ft", type: "radius" },
      save: { ability: "wis", dc: null, scaling: "flat" },
    },
  ),
];
