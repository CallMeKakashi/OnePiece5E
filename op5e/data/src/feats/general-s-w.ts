import { makeFeat } from "./_make-feat.js";
import type { FeatureItem } from "../../schemas/feature.js";

export const savageAttacker: FeatureItem = makeFeat({
  name: "Savage Attacker",
  slug: "savage-attacker",
  description: "<p>Your training with weapons has allowed you to utilize their full force, able to devastate your opponents with deadly strikes. You gain the following benefits when wielding a weapon:</p><ul><li>Your attack gains a +1 to damage rolls</li><li>When you take the attack action, and you have more than one attack you can take with the same weapon you are wielding, you can choose to not take those extra attacks and instead increase the damage of the attack you take by an extra dice of damage of your weapon for every attack not taken. (If the weapon must be reloaded like a firearm or a cannon, it must be loaded to count as making an attack)</li><li>Your weapon attacks score a critical hit on a roll of 19 or 20.</li></ul>",
});

export const scimitarMaster: FeatureItem = makeFeat({
  name: "Scimitar Master",
  slug: "scimitar-master",
  prerequisites: "Proficiency with a scimitar",
  activation: { type: "bonus", cost: 1 },
  uses: { max: "@prof", per: "sr" },
  description: "<p>The light and curved blade allows the wielder to make complex flourishes to rend their enemies. You gain the following benefits while wielding a scimitar:</p><ul><li>You gain a +1 bonus to attack rolls you make with scimitar.</li><li>As a bonus action, you can make a flourish with your next attack made with a scimitar. When you hit, the attack gains a damage spread of 5ft, DC = 8 + your proficiency bonus + your Strength or Dexterity modifier. You can use this feature a number of times equal to your proficiency bonus, regaining all uses at the end of a short or long rest.</li><li>If you move 10ft in a straight line towards a creature before making an attack with a scimitar, when the attack hits, you deal an additional damage die with the attack.</li><li>If a creature hits a creature within your melee reach with a melee attack, you can use your reaction to become the target instead.</li></ul>",
});

export const sentinel: FeatureItem = makeFeat({
  name: "Sentinel",
  slug: "sentinel",
  activation: { type: "reaction", cost: 1 },
  description: "<p>You have mastered techniques to take advantage of every drop in any enemy's guard, gaining the following benefits:</p><ul><li>When you hit a creature with an opportunity attack, the creature's speed becomes 0 for the rest of the turn.</li><li>Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach.</li><li>When a creature makes an attack against a target other than you (and that target doesn't have this feat), you can use your reaction to make an opportunity attack with a melee weapon against the attacking creature.</li></ul>",
});

export const sharpshooter: FeatureItem = makeFeat({
  name: "Sharpshooter",
  slug: "sharpshooter",
  description: "<p>You have mastered ranged weapons and can make shots that others find impossible. You gain the following benefits:</p><ul><li>Attacking at long range doesn't impose disadvantage on your ranged weapon attack rolls.</li><li>Your ranged weapon attacks ignore half and three-quarters cover.</li><li>Before you make an attack with a ranged weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If that attack hits, you add +10 to the attack's damage.</li></ul>",
});

export const shieldMaster: FeatureItem = makeFeat({
  name: "Shield Master",
  slug: "shield-master",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You use shields not just for protection but also for offense. You gain the following benefits while you are wielding a shield:</p><ul><li>You can use a bonus action to try to shove a creature within 5 feet of you with your shield.</li><li>If you aren't incapacitated, you can add your shield's AC bonus to any Dexterity saving throw you make against a spell or other harmful effect that targets only you.</li><li>If you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you can use your reaction to take no damage if you succeed on the saving throw, interposing your shield between yourself and the source of the effect.</li></ul>",
});

export const shortBladeMaster: FeatureItem = makeFeat({
  name: "Short Blade Master",
  slug: "short-blade-master",
  prerequisites: "Proficiency with a dagger or shortsword",
  uses: { max: "@prof", per: "sr" },
  description: "<p>Sacrificing the size and power of a weapon for lightness and speed, you have mastered using short blades such as daggers and shortswords. You gain the following benefits:</p><ul><li>You gain a +1 bonus to attack rolls made with daggers and shortswords.</li><li>When you take the attack action with a dagger or shortsword, you can make an additional attack with it as part of the Attack action. You can use this feature a number of times equal to your proficiency bonus, regaining all uses at the end of a short or long rest.</li><li>You have advantage on attack rolls against a creature you are grappling with, as well as against creatures that are grappling you.</li><li>When you have advantage on an attack roll using a dagger or shortsword, and you hit, you deal an additional 1d4 damage.</li></ul>",
});

export const shotgunMaster: FeatureItem = makeFeat({
  name: "Shotgun Master",
  slug: "shotgun-master",
  prerequisites: "Proficiency with a shotgun",
  description: "<p>The powerful blast of the shotgun is under your control and whim, allowing you to blast apart anyone who comes your way. You gain the following benefits while wielding a shotgun:</p><ul><li>You gain a +1 bonus to attack rolls you make with shotguns.</li><li>The bonus damage from your shotgun when attacking a creature within normal range increases from 1d4 to 1d6.</li><li>The normal and long ranges of your shotgun increases to (40/120).</li><li>In place of an attack with your shotgun, you can instead produce a 5ft cube at a point you can see within the normal range of your shotgun. Any creature caught in this cube must make a Dexterity saving throw, DC = 8 + your Dexterity modifier + your Proficiency Bonus. On a failure, the creature takes the damage from your shotgun, as if you had hit it with the weapon attack. On a success, the creature takes no damage.</li></ul>",
});

export const sightlessPerspective: FeatureItem = makeFeat({
  name: "Sightless Perspective",
  slug: "sightless-perspective",
  prerequisites: "You are permanently blind, if you later regain your sight, you will lose this feat over the course of 3 months, of which it will be replaced with the Observant feat",
  description: "<p>Losing sight in the literal sense can be a daunting task to overcome, be it not being born with it, or losing your eyes in a deadly encounter. Luckily you are particularly crafty, able to adapt to your other senses to fight against any and all unseen danger. You gain the following benefits:</p><ul><li>Increase your Wisdom score by 1, up to a maximum of 20.</li><li>You gain your choice of either blindsight or tremorsense of 30ft. This radius increases by an additional 10ft for each Observation Haki ability you possess.</li><li>Ranged attacks don’t have advantage against you due to you being blind. However, they can still have advantage for other reasons.</li><li>Any ability that you have that requires you to see a target within range functions as long as that target is within your blindsight/tremorsense.</li></ul>",
});

export const silverTongue: FeatureItem = makeFeat({
  name: "Silver Tongue",
  slug: "silver-tongue",
  activation: { type: "bonus", cost: 1 },
  uses: { max: "@prof", per: "lr" },
  description: "<p>You develop your conversational skill to better deceive others. You gain the following benefits.</p><ul><li>Increase your Charisma score by 1, to a maximum of 20.</li><li>You gain proficiency in the Deception skill. If you are already proficient in the skill, you gain Expertise in it.</li><li>You learn the Vicious Mockery trick, your Charisma is the creation ability modifier for this creation. You can use this trick as a bonus action a number of times equal to your proficiency bonus, regaining all uses at the end of a long rest.</li><li>You can replace one attack with an attempt to deceive one creature you can see within 30 feet of you that can see and hear you. Make a Charisma (Deception) check contested by the target's Wisdom (Insight) check. If your check succeeds, your movement doesn't provoke opportunity attacks from the target and your attack rolls against it have advantage; both benefits last until the end of your next turn or until you use this ability on a different target. If your check fails, the target can't be deceived by you in this way for 1 hour.</li></ul>",
});

export const skillExpert: FeatureItem = makeFeat({
  name: "Skill Expert",
  slug: "skill-expert",
  description: "<p>You have honed your proficiency with particular skills, granting you the following benefits:</p><ul><li>Increase one ability score of your choice by 1, to a maximum of 20.</li><li>You gain proficiency in one skill of your choice.</li><li>Choose one skill in which you have proficiency. You gain expertise with that skill. The skill you choose must not be already benefiting from a feature, such as Expertise.</li></ul>",
});

export const skilled: FeatureItem = makeFeat({
  name: "Skilled",
  slug: "skilled",
  description: "<p>You are highly skilled. You gain proficiency in any three skills or tools of your choice.</p>",
});

export const skulker: FeatureItem = makeFeat({
  name: "Skulker",
  slug: "skulker",
  prerequisites: "Dexterity 13 or higher",
  description: "<p>You are an expert at slinking through shadows. You gain the following benefits:</p><ul><li>Increase your Dexterity score by 1, to a maximum of 20.</li><li>You gain proficiency in the Stealth skill. If you are already proficient in the skill, you gain Expertise in it.</li><li>If you are hidden, you can move up to 10 feet in the open without revealing yourself if you end the move in a position where you're not clearly visible.</li><li>You can try to hide when you are lightly obscured from the creature from which you are hiding.</li><li>When you are hidden from a creature and miss it with a ranged weapon attack, making the attack doesn't reveal your position.</li></ul>",
});

export const slasher: FeatureItem = makeFeat({
  name: "Slasher",
  slug: "slasher",
  description: "<p>You’ve learned where to cut to have the greatest results, granting you the following benefits:</p><ul><li>Increase your Strength or Dexterity by 1, to a maximum of 20.</li><li>Once per turn when you hit a creature with an attack that deals slashing damage, you can reduce the speed of the target by 10 feet until the start of your next turn.</li><li>When you score a critical hit that deals slashing damage to a creature, you grievously wound it. Until the start of your next turn, the target has disadvantage on all attack rolls.</li></ul>",
});

export const slingMaster: FeatureItem = makeFeat({
  name: "Sling Master",
  slug: "sling-master",
  prerequisites: "Proficiency with a sling",
  description: "<p>You have mastered slings. You gain the following benefits:</p><ul><li>You gain a +1 bonus to attack rolls you make with slings.</li><li>When you wield a sling, its damage die is increased by one tier (i.e. 1d4 -> 1d6). In addition, the sling’s normal range increases from 30 feet to 60 feet, and its long range increases from 120 feet to 180 feet.</li><li>When you score a critical hit with a sling, you deal extra damage equal to your proficiency bonus. In addition, your target must succeed on a Constitution saving throw (DC = 8 + your proficiency bonus + your Dexterity modifier) or become stunned until the end of its next turn.</li><li>You don't have close-range disadvantage when using slings.</li></ul>",
});

export const soundIntelligence: FeatureItem = makeFeat({
  name: "Sound Intelligence",
  slug: "sound-intelligence",
  uses: { max: "@prof", per: "lr" },
  description: "<p>There is an inherent part of you that remains mentally prepared, able to decipher all that comes at you. You gain the following benefits:</p><ul><li>Increase your Intelligence score by 1, to a maximum of 20.</li><li>You gain proficiency in Intelligence saving throws.</li><li>When you fail an Intelligence saving throw, you can roll a d6 and add it to the roll, possibly changing the outcome. You can do this a number of times equal to your proficiency bonus, and regain all uses when you finish a long rest.</li></ul>",
});

export const spearMastery: FeatureItem = makeFeat({
  name: "Spear Mastery",
  slug: "spear-mastery",
  prerequisites: "Proficiency with spears, javelins, pikes, tridents, or glaives",
  description: "<p>You have mastered the use of long, poking sticks, rewarding you for the time you have taken to master it. You gain the following benefits:</p><ul><li>You gain a +1 bonus to attack rolls you make with a spear, javelin, pike, trident, or glaive.</li><li>When you use a spear, javelin, pike, trident, or glaive, its damage die increases by one damage dice size (1d6 => 1d8, 1d10 = > 1d12). In the case of the spear, both the one-handed and two-handed damage die increases in size by one.</li><li>On your turn, you can choose to take a forward stance by expending half of your movement speed. When you take this stance, your reach with spears, javelins, pikes, tridents, and glaives increases by 5ft.</li><li>On your turn, you can choose to take a wide stance by expending half of your movement speed. When you take this stance, the next creature you hit with a melee weapon attack using a spear, javelin, pike, trident, or glaive must make a Strength saving throw, DC = 8 + your proficiency + your Strength or Dexterity modifier. On a failure, the target is knocked prone or disarmed of an object they are holding (your choice).</li></ul>",
});

export const spiritAdept: FeatureItem = makeFeat({
  name: "Spirit Adept",
  slug: "spirit-adept",
  description: "<p>You have connected with your inner spirit, and have manifested it into greater control of your physical self. You gain the following benefits:</p><ul><li>Choose one of the Spirit Abilities from the brawler class. You gain 2 Spirit points (which are added to any Spirit points you have from another source). You regain any of these spent Spirit points when completing a short rest. Whenever you reach a level that grants the Ability Score Improvement feature, you can replace one of these Spirit Ability options with another one from the brawler class.</li><li>Your damage dice for your unarmed strike increases by one size, 1d4 => 1d6, 1d10 => 1d12. The maximum damage dice you can have for an unarmed strike is 1d12.</li><li>Your movement speed increases by 5ft.</li></ul>",
});

export const storyteller: FeatureItem = makeFeat({
  name: "Storyteller",
  slug: "storyteller",
  description: "<p>Your experiences in life have rendered you skilled at spinning tales, both real and fictional. You gain the following benefits:</p><ul><li>Increase your Charisma score by 1, to a maximum of 20.</li><li>You can spend 10 minutes recalling a fantastic tale and relaying it to your companions. When you do so, roll on the Tale Archetypes table to determine the recalled tale. You can tell the tale to up to six friendly creatures of your choice (which can include yourself) within 30 feet of you who can see or hear you and who can understand you. A chosen creature gains the tale’s effect and can use it once before it finishes a long rest. A creature can’t gain an effect from this feat again until it has finished a long rest.</li></ul><p><strong>Tale Archetypes</strong></p><table><thead><tr><th>d6</th><th>Recalled Tale</th></tr></thead><tbody><tr><td>1</td><td><strong><em>Overcoming the Monster.</em></strong> The creature can add your Charisma modifier to an attack roll or a damage roll.</td></tr><tr><td>2</td><td><strong><em>Rags to Riches.</em></strong> When the creature regains hit points, it can regain an additional amount equal to your Charisma modifier.</td></tr><tr><td>3</td><td><strong><em>The Quest.</em></strong> The creature gains temporary hit points equal to your level + double your Charisma modifier.</td></tr><tr><td>4</td><td><strong><em>Voyage and Return.</em></strong> When the creature moves, it can increase its speed by a number of feet equal to your Charisma modifier times 5 for one turn.</td></tr><tr><td>5</td><td><strong><em>Comedy or Tragedy.</em></strong> When the creature fails an ability check or attack roll, it can add your Charisma modifier to the roll, potentially changing the result.</td></tr><tr><td>6</td><td><strong><em>Rebirth.</em></strong> The creature can add your Charisma modifier to a saving throw.</td></tr></tbody></table>",
});

export const survivalist: FeatureItem = makeFeat({
  name: "Survivalist",
  slug: "survivalist",
  uses: { max: "@prof", per: "lr" },
  description: "<p>You master wilderness lore, gaining the following benefits:</p><ul><li>Increase your Wisdom score by 1, to a maximum of 20.</li><li>You gain proficiency in the Survival skill. If you are already proficient in the skill, you gain Expertise in it.</li><li>You learn the Animal Eyes and Animal Friend creations. You can Animal Friend without expending a creation slot a number of times equal to your proficiency bonus, regaining all uses when you finish a long rest.</li><li>You gain an Unarmored AC equal to 10 + your Wisdom modifier + your Dexterity modifier. You lose this AC if you are wearing armor or holding a shield.</li></ul>",
});

export const tandemTactician: FeatureItem = makeFeat({
  name: "Tandem Tactician",
  slug: "tandem-tactician",
  activation: { type: "bonus", cost: 1 },
  description: "<p>Your presence in a scrap tends to elevate your comrades. You gain the following benefits:</p><ul><li>You can use the Help action as a bonus action.</li><li>When you use the Help action to aid an ally in attacking a creature, increase the range of the Help action by 10 feet. Additionally, you can help two allies target the same creature within range when you use the Help action this way.</li></ul>",
});

export const tavernBrawler: FeatureItem = makeFeat({
  name: "Tavern Brawler",
  slug: "tavern-brawler",
  activation: { type: "bonus", cost: 1 },
  description: "<p>You are accustomed to the rough-and-tumble fighting using whatever weapons happen to be at hand, you gain the following benefits:</p><ul><li>You gain a +1 bonus to attack rolls made with improvised weapons.</li><li>You gain proficiency in improvised weapons.</li><li>The damage dice of any improvised weapon you wield increases by one size (1d4 => 1d6) to a maximum of 1d12.</li><li>If you score a critical hit using an improvised weapon, you can choose to deal extra damage equal to your proficiency bonus.</li><li>While wielding an improvised weapon, you can use a bonus action to attempt to grapple a target.</li></ul>",
});

export const thrownWeaponMaster: FeatureItem = makeFeat({
  name: "Thrown Weapon Master",
  slug: "thrown-weapon-master",
  description: "<p>You have mastered the ability to throw weapons from a distance. You gain the following abilities:</p><ul><li>Increase your Strength or Dexterity score by 1, to a maximum of 20.</li><li>Simple and martial melee weapons without the thrown property have the thrown property for you. One-handed weapons have a normal range of 20 feet and a long range of 60 feet, while two-handed weapons have a normal range of 15 feet and a long range of 30 feet.</li><li>When you make an attack with a thrown weapon that already had the thrown property (not gained by this feat), the standard range is 60 and the long range is 180.</li></ul>",
});

export const tough: FeatureItem = makeFeat({
  name: "Tough",
  slug: "tough",
  description: "<p>You are tough. Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.</p>",
});

export const trapMaster: FeatureItem = makeFeat({
  name: "Trap Master",
  slug: "trap-master",
  activation: { type: "bonus", cost: 1 },
  description: "<p>It's time to split up gang, and set up some traps, gaining the following benefits:</p><ul><li>You gain a +1 bonus to attack rolls made with nets and manacles.</li><li>When you take the Attack action on your turn, you can use your bonus action to make an attack with a net or set of manacles.</li><li>Your range with nets increases to 10/30, and you do not suffer long range disadvantage with attacks made with nets. In addition, manacles you wield gain the thrown property (20/40).</li><li>As a bonus action, you can set up or disarm minor traps such as with Hunting Traps, Ball Bearings, and Caltrops.</li></ul>",
});

export const trickFoiler: FeatureItem = makeFeat({
  name: "Trick Foiler",
  slug: "trick-foiler",
  activation: { type: "reaction", cost: 1 },
  description: "<p>You have practiced techniques useful in melee combat against gadgeteers, gaining the following benefits:</p><ul><li>Increase your Strength, Dexterity, or Constitution score by 1, to a maximum of 20.</li><li>When a creature within your melee reach of you uses a creation, or teleports, you can use your reaction to make a melee weapon attack against that creature. If this attack hits a creature that was teleporting, it prevents them from doing so.</li><li>When you damage a creature that is concentrating on any ability that requires concentration, that creature has disadvantage on the saving throw it makes to maintain its concentration.</li><li>You have advantage on saving throws against creations used by creatures within your melee reach.</li></ul>",
});

export const unarmedMaster: FeatureItem = makeFeat({
  name: "Unarmed Master",
  slug: "unarmed-master",
  description: "<p>You are a master of using unarmed combat, you gain the following benefits:</p><ul><li>You gain a +1 bonus to attack rolls you make with unarmed strikes.</li><li>Before you make an unarmed strike, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.</li><li>Additionally the size of your unarmed strike becomes one die size larger (d4 => d6, etc.). If you do not already have a roll for the damage of your unarmed strikes, it becomes a d4. The maximum damage dice you can have for an unarmed strike is 1d12.</li></ul>",
});

export const underdog: FeatureItem = makeFeat({
  name: "Underdog",
  slug: "underdog",
  description: "<p>When the going gets tough, that's when you get going. You gain the following benefits:</p><ul><li>Increase your Constitution score by 1, to a maximum of 20.</li><li>When a creature scores a critical hit against you, you have advantage all attack rolls you make against that creature, until the end of your next turn.</li><li>If a critical hit against you drops you to 0 hit points, you drop instead to 1 hit point. You regain this ability when you roll initiative.</li></ul>",
});

export const unmatchedStrength: FeatureItem = makeFeat({
  name: "Unmatched Strength",
  slug: "unmatched-strength",
  uses: { max: "@prof", per: "lr" },
  description: "<p>There is an inherent part of you that remains physically strong. You gain the following benefits:</p><ul><li>Increase your Strength score by 1, to a maximum of 20.</li><li>You gain proficiency in Strength saving throws.</li><li>When you fail a Strength saving throw, you can roll a d6 and add it to the roll, possibly changing the outcome. You can do this a number of times equal to your proficiency bonus, and regain all uses when you finish a long rest.</li></ul>",
});

export const unyieldingCharisma: FeatureItem = makeFeat({
  name: "Unyielding Charisma",
  slug: "unyielding-charisma",
  uses: { max: "@prof", per: "lr" },
  description: "<p>There is an inherent part of you that refuses to back down. You gain the following benefits:</p><ul><li>Increase your Charisma score by 1, to a maximum of 20.</li><li>You gain proficiency in Charisma saving throws.</li><li>When you fail a Charisma saving throw, you can roll a d6 and add it to the roll, possibly changing the outcome. You can do this a number of times equal to your proficiency bonus, and regain all uses when you finish a long rest.</li></ul>",
});

export const vehicleMaster: FeatureItem = makeFeat({
  name: "Vehicle Master",
  slug: "vehicle-master",
  activation: { type: "action", cost: 1 },
  description: "<p>You are a master of all forms of transportation. Be it land, sea, or sky, you know what to do. You gain the following benefits:</p><ul><li>Increase your Intelligence or Wisdom score by 1, to a maximum of 20.</li><li>You gain proficiency in all Vehicles (land, sea, and sky). If you are already proficient in one of these, you instead gain expertise for that vehicle.</li><li>As an action, you can make a spontaneous repair on your vehicle needed, repairing, 10 x Proficiency modifier of its hit points. This can only be done once per long rest.</li><li>The time and cost that it takes you to craft any vehicle is cut in half.</li></ul>",
});

export const voracity: FeatureItem = makeFeat({
  name: "Voracity",
  slug: "voracity",
  activation: { type: "bonus", cost: 1 },
  uses: { max: "@prof", per: "lr" },
  description: "<p>Much like a machine, food is your fuel, granting you the energy needed to get through the challenges of the day. In particular, your strong metabolism allows you to benefit from the foods you eat instantaneously. You gain the following benefits.</p><ul><li>Increase your Constitution score by 1, to a maximum of 20.</li><li>As a bonus action, you can consume food to energize yourself, temporarily gaining one of the following benefits depending on the flavor of the food. You can use this ability a number of times equal to your proficiency bonus, regaining all uses at the end of a long rest.</li></ul><p><strong>Sour.</strong> You gain a 1d4 bonus to one skill of your choice in a skill that you are proficient in for 1 hour.</p><p><strong>Sweet.</strong> You gain a +10 bonus to your movement speed for 1 minute.</p><p><strong>Salty.</strong> You gain a 1d4 bonus to all saving throws for 1 minute.</p><p><strong>Bitter.</strong> You gain a +2 bonus to all damage rolls made with weapon attacks for 1 minute.</p><p><strong>Savory.</strong> You regain a number of hit points equal to 1d12 + your level.</p>",
});

export const warpickMastery: FeatureItem = makeFeat({
  name: "Warpick Mastery",
  slug: "warpick-mastery",
  activation: { type: "bonus", cost: 1 },
  description: "<p><em>Prerequisites: Proficiency with warpicks</em></p><p>Warpicks are a versatile weapon, able to bash the enemies, or pierce through the armor of your foes. You gain the following benefits while wielding a warpick:</p><ul><li>You gain a +1 bonus to attack rolls you make with warpicks.</li><li>As a bonus action, you can give a charge to the sharp point of your warpick, granting you next attack against any creature wearing armor to have a +2 bonus to hit.</li><li>As a bonus action, you give a charge to the blunt side of your warpick, enabling you to make a shove as a bonus action with the warpick. If you succeed, you can choose to knock them back 5ft and prone.</li></ul>",
});

export const weaponMaster: FeatureItem = makeFeat({
  name: "Weapon Master",
  slug: "weapon-master",
  description: "<p>You have practiced extensively with a variety of weapons, gaining the following benefits:</p><ul><li>Increase your Strength or Dexterity score by 1, to a maximum of 20.</li><li>You gain proficiency in all simple weapons, martial weapons, and cannons.</li></ul>",
});

export const whipMaster: FeatureItem = makeFeat({
  name: "Whip Master",
  slug: "whip-master",
  prerequisites: "Proficiency with whips",
  description: "<p>A whip in your hands becomes a deadly weapon. You gain the following benefits:</p><ul><li>You gain a +1 bonus to attack rolls you make with whips.</li><li>Whips you wield gain an extra 5ft reach, this stacks with their reach property, giving you a reach of 15ft.</li><li>The damage die of whips you wield increases by one size (1d4 => 1d6).</li><li>When you score a critical hit against a creature that is no more than one size larger than you, you can force that target to make a Strength saving throw (DC = 8 + your proficiency bonus + your Strength or Dexterity modifier). On a failure, the target becomes grappled. While grappled in this way, the creature is restrained.</li></ul>",
});

export const generalSWFeats: FeatureItem[] = [
  savageAttacker,
  scimitarMaster,
  sentinel,
  sharpshooter,
  shieldMaster,
  shortBladeMaster,
  shotgunMaster,
  sightlessPerspective,
  silverTongue,
  skillExpert,
  skilled,
  skulker,
  slasher,
  slingMaster,
  soundIntelligence,
  spearMastery,
  spiritAdept,
  storyteller,
  survivalist,
  tandemTactician,
  tavernBrawler,
  thrownWeaponMaster,
  tough,
  trapMaster,
  trickFoiler,
  unarmedMaster,
  underdog,
  unmatchedStrength,
  unyieldingCharisma,
  vehicleMaster,
  voracity,
  warpickMastery,
  weaponMaster,
  whipMaster,
];
