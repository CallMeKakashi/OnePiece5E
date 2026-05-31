import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, createScaleValue, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/bard/swords";

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
      requirements: `Bard (Swords) ${level}`,
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

export const swordsBonusProficiencies = feat(
  "feature/bard/swords/bonus-proficiencies", "Bonus Proficiencies", 3,
  `<p>When you join the College of Swords at 3rd level, you gain proficiency with medium armor, shields, and simple and martial weapons. You can use any weapon you are proficient in as a creation focus for your bard creations.</p>`,
);

export const swordsFightingStyle = feat(
  "feature/bard/swords/fighting-style", "Fighting Style", 3,
  `<p>At 3rd level, you adopt a particular style of fighting as your specialty. Choose one of the options in the College of Swords Bard Styles section. You can't take a Fighting Style option more than once, even if you later get to choose again.</p>
<p>Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can replace a fighting style you know with another fighting style available to College of Swords bards.</p>`,
);

export const ordnanceRequiem = feat(
  "feature/bard/swords/ordnance-requiem", "Ordnance Requiem", 3,
  `<p>When you join the College of Swords at 3rd level, your timing of your attacks is not only excellent, but also extremely deadly, resulting in a profound performance of steel.</p>
<p>When you hit a creature with a weapon attack, you can expend one use of your Bardic Inspiration to deal an additional 2d6 damage to that target, the same type as the weapon you are wielding. You can do so only once per round on your turn.</p>
<p>This extra damage increases when you reach certain levels in this class, increasing to 3d6 at 5th level, 5d6 at 10th level, and 8d6 at 15th level.</p>`,
);

export const cutTime = feat(
  "feature/bard/swords/cut-time", "Cut Time", 6,
  `<p>Starting at 6th level, as you continue executing the exact notes, you find the ability to fight to the beat twice as fast.</p>
<p>Your movement speed is increased by 10 ft, and you can attack twice, instead of once, whenever you take the Attack action on your turn.</p>
<p>If you ready your action to make an attack, you can attack the same number of times you would if you had taken the attack action on your turn.</p>`,
);

export const carvingInspiration = feat(
  "feature/bard/swords/carving-inspiration", "Carving Inspiration", 6,
  `<p>Also at 6th level, you can use your words in combat to out maneuver your opponents. When you use your bonus action to give a creature one of your Bardic Inspiration dice, you gain advantage on all your melee weapon attacks until the end of your turn.</p>`,
);

export const crescendosCadence = feat(
  "feature/bard/swords/crescendos-cadence", "Crescendo's Cadence", 14,
  `<p>Starting at 14th level, your critical consistency in your music allows you to perform often instead of only a few times a day.</p>
<p>When you use Ordnance Requiem, instead of expending a use of Bardic Inspiration, you can instead deal the damage, except the d6s are now d4s. For example at 15th level, the damage would be 8d4.</p>`,
);

export const features: FeatureItem[] = [
  swordsBonusProficiencies, swordsFightingStyle, ordnanceRequiem, cutTime, carvingInspiration, crescendosCadence,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "College of Swords",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Bards of the college of swords are often swashbucklers and masters of the blade and of song, able to not only assist their companions, but to stand their ground against the enemy. Practitioners become skilled swordsmen that can rival any fighter in a fight.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "swords",
    classIdentifier: "bard",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [
        { uuid: fUuid(swordsBonusProficiencies) },
        { uuid: fUuid(swordsFightingStyle) },
        { uuid: fUuid(ordnanceRequiem) },
      ]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(cutTime) }, { uuid: fUuid(carvingInspiration) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(crescendosCadence) }]),
      createScaleValue(SC_ID, "ordnance-requiem", "dice", {
        3: { number: 2, faces: 6 } as any,
        5: { number: 3, faces: 6 } as any,
        10: { number: 5, faces: 6 } as any,
        15: { number: 8, faces: 6 } as any,
      }),
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
