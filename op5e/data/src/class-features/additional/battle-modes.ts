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

export const battleModesFeatures: FeatureItem[] = [
  feat(
    "additional-power/battle-modes",
    "Battle Modes",
    `<p><em>Prerequisites: 3rd level, Battlesmith Gadgeteer, Iron Defender feature</em></p>
<p>Gadgeteers that focus their attention to improving their creations eventually realize the potential there is within robots, particularly as a soldier made of iron.</p>`,
    { requirements: "Battlesmith Gadgeteer 3" },
  ),
  feat(
    "additional-power/battle-modes/improved-steel-defender",
    "Improved Steel Defender",
    `<p>During a long rest, choose a single form your Iron Defender will take until it is destroyed, or you change it.</p>
<p><strong>True Defender.</strong> When your Iron Defender uses its reaction to Deflect Attack, the Iron Defender instead enforces disadvantage on all attack rolls against that creature until the start of the Iron Defender's next turn. This ends early if the defended creature moves to a space more than 5ft from the Iron Defender.</p>
<p><strong>Juggernaut.</strong> Your Iron Defender increases from Medium to Large, gains resistance to bludgeoning, piercing, and slashing damage, and has advantage on Strength and Constitution Saving Throws.</p>
<p><strong>Android.</strong> Your Iron Defender's Intelligence score becomes equal to your own, shares all of your skill and weapon proficiencies, can speak Common, and can act of its own accord if you grant it permission to do so, no longer needing to command it as a bonus action.</p>
<p><strong>Drone.</strong> Your Iron Defender shrinks from Medium to Small, and gains a flying speed of 50ft. As a bonus action, you can see and hear through your Iron Defender. As an action, while looking through your Iron Defender, you can take precise control of your Iron Defender for the next hour.</p>`,
    { requirements: "Battle Modes" },
  ),
];
