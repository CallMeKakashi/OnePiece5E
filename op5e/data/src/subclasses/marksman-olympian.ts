import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/marksman/olympian";

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
      requirements: `Marksman (Olympian) ${level}`,
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

export const olympianCreations = feat(
  "feature/marksman/olympian/olympian-creations", "Olympian Creations", 3,
  `<p>Starting at 3rd level, you gain the following bonus creations at specific marksman levels. They count as marksman creations for you, but don't count towards the number of marksman creations you can prepare.</p>
<ul>
<li><strong>3rd:</strong> Heroism, Jump</li>
<li><strong>5th:</strong> Enlarge/Reduce, Kinetic Jaunt</li>
<li><strong>9th:</strong> Haste, Thunder Step</li>
<li><strong>13th:</strong> Freedom of Movement, Stoneskin</li>
<li><strong>17th:</strong> Battle Transformation, Volley</li>
</ul>`,
);

export const herculeanStrength = feat(
  "feature/marksman/olympian/herculean-strength", "Herculean Strength", 3,
  `<p>At 3rd level, your physical prowess is not to be underestimated. You gain the following benefits:</p>
<ul>
<li>You gain proficiency in Strength (Athletics) checks, or expertise if you were already proficient.</li>
<li>Your movement speed increases by 10 feet.</li>
<li>Any simple or martial weapon you wield gains the thrown property (30/90). If it already had the thrown property, both ranges are increased by 30 feet.</li>
</ul>`,
);

export const freeThrow = feat(
  "feature/marksman/olympian/free-throw", "Free Throw", 3,
  `<p>Also at 3rd level, once per turn, when you hit a creature with a thrown weapon, it deals an extra 1d8 damage of the weapon damage type.</p>
<p>Additionally, if you attack a creature under the effects of your Favored Mark feature with a thrown weapon, you can choose to have the thrown weapon return to your hand.</p>`,
  {
    damage: { parts: [["1d8", ""]], versatile: "" },
  },
);

export const walkingSalvo = feat(
  "feature/marksman/olympian/walking-salvo", "Walking Salvo", 7,
  `<p>By 7th level, you can send projectile after projectile at your enemy as one single, deadly combination.</p>
<p>If you make two attacks against a target with a thrown weapon, you can choose to make an additional attack as a bonus action.</p>
<p>You can use this feature a number of times equal to your proficiency bonus, regaining all uses at the end of a short or long rest.</p>
<p>In addition, at 9th level, when you receive your Volley feature you may use it using a thrown weapon, after which it returns to your hand.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "Made two thrown weapon attacks against same target" },
    uses: { value: null, max: "@prof", per: "sr", recovery: "", prompt: true },
  },
);

export const masterfulTechnique = feat(
  "feature/marksman/olympian/masterful-technique", "Masterful Technique", 11,
  `<p>At 11th level, you become far more versatile with your throwing techniques. When you use your Volley ability, you can choose to shape it differently in one of the following ways:</p>
<ul>
<li>A 100 ft long, 5 ft wide line that originates from your space.</li>
<li>A 30 ft cone that originates from your space.</li>
<li>As per normal Volley, except with a radius increased by 10 ft.</li>
</ul>
<p>In addition, each creature you attack from your Volley ability benefits from your 1d8 damage from your Free Throw feature.</p>`,
);

export const unlimitedStrikes = feat(
  "feature/marksman/olympian/unlimited-strikes", "Unlimited Strikes", 15,
  `<p>Starting at 15th level, when you use your Walking Salvo feature, you can make two attacks as a bonus action against the target instead of one.</p>`,
);

export const features: FeatureItem[] = [
  olympianCreations, herculeanStrength, freeThrow, walkingSalvo, masterfulTechnique, unlimitedStrikes,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Olympian",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Olympians are champions among marksmen, utilizing more direct and physical power to strike their enemies, rather than nimble dexterity. These marksmen are characterized by their ferocity and physical superiority, able to throw literal volleys of attacks with their bare hands.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "olympian",
    classIdentifier: "marksman",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(olympianCreations) }, { uuid: fUuid(herculeanStrength) }, { uuid: fUuid(freeThrow) }]),
      createItemGrant(SC_ID, 7, [{ uuid: fUuid(walkingSalvo) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(masterfulTechnique) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(unlimitedStrikes) }]),
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
