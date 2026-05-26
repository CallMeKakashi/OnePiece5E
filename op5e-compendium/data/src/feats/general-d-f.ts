import { makeFeat } from "./_make-feat.js";
import type { FeatureItem } from "../../schemas/feature.js";

export const dartMaster: FeatureItem = makeFeat({
  name: "Dart Master",
  slug: "dart-master",
  activation: { type: "reaction", cost: 1 },
  description: "<p>You have mastered the art of throwing darts, flying through the sky to pierce your foes. You gain the following benefits while wielding a dart:</p><ul><li>You gain a +1 bonus to attack rolls you make with darts.</li><li>The damage dice size of your darts increases by 1 size (1d4=>1d6).</li><li>Your darts ignore the effects of half and three-quarters cover.</li><li>You ignore close range disadvantage on attacks made with darts.</li><li>As a reaction to a creature moving outside of the normal range of the dart you are wielding, you can make an attack against that creature with a dart.</li></ul>",
});

export const dialMaster: FeatureItem = makeFeat({
  name: "Dial Master",
  slug: "dial-master",
  description: "<p>You have been trained to use Dial kits, gaining the following benefits:</p><ul><li>Increase your Wisdom, Charisma, or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Dial kit, or expertise if you were already proficient.</li><li>Choose 2 Tricks from either the Bard, Medic, or Gadgeteer subclass. These tricks are added to any creation list you may have.</li><li>Choose one 1st level creation from the same list. You can use it once per long rest without expending a creation slot. Also added to your creation list.</li></ul>",
});

export const diehard: FeatureItem = makeFeat({
  name: "Diehard",
  slug: "diehard",
  description: "<p>You are hard to put down, gaining the following benefits:</p><ul><li>Increase your Constitution score by 1, to a maximum of 20.</li><li>In order to die via failing death saves, you need to fail 4 death saves instead of 3.</li><li>When you make a death save, you add your proficiency bonus to the roll.</li><li>When you critically fail a death save, even automatically, it counts as a normal failure.</li></ul>",
});

export const diplomat: FeatureItem = makeFeat({
  name: "Diplomat",
  slug: "diplomat",
  activation: { type: "reaction", cost: 1 },
  description: "<p>You master the arts of diplomacy, gaining the following benefits:</p><ul><li>Increase your Charisma score by 1, to a maximum of 20.</li><li>You gain proficiency in the Persuasion skill. If you are already proficient in this skill, you gain Expertise in it.</li><li>If you spend 1 minute talking to someone who can understand what you say, you can make a Charisma (Persuasion) check contested by the creature’s Wisdom (Insight) check. If you or your companions are fighting the creature, your check automatically fails. If your check succeeds, the target is charmed by you as long as it remains within 60 feet of you and for 1 minute thereafter.</li><li>As a reaction to a creature, that can hear you and is within 60ft of you, failing a saving throw that would result in them becoming frightened or charmed, you can have the creature reroll the save, using the new result.</li></ul>",
});

export const drunkard: FeatureItem = makeFeat({
  name: "Drunkard",
  slug: "drunkard",
  description: "<p>Your dependence on alcohol is not a weakness, your constitution allows you to keep on fighting so long the booze keeps flowing. You gain the following benefits:</p><ul><li>Increase your Constitution score by 1, to a maximum of 20.</li><li>You gain resistance to poison damage and have advantage on all Constitution saving throws against poisons.</li><li>When you consume an alcoholic drink, you can regain a number of hit points equal to 2d6 + your level. You can use this ability twice, regaining all uses on a long rest.</li></ul>",
});

export const dualWielder: FeatureItem = makeFeat({
  name: "Dual Wielder",
  slug: "dual-wielder",
  description: "<p>You are a master at fighting with two weapons, granting you the following benefits:</p><ul><li>You gain a +1 bonus to AC while you are wielding a separate melee weapon in each hand.</li><li>You can use two-weapon fighting even when the one-handed weapons you are wielding aren’t light.</li><li>You can draw or stow two one-handed weapons when you would normally be able to draw or stow only one.</li></ul>",
});

export const duelingMaster: FeatureItem = makeFeat({
  name: "Dueling Master",
  slug: "dueling-master",
  activation: { type: "reaction", cost: 1 },
  description: "<p>You've learned to be quick and precise with your weapons. You gain the following benefits:</p><ul><li>Before you make a melee attack with a one-handed weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.</li><li>When a creature misses you with a melee attack, you can use your reaction to make an opportunity attack against that creature.</li><li>When you are wielding a melee weapon with which you are proficient and you are hit with an attack roll, you can use your reaction to add your proficiency bonus to your AC for that attack, potentially causing the attack to miss you.</li></ul>",
});

export const durable: FeatureItem = makeFeat({
  name: "Durable",
  slug: "durable",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You are hardy and resilient, granting you the following benefits:</p><ul><li>Increase your Constitution score by 1, to a maximum of 20.</li><li>You have advantage on death saving throws.</li><li>As a Bonus Action, you can expend one of your Hit Dice to roll the die and regain a number of Hit Points equal to the roll + your Constitution modifier.</li></ul>",
});

export const elementalAdept: FeatureItem = makeFeat({
  name: "Elemental Adept",
  slug: "elemental-adept",
  description: "<p>You are adept in utilizing a particular element in combat. You gain the following benefits:</p><ul><li>Increase your Constitution, Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.</li><li>When you gain this feat, choose one of the following damage types: acid, cold, fire, lightning, or thunder. You use ignore resistance to damage of the chosen type. In addition, when you roll damage for that type, you can treat any 1 on a damage die as a 2.</li></ul><p>You can select this feat multiple times. Each time you do so, you must choose a different damage type.</p>",
});

export const elementalAttack: FeatureItem = makeFeat({
  name: "Elemental Attack",
  slug: "elemental-attack",
  prerequisites: "Proficiency with a martial weapon",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You've learned how to infuse elemental energy into your attacks, such as harnessing friction to ignite your weapon, building static electricity to shock your foes, gathering vapor in the air to douse enemies in chilling water, or coating your weapon in corrosive acid or baleful poison. You gain the following benefits:</p><ul><li>Increase your Strength or Dexterity score by 1, to a maximum of 20.</li><li>As a bonus action on your turn, you can cause the next weapon attack you make before the end of your turn to deal additional damage equal to 1d8 + your proficiency bonus. This damage is your choice of acid, cold, fire, lightning, or poison damage. You choose which damage type when you gain this feat, and your choice cannot be changed later.</li></ul><p>You can gain this feat multiple times, choosing a different damage type each time you gain it.</p><p>If you choose acid damage, the attack corrodes soluble material that isn't being worn or carried. If you choose cold damage, the attack puts out any open, non-created flame within 5 feet of your target. If you choose fire damage, the attack ignites flammable material that isn't being worn or carried. If you choose lightning damage, the attack creates a strong gust that clears any fog or smoke in a 5-foot cube occupied by you or the target. If you choose poison damage, all tiny non-created plants within 5 feet of the target immediately wilt and die.</p>",
});

export const engineer: FeatureItem = makeFeat({
  name: "Engineer",
  slug: "engineer",
  description: "<p>You study the mechanical arts, gaining the following benefits:</p><ul><li>Increase your Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in the Engineering skill. If you are already proficient in the skill, you gain Expertise in it.</li><li>You learn the Prestidigitation and Detect Creation creations.</li><li>Whenever you craft a mastercraft item, it takes you half of the normal time, and it costs you half as much of the usual gold.</li></ul>",
});

export const expressionist: FeatureItem = makeFeat({
  name: "Expressionist",
  slug: "expressionist",
  prerequisites: "Charisma score of 13 or higher",
  description: "<p>Your habit of wanting to show your true colors in battle shines through, granting you the following benefits:</p><ul><li>Increase your Charisma score by 1, to a maximum of 20.</li><li>You learn the Charm Person creation. You can use it once without spending a Creation slot, and you gain the ability to do so when you finish a long rest. You also have the Allure Cantrip. Both these creations use your Charisma modifier.</li><li>You gain an Unarmored AC equal to 10 + your Charisma modifier + your Dexterity modifier. You lose this AC if you are wearing armor or holding a shield.</li></ul>",
});

export const fightingInitiate: FeatureItem = makeFeat({
  name: "Fighting Initiate",
  slug: "fighting-initiate",
  prerequisites: "Proficiency with a martial weapon",
  description: "<p>Your martial training has helped you develop a particular style of fighting. As a result, you gain the following benefits:</p><ul><li>Increase your Strength, Dexterity, or Constitution by 1, to a maximum of 20.</li><li>You learn one Fighting Style option of your choice from any class. If you already have a style, the one you choose must be different. Whenever you reach a level that grants the Ability Score Improvement feature, you can replace this feat's fighting style with another one that you don't have.</li></ul><p>You can select this feat multiple times. Each time you do so, you must choose a different Fighting Style Option.</p>",
});

export const firstAid: FeatureItem = makeFeat({
  name: "First Aid",
  slug: "first-aid",
  activation: { type: "action", cost: 1 },
  description: "<p>You are an able physician, allowing you to mend wounds quickly and get your allies back in the fight. You gain the following benefits:</p><ul><li>Increase your Wisdom score by 1, to a maximum of 20.</li><li>You gain proficiency in Wisdom (Medicine) checks. If you were already proficient, you instead gain expertise.</li><li>When you use a healer's kit to stabilize a dying creature, that creature also regains 1 hit point.</li><li>As an action. you can spend one use of a healer's kit to tend to a creature and restore 1d6 + 4 hit points to it, plus additional hit points equal to the creature's maximum number of Hit Dice. The creature can't regain hit points from this feat again until it finishes a short or long rest.</li></ul>",
});

export const flailMastery: FeatureItem = makeFeat({
  name: "Flail Mastery",
  slug: "flail-mastery",
  prerequisites: "Proficiency with flails",
  description: "<p>The flail is a tricky weapon to use, but you have spent countless hours mastering it. You gain the following benefits:</p><ul><li>You gain a +1 bonus to attack rolls you make with a flail.</li><li>Flails you wield have the reach property.</li><li>When you hit a creature with a flail, and a creature is adjacent to your target, you can choose to sweep, dealing bludgeoning damage equal to the modifier of the ability score used for your flail damage rolls.</li><li>When you successfully hit a creature with a flail, you can use your bonus action to attempt to knock that creature down. The creature must be no more than 1 size larger than you. The creature makes a Strength saving throw (DC equal to 8 + your proficiency bonus + your Ability Score Modifier used for making attack and damage rolls with your flail). On a success, nothing happens, but on a failure, they are knocked prone. Mounted creatures knocked prone in this way become dismounted.</li></ul>",
});

export const flyingStrikes: FeatureItem = makeFeat({
  name: "Flying Strikes",
  slug: "flying-strikes",
  prerequisites: "Strength or Dexterity 13 or higher",
  description: "<p>You've honed your skill with weapons of all kinds, able to shape shockwaves of destruction as projectiles out of thin air.</p><ul><li>Increase your Strength or Dexterity by 1, to a maximum of 20.</li><li>You gain a special ranged weapon attack you can make in place of any regular weapon attack on your turn (including unarmed strikes). You must be wielding the melee weapon to use this attack option. You are proficient with it, and add the modifier of the ability score you increased with this feat to the attack and damage roll (You must use the same ability for both rolls). Its damage type and damage die are the same as the weapon you are wielding, and it has a normal range of 30 feet and a long range of 120 feet.</li><li>Certain abilities from your race, class, and the weapon you are wielding that modify the attack or damage roll can be applied to this, including Fighting Styles, Barbarian Rage Damage and Reckless Attack, Rogue Sneak attack, any bonus to attack and hit, and more. Does not include secondary effects such as Stunning Strike.</li></ul>",
});

export const freeDiver: FeatureItem = makeFeat({
  name: "Free Diver",
  slug: "free-diver",
  description: "<p>You are skilled at swimming and diving without the assistance of equipment. You gain the following benefits:</p><ul><li>Increase your Constitution score by 1, to a maximum of 20.</li><li>You gain a swimming speed equal to your movement speed. If you already have a swim speed, increase it by 10 feet.</li><li>Your ability to hold your breath is increased by 10 minutes.</li></ul>",
});

export const generalDFFeats: FeatureItem[] = [
  dartMaster,
  dialMaster,
  diehard,
  diplomat,
  drunkard,
  dualWielder,
  duelingMaster,
  durable,
  elementalAdept,
  elementalAttack,
  engineer,
  expressionist,
  fightingInitiate,
  firstAid,
  flailMastery,
  flyingStrikes,
  freeDiver,
];
