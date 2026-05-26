import { generateId } from "../../helpers/id.js";
import type { FeatureItem } from "../../schemas/feature.js";

function classFeature(
  idPath: string,
  name: string,
  level: number,
  description: string,
  extra: Partial<FeatureItem["system"]> = {},
  effects: FeatureItem["effects"] = [],
): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: `Gadgeteer ${level}`,
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
    effects,
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null,
      duplicateSource: null,
      coreVersion: "13",
      systemId: "dnd5e",
      systemVersion: "5.1.10",
      createdTime: null,
      modifiedTime: null,
      lastModifiedBy: null,
    },
  } as unknown as FeatureItem;
}

export const tinkering = classFeature(
  "feature/gadgeteer/tinkering",
  "Tinkering",
  1,
  `<p>At 1st level, you've learned how to modify mundane objects. To use this ability, you must have thieves' tools or artisan's tools in hand. You then touch a Tiny object as an action and give it one of the following properties of your choice:</p>
<ul>
<li>The object sheds bright light in a 5-foot radius and dim light for an additional 5 feet.</li>
<li>Whenever tapped by a creature, the object emits a recorded message that can be heard up to 10 feet away. You utter the message when you bestow this property on the object.</li>
<li>The object continuously emits your choice of an odor or a nonverbal sound (wind, waves, chirping, or the like). The chosen phenomenon is perceivable up to 10 feet away.</li>
<li>A static visual effect appears on one of the object's surfaces. This effect can be a picture, text, lines, shapes, or a mixture of these elements, as you like.</li>
</ul>
<p>The chosen property lasts indefinitely. As an action, you can touch the object and end the property early.</p>
<p>You can use this feature on multiple objects, touching one object each time you use this feature, though a single object can only bear one property at a time. The maximum number of objects you can affect with this feature at one time is equal to your Intelligence modifier (minimum of one). If you try to exceed your maximum, the oldest property immediately ends, and then the new property applies.</p>`,
  { activation: { type: "action", cost: 1, condition: "" } },
);

export const mastercraftNovice = classFeature(
  "feature/gadgeteer/mastercraft-novice",
  "Mastercraft Novice",
  1,
  `<p>At 1st level, you gain the ability to improve your crafting abilities. Whenever you craft a mastercraft item, it takes you half of the normal time, and it costs you half as much of the usual berries.</p>`,
);

export const mods = classFeature(
  "feature/gadgeteer/mods",
  "Mods",
  2,
  `<p>At 2nd level, you've gained the ability to imbue mundane items with certain mechanical mods, turning those objects into mastercraft items.</p>
<p><strong>Mods Known.</strong> When you gain this feature, pick four gadgeteer mods to learn. You learn additional mods of your choice when you reach certain levels in this class, as shown in the Mods Known column of the Gadgeteer table.</p>
<p><strong>Modifying an Item.</strong> Whenever you finish a long rest, you can touch an object and improve it with one of your mods, turning it into a mastercraft item. A mod works on only certain kinds of objects, as specified in the mod's description. Your mod remains in an item indefinitely, but when you die, the mod vanishes after a number of days equal to your Intelligence modifier (minimum of 1 day). The mod also vanishes if you replace your knowledge of the mod.</p>
<p>You can modify more than one object at the end of a long rest; the maximum number of objects appears in the Mods Active column of the Gadgeteer table. You must touch each of the objects. Moreover, no object can bear more than one of your mods at a time.</p>`,
);

export const theRightTool = classFeature(
  "feature/gadgeteer/the-right-tool",
  "The Right Tool",
  3,
  `<p>At 3rd level, you've learned how to produce the tool you need: with thieves' tools or artisan's tools in hand, you can create one set of non-mastercraft artisan's tools in your hands. This requires 1 hour of uninterrupted work, which can coincide with a short or long rest. The tools vanish when you use this feature again.</p>`,
);

export const toolExpertise = classFeature(
  "feature/gadgeteer/tool-expertise",
  "Tool Expertise",
  6,
  `<p>At 6th level, you gain expertise with all tools you are proficient in.</p>`,
);

export const flashOfGenius = classFeature(
  "feature/gadgeteer/flash-of-genius",
  "Flash of Genius",
  7,
  `<p>At 7th level, you've gained the ability to come up with solutions under pressure. When you or another creature you can see within 30 feet of you makes an ability check or a saving throw, you can use your reaction to add your Intelligence modifier to the roll.</p>
<p>You can use this feature a number of times equal to 1 + your Intelligence modifier (minimum of once). You regain all expended uses when you finish a long rest.</p>`,
  {
    activation: { type: "reaction", cost: 1, condition: "Creature within 30 ft makes ability check or saving throw" },
    range: { value: 30, long: null, units: "ft" },
    uses: { value: null, max: "1 + @abilities.int.mod", per: "lr", recovery: "", prompt: true },
  },
);

export const mastercraftAdept = classFeature(
  "feature/gadgeteer/mastercraft-adept",
  "Mastercraft Adept",
  10,
  `<p>When you reach 10th level, you achieve a profound understanding of how to use and make mastercraft items:</p>
<ul>
<li>You can have two mods on a single item at the same time, instead of one.</li>
<li>If you craft a mastercraft item, it takes you a quarter of the normal time, and it costs you a quarter as much of the usual gold.</li>
</ul>`,
);

export const creationStorage = classFeature(
  "feature/gadgeteer/creation-storage",
  "Creation Storage",
  11,
  `<p>At 11th level, you can now store a creation in an object. Whenever you finish a long rest, you can touch one simple or martial weapon or one item that you can use as a creation focus, and you store a creation in it, choosing a creation from the gadgeteer creation list that requires 1 action to cast (you needn't have it prepared) and be of a level equal to half your proficiency bonus (rounded up).</p>
<p>While holding the object, a creature can take an action to produce the creation's effect from it, using your creation ability modifier. If the creation requires concentration, the creature must concentrate.</p>
<p>The creation stays in the object until it's been used a number of times equal to twice your Intelligence modifier (minimum of twice) or until you use this feature again to store a creation in an object.</p>`,
  {
    uses: { value: null, max: "@abilities.int.mod * 2", per: "lr", recovery: "", prompt: true },
  },
);

export const highTechDevelopment = classFeature(
  "feature/gadgeteer/high-tech-development",
  "High-Tech Development",
  11,
  `<p>At 11th level, your engineering prowess and creative works have granted you access to powerful creations. Choose one creation of 6th level or lower from the Gadgeteer creation list. You can use this creation once without expending a creation slot. You must finish a long rest before you can do so again.</p>
<p>At higher levels, you gain more Gadgeteer creations of your choice that can be activated in this way: one creation of 7th-level or lower at 13th level, one creation 8th-level or lower at 15th level, and one creation of 9th-level or lower at 17th level. You regain all uses of your High-Tech Development when you finish a long rest. You can change out one of these creations with another of the same level when you finish a long rest.</p>`,
  {
    uses: { value: null, max: "1", per: "lr", recovery: "", prompt: true },
  },
);

export const mastercraftSavant = classFeature(
  "feature/gadgeteer/mastercraft-savant",
  "Mastercraft Savant",
  14,
  `<p>At 14th level, your skill with mastercraft items deepens more.</p>
<p>As a bonus action, you can end a mod early to gain temporary hit points equal to your Gadgeteer Level.</p>
<p>In addition, you ignore all class, race, creation, and level requirements for using a mastercraft item.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
  },
);

export const mastercraftMaster = classFeature(
  "feature/gadgeteer/mastercraft-master",
  "Mastercraft Master",
  18,
  `<p>Starting at 18th level, you can add or remove requirements of mastercraft items.</p>
<p>Additionally, you can recycle other mastercraft items, gaining berries equal to half the cost of their rating.</p>`,
);

export const soulOfArtifice = classFeature(
  "feature/gadgeteer/soul-of-artifice",
  "Soul of Artifice",
  20,
  `<p>At 20th level, you develop a connection to your mastercraft items, which you can draw on for protection:</p>
<ul>
<li>You gain a +1 bonus to all saving throws per active mod you have.</li>
<li>If you're reduced to 0 hit points but not killed outright, you can use your reaction to end one of your mods, causing you to drop to 1 hit point instead of 0.</li>
</ul>`,
  {
    activation: { type: "reaction", cost: 1, condition: "Reduced to 0 HP" },
  },
);

export const gadgeteerClassFeatures: FeatureItem[] = [
  tinkering,
  mastercraftNovice,
  mods,
  theRightTool,
  toolExpertise,
  flashOfGenius,
  mastercraftAdept,
  creationStorage,
  highTechDevelopment,
  mastercraftSavant,
  mastercraftMaster,
  soulOfArtifice,
];
