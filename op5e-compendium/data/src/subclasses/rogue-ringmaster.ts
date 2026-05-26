import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/rogue/ringmaster";

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
      requirements: `Rogue (Ringmaster) ${level}`,
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

export const grandShowman = feat(
  "feature/rogue/ringmaster/grand-showman", "Grand Showman", 3,
  `<p>When you choose this archetype at 3rd level, you gain proficiency in Performance if you don't already have it, and your proficiency bonus is doubled for any check you make with it. You also learn 2 tricks from the Bard spell list (cantrips).</p>`,
);

export const openingAct = feat(
  "feature/rogue/ringmaster/opening-act", "Opening Act", 3,
  `<p>At 3rd level, when you deal Sneak Attack damage to a creature, you can forgo your Sneak Attack damage to instead grant one ally within 30 feet of you the ability to deal your Sneak Attack damage on their next attack against that creature before the start of your next turn.</p>`,
);

export const circusTricks = feat(
  "feature/rogue/ringmaster/circus-tricks", "Circus Tricks", 6,
  `<p>At 6th level, you gain the following additional Devious Strike options:</p><ul><li><strong>Spotlight (Cost: 1d6).</strong> One ally within 30 feet gains advantage on their next attack roll against the target.</li><li><strong>Misdirection (Cost: 2d6).</strong> You redirect an attack targeting you to a creature within 5 feet of you (other than the attacker).</li></ul>`,
);

export const masterDirector = feat(
  "feature/rogue/ringmaster/master-director", "Master Director", 9,
  `<p>At 9th level, when you take the Help action, you can help two allies instead of one. Additionally, when a creature you can see within 30 feet is targeted by an attack, you can use your reaction to allow that ally to use their reaction to move up to half their speed or make one weapon attack.</p>`,
  { activation: { type: "reaction", cost: 1, condition: "Ally within 30ft is targeted" } },
);

export const denouement = feat(
  "feature/rogue/ringmaster/denouement", "Denouement", 13,
  `<p>Starting at 13th level, when you reduce a creature to 0 hit points or score a critical hit, you can choose one of the following effects for allies within 30 feet of you (your choice):</p><ul><li>Each ally gains temporary hit points equal to your Rogue level.</li><li>Each ally deals extra damage equal to your proficiency bonus on their next attack.</li><li>Each ally can immediately move up to 10 feet without provoking opportunity attacks.</li></ul>`,
);

export const seriousSpectacle = feat(
  "feature/rogue/ringmaster/serious-spectacle", "Serious Spectacle", 17,
  `<p>At 17th level, when you use Opening Act, you can grant your Sneak Attack damage to two allies instead of one. Each ally can apply the Sneak Attack damage once on their next attack before the start of your next turn.</p>`,
);

export const features: FeatureItem[] = [
  grandShowman, openingAct, circusTricks, masterDirector, denouement, seriousSpectacle,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Ringmaster",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>The Ringmaster is a flamboyant performer who directs the battlefield like a grand show, empowering allies and demoralizing enemies with theatrical precision.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "ringmaster",
    classIdentifier: "rogue",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(grandShowman) }, { uuid: fUuid(openingAct) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(circusTricks) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(masterDirector) }]),
      createItemGrant(SC_ID, 13, [{ uuid: fUuid(denouement) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(seriousSpectacle) }]),
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
