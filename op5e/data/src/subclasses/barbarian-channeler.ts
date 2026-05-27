import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/barbarian/channeler";

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
      requirements: `Barbarian (Channeler) ${level}`,
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

export const channelDestruction = feat(
  "feature/barbarian/channeler/channel-destruction", "Channel Destruction", 3,
  `<p>When you choose this path, your attacks gain the siege property, dealing double damage to objects and structures. Additionally, you learn either the Natural Arts or Show Off trick (your choice). Wisdom is your creative ability for this trick.</p>`,
);

export const giganticMight = feat(
  "feature/barbarian/channeler/gigantic-might", "Gigantic Might", 3,
  `<p>At 3rd level, you learn how to channel your inner might to grow both in size and power to become a force of destruction. While raging, you gain the following benefits:</p>
<ul>
<li>Your reach increases by 5 feet, and if you are smaller than Large, you become Large, along with anything you are wearing. If there isn't enough room for you to increase your size, your size doesn't change.</li>
<li>Your melee weapon attacks and thrown weapon attacks deal an additional 1d4 thunder damage.</li>
<li>When you score a critical hit with a weapon attack, you unleash a powerful shockwave on impact. All creatures of your choice within 5 ft of the target take thunder damage equal to your level.</li>
</ul>`,
);

export const moveMountains = feat(
  "feature/barbarian/channeler/move-mountains", "Move Mountains", 6,
  `<p>At 6th level, your titanic might now allows you to hurl both allies and enemies on the battlefield.</p>
<p>As a bonus action while raging, you can choose one Medium or smaller creature within your reach and move it to an unoccupied space you can see within a range of 10 \u00d7 your proficiency bonus feet of yourself. An unwilling creature must succeed on a Strength saving throw (DC equals 8 + your proficiency bonus + your Strength modifier) to avoid the effect.</p>
<p>If at the end of this movement, the thrown creature isn't on a surface or liquid that can support it, the creature falls, taking damage as normal and landing prone.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "While raging" },
    save: { ability: "str", dc: null, scaling: "str" },
  },
);

export const titanMonger = feat(
  "feature/barbarian/channeler/titan-monger", "Titan Monger", 10,
  `<p>At 10th level, your strikes can tear any foe asunder. The shockwave from your Gigantic Might feature now damages creatures of your choice within 10 ft, and halves their movement speed until the end of their next turn.</p>
<p>In addition, you can now use your Move Mountains to move creatures that are Large or smaller.</p>`,
);

export const colossalChanneler = feat(
  "feature/barbarian/channeler/colossal-channeler", "Colossal Channeler", 14,
  `<p>When you reach 14th level, you shatter your limits once more. You gain the following benefits while raging:</p>
<ul>
<li>Your reach increases by 10 feet, your size can increase to Large or Huge (your choice).</li>
<li>Your melee weapon attacks and thrown weapon attacks deal an additional 2d4 thunder damage instead of 1d4.</li>
<li>Your weapon attacks gain a damage spread of 5 ft, the DC being calculated as 8 + your Strength modifier + your proficiency bonus. If the attack was a critical hit, the damage spread increases to 15 ft.</li>
</ul>`,
);

export const features: FeatureItem[] = [
  channelDestruction, giganticMight, moveMountains, titanMonger, colossalChanneler,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Path of the Channeler",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Barbarians that tread the Path of the Channeler draw from within themselves the inner strength that lies with all of mankind, the power to destroy one's limits and defy kings, your very strikes causing shockwaves across the battlefield.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "channeler",
    classIdentifier: "barbarian",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(channelDestruction) }, { uuid: fUuid(giganticMight) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(moveMountains) }]),
      createItemGrant(SC_ID, 10, [{ uuid: fUuid(titanMonger) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(colossalChanneler) }]),
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
