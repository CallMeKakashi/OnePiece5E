import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";

const SUB = "subclass/fighter/gadget-knight";
const F = "feature/fighter/gadget-knight";

function fUuid(path: string): string {
  return compendiumUuid("class-features", generateId(path));
}

function feat(slug: string, name: string, desc: string, req: string): FeatureItem {
  return {
    _id: generateId(`${F}/${slug}`),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: req,
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
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null, duplicateSource: null, coreVersion: "13",
      systemId: "dnd5e", systemVersion: "5.1.10",
      createdTime: null, modifiedTime: null, lastModifiedBy: null,
    },
  };
}

const gadgeteerSpellcasting = feat(
  "gadgeteer-spellcasting", "Gadgeteer Spellcasting",
  `<p>When you reach 3rd level, you augment your martial prowess with the ability to cast spells using gadgets and mechanical inventions. Your spellcasting is Intelligence-based.</p>
<p><strong>Spell Slots.</strong> You gain spell slots as a half-caster (same as Ranger or Paladin). You regain all expended spell slots when you finish a long rest.</p>
<p><strong>Spells Known.</strong> You know two 1st-level spells of your choice from the gadgeteer spell list. You learn additional gadgeteer spells as you gain levels.</p>
<p><strong>Spellcasting Ability.</strong> Intelligence is your spellcasting ability for your gadgeteer spells. You use your Intelligence whenever a spell refers to your spellcasting ability.</p>
<p><strong>Spell save DC</strong> = 8 + your proficiency bonus + your Intelligence modifier</p>
<p><strong>Spell attack modifier</strong> = your proficiency bonus + your Intelligence modifier</p>`,
  "Gadget Knight 3",
);

const warMechanic = feat(
  "war-mechanic", "War Mechanic",
  `<p>At 3rd level, you learn to augment your weapons and armor with mechanical enhancements. During a long rest, you can augment one weapon or one suit of armor you are proficient with. You can have only one augmented item at a time; augmenting a new item ends the previous augmentation.</p>
<ul>
<li><strong>Weapon Augment.</strong> The weapon gains a +1 bonus to attack and damage rolls, and you can use your Intelligence modifier instead of Strength or Dexterity for attack and damage rolls with it.</li>
<li><strong>Armor Augment.</strong> The armor gains a +1 bonus to AC, and you can don or doff it as an action.</li>
</ul>`,
  "Gadget Knight 3",
);

const creativeCombatant = feat(
  "creative-combatant", "Creative Combatant",
  `<p>At 7th level, you can replace one of your attacks when you take the Attack action with a trick from your gadgeteer repertoire. You can use one of the following tricks:</p>
<ul>
<li><strong>Flash Bomb.</strong> Each creature in a 10-foot radius must succeed on a Constitution saving throw against your spell save DC or be blinded until the end of your next turn.</li>
<li><strong>Grapple Hook.</strong> You fire a grapple hook at a point you can see within 30 feet. You can pull yourself to that point, or pull a Large or smaller creature within range 15 feet toward you (Strength saving throw negates).</li>
<li><strong>Smoke Screen.</strong> You create a 15-foot cube of smoke centered on a point within 30 feet. The area is heavily obscured until the start of your next turn.</li>
</ul>
<p>You can use tricks a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a short or long rest.</p>`,
  "Gadget Knight 7",
);

const rechargingSurge = feat(
  "recharging-surge", "Recharging Surge",
  `<p>At 10th level, when you use your Action Surge feature, you can also recover one expended spell slot of 3rd level or lower.</p>`,
  "Gadget Knight 10",
);

const improvedCreativeCombatant = feat(
  "improved-creative-combatant", "Improved Creative Combatant",
  `<p>At 15th level, your tricks become more potent:</p>
<ul>
<li><strong>Improved Flash Bomb.</strong> The radius increases to 20 feet, and blinded creatures also take 3d6 radiant damage.</li>
<li><strong>Improved Grapple Hook.</strong> Range increases to 60 feet. Pulled creatures take 2d6 bludgeoning damage and are knocked prone.</li>
<li><strong>Improved Smoke Screen.</strong> The cube size increases to 30 feet, and allies in the smoke gain half cover.</li>
</ul>`,
  "Gadget Knight 15",
);

const masterOfWar = feat(
  "master-of-war", "Master of War",
  `<p>At 18th level, your augmented equipment reaches its final form. Your War Mechanic augmentation improvements increase:</p>
<ul>
<li><strong>Weapon Augment.</strong> The bonus increases to +2, and the weapon deals an additional 1d6 force damage on a hit.</li>
<li><strong>Armor Augment.</strong> The bonus increases to +2 AC, you gain resistance to one damage type of your choice (chosen during augmentation), and you can activate a shield generator as a reaction to gain +5 AC against one attack.</li>
</ul>
<p>Additionally, you can maintain two augmented items simultaneously instead of one.</p>`,
  "Gadget Knight 18",
);

export const gadgetKnight: SubclassItem = {
  _id: generateId(SUB),
  name: "Gadget Knight",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>The Gadget Knight blends martial mastery with mechanical ingenuity. These fighters tinker with gadgets and devices, augmenting their weapons and armor with mechanical enhancements and using clever tricks to gain the upper hand in combat.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "gadget-knight",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
      createItemGrant(SUB, 3, [
        { uuid: fUuid(`${F}/gadgeteer-spellcasting`) },
        { uuid: fUuid(`${F}/war-mechanic`) },
      ]),
      createItemGrant(SUB, 7, [
        { uuid: fUuid(`${F}/creative-combatant`) },
      ]),
      createItemGrant(SUB, 10, [
        { uuid: fUuid(`${F}/recharging-surge`) },
      ]),
      createItemGrant(SUB, 15, [
        { uuid: fUuid(`${F}/improved-creative-combatant`) },
      ]),
      createItemGrant(SUB, 18, [
        { uuid: fUuid(`${F}/master-of-war`) },
      ]),
    ),
    spellcasting: { progression: "half", ability: "int" },
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  _stats: {
    compendiumSource: null, duplicateSource: null, coreVersion: "13",
    systemId: "dnd5e", systemVersion: "5.1.10",
    createdTime: null, modifiedTime: null, lastModifiedBy: null,
  },
};

export const gadgetKnightFeatures: FeatureItem[] = [
  gadgeteerSpellcasting,
  warMechanic,
  creativeCombatant,
  rechargingSurge,
  improvedCreativeCombatant,
  masterOfWar,
];
