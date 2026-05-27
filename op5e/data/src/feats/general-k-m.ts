import { makeFeat } from "./_make-feat.js";
import type { FeatureItem } from "../../schemas/feature.js";

export const katanaMaster: FeatureItem = makeFeat({
  name: "Katana Master",
  slug: "katana-master",
  activation: { type: "reaction", cost: 1 },
  description: "<p>The long and elegant katana are a favored blade on the seas, able to dice all that comes its way. You gain the following benefits while wielding a katana or odachi:</p><ul><li>You gain a +1 bonus to attack rolls you make with katanas and odachis.</li><li>Once per turn, as part of making an attack with a Katana or Odachi, you can move 5ft without provoking opportunity attacks, provided your speed isn’t 0.</li><li>You gain a number of Ken Dice equal to your proficiency bonus. You regain all expended Ken Dice at the end of a short or long rest. These Ken Dice are d4s. You can use them in any of the following ways:</li><li>When you hit a creature with a Katana or Odachi, you can expend one of your Ken Dice to deal extra damage equal to one roll of your Ken Dice + your proficiency bonus.</li><li>As a reaction to being hit by a creature, you can expend one of your Ken Dice to increase your AC by an amount equal to one roll of your Ken Dice + your proficiency bonus.</li><li>Whenever you roll a 1 on any of the d4s of your katana or odachi’s damage rolls, you can treat those 1’s as a 2. Your Ken Dice also benefits from this feature.</li></ul>",
});

export const keenMind: FeatureItem = makeFeat({
  name: "Keen Mind",
  slug: "keen-mind",
  description: "<p>You have a mind with an uncanny knack for learning and keeping track of precise details. You gain the following benefits.</p><ul><li>Increase your Intelligence score by 1, to a maximum of 20.</li><li>You always know which way is north.</li><li>You always know the number of hours left before the next sunrise or sunset.</li><li>You can accurately recall anything you have seen or heard within a number of past months equal to your intelligence modifier (max 3 months).</li><li>You gain proficiency in one skill of your choice.</li></ul>",
});

export const knackOfTheAnalyst: FeatureItem = makeFeat({
  name: "Knack Of The Analyst",
  slug: "knack-of-the-analyst",
  activation: { type: "action", cost: 1 },
  description: "<p>You have a real knack for finding the truth, granting you the following benefits:</p><ul><li>Whenever you make an Intelligence (Investigation) or an Wisdom (Insight) check, you can roll a d4 and add the number rolled to the total ability check.</li><li>As an action, you can make an Intelligence (Investigation) or Wisdom (Insight) check against a creature’s Charisma (Deception). On a success, that creature’s attack rolls are made at disadvantage on attack rolls against a creature of your choice that is within 30 feet of you and can hear you.</li><li>You know the Guidance trick. You can use the Identification creation without expending a creation slot once per long rest. You can also use these creations with any creation slots you have, and are added to any creation list you have. Your creative ability for these creations is your choice of Intelligence, Wisdom, or Charisma (choose which when you gain this feat).</li></ul>",
});

export const knackOfTheBurglar: FeatureItem = makeFeat({
  name: "Knack Of The Burglar",
  slug: "knack-of-the-burglar",
  description: "<p>You have a real knack for avoiding detection, granting you the following benefits:</p><ul><li>Whenever you make a Dexterity (Sleight of Hand) or a Dexterity (Stealth) check, you can roll a d4 and add the number rolled to the total ability check.</li><li>If you fail a Dexterity (Sleight of Hand) or a Dexterity (Stealth) check, you can reroll, and you must choose the new roll. You regain this ability once per short or long rest.</li><li>You know the Temporary Trick trick. You can use the Fog Cloud creation without expending a creation slot once per long rest. You can also use these creations with any creation slots you have, and are added to any creation list you have. Your creative ability for these creations is your choice of Intelligence, Wisdom, or Charisma (choose which when you gain this feat).</li></ul>",
});

export const knackOfTheFool: FeatureItem = makeFeat({
  name: "Knack Of The Fool",
  slug: "knack-of-the-fool",
  activation: { type: "action", cost: 1 },
  description: "<p>You have a real knack for convincing and captivating people, granting you the following benefits:</p><ul><li>Whenever you make a Charisma (Persuasion) or a Charisma (Performance) check, you can roll a d4 and add the number rolled to the total ability check.</li><li>As an action, you can make Charisma (Persuasion) or Charisma (Performance) check against a creature Wisdom (Insight) that can see or hear you. If you succeed, you impose disadvantage on the next roll that creature makes.</li><li>You know the Shimmering Lights trick. You can use the Calm Emotions creation without expending a creation slot once per long rest. You can also use these creations with any creation slots you have, and are added to any creation list you have. Your creative ability for these creations is your choice of Intelligence, Wisdom, or Charisma (choose which when you gain this feat).</li></ul>",
});

export const knackOfTheHandler: FeatureItem = makeFeat({
  name: "Knack Of The Handler",
  slug: "knack-of-the-handler",
  activation: { type: "reaction", cost: 1 },
  description: "<p>You have a real knack for herding animals, granting you the following benefits:</p><ul><li>Whenever you make a Wisdom (Animal Handling) or an Intelligence (Nature) check, you can roll a d4 and add the number rolled to the total ability check.</li><li>When you are attacked by a beast, you can use your reaction to halve the damage and move 10ft in a direction of your choice without provoking opportunity attacks.</li><li>You know the Natural Arts trick. You can use the Speak with Animals creation without expending a creation slot once per long rest. You can also use these creations with any creation slots you have, and are added to any creation list you have. Your creative ability for these creations is your choice of Intelligence, Wisdom, or Charisma (choose which when you gain this feat).</li></ul>",
});

export const knackOfTheHunter: FeatureItem = makeFeat({
  name: "Knack Of The Hunter",
  slug: "knack-of-the-hunter",
  description: "<p>You have a real knack for hunting in any environment, granting you the following benefits:</p><ul><li>Whenever you make a Wisdom (Perception) or an Wisdom (Survival) check, you can roll a d4 and add the number rolled to the total ability check.</li><li>You gain darkvision of 60ft. If you already have darkvision, it is extended by 60ft.</li><li>You can use the Hunter’s Mark and Locate Creature creation without expending a creation slot once per long rest, each. You can also use these creations with any creation slots you have, and are added to any creation list you have. Your creative ability for these creations is your choice of Intelligence, Wisdom, or Charisma (choose which when you gain this feat).</li></ul>",
});

export const knackOfTheInventor: FeatureItem = makeFeat({
  name: "Knack Of The Inventor",
  slug: "knack-of-the-inventor",
  description: "<p>You have a real knack for crafting thanks to you extensive knowledge, granting you the following benefits:</p><ul><li>Whenever you make an Intelligence (Engineering) or an Intelligence (History) check, you can roll a d4 and add the number rolled to the total ability check.</li><li>If you fail a tool check of which you are proficient in, you can reroll, and you must choose the new roll. You can use this feature a number of times equal to your Intelligence modifier, regaining all uses at the end of a short or long rest.</li><li>You know the Mend trick. You can use the Advanced Weapon creation without expending a creation slot once per long rest. You can also use these creations with any creation slots you have, and are added to any creation list you have. Your creative ability for these creations is your choice of Intelligence, Wisdom, or Charisma (choose which when you gain this feat).</li></ul>",
});

export const knackOfTheNurse: FeatureItem = makeFeat({
  name: "Knack Of The Nurse",
  slug: "knack-of-the-nurse",
  description: "<p>You have a real knack for healing wounds, granting you the following benefits:</p><ul><li>Whenever you make a Wisdom (Medicine) or an Intelligence (Religion) check, you can roll a d4 and add the number rolled to the total ability check.</li><li>When you use a creation that restores hit points, you can add 1d4 to the amount of hit points restored. You can use this feature a number of times equal to your proficiency bonus per short or long rest.</li><li>You know the Stabilize trick. You can use the Cure Wounds creation without expending a creation slot once per long rest. You can also use these creations with any creation slots you have, and are added to any creation list you have. Your creative ability for these creations is your choice of Intelligence, Wisdom, or Charisma (choose which when you gain this feat).</li></ul>",
});

export const knackOfThePretender: FeatureItem = makeFeat({
  name: "Knack Of The Pretender",
  slug: "knack-of-the-pretender",
  description: "<p>You have a real knack for deception and escaping, granting you the following benefits:</p><ul><li>Whenever you make a Dexterity (Acrobatics) or a Charisma (Deception) check, you can roll a d4 and add the number rolled to the total ability check.</li><li>Your walking speed increases by 5ft, and you can use a Dexterity (Acrobatics) check to escape any restraints instead of a Strength (Athletics) check.</li><li>You know the Vicious Mockery trick. You can use the Disguise creation without expending a creation slot once per long rest. You can also use these creations with any creation slots you have, and are added to any creation list you have. Your creative ability for these creations is your choice of Intelligence, Wisdom, or Charisma (choose which when you gain this feat).</li></ul>",
});

export const knackOfTheWarrior: FeatureItem = makeFeat({
  name: "Knack Of The Warrior",
  slug: "knack-of-the-warrior",
  activation: { type: "reaction", cost: 1 },
  description: "<p>You have a real knack for getting for combat, granting you the following benefits:</p><ul><li>Whenever you make a Strength (Athletics) or a Charisma (Intimidation) check, you can roll a d4 and add the number rolled to the total ability check.</li><li>When a creature that you can see within 5ft of you is hit with an attack roll, you can use your reaction to swap places with the creature, and you are hit by the attack instead.</li><li>You know the Defending Ward trick. You can use the Shield creation without expending a creation slot once per long rest. You can also use these creations with any creation slots you have, and are added to any creation list you have. Your creative ability for these creations is your choice of Strength, or Dexterity (choose which when you gain this feat).</li></ul>",
});

export const lanceMaster: FeatureItem = makeFeat({
  name: "Lance Master",
  slug: "lance-master",
  prerequisites: "Proficiency with a lance",
  description: "<p>The lance is an unwieldy weapon for most, but you have mastered the use of it. You gain the following benefits:</p><ul><li>You gain a +1 bonus to attack rolls you make with lances.</li><li>Whenever you have advantage on a melee attack roll you make with a lance and hit, you can knock the target prone if the lower of the two d20 rolls would also hit the target.</li><li>You don't have disadvantage when attacking a creature within 5ft of you with attacks made with a lance.</li><li>If you move at least 20 feet in a straight line immediately before making an attack with a lance, you either gain a +5 bonus to the attack's damage roll or push the target up to 10 feet away from you on your first lance attack this turn.</li></ul>",
});

export const lightArmorMaster: FeatureItem = makeFeat({
  name: "Light Armor Master",
  slug: "light-armor-master",
  prerequisites: "3",
  description: "<p>You know how best to use the thin armor that protects</p><p>you.</p><ul><li>Increase your Dexterity score by 1, to a maximum of 20.</li><li>Your speed increases by 5 feet while wearing light or no armor.</li><li>While wearing light armor, you gain a +1 bonus to your armor class whenever you are at least 20 feet from where you started your turn. This bonus lasts until the start of your next turn.</li></ul>",
});

export const longswordMaster: FeatureItem = makeFeat({
  name: "Longsword Master",
  slug: "longsword-master",
  description: "<p>You master the art of greatswords and longswords, able to utilize their long blade to its maximum potential. You gain the following benefits while wielding a longsword or greatsword:</p><ul><li>You gain a +1 bonus to attack rolls you make with longswords and greatswords.</li><li>Longswords and greatswords you wield have the reach property.</li><li>When you reduce a creature to 0 hit points with a longsword or a greatsword, and have left over damage, you can choose to inflict the remaining damage to another creature within the reach of your longsword or greatsword.</li><li>When a creature hits you with an attack, when you are wielding a longsword or greatsword, you gain a +1 bonus to AC against all subsequent attacks made by that creature for the rest of the turn.</li></ul>",
});

export const lucky: FeatureItem = makeFeat({
  name: "Lucky",
  slug: "lucky",
  description: "<p>You have inexplicable luck that seems to kick in at just the right moment.</p><p>You have 3 luck points. Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20. You can choose to spend one of your luck points after you roll the die, but before the outcome is determined. You choose which of the d20s is used for the attack roll, ability check, or saving throw.</p><p>You can also spend one luck point when an attack roll is made against you. Roll a d20 and then choose whether the attack uses the attacker's roll or yours.</p><p>If more than one creature spends a luck point to influence the outcome of a roll, the points cancel each other out; no additional dice are rolled.</p><p>You regain your expended luck points when you finish a long rest.</p>",
});

export const martialAdept: FeatureItem = makeFeat({
  name: "Martial Adept",
  slug: "martial-adept",
  description: "<p>You have martial training that allows you to perform special combat maneuvers. You gain the following benefits.</p><ul><li>You learn two maneuvers of your choice from among those available to the Battle Master archetype in the fighter class. If a maneuver you use requires your target to make a saving throw to resist the maneuver's effects, the saving throw DC equals 8 + your proficiency bonus + your Strength or Dexterity modifier (your choice).</li><li>You gain two superiority dice, which are d8s (these dice are added to any superiority dice you have from another source, so for example if you are a Battle Master Fighter with d10s, these dice become d10s as well). These dice are used to fuel your maneuvers. A superiority die is expended when you use it. You regain your expended superiority dice when you finish a short or long rest.</li></ul>",
});

export const masterAlchemist: FeatureItem = makeFeat({
  name: "Master Alchemist",
  slug: "master-alchemist",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You have been trained to use Alchemist tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Alchemist tools, or expertise if you were already proficient.</li><li>You can increase the potency of healing potions or poison, adding your level to the resulting healing or damage if you succeed a DC 15 Alchemist tools check. On a failure, you cannot improve the formula of that specific potion.</li><li>As a bonus action, you can identify one potion within 5 feet of you, as if you had tasted it. You must see the liquid for this benefit to work.</li></ul>",
});

export const masterAppraiser: FeatureItem = makeFeat({
  name: "Master Appraiser",
  slug: "master-appraiser",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You have been trained to use Appraiser’s tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Appraisers, or expertise if you were already proficient.</li><li>You have advantage on Intelligence (History) checks made to identify key information surrounding an item’s historical significance. Additionally, you can appraise a devil fruit or devil fruit user to determine its type and ability.</li><li>As a bonus action, you can identify the value in berries of any object. Certain objects, such one of a kind objects, or items with minimal value may not have a defined price.</li></ul>",
});

export const masterBrewer: FeatureItem = makeFeat({
  name: "Master Brewer",
  slug: "master-brewer",
  description: "<p>You have been trained to use Brewer’s tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Constitution score by 1, to a maximum of 20.</li><li>You gain proficiency in Brewers tools, or expertise if you were already proficient.</li><li>The time and cost it takes for you to craft alcohol is halved.</li><li>All alcoholic drinks you make grant a number of temporary hit points to the drinker equal to twice your proficiency bonus.</li></ul>",
});

export const masterCalligrapher: FeatureItem = makeFeat({
  name: "Master Calligrapher",
  slug: "master-calligrapher",
  description: "<p>You have been trained to use Calligraphy tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Calligrapher's tools, or expertise if you were already proficient.</li><li>You can flawlessly recreate any handwriting you have seen.</li><li>You can perfectly recall any written text you have seen in the past 6 months.</li></ul>",
});

export const masterCarpenter: FeatureItem = makeFeat({
  name: "Master Carpenter",
  slug: "master-carpenter",
  activation: { type: "action", cost: 1 },
  description: "<p>You have been trained to use Carpenter’s tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Carpenter’s tools, or expertise if you were already proficient.</li><li>You can use the Construct Hut or Construct Boat creation, each without using a creation slot, once per long rest. This creation uses the stat you increased with this feat. These creations are added to any creation list you have.</li><li>As an action, you can use wooden materials to reinforce a 10 x 10 door, window, or wall, increasing the DC to break it by 5, to a maximum of 30. These reinforcements last 8 hours.</li></ul>",
});

export const masterCartographer: FeatureItem = makeFeat({
  name: "Master Cartographer",
  slug: "master-cartographer",
  description: "<p>You have been trained to use Carpenter’s tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Cartographer’s tools, or expertise if you were already proficient.</li><li>You can recall and recreate any map you have seen. Additionally, you cannot get lost by normal means.</li><li>You always know which way is north, and you can immediately detect any weather-related events within a two mile radius of yourself.</li></ul>",
});

export const masterCobbler: FeatureItem = makeFeat({
  name: "Master Cobbler",
  slug: "master-cobbler",
  description: "<p>You have been trained to use Cobbler’s tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Cobbler’s tools, or expertise if you were already proficient.</li><li>Any shoes you have made or altered ignore difficult terrain from snow, rocks, ice, mud, or sand.</li><li>The time and cost it takes for you to create shoes are halved.</li></ul>",
});

export const masterFisherman: FeatureItem = makeFeat({
  name: "Master Fisherman",
  slug: "master-fisherman",
  description: "<p>You have been trained to use Fishing Tackle, gaining the following benefits:</p><ul><li>Increase your Wisdom or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Fishing Tackle, or expertise if you were already proficient.</li><li>If you have access to a body of water that sustains marine life, you can maintain a moderate lifestyle while working as a fisherman, and you can catch enough food to feed yourself and up to ten other people each day.</li><li>You can wield your Fishing Tackle as a whip.</li></ul>",
});

export const masterForger: FeatureItem = makeFeat({
  name: "Master Forger",
  slug: "master-forger",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You have been trained to use Forgery tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Charisma score by 1, to a maximum of 20.</li><li>You gain proficiency in Forgery tools, or expertise if you were already proficient.</li><li>As a bonus action, you can quickly make a single page, forged document if you have the materials on hand. DC 8 + you Forgery Tool Check Modifier</li><li>You have advantage on checks to determine if a document has been forged, and creatures have disadvantage on checks to determine any document you have forged was forged.</li></ul>",
});

export const masterGlassblower: FeatureItem = makeFeat({
  name: "Master Glassblower",
  slug: "master-glassblower",
  description: "<p>You have been trained to use Glassblower’s tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Glassblower’s tools, or expertise if you were already proficient.</li><li>Your weapon attacks gain the Siege property against any glass object or structure.</li><li>The time and cost it takes for you to create glass items such as lenses, bottles, and fiberglass are halved.</li></ul>",
});

export const masterHerbalist: FeatureItem = makeFeat({
  name: "Master Herbalist",
  slug: "master-herbalist",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You have been trained to use Herbalism tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Herbalism tools, or expertise if you were already proficient.</li><li>As a bonus action, you can consume or give another creature within touch range a potion, or other consumable.</li><li>Creating medicines costs half as much and takes half as much time to craft.</li></ul>",
});

export const masterJeweler: FeatureItem = makeFeat({
  name: "Master Jeweler",
  slug: "master-jeweler",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You have been trained to use Jeweler’s tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Jeweler's tools, or expertise if you were already proficient.</li><li>As a bonus action, you can identify the type, value, and properties of any gemstone within 5ft of you.</li><li>The time and cost it takes for you to create jewelry are halved.</li></ul>",
});

export const masterLeatherworker: FeatureItem = makeFeat({
  name: "Master Leatherworker",
  slug: "master-leatherworker",
  activation: { type: "action", cost: 1 },
  description: "<p>You have been trained to use Leatherworker’s tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Leatherworker’s tools, or expertise if you were already proficient.</li><li>As an action, you can fully skin a creature’s corpse.</li><li>Crafting and altering an item made from leather has its time and cost reduced by half.</li></ul>",
});

export const masterMason: FeatureItem = makeFeat({
  name: "Master Mason",
  slug: "master-mason",
  description: "<p>You have been trained to use Mason’s tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Mason’s tools, or expertise if you were already proficient.</li><li>Your weapon attacks gain the Siege property against any object or structure made of stone and other stone adjacent material.</li><li>The amount of time and cost it takes to make a stone construction is halved.</li></ul>",
});

export const masterNavigator: FeatureItem = makeFeat({
  name: "Master Navigator",
  slug: "master-navigator",
  description: "<p>You have been trained to use Navigator’s tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Navigator’s tools, or expertise if you were already proficient.</li><li>You can recall the exact directions from one location you have been in relation to another location you have been, as long as you have been consistently conscious for the journey.</li><li>You have advantage on saving throws related to weather based phenomenon.</li></ul>",
});

export const masterOfDisguise: FeatureItem = makeFeat({
  name: "Master of Disguise",
  slug: "master-of-disguise",
  activation: { type: "action", cost: 1 },
  description: "<p>You have honed your ability to shape your personality and to read the personalities of others. You gain the following benefits:</p><ul><li>Increase your Charisma score by 1, to a maximum of 20.</li><li>You gain proficiency with the disguise kit. If you are already proficient with it, you gain Expertise in it.</li><li>If you spend 1 hour observing a creature, you can then spend 8 hours crafting a disguise you can quickly don to mimic that creature. Making the disguise requires a disguise kit. You must make checks as normal to disguise yourself, but you can assume the disguise as an action.</li></ul>",
});

export const masterOfGames: FeatureItem = makeFeat({
  name: "Master of Games",
  slug: "master-of-games",
  description: "<p>You’ve whiled away hours and days in the strategies of playing cards, board games, or other kinds of rules-</p><p>bound activities. You gain the following benefits:</p><ul><li>Your Intelligence, Wisdom, or Charisma score increases by 1, to a maximum of 20.</li><li>You gain proficiency in three gaming sets of your choice and expertise for one of those sets of your choice.</li><li>If you are playing against an opponent that you have lost against within 1 month, you can add a 1d6 to any checks made for the first game played against them since you last lost.</li><li>If you are introduced to a new game, you gain proficiency in it after 8 hours total spent playing.</li></ul>",
});

export const masterPainter: FeatureItem = makeFeat({
  name: "Master Painter",
  slug: "master-painter",
  description: "<p>You have been trained to use Painter’s tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Charisma score by 1, to a maximum of 20.</li><li>You gain proficiency in Painter’s tools, or expertise if you were already proficient.</li><li>You can tell if a painting is an original or a copy, as well as its value in berries, and any important and well known information about the painting and the painter.</li><li>The amount of time and cost it takes to draw or paint something is halved.</li></ul>",
});

export const masterPotter: FeatureItem = makeFeat({
  name: "Master Potter",
  slug: "master-potter",
  description: "<p>You have been trained to use Pottery tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Potters tools, or expertise if you were already proficient.</li><li>During a long rest, you can craft an exceptionally deep pot. This pot has an interior space considerably larger than its outside dimensions, roughly 2 feet in diameter at the mouth and 4 feet deep. The pot can hold up to 500 pounds, not exceeding a volume of 64 cubic feet. The pot weighs 15 pounds, regardless of its contents. Retrieving an item from the pot requires an action. If the pot is overloaded or broken, it ruptures and is destroyed, spilling its contents on the floor. This pot remains until you make another one, or if it's destroyed.</li><li>The amount of time and cost it takes to make, repair, or alter pottery is halved.</li></ul>",
});

export const masterSmith: FeatureItem = makeFeat({
  name: "Master Smith",
  slug: "master-smith",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You have been trained to use Smither’s tools, gaining the following benefits:</p><ul><li>Increase your Strength or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Smiths tools, or expertise if you were already proficient.</li><li>As a bonus action, you can inspect a forged weapon or armor within 5ft of you, learning its value in berries, its materials, and any properties it may have.</li><li>The amount of time and cost it takes to make forged weapons and armor is halved.</li></ul>",
});

export const masterTinkerer: FeatureItem = makeFeat({
  name: "Master Tinkerer",
  slug: "master-tinkerer",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You have been trained to use Tinker’s tools, gaining the following benefits:</p><ul><li>Increase your Dexterity or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Tinkers tools, or expertise if you were already proficient.</li><li>As a bonus action, you can attempt to tamper with a creature’s weapon, armor, or creative focus. You make a Tinker tools check against the creature’s Dexterity (Acrobatics) or Strength (Athletics). On a success, you place a -1 penalty on attack and damage rolls if you tampered a weapon, -1 to AC if you tamper armor, or -1 to creation attack rolls and save DCs until the creature takes a long rest to repair it. On failure, the item cannot be tampered by you in this way for an hour.</li><li>The amount of time and cost it takes to craft and tinker with items is halved.</li></ul>",
});

export const masterWeaver: FeatureItem = makeFeat({
  name: "Master Weaver",
  slug: "master-weaver",
  description: "<p>You have been trained to use Weaver’s tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Weavers tools, or expertise if you were already proficient.</li><li>You can temporarily enhance an outfit, making the wearing have more of a presence. You touch an outfit over the course of a short or long rest. Until the creature’s next rest, or until you use this feature on another set of clothes, the wearer has advantage on your choice of Charisma (Persuasion), Charisma (Intimidation), Charisma (Performance), or Charisma (Deception) checks.</li><li>The amount of time and cost it takes to make and mend clothes is halved.</li></ul>",
});

export const masterWoodcarver: FeatureItem = makeFeat({
  name: "Master Woodcarver",
  slug: "master-woodcarver",
  description: "<p>You have been trained to use Woodcarver’s tools, gaining the following benefits:</p><ul><li>Increase your Wisdom or Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Woodcarver’s tools, or expertise if you were already proficient.</li><li>Wooden objects you create have resistance to bludgeoning, piercing, and slashing damage.</li><li>The amount of time and cost it takes to make and repair wooden objects is halved.</li></ul>",
});

export const mediumArmorMaster: FeatureItem = makeFeat({
  name: "Medium Armor Master",
  slug: "medium-armor-master",
  prerequisites: "Proficiency with medium armor",
  description: "<p>You have practiced moving in medium armor to gain the following benefits:</p><ul><li>Increase your Dexterity or Constitution score by 1, to a maximum of 20.</li><li>Wearing medium armor doesn't impose disadvantage on your Dexterity (Stealth) checks.</li><li>When you wear medium armor, you can add 3, rather than 2, to your AC if you have a Dexterity of 16 or higher.</li></ul>",
});

export const menacing: FeatureItem = makeFeat({
  name: "Menacing",
  slug: "menacing",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You become fearsome to others, gaining the following benefits:</p><ul><li>Increase your Charisma score by 1, to a maximum of 20.</li><li>You gain proficiency in the Intimidation skill. If you are already proficient in the skill, you gain Expertise in it.</li><li>Once per turn, as a bonus action, or in the place of an attack from the attack action, you can attempt to demoralize one creature you can see within 30 feet of you that can see and hear you. Make a Charisma (Intimidation) check contested by the target's Wisdom (Insight) check. If your check succeeds, the target is frightened until the end of your next turn. If your check fails, the target can't be frightened by you in this way for 1 hour.</li></ul>",
});

export const mobile: FeatureItem = makeFeat({
  name: "Mobile",
  slug: "mobile",
  description: "<p>You are exceptionally speedy and light on your feet. You gain the following benefits:</p><ul><li>Your speed increases by 10 feet.</li><li>When you use the Dash action, difficult terrain doesn't cost extra movement on that turn.</li><li>When you make a melee attack against a creature, you don't provoke opportunity attacks from that creature for the rest of the turn, whether you hit or not.</li></ul>",
});

export const mountedCombatant: FeatureItem = makeFeat({
  name: "Mounted Combatant",
  slug: "mounted-combatant",
  description: "<p>You are a dangerous foe to face while mounted. While you are mounted and aren't incapacitated, you gain the following benefits:</p><ul><li>You have advantage on melee attack rolls against unmounted creatures that are smaller than your mount.</li><li>You can force an attack targeted at your mount to target you instead.</li><li>If your mount is subjected to an effect that allows it to make a Dexterity save to take only half damage, it takes no damage if it succeeds and half damage if it fails.</li></ul>",
});

export const musician: FeatureItem = makeFeat({
  name: "Musician",
  slug: "musician",
  prerequisites: "Proficiency with a musical instrument",
  description: "<p>You are a practiced musician, granting you the  following benefits:</p><ul><li>You gain Expertise in all Musical Instruments that you are proficient in.</li><li>As you finish\ta Short\t Rest or a Long Rest, you can play a\tsong on a Musical Instrument with which you have Tool Proficiency and give Inspiration to 6 allies who hear the song, which can include yourself.</li></ul>",
});

export const generalKMFeats: FeatureItem[] = [
  katanaMaster,
  keenMind,
  knackOfTheAnalyst,
  knackOfTheBurglar,
  knackOfTheFool,
  knackOfTheHandler,
  knackOfTheHunter,
  knackOfTheInventor,
  knackOfTheNurse,
  knackOfThePretender,
  knackOfTheWarrior,
  lanceMaster,
  lightArmorMaster,
  longswordMaster,
  lucky,
  martialAdept,
  masterAlchemist,
  masterAppraiser,
  masterBrewer,
  masterCalligrapher,
  masterCarpenter,
  masterCartographer,
  masterCobbler,
  masterFisherman,
  masterForger,
  masterGlassblower,
  masterHerbalist,
  masterJeweler,
  masterLeatherworker,
  masterMason,
  masterNavigator,
  masterOfDisguise,
  masterOfGames,
  masterPainter,
  masterPotter,
  masterSmith,
  masterTinkerer,
  masterWeaver,
  masterWoodcarver,
  mediumArmorMaster,
  menacing,
  mobile,
  mountedCombatant,
  musician,
];
