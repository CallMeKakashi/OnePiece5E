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

export const destructiveWaveFeatures: FeatureItem[] = [
  feat(
    "additional-power/destructive-wave",
    "Destructive Wave",
    `<p>Destructive Wave is an ability that allows the wielder to unleash energy waves through their melee weapons, allowing them to strike multiple opponents at once. It is a more simple additional power, but a powerful one nonetheless.</p>`,
    { requirements: "" },
  ),
  feat(
    "additional-power/destructive-wave/area-of-effect",
    "Area of Effect",
    `<p>When you gain this ability, choose an area with it. This area will determine the range of the destructive wave ability. You cannot choose a different one again, unless you gain this additional power again, granting you an additional destructive wave option. Regardless of your choice, the wave originates from your position.</p>
<ul>
<li><strong>Cone.</strong> The area of the cone is a number of feet equal to your proficiency bonus x 10.</li>
<li><strong>Square.</strong> The area of the square is a 10ft x 10ft x 10ft cube multiplied by your proficiency bonus.</li>
<li><strong>Sphere.</strong> The area of the sphere is a number of feet equal to proficiency bonus x 5.</li>
<li><strong>Line.</strong> The area of the line is 5ft wide and has a length equal to your proficiency bonus x 20ft.</li>
</ul>`,
    { requirements: "Destructive Wave" },
  ),
  feat(
    "additional-power/destructive-wave/area-strike",
    "Area Strike",
    `<p>When you gain this ability, you can replace a melee attack with a destructive wave, producing an area of effect in the shape you chose in the Area of Effect feature. Each creature within the chosen area must succeed a Dexterity saving throw or take the damage they would take from the melee attack, taking half damage on a success.</p>
<p>For example, a greatsword would deal 2d6 + your Strength modifier slashing damage to each creature that failed the saving throw. This also counts for anything that modifies the damage of the attack, such as Ardent Smites, certain creations, etc. (but not any additional effects like stunning strike).</p>
<p>The DC of the saving throw equals 8 + your proficiency bonus + your choice of your Strength or Dexterity modifier. You can unleash a destructive wave a number of times equal to your proficiency bonus, regaining all uses after finishing a short or long rest.</p>`,
    {
      requirements: "Destructive Wave",
      activation: { type: "action", cost: 1, condition: "Replaces a melee attack" },
      uses: { value: null, max: "@prof", per: "sr", recovery: "", prompt: true },
      actionType: "save",
      save: { ability: "dex", dc: null, scaling: "flat" },
    },
  ),
];
