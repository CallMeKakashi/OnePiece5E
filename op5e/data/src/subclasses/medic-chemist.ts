import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/medic/chemist";

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
      requirements: `Medic (Chemist) ${level}`,
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

export const experimentalOoze = feat(
  "feature/medic/chemist/experimental-ooze", "Experimental Ooze", 2,
  `<p>At 2nd level, you've redesigned the formula for your Experimental Medicine, allowing you to create a form of life from it instead of empowering yourself. As an action, you expend one use of Experimental Medicine to summon an Experimental Ooze instead of gaining any enhancements.</p>
<p>When you summon the ooze, choose one damage type from the table below. Your ooze will gain abilities specific to that option:</p>
<ul>
<li><strong>Acid.</strong> When the ooze deals damage with its Pseudopod attack, it regains hit points equal to half the damage dealt.</li>
<li><strong>Cold.</strong> When the ooze hits a creature with its Pseudopod attack, the target becomes grappled (escape DC equal to your creation save DC).</li>
<li><strong>Fire.</strong> Any creature that hits the ooze with a melee attack within 5ft takes 1d8 fire damage.</li>
<li><strong>Poison.</strong> When the ooze hits a creature, it must make a Constitution saving throw or become poisoned until the end of their next turn.</li>
<li><strong>Lightning.</strong> The ooze's movement speed increases by 20ft and doesn't provoke opportunity attacks.</li>
</ul>
<p>The ooze manifests for 1 hour, until it is reduced to 0 hit points, until you use this feature again, until you die, or if you dismiss it.</p>`,
  { activation: { type: "action", cost: 1, condition: "" } },
);

export const chemicalReactions = feat(
  "feature/medic/chemist/chemical-reactions", "Chemical Reactions", 6,
  `<p>Beginning at 6th level, the volatile chemicals within your ooze enhances your ability to deal damage of certain types. Whenever you use a creation that deals damage while your experimental ooze is summoned, you can roll a d8 and add it to one damage roll of the creation.</p>
<p>Additionally, when you use a creation with a range other than self, you can cause the creation to originate from you or your experimental ooze.</p>`,
);

export const enhancedFormula = feat(
  "feature/medic/chemist/enhanced-formula", "Enhanced Formula", 10,
  `<p>Beginning at 10th level, you have further improved the formulas used to create your ooze. When you summon your Experimental Ooze, you can choose to have it be Large in size, increasing its damage rolls.</p>
<p>In addition, it gains additional benefits for each type of ooze:</p>
<ul>
<li><strong>Acid.</strong> The ooze has additional hit points equal to your level.</li>
<li><strong>Cold.</strong> Creatures grappled by the ooze are now restrained and take 1d8 cold damage at the start of each of their turns.</li>
<li><strong>Fire.</strong> When the ooze hits with its Pseudopod, the target must succeed a Constitution saving throw or become ignited for 1 minute (2d4 fire damage at start of each turn).</li>
<li><strong>Poison.</strong> The ooze can use its action to touch a poisoned creature, ending the effect as it absorbs the poison.</li>
<li><strong>Lightning.</strong> If the ooze moved 20ft before a Pseudopod attack, the target must succeed a Strength saving throw or become knocked prone.</li>
</ul>`,
);

export const perfectedMixture = feat(
  "feature/medic/chemist/perfected-mixture", "Perfected Mixture", 14,
  `<p>Beginning at 14th level, you have mastered the art of creating your vision. You gain the following benefits:</p>
<ul>
<li>Your ooze now lasts until it is reduced to 0 hit points, or until you dismiss it, instead of only 1 hour.</li>
<li>When you summon your Experimental Ooze, you may choose two damage types instead of one, gaining the benefits of both.</li>
<li>Your ooze gains resistance to bludgeoning, piercing, and slashing damage.</li>
</ul>`,
);

export const features: FeatureItem[] = [
  experimentalOoze, chemicalReactions, enhancedFormula, perfectedMixture,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Chemist",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Chemists take the practice of medicine to its logical extremes, and often beyond that. They are boundless visionaries who push their craft to the breaking point, finding ways to cause harm with an art oftentimes meant to save lives.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "chemist",
    classIdentifier: "medic",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 2, [{ uuid: fUuid(experimentalOoze) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(chemicalReactions) }]),
      createItemGrant(SC_ID, 10, [{ uuid: fUuid(enhancedFormula) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(perfectedMixture) }]),
    ) as any,
    spellcasting: { progression: "none", ability: "" },
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as SubclassItem;
