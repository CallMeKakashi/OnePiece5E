import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/barbarian/blade-master";

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
      requirements: `Barbarian (Blade Master) ${level}`,
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

export const fightingStyle = feat(
  "feature/barbarian/blade-master/fighting-style", "Fighting Style", 3,
  `<p>Starting when you choose this path at 3rd level, you learn how to properly wield your weapon of choice. Choose a fighting style from the Blademaster Barbarian Styles section. You can't take a Fighting Style option more than once, even if you later get to choose again.</p>
<p>Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can replace a fighting style you know with another fighting style available to Blademaster Barbarians.</p>`,
);

export const masterfulHew = feat(
  "feature/barbarian/blade-master/masterful-hew", "Masterful Hew", 3,
  `<p>Also at 3rd level, you learn special techniques that leverage your mastery of martial combat mixed with your primal strength. Once per turn when you hit with a weapon attack, you can perform a special attack called a hew, choosing from the list below.</p>
<p>At 10th level, each of the hew options improve as per their description.</p>
<ul>
<li><strong>Cleaving Hew.</strong> Each other creature within 5 feet of the target suffers damage equal to your Strength modifier. The damage is the same type as the weapon used. If you are raging, you add your rage damage bonus. At 10th level while raging, the range increases to 10 ft.</li>
<li><strong>Crushing Hew.</strong> You can make a grapple or shove attack as part of the same attack. If raging, you count as one size larger. At 10th level while raging, a successful grapple or shove deals your rage damage modifier.</li>
<li><strong>Savage Hew.</strong> Roll damage twice and choose the higher number. If raging, double your rage damage bonus. At 10th level while raging, add half your level (rounded down) to the damage roll.</li>
<li><strong>Sprinting Hew.</strong> Move up to half your speed before or after the attack. If raging, this movement doesn't provoke opportunity attacks. At 10th level while raging, move up to your full speed instead.</li>
</ul>`,
);

export const steelRending = feat(
  "feature/barbarian/blade-master/steel-rending", "Steel Rending", 6,
  `<p>At 6th level, your focused fury is honed like an edge, allowing you to pierce through any defenses.</p>
<p>While raging, your weapon attacks ignore any resistance to bludgeoning, piercing, or slashing damage, and your weapon attacks gain the Siege property, dealing double damage to structures and buildings.</p>`,
);

export const temperedRage = feat(
  "feature/barbarian/blade-master/tempered-rage", "Tempered Rage", 6,
  `<p>Beginning at 6th level, constant wrestling with your rage and fury has made you fully in control of your emotions. You gain proficiency in Wisdom saving throws. If you're already proficient, you gain proficiency in your choice of Intelligence or Charisma saving throws.</p>`,
);

export const proofOfMettle = feat(
  "feature/barbarian/blade-master/proof-of-mettle", "Proof of Mettle", 10,
  `<p>Beginning at 10th level, you can make a statement when you deal a killing blow to a creature. While raging, when you score a critical hit or reduce a creature to 0 hit points with a weapon attack, you can release a surge of fear around you. Each creature of your choice within 20 feet must make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Strength modifier) or be frightened of you for 1 minute or until it can no longer see you. A creature can repeat this saving throw at the end of its turn, ending the effect on itself on a successful save.</p>
<p>You can use this feature only once per rage.</p>`,
  {
    target: { value: 20, width: null, units: "ft", type: "radius" },
    save: { ability: "wis", dc: null, scaling: "str" },
    uses: { value: 1, max: "1", per: "charges", recovery: "", prompt: true },
  },
);

export const inexorableProwess = feat(
  "feature/barbarian/blade-master/inexorable-prowess", "Inexorable Prowess", 14,
  `<p>Beginning at 14th level, you never have disadvantage on weapon attacks against creatures you can see while you are raging.</p>`,
);

export const features: FeatureItem[] = [
  fightingStyle, masterfulHew, steelRending, temperedRage, proofOfMettle, inexorableProwess,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Path of the Blade Master",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>The rage of a blade master is not the mad screams of a berserker or the primal howls of a totem warrior, but a silent, merciless and deadly intent that suffuses their blades like an aura. Blade masters draw on their rage like other barbarians, but they wield it like another blade rather than give in to it, unleashing the full power of their fury without losing sight of their goal.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "blade-master",
    classIdentifier: "barbarian",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(fightingStyle) }, { uuid: fUuid(masterfulHew) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(steelRending) }, { uuid: fUuid(temperedRage) }]),
      createItemGrant(SC_ID, 10, [{ uuid: fUuid(proofOfMettle) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(inexorableProwess) }]),
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
