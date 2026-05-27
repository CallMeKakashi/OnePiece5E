import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { createDAEEffect, addBonus } from "../../helpers/effects.js";

function hakiAbility(
  slug: string,
  name: string,
  description: string,
  requirements: string,
  options: {
    activation?: { type: string; cost: number | null; condition: string };
    uses?: { value: number | null; max: string; per: string | null; recovery: string; prompt: boolean };
    actionType?: string;
    effects?: FeatureItem["effects"];
  } = {},
): FeatureItem {
  return {
    _id: generateId(`feature/haki/${slug}`),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements,
      activation: options.activation ?? { type: "", cost: null, condition: "" },
      duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" },
      range: { value: null, long: null, units: "" },
      uses: options.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: options.actionType ?? "",
      damage: { parts: [], versatile: "" },
      save: { ability: "", dc: null, scaling: "spell" },
      chatFlavor: "",
      recharge: { value: null, charged: false },
    },
    effects: options.effects ?? [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null,
      duplicateSource: null,
      coreVersion: "13",
      systemId: "dnd5e",
      systemVersion: "5.1.10",
      createdTime: null,
      modifiedTime: null,
      lastModifiedBy: null,
    },
  };
}

// --- Color of Armament ---

const armamentNovice = hakiAbility(
  "armament-novice",
  "Color of Armament Novice",
  `<p>Through grueling challenges and training, you've unlocked the hidden potential sleeping deep within you, transforming your will into tangible force. You have access to the basic form of Armament Haki.</p>
<p><strong>Armor of Resolve.</strong> Your will suffuses your body, rendering weak threats completely inconsequential. When you take damage from any source that is less than or equal to 5, you ignore that damage. This damage threshold is calculated before any damage reduction and resistance.</p>
<p>In addition, if you have the Ocean's Scorn feature, and you are affected by the knee deep weakness, you can ignore those effects, except being unable to activate your devil fruit.</p>
<p><strong>Enhancement.</strong> Your will enhances your strikes, making your fists, bullets, blades, and other weapons much more dense, allowing you to smash through all that comes your way. Your attacks and creations can now overcome resistances and immunities to unimbued damage types as they are now haki imbued.</p>
<p>Additionally, you have a pool of Attack Points equal to your level that replenishes when you take a short or long rest. When you deal damage with an attack, creation, or other damaging ability, you can expend an Attack Point to add half your proficiency bonus (rounded down) to the damage roll. You can expend up to a number of Attack Points on a single damage roll to a maximum equal to your proficiency bonus.</p>
<p>If you have Affinity towards Armament Haki, you may add your full proficiency bonus rather than half.</p>
<p><strong>Fortified Defense.</strong> Your tenacious spirit empowers you when you take a defensive stance. When you use the Dodge action, you additionally gain advantage on a saving throw of your choice (in addition to Dexterity) until the start of your next turn.</p>`,
  "8th level",
  {
    uses: { value: null, max: "@details.level", per: "sr", recovery: "", prompt: true },
  },
);

const armamentApprentice = hakiAbility(
  "armament-apprentice",
  "Color of Armament Apprentice",
  `<p>Your specialization gives you the ability to coat yourself in a black sheen that protects you from harm. You gain the following benefits.</p>
<p><strong>Hardening.</strong> At 10th level, your haki suffuses your very being, reinforcing you against any damage. You gain a pool of Armor points equal to three times your level. Whenever you take damage, you can use this ability to reduce the damage by a number of points that you choose (no reaction required).</p>
<p>Whenever you are forced to make a saving throw, you can use this ability to expend 5 of your Armor points to reroll the saving throw, taking the highest result. You can use this feature 3 times, regaining all uses at the end of a short or long rest. If you have affinity towards armament haki, you additionally reduce the damage from the saving throw (if any) by 5 points.</p>
<p>Your pool of Armor Points replenishes when you take a long rest, or half as much on a short rest.</p>
<p>In addition, if you have used this feature while under the effects of Ocean's Scorn, and you are affected by the waist deep weakness, you can ignore those effects, except being unable to activate your devil fruit until the end of your next turn.</p>`,
  "10th level, Color of Armament Novice",
  {
    uses: { value: null, max: "@details.level * 3", per: "lr", recovery: "", prompt: true },
  },
);

const armamentJourneyman = hakiAbility(
  "armament-journeyman",
  "Color of Armament Journeyman",
  `<p>Your skills in armament haki improves, as you stand strong against even the mightiest of foes. You gain the following benefits:</p>
<p><strong>Armor of Spirit.</strong> Your spirit surpasses even steel itself, as your skin can repel most attacks. Your damage threshold increases from 5 to 10.</p>
<p><strong>Immovable Defense.</strong> You will not be moved, even against the mightiest of blows. When you take the Dodge action, you cannot be moved against your will and you reduce all incoming damage by 1d4, until the start of your next turn.</p>`,
  "12th level, Color of Armament Apprentice",
);

const armamentAdept = hakiAbility(
  "armament-adept",
  "Color of Armament Adept",
  `<p>Your haki has made you as sturdy as a mountain, covering your full body in a layer of dark armor.</p>
<p><strong>Reinforcing.</strong> At 14th level, your pool of Armor points for your Hardening feature increases from three times your level to five times your level.</p>
<p>In addition you can reroll saving throws 5 times, regaining all uses at the end of a short or long rest instead of 3.</p>`,
  "14th level, Color of Armament Journeyman",
);

const armamentMaster = hakiAbility(
  "armament-master",
  "Color of Armament Master",
  `<p>Your haki no longer merely hardens your strikes, but now flows into the enemy and objects, destroying them from within, without even making contact.</p>
<p><strong>Flow.</strong> You learn about the flow of haki, allowing it to flourish like a flurry of blossoming petals. Your pool of Attack points increases from equal to your level to twice your level.</p>
<p><strong>Internal Destruction.</strong> Your haki flows outwards from your strikes, increasing the reach of your melee attacks by 5ft, and the ranges of your ranged attacks double. In addition, when you hit an object with a haki-imbued attack, it deals maximum damage on the damage dice to the target.</p>
<p><strong>Unbreaking.</strong> Your haki constantly emits a barrier that protects you from inconsequential sources of damage. Your damage threshold increases from 10 to a number equal to your level.</p>`,
  "16th level, Color of Armament Adept",
);

// --- Color of Observation ---

const observationNovice = hakiAbility(
  "observation-novice",
  "Color of Observation Novice",
  `<p>Through grueling challenges and training, you've unlocked the hidden potential sleeping deep within you. You have access to the basic form of Observation Haki, granting you the ability to sense the auras of living creatures.</p>
<p><strong>Sense Presence.</strong> At 8th level, you become far more observant, gaining a +5 bonus to your passive Perception score. In place of the Search Action, you can instead focus and become aware of any living creature within 60 feet of you that isn't hidden, and a hidden creature must immediately make a Dexterity (Stealth) check against your passive perception or be spotted. You instantly learn the size of the creature but do not learn of its exact location unless you can see it.</p>
<p><strong>Focusing.</strong> You have a pool of Observation Points equal to your level that replenishes when you take a short or long rest. When you make an attack roll or force a target to make a saving throw, you can expend an Observation Point to add half your proficiency bonus (rounded down) to the attack roll or DC. You can only expend one Observation point per attack roll or DC.</p>
<p>If you have Affinity towards Observation Haki, you may add your full proficiency bonus rather than half.</p>`,
  "8th level",
  {
    uses: { value: null, max: "@details.level", per: "sr", recovery: "", prompt: true },
  },
);

const observationApprentice = hakiAbility(
  "observation-apprentice",
  "Color of Observation Apprentice",
  `<p>Your Observation Haki grows to allow you to sense the souls of creatures around you, understanding their intent as well as their overall strength.</p>
<p><strong>Sense Soul.</strong> At 10th level, you gain a permanent +1 to your AC and Saving Throws as long as you are conscious. In place of the Search action, you can learn certain information about a creature's capabilities. The DM tells you about the creature regarding a number of the following characteristics of your choice equal to your proficiency bonus:</p>
<ul>
<li>Strength Score</li>
<li>Dexterity Score</li>
<li>Constitution Score</li>
<li>Intelligence Score</li>
<li>Wisdom Score</li>
<li>Charisma Score</li>
<li>Armor Class</li>
<li>Current hit points</li>
<li>If it has Legendary Actions</li>
<li>If it has Haki</li>
</ul>
<p>Once you have used this feature on a creature, you cannot target that creature again until you finish a long rest.</p>`,
  "10th level, Color of Observation Novice",
  {
    effects: [
      createDAEEffect("haki/observation-apprentice", "Sense Soul", [
        addBonus("system.attributes.ac.bonus", "1"),
        addBonus("system.bonuses.abilities.save", "1"),
      ]),
    ],
  },
);

const observationJourneyman = hakiAbility(
  "observation-journeyman",
  "Color of Observation Journeyman",
  `<p>Your powers of observation sharpens, fixating on the intention of your enemies, and expanding your ability to sense their presence.</p>
<p><strong>Fixation.</strong> Your ability to sense the intention of your foes continues to improve. Your permanent AC and Saving Throw bonus becomes a +2. In addition, when you use your Sense Presence Search action, you additionally learn the creature types of any living creatures within the range, as well as the presence of notable objects within the range. For example, using this ability in a weapon shop may reveal that one of the weapons is cursed.</p>`,
  "12th level, Color of Observation Apprentice",
  {
    effects: [
      createDAEEffect("haki/observation-journeyman", "Fixation", [
        addBonus("system.attributes.ac.bonus", "2"),
        addBonus("system.bonuses.abilities.save", "2"),
      ]),
    ],
  },
);

const observationAdept = hakiAbility(
  "observation-adept",
  "Color of Observation Adept",
  `<p>Your training in Observation Haki has allowed you to see far beyond the capabilities of standard human eyes, allowing you to control your senses like the lens of a camera.</p>
<p><strong>Sense Shape.</strong> The permanent bonus to your AC and Saving Throws increases to +3. In addition, you can now shape Sense Presence as a line that is 120 feet long and 10 feet wide that extends from you, rather than a radius around you. On each of your turns, you can extend the length of the line by 120 feet, to a maximum of a mile.</p>`,
  "14th level, Color of Observation Journeyman",
  {
    effects: [
      createDAEEffect("haki/observation-adept", "Sense Shape", [
        addBonus("system.attributes.ac.bonus", "3"),
        addBonus("system.bonuses.abilities.save", "3"),
      ]),
    ],
  },
);

const observationMaster = hakiAbility(
  "observation-master",
  "Color of Observation Master",
  `<p>Your training in Observation Haki has reached complete mastery, allowing you to see a few seconds into the future through a moment of concentration.</p>
<p><strong>Sense Future.</strong> You cannot be surprised, except when incapacitated by something other than being asleep. If you are asleep when combat begins, you immediately wake up.</p>
<p>Additionally, at the start of your turn, you can choose to peer a few seconds into the future, expending two Observation Points. Until the start of the next turn, you have advantage on attack rolls, ability checks, and saving throws. Additionally, other creatures have disadvantage on attack rolls against the target for the duration.</p>`,
  "16th level, Color of Observation Adept",
);

// --- Conqueror's Haki ---

const conquerorNovice = hakiAbility(
  "conqueror-novice",
  "Conqueror's Haki Novice",
  `<p>You are one of the rare few who can wield conqueror's haki, making you one destined for great things.</p>
<p><strong>Overwhelming Presence.</strong> As a bonus action, you can project your willpower in a massive surge that knocks out any lesser creatures instantly. Each creature of your choice within a radius equal to half your proficiency bonus (rounded down) x 10 must succeed on a Wisdom saving throw or get knocked unconscious for 1 minute, but wakes up if it takes damage, or if another creature uses its action to shake them awake. The DC is calculated as 8 + your proficiency bonus + your highest ability score modifier.</p>
<p>If you possess affinity towards Conqueror's Haki, the radius is instead calculated with your full proficiency bonus x 10.</p>
<p>The DM can designate that certain creatures that are several times weaker than the user automatically fail this saving throw, such as fodder characters, normal animals, etc. A good rule of thumb would be creatures whose proficiency bonus is at least one or two points below the Conqueror's Haki user's proficiency bonus (minimum of 2).</p>
<p>As a reaction when another creature uses Overwhelming Presence, you can choose to clash with them using your own. If you choose to do so, the radius of both you and your target's Overwhelming Presence doubles, and creatures forced to make a saving throw do so at a disadvantage. Any allies that you have within either radius, you can choose to automatically succeed.</p>
<p>This ability has 3 uses, all of which you regain at the end of a long rest.</p>
<p><strong>Subjugate Foe.</strong> You can focus your projected will towards a single target, forcing them back, or forcing them to kneel and grovel. Once per turn, in place of a Shove attack, you may target a creature you can see within a 60 ft range. You can force that creature to make a Wisdom saving throw, using your Overwhelming Presence DC. On a failure, the creature takes 1d6 force damage and is either knocked prone or shoved backwards 10ft (your choice). On a success, it takes half as much damage.</p>
<p><strong>Unshakeable Will.</strong> Your will persists even in your darkest of hours, shielding you from being held back from fear. You are immune to the frightened condition.</p>`,
  "Special, 8th level",
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    uses: { value: 3, max: "3", per: "lr", recovery: "", prompt: true },
    actionType: "save",
  },
);

const conquerorApprentice = hakiAbility(
  "conqueror-apprentice",
  "Conqueror's Haki Apprentice",
  `<p>Your dominating will can make even the mightiest of beasts bow down to you, and put a stop to even the most powerful devil fruit abilities enforcing your place as a conqueror.</p>
<p><strong>Domination.</strong> As an action, you can target a beast you can see within the range of your Overwhelming Presence feature, forcing it to make a Wisdom saving throw against your Overwhelming Presence DC. The DM can choose to have the beast automatically fail this saving throw.</p>
<p>On a failure, the beast becomes charmed by you for 1 hour with concentration, as if you were concentrating on a creation. If you maintain this concentration for its full duration of an hour, the beast you targeted becomes friendly to you and your allies, but you no longer have any direct control over it unless you use this feature again.</p>
<p>While the beast is charmed, you have a telepathic link with it as long as the two of you are on the same plane of existence. You can use this telepathic link to issue commands to the creature while you are conscious (no action required), which it does its best to obey. If it is not issued a command, it will try its best to defend itself.</p>
<p>You can use your action to take total and precise control of the target. Until the end of your next turn, the creature takes only the actions you choose. During this time, you can also cause the creature to use a reaction, but this requires you to use your own reaction as well.</p>
<p>Each time the target takes damage, it makes a new Wisdom saving throw against the DC, ending the effect on a successful save.</p>
<p><strong>Crushing Will.</strong> As a reaction to a creature that you can see activating a devil fruit ability within the range of your Overwhelming Presence, you can attempt to enforce your will over them, preventing the ability from taking place. As part of the reaction, you make an ability check using your highest ability score. The DC equals 8 + the target's proficiency bonus + the target's highest ability modifier. On a success, the creature's ability fails and has no effect. On a failure, the ability activates as normal. If the target's level is less than or equal to your proficiency bonus, you automatically succeed the check.</p>
<p>If the transformation of a zoan devil fruit is suppressed, the creature is unable to transform for 1 minute. At the end of each of the creature's turns, they can make a Wisdom saving throw against your Overwhelming Presence DC, ending the effect on a successful save.</p>
<p>You have a number of uses of this ability equal to half your proficiency bonus (rounded down). If you possess affinity with Conqueror's Haki, you instead have uses equal to your full proficiency bonus.</p>`,
  "Special, 10th level, Conqueror's Haki Novice",
  {
    activation: { type: "action", cost: 1, condition: "" },
    actionType: "save",
  },
);

const conquerorJourneyman = hakiAbility(
  "conqueror-journeyman",
  "Conqueror's Haki Journeyman",
  `<p>Your training has strengthened your will, allowing your Conqueror's Haki to reach out farther beyond, increasing the power of your dominion, and increasing your influence over your foes.</p>
<p><strong>Profound Presence.</strong> Your sense of presence washes over the battlefield like crashing waves, sure to swallow anyone foolish enough to stand against your tides. The range of your Overwhelming Presence doubles.</p>
<p>In addition, when you use your Domination feature from your Conqueror's Haki Apprentice haki ability, you can instead target a humanoid you can see within range. You can use this feature 3 times, regaining all uses at the end of a long rest.</p>
<p><strong>Nullifying Will.</strong> The strength of your will improves, able to nullify the powers of your foes. When you make the ability check for your Crushing Will ability, you can add your proficiency bonus to the ability check.</p>
<p><strong>Vanquish Foe.</strong> Your will reaches far, striking fear into even the most ironclad of hearts. When you use your Subjugate Foe ability, the range increases to 120ft, it deals 2d6 force damage as opposed to 1d6, and if the target fails, they suffer disadvantage on the next attack roll, ability check, or saving throw they make, until the end of their next turn.</p>`,
  "Special, 12th level, Conqueror's Haki Apprentice",
);

const conquerorAdept = hakiAbility(
  "conqueror-adept",
  "Conqueror's Haki Adept",
  `<p>Your will over others can overpower your weaker foes, ensuring that the riff raff won't get away, and that your authority remains absolute.</p>
<p><strong>Overpowering Presence.</strong> Your overwhelming soul completely overtakes any fodder in your wake. Weaker creatures knocked out by your Overwhelming Presence no longer awaken at a source of damage or if a creature uses their action to shake them awake, but will awaken after 1 hour unless their HP is 0.</p>
<p><strong>Ultimate Authority.</strong> At any time of day, you reign supreme over your enemies and their special abilities. Your uses for your Crushing Will feature are now regained at the end of a short or long rest, instead of only a long rest.</p>`,
  "Special, 14th level, Conqueror's Haki Journeyman",
);

const conquerorMaster = hakiAbility(
  "conqueror-master",
  "Conqueror's Haki Master",
  `<p>Your will is nothing short of godly, as even the very skies bend to your mighty blows, the heavens themselves are torn asunder. May mercy be on your enemies.</p>
<p><strong>Kingdom Come.</strong> You become capable of imbuing your strikes with Conqueror's haki, transforming you into a true king among kings. You gain the following benefits:</p>
<ul>
<li>There is now an invisible destructive force around your attacks, granting your attacks a damage spread of 10ft, using your Overwhelming Presence DC. Creatures of your choice within the range of the damage spread are immune to this.</li>
<li>Your melee attacks have an additional 5ft reach.</li>
<li>All your attacks and creations deal an additional 2d6 force damage.</li>
</ul>
<p><strong>Ascendant Resilience.</strong> You gain three Legendary Resistances, all of which you regain at the end of a long rest.</p>
<p><strong>Conquer Foe.</strong> Your conquering spirit reaches farther. You can now use your Subjugate Foe ability against creatures within 1 mile that you can see. In addition, if a creature fails the saving throw of your Subjugate Foe ability by 5 or more, they instead suffer disadvantage on all attack rolls, ability checks, and saving throws until the end of their next turn.</p>`,
  "Special, 16th level, Conqueror's Haki Adept, Conqueror's Haki Affinity",
  {
    uses: { value: 3, max: "3", per: "lr", recovery: "", prompt: true },
  },
);

export const hakiAbilities: FeatureItem[] = [
  armamentNovice,
  armamentApprentice,
  armamentJourneyman,
  armamentAdept,
  armamentMaster,
  observationNovice,
  observationApprentice,
  observationJourneyman,
  observationAdept,
  observationMaster,
  conquerorNovice,
  conquerorApprentice,
  conquerorJourneyman,
  conquerorAdept,
  conquerorMaster,
];
