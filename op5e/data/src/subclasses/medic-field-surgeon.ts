import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import { createDAEEffect, overrideValue } from "../../helpers/effects.js";
import { DAE_KEYS } from "../../schemas/common.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/medic/field-surgeon";

function feat(idPath: string, name: string, level: number, description: string, extra: any = {}, effects: any[] = []): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: `Medic (Field Surgeon) ${level}`,
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
    effects,
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem;
}

export const combatMedicine = feat(
  "feature/medic/field-surgeon/combat-medicine", "Combat Medicine", 2,
  `<p>Beginning at 2nd level, you can now use Experimental Medicine as a bonus action rather than an action and can swap between enhancements as a bonus action as well.</p>
<p>Additionally, the temporary hit points you gain from Experimental Medicine now includes your Wisdom modifier.</p>
<p>Furthermore, you gain a natural armor equal to 10 + your Wisdom Modifier + your Proficiency Bonus. This natural armor does not benefit from shields, and you cannot benefit from any worn armor.</p>
<p><em>Field Surgeons: use this feature (not the base Experimental Medicine item) to administer EM in combat. Enhancement swap remains manual.</em></p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    target: { value: null, width: null, units: "", type: "self" },
    range: { value: null, long: null, units: "self" },
    uses: { value: 2, max: "2", per: "sr", recovery: "", prompt: true },
    actionType: "heal",
    damage: { parts: [["4 * @classes.medic.levels + @abilities.wis.mod", "temphp"]], versatile: "" },
    chatFlavor: "Combat EM: bonus action; temp HP = 4×medic level + WIS mod (shares pool with Experimental Medicine)",
  },
  [
    createDAEEffect("medic/field-surgeon/combat-medicine", "Combat Medicine", [
      overrideValue(DAE_KEYS.AC_FORMULA, "10 + @abilities.wis.mod + @prof"),
    ]),
  ],
);

export const enhancedForms = feat(
  "feature/medic/field-surgeon/enhanced-forms", "Enhanced Forms", 2,
  `<p>Also at 2nd level, the enhancements provided by Experimental Medicine become stronger for you:</p>
<ul>
<li><strong>Hulking Strength.</strong> The damage die of your unarmed strikes and melee weapon attacks increases to 1d10.</li>
<li><strong>Nimble Dexterity.</strong> Opportunity attacks against you now have disadvantage.</li>
<li><strong>Resilient Constitution.</strong> You gain resistance to bludgeoning, piercing, and slashing damage.</li>
</ul>`,
);

export const fieldSurgeonExtraAttack = feat(
  "feature/medic/field-surgeon/extra-attack", "Extra Attack", 6,
  `<p>Beginning at 6th level, you can attack twice, instead of once, when you take the Attack action on your turn.</p>
<p>If you ready your action to make an attack, you can attack the same number of times you would if you had taken the attack action on your turn.</p>`,
  {
    chatFlavor: "Attack action attacks: 2",
  },
);

export const monstrousTransformation = feat(
  "feature/medic/field-surgeon/monstrous-transformation", "Monstrous Transformation", 6,
  `<p>Also at 6th level, you can cast aside common sense and use the full strength of your medicine to transform into a monster. As a bonus action on your turn, transform into a monstrous form of yourself. During this transformation, you gain the following benefits:</p>
<ul>
<li>Your size becomes large, and your creature type becomes monstrosity.</li>
<li>The temporary hit points you gain are doubled.</li>
<li>Your unarmed strikes gain a bonus to attack and damage rolls equal to half your proficiency bonus (rounded up).</li>
<li>You gain the benefits of all three enhancements available to Experimental Medicine simultaneously.</li>
</ul>
<p>During this transformation, you cannot use creations. At the start of each of your turns, you must make an Intelligence saving throw, DC 15. On a failure, you lose control until the start of your next turn and must move towards and attack the closest creature.</p>
<p>Once this transformation ends, you gain one level of exhaustion and cannot transform like this again until you finish a long rest.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: true },
  },
);

export const containedRampage = feat(
  "feature/medic/field-surgeon/contained-rampage", "Contained Rampage", 10,
  `<p>Beginning at 10th level, you no longer need to make the Intelligence save to regain control during Monstrous Transformation and can move and act normally, however you still cannot use creations in this state and still suffer a level of exhaustion once it ends.</p>`,
);

export const greaterEnhancements = feat(
  "feature/medic/field-surgeon/greater-enhancements", "Greater Enhancements", 14,
  `<p>Starting at 14th level, you've mastered the formula for your Experimental Medicine, enhancing the effects of it even further:</p>
<ul>
<li><strong>Hulking Strength.</strong> The damage die of your unarmed strikes and melee weapon attacks increases to 1d12, and you now have advantage on all Strength checks and saving throws.</li>
<li><strong>Nimble Dexterity.</strong> Your speed doubles and creatures cannot make opportunity attacks against you.</li>
<li><strong>Resilient Constitution.</strong> You gain immunity to the paralyzed, stunned, and poisoned conditions, and resistance to poison and necrotic damage.</li>
</ul>
<p>Additionally, you can now use creations in your Monstrous Transformation as you have mastered the transformation completely.</p>`,
);

export const features: FeatureItem[] = [
  combatMedicine, enhancedForms, fieldSurgeonExtraAttack, monstrousTransformation, containedRampage, greaterEnhancements,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Field Surgeon",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Field surgeons are the archetypical pirate crew doctors, who wade into the fray with their allies without fear. They are the most adept at using experimental medicine in combat and have found ways to improve its potency manifold.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "field-surgeon",
    classIdentifier: "medic",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 2, [{ uuid: fUuid(combatMedicine) }, { uuid: fUuid(enhancedForms) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(fieldSurgeonExtraAttack) }, { uuid: fUuid(monstrousTransformation) }]),
      createItemGrant(SC_ID, 10, [{ uuid: fUuid(containedRampage) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(greaterEnhancements) }]),
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
