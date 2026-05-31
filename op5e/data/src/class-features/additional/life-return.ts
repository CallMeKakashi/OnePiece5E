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

export const lifeReturnFeatures: FeatureItem[] = [
  feat(
    "additional-power/life-return",
    "Life Return",
    `<p>Over years and years of training, you have extended full, conscious control to the bottom of your feet, and even to the tips of your hair. You become capable of manipulating every part of your body as if it were your hand.</p>`,
    { requirements: "" },
  ),
  feat(
    "additional-power/life-return/flexible-body",
    "Flexible Body",
    `<p>When you gain this ability, you find yourself able to move and change your physical body with ease. You can bend your body to attack in complex ways, change your appearance, and shift the balance of your physical body.</p>
<p>Your unarmed strikes now have the reach property, and can originate from any body part. You do not suffer disadvantage on attack rolls as a result of being restrained.</p>
<p>As a bonus action, you can alter your appearance in various ways. You can shift features of your body to appear different from your own, to the degree that you can appear as a different race, but you do not gain additional racial benefits. You can alter your height, but not to the degree that your size category changes.</p>
<p>Additionally, as a bonus action, you can alter your physical ability scores (Strength, Constitution, and Dexterity). You can lower a physical ability score to a minimum of 8, and move those points to another physical ability score, increasing it to 20. For example, say you have a Strength, Dexterity, and Constitution, each of which are 16. You can use your action to reduce your Strength by 4, and increase your Dexterity by 4, resulting in your scores to be Strength 12, Dexterity 20, and Constitution 16.</p>
<p>At 20th level, you can increase an ability score up to 24.</p>
<p>If you have an ability score to 20 or above, you gain the following benefits based on the score:</p>
<ul>
<li>Strength: Your weapon attacks deal an additional 1d4 damage, and gain the Siege property.</li>
<li>Dexterity: Your movement speed increases by 10ft, and you don't provoke opportunity attacks.</li>
<li>Constitution: You gain resistance to bludgeoning, piercing, and slashing damage.</li>
</ul>`,
    {
      requirements: "Life Return",
      activation: { type: "bonus", cost: 1, condition: "" },
    },
  ),
];
