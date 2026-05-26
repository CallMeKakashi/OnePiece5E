import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, createScaleValue, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/medic/plaguewright";

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
      requirements: `Medic (Plaguewright) ${level}`,
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

export const infectionRadius = feat(
  "feature/medic/plaguewright/infection-radius", "Infection Radius", 2,
  `<p>Starting at 2nd level, you are surrounded by an invisible cloud of necrotic pathogens that are harmless until you unleash them on a creature nearby. When a creature you can see moves into a space within 10 feet of you or starts its turn there, you can command your pathogens to deal necrotic damage to that creature unless it succeeds on a Constitution saving throw against your creation save DC.</p>
<p>The necrotic damage scales with level: 1d6 at 2nd, 1d8 at 6th, 1d10 at 10th, and 1d12 at 14th level.</p>`,
  {
    save: { ability: "con", dc: null, scaling: "wis" },
    range: { value: 10, long: null, units: "ft" },
  },
);

export const endemicSurge = feat(
  "feature/medic/plaguewright/endemic-surge", "Endemic Surge", 2,
  `<p>Also at 2nd level, you can cause your pathogens to replicate exponentially. As an action, you can expend a use of your Experimental Medicine feature to cause your pathogens to surge, rather than transform. While this feature is active, you gain the following benefits:</p>
<ul>
<li>You gain 5 temporary hit points for each level you have in this class.</li>
<li>You gain resistance to necrotic and poison damage.</li>
<li>When you deal your Infection Radius damage, roll the damage die a second time and add it to the total.</li>
<li>Your attacks and creations deal an extra 1d6 necrotic damage to any target they damage.</li>
</ul>
<p>This transformation follows the same rules as your standard Experimental Medicine transformations.</p>`,
  { activation: { type: "action", cost: 1, condition: "" } },
);

export const zeroPatients = feat(
  "feature/medic/plaguewright/zero-patients", "Zero Patients", 6,
  `<p>At 6th level, your pathogens gain the ability to infest a corpse and cause it to rise under your control. When you use the Animate Dead creation to create an undead, any creature raised has additional benefits:</p>
<ul>
<li>The creature's hit point maximum is increased by an amount equal to your medic level.</li>
<li>The creature adds your proficiency bonus to its weapon attack and damage rolls.</li>
</ul>
<p>Additionally, when you use the Animate Dead creation, you can have an additional Animated Undead active.</p>`,
);

export const pandemicAmplification = feat(
  "feature/medic/plaguewright/pandemic-amplification", "Pandemic Amplification", 10,
  `<p>Beginning at 10th level, the range of your Infection Radius increases to a 30ft radius. Additionally, if you see any attempt to recover hit points in this radius, you can choose to reduce the number healed by a number equal to your Wisdom modifier.</p>`,
);

export const viralImmunity = feat(
  "feature/medic/plaguewright/viral-immunity", "Viral Immunity", 14,
  `<p>Beginning at 14th level, you and your pathogens have developed a symbiotic relationship, rendering you resistant against most outside forces. You can't be blinded, deafened, paralyzed, or poisoned.</p>
<p>Additionally, when you use the Animate Dead creation, you can have two additional Animated Undead active.</p>`,
);

export const features: FeatureItem[] = [
  infectionRadius, endemicSurge, zeroPatients, pandemicAmplification, viralImmunity,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Plaguewright",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Medics that follow this path see diseases and the dying not as disasters, but as tools for their own purposes. "As above, so below." No truer words could describe the existence of plaguewrights.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "plaguewright",
    classIdentifier: "medic",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 2, [{ uuid: fUuid(infectionRadius) }, { uuid: fUuid(endemicSurge) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(zeroPatients) }]),
      createItemGrant(SC_ID, 10, [{ uuid: fUuid(pandemicAmplification) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(viralImmunity) }]),
      createScaleValue(SC_ID, "infection-radius-die", "dice", {
        2: { number: 1, faces: 6 } as any,
        6: { number: 1, faces: 8 } as any,
        10: { number: 1, faces: 10 } as any,
        14: { number: 1, faces: 12 } as any,
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
