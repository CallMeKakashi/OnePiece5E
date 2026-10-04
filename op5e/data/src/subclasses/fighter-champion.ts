import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";

const SUB = "subclass/fighter/champion";
const F = "feature/fighter/champion";

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

const combatExpert = feat(
  "combat-expert", "Combat Expert",
  `<p>Your intense training has shown you how to pierce the stoutest defenses and exploit the slightest of missteps. When you choose this archetype at 3rd level, your weapon attacks score a critical hit on a roll of 19 or 20.</p>`,
  "Champion 3",
);

const physicalSuperiority = feat(
  "physical-superiority", "Physical Superiority",
  `<p>Starting at 3rd level, you choose either the Strength, Constitution, or Dexterity ability score. This feature gives you bonuses depending on your choice.</p>
<p>At 10th and 18th level, you can select one of the other ones that you have not selected.</p>
<h4>Strength</h4>
<p>Your gain proficiency in the Athletics skill and if you were already proficient, you instead gain Expertise.</p>
<p>You count as one size larger when determining your carrying capacity, the weight you can push, drag, or lift, and when grappling or shoving.</p>
<p>Additionally, when you make a running long jump, the distance you can cover increases by a number equal to your Strength Modifier.</p>
<h4>Constitution</h4>
<p>Your hit point maximum increases by a number equal to your fighter level when you gain this feature, and continues to increase by an additional 1 every time you gain a level in this class.</p>
<p>The amount of time you can hold your breath is doubled, and you have resistance to fall damage.</p>
<p>Additionally, you can use your Second Wind feature one additional time per short or long rest.</p>
<h4>Dexterity</h4>
<p>You gain proficiency in the Acrobatics skill and if you were already proficient, you instead gain Expertise.</p>
<p>Your movement speed increases by 5 feet. This bonus applies also to any native climbing, swimming, or flying speed you may have.</p>
<p>Additionally, whenever you roll Initiative you may treat a roll of 9 or lower on the die as a 10.</p>`,
  "Champion 3",
);

const signatureFightingStyle = feat(
  "signature-fighting-style", "Signature Fighting Style",
  `<p>At 7th level, you improve upon your chosen Fighting Style, performing martial feats few warriors can match. You gain an improvement to the Fighting Style you gained from the 1st level in this class:</p>
<p><strong>Improved Archery.</strong> You gain a +3 to attack and rolls you make with ranged weapons, and ignore half and three-quarters cover.</p>
<p><strong>Improved Blind Fighting.</strong> You have blindsight with a range of 30 feet. Within that range, you can effectively see anything that isn't behind total cover, even if blinded or in darkness. Moreover, you can see an invisible creature within range, unless the creature successfully hides. Additionally, you can take the Search Action as a bonus action.</p>
<p><strong>Improved Defense.</strong> While wearing armor, you gain +1 to AC and all Saving Throws. Additionally, as a reaction to an attack missing you, you can attempt to grapple or shove the attacker.</p>
<p><strong>Improved Dueling.</strong> When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon. Under the same conditions, if you're fighting against an enemy and there's no other creature within 5ft of you and that enemy, you gain advantage in all melee attacks against that enemy.</p>
<p><strong>Improved Superior Technique.</strong> You learn three maneuvers of your choice from among those available to the Battle Master archetype. If a maneuver you use requires your target to make a saving throw to resist the maneuver's effects, the saving throw DC equals 8 + your proficiency bonus + your Strength or Dexterity modifier (your choice.)</p>
<p>You gain three superiority die, which is a d8 (this die is added to any superiority dice you have from another source). This die is used to fuel your maneuvers. A superiority die is expended when you use it. You regain your expended superiority dice when you finish a short or long rest.</p>
<p><strong>Improved Interception.</strong> When a creature you can see hits a target, including you, within 5 feet of you with an attack, you can use your reaction to reduce the damage the target takes by 2d10 + your level (to a minimum of 0 damage). You must be wielding a simple or martial weapon to use this reaction.</p>
<p><strong>Improved Unarmed Fighting.</strong> Your unarmed strikes increase to 1d8 + your Strength modifier on a hit. If you aren't wielding any weapons or a shield when you make the attack roll, the d8 becomes a d10. Your grappling damage also becomes a 1d6.</p>
<p><strong>Improved Thrown Weapon Fighting.</strong> You can draw a weapon that has the thrown property as part of the attack you make with the weapon. In addition, when you hit with a ranged attack using a thrown weapon, you gain a +2 bonus to the damage roll.</p>
<p>Whenever you roll a critical hit using a thrown weapon, you roll an additional damage dice. Also, you do not have disadvantage when using a thrown weapon against a target within 5ft.</p>
<p><strong>Improved Melee Shooter.</strong> While you're wielding a ranged weapon, you gain a +1 bonus to attack rolls and a 1d4 bonus to the damage roll and you do not have disadvantage on ranged attacks while a creature is within 5 feet of you. Your ranged attacks also ignore half cover and three-quarters cover against targets within 30 feet of you.</p>
<p><strong>Improved Great Weapon Fighting.</strong> When you roll damage for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the dice and must use the higher of the two rolls. The weapon must have the two-handed or versatile property for you to gain this benefit. Additionally, when you roll the maximum damage on the weapon dice, you can knock the target prone.</p>
<p><strong>Improved Protection.</strong> While you're wielding a shield and an enemy attacks a creature within 5ft of you, including yourself, you can use your reaction to reroll all attack rolls against that creature until the start of their next turn.</p>
<p><strong>Improved Two-Weapon Fighting.</strong> When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack. When you make an opportunity attack, you can attack with both of your weapons.</p>
<p>Moreover, you can make your attack with an off-hand weapon as a part of the attack action instead of a bonus action. You can still only attack with an off-hand weapon once per turn.</p>
<p><strong>Improved Versatile Fighting.</strong> When wielding a weapon with the versatile property with one hand, you gain a +1 bonus to attack and damage rolls. While wielding a weapon with the versatile property with two hands, you gain a +1 bonus to your AC, and opportunity attacks against you are made with disadvantage.</p>`,
  "Champion 7",
);

const combatMaster = feat(
  "combat-master", "Combat Master",
  `<p>Starting at 10th level your weapon attacks score a critical hit on a roll of 18-20.</p>`,
  "Champion 10",
);

const perfectedFightingStyles = feat(
  "perfected-fighting-styles", "Perfected Fighting Styles",
  `<p>At 15th level, you have gone through extensive training in not only one, but two fighting styles, becoming a true master of combat. Choose another fighting style from Chapter 5. In addition, that fighting style gains the benefits of the appropriate style in the Signature Fighting Style feature.</p>`,
  "Champion 15",
);

const invulnerable = feat(
  "invulnerable", "Invulnerable",
  `<p>At 18th level, you gain resistance to two damage types of your choice, choosing from acid, bludgeoning, cold, fire, lightning, necrotic, piercing, poison, radiant, slashing, or thunder. Whenever you finish a short or long rest, you can change the damage types you chose.</p>`,
  "Champion 18",
);

export const champion: SubclassItem = {
  _id: generateId(SUB),
  name: "Champion",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>Those who follow the combative ways of the champion focus on the development of raw physical power honed to deadly perfection. Those who model themselves on this archetype are committed to their combat arts, becoming unparalleled masters of their fighting style, sharpening their proficiency beyond any other martial master.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "champion",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
      createItemGrant(SUB, 3, [
        { uuid: fUuid(`${F}/combat-expert`) },
        { uuid: fUuid(`${F}/physical-superiority`) },
      ]),
      createItemGrant(SUB, 7, [
        { uuid: fUuid(`${F}/signature-fighting-style`) },
      ]),
      createItemGrant(SUB, 10, [
        { uuid: fUuid(`${F}/combat-master`) },
      ]),
      createItemGrant(SUB, 15, [
        { uuid: fUuid(`${F}/perfected-fighting-styles`) },
      ]),
      createItemGrant(SUB, 18, [
        { uuid: fUuid(`${F}/invulnerable`) },
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

export const championFeatures: FeatureItem[] = [
  combatExpert,
  physicalSuperiority,
  signatureFightingStyle,
  combatMaster,
  perfectedFightingStyles,
  invulnerable,
];
