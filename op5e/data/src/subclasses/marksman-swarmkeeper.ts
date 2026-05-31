import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/marksman/swarmkeeper";

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
      requirements: `Marksman (Swarmkeeper) ${level}`,
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

export const swarmkeeperCreations = feat(
  "feature/marksman/swarmkeeper/swarmkeeper-creations", "Swarmkeeper Creations", 3,
  `<p>Starting at 3rd level, you gain the following bonus creations at specific marksman levels. They count as marksman creations for you.</p>
<ul>
<li><strong>3rd:</strong> Mirrored Hand, Fairy Lights, Sleep</li>
<li><strong>5th:</strong> Gather Swarm, Web</li>
<li><strong>9th:</strong> Fly, Hypnosis</li>
<li><strong>13th:</strong> Confusion, Kill Radius</li>
<li><strong>17th:</strong> Insect Plague, Life Steal</li>
</ul>`,
);

export const swarmingCluster = feat(
  "feature/marksman/swarmkeeper/swarming-cluster", "Swarming Cluster", 3,
  `<p>At 3rd level, a swarm of tiny beasts has bonded itself to you and can assist you in battle. Until you die, the swarm remains in your space. You determine its appearance.</p>
<p>Once on each of your turns, you can cause the swarm to assist you in one of the following ways, immediately after you hit a creature with an attack:</p>
<ul>
<li>The attack's target takes 1d6 piercing damage from the swarm.</li>
<li>The attack's target must succeed on a Strength saving throw against your creation save DC or be moved by the swarm up to 15 feet in a direction of your choice.</li>
<li>You are moved by the swarm 5 feet in a direction of your choice.</li>
</ul>`,
  {
    save: { ability: "str", dc: null, scaling: "wis" },
    damage: { parts: [["1d6", "piercing"]], versatile: "" },
  },
);

export const swarmingTides = feat(
  "feature/marksman/swarmkeeper/swarming-tides", "Swarming Tides", 7,
  `<p>By 7th level, you and your swarm are perfectly coordinated. You gain the following benefits:</p>
<ul>
<li>When you take damage, you can use your reaction to give yourself resistance to that damage. You vanish into your swarm and then teleport to an unoccupied space that you can see within 30 feet of you. You can use this a number of times equal to your proficiency bonus per short or long rest.</li>
<li>You learn the Giant's Hand creation (in swarm form). You can use it without expending a creation slot a number of times equal to 1 + your Wisdom modifier, regaining all uses at the end of a long rest.</li>
</ul>`,
  {
    activation: { type: "reaction", cost: 1, condition: "Taking damage" },
    uses: { value: null, max: "@prof", per: "sr", recovery: "", prompt: true },
  },
);

export const overwhelmingCluster = feat(
  "feature/marksman/swarmkeeper/overwhelming-cluster", "Overwhelming Cluster", 11,
  `<p>At 11th level, your Swarming Cluster grows stronger in the following ways:</p>
<ul>
<li>The damage of Swarming Cluster increases to 2d6.</li>
<li>If a creature fails its saving throw against being moved by the Swarming Cluster, it can be moved up to 20 ft, and you can also cause the swarm to knock the creature prone.</li>
<li>When you are moved by Swarming Cluster, you can move up to 10 ft, and it gives you half cover until the start of your next turn.</li>
</ul>`,
);

export const reliableHive = feat(
  "feature/marksman/swarmkeeper/reliable-hive", "Reliable Hive", 15,
  `<p>Starting at 15th level, your hive has perfected the ability to work together in tandem with you as their master.</p>
<p>You learn the Telekinesis creation; however, instead of magical force, your swarm is the thing lifting things. This creation does not count towards the maximum number of creations you know.</p>
<p>You can use the Telekinesis creation at will, but only when targeting objects that aren't being worn or carried.</p>`,
);

export const features: FeatureItem[] = [
  swarmkeeperCreations, swarmingCluster, swarmingTides, overwhelmingCluster, reliableHive,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Swarmkeeper",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>While some marksmen stick to one animal companion, others have employed more numerous options. Swarmkeepers are masters of their craft, able to lead the hive-mind like swarm of tiny creatures to heed their commands.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "swarmkeeper",
    classIdentifier: "marksman",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(swarmkeeperCreations) }, { uuid: fUuid(swarmingCluster) }]),
      createItemGrant(SC_ID, 7, [{ uuid: fUuid(swarmingTides) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(overwhelmingCluster) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(reliableHive) }]),
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
