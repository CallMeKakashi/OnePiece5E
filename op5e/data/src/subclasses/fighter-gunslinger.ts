import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, createItemChoiceRestricted, createScaleValue, mergeAdvancements } from "../../helpers/advancement.js";
import { shotUuids, gunsmithDef, hemorrhagingDef, uuidOf } from "../class-features/class-content.js";

const SUB = "subclass/fighter/gunslinger";
const F = "feature/fighter/gunslinger";

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

const firearmProficiency = feat(
  "firearm-proficiency", "Firearm Proficiency",
  `<p>Starting when you choose this archetype at 3rd level, you gain proficiency with firearms and cannons, allowing you to add your proficiency bonus to attacks made with firearms and cannons.</p>
<h4>Gunsmith</h4>
<p>Upon choosing this archetype at 3rd level, you gain proficiency with Engineering (Intelligence) skill and Tinker's Tools. You may use them to craft ammunition at half the cost, repair damaged firearms, or even draft and create new ones (DM's discretion). Some extremely experimental and intricate firearms are only available through crafting.</p>`,
  "Gunslinger 3",
);

const trickShots = feat(
  "trick-shots", "Trick Shots",
  `<p>When you choose this archetype at 3rd level, you learn to perform powerful Trick Shots to disable or damage your opponents using your firearms.</p>
<p><strong>Trick Shots.</strong> You learn two trick shots of your choice, a list of which is found at the end of this feature. Many maneuvers enhance an attack in some way. Each use of a trick shot must be declared before the attack roll is made. You can use only one trick shot per attack. You learn an additional trick shot of your choice at 7th, 10th, 15th, and 18th level. Each time you learn a new trick shot, you can also replace one trick shot you know with a different one.</p>
<p><strong>Grit.</strong> You gain a number of grit points equal to 1 + your Wisdom modifier. You regain 1 expended grit point each time you roll a 20 on the d20 roll for an attack with a firearm, or deal a killing blow with a firearm to a creature of significant threat (DM's discretion). You regain all expended grit points after a short or long rest.</p>
<p><strong>Saving Throws.</strong> Some of your trick shots require your targets to make a saving throw to resist the trick shot's effects. The saving throw DC is calculated as follows:</p>
<p>Trick Shot Save DC = 8 + your proficiency bonus + your Dexterity modifier</p>
<h4>Covering Fire</h4>
<p>When you make a firearm attack against a creature, you can expend one grit point to protect your allies as they move across the battlefield from your target. Choose a creature within 60ft of the target. That creature has the benefits of half cover from the target until the start of your next turn.</p>
<h4>Dazing Shot</h4>
<p>When you make a firearm attack against a creature, you can expend one grit point to attempt to dizzy your opponent. On a hit, the creature must make a Wisdom Saving throw. On a failure, it suffers the effects of the Slow creation until the end of your next turn.</p>
<h4>Deadeye Shot</h4>
<p>When you make a firearm attack against a creature, you can expend one grit point to gain advantage on the attack roll.</p>
<h4>Deflecting Shot (7th level)</h4>
<p>As a reaction to a creature making an attack against a creature you can see within 60 ft of you, you can expend one grit point to fire at the attacker, causing them to fumble and change targets. The target must succeed a Dexterity saving throw or must target a creature of your choice within their range instead.</p>
<h4>Disarming Shot</h4>
<p>When you make a firearm attack against a creature, you can expend one grit point to attempt to shoot an object from their hands. On a hit, the creature suffers normal damage and must succeed on a Strength saving throw or drop 1 held object of your choice and have that object be pushed 10 feet away from you.</p>
<h4>Exhausting Shot</h4>
<p>When you make a firearm attack against a creature, you can expend one grit point to knock the wind out of the target. On a hit, the creature suffers normal damage and must make a Constitution saving throw. On a failure, they suffer the effects of the Bane creation for 1 minute, repeating the saving throw at the end of each of their turns, ending the effect on a success.</p>
<h4>Forceful Shot</h4>
<p>When you make a firearm attack against a creature, you can expend one grit point to attempt to trip them up and force them back. On a hit, the creature suffers normal damage and must succeed on a Strength saving throw or be pushed 15 feet away from you.</p>
<h4>Piercing Shot</h4>
<p>When you make a firearm attack against a creature, you can expend one grit point to attempt to fire through multiple opponents. When you use this option, you don't make an attack roll for the attack. Instead, the arrow fires forward in a line, which is 5 feet wide and 60 feet long. Each creature in that line must make a Dexterity saving throw. On a failed save, a creature takes damage as if it were hit by the projectile. On a successful save, a target takes half as much damage.</p>
<h4>Run and Gun</h4>
<p>When you make a firearm attack against a creature, you can expend one grit point to deftly dash through the battlefield through the torrent of bullets, allowing you to take either the Dash or Disengage action as part of the attack.</p>
<h4>Violent Shot</h4>
<p>When you make a firearm attack against a creature, you can expend one or more grit points to enhance the volatility of the attack. For each grit point expended, the attack gains a -1 to the firearm's attack roll. If the attack hits, you can roll one additional weapon damage die per grit point spent when determining the damage.</p>
<h4>Warning Shot</h4>
<p>When you make a firearm attack against a creature, you can expend one grit point to rattle them, either by striking them or leaving a bullet hole a little too close for comfort. On a hit or miss, the target must succeed a Wisdom saving throw or become frightened of you until the start of your next turn.</p>
<h4>Wringing Shot</h4>
<p>When you make a firearm attack against a creature, you can expend one grit point to attempt to topple a moving target. On a hit, the creature suffers normal damage and must make a Strength saving throw or be knocked prone.</p>`,
  "Gunslinger 3",
);

const bulletTime = feat(
  "bullet-time", "Bullet Time",
  `<p>When you reach 7th level, your reflexes and instincts allow for quick action in combat, as time appears to slow down around you. You add your proficiency bonus to your initiative. You can also draw and stow a firearm, then draw another firearm as a single object interaction on your turn.</p>
<p>In addition, as a bonus action on your turn, you can enter Bullet Time for 1 minute, or until you are incapacitated. While in Bullet Time, you gain the following benefits:</p>
<ul>
<li>You gain a 30ft Focus radius around you. As a reaction to a hostile creature within the radius moving at least 10 ft away from an allied creature within the radius (can include yourself), you can make one firearm attack with one firearm you are wielding against that creature.</li>
<li>Attack rolls made against you from creatures within your Focus radius do not benefit from advantage.</li>
<li>When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.</li>
</ul>
<p>You can enter Bullet Time a number of times equal to your proficiency bonus, and you regain all expended uses of it when you finish a long rest.</p>`,
  "Gunslinger 7",
);

const sharpSighted = feat(
  "sharp-sighted", "Sharp-Sighted",
  `<p>Upon reaching 10th level, your eyesight becomes on par with those of an eagle, allowing you to see and strike even further. You can see up to 1 mile away with no difficulty, able to discern even fine details as though looking at something no more than 100 feet away from you.</p>
<p>In addition, while you are in Bullet Time, you gain the following benefits:</p>
<ul>
<li>The normal and long range of all ranged weapons you are wielding and cannons you are proficient with doubles.</li>
<li>You gain a bonus to your firearm damage rolls equal to your Wisdom or Intelligence modifier (your choice).</li>
</ul>`,
  "Gunslinger 10",
);

const viciousIntent = feat(
  "vicious-intent", "Vicious Intent",
  `<p>Starting at 15th level, your firearm attacks score a critical hit on a roll of 19-20, and you regain a grit point on a roll of 19 or 20 on a d20 attack roll.</p>
<p>In addition, while you are in Bullet Time, the range of your Focus radius becomes 60ft.</p>`,
  "Gunslinger 15",
);

const distinguishedShot = feat(
  "distinguished-shot", "Distinguished Shot",
  `<p>At 18th level, choose one of your Trick Shots. This shot becomes your Distinguished Shot. While you are in Bullet Time, once per turn, you can ignore the Grit point cost of that Trick Shot (or reduced by 1 if you selected Violent Shot).</p>
<h4>Hemorrhaging Critical</h4>
<p>Upon reaching 18th level, whenever you score a critical hit on an attack with a firearm, the target additionally suffers half of the damage from the attack at the end of its next turn.</p>`,
  "Gunslinger 18",
);

export const gunslinger: SubclassItem = {
  _id: generateId(SUB),
  name: "Gunslinger",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>Some warriors and combat specialists spend their years perfecting the classic arts of swordplay, archery, or polearm tactics. However, some minds couldn't stop at just simple ranged weapons. Experimentation with components and rare metals has unlocked the secrets of controlled explosive force, creating and utilizing their own trademarked firearms.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "gunslinger",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
      createItemGrant(SUB, 3, [
        { uuid: fUuid(`${F}/firearm-proficiency`) },
        { uuid: fUuid(`${F}/trick-shots`) },
      ]),
      createItemGrant(SUB, 3, [{ uuid: uuidOf(gunsmithDef) }], "gunsmith"),
      createItemGrant(SUB, 18, [{ uuid: uuidOf(hemorrhagingDef) }], "hemorrhaging-critical"),
      createItemChoiceRestricted(SUB, 3, shotUuids, { count: 2, replacement: true, label: "Trick Shots (level 3)" }),
      createItemChoiceRestricted(SUB, 7, shotUuids, { count: 1, replacement: true, label: "Trick Shots (level 7)" }),
      createItemChoiceRestricted(SUB, 10, shotUuids, { count: 1, replacement: true, label: "Trick Shots (level 10)" }),
      createItemChoiceRestricted(SUB, 15, shotUuids, { count: 1, replacement: true, label: "Trick Shots (level 15)" }),
      createItemChoiceRestricted(SUB, 18, shotUuids, { count: 1, replacement: true, label: "Trick Shots (level 18)" }),
      createItemGrant(SUB, 7, [
        { uuid: fUuid(`${F}/bullet-time`) },
      ]),
      createItemGrant(SUB, 10, [
        { uuid: fUuid(`${F}/sharp-sighted`) },
      ]),
      createItemGrant(SUB, 15, [
        { uuid: fUuid(`${F}/vicious-intent`) },
      ]),
      createItemGrant(SUB, 18, [
        { uuid: fUuid(`${F}/distinguished-shot`) },
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

export const gunslingerFeatures: FeatureItem[] = [
  firearmProficiency,
  trickShots,
  bulletTime,
  sharpSighted,
  viciousIntent,
  distinguishedShot,
];
