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
  `<p>Starting at 3rd level, you can move so fast you leave behind an afterimage of yourself. As a bonus action, you can create an afterimage in your space. The afterimage is a translucent copy of you that lasts until the start of your next turn, until you dismiss it (no action required), or until you create a new one.</p>
<p>While your afterimage exists, you gain the following benefits:</p>
<ul>
<li>When you take the Attack action, you can make one of your attacks originate from the afterimage's space instead of your own.</li>
<li>As part of your movement, you can swap positions with your afterimage, teleporting to its location while it appears in yours. This doesn't provoke opportunity attacks.</li>
<li>When a creature targets you with an attack, you can use your reaction to swap with your afterimage. The attack targets the afterimage instead and automatically destroys it.</li>
</ul>
<p>You can create afterimages a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a short or long rest.</p>`,
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
  `<p>Also at 15th level, you can now maintain two afterimages simultaneously instead of one. When you create a new afterimage, you can place it in any unoccupied space within 30 feet of you. You can swap with either afterimage as part of your movement or reaction.</p>`,
  "Blitzkrieg 15",
);

const infinitesimalInstant = feat(
  "infinitesimal-instant", "Infinitesimal Instant",
  `<p>At 18th level, you can compress your actions into a single imperceptible instant. Once per long rest, as an action, you can take three additional turns in a row. During these turns, time appears to stop for all other creatures — you can move and take actions as normal, but you cannot affect other creatures or objects that are being worn or carried by them. Spells and effects that are already active continue but don't progress.</p>
<p>When the effect ends, everything you did during those turns happens simultaneously from the perspective of other creatures. Any attacks you positioned resolve at that moment, and affected creatures make saving throws as appropriate.</p>`,
  "Blitzkrieg 18",
);

export const blitzkrieg: SubclassItem = {
  _id: generateId(SUB),
  name: "Blitzkrieg",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>The Blitzkrieg is a fighter who has honed their speed to supernatural levels. Through intense training, these fighters can create afterimages, teleport short distances, and eventually move so fast that time itself seems to stop around them.</p>",
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
