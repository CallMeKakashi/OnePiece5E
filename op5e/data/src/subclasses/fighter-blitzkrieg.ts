import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";

const SUB = "subclass/fighter/blitzkrieg";
const F = "feature/fighter/blitzkrieg";

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

const afterimage = feat(
  "afterimage", "Afterimage",
  `<p>Starting at 3rd level, you can move at blinding speeds to create an Afterimage as a bonus action in an unoccupied space you can see within 30 feet of yourself. This Afterimage is a blurred image of you that lasts until it is destroyed, until you dismiss it as a bonus action, until you make another Afterimage, or until you're incapacitated. Your Afterimage has the same AC as yourself, 1 hit point, and immunity to all conditions. If it has to make a saving throw, it uses your saving throw bonus for the roll. It is the same size as you, and it occupies its space.</p>
<p>On your turn, you can mentally command the Afterimage to move up to your movement speed in any direction (no action required). If your Afterimage is ever more than 30 feet from you at the end of your turn, it is destroyed.</p>
<p>Your Afterimage can do the following while its active:</p>
<ul>
<li>You can teleport, swapping places with your Afterimage at a cost of 15 feet of your movement, regardless of the distance between the two of you.</li>
<li>When you take the Attack action on your turn, any attack you make with that action can originate from your space or the Afterimage's space. You make this choice for each attack.</li>
<li>When a creature that you can see moves at least 5ft out of your Afterimage's range, you can use your reaction to make an opportunity attack against that creature.</li>
</ul>`,
  "Blitzkrieg 3",
);

const rapidAction = feat(
  "rapid-action", "Rapid Action",
  `<p>Also at 3rd level, you can utilize your Afterimage's speed to enhance your combative potential.</p>
<p>Whenever you take the Attack action, you can make one additional melee attack from the Afterimage's position. You can use this feature a number of times equal to 1 + your Constitution modifier (a minimum of once). You regain all expended uses when you finish a long rest.</p>
<p>In addition, you can make your Afterimage throw itself in front of an attack directed at another creature that you can see. Before the attack roll is made, you can use your reaction to teleport the Afterimage to an unoccupied space within 5 feet of the targeted creature. The attack roll that triggered the reaction is instead made against your Afterimage.</p>`,
  "Blitzkrieg 3",
);

const blinkOfAnEye = feat(
  "blink-of-an-eye", "Blink of an Eye",
  `<p>Beginning at 7th level, you strike in a blink of an eye. When you use the Attack action, you can teleport up to 10 feet before each attack to an unoccupied space you can see.</p>`,
  "Blitzkrieg 7",
);

const supersonic = feat(
  "supersonic", "Supersonic",
  `<p>At 10th level, your enhanced speed improves, causing you to move regardless of the obstacles. You gain the following benefits while your Afterimage is active:</p>
<ul>
<li>Your movement speed increases by 10 feet.</li>
<li>Your Afterimage can now be summoned 45 feet from you and is destroyed if it goes beyond 45 feet from you instead of 30 feet.</li>
<li>When you make a Dexterity saving throw, you can use your reaction to have your Afterimage take the brunt by destroying it. You take no damage from the effect on a successful save, or half as much on a failed save.</li>
</ul>`,
  "Blitzkrieg 10",
);

const flashpoint = feat(
  "flashpoint", "Flashpoint",
  `<p>Starting at 15th level, your unbelievable speed allows you to exist at more than just two places at once. When you summon your Afterimage, you can choose to summon two Afterimages instead of one, each co-existing. If you try to create a third one, one of the previous Afterimages is destroyed. Anything you can do from one Afterimage's position can be done from the others instead.</p>`,
  "Blitzkrieg 15",
);

const infinitesimalInstant = feat(
  "infinitesimal-instant", "Infinitesimal Instant",
  `<p>At 18th level, you have mastered your burst of enhanced movement as you find yourself breaking past your previous limits. You gain the following benefits:</p>
<ul>
<li>Your Afterimages gain a bonus to their hit points equal to your level.</li>
<li>Your Afterimage can now be summoned 60ft from you and is destroyed if it goes beyond 60ft from you instead of 45ft.</li>
<li>When you roll initiative and have no uses of your Rapid Action feature left, you regain two uses of that feature.</li>
</ul>`,
  "Blitzkrieg 18",
);

export const blitzkrieg: SubclassItem = {
  _id: generateId(SUB),
  name: "Blitzkrieg",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>Of all the foes one can face, none are quite as flighty and frustrating to face is the Blitzkrieg. The Blitzkrieg's main weapon is not a sword, gun, or any kind of physical object. The main weapon of these fighters are their extraordinary speed, enabling them to dash around the battlefield as they strike.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "blitzkrieg",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
      createItemGrant(SUB, 3, [
        { uuid: fUuid(`${F}/afterimage`) },
        { uuid: fUuid(`${F}/rapid-action`) },
      ]),
      createItemGrant(SUB, 7, [
        { uuid: fUuid(`${F}/blink-of-an-eye`) },
      ]),
      createItemGrant(SUB, 10, [
        { uuid: fUuid(`${F}/supersonic`) },
      ]),
      createItemGrant(SUB, 15, [
        { uuid: fUuid(`${F}/flashpoint`) },
      ]),
      createItemGrant(SUB, 18, [
        { uuid: fUuid(`${F}/infinitesimal-instant`) },
      ]),
    ),
    spellcasting: { progression: "none", ability: "" },
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

export const blitzkriegFeatures: FeatureItem[] = [
  afterimage,
  rapidAction,
  blinkOfAnEye,
  supersonic,
  flashpoint,
  infinitesimalInstant,
];
