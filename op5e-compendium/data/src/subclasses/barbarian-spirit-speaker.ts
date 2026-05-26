import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/barbarian/spirit-speaker";

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
      requirements: `Barbarian (Spirit Speaker) ${level}`,
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

export const archaicOracle = feat(
  "feature/barbarian/spirit-speaker/archaic-oracle", "Archaic Oracle", 3,
  `<p>When you choose this path, you establish a connection between yourself and the ancestral spirits of the past. When you enter your rage, you exude a 15 ft aura around yourself. Each creature within this aura, except yourself and any creatures of your choice, have their movement speed halved when they enter or start their turn inside the aura.</p>`,
);

export const guardianAvatar = feat(
  "feature/barbarian/spirit-speaker/guardian-avatar", "Guardian Avatar", 3,
  `<p>When you choose this path, at 3rd level, the spirits around you can provide protection to those you defend. If you are raging and if any creature you can see within 15 feet of you (including yourself) takes damage, you can use your reaction to reduce that damage by 2d8.</p>
<p>When you reach certain levels in this class, you can reduce the damage by more: by 3d8 at 6th level, 4d8 at 10th level, and by 5d8 at 14th level.</p>`,
  {
    activation: { type: "reaction", cost: 1, condition: "While raging, creature within 15 ft takes damage" },
    range: { value: 15, long: null, units: "ft" },
  },
);

export const expandingEpiphany = feat(
  "feature/barbarian/spirit-speaker/expanding-epiphany", "Expanding Epiphany", 6,
  `<p>Beginning at 6th level, you have grown a stronger connection to your spirits, the radius of your Archaic Oracle and Guardian Avatar are now 30 ft.</p>
<p>Additionally, you gain resistance to psychic damage and all creatures of your choice within a 30 ft radius of yourself (including yourself), while you are raging, have advantage on saving throws against being charmed or frightened.</p>`,
);

export const vengefulSpirits = feat(
  "feature/barbarian/spirit-speaker/vengeful-spirits", "Vengeful Spirits", 10,
  `<p>At 10th level, your spirits grow powerful enough to retaliate. When you use your Guardian Avatar feature to reduce the damage of an attack, the attacker takes an amount of psychic damage equal to the damage that your Guardian Avatar feature prevents.</p>`,
);

export const clairvoyantNexus = feat(
  "feature/barbarian/spirit-speaker/clairvoyant-nexus", "Clairvoyant Nexus", 14,
  `<p>At 14th level, your spirits grant you insight of the dangers ahead. While you are raging, you gain the benefits of the Foresight creation, ending when your rage ends.</p>`,
);

export const features: FeatureItem[] = [
  archaicOracle, guardianAvatar, expandingEpiphany, vengefulSpirits, clairvoyantNexus,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Path of the Spirit Speaker",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Barbarians that walk this path are of a rare variety. Rather than using their rage as a means to tear down their foes, they instead embody the spiritual forces of the underworld, connecting them back to the wisdom of the past. As they connect to the past, swarms of lost souls flock to these oracles, either to guide the world on the right path, or to find their way back to the underworld.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "spirit-speaker",
    classIdentifier: "barbarian",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(archaicOracle) }, { uuid: fUuid(guardianAvatar) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(expandingEpiphany) }]),
      createItemGrant(SC_ID, 10, [{ uuid: fUuid(vengefulSpirits) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(clairvoyantNexus) }]),
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
