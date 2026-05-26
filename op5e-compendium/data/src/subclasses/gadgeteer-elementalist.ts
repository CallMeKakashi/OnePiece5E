import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/gadgeteer/elementalist";

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
      requirements: `Gadgeteer (Elementalist) ${level}`,
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

export const gadgetWeapon = feat(
  "feature/gadgeteer/elementalist/gadget-weapon", "Gadget Weapon", 3,
  `<p>At 3rd level, you create a gadgeteer weapon that acts as a container for your creations. Over the course of 1 hour, you can use your tinker's tools to modify one simple or martial weapon into a specialist weapon. You are proficient in the use of your gadgeteer weapon, and it gains the following benefits:</p>
<ul>
<li>You can use your Intelligence score, rather than Strength or Dexterity, for the attack and damage rolls with the specialist weapon.</li>
<li>The specialist weapon counts as an apparatus for your gadgeteer creations.</li>
<li>The damage type becomes your choice of acid, cold, fire, lightning, poison, thunder, or the weapon's original damage. You can change the weapon's damage type when you finish a short or long rest.</li>
<li>If the weapon normally requires ammunition to be used, it now produces its own ammunition.</li>
<li>If the weapon has the thrown property, it returns to your hand after being thrown.</li>
</ul>
<p>You can only have one gadget weapon at any time. If you create a new gadget weapon, the old one immediately ceases to function and becomes a normal weapon again.</p>`,
);

export const creationRecovery = feat(
  "feature/gadgeteer/elementalist/creation-recovery", "Creation Recovery", 3,
  `<p>Beginning at level 3, you have learned to refuel your creations by tinkering with your apparatus. Once per long rest, when you finish a short rest, you can choose a number of expended Creation Slots to recover. The Creation Slots can have a combined level that is equal to or less than half your Gadgeteer level (rounded up).</p>`,
  { uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: true } },
);

export const battleGadgeteer = feat(
  "feature/gadgeteer/elementalist/battle-gadgeteer", "Battle Gadgeteer", 5,
  `<p>Beginning at 5th level, you can attack twice, instead of once, when you take the Attack action on your turn and attack with your specialist weapon. You can use a trick in place of one of these attacks.</p>
<p>If you ready your action to make an attack, you can attack the same number of times you would if you had taken the attack action on your turn.</p>
<p>In addition, you learn 1 additional trick from the Gadgeteer Creation list.</p>`,
);

export const elementalEmpowerment = feat(
  "feature/gadgeteer/elementalist/elemental-empowerment", "Elemental Empowerment", 9,
  `<p>Beginning at 9th level, you exert fine control over the potent elemental energy of your weapon. When you deal damage with your Gadget Weapon, you gain a 1d8 bonus to that damage roll.</p>
<p>In addition, when you activate an evocation creation that affects other creatures that you can see, you can choose a number of them equal to 1 + the creation's level. The chosen creatures automatically succeed on their saving throws against the creation, and they take no damage if they would normally take half damage on a successful save.</p>`,
);

export const upToEleven = feat(
  "feature/gadgeteer/elementalist/up-to-eleven", "Up To Eleven", 15,
  `<p>Starting at 15th level, you can increase the power of your elemental creations to devastating degrees while holding your Gadget Weapon. When you cast a Gadgeteer creation of 1st through 5th level that deals damage, you can deal maximum damage with that creation.</p>
<p>The first time you do so, you suffer no adverse effect. If you use this feature again before you finish a long rest, you take 2d12 necrotic damage for each level of the creation, immediately after you activate it. Each time you use this feature again before finishing a long rest, the necrotic damage per creation level increases by 1d12. This damage ignores resistance and immunity.</p>`,
);

export const features: FeatureItem[] = [
  gadgetWeapon, creationRecovery, battleGadgeteer, elementalEmpowerment, upToEleven,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Elementalist",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Elementalists are gadgeteers who stick to what they know, typically relying on a single modified weapon or tool for protection. This weapon is elemental in nature and can be quite potent. Their creations and techniques usually center around this special device.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "elementalist",
    classIdentifier: "gadgeteer",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(gadgetWeapon) }, { uuid: fUuid(creationRecovery) }]),
      createItemGrant(SC_ID, 5, [{ uuid: fUuid(battleGadgeteer) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(elementalEmpowerment) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(upToEleven) }]),
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
