import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/gadgeteer/artillerist";

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
      requirements: `Gadgeteer (Artillerist) ${level}`,
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

export const artilleristToolProficiency = feat(
  "feature/gadgeteer/artillerist/tool-proficiency", "Tool Proficiencies", 3,
  `<p>When you adopt this specialization at 3rd level, you gain proficiency with woodcarver's tools. If you already have this proficiency, you gain proficiency with one other type of artisan's tools of your choice.</p>`,
);

export const mechanicalCannon = feat(
  "feature/gadgeteer/artillerist/mechanical-cannon", "Mechanical Cannon", 3,
  `<p>Also at 3rd level, you've learned how to create a mechanical cannon. Using woodcarver's tools or smith's tools, you can take an action to create a Small or Tiny mechanical cannon in an unoccupied space on a horizontal surface within 5 feet of you. Once you create a cannon, you can't do so again until you finish a long rest or until you expend a creation slot to create one. You can have only one cannon at a time.</p>
<p>The cannon has an AC of 18 and a number of hit points equal to five times your gadgeteer level. It is immune to poison damage and psychic damage. On each of your turns, you can take a bonus action to cause the cannon to activate if you are within 60 feet of it. As part of the same bonus action, you can direct the cannon to walk or climb up to 15 feet to an unoccupied space.</p>
<ul>
<li><strong>Elemental Culverin.</strong> The cannon exhales energy in an adjacent 15-foot cone. Each creature in that area must make a Dexterity saving throw against your creation save DC, taking 3d8 damage of your choice (fire, cold, lightning, acid, thunder, or poison) on a failed save or half on a success.</li>
<li><strong>Force Ballista.</strong> Make a ranged creation attack, originating from the cannon, at one creature or object within 120 feet. On a hit, the target takes 3d8 force damage and is pushed up to 5 feet away.</li>
<li><strong>Protector.</strong> The cannon emits a burst of energy that grants itself and each creature of your choice within 20 feet of it temporary hit points equal to 1d8 + your Intelligence modifier.</li>
</ul>`,
  { activation: { type: "action", cost: 1, condition: "" } },
);

export const mechanicalFirearm = feat(
  "feature/gadgeteer/artillerist/mechanical-firearm", "Mechanical Firearm", 5,
  `<p>At 5th level, you know how to turn a mundane object into a Mechanical Firearm, a conduit for your destructive creations. When you finish a long rest, you can use your tools to turn it into your Mechanical Firearm. This lasts indefinitely, until you make another one.</p>
<p>You can use your Mechanical Firearm as a creation focus for your gadgeteer creations. When you cast a gadgeteer creation through the firearm, roll a d8, and you gain a bonus to one of the creation's damage rolls equal to the number rolled.</p>`,
);

export const explosiveCannon = feat(
  "feature/gadgeteer/artillerist/explosive-cannon", "Explosive Cannon", 9,
  `<p>Starting at 9th level, every Mechanical Cannon you create is more destructive:</p>
<ul>
<li>The cannon's damage and temporary hit point rolls all increase by 1d8.</li>
<li>As an action, you can command the cannon to detonate if you are within 60 feet of it. Doing so destroys the cannon and forces each creature within 20 feet of it to make a Dexterity saving throw against your creation save DC, taking 3d8 force damage on a failed save or half as much on a success.</li>
</ul>`,
);

export const fortifiedPosition = feat(
  "feature/gadgeteer/artillerist/fortified-position", "Fortified Position", 15,
  `<p>By 15th level, you're a master at forming well-defended emplacements using your Mechanical Cannon:</p>
<ul>
<li>You and your allies gain a +2 bonus to their AC and Dex Saves while within 10 feet of the cannon you create with Mechanical Cannon.</li>
<li>You can now have two cannons at the same time. You can create two with the same action (but not the same creation slot), and you can activate both of them with the same bonus action. You determine whether the cannons are identical to each other or different. You can't create a third cannon while you have two.</li>
</ul>`,
);

export const features: FeatureItem[] = [
  artilleristToolProficiency, mechanicalCannon, mechanicalFirearm, explosiveCannon, fortifiedPosition,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Artillerist",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>An Artillerist specializes in using their gadgets and creations to hurl energy, projectiles, and explosions on a battlefield. This destructive power is valued by armies in the wars on many islands.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "artillerist",
    classIdentifier: "gadgeteer",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(artilleristToolProficiency) }, { uuid: fUuid(mechanicalCannon) }]),
      createItemGrant(SC_ID, 5, [{ uuid: fUuid(mechanicalFirearm) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(explosiveCannon) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(fortifiedPosition) }]),
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
