import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/savant/caustic-spite";

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
      requirements: `Savant (Caustic Spite) ${level}`,
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

export const corrosiveSoul = feat(
  "feature/savant/caustic-spite/corrosive-soul", "Corrosive Soul", 1,
  `<p>Beginning when you unlock this ardent soul at 1st level, you gain resistance to acid damage. You also learn the Acid Bolt and Acid Spray tricks if you don't already know them.</p>`,
);

export const channelConvictionCaustic = feat(
  "feature/savant/caustic-spite/channel-conviction", "Channel Conviction: Caustic Spite", 3,
  `<p>At 3rd level, you gain the following two Channel Conviction options:</p>
<ul>
<li><strong>Manifest Soul.</strong> As a bonus action, you can manifest the element of your soul around a weapon. For 1 minute, your weapon attacks and creations deal an extra 1d8 acid damage.</li>
<li><strong>Spiteful Corrosion.</strong> When you deal acid damage to a creature, you can use Channel Conviction to create a sticky substance that lingers and corrodes their defenses. For 1 minute, the creature's armor class is reduced by -2. The creature can use an action to make a Strength check against your creation DC to scrape off the acid and end this effect.</li>
</ul>`,
  { uses: { value: null, max: "1", per: "sr", recovery: "", prompt: true } },
);

export const auraOfSpite = feat(
  "feature/savant/caustic-spite/aura-of-spite", "Aura of Spite", 7,
  `<p>Starting at 7th level, you and friendly creatures within 10 feet of you have advantage on opportunity attacks and can make opportunity attacks when a creature moves out of your reach even if the creature has taken the Disengage action, while you are conscious.</p>
<p>At 18th level, the range of this aura increases to 30 feet.</p>`,
);

export const corrosiveDefenses = feat(
  "feature/savant/caustic-spite/corrosive-defenses", "Corrosive Defenses", 15,
  `<p>Starting at 15th level, you are always coated in small amounts of acid. Whenever a creature hits you with a melee attack, it takes acid damage equal to your Charisma modifier.</p>`,
);

export const spitefulDestroyer = feat(
  "feature/savant/caustic-spite/spiteful-destroyer", "Spiteful Destroyer", 20,
  `<p>At 20th level, you can coat yourself in acid to become an avatar of destruction. As a bonus action, you gain the following benefits for 1 minute:</p>
<ul>
<li>You are immune to acid damage.</li>
<li>When you hit with a weapon attack, any non-imbued armor or shield the target is wearing suffers a permanent -1 reduction to its AC. The reduction is cumulative, and if the item's AC is reduced to 0, or by -5 or more, it is permanently destroyed.</li>
<li>The damage from your Corrosive Defenses is doubled for the duration and ignores resistance and immunity to acid damage.</li>
</ul>
<p>Once you use this bonus action, you can't use it again until you finish a long rest, unless you expend a 5th-level creation slot to use it again.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: true },
  },
);

export const features: FeatureItem[] = [
  corrosiveSoul, channelConvictionCaustic, auraOfSpite, corrosiveDefenses, spitefulDestroyer,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Caustic Spite",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Savants of prejudice, envy, or malice can manifest their soul as corrosive acid that eats away at their enemy's defenses. Despite their caustic nature, some develop a strong rapport with a few close friends nonetheless.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "caustic-spite",
    classIdentifier: "savant",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 1, [{ uuid: fUuid(corrosiveSoul) }]),
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(channelConvictionCaustic) }]),
      createItemGrant(SC_ID, 7, [{ uuid: fUuid(auraOfSpite) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(corrosiveDefenses) }]),
      createItemGrant(SC_ID, 20, [{ uuid: fUuid(spitefulDestroyer) }]),
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
