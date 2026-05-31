import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/medic/amputator";

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
      requirements: `Medic (Amputator) ${level}`,
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

export const incisionInitiator = feat(
  "feature/medic/amputator/incision-initiator", "Incision Initiator", 2,
  `<p>Beginning at 2nd level, you gain proficiency in all martial weapons. You can use any weapon you are proficient with as an apparatus for your medic creations.</p>
<p>Additionally, when you attack with a weapon that you are proficient with, you can use your Wisdom modifier, instead of Strength or Dexterity, for the attack and damage rolls.</p>`,
);

export const surgicalPrecision = feat(
  "feature/medic/amputator/surgical-precision", "Surgical Precision", 2,
  `<p>Also at 2nd level, you can leverage your medical expertise to unveil a creature's weak spot to you and your allies. As an action on your turn, you can expend a use of Experimental Medicine to target one creature you can see within 30 feet and expose it until the end of your next turn. The next time you or an ally of yours hits the exposed creature with an attack, the creature has vulnerability to all of that attack's damage, and is then no longer exposed.</p>`,
  {
    activation: { type: "action", cost: 1, condition: "" },
    range: { value: 30, long: null, units: "ft" },
    target: { value: 1, width: null, units: "", type: "creature" },
  },
);

export const invasiveLaceration = feat(
  "feature/medic/amputator/invasive-laceration", "Invasive Laceration", 6,
  `<p>Beginning at 6th level, you can attack twice, instead of once, when you take the Attack action on your turn.</p>
<p>If you ready your action to make an attack, you can attack the same number of times you would if you had taken the attack action on your turn.</p>
<p>In addition, when you take the Attack action, you can use your Surgical Precision feature in place of one of your attacks.</p>`,
);

export const anatomicalStudy = feat(
  "feature/medic/amputator/anatomical-study", "Anatomical Study", 10,
  `<p>Beginning at 10th level, you can study a creature's anatomy from afar in order to determine how to best heal or harm it. As a bonus action on your turn, you can target one creature you can see within 60 feet and study it briefly, gaining one of the following bonuses until the start of your next turn:</p>
<ul>
<li>The next time you deal damage to the creature, you deal additional damage to it equal to your medic level.</li>
<li>The next time you restore hit points to the creature with a creation of 1st level or higher, it regains an additional amount of hit points equal to your medic level.</li>
<li>The next time the creature hits you with an attack, you can reduce the damage taken by an amount equal to your medic level.</li>
</ul>
<p>You can use this feature a number of times equal to your proficiency bonus and regain all uses when you finish a long rest.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    range: { value: 60, long: null, units: "ft" },
    uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
  },
);

export const doctorDeath = feat(
  "feature/medic/amputator/doctor-death", "Doctor Death", 14,
  `<p>Beginning at 14th level, constant interaction with the dying has given you a strangely intimate relationship with death. You gain immunity to the frightened condition, and can leverage your morbid connection to unnerve other creatures.</p>
<p>Once per turn when you target a creature with Surgical Precision or Anatomical Study, you can force it to make a Wisdom saving throw against your creation save DC. On a failed save, the creature becomes frightened of you until the end of your next turn.</p>`,
  {
    save: { ability: "wis", dc: null, scaling: "wis" },
  },
);

export const features: FeatureItem[] = [
  incisionInitiator, surgicalPrecision, invasiveLaceration, anatomicalStudy, doctorDeath,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Amputator",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Good doctors are hard to come by, and let alone good medicine. Often times at sea, when the going gets tough, losing a limb to avoid infection is the best option. These medics utilize their intricate knowledge of anatomy and surgical precision to cut their foes to ribbons.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "amputator",
    classIdentifier: "medic",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 2, [{ uuid: fUuid(incisionInitiator) }, { uuid: fUuid(surgicalPrecision) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(invasiveLaceration) }]),
      createItemGrant(SC_ID, 10, [{ uuid: fUuid(anatomicalStudy) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(doctorDeath) }]),
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
