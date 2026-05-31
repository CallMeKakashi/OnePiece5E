import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/rogue/gadget-trickster";

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
      requirements: `Rogue (Gadget Trickster) ${level}`,
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

export const gadgetSpellcasting = feat(
  "feature/rogue/gadget-trickster/spellcasting", "Gadget Spellcasting", 3,
  `<p>When you reach 3rd level, you augment your martial prowess with the ability to cast spells using gadgets and inventions. You use Intelligence as your spellcasting ability. You learn spells from the Gadgeteer spell list and follow half-caster progression.</p>`,
);

export const gadgetLegerdemain = feat(
  "feature/rogue/gadget-trickster/gadget-legerdemain", "Gadget Legerdemain", 3,
  `<p>Starting at 3rd level, when you cast <em>mage hand</em>, you can make the spectral hand invisible, and you can perform the following additional tasks with it: stow or retrieve an object in a container worn by another creature, use thieves' tools to pick locks or disarm traps at range, or use your Cunning Action to control the hand.</p>`,
);

export const stupefyingCreation = feat(
  "feature/rogue/gadget-trickster/stupefying-creation", "Stupefying Creation", 6,
  `<p>At 6th level, when you make a spell attack, you can apply your Sneak Attack damage if you have advantage on the attack roll or if another enemy of the target is within 5 feet of it.</p>`,
);

export const craftyOne = feat(
  "feature/rogue/gadget-trickster/crafty-one", "Crafty One", 6,
  `<p>At 6th level, you gain the following additional Devious Strike options:</p><ul><li><strong>Flash (Cost: 2d6).</strong> The target must succeed on a Constitution saving throw or be blinded until the end of your next turn.</li><li><strong>Tangle (Cost: 2d6).</strong> The target must succeed on a Dexterity saving throw or have its speed reduced to 0 until the end of your next turn.</li></ul>`,
);

export const creativeAmbush = feat(
  "feature/rogue/gadget-trickster/creative-ambush", "Creative Ambush", 9,
  `<p>Starting at 9th level, if you are hidden from a creature when you cast a spell on it, the creature has disadvantage on any saving throw it makes against the spell on that turn.</p>`,
);

export const versatileTrickster = feat(
  "feature/rogue/gadget-trickster/versatile-trickster", "Versatile Trickster", 13,
  `<p>At 13th level, you gain the ability to distract targets with your <em>mage hand</em>. As a bonus action on your turn, you can designate a creature within 5 feet of the spectral hand. You have advantage on attack rolls against that creature until the end of the turn.</p>`,
  { activation: { type: "bonus", cost: 1, condition: "" } },
);

export const techniqueThief = feat(
  "feature/rogue/gadget-trickster/technique-thief", "Technique Thief", 17,
  `<p>At 17th level, you gain the ability to magically steal the knowledge of how to cast a spell from another spellcaster. Immediately after a creature casts a spell that targets you or includes you in its area of effect, you can use your reaction to force the creature to make a saving throw with its spellcasting ability modifier against your spell save DC. On a failed save, you negate the spell's effect against you, and you steal the knowledge of the spell if it is at least 1st level and of a level you can cast. For the next 8 hours, you know the spell and can cast it using your spell slots.</p>`,
  { activation: { type: "reaction", cost: 1, condition: "A creature casts a spell targeting you" } },
);

export const features: FeatureItem[] = [
  gadgetSpellcasting, gadgetLegerdemain, stupefyingCreation, craftyOne, creativeAmbush, versatileTrickster, techniqueThief,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Gadget Trickster",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>The Gadget Trickster enhances their roguish abilities with gadgets, inventions, and magical contraptions, functioning as a half-caster with Intelligence as their spellcasting ability.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "gadget-trickster",
    classIdentifier: "rogue",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(gadgetSpellcasting) }, { uuid: fUuid(gadgetLegerdemain) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(stupefyingCreation) }, { uuid: fUuid(craftyOne) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(creativeAmbush) }]),
      createItemGrant(SC_ID, 13, [{ uuid: fUuid(versatileTrickster) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(techniqueThief) }]),
    ) as any,
    spellcasting: { progression: "half", ability: "int" },
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as SubclassItem;
