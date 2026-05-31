import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/marksman/beastmaster";

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
      requirements: `Marksman (Beastmaster) ${level}`,
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

export const beastmasterCreations = feat(
  "feature/marksman/beastmaster/beastmaster-creations", "Beastmaster Creations", 3,
  `<p>Starting at 3rd level, you gain the following bonus creations at specific marksman levels. They count as marksman creations for you, but don't count towards the number of marksman creations you can prepare.</p>
<ul>
<li><strong>3rd:</strong> Animal Friend, Purify Food and Drink (R)</li>
<li><strong>5th:</strong> Call Beast, Spider Walk</li>
<li><strong>9th:</strong> Bestial Transformation, Blooming Jam</li>
<li><strong>13th:</strong> Dominate Beast, Hideout</li>
<li><strong>17th:</strong> Awaken, Sense Territory (R)</li>
</ul>`,
);

export const bestialCompanion = feat(
  "feature/marksman/beastmaster/bestial-companion", "Bestial Companion", 3,
  `<p>When you choose this archetype at 3rd level, you get access to an animal companion that will follow you on your adventures.</p>
<p>Choose either the Beast of the Air, Beast of the Earth, or Beast of the Sea to be your companion. In combat, the beast acts during your turn. It can move and use its reaction on its own, but the only action it takes is the Dodge action, unless you take a bonus action on your turn to command it to take another action. You can also sacrifice one of your attacks when you take the Attack action to command the beast to take the Attack action.</p>
<p>If your bestial companion is reduced to 0 hit points, it falls unconscious and makes death saving throws as normal. As an action, you can touch an unconscious or dead bestial companion and expend one creation slot of 1st level or higher to restore it.</p>`,
);

export const naturalAttunement = feat(
  "feature/marksman/beastmaster/natural-attunement", "Natural Attunement", 3,
  `<p>Also at 3rd level, you gain proficiency in the Animal Handling skill if you don't already have it and may double your proficiency bonus for any ability check made with the skill.</p>
<p>Additionally, you can speak and communicate with beasts and understand anything they are saying. This doesn't make them any friendlier towards you than normal, however, you can combine this ability with food to curry favor with animals.</p>`,
);

export const exceptionalTraining = feat(
  "feature/marksman/beastmaster/exceptional-training", "Exceptional Training", 7,
  `<p>Beginning at 7th level, you've trained your companion well. Your bestial companion can take the Dash, Disengage or Hide action as a bonus action on its turn. In addition, if you know any Haki abilities, your bestial companion gains those abilities as well.</p>`,
);

export const bestialFury = feat(
  "feature/marksman/beastmaster/bestial-fury", "Bestial Fury", 11,
  `<p>At 11th level, your bestial companion grows more adept at combat. Your bestial companion can now make two attacks, instead of one, when you command it to take the Attack action.</p>`,
);

export const enrage = feat(
  "feature/marksman/beastmaster/enrage", "Enrage", 15,
  `<p>At 15th level, you and your bestial companion become enraged with primal fury at the sight of injury to each other.</p>
<p>When your bestial companion is reduced to 0 hit points, you gain the following benefits for 1 minute (if you are reduced to 0 hit points, your bestial companion gains these benefits instead):</p>
<ul>
<li>You gain resistance to bludgeoning, piercing, and slashing damage.</li>
<li>You gain immunity to the charmed, frightened, and paralyzed conditions, and your movement speed cannot be reduced.</li>
<li>When you take the Attack action, you can make one additional weapon attack.</li>
</ul>
<p>You and your bestial companion can gain these benefits once each, and regain the ability to gain them after you finish a long rest.</p>`,
  {
    uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: true },
    duration: { value: 1, units: "minute" },
  },
);

export const features: FeatureItem[] = [
  beastmasterCreations, bestialCompanion, naturalAttunement, exceptionalTraining, bestialFury, enrage,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Beastmaster",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Beastmasters are wardens of nature and skilled survivalists. They have an innate ability to communicate with animals and are always accompanied by a bestial companion that fights alongside them as an extension of the beastmaster's own body.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "beastmaster",
    classIdentifier: "marksman",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(beastmasterCreations) }, { uuid: fUuid(bestialCompanion) }, { uuid: fUuid(naturalAttunement) }]),
      createItemGrant(SC_ID, 7, [{ uuid: fUuid(exceptionalTraining) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(bestialFury) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(enrage) }]),
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
