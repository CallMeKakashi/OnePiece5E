import { makeFeat } from "./_make-feat.js";
import type { FeatureItem } from "../../schemas/feature.js";

export const naturalist: FeatureItem = makeFeat({
  name: "Naturalist",
  slug: "naturalist",
  description: "<p>Extensively you have studied nature, allowing you to defend yourself in any situation, you gain the following benefits.</p><ul><li>Increase your Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in the Nature skill. If you are already proficient in the skill, you gain Expertise in it.</li><li>You learn the Natural Arts trick and Detect Poison and Disease creations. You can use Detect Poison and Disease once without expending a creation slot, and you regain the ability to do so when you finish a long rest.</li><li>You gain a unarmored AC equal to 13 + your Dexterity modifier.</li></ul>",
});

export const observant: FeatureItem = makeFeat({
  name: "Observant",
  slug: "observant",
  description: "<p>Quick to notice details of your environment, you gain the following benefits:</p><ul><li>Increase your Intelligence or Wisdom score by 1, to a maximum of 20.</li><li>If you can see a creature's mouth while it is speaking a language you understand, you can interpret what it's saying by reading its lips.</li><li>You have a +5 bonus to your passive Wisdom (Perception) and passive Intelligence (Investigation) scores.</li></ul>",
});

export const perceptive: FeatureItem = makeFeat({
  name: "Perceptive",
  slug: "perceptive",
  description: "<p>You hone your senses until they become razor-sharp. You gain the following benefits:</p><ul><li>Increase your Wisdom score by 1, to a maximum of 20.</li><li>You gain proficiency in the Perception skill. If you are already proficient in the skill, you gain Expertise in it.</li><li>You gain darkvision of 30ft. If you already had darkvision, it is extended by 30ft.</li><li>Being in a lightly obscured area doesn't impose disadvantage on your Wisdom (Perception) checks if you can both see and hear.</li></ul>",
});

export const performer: FeatureItem = makeFeat({
  name: "Performer",
  slug: "performer",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You master performance so that you can command any stage. You gain the following benefits:</p><ul><li>Increase your Charisma score by 1, to a maximum of 20.</li><li>You gain proficiency in the Performance skill. If you are already proficient in the skill, you gain Expertise in it.</li><li>As a bonus action, you can try to distract one creature you can see, who can see and hear you. Make a Charisma (Performance) check contested by their Wisdom (Insight) check. If your check succeeds, you grab their attention enough that it makes Wisdom (Perception), Intelligence (Investigation) checks, and attack rolls with disadvantage until the start of your next turn. If your check fails, the creature becomes immune to this effect for 1 hour.</li></ul>",
});

export const piercer: FeatureItem = makeFeat({
  name: "Piercer",
  slug: "piercer",
  description: "<p>You have achieved penetrating precision in combat, granting you the following benefits:</p><ul><li>Increase your Strength or Dexterity by 1, to a maximum of 20.</li><li>Once per turn, when you hit a creature with an attack that deals piercing damage, you can re-roll one of the attack’s damage dice, and you must use the new roll.</li><li>When you score a critical hit that deals piercing damage to a creature, you can roll one additional damage die when determining the extra piercing damage.</li></ul>",
});

export const poisoner: FeatureItem = makeFeat({
  name: "Poisoner",
  slug: "poisoner",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You can prepare and deliver deadly poisons, gaining the following benefits:</p><ul><li>When you make a damage roll that deals poison damage, you can ignore resistance to poison damage.</li><li>You can coat a weapon in poison as a bonus action, instead of an action.</li><li>You gain proficiency with the poisoner's kit if you don't already have it. With one hour of work using a poisoner's kit and expending 10 GP worth of materials, you can create a number of doses of potent poison equal to your proficiency bonus. Once applied to a weapon or piece of ammo, the poison retains its potency for 1 minute or until you hit with the weapon or ammo. When a creature takes damage from the coated weapon or ammo, that creature must succeed on a Constitution saving throw (DC 8 + Proficiency Bonus + your choice of Intelligence or Wisdom modifier) or take 2d8 poison damage and become poisoned until the end of your next turn.</li></ul>",
});

export const polearmMaster: FeatureItem = makeFeat({
  name: "Polearm Master",
  slug: "polearm-master",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You have mastered the art of polearm weaponry. You gain the following benefits:</p><ul><li>When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end. This attack uses the same ability modifier as the primary attack. The damage die for this attack is a d4, and it deals bludgeoning damage. You can use the shove action in place of that bonus action attack.</li><li>While you are wielding a glaive, halberd, pike, quarterstaff, or spear, you can use your reaction to make a melee weapon attack against creatures when they enter the reach you have with that weapon.</li></ul>",
});

export const practicedWisdom: FeatureItem = makeFeat({
  name: "Practiced Wisdom",
  slug: "practiced-wisdom",
  uses: { max: "@prof", per: "lr" },
  description: "<p>There is an inherent part of you that remains solidified mentally through experience. You gain the following benefits:</p><ul><li>Increase your Wisdom score by 1, to a maximum of 20.</li><li>You gain proficiency in Wisdom saving throws.</li><li>When you fail a Wisdom saving throw, you can roll a d6 and add it to the roll, possibly changing the outcome. You can do this a number of times equal to your proficiency bonus, and regain all uses when you finish a long rest.</li></ul>",
});

export const quickFingers: FeatureItem = makeFeat({
  name: "Quick Fingers",
  slug: "quick-fingers",
  activation: { type: "bonus", cost: 1 },
  description: "<p>Your nimble fingers and agility let you perform sleight of hand. You gain the following benefits:</p><ul><li>Increase your Dexterity score by 1, to a maximum of 20.</li><li>You gain proficiency in the Sleight of Hand skill. If you are already proficient in the skill, you gain Expertise in it.</li><li>As a bonus action, you can make a Dexterity (Sleight of Hand) check, use your thieves’ tools, take the Use an Object action, pickpocket, plant something on someone else, conceal an object, or you can attempt to disarm a creature of an object they are holding within touch range by making a Dexterity (Sleight of Hand) check against a creature's Strength (Athletics) or Dexterity (Acrobatics) check.</li></ul>",
});

export const rapierMastery: FeatureItem = makeFeat({
  name: "Rapier Mastery",
  slug: "rapier-mastery",
  prerequisites: "Proficiency with rapiers",
  activation: { type: "bonus", cost: 1 },
  description: "<p>The swift and sharp rapier is perfect for any duelist to strike and defend with ease. You gain the following benefits while wielding a rapier:</p><ul><li>You gain a +1 bonus to attack rolls you make with rapiers.</li><li>Once per turn, when you take the Attack action on your turn, you can forgo one attack with a feint, granting your next attack advantage on its attack roll, and if this attack hits it gains a bonus to its damage roll equal to your proficiency bonus.</li><li>As a bonus action, you can take a parrying stance, adding a +1 bonus to your armor class until the start of your next turn.</li><li>When you score a critical hit against a target, you may roll an additional damage die to add to the damage roll.</li></ul>",
});

export const religious: FeatureItem = makeFeat({
  name: "Religious",
  slug: "religious",
  description: "<p>Your extensive study of religion rewards you with the following benefits.</p><ul><li>Increase your Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in the Religion skill. If you are already proficient in the skill, you gain Expertise in it.</li><li>You learn the Show Off and Twist Fate creations. You can use Twist Fate without expending a creation slot. You can use this feature a number of times equal to your proficiency bonu, regaining the ability to do so when you finish a long rest. If you have the creativity feature, these creations are added to any creation list your have.</li><li>During a the course of a long rest, you can perform a ritual to transform a bottle of mundane water into a special holy water. When a creature drinks the water, they regain 2d4+2 hit points, after which the liquid becomes mundane again. The liquid also becomes mundane when you finish a long rest.</li></ul>",
});

export const remarkableRecovery: FeatureItem = makeFeat({
  name: "Remarkable Recovery",
  slug: "remarkable-recovery",
  description: "<p>You have an unnaturally quick recovery. You gain the following benefits:</p><ul><li>Increase your Constitution score by 1, to a maximum of 20.</li><li>When you are successfully stabilized while dying, you regain hit points equal to your Constitution modifier (minimum of 1).</li><li>Whenever you regain hit points as a result of a creation, item, or class feature (but not this feat), you regain additional hit points equal to your Constitution modifier (minimum of 1).</li></ul>",
});

export const resilientConstitution: FeatureItem = makeFeat({
  name: "Resilient Constitution",
  slug: "resilient-constitution",
  uses: { max: "@prof", per: "lr" },
  description: "<p>There is an inherent part of you that remains physically stouthearted. You gain the following benefits:</p><ul><li>Increase your Constitution score by 1, to a maximum of 20.</li><li>You gain proficiency in Constitution saving throws.</li><li>When you fail a Constitution saving throw, you can roll a d6 and add it to the roll, possibly changing the outcome. You can do this a number of times equal to your proficiency bonus, and regain all uses when you finish a long rest.</li></ul>",
});

export const rifleMaster: FeatureItem = makeFeat({
  name: "Rifle Master",
  slug: "rifle-master",
  description: "<p>Accurate and far-reaching, the rifle is a weapon that requires precision and discipline to wield, and experience to truly make it formidable. You gain the following benefits while wielding a musket or rifle:</p><ul><li>You gain a +1 bonus to attack rolls you make with muskets and rifles.</li><li>When you roll the weapon damage die with muskets or rifles, the minimum damage you can roll on the die equals your proficiency bonus.</li><li>Being prone doesn't impose disadvantage on your attack rolls with ranged weapons.</li><li>Your ranged weapon attacks don't have disadvantage against targets that are prone</li><li>Both the short and long ranges of these weapons are increased by 60 ft.</li></ul>",
});

export const rogueAdept: FeatureItem = makeFeat({
  name: "Rogue Adept",
  slug: "rogue-adept",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You have deft talent and cunning tactics that render you the most slippery of foes. You gain the following benefits:</p><ul><li>Increase your Dexterity, Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.</li><li>You gain proficiency in one skill of your choice. In addition, choose one of your skills that you are proficient in. You gain expertise in that skill.</li><li>As a bonus action, you can take the dash, disengage, or hide action.</li></ul>",
});

export const routineUser: FeatureItem = makeFeat({
  name: "Routine User",
  slug: "routine-user",
  prerequisites: "Intelligence or Wisdom 13 or higher",
  description: "<p>You have learned a number of creations that you can use as routines. These creations are written in a journal, which you must have in hand while using one of them.</p><p>When you choose this feat, you acquire a journal holding two 1st-level creations of your choice. Choose one of the following classes: bard, medic, or gadgeteer. You must choose your creations from that class’ creation list, and the creations you choose must have the routine tag. The class you choose also determines your creative ability for these creations.</p><p>If you come across a creation in written form, you might be able to add it to your journal. The creation must be on the creation list for the class you chose, the creation’s level can be no higher than half your level (rounded up), and it must have the routine tag.</p><p>The process of copying the creation into your journal takes 2 hours per level of the creation and costs 50 GP per level.</p>",
});

export const generalNRFeats: FeatureItem[] = [
  naturalist,
  observant,
  perceptive,
  performer,
  piercer,
  poisoner,
  polearmMaster,
  practicedWisdom,
  quickFingers,
  rapierMastery,
  religious,
  remarkableRecovery,
  resilientConstitution,
  rifleMaster,
  rogueAdept,
  routineUser,
];
