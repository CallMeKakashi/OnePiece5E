import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/gadgeteer/battle-smith";

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
      requirements: `Gadgeteer (Battle Smith) ${level}`,
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

export const battleSmithToolProficiency = feat(
  "feature/gadgeteer/battle-smith/tool-proficiency", "Tool Proficiencies", 3,
  `<p>When you adopt this specialization at 3rd level, you gain proficiency with smith's tools. If you already have this proficiency, you gain proficiency with one other type of artisan's tools of your choice.</p>`,
);

export const battleReady = feat(
  "feature/gadgeteer/battle-smith/battle-ready", "Battle Ready", 3,
  `<p>When you reach 3rd level, your combat training and your experiments with technology have paid off in two ways:</p>
<ul>
<li>You gain proficiency with martial weapons.</li>
<li>When you attack with a mastercraft weapon, you can use your Intelligence modifier, instead of Strength or Dexterity modifier, for the attack and damage rolls.</li>
</ul>`,
);

export const ironDefender = feat(
  "feature/gadgeteer/battle-smith/iron-defender", "Iron Defender", 3,
  `<p>By 3rd level, your tinkering has borne you a faithful companion, an Iron Defender. It is friendly to you and your companions, and it obeys your commands.</p>
<p>In combat, it shares your initiative count. It can move and use its reaction on its own, but the only action it takes on its turn is the Dodge action, unless you take a bonus action on your turn to command it to take another action. If you are incapacitated, the defender can take any action of its choice, not just Dodge.</p>
<p>If the Mending trick is used on it, it regains 2d6 hit points. If it has died within the last hour, you can use your smith's tools as an action to revive it, provided you are within 5 feet of it and you expend a creation slot of 1st level or higher. The steel defender returns to life after 1 minute with all its hit points restored.</p>
<p>At the end of a long rest, you can create a new iron defender if you have smith's tools with you. If you already have a defender from this feature, the first one immediately perishes.</p>`,
);

export const unitedFront = feat(
  "feature/gadgeteer/battle-smith/united-front", "United Front", 5,
  `<p>Starting at 5th level, you can attack twice, rather than once, whenever you take the Attack action on your turn.</p>
<p>If you ready your action to make an attack, you can attack the same number of times you would if you had taken the attack action on your turn.</p>
<p>In addition, whenever you are under the effects of a creation with a range of self, both yourself and your Iron Defender benefit from it.</p>`,
);

export const powerJolt = feat(
  "feature/gadgeteer/battle-smith/power-jolt", "Power Jolt", 9,
  `<p>At 9th level, you've learned new ways to channel energy to harm or heal. When either you hit a target with a mastercraft weapon attack or your iron defender hits a target, you can channel energy through the strike to create one of the following effects:</p>
<ul>
<li>The target takes an extra 2d6 force damage.</li>
<li>Choose one creature or object you can see within 30 feet of the target. Healing energy flows into the chosen recipient, restoring 2d6 hit points to it.</li>
</ul>
<p>You can use this energy a number of times equal to 1 + your Intelligence modifier (minimum of once), but you can do so no more than once on a turn. You regain all expended uses when you finish a long rest.</p>`,
  {
    uses: { value: null, max: "1 + @abilities.int.mod", per: "lr", recovery: "", prompt: true },
  },
);

export const improvedDefender = feat(
  "feature/gadgeteer/battle-smith/improved-defender", "Improved Defender", 15,
  `<p>At 15th level, your Power Jolt and Iron Defender become more powerful:</p>
<ul>
<li>The extra damage and the healing of your Power Jolt both increase to 4d6.</li>
<li>When your Iron Defender takes the attack action, it makes two attacks instead of one.</li>
<li>Your Iron Defender gains a +2 bonus to Armor Class.</li>
<li>Whenever your Iron Defender uses its Deflect Attack, the attacker takes force damage equal to 1d4 + your Intelligence modifier.</li>
</ul>`,
);

export const features: FeatureItem[] = [
  battleSmithToolProficiency, battleReady, ironDefender, unitedFront, powerJolt, improvedDefender,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Battle Smith",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>A combination of protector and medic, a Battle Smith is an expert at defending others and repairing both material and personnel. To aid in their work, Battle Smiths are accompanied by an iron defender, a protective companion of their own creation.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "battle-smith",
    classIdentifier: "gadgeteer",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(battleSmithToolProficiency) }, { uuid: fUuid(battleReady) }, { uuid: fUuid(ironDefender) }]),
      createItemGrant(SC_ID, 5, [{ uuid: fUuid(unitedFront) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(powerJolt) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(improvedDefender) }]),
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
