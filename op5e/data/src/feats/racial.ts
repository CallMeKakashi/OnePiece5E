import { makeFeat } from "./_make-feat.js";
import type { FeatureItem } from "../../schemas/feature.js";

export const allConsumingMaw: FeatureItem = makeFeat({
  name: "All-Consuming Maw",
  slug: "all-consuming-maw",
  racial: true,
  prerequisites: "Sharptooth Fishman race",
  description: "<p>Your naturally sharp teeth combined with your relentless spirit allow you to maintain a firm grip on your foes. You gain the following benefits:</p><ul><li>Increase your Strength score by 1, up to a maximum of 20.</li><li>When you hit a creature with your natural weapon from your Natural Weapons feature, you can use your bonus action to make a grapple attempt. While grappling a creature in this way, they take 1d4 piercing damage at the start of each of your turns.</li><li>You gain expertise in Intimidation (Charisma) checks.</li></ul>",
});

export const bioluminescence: FeatureItem = makeFeat({
  name: "Bioluminescence",
  slug: "bioluminescence",
  racial: true,
  prerequisites: "Fishman or Merfolk race, as any fish that naturally produces light",
  description: "<p>You have a special set of organs that produces a chemical reaction to produce light. You gain the following benefits:</p><ul><li>Increase your Wisdom or Constitution score by 1, up to a maximum of 20.</li><li>You learn the Light and Radiant Bolt. Constitution is your Creativity modifier for these tricks. If you have the Creativity feature, these tricks are added to that list, allowing you to use that creativity modifier instead.</li><li>Once per short or long rest, when you use Radiant Bolt, you can cause a single creature hit by the attack to make a Constitution saving throw against creation save DC, becoming blinded for 1 minute, repeating the saving throw at the end of each of their turns.</li></ul>",
});

export const birkanBattleTactics: FeatureItem = makeFeat({
  name: "Birkan Battle Tactics",
  slug: "birkan-battle-tactics",
  racial: true,
  prerequisites: "Birkan Sky Islander race",
  activation: { type: "bonus", cost: 1 },
  description: "<p>As a relentless Birkan Warrior, you know how to utilize your dials for the ultimate combative advantage. You gain the following benefits:</p><ul><li>Increase your Intelligence, Wisdom, or Charisma score by 1, up to a maximum of 20.</li><li>When you roll damage for a creation, you can add the modifier of the ability score you chose to increase to the roll.</li><li>Adding to your Ancient Dials feature, you learn the Defending Ward trick, but you can also use it as a bonus action, a number of times equal to your proficiency bonus, regaining all uses on a long rest.</li></ul>",
});

export const buckToothed: FeatureItem = makeFeat({
  name: "Buck-Toothed",
  slug: "buck-toothed",
  racial: true,
  prerequisites: "Mink race, as a beaver mink",
  uses: { max: "@prof", per: "sr" },
  description: "<p>Armed with gnashing teeth and a large, flat tail, you can chew through the toughest of bark and wade through the roughest waters. You gain the following benefits:</p><ul><li>Increase your Strength or Constitution score by 1, up to a maximum of 20.</li><li>You gain a swimming speed equal to your walking speed.</li><li>Your natural weapons become 1d8 piercing or slashing damage thanks to your large, buck-teeth. Attacks made with these natural weapons have the Siege property against objects, structures, and creatures made out of wood.</li><li>When you successfully shove a creature, you can choose to use your large beaver tail to slam into them, choosing one of the following additional effects to occur: Your target takes 1d6 bludgeoning damage, your target is shoved 10ft instead of 5ft, or your target has their speed reduced by 10ft until the end of their next turn. You can use this feature a number of times equal to your proficiency bonus, regaining all uses at the end of a short or long rest.</li></ul>",
});

export const crypticCamouflage: FeatureItem = makeFeat({
  name: "Cryptic Camouflage",
  slug: "cryptic-camouflage",
  racial: true,
  prerequisites: "Fishman or Merfolk race, as a fish that naturally has the ability to camouflage itself",
  activation: { type: "action", cost: 1 },
  description: "<p>You have the uncanny ability to blend into any environment, rendering you essentially invisible. You gain the following benefits:</p><ul><li>Increase your Dexterity or Wisdom score by 1, up to a maximum of 20.</li><li>You gain proficiency in Dexterity (Stealth) checks. If you are already proficient, you instead gain Expertise.</li><li>As an action, you can change the color of your skin to match the color and texture of your surroundings, giving you advantage on Dexterity (Stealth) checks made to hide in those surroundings.</li></ul>",
});

export const darkWingHunter: FeatureItem = makeFeat({
  name: "Dark Wing Hunter",
  slug: "dark-wing-hunter",
  racial: true,
  prerequisites: "Mink race, as a bat mink",
  description: "<p>You are the terror of the night, able to take flight and sense all sounds hidden under the cover of dark. You gain the following benefits:</p><ul><li>Increase your Wisdom or Dexterity score by 1, up to a maximum of 20.</li><li>You gain blindsight of 10ft. This blindsight ceases to function if you are deafened.</li><li>You gain a flying speed equal to your movement speed. You cannot benefit from this speed if you are wearing heavy armor.</li></ul>",
});

export const deadManSGrip: FeatureItem = makeFeat({
  name: "Dead Man’s Grip",
  slug: "dead-man-s-grip",
  racial: true,
  prerequisites: "Revived Augmented race, Strength score of 16 or higher",
  uses: { max: "@prof", per: "lr" },
  description: "<p>When the brain shuts off, the brain is no longer able to control the restriction of muscle tightness, leading to the phenomenon known as the Deadman's Grip, a phenomenon that you now wield. You gain the following benefits:</p><ul><li>Increase your Strength or Constitution score by 1, up to a maximum of 20.</li><li>You gain proficiency in Strength (Athletics) checks. If you were already proficient, you gain expertise instead.</li><li>When you are knocked prone, you can attempt a Strength (Athletics) check, DC 15. On a success, you avoid being knocked prone.</li><li>When you make an attack roll, ability check, or saving throw that uses strength, you may choose to replace the roll on the dice with your Strength score instead. You can use this feature a number of times equal to your proficiency bonus, regaining all uses at the end of a long rest.</li></ul>",
});

export const diminutiveDudgeon: FeatureItem = makeFeat({
  name: "Diminutive Dudgeon",
  slug: "diminutive-dudgeon",
  racial: true,
  prerequisites: "Any race excluding Giants, Small or smaller size",
  uses: { max: "@prof", per: "lr" },
  description: "<p>You are a human born especially small. Living in a world of larger and more powerful folk, you have grown accustomed to striking especially hard, or getting out of dodge with your quick maneuverability. You gain the following benefits:</p><ul><li>Increase your Dexterity or Charisma score by 1, up to a maximum of 20.</li><li>When you damage a creature with an attack or creation and the creature’s size is larger than yours, you can cause the attack or creation to deal extra damage to the creature. The extra damage equals your level. You can use this trait a number of times equal to your proficiency bonus, regaining all expended uses when you finish a long rest.</li><li>You can attempt to hide even when you are only obscured by a creature that is at least one size larger than you.</li><li>You can move through the space of any creature that is of a size larger than yours.</li></ul>",
});

export const electroExpert: FeatureItem = makeFeat({
  name: "Electro Expert",
  slug: "electro-expert",
  racial: true,
  prerequisites: "Mink race",
  activation: { type: "bonus", cost: 1 },
  uses: { max: "@prof", per: "sr" },
  description: "<p>Whether through extreme training or simply born with an adept skill with electro, you now gain stronger static charged strikes. You gain the following benefits:</p><ul><li>Increase your Strength, Dexterity, or Constitution score by 1, up to a maximum of 20.</li><li>When you use your Electro trait, you can choose to deal an extra amount of lightning damage equal to your proficiency bonus. You can use this feature a number of times equal to the modifier of the ability score you increased with this feat, regaining all uses at the end of a short or long rest. When you are in your Inner Beast form, you can use this feature without expending uses.</li><li>As a bonus action, you can suffuse your being with electro to strike with extreme speed and precision. Until the end of your turn, you have advantage on all weapon attacks. You can use this ability a number of times equal to your proficiency bonus, regaining all uses at the end of a long rest.</li></ul>",
});

export const enhancedCircuitry: FeatureItem = makeFeat({
  name: "Enhanced Circuitry",
  slug: "enhanced-circuitry",
  racial: true,
  prerequisites: "Cyborg Augmented race",
  description: "<p>Your augmentations enable you to harness the energy within, enabling you to take in and release vast amounts of electricity. You gain the following benefits:</p><ul><li>Increase your Intelligence or Constitution score by 1, up to a maximum of 20.</li><li>You gain resistance to lightning damage.</li><li>You learn the Countershock creation, using the ability score you increased as the creativity ability modifier. If you have the Creativity feature, this creation is added to your creation lists. You can use this creation without expending a creation slot a number of times equal to your proficiency bonus. You regain all uses of this ability at the end of a long rest.</li></ul>",
});

export const enhancedEvolution: FeatureItem = makeFeat({
  name: "Enhanced Evolution",
  slug: "enhanced-evolution",
  racial: true,
  prerequisites: "Artificial Human Augmented race",
  description: "<p>Your biological and physical attributes have been augmented to have you adapt to any situation. You gain the following benefits:</p><ul><li>Increase your Constitution, Intelligence, Wisdom, or Charisma score by 1, up to a maximum of 20.</li><li>You learn the Absorption creation. Constitution is your Creativity modifier for this creation. If you have the Creativity feature, it is added to that list, allowing you to use that creativity modifier instead. You can use this creation without expending a creation slot a number of times equal to your proficiency bonus. You regain all these uses at the end of a long rest.</li><li>You gain resistance to the damage type that you chose for your Spark of War feature.</li></ul>",
});

export const eyesOnThePrize: FeatureItem = makeFeat({
  name: "Eyes on the Prize",
  slug: "eyes-on-the-prize",
  racial: true,
  prerequisites: "Three-Eye Human race",
  uses: { max: "@prof", per: "lr" },
  description: "<p>Your foresight paired with your biological third eye grants extreme foresight and perception when facing adversity. You gain the following benefits:</p><ul><li>Increase your Intelligence, Wisdom, or Charisma score by 1, up to a maximum of 20.</li><li>You gain proficiency in Wisdom (Perception) checks. If you are already proficient, you gain expertise instead.</li><li>After making an attack or damage roll, you may roll a d10 and add the number to the chosen roll. You can use this feature a number of times equal to your proficiency bonus, regaining all uses at the end of a long rest.</li></ul>",
});

export const eyesOpen: FeatureItem = makeFeat({
  name: "Eyes Open",
  slug: "eyes-open",
  racial: true,
  prerequisites: "Three-Eyed Human race",
  description: "<p>Your three eyes grant you the ability to be both alert and observant. You gain the following benefits:</p><ul><li>Increase your Wisdom or Charisma score by 1, up to a maximum of 20.</li><li>You gain Expertise in Charisma (Deception) and Wisdom (Insight) checks.</li><li>You gain a bonus to both your Passive Perception score and your initiative rolls equal to your proficiency bonus.</li></ul>",
});

export const feralThreat: FeatureItem = makeFeat({
  name: "Feral Threat",
  slug: "feral-threat",
  racial: true,
  prerequisites: "Chimera Augmented race",
  activation: { type: "bonus", cost: 1 },
  description: "<p>With your body formed together with the body parts of various beasts, you start to gain insight on their own feral instincts. You gain the following benefits:</p><ul><li>Increase your Strength or Constitution score by 1, up to a maximum of 20.</li><li>You gain proficiency in Strength (Athletics) or Charisma (Intimidation) checks. If you were already proficient in one of these skills, you instead gain expertise in that skill.</li><li>As a bonus action, you can let out a menacing roar. Creatures of your choice within 10 feet of you that can hear you must succeed on a Wisdom saving throw or become frightened of you until the end of your next turn. The DC of the save equals 8 + your proficiency bonus + your Constitution modifier. You can use this feature a number of times equal to your proficiency bonus per long rest.</li><li>You count as two sizes larger when determining your carrying capacity and the weight you can push, drag, lift, and for grapple and shove attempts.</li></ul>",
});

export const fleetFooted: FeatureItem = makeFeat({
  name: "Fleet-Footed",
  slug: "fleet-footed",
  racial: true,
  prerequisites: "Mink race, as a rabbit mink",
  description: "<p>Quick with your feet and able to leap great distances, you exhibit the traits of reflexive rabbits. You gain the following benefits:</p><ul><li>Increase your Dexterity score by 1, up to a maximum of 20.</li><li>Your movement speed increases by 5 feet.</li><li>You add your proficiency bonus to your initiative rolls.</li><li>Once during each of your turns when you walk at least 5 feet, you can hop a distance equal to half your total walking speed in feet in a direction of your choice. This extra distance doesn’t cost movement, but you can hop only if your speed isn’t 0.</li></ul>",
});

export const fuelEfficient: FeatureItem = makeFeat({
  name: "Fuel Efficient",
  slug: "fuel-efficient",
  racial: true,
  prerequisites: "Cyborg Augmented race",
  activation: { type: "reaction", cost: 1 },
  description: "<p>Your ability to process fuel has greatly improved the functionality of your cybernetics, making the most of your mechanical body. You gain the following benefits:</p><ul><li>Increase your Constitution score by 1, up to a maximum of 20.</li><li>Once per short or long rest, if you fail a saving throw, you can expend one of your remaining hit dice to roll it and add the number to the save, potentially turning it into a success.</li><li>Once per turn, when you hit a creature with a weapon attack, you can expend one of your remaining hit dice to roll it and add the number to the damage total. The damage type is the same as the weapon you used.</li><li>As a reaction to taking damage, you can expend one of your remaining hit dice to roll it and add your Constitution modifier to the total, reducing that total from the damage taken.</li><li>Once per long rest, you can consume 1 lb of fuel, regaining a number of expended hit dice equal your proficiency bonus.</li><li>The limit of items that you can have integrated by your Integrated Toolbox feature is increased by 3.</li><li>If any of your integrated weapons have the reload property, you ignore that property as long as you have unspent 1 hit die remaining.</li></ul>",
});

export const glidingSkin: FeatureItem = makeFeat({
  name: "Gliding Skin",
  slug: "gliding-skin",
  racial: true,
  prerequisites: "Mink race, as a flying squirrel mink",
  activation: { type: "reaction", cost: 1 },
  description: "<p>You take on the abilities of a flying squirrel, with deft movement and deft senses. Your squirrel paws are adept at climbing up the tallest of trees. Sprouting from your sides are extended membranes of skin. These membranes grant you the ability to glide along the wind as you descend safely from the highest heights. You gain the following benefits:</p><ul><li>Increase your Dexterity or Wisdom score by 1, up to a maximum of 20.</li><li>You gain a climbing speed equal to your walking speed.</li><li>When you fall at least 10 feet above the ground, you can use your reaction to extend your skin membranes to glide horizontally a number of feet equal to your walking speed, and you take 0 damage from the fall. You determine the direction of the glide.</li></ul>",
});

export const hoovesInbound: FeatureItem = makeFeat({
  name: "Hooves Inbound",
  slug: "hooves-inbound",
  racial: true,
  prerequisites: "Mink race, as a hoofed mink",
  description: "<p>Hoofed beings have powerful legs, enabling them to move at high speeds with ease, able to charge down any enemy that comes your way. You gain the following benefits:</p><ul><li>Increase your Strength or Wisdom score by 1, up to a maximum of 20.</li><li>Your movement speed increases by 5 feet.</li><li>You count as one size bigger when determining your carrying capacity, and the weight you can push, drag, or lift.</li><li>If you move at least 20 feet straight toward a target and then hit it with a melee weapon attack on the same turn, you can immediately follow that attack with a bonus action, making one attack against the target with your natural weapon.</li></ul>",
});

export const holeyMoley: FeatureItem = makeFeat({
  name: "Holey Moley",
  slug: "holey-moley",
  racial: true,
  prerequisites: "Mink race, as a mole mink",
  description: "<p>The earth is your natural terrain, nature has granted you powerful claws that break rocks, and the senses necessary to feel your way through the ground. You gain the following benefits:</p><ul><li>Increase your Wisdom or Strength score by 1, up to a maximum of 20.</li><li>You gain a tremorsense of 20ft.</li><li>You gain a burrow speed equal to half of your movement speed (rounded down to the nearest multiple of 5). For example, if your movement speed is 35 feet, your burrow speed would be 15 feet.</li><li>Your natural weapons deal 2d4 slashing damage thanks to your powerful claws.</li></ul>",
});

export const hulkingMonolith: FeatureItem = makeFeat({
  name: "Hulking Monolith",
  slug: "hulking-monolith",
  racial: true,
  prerequisites: "Any race excluding Dwarves and Giants, at least 10ft tall, minimum 17 strength ability score",
  activation: { type: "reaction", cost: 1 },
  uses: { max: "@prof", per: "sr" },
  description: "<p>You are a human of near epic proportions, standing at a formidable stature among other men. Whether the reason is you descend from giants, or simply lucked into it, you are a monolith. You gain the following benefits:</p><ul><li>Increase your Strength or Constitution score by 1, up to a maximum of 20.</li><li>You become Large, but this doesn’t increase the size of the damage dice of your weapons and unarmed strikes. You can wield oversized weapons made for your size category without disadvantage.</li><li>You can focus yourself to occasionally shrug off injury. When you take damage, you can use your reaction to roll a d12. Add your Constitution modifier to the number rolled, and reduce the damage by that total. You can use this trait a number of times equal to your proficiency bonus, regaining all uses at the end of a short or long rest.</li></ul>",
});

export const humanFerocity: FeatureItem = makeFeat({
  name: "Human Ferocity",
  slug: "human-ferocity",
  racial: true,
  prerequisites: "Any Human race",
  activation: { type: "reaction", cost: 1 },
  description: "<p>Deep inside every human is the ferocity and will to fight through sheer and tireless determination. You gain the following benefits:</p><ul><li>Increase your Strength or Constitution score by 1, up to a maximum of 20.</li><li>When you hit with an attack made with a simple or martial weapon, unarmed strikes included, you can roll the weapon’s damage dice an additional time and add it as extra damage of the weapon’s damage type. You can use this feature a number of times equal to your proficiency bonus, regaining all uses on a short or long rest.</li><li>Immediately after you use your Human Determination trait, you can use your reaction to make one weapon attack.</li></ul>",
});

export const inkyDepths: FeatureItem = makeFeat({
  name: "Inky Depths",
  slug: "inky-depths",
  racial: true,
  prerequisites: "Multipod Fishman or Merfolk race, as an octopus or a squid",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You have a natural ink defense that enables you the ability to flee. You gain the following benefits:</p><ul><li>Increase your Dexterity or Constitution score by 1, up to a maximum of 20.</li><li>Once per short or long rest you can use the Blindness/Deafness Creation (Blindness only) or the Grease Creation using your Constitution as the creative ability each. If you have the Creativity feature, these creations are added to that list, allowing you to use that creativity modifier instead.</li><li>As a bonus action, you can dash.</li></ul>",
});

export const intuitivePrimate: FeatureItem = makeFeat({
  name: "Intuitive Primate",
  slug: "intuitive-primate",
  racial: true,
  prerequisites: "Mink race, as an ape or monkey mink",
  description: "<p>Powerful and intelligent, apes make full use of both their might and their hands to accomplish even the most complex task. You gain the following benefits:</p><ul><li>Increase your Strength, Dexterity, or Intelligence score by 1, up to a maximum of 20.</li><li>You gain proficiency in Dexterity (Acrobatics) checks, and one set of tools of your choice. If you were already proficient in them, you instead gain expertise</li><li>You count as one size larger when determining your carrying capacity and the weight you can push, drag, lift, and for grapple and shove attempts.</li><li>You gain a climbing speed equal to your walking speed.</li></ul>",
});

export const ironWilled: FeatureItem = makeFeat({
  name: "Iron-Willed",
  slug: "iron-willed",
  racial: true,
  prerequisites: "Standard Human race",
  description: "<p>Throughout the ages, time and time again, there is one singular truth that shines through all darkness. Nothing is stronger than the indomitable human spirit. You gain the following benefits:</p><ul><li>Increase your Wisdom or Constitution score by 1, up to a maximum of 20.</li><li>Your d4s from your Strong Will feature increase to d6s.</li><li>When you score a critical hit on a creature, you regain a use of your Strong will.</li><li>You gain a bonus to Death Saving Throws equal to your proficiency bonus.</li></ul>",
});

export const keenCanine: FeatureItem = makeFeat({
  name: "Keen Canine",
  slug: "keen-canine",
  racial: true,
  prerequisites: "Mink race, as any canine mink",
  description: "<p>Your keen sense of smell and hearing has been honed to be just as sharp as your own fangs, making you the ultimate hunter. You gain the following benefits:</p><ul><li>Increase your Strength or Wisdom score by 1, up to a maximum of 20.</li><li>You gain proficiency in Wisdom (Perception) checks. If you are already proficient, you instead gain expertise.</li><li>Your natural weapons become 2d4 piercing or slashing damage thanks to your powerful fangs.</li><li>Once per turn, when you hit with an attack with an unarmed strike or natural weapon, you can additionally make a shove attempt as part of that attack.</li></ul>",
});

export const kujaAccuracy: FeatureItem = makeFeat({
  name: "Kuja Accuracy",
  slug: "kuja-accuracy",
  racial: true,
  prerequisites: "Kuja race",
  description: "<p>The accuracy of Kuja is legendary, especially that of archers. You have uncanny aim with attacks that rely on precision rather than brute force. You gain the following benefits:</p><ul><li>Increase your Dexterity, Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20</li><li>Whenever you have advantage on an attack roll using Dexterity, Intelligence, Wisdom, or Charisma, you can reroll one of the dice once.</li></ul>",
});

export const lengthyHeritage: FeatureItem = makeFeat({
  name: "Lengthy Heritage",
  slug: "lengthy-heritage",
  racial: true,
  prerequisites: "Long Arm or Long Leg Human race, and that your parents were either one Long Leg and one Long Arm, or both were Long Limbed humans",
  description: "<p>Despite the feuds between Long Arms and Long Legs, your miraculous birth proves that some semblance of peace is possible. Both with powerful arms and swift legs, you are a marvel of physical ability, and a long, prideful heritage. You gain the following benefits:</p><ul><li>Increase your Dexterity or Strength score by 1, up to a maximum of 20.</li><li>You gain proficiency in Strength (Athletics) or Dexterity (Acrobatics) checks. If you were already proficient in one of these skills, you instead gain expertise in that respective skill.</li><li>If your base race is a Long Arm, you gain the Tall Stride trait of the Long Leg Race. If your base race is a Long Leg, you gain the Long Limbs trait of the Long Arm Race.</li><li>If you miss with an attack roll or fail an ability check or a saving throw, you can draw on your bonds of and pride to gain a bonus to the roll equal to the number of allies you can see within 30 feet of you (maximum bonus of +5). You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses after you finish a long rest.</li></ul>",
});

export const madeForWar: FeatureItem = makeFeat({
  name: "Made For War",
  slug: "made-for-war",
  racial: true,
  prerequisites: "Artificial Human Augmented race",
  description: "<p>Genetically enhanced purely for the purpose of battle, you find yourself physically tougher and better able to unleash even more powerful strikes. You gain the following benefits:</p><ul><li>Increase your Strength, Dexterity, or Constitution score by 1, up to a maximum of 20.</li><li>Your hit point maximum increases by an amount equal to your level, and it increases by 1 every time you gain a level.</li><li>When you use your Spark of War feature, you gain an additional effect based on the damage type you had chosen when you created the character. If the effect forces the target to make a saving throw, the DC equals 8 + your Proficiency Bonus + Constitution modifier.</li></ul><p><strong>Acid.</strong> All of the damage from the initial source becomes acid, and the damage ignores resistance to acid damage.</p><p><strong>Cold.</strong> The target’s movement speed is reduced by 10 feet until the end of their next turn.</p><p><strong>Fire.</strong> The target takes an additional 3 fire damage.</p><p><strong>Lightning.</strong> The target has a penalty on the next attack roll they make equal to your proficiency bonus.</p><p><strong>Poison.</strong> The target must make a Constitution saving throw, becoming poisoned until the end of their next turn on a failure.</p><p><strong>Thunder.</strong> The target must make a Strength saving throw, becoming pushed backwards 10ft or knocked prone on a failure.</p><p><strong>Necrotic.</strong> The target must make a Constitution saving throw, becoming weakened on a failure. While weakened, all the target's damage rolls are reduced by a number equal to your proficiency bonus, until the end of their next turn.</p><p><strong>Radiant.</strong> The target must make a Dexterity saving throw, becoming highlighted on a failure. While highlighted, all attack rolls against them are made at advantage until the end of their next turn.</p>",
});

export const mammalOfAction: FeatureItem = makeFeat({
  name: "Mammal of Action",
  slug: "mammal-of-action",
  racial: true,
  prerequisites: "Mink race, as a platypus mink",
  description: "<p>You are a semiaquatic, egg-laying mammal of action. You’ve got more than just mad skills, you got a beaver tail and a bill. You gain the following benefits:</p><ul><li>Increase your Wisdom or Constitution score by 1, up to a maximum of 20.</li><li>You gain blindsight of 10ft.</li><li>You gain a swim speed equal to your movement speed.</li><li>Once per turn, when you hit a creature with your natural weapon, you can choose to envenom it. The target creature must make a Constitution Saving Throw, DC 8 + Your Constitution modifier + Your Proficiency Bonus. On a failed save, the creature becomes poisoned for one minute, repeating the saving throw at the end of each of their turns, ending the effect on a success.</li></ul>",
});

export const multipodVolley: FeatureItem = makeFeat({
  name: "Multipod Volley",
  slug: "multipod-volley",
  racial: true,
  prerequisites: "Multipod Fishman race",
  description: "<p>Having lived your entire life with multiple sets of limbs, you know a thing or two about attacking multiple times. You gain the following benefits:</p><ul><li>Increase your Dexterity score by 1, up to a maximum of 20.</li><li>Once per turn, when you hit with an offhand attack, you can make an additional offhand attack. You can use this feature twice, regaining all uses on a long rest.</li><li>You gain an additional object interaction action, rather than just one.</li></ul>",
});

export const nimbleLegs: FeatureItem = makeFeat({
  name: "Nimble Legs",
  slug: "nimble-legs",
  racial: true,
  prerequisites: "Longleg Human race",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You have gone through extensive training to make the most of your naturally long legs, allowing you to run faster and kick stronger. You gain the following benefits:</p><ul><li>Increase your Strength or Dexterity score by 1, up to a maximum of 20.</li><li>When you hit with an attack against a creature, you can use a bonus action to attempt to shove that target with your legs. The target must be within 5 feet of you and no more than one size larger than you. Unless it succeeds on a Strength saving throw against a DC equal to 8 + your proficiency bonus + your Strength or Dexterity modifier, you push it up to 10 feet away from you.</li><li>When you use your Sprint racial feature, you do not provoke opportunity attacks in this movement.</li></ul>",
});

export const ominousToxin: FeatureItem = makeFeat({
  name: "Ominous Toxin",
  slug: "ominous-toxin",
  racial: true,
  prerequisites: "Fishman or Merfolk race",
  description: "<p>Born as a particular type of poisonous fishman, you have been granted the ability to secrete a deadly toxin. You gain the following benefits:</p><ul><li>Increase your Constitution score by 1, up to a maximum of 20.</li><li>You have advantage on saving throws against poisons and effects that would leave you poisoned. You have resistance against poison damage.</li><li>Once per turn, you can apply poison to any bludgeoning, piercing, or slashing weapon as part of an attack. The target must succeed on a Constitution saving throw, DC 8 + Proficiency Bonus + Your Constitution Modifier, or take 2d4 poison damage, taking half damage on a success.</li><li>Any creature that that starts its turn in direct contact with your skin, via grappling or otherwise, must succeed on a Constitution saving throw against the same DC as your poison, or become poisoned for 1 minute, repeating the saving throw at the end of each of their turns, ending the effect on a success. A creature that succeeds this saving throw is immune to this effect for the next hour.</li></ul>",
});

export const pragmaticVanity: FeatureItem = makeFeat({
  name: "Pragmatic Vanity",
  slug: "pragmatic-vanity",
  racial: true,
  prerequisites: "Snakeneck Human race",
  description: "<p>Your pragmatic nature and your towering height has given a powerful sense of superiority. You gain the following benefits:</p><ul><li>Increase your Charisma or Intelligence score by 1, up to a maximum of 20.</li><li>You have advantage on saving throws against creations.</li><li>You know the Allure trick. You can use the Charm Person creation a number of times equal to half your proficiency bonus, regaining all uses on a long rest. Charisma or Intelligence is your creativity modifier for this ability.</li></ul>",
});

export const razorClaws: FeatureItem = makeFeat({
  name: "Razor Claws",
  slug: "razor-claws",
  racial: true,
  prerequisites: "Mink race, as a feline mink",
  description: "<p>Born with a retractable set of razor sharp claws, you have the perfect set of tools always at your disposal. You can cut, hack, and slash nearly all enemies in your wake. You gain the following benefits:</p><ul><li>Increase your Strength or Dexterity score by 1, up to a maximum of 20.</li><li>Your natural weapons become 1d8 piercing or slashing thanks to your razor sharp claws.</li><li>You gain a climbing speed equal to your walking speed thanks to your claws.</li><li>Your natural weapons count as Thieves’ Tools, of which you are now proficient. If you are already proficient, you gain expertise instead.</li></ul>",
});

export const renegadeRodent: FeatureItem = makeFeat({
  name: "Renegade Rodent",
  slug: "renegade-rodent",
  racial: true,
  prerequisites: "Mink race, as a rodent mink",
  activation: { type: "bonus", cost: 1 },
  description: "<p>Rodents are stealthy little creatures, able to slip away in the blink of an eye, either by climbing and being extremely lofty, able to avoid certain doom. You gain the following benefits:</p><ul><li>Increase your Dexterity or Charisma score by 1, up to a maximum of 20.</li><li>You gain proficiency in your choice of Dexterity (Acrobatics) or Dexterity (Stealth) checks. If you are already proficient in the chosen skill, you instead gain expertise.</li><li>You gain a climbing speed equal to your walking speed.</li><li>You can take the Disengage or Hide action as a bonus action.</li></ul>",
});

export const seaSovereignty: FeatureItem = makeFeat({
  name: "Sea Sovereignty",
  slug: "sea-sovereignty",
  racial: true,
  prerequisites: "Merfolk race",
  description: "<p>Merfolk are the monarchs of the sea, able to swim faster than any other fish, as well as communicate with various sea creatures. You, however, have mastered both of the advantages of your race. You gain the following benefits:</p><ul><li>Increase your Intelligence, Wisdom, or Charisma score by 1, up to a maximum of 20.</li><li>Your swimming speed increases by 10ft.</li><li>You can use the Animal Friend creation, using whichever ability score you increased with this feat, at will, but only against Beasts that have a natural swimming speed.</li></ul>",
});

export const serpentSPact: FeatureItem = makeFeat({
  name: "Serpent’s Pact",
  slug: "serpent-s-pact",
  racial: true,
  prerequisites: "Kuja, proficiency Wisdom (Animal Handling) checks",
  description: "<p>Having spent years on the shores of Amazon Lily, you have grown accustomed to the presence of snakes, even to the point of being able to call upon them from any location. You gain the following benefits:</p><ul><li>Increase your Dexterity or Strength score by 1, up to a maximum of 20.</li><li>You learn the Call Beast creation and can use it as a ritual using your Wisdom modifier. If you already have the Creativity feature, this creation is added to that creation list and you can use that creativity modifier for this creation. The creation doesn’t count against your number of creations known. This creation can only be used to summon a land beast, which gains the traits of the Snake Weapon from the Book of Beasts (linked on page 4 of this book) in addition to its normal traits.</li></ul>",
});

export const shandianMobility: FeatureItem = makeFeat({
  name: "Shandian Mobility",
  slug: "shandian-mobility",
  racial: true,
  prerequisites: "Shandian Sky Islander race",
  description: "<p>Being a Shandian has allowed you to make the most of your environment, maneuvering and escaping any unfavorable situation. You gain the following benefits:</p><ul><li>Increase your Strength, Dexterity, or Constitution score by 1, up to a maximum of 20.</li><li>Your movement speed is increased by 5ft, and your jump height is doubled.</li><li>You gain proficiency in either Acrobatics or Athletics. If you are already proficient, you gain expertise.</li><li>You have advantage on any Athletics or Acrobatics skill check to escape a grapple.</li></ul>",
});

export const skypieanCraft: FeatureItem = makeFeat({
  name: "Skypiean Craft",
  slug: "skypiean-craft",
  racial: true,
  prerequisites: "Skypiean Sky Islander race",
  description: "<p>Skypieans are excellent artisans due to enhancing their various techniques with their dials and techniques in their day-to-day lives. You gain the following benefits:</p><ul><li>Increase your Intelligence, Wisdom, or Charisma score by 1, up to a maximum of 20.</li><li>You gain proficiency in 2 skills or tools of your choice. You can also choose to give a skill or tool that you are already proficient in expertise.</li><li>Adding to your Artisan Dials feature, you learn three additional tricks of your choice from any of the creation lists. If you already have the creativity feature, these tricks are added to your creation list.</li></ul>",
});

export const slitheringShocks: FeatureItem = makeFeat({
  name: "Slithering Shocks",
  slug: "slithering-shocks",
  racial: true,
  prerequisites: "Fishman or Merfolk race, as an electric eel",
  activation: { type: "bonus", cost: 1 },
  description: "<p>As a living taser, you can unleash a concentrated blast of electricity to fry your foes, and slip away from the mayhem you have wrought. You gain the following benefits:</p><ul><li>Increase your Dexterity or Constitution score by 1, up to a maximum of 20.</li><li>You learn the Shocking Grasp trick. Constitution is your Creativity modifier for this trick. You can use this trick normally, or you can use it as a bonus action a number of times equal to your proficiency bonus per long rest. If you have the Creativity feature, this trick is added to that list, allowing you to use that creativity modifier instead.</li><li>You have advantage on checks and saving throws made to escape any grapples or restraints.</li></ul>",
});

export const steadfastScales: FeatureItem = makeFeat({
  name: "Steadfast Scales",
  slug: "steadfast-scales",
  racial: true,
  prerequisites: "Stronghide Fishman race",
  description: "<p>Your tough exterior makes you hard to take down. You gain the following benefits:</p><ul><li>Increase your Constitution score by 1, up to a maximum of 20.</li><li>Whenever you take the Dodge action in combat, you can spend one Hit Die to heal yourself. Roll the die, add your Constitution modifier, and regain a number of hit points equal to the total (minimum of 1).</li><li>You gain expertise in Athletics (Strength) skill checks.</li></ul>",
});

export const strongArms: FeatureItem = makeFeat({
  name: "Strong Arms",
  slug: "strong-arms",
  racial: true,
  prerequisites: "Longarm Human race",
  description: "<p>The power of your extra arm joints grants you extra leverage and strength in and out of combat. You gain the following benefits:</p><ul><li>Increase your Strength or Dexterity score by 1, up to a maximum of 20.</li><li>When you hit with an attack on your first turn in combat, the attack deals an extra 2d6 damage to it. You can use this ability only once per combat.</li><li>You count as one size larger when determining your carrying capacity and the weight you can push, drag, lift, and for grapple and shove attempts.</li></ul>",
});

export const syntheticNature: FeatureItem = makeFeat({
  name: "Synthetic Nature",
  slug: "synthetic-nature",
  racial: true,
  prerequisites: "Cyborg or Artificial Human Augmented race",
  uses: { max: "@prof", per: "lr" },
  description: "<p>Due to being a synthetic organism, you gain the ability to be repaired much like a machine. You gain the following benefits:</p><ul><li>Increase your Constitution score by 1, up to a maximum of 20.</li><li>You gain proficiency in one tool of your choice. If you are already proficient in that tool, you instead gain expertise.</li><li>When the Mend trick is used on you, you can spend one of your hit dice to regain a number of hit points equal to the number rolled + your Constitution modifier.</li><li>You can add a d4 to one attack roll, ability check, or saving throw you make, and you can do so after seeing the d20 roll but before the effects of the roll are resolved. You can use this trait a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.</li></ul>",
});

export const theHornedOne: FeatureItem = makeFeat({
  name: "The Horned One",
  slug: "the-horned-one",
  racial: true,
  prerequisites: "Any race that has horns",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You have a large set of horns growing out of your head, decorating your skull like a twisting crown. You gain the following benefits:</p><ul><li>Increase your Charisma or Constitution score by 1, up to a maximum of 20.</li><li>You gain proficiency in Charisma (Intimidation) checks. If you are already proficient, you instead gain expertise.</li><li>Your horns are natural melee weapons, which you can use to make unarmed strikes. If you hit with them, you deal piercing damage equal to 1d8, instead of the bludgeoning damage normal for an unarmed strike.</li><li>If you move at least 20 feet in a straight line towards a target, you can make one melee attack with your horns as a bonus action.</li></ul>",
});

export const toughOuterShell: FeatureItem = makeFeat({
  name: "Tough Outer Shell",
  slug: "tough-outer-shell",
  racial: true,
  prerequisites: "Stronghide Fishman or Merfolk race, as a crustacean",
  activation: { type: "reaction", cost: 1 },
  uses: { max: "@prof", per: "lr" },
  description: "<p>You have the ultimate defense in the form of a tough outer shell. You gain the following benefits:</p><ul><li>Increase your Strength or Constitution score by 1, up to a maximum of 20.</li><li>While you're not wearing armor, your armor class is calculated as 13 + your Dexterity modifier. You can use your natural armor to determine your AC if the armor you wear would leave you with a lower AC.</li><li>When you take damage, you can use your reaction to roll a d6. Add your proficiency bonus to the number rolled, and reduce the damage you take by an amount equal to that total (minimum of 0 damage). You can use this trait a number of times equal to your proficiency bonus. You regain all expended uses when you finish a long rest.</li></ul>",
});

export const undeadResolve: FeatureItem = makeFeat({
  name: "Undead Resolve",
  slug: "undead-resolve",
  racial: true,
  prerequisites: "Revived Augmented race",
  description: "<p>Given that you were already revived once, it is considerably easier to revive you again. You gain the following benefits:</p><ul><li>Increase your Wisdom or Constitution score by 1, up to a maximum of 20.</li><li>When any creation or feature that will restore you to life is used on you, and it costs material components, that cost is ignored.</li><li>You gain resistance to necrotic damage, and when you take necrotic damage, you gain 5 temporary hit points.</li><li>If damage reduces you to 0 hit points, you can make a Constitution saving throw with a DC of 5 + the damage taken, unless the damage is from a critical hit. On a success, you drop to 1 hit point instead.</li></ul>",
});

export const ursaMajor: FeatureItem = makeFeat({
  name: "Ursa Major",
  slug: "ursa-major",
  racial: true,
  prerequisites: "Mink race, as any bear mink",
  description: "<p>You are a powerful, unstoppable machine of nature. With a powerful build and the ability to climb and swim, none can hope to escape you. You gain the following benefits:</p><ul><li>Increase your Strength or Constitution score by 1, up to a maximum of 20.</li><li>You have advantage on Wisdom (Perception) checks that rely on smell.</li><li>You gain proficiency in Strength (Athletics) checks. If you are already proficient, you instead gain expertise.</li><li>You gain a swim and climb speed equal to your movement speed.</li><li>You count as one size larger when determining your carrying capacity and the weight you can push, drag, lift, and for grapple and shove attempts.</li></ul>",
});

export const waterWings: FeatureItem = makeFeat({
  name: "Water Wings",
  slug: "water-wings",
  racial: true,
  prerequisites: "Fishman or Merfolk race, as a ray",
  description: "<p>Your wide fins enable you to fly through the water with ease. You gain the following benefits:</p><ul><li>Increase your Dexterity or Constitution score by 1, up to a maximum of 20.</li><li>Your swimming speed increases by 10ft.</li><li>While in water, you do not provoke attacks of opportunity.</li><li>While grappling a target underwater that doesn’t have a natural swim speed, you may drag them your full movement speed. If you drag them downwards, they take 1d6 bludgeoning for every 10ft descended.</li></ul>",
});

export const racialFeats: FeatureItem[] = [
  allConsumingMaw,
  bioluminescence,
  birkanBattleTactics,
  buckToothed,
  crypticCamouflage,
  darkWingHunter,
  deadManSGrip,
  diminutiveDudgeon,
  electroExpert,
  enhancedCircuitry,
  enhancedEvolution,
  eyesOnThePrize,
  eyesOpen,
  feralThreat,
  fleetFooted,
  fuelEfficient,
  glidingSkin,
  hoovesInbound,
  holeyMoley,
  hulkingMonolith,
  humanFerocity,
  inkyDepths,
  intuitivePrimate,
  ironWilled,
  keenCanine,
  kujaAccuracy,
  lengthyHeritage,
  madeForWar,
  mammalOfAction,
  multipodVolley,
  nimbleLegs,
  ominousToxin,
  pragmaticVanity,
  razorClaws,
  renegadeRodent,
  seaSovereignty,
  serpentSPact,
  shandianMobility,
  skypieanCraft,
  slitheringShocks,
  steadfastScales,
  strongArms,
  syntheticNature,
  theHornedOne,
  toughOuterShell,
  undeadResolve,
  ursaMajor,
  waterWings,
];
