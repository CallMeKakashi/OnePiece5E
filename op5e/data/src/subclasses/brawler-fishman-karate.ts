import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/brawler/fishman-karate";

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
      requirements: `Brawler (Fishman Karate) ${level}`,
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

export const aquaticBrawler = feat(
  "feature/brawler/fishman-karate/aquatic-brawler", "Aquatic Brawler", 3,
  `<p>Starting at 3rd level, you gain a swimming speed equal to your walking speed. If you already have a swimming speed, it is increased by 10 ft. Additionally, you can hold your breath for up to 1 hour.</p>`,
);

export const brickFist = feat(
  "feature/brawler/fishman-karate/brick-fist", "Brick Fist", 3,
  `<p>Also at 3rd level, you learn how to launch a powerful strike that vibrates the water within a creature's body.</p>
<p>In place of an unarmed strike, you can touch a creature and force it to make a Constitution saving throw. The creature takes bludgeoning damage equal to one roll of your brawler die + your Wisdom modifier on a failed save, and half as much on a successful one. This damage cannot be resisted or reduced in any way except with certain Haki abilities.</p>
<p>When you use this feature, you can spend a number of spirit points up to your proficiency bonus, adding one additional brawler die to the damage for each spirit point spent.</p>
<p>While underwater, a creature without a swimming speed has disadvantage on its saving throw.</p>`,
  {
    save: { ability: "con", dc: null, scaling: "wis" },
    actionType: "save",
    damage: { parts: [["@scale.brawler.brawling-die + @mod", "bludgeoning"]], versatile: "" },
  },
);

export const waterShot = feat(
  "feature/brawler/fishman-karate/water-shot", "Water Shot", 3,
  `<p>Also at 3rd level, you learn how to harness the moisture in the air, collecting it and hurling it as deadly projectiles.</p>
<p>In the place of an unarmed strike, you can instead make a ranged attack with a range of 60 feet. You are proficient with it, and you add your Dexterity or Wisdom modifier (your choice) to its attack and damage rolls. Its damage is your choice of bludgeoning, piercing, or slashing, and its damage die is a d6. This die changes as you gain brawler levels, as shown in the Brawling column of the Brawler table.</p>`,
  {
    actionType: "rwak",
    range: { value: 60, long: null, units: "ft" },
  },
);

export const palmBlock = feat(
  "feature/brawler/fishman-karate/palm-block", "Palm Block", 6,
  `<p>Beginning at 6th level, you learn how to force your hand to act as the ultimate defense, much like a shield.</p>
<p>If you make an unarmed strike as part of the Attack action on your turn and both your hands are free, you can use it to defend yourself as a bonus action. You gain a +2 bonus to AC until the start of your next turn, while you aren't incapacitated.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "Made an unarmed strike, both hands free" },
  },
);

export const waterHeart = feat(
  "feature/brawler/fishman-karate/water-heart", "Water Heart", 11,
  `<p>At 11th level, you learn a powerful technique to turn the ocean's tide upon your enemies. As an action, you can gather water and hurl it at a point you can see within 120 feet.</p>
<p>Each creature in a 20-foot radius sphere centered on that point must make a Dexterity saving throw, taking 4d6 bludgeoning damage on a failed save and half as much on a success. On a failed save, a creature additionally falls prone.</p>
<p>As part of this action, you can spend a number of spirit points up to your proficiency bonus, adding an additional 2d6 damage for each spirit point spent.</p>
<p>Additionally, if you spent at least 1 spirit point, a tube of water connects your position and the center of the sphere, which lasts until the start of your next turn. A creature can enter the tube at its entrance and use a bonus action to ride the currents, appearing at an empty square of its choice within 20 feet of the tube's exit.</p>`,
  {
    activation: { type: "action", cost: 1, condition: "" },
    target: { value: 20, width: null, units: "ft", type: "sphere" },
    range: { value: 120, long: null, units: "ft" },
    save: { ability: "dex", dc: null, scaling: "wis" },
    actionType: "save",
    damage: { parts: [["4d6", "bludgeoning"]], versatile: "" },
  },
);

export const vagabondDrill = feat(
  "feature/brawler/fishman-karate/vagabond-drill", "Vagabond Drill", 17,
  `<p>At 17th level, you've learned the ultimate techniques of fishman karate. Once per turn, when you use Brick Fist, you can target each creature of your choice within a 30-foot cone instead of only a creature you touch.</p>
<p>Additionally, if you spend 4 or more spirit points on Brick Fist, each affected creature becomes fatigued on a failed save, forcing it to subtract a d6 from any attack roll or ability check it makes for 1 minute.</p>
<p>A fatigued creature can make a Constitution saving throw at the end of each of its turns, ending the fatigue effect on itself on a successful save.</p>`,
  {
    target: { value: 30, width: null, units: "ft", type: "cone" },
    save: { ability: "con", dc: null, scaling: "wis" },
  },
);

export const features: FeatureItem[] = [
  aquaticBrawler, brickFist, waterShot, palmBlock, waterHeart, vagabondDrill,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Fishman Karate",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Fishman Karate is the signature fighting style of the fishmen. It's a skillful and powerful martial art that becomes even deadlier while underwater. Typically practiced only by fishmen, though there's nothing prohibiting other races from learning this martial art.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "fishman-karate",
    classIdentifier: "brawler",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(aquaticBrawler) }, { uuid: fUuid(brickFist) }, { uuid: fUuid(waterShot) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(palmBlock) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(waterHeart) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(vagabondDrill) }]),
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
