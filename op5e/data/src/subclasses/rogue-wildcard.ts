import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/rogue/wildcard";

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
      requirements: `Rogue (Wildcard) ${level}`,
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

export const masterDealer = feat(
  "feature/rogue/wildcard/master-dealer", "Master Dealer", 3,
  `<p>When you choose this archetype at 3rd level, you gain proficiency with all gaming sets. Additionally, you can use improvised weapons as if they were finesse thrown weapons (range 20/60). Their damage die starts at 1d6 and scales: 1d8 at 5th level, 1d10 at 11th level, and 1d12 at 17th level.</p>`,
);

export const riskyGambit = feat(
  "feature/rogue/wildcard/risky-gambit", "Risky Gambit", 3,
  `<p>Starting at 3rd level, as a bonus action you can roll on the Risky Gambit table (d100) to gain a random benefit or suffer a random penalty. The effect lasts until the end of your next turn. You can use this feature a number of times equal to your proficiency bonus per long rest.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
  },
);

export const willyNilly = feat(
  "feature/rogue/wildcard/willy-nilly", "Willy-Nilly", 6,
  `<p>At 6th level, you gain the following additional Devious Strike options:</p><ul><li><strong>Wild Card (Cost: 2d6).</strong> Roll a d6. On 1–2, the target is frightened until end of your next turn. On 3–4, the target is charmed by you until end of your next turn. On 5–6, the target takes an additional 2d6 force damage.</li><li><strong>Loaded Dice (Cost: 1d6).</strong> The next ability check you make before the end of your next turn is made with advantage.</li></ul>`,
);

export const pokerface = feat(
  "feature/rogue/wildcard/pokerface", "Pokerface", 9,
  `<p>At 9th level, you have advantage on Charisma (Deception) and Dexterity (Sleight of Hand) checks. Additionally, you are immune to the charmed condition while conscious.</p>`,
);

export const doubleDown = feat(
  "feature/rogue/wildcard/double-down", "Double Down", 13,
  `<p>Starting at 13th level, when you use Risky Gambit, you can roll twice on the table and choose which result to apply. Additionally, negative results from the table are halved in duration or effect.</p>`,
);

export const fatesDesign = feat(
  "feature/rogue/wildcard/fates-design", "Fate's Design", 17,
  `<p>At 17th level, your Evasion feature applies to all saving throws, not just Dexterity saving throws. When you succeed on any saving throw that would deal damage on a success, you take no damage, and on a failure you take only half.</p>`,
);

export const features: FeatureItem[] = [
  masterDealer, riskyGambit, willyNilly, pokerface, doubleDown, fatesDesign,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Wildcard",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>The Wildcard is a gambler and risk-taker who thrives on chaos and unpredictability. Their unorthodox fighting style keeps enemies off-balance while fortune favors the bold.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "wildcard",
    classIdentifier: "rogue",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(masterDealer) }, { uuid: fUuid(riskyGambit) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(willyNilly) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(pokerface) }]),
      createItemGrant(SC_ID, 13, [{ uuid: fUuid(doubleDown) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(fatesDesign) }]),
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
