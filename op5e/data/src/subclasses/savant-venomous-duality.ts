import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/savant/venomous-duality";

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
      requirements: `Savant (Venomous Duality) ${level}`,
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

export const miasmicSoul = feat(
  "feature/savant/venomous-duality/miasmic-soul", "Miasmic Soul", 1,
  `<p>Beginning when you unlock this ardent soul at 1st level, you gain immunity to the poisoned condition and resistance to poison damage. Additionally, you learn the Venom Bolt and Poisonous Puff tricks if you don't already know them.</p>`,
);

export const channelConvictionVenomous = feat(
  "feature/savant/venomous-duality/channel-conviction", "Channel Conviction: Venomous Duality", 3,
  `<p>At 3rd level, you gain the following two Channel Conviction options:</p>
<ul>
<li><strong>Manifest Soul.</strong> As a bonus action, you can manifest the element of your soul around a weapon. For 1 minute, your weapon attacks and creations force the target to make a Constitution saving throw. On a failure, the target is poisoned for 1 minute. Creatures can repeat the save at the end of each of their turns, ending the effect on a success.</li>
<li><strong>Antivenom.</strong> As an action, you can touch a willing creature and absorb any poison or disease inflicting them from their body. Alternatively, you can inhale any airborne poison in a 20-foot sphere centered on you. The creature or air is cleared of any poison, and you gain temporary hit points equal to twice your level plus your Charisma modifier.</li>
</ul>`,
  { uses: { value: null, max: "1", per: "sr", recovery: "", prompt: true } },
);

export const toxicAura = feat(
  "feature/savant/venomous-duality/toxic-aura", "Toxic Aura", 7,
  `<p>Starting at 7th level, an invisible, poisonous aura extends 10 feet out from you when you are not incapacitated, but not through full cover. At the start of your turn, creatures of your choice within this aura take poison damage equal to your Charisma modifier (minimum of one).</p>
<p>At 18th level, the range of this aura increases to 30 feet.</p>`,
);

export const transmutatingAnodyne = feat(
  "feature/savant/venomous-duality/transmutating-anodyne", "Transmutating Anodyne", 15,
  `<p>Beginning at 15th level, you can control the potency of your poisons, turning lethal toxins into soothing medicine. As a bonus action on your turn, you invert the poison of your Toxic Aura. Creatures of your choice within the aura gain temporary hit points equal to 2d10 + your Charisma modifier (minimum of one). You then lose the benefits of your Toxic Aura until it reforms at the end of your next turn.</p>
<p>You can use this feature a number of times equal to 1 + your Charisma modifier (minimum of once) and regain all uses when you finish a long rest.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    uses: { value: null, max: "1 + @abilities.cha.mod", per: "lr", recovery: "", prompt: true },
  },
);

export const cloakOfMiasma = feat(
  "feature/savant/venomous-duality/cloak-of-miasma", "Cloak of Miasma", 20,
  `<p>At 20th level, you can summon a cloud of potent poison to surround you. As a bonus action, you gain the following benefits for 1 minute:</p>
<ul>
<li>You and friendly creatures within your Toxic Aura gain immunity to poison damage and the poisoned condition.</li>
<li>When a creature moves into or starts its turn within your Toxic Aura, it must immediately succeed on a Constitution saving throw or become poisoned until it leaves the aura.</li>
<li>You don't lose access to your Toxic Aura after using Transmutating Anodyne.</li>
</ul>
<p>Once you use this bonus action, you can't use it again until you finish a long rest, unless you expend a 5th-level creation slot to use it again.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: true },
  },
);

export const features: FeatureItem[] = [
  miasmicSoul, channelConvictionVenomous, toxicAura, transmutatingAnodyne, cloakOfMiasma,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Venomous Duality",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Savants who are uncertain of their path, or doubtful of themselves, manifest their soul with the duality of medicine and poison. The difference between a life-saving remedy and a lethal dose of poison rests on a razor's edge.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "venomous-duality",
    classIdentifier: "savant",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 1, [{ uuid: fUuid(miasmicSoul) }]),
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(channelConvictionVenomous) }]),
      createItemGrant(SC_ID, 7, [{ uuid: fUuid(toxicAura) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(transmutatingAnodyne) }]),
      createItemGrant(SC_ID, 20, [{ uuid: fUuid(cloakOfMiasma) }]),
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
