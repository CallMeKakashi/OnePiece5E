import { makeFeat } from "./_make-feat.js";
import type { FeatureItem } from "../../schemas/feature.js";

export const acrobat: FeatureItem = makeFeat({
  name: "Acrobat",
  slug: "acrobat",
  activation: { type: "bonus", cost: 1 },
  uses: { max: "@prof", per: "sr" },
  description: "<p>You become more nimble, gaining the following benefits:</p><ul><li>Increase your Dexterity score by 1, to a maximum of 20.</li><li>You gain proficiency in the Acrobatics skill. If you are already proficient in the skill, you gain Expertise in it.</li><li>You can make a Dexterity (Acrobatics) check instead of a Strength (Athletics) for grappling.</li><li>As a bonus action, you can jump a number of feet equal to five times your proficiency bonus, without provoking opportunity attacks. You can use this feature only if your speed is greater than 0. You can use it a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a short or long rest.</li></ul>",
});

export const adeptInspiration: FeatureItem = makeFeat({
  name: "Adept Inspiration",
  slug: "adept-inspiration",
  prerequisites: "Charisma 13 or higher",
  description: "<p>Inspiration is your weapon, use it to strike the flames in the hearts of your allies so they may charge toward glory alongside you. You gain the following benefits:</p><ul><li>You gain proficiency in one musical instrument of your choice.</li><li>You gain 2 uses of Bardic Inspiration as defined in the bard class. The Bardic Inspiration die is a d6 (These dice are added to any Bardic Inspiration dice you have from another source, so for example if you are a Bard with d10s, these dice become d10s as well). You regain these uses when you finish a long rest, or on a short rest if you possess the Font of Inspiration feature.</li><li>Choose one skill in which you are already proficient. Your proficiency bonus is doubled for any ability check you make that uses the chosen proficiency.</li></ul>",
});

export const adeptModifier: FeatureItem = makeFeat({
  name: "Adept Modifier",
  slug: "adept-modifier",
  description: "<p>You are an expert at modifying mechanically enhanced items. You gain the following benefits:</p><ul><li>You gain proficiency in thieves' tools or one type of artisan's tool of your choice. You can use that chosen tool as a creation focus.</li><li>You learn two mods from the gadgeteer mod list. If the mods have a prerequisite of any kind, you can only choose those mods if you're a gadgeteer who meets the prerequisite. You have a limit of 1; if you're a gadgeteer, this is in addition to your existing limit. Additionally, the mods do not count to your mods known.</li></ul>",
});

export const alert: FeatureItem = makeFeat({
  name: "Alert",
  slug: "alert",
  description: "<p>You are always on the lookout for danger, you gain the following benefits:</p><ul><li>Increase your Dexterity or Wisdom score by 1, to a maximum of 20.</li><li>You can’t be surprised while you are conscious.</li><li>You gain a +5 bonus to initiative.</li><li>Other creatures don’t gain advantage on attack rolls against you as a result of being unseen by you.</li></ul>",
});

export const axeMastery: FeatureItem = makeFeat({
  name: "Axe Mastery",
  slug: "axe-mastery",
  prerequisites: "Proficiency with handaxes, battleaxes, greataxes, or halberds",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You master the handaxe, battleaxe, greataxe, and halberd. You gain the following benefits when using any of them:</p><ul><li>You gain a +1 bonus to attack rolls you make with the weapon.</li><li>Your weapon attacks made with handaxe, battleaxe, greataxe, or halberd, score a critical hit on a roll of 19 or 20.</li><li>If you take the attack action while wielding those weapons and the opponent wields a shield, you can use a bonus action to try to hook the shield apart. You and the affected enemy do an Athletics check. If the enemy loses the contest, they are disarmed of their Shield and it falls at its feet.</li><li>You gain the Siege property against any targets made out of wood.</li></ul>",
});

export const barbarianAdept: FeatureItem = makeFeat({
  name: "Barbarian Adept",
  slug: "barbarian-adept",
  activation: { type: "bonus", cost: 1 },
  uses: { max: "2", per: "lr" },
  description: "<p>You fight with powerful and reckless abandon, able to smash through any challenge. You gain the following benefits:</p><ul><li>Increase your Strength or Constitution by 1, to a maximum of 20.</li><li>As a bonus action, you can enter a fighting frenzy that lasts until the start of your next turn. During this frenzy, your weapon attacks made with Strength deal an additional 2 damage, and you gain a +2 bonus to Strength checks and saving throws. You can use this feature two times, regaining all uses at the end of a long rest.</li><li>When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.</li></ul>",
});

export const battleCreator: FeatureItem = makeFeat({
  name: "Battle Creator",
  slug: "battle-creator",
  prerequisites: "The ability to use at least one creation",
  activation: { type: "reaction", cost: 1 },
  description: "<p>You have practiced using creations amid combat, learning Techniques that grant you the following benefits:</p><ul><li>You have advantage on Constitution saving throws that you make to maintain your concentration on a creation when you take damage.</li><li>You can perform the somatic components of creation even when you have weapons or a shield in one or both hands.</li><li>As an opportunity attack, you can use your reaction to use a creation at the creature, rather than making an opportunity attack. The creation must have a usage time of 1 action and must target only that creature.</li></ul>",
});

export const bearyBlue: FeatureItem = makeFeat({
  name: "Beary Blue",
  slug: "beary-blue",
  description: "<p>Through despair, you worry about the worst to come, but that same worry is your strength, allowing you to succeed when you least expect it. You gain 3 negativity dice and you regain all spent negativity dice when you finish a short or long rest. If you critically fail, you regain 1 negativity die. Your negativity dice are d6s. You can roll only one negativity die per turn, and a blue die is spent when you roll it.</p><p>You can use negativity dice in any of the following ways:</p><ul><li>When you fail a saving throw, you can spend one of your negativity dice to roll it and add it to the total, potentially turning it into a success.</li><li>When you would roll a death save you can spend one of your negativity dice to roll it and add it to the total, potentially turning it into a success. If the result becomes 20 or higher due to the roll of the negativity die, you return to 1 hit point.</li><li>When you make a skill or tool check, you can spend one of your negativity dice to roll it and add it to the total.</li></ul>",
});

export const blowgunExpert: FeatureItem = makeFeat({
  name: "Blowgun Expert",
  slug: "blowgun-expert",
  prerequisites: "Proficiency with blowguns",
  description: "<p>You attack from the shadows of bush and reed and silently pass by the corpses you leave. You gain the following benefits:</p><ul><li>You gain a +1 bonus to attack rolls you make with blowguns.</li><li>When you wield a blowgun, its damage die is increased by one size (i.e. 1d4 => 1d6).</li><li>You ignore the loading property of blowguns.</li><li>When you have successfully taken the hide action, you do not give away your position when making an attack with your blowgun, regardless of whether or not the attack hits.</li></ul>",
});

export const bowMastery: FeatureItem = makeFeat({
  name: "Bow Mastery",
  slug: "bow-mastery",
  prerequisites: "Proficiency with shortbows or longbows",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You've mastered the bow, granting you the following benefits with the shortbow and longbow:</p><ul><li>You gain a +1 bonus to attack rolls you make with shortbows and longbows.</li><li>When you wield a shortbow or longbow, its damage die is increased by one size (i.e. 1d6 => 1d8 => 1d10).</li><li>When you make an attack with a shortbow or longbow, if you haven't moved this turn, you may expend all of your movement to make an additional ranged weapon attack as a bonus action.</li><li>When a hostile creature within 30 feet of you that you can see attacks a creature, other than yourself, you may use your reaction to make one ranged weapon attack against them with your bow.</li></ul>",
});

export const brave: FeatureItem = makeFeat({
  name: "Brave",
  slug: "brave",
  activation: { type: "bonus", cost: 1 },
  description: "<p>Through the trials and tribulations, you stand tall, undaunted. Fear may latch on hard, but you will power through its icy grip. You gain the following benefits.</p><ul><li>Increase your Wisdom or Charisma score by 1, to a maximum of 20.</li><li>You have advantage on any saving throw against any effect that would make you frightened. Additionally, while you are under the effects of the frightened condition, you can move towards your source of fear.</li><li>As a reaction to a friendly creature being targeted by an attack, you can move half your movement speed towards the creature. If you are within 5ft of the creature, you can choose to instead become the target of the attack.</li><li>As a bonus action, you can expend one of your hit dice to gain a number temporary hit points equal to 1 roll of your hit die + your Constitution modifier.</li></ul>",
});

export const brawny: FeatureItem = makeFeat({
  name: "Brawny",
  slug: "brawny",
  description: "<p>You become stronger, gaining the following benefits:</p><ul><li>Increase your Strength score by 1, to a maximum of 20.</li><li>You gain proficiency in the Athletics skill. If you are already proficient in the skill, you gain Expertise in it.</li><li>You count as one size larger when determining your carrying capacity and the weight you can push, drag, lift, and for grapple and shove attempts.</li><li>When you are prone, standing up uses only 5 feet of your movement.</li><li>You gain a climbing speed equal to your movement speed.</li><li>You can make a running long jump or a running high jump after moving only 5 feet on foot, rather than 10 feet.</li></ul>",
});

export const bulwark: FeatureItem = makeFeat({
  name: "Bulwark",
  slug: "bulwark",
  description: "<p>Your shield makes you a moving wall. You gain the following benefits while you are wielding a shield:</p><ul><li>Each ally within 5 feet of you that doesn't have this feat gains half cover while you aren't incapacitated or prone.</li><li>When you move on your turn, you can allow an ally within 5 feet of you that isn't incapacitated and doesn't have a speed of 0 to accompany you. The chosen ally can move with you (no action required), staying within 5 feet of you when possible, but you can't move more than half your speed during the turn.</li></ul>",
});

export const burglar: FeatureItem = makeFeat({
  name: "Burglar",
  slug: "burglar",
  description: "<p>You pride yourself on your quickness and your close study of robbery and infiltrating trapped rooms. You gain the following benefits:</p><ul><li>Increase your Dexterity score by 1, to a maximum of 20.</li><li>You gain proficiency with thieves' tools. If you are already proficient with them, you gain Expertise in them.</li><li>You can use thieves' tools to improve a lock's DC by a number equal to your proficiency bonus with a successful tool check.</li><li>You have advantage on Wisdom (Perception) and Intelligence (Investigation) checks made to detect the presence of secret doors, containers, and traps; and on saving throws made to avoid or resist traps.</li></ul>",
});

export const caneMaster: FeatureItem = makeFeat({
  name: "Cane Master",
  slug: "cane-master",
  prerequisites: "Proficiency with quarterstaffs",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You have mastered the martial arts of the staff, able to use them like an extension of your own arm. You gain the following benefits while wielding a quarterstaff:</p><ul><li>You gain a +1 bonus to attack rolls you make with quarterstaffs.</li><li>Any quarterstaff you wield has the finesse property for you.</li><li>When you wield a quarterstaff, its damage die is increased by one size (i.e. 1d6 => 1d8 in one hand, and 1d8 => 1d10 while held with two hands).</li><li>As a bonus action, you can use your quarterstaff as a pole to vault yourself, you leap a number of feet up to half your movement speed in a direction you can see.</li></ul>",
});

export const cannonMaster: FeatureItem = makeFeat({
  name: "Cannon Master",
  slug: "cannon-master",
  prerequisites: "Proficiency with cannons, Dexterity of 13",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You know your way around a cannon. You gain the following benefits:</p><ul><li>Increase your Dexterity score by 1, to a maximum of 20.</li><li>The Cannon Save DC of any cannon you use is now 8 + The Ability Score Modifier that that you used to make the attack + Your Proficiency Bonus, unless the DC was already higher.</li><li>You can Clean and Reload a cannon as a bonus action, as if you had used your action. For example, using Cleaning and Reloading a cannon that costs two actions, you can use both your action and bonus action to satisfy those conditions, making the cannon ready to be fired again.</li></ul>",
});

export const caring: FeatureItem = makeFeat({
  name: "Caring",
  slug: "caring",
  description: "<p>It is your duty and pleasure to help those in need. You gain 3 care dice and you regain all spent care dice when you finish a short or long rest. If you see one of your allies get hit by a critical hit, you regain 1 care die. Your care dice are d6s. You can roll only one care die per turn, and a care die is spent when you roll it.</p><p>You can use care dice in any of the following ways:</p><ul><li>When you restore hit points to a creature, you can roll a care die and add the result to the total hit points regained.</li><li>When you restore hit points to a creature, you can give the creature an amount of temporary hit points equal to your level.</li><li>When you make a Charisma (Persuasion) check, spend one care die and add the roll to your check.</li></ul>",
});

export const chainsmoker: FeatureItem = makeFeat({
  name: "Chainsmoker",
  slug: "chainsmoker",
  activation: { type: "bonus", cost: 1 },
  description: "<p>A quick puff a smoke and you’re ready to rumble, instilling you with the confidence necessary to beat out the competition. You gain the following benefits:</p><ul><li>Increase your Wisdom or Charisma score by 1, to a maximum of 20.</li><li>You gain proficiency in Herbalism tools.</li><li>As a bonus action, you can take a calming puff of smoke, adding a 1d4 bonus to your next skill check. You can use this ability a number of times equal to your proficiency bonus. You regain all uses of this ability at the end of a long rest.</li><li>You know the Fog Cloud creation using either your Wisdom or Charisma score. If you have the Creativity feature, Fog Cloud is added to your creation lists, allowing you to use your creativity ability modifier for it. You can use Fog Cloud without expending a creation slot twice, regaining all uses on a long rest.</li></ul>",
});

export const charger: FeatureItem = makeFeat({
  name: "Charger",
  slug: "charger",
  description: "<p>You can run down the enemy. You gain the following benefits:</p><ul><li>Increase your Strength or Constitution score by 1, to a maximum of 20.</li><li>Your movement speed increases by 10 feet.</li><li>If you move at least 10 feet in a straight line towards your target immediately before hitting with an attack as part of the Attack Action on your turn, choose one of the following effects: Your attack gains a 1d8 bonus to the damage roll, or your attack can push the target up to 10 feet, provided the target you want to push is no more than one size larger than you. You can use this benefit only once on each of your turns.</li></ul>",
});

export const contortionist: FeatureItem = makeFeat({
  name: "Contortionist",
  slug: "contortionist",
  description: "<p>Having greater control over your own body, you gain the following benefits:</p><ul><li>Increase your Dexterity score by 1, to a maximum of 20.</li><li>Creatures have disadvantage when trying to grapple you.</li><li>You have advantage in escaping restraints by dislocating a joint or two.</li><li>You can move through spaces as if you were 1 size smaller.</li></ul>",
});

export const creativityAdept: FeatureItem = makeFeat({
  name: "Creativity Adept",
  slug: "creativity-adept",
  uses: { max: "@prof", per: "lr" },
  description: "<p>You've learned a few tricks to help in your adventuring life. You gain the following benefits:</p><ul><li>Increase your Wisdom, Charisma, or Intelligence score by 1, to a maximum of 20.</li><li>You learn two tricks of your choice from any class' creation list. Intelligence, Wisdom, or Charisma is your creative ability for these tricks (you choose which when you gain this feat).</li><li>You learn one 1st-level creation of your choice. You can use this creation a number of times equal to your proficiency bonus without expending a creation slot, regaining all uses at the end of a long rest. You can also use this creation with any creation slots you have. The ability score you increased with this feat is your creative ability for this creation.</li></ul>",
});

export const critterFriend: FeatureItem = makeFeat({
  name: "Critter Friend",
  slug: "critter-friend",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You master the techniques needed to train and handle animals. You gain the following benefits:</p><ul><li>Increase your Wisdom score by 1, to a maximum of 20.</li><li>You gain proficiency in the Animal Handling skill. If you are already proficient in the skill, you gain expertise in it.</li><li>You learn the Speak with Animals creation and can use it at will, without expending a creation slot.</li><li>You also learn the Animal Friend creation, and you can use it once with this feat, without expending a creation slot. You regain the ability to use it in this way when you finish a long rest. Wisdom is your creativity ability for these creations.</li><li>You can use a bonus action on your turn to command one friendly beast within 60 feet of you that can hear you and that isn’t currently following the command of someone else. You decide now what action the beast will take and where it will move during its next turn, or you issue a general command that lasts for 1 minute, such as to guard a particular area.</li></ul>",
});

export const crossbowExpert: FeatureItem = makeFeat({
  name: "Crossbow Expert",
  slug: "crossbow-expert",
  prerequisites: "Proficiency with crossbows",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You have extensively practiced with the crossbow, granting you the following benefits:</p><ul><li>You gain a +1 bonus to attack rolls you make with any crossbow.</li><li>You ignore the loading property of crossbows with which you are proficient.</li><li>Being within 5 feet of a hostile creature doesn’t impose disadvantage on your ranged attack rolls.</li><li>When you use the Attack action and attack with a one-handed weapon, you can use a bonus action to attack with a hand crossbow you are holding.</li></ul>",
});

export const cruel: FeatureItem = makeFeat({
  name: "Cruel",
  slug: "cruel",
  description: "<p>You take delight in inflicting pain and anguish upon others. You gain 3 cruelty dice and you regain all spent cruelty dice when you finish a short or long rest. If you score a critical hit, you regain 1 cruelty die. Your cruelty dice are d6s. You can roll only one cruelty die per turn, and a cruelty die is spent when you roll it.</p><p>You can use cruelty dice in any of the following ways:</p><ul><li>When you deal damage to a creature, spend one cruelty die to deal extra damage to the creature equal to the roll.</li><li>When you deal damage to a creature, spend one cruelty die to gain a number of temporaty hit points equal to your level.</li><li>When you make a Charisma (Intimidation) check, spend one cruelty die and add the roll to your check.</li></ul>",
});

export const crusher: FeatureItem = makeFeat({
  name: "Crusher",
  slug: "crusher",
  description: "<p>You are practiced in the art of crushing your enemies, granting you the following benefits:</p><ul><li>Increase your Strength or Constitution by 1, to a maximum of 20.</li><li>Once per turn, when you hit a creature with an attack that deals bludgeoning damage, you can move it 5 feet to an unoccupied space, provided the target is no more than one size larger than you.</li><li>When you score a critical hit that deals bludgeoning damage to a creature, attack rolls against that creature are made with advantage until the start of your next turn.</li></ul>",
});

export const customizedCreativityAdept: FeatureItem = makeFeat({
  name: "Customized Creativity Adept",
  slug: "customized-creativity-adept",
  prerequisites: "The ability to use creativity",
  uses: { max: "3", per: "lr" },
  description: "<p>You have a signature way in which you utilize your creativity. Choose two of the Customization Creations options from the Customized Creativity feature from College of Lore Bard. You gain three uses to fuel these options, regaining all uses at the end of a long rest. These uses are added to any Customized Creativity uses you may already have. Each use of the chosen creation customization options takes one usage.</p>",
});

export const cutlassMastery: FeatureItem = makeFeat({
  name: "Cutlass Mastery",
  slug: "cutlass-mastery",
  prerequisites: "Proficiency with a cutlass",
  activation: { type: "reaction", cost: 1 },
  description: "<p>The deft and powerful cutlass is the blade of your mastery, able to strike and guard the wielder efficiently. You gain the following benefits while wielding a cutlass:</p><ul><li>You gain a +1 bonus to attack rolls you make with cutlasses.</li><li>While you are wielding a cutlass and are hit by an attack, you can use your reaction to attempt to block the attack, adding your proficiency bonus to your AC against that attack roll.</li><li>When you have more than one hostile creature adjacent to your space, you gain a +1 bonus to damage rolls against creatures adjacent to you, for each of those creatures adjacent to you (maximum 3).</li><li>While moving towards an enemy creature on your turn, you gain a 10ft bonus to your movement speed until the end of your turn.</li></ul>",
});

export const generalACFeats: FeatureItem[] = [
  acrobat,
  adeptInspiration,
  adeptModifier,
  alert,
  axeMastery,
  barbarianAdept,
  battleCreator,
  bearyBlue,
  blowgunExpert,
  bowMastery,
  brave,
  brawny,
  bulwark,
  burglar,
  caneMaster,
  cannonMaster,
  caring,
  chainsmoker,
  charger,
  contortionist,
  creativityAdept,
  critterFriend,
  crossbowExpert,
  cruel,
  crusher,
  customizedCreativityAdept,
  cutlassMastery,
];
