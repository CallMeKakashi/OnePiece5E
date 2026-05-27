import { makeFeat } from "./_make-feat.js";
import type { FeatureItem } from "../../schemas/feature.js";

export const gourmand: FeatureItem = makeFeat({
  name: "Gourmand",
  slug: "gourmand",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You have mastered a variety of special recipes, allowing you to prepare exotic dishes with useful effects. You gain the following benefits:</p><ul><li>Increase your Constitution score by 1, to a maximum of 20.</li><li>You gain proficiency with cook’s utensils. If you are already proficient with them, you gain Expertise in them.</li><li>As an action, you can inspect a drink or plate of food within 5 feet of you and determine whether it is poisoned, provided that you can see and smell it.</li><li>As part of a short rest, you can cook special food, provided you have ingredients and cook utensils on hand. You can prepare enough of this food for a number of creatures equal to 4 + your proficiency bonus. At the end of the short rest, any creature who eats the food regains an extra 1d8 hit points.</li><li>With one hour of work or when you finish a short or long rest, you can cook a number of treats equal to your proficiency bonus. These special treats last 24 hours after being made. A creature can use a bonus action to eat one of those treats to gain temporary hit points equal to your level + your Wisdom modifier.</li></ul>",
});

export const gracefulDexterity: FeatureItem = makeFeat({
  name: "Graceful Dexterity",
  slug: "graceful-dexterity",
  uses: { max: "@prof", per: "lr" },
  description: "<p>There is an inherent part of you that remains physically fast and graceful. You gain the following benefits:</p><ul><li>Increase your Dexterity score by 1, to a maximum of 20.</li><li>You gain proficiency in Dexterity saving throws.</li><li>When you fail a Dexterity saving throw, you can roll a d6 and add it to the roll, possibly changing the outcome. You can do this a number of times equal to your proficiency bonus, and regain all uses when you finish a long rest.</li></ul>",
});

export const grappler: FeatureItem = makeFeat({
  name: "Grappler",
  slug: "grappler",
  prerequisites: "Strength 13 or higher",
  description: "<p>You've developed the skills necessary to hold your own in close-quarters grappling. You gain the following benefits:</p><ul><li>Increase your Strength score by 1, to a maximum of 20.</li><li>You have advantage on attack rolls against a creature you are grappling.</li><li>You can use your bonus action to attempt a grapple.</li></ul>",
});

export const greatWeaponMaster: FeatureItem = makeFeat({
  name: "Great Weapon Master",
  slug: "great-weapon-master",
  activation: { type: "bonus", cost: 1 },
  uses: { max: "@prof", per: "lr" },
  description: "<p>You’ve learned to put the weight of a weapon to your advantage, letting its momentum empower your strikes. You gain the following benefits:</p><ul><li>Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack’s damage.</li><li>While wielding a two-handed weapon, you can use your reaction to make a weapon attack when a creature enters the reach you have with that weapon.</li><li>On your turn, you can make one melee weapon attack as a bonus action with a two-handed weapon you are wielding. You can make this attack a number of times equal to your proficiency bonus, and regain all uses at the end of a long rest.</li></ul>",
});

export const gunner: FeatureItem = makeFeat({
  name: "Gunner",
  slug: "gunner",
  description: "<p>You have a quick hand and keen eye when employing firearms, granting you the following benefits:</p><ul><li>Increase your Dexterity score by 1, to a maximum of 20.</li><li>You gain proficiency with firearms.</li><li>You ignore the reload and loading property of firearms.</li><li>Being within 5 feet of a hostile creature doesn’t impose disadvantage on your ranged attack rolls.</li></ul>",
});

export const hammerMastery: FeatureItem = makeFeat({
  name: "Hammer Mastery",
  slug: "hammer-mastery",
  description: "<p>You master the club, greatclub, mace, warhammer, light hammer, and maul. You gain the following benefits when using any of them:</p><ul><li>You gain a +1 bonus to attack rolls you make with the weapon.</li><li>Whenever you have advantage on a melee attack roll you make with the weapons and hit, you can choose to knock the target prone if the lower of the two d20 rolls would also hit the target.</li><li>Whenever you have disadvantage on a melee attack roll you make with the weapons, the target takes bludgeoning damage equal to your Strength modifier (minimum of 0) if the attack misses but the higher of the two d20 rolls would have hit.</li><li>Any weapon attacks made with these weapons gain the Siege Property.</li></ul>",
});

export const handgunMaster: FeatureItem = makeFeat({
  name: "Handgun Master",
  slug: "handgun-master",
  description: "<p>Light and fast, you have trained extensively with handguns, allowing you to make the most of their functions in combat. You gain the following benefits while wielding a flintlock, pistol, or revolver:</p><ul><li>You gain a +1 bonus to attack rolls you make with flintlocks, pistols, and revolvers.</li><li>The damage dice of these weapons increases by 1 size (1d6=>1d8=>1d10=>1d12)</li><li>Any flintlock, pistol, or revolver you wield counts as light if it wasn’t already, and you do not need a free hand to reload these weapons.</li><li>You can draw and stow any flintlock, pistol, or revolver as part of making an attack with them.</li></ul>",
});

export const heavilyArmored: FeatureItem = makeFeat({
  name: "Heavily Armored",
  slug: "heavily-armored",
  prerequisites: "Proficiency with medium armor",
  description: "<p>You have trained to master the use of heavy armor, gaining the following benefits:</p><ul><li>Increase your Strength score by 1, to a maximum of 20.</li><li>You gain proficiency with heavy armor.</li></ul>",
});

export const heavyArmorMaster: FeatureItem = makeFeat({
  name: "Heavy Armor Master",
  slug: "heavy-armor-master",
  prerequisites: "Proficiency with heavy armor",
  activation: { type: "reaction", cost: 1 },
  description: "<p>You can use your armor to deflect strikes that would kill others. You gain the following benefits:</p><ul><li>Increase your Strength or Constitution score by 1, to a maximum of 20.</li><li>While you are wearing heavy armor, bludgeoning, piercing, and slashing damage that you take from attacks is reduced by 3, including those imbued with haki.</li><li>As a reaction to getting knocked prone or moved against your will, you can choose to not be knocked prone or moved.</li></ul>",
});

export const heightenedInnovation: FeatureItem = makeFeat({
  name: "Heightened Innovation",
  slug: "heightened-innovation",
  prerequisites: "The ability to use at least one creation",
  description: "<p>You have learned techniques to enhance your attacks with certain kinds of creations, gaining the following benefits:</p><ul><li>When you use a creation that requires you to make an attack roll, the creation’s range is doubled.</li><li>Your ranged creation attacks ignore half cover and three-quarters cover.</li><li>Your ranged creation attacks ignore close range disadvantage.</li><li>You learn one trick that requires an attack roll. Choose the trick from the bard, medic, savant, or gadgeteer spell list. Your creative ability for these creations depends on the class you chose: Charisma for bard, Intelligence for gadgeteer, Wisdom for medic, Charisma for savant, and Wisdom for Marksman.</li></ul>",
});

export const historian: FeatureItem = makeFeat({
  name: "Historian",
  slug: "historian",
  uses: { max: "@prof", per: "sr" },
  description: "<p>Your study of history rewards you with the following benefits:</p><ul><li>Increase your Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in the History skill. If you are already proficient in the skill, you gain Expertise in it.</li><li>When you take the Help action to aid another creature’s ability check, you give historical examples to aid them. The creature’s check gains a bonus equal to your proficiency bonus. To receive this bonus, the creature must be able to understand what you’re saying.</li><li>Your extensive study of past evens, you gain keen insight in nearly any field. In place of any skill or tool check, you can instead make an Intelligence (History) check. You can use this feature a number of times equal to your proficiency bonus, regaining all uses at the end of a short or long rest.</li></ul>",
});

export const insightful: FeatureItem = makeFeat({
  name: "Insightful",
  slug: "insightful",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You can pick up on social cues, peer past the poker face's of your foes, and have gain a real understanding of people. You gain the following benefits:</p><ul><li>Increase your Wisdom score by 1, to a maximum of 20.</li><li>You gain proficiency in the Insight skill. If you are already proficient in the skill, you instead gain expertise with it.</li><li>As a bonus action, you can look past the facades people put up to find the truth against a creature you can see within 30ft of you. You gain insight into the creature's characteristics, the DM tells you the number of one of the following characteristics of your choice: Strength score, Dexterity score, Constitution score, Intelligence score, Wisdom score, Charisma score, Armor Class, and Hit points. The creature then becomes immune to this effect for 1 hour.</li><li>You can use your bonus action to get uncanny insight into the next move of one creature you can see within 30ft of you. Make a Wisdom (Insight) check contested by the target’s Charisma (Deception) check. If your check succeeds, the creature has disadvantage on attack rolls and ability checks against you until the end of their next turn. If your check fails, the creature becomes immune to this effect for the next hour.</li></ul>",
});

export const inspiringLeader: FeatureItem = makeFeat({
  name: "Inspiring Leader",
  slug: "inspiring-leader",
  prerequisites: "Charisma 13 or higher",
  description: "<p>You can spend 10 minutes inspiring your companions, shoring up their resolve to fight. When you do so, choose up to six friendly creatures (which can include yourself) within 30 feet of you who can see or hear you and who can understand you. Each creature can gain temporary hit points equal to double your level + your Charisma modifier. A creature can't gain temporary hit points from this feat again until it has finished a short or long rest.</p>",
});

export const investigator: FeatureItem = makeFeat({
  name: "Investigator",
  slug: "investigator",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You have an eye for detail and can pick out the smallest clues. You gain the following benefits:</p><ul><li>Increase your Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in the Investigation skill. If you are already proficient in the skill, you instead gain expertise with it.</li><li>You can take the Search action as a bonus action.</li><li>As an action, you can become aware of vague details of the past of an object you are touching up to a number of months equal to 1 + your Intelligence Modifier. For example, touching a sword reveals that it was bought from a shop northwest from its current location about 2 months ago.</li></ul>",
});

export const joyful: FeatureItem = makeFeat({
  name: "Joyful",
  slug: "joyful",
  activation: { type: "bonus", cost: 1 },
  description: "<p>Your positive energy can act as a boost for your allies, instilling them the confidence to succeed. You gain 3 positivity dice and you regain all spent positivity dice when you finish a short or long rest. If you see one of your allies critically fail, you regain 1 positivity die. Your positivity dice are d6s. You can roll only one positivity die per turn, and a positivity die is spent when you roll it.</p><p>You can use positivity dice in any of the following ways:</p><ul><li>When you see a friendly creature within 30 ft of you getting hit by an attack (can include yourself), you can use your reaction to roll your positivity die to add the number rolled to the creature’s AC for that attack, potentially causing it to miss.</li><li>As a bonus action, you can attempt to cheer on a friendly creature (can include yourself) within 30 ft of yourself, rolling the positivity die and adding it to their next skill check or saving throw. A creature can only benefit from one positivity die at a time.</li><li>When you roll initiative, you can spend one positivity die and add the roll to your check.</li></ul>",
});

export const generalGJFeats: FeatureItem[] = [
  gourmand,
  gracefulDexterity,
  grappler,
  greatWeaponMaster,
  gunner,
  hammerMastery,
  handgunMaster,
  heavilyArmored,
  heavyArmorMaster,
  heightenedInnovation,
  historian,
  insightful,
  inspiringLeader,
  investigator,
  joyful,
];
