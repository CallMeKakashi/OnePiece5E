import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/rogue/gadget-trickster";

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
      requirements: `Rogue (Gadget Trickster) ${level}`,
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

export const gadgetSpellcasting = feat(
  "feature/rogue/gadget-trickster/spellcasting", "Gadget Spellcasting", 3,
  `<h4>Creativity (Spellcasting)</h4><p>At 3rd level, you augment your martial prowess with the ability to use creations. You have a notebook containing creations that show the first glimmerings of your true potential. See the gadgeteer creation list under "Gadgeteer Creations by Level". (Creativity is synonymous with 5th edition Spellcasting. See "Casting a Spell" in the Player's Handbook for the general rules of Spellcasting in Dungeons and Dragons 5th edition).</p><table><thead><tr><th>Player Level</th><th>Tricks Known</th><th>1st</th><th>2nd</th><th>3rd</th><th>4th</th><th>5th</th></tr></thead><tbody><tr><td>3rd</td><td>Mirrored Hand + 2</td><td>3</td><td>—</td><td>—</td><td>—</td><td>—</td></tr><tr><td>4th</td><td>Mirrored Hand + 2</td><td>3</td><td>—</td><td>—</td><td>—</td><td>—</td></tr><tr><td>5th</td><td>Mirrored Hand + 2</td><td>4</td><td>2</td><td>—</td><td>—</td><td>—</td></tr><tr><td>6th</td><td>Mirrored Hand + 2</td><td>4</td><td>2</td><td>—</td><td>—</td><td>—</td></tr><tr><td>7th</td><td>Mirrored Hand + 2</td><td>4</td><td>3</td><td>—</td><td>—</td><td>—</td></tr><tr><td>8th</td><td>Mirrored Hand + 2</td><td>4</td><td>3</td><td>—</td><td>—</td><td>—</td></tr><tr><td>9th</td><td>Mirrored Hand + 2</td><td>4</td><td>3</td><td>2</td><td>—</td><td>—</td></tr><tr><td>10th</td><td>Mirrored Hand + 3</td><td>4</td><td>3</td><td>2</td><td>—</td><td>—</td></tr><tr><td>11th</td><td>Mirrored Hand + 3</td><td>4</td><td>3</td><td>3</td><td>—</td><td>—</td></tr><tr><td>12th</td><td>Mirrored Hand + 3</td><td>4</td><td>3</td><td>3</td><td>—</td><td>—</td></tr><tr><td>13th</td><td>Mirrored Hand + 3</td><td>4</td><td>3</td><td>3</td><td>1</td><td>—</td></tr><tr><td>14th</td><td>Mirrored Hand + 4</td><td>4</td><td>3</td><td>3</td><td>1</td><td>—</td></tr><tr><td>15th</td><td>Mirrored Hand + 4</td><td>4</td><td>3</td><td>3</td><td>2</td><td>—</td></tr><tr><td>16th</td><td>Mirrored Hand + 4</td><td>4</td><td>3</td><td>3</td><td>2</td><td>—</td></tr><tr><td>17th</td><td>Mirrored Hand + 4</td><td>4</td><td>3</td><td>3</td><td>3</td><td>1</td></tr><tr><td>18th</td><td>Mirrored Hand + 4</td><td>4</td><td>3</td><td>3</td><td>3</td><td>1</td></tr><tr><td>19th</td><td>Mirrored Hand + 4</td><td>4</td><td>3</td><td>3</td><td>3</td><td>2</td></tr><tr><td>20th</td><td>Mirrored Hand + 4</td><td>4</td><td>3</td><td>3</td><td>3</td><td>2</td></tr></tbody></table><h4>Tricks (Cantrips)</h4><p>You know three tricks, one of which is Mirrored Hand and the other two are of your choice from the gadgeteer creations list.</p><p>You learn additional gadgeteer tricks of your choice at higher levels, as shown in the Tricks Known column of the Gadget Trickster table.</p><p>At the end of a long rest, you can change one of the tricks you know for another from your creation list.</p><h4>Preparing and Using Creations</h4><p>The Gadget Trickster table shows how many creation slots you have to use your gadgeteer creations of 1st Level and higher. You regain all expended creation slots when you finish a long rest.</p><p>You prepare the list of gadgeteer creations that are available for you to cast. To do so, choose a number of gadgeteer creations from your notebook equal to your Intelligence modifier + half your Gadget Trickster level rounded down (minimum of one creation). The creations must be of a level for which you have creation slots.</p><p>For example, if you are a 5th-level Gadget Trickster, you have four 1st-level and two 2nd-level creation slots. With an Intelligence of 14, your list of prepared creations can include four creations of 1st or 2nd level, in any combination. If you prepare the 1st-level creation Cure Wounds, you can cast it using a 1st-level or a 2nd-level slot. Casting the creation doesn't remove it from your list of prepared creations.</p><p>You can change your list of prepared creations when you finish a long rest. Preparing a new list of gadgeteer creations requires time spent tinkering with your creation casting focuses: at least 1 minute per creation level for each creation on your list.</p><h4>Creative Ability</h4><p>Intelligence is your creative ability for your gadgeteer creations, as you learn through careful study and observation, trial and error. You use your Intelligence whenever a creation refers to your creative ability. In addition, you use your Intelligence modifier when setting the saving throw DC for the gadgeteer creations you cast and when making an attack roll with one.</p><p>Creation save DC = 8 + your proficiency bonus + your Intelligence modifier</p><p>Creation Attack modifier = your proficiency bonus + your Intelligence modifier</p>`,
);

export const gadgetLegerdemain = feat(
  "feature/rogue/gadget-trickster/gadget-legerdemain", "Gadget Legerdemain", 3,
  `<p>Starting at 3rd level, when you use Mirrored Hand, you can make the hand invisible, and you can perform the following additional tasks with it:</p><ul><li>You can stow one object the hand is holding in a container worn or carried by another creature.</li><li>You can retrieve an object in a container worn or carried by another creature.</li><li>You can use thieves' tools to pick locks and disarm traps at range.</li></ul><p>You can perform one of these tasks without being noticed by a creature if you succeed on a Dexterity (Sleight of Hand) check contested by the creature's Wisdom (Perception) check.</p><p>In addition, you can use the bonus action granted by your Cunning Action to control the hand.</p>`,
);

export const stupefyingCreation = feat(
  "feature/rogue/gadget-trickster/stupefying-creation", "Stupefying Creation", 3,
  `<p>Also at 3rd level, whenever you successfully hit a creature with a creation that uses an attack roll and deals damage, you can add your sneak attack to that one damage roll of that creation. All other requirements for sneak attack still apply.</p>`,
);

export const craftyOne = feat(
  "feature/rogue/gadget-trickster/crafty-one", "Crafty One", 6,
  `<p>Starting at 6th level, you can discretely use your creations in unique ways. The following effects are added to your Devious Strike options.</p><p><strong>Epiphany (Cost: 2d6).</strong> After making this Devious Strike, you can use a Gadgeteer trick you know as a bonus action.</p><p><strong>Subterfuge (Cost: 2d6).</strong> When you use a creation for this Devious Strike, you activate it without any somatic or verbal components.</p>`,
);

export const creativeAmbush = feat(
  "feature/rogue/gadget-trickster/creative-ambush", "Creative Ambush", 9,
  `<p>Starting at 9th level, if you are hidden from a creature when you use a creation or trick on it, the creature has disadvantage on any saving throw it makes against the creation this turn.</p>`,
);

export const versatileTrickster = feat(
  "feature/rogue/gadget-trickster/versatile-trickster", "Versatile Trickster", 13,
  `<p>Starting at 13th level, you gain the ability to distract targets with your Mage Hand. As a bonus action on your turn, you can designate a creature within 5 feet of the hand created by the trick. Doing so gives you advantage on attack rolls against that creature until the end of the turn.</p>`,
  { activation: { type: "bonus", cost: 1, condition: "" } },
);

export const techniqueThief = feat(
  "feature/rogue/gadget-trickster/technique-thief", "Technique Thief", 17,
  `<p>Starting at 17th level, you learn to replicate any technique, creation, or ability you have taken note of through observation.</p><p>As a bonus action, you make an Intelligence (Investigation) check against a creature you can see that isn't incapacitated, contested by the target's Charisma (Deception) check.</p><p>If you succeed, you can learn one of the abilities they use on their turn (Doesn't count for Haki or Devil Fruit Abilities). If you fail, you cannot use this feature on that creature until you finish a long rest.</p><p>For example, features like Multiattack, Creations like Fire Bolt or Shield, or certain attack options based in features such as the Tempest Kick ability from the Six Powers Brawler.</p><p>You can learn a total of 3 different techniques. Each technique learned that requires the use of ability scores uses the necessary modifier(s) from your ability scores. When you attempt to learn a new technique, you must either disregard it, or forget a previous technique.</p>`,
  { activation: { type: "bonus", cost: 1, condition: "" } },
);

export const features: FeatureItem[] = [
  gadgetSpellcasting, gadgetLegerdemain, stupefyingCreation, craftyOne, creativeAmbush, versatileTrickster, techniqueThief,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Gadget Trickster",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Gadget Trickster's are rogues who enhance their fine-honed skills of stealth and agility with tricks and creativity, learning tricks of illusion. These rogues include pickpockets and burglars, but also pranksters, mischief-makers, and a significant number of adventurers.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "gadget-trickster",
    classIdentifier: "rogue",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(gadgetSpellcasting) }, { uuid: fUuid(gadgetLegerdemain) }, { uuid: fUuid(stupefyingCreation) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(craftyOne) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(creativeAmbush) }]),
      createItemGrant(SC_ID, 13, [{ uuid: fUuid(versatileTrickster) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(techniqueThief) }]),
    ) as any,
    spellcasting: { progression: "half", ability: "int" },
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as SubclassItem;
