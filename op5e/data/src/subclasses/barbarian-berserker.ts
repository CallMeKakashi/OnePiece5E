import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/barbarian/berserker";

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
      requirements: `Barbarian (Berserker) ${level}`,
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

export const fightingFrenzy = feat(
  "feature/barbarian/berserker/fighting-frenzy", "Fighting Frenzy", 3,
  `<p>Starting when you choose this path at 3rd level, your rage is nothing short of a fighting frenzy. As a bonus action while raging, you can make one weapon attack with a weapon you are currently wielding. You can also make this bonus action attack as part of the bonus action you used to enter your rage.</p>`,
  { activation: { type: "bonus", cost: 1, condition: "While raging" } },
);

export const mindlessRage = feat(
  "feature/barbarian/berserker/mindless-rage", "Mindless Rage", 6,
  `<p>Beginning at 6th level, you can't be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.</p>`,
);

export const recklessSeverity = feat(
  "feature/barbarian/berserker/reckless-severity", "Reckless Severity", 6,
  `<p>Beginning at 6th level, your unstoppable offensive abilities more than make up for a less than stable defense.</p>
<p>When you use your Reckless Attack feature, all your melee weapon attacks score a critical hit when the dice rolls 19 or higher until the end of your turn.</p>`,
);

export const intimidatingGlare = feat(
  "feature/barbarian/berserker/intimidating-glare", "Intimidating Glare", 10,
  `<p>Beginning at 10th level, you can use your action to frighten someone with your menacing presence. When you do so, choose one creature that you can see within 60 feet of you. If the creature can see or hear you, it becomes frightened of you for 1 minute. At the end of each of its turns, it must succeed on a Wisdom saving throw (DC equal to 8 + your Proficiency Bonus + your Strength modifier) or continue being frightened of you. This effect ends if the creature ends its turn out of line of sight or more than 120 feet away from you.</p>
<p>If you use this feature on a creature that has been frightened by this feature within the last 24 hours, and is no longer frightened, it gets to make a Wisdom saving throw to resist the effect on a success, using the same DC.</p>`,
  {
    activation: { type: "action", cost: 1, condition: "" },
    range: { value: 60, long: null, units: "ft" },
    save: { ability: "wis", dc: null, scaling: "str" },
  },
);

export const retaliation = feat(
  "feature/barbarian/berserker/retaliation", "Retaliation", 14,
  `<p>Starting at 14th level, when you or an ally within 5 ft of you takes damage from a creature that is within your melee range, you can use your reaction to make an opportunity attack with a melee weapon you are wielding against that creature.</p>
<p>When the attack hits, you double your rage damage bonus for that attack.</p>`,
  { activation: { type: "reaction", cost: 1, condition: "You or ally within 5 ft takes damage" } },
);

export const features: FeatureItem[] = [
  fightingFrenzy, mindlessRage, recklessSeverity, intimidatingGlare, retaliation,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Path of the Berserker",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>For some barbarians, rage is a means to an end\u2014that end being violence. The path of the berserker is a path of untrammeled fury, slick with blood. As you enter the berserker's rage, you thrill in the chaos of battle, heedless of your own health or well-being.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "berserker",
    classIdentifier: "barbarian",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(fightingFrenzy) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(mindlessRage) }, { uuid: fUuid(recklessSeverity) }]),
      createItemGrant(SC_ID, 10, [{ uuid: fUuid(intimidatingGlare) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(retaliation) }]),
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
