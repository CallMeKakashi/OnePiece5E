import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, createItemChoiceRestricted, createScaleValue, mergeAdvancements } from "../../helpers/advancement.js";
import { maneuverUuids } from "../class-features/class-content.js";

const SUB = "subclass/fighter/battlemaster";
const F = "feature/fighter/battlemaster";

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

const superiorCombatant = feat(
  "superior-combatant", "Superior Combatant",
  `<p>Starting at 3rd level, you learn maneuvers that are fueled by special dice called superiority dice.</p>
<p><strong>Maneuvers.</strong> You learn three maneuvers of your choice. Many maneuvers enhance an attack in some way. You can use only one maneuver per attack. You learn two additional maneuvers of your choice at 7th, 10th, and 15th level. Each time you learn new maneuvers, you can also replace one maneuver you know with a different one.</p>
<p><strong>Superiority Dice.</strong> You have four superiority dice, which are d8s. A superiority die is expended when you use it. You regain all of your expended superiority dice when you finish a short or long rest. You gain another superiority die at 7th level and one more at 15th level.</p>
<p><strong>Saving Throws.</strong> Some of your maneuvers require your target to make a saving throw to resist the maneuver's effects. The saving throw DC is calculated as follows:</p>
<p>Maneuver save DC = 8 + your proficiency bonus + your Strength or Dexterity modifier (your choice)</p>
<h4>Ambush</h4>
<p>When you make a Dexterity (Stealth) check or an initiative roll, you can expend one superiority die and add the die to the roll, provided you aren't incapacitated.</p>
<h4>Bait and Switch</h4>
<p>When you're within 5 feet of a creature on your turn, you can expend one superiority die and switch places with that creature, provided you spend at least 5 feet of movement and the creature is willing and isn't incapacitated. This movement doesn't provoke opportunity attacks.</p>
<p>Roll the superiority die. Until the start of your next turn, you or the other creature (your choice) gains a bonus to AC equal to the number rolled.</p>
<h4>Brace</h4>
<p>When a creature you can see moves into the reach you have with the melee weapon you're wielding, you can use your reaction to expend one superiority die and make one attack against the creature, using that weapon. If the attack hits, add the superiority die to the weapon's damage roll.</p>
<h4>Commander's Strike</h4>
<p>When you take the Attack action on your turn, you can forgo one of your attacks to direct one of your companions to strike. When you do so, choose a friendly creature who can see or hear you and expend one superiority die. That creature can immediately use its reaction to make one weapon attack, adding the superiority die to the attack's damage roll.</p>
<h4>Commanding Presence</h4>
<p>When you make a Charisma (Intimidation), a Charisma (Performance), or a Charisma (Persuasion) check, you can expend one superiority die and add the superiority die to the ability check.</p>
<h4>Disarming Attack</h4>
<p>When you hit a creature with a weapon attack, you can expend one superiority die to attempt to disarm the target, forcing it to drop one item of your choice that it's holding. You add the superiority die to the attack's damage roll, and the target must make a Strength saving throw. On a failed save, it drops the object you choose. The object lands at its feet.</p>
<h4>Distracting Strike</h4>
<p>When you hit a creature with a weapon attack, you can expend one superiority die to distract the creature, giving your allies an opening. You add the superiority die to the attack's damage roll. The next attack roll against the target by an attacker other than you has advantage if the attack is made before the start of your next turn.</p>
<h4>Evasive Footwork</h4>
<p>Before or after you make an attack, you can, as a bonus action on your turn, expend a superiority dice. The attack you make deals extra damage equal to the superiority dice roll, and you don't provoke opportunity attacks until the end of your turn.</p>
<h4>Feinting Attack</h4>
<p>You can expend one superiority die and use a bonus action on your turn to feint, choosing one creature within 5 feet of you as your target. You have advantage on your next attack roll against that creature this turn. If that attack hits, add the superiority die to the attack's damage roll.</p>
<h4>Goading Attack</h4>
<p>When you hit a creature with a weapon attack, you can expend one superiority die to attempt to goad the target into attacking you. You add the superiority die to the attack's damage roll, and the target must make a Wisdom saving throw. On a failed save, the target has disadvantage on all attack rolls against targets other than you until the end of your next turn.</p>
<h4>Grappling Strike</h4>
<p>Immediately after you hit a creature with a melee attack on your turn, you can expend one superiority die and then try to grapple the target as a bonus action. Add the superiority die to your Strength (Athletics) check.</p>
<h4>Lunging Attack</h4>
<p>When you make a melee weapon attack on your turn, you can expend one superiority die to increase your reach for that attack by 5 feet. If you hit, you add the superiority die to the attack's damage roll.</p>
<h4>Maneuvering Attack</h4>
<p>When you hit a creature with a weapon attack, you can expend one superiority die to maneuver one of your comrades into a more advantageous position. You add the superiority die to the attack's damage roll, and you choose a friendly creature who can see or hear you. That creature can use its reaction to move up to half its speed without provoking opportunity attacks from the target of your attack.</p>
<h4>Pushing Attack</h4>
<p>When you hit a creature with a weapon attack, you can expend one superiority die to attempt to drive the target back. You add the superiority die to the attack's damage roll, it then must make a Strength saving throw. On a failed save, you push the target up to 15 feet away from you.</p>
<h4>Parry</h4>
<p>When another creature hits you with an attack, you can use your reaction and expend one superiority die to increase your AC by the number you roll on your superiority die + your Dexterity modifier for that attack.</p>
<h4>Menacing Attack</h4>
<p>When you hit a creature with a weapon attack, you can expend one superiority die to attempt to frighten the target. You add the superiority die to the attack's damage roll, and the target must make a Wisdom saving throw. On a failed save, it is frightened of you until the end of your next turn.</p>
<h4>Precision Attack</h4>
<p>When you make a weapon attack roll against a creature, you can expend one superiority die to add it to the roll. You can use this maneuver before or after making the attack roll, but before any effects of the attack are applied.</p>
<h4>Quick Toss</h4>
<p>As a bonus action, you can expend one superiority die and make a ranged attack with a weapon that has the thrown property. You can draw the weapon as part of making this attack. If you hit, add the superiority die to the weapon's damage roll.</p>
<h4>Rally</h4>
<p>On your turn, you can use a bonus action and expend one superiority die to bolster the resolve of one of your companions. When you do so, choose a friendly creature who can see or hear you (can include yourself). That creature gains temporary hit points equal to the superiority die roll + your Fighter level + your Charisma modifier.</p>
<h4>Riposte</h4>
<p>When a creature targets you with a melee attack, you can use your reaction and expend one superiority die to make a melee weapon attack against the creature. If you hit, you add the superiority die to the attack's damage roll.</p>
<h4>Sweeping Attack</h4>
<p>When you hit a creature with a melee weapon attack, you can expend one superiority die to attempt to damage adjacent creatures with the same attack. Your attack gains damage spread that only affects creatures of your choice and deals extra damage equal to your superiority die roll. The DC is equal to your Maneuver save DC.</p>
<h4>Tactical Assessment</h4>
<p>When you make an Intelligence (Investigation), an Intelligence (History), or a Wisdom (Insight) check, you can expend one superiority die and add the superiority die to the ability check.</p>
<h4>Trip Attack</h4>
<p>When you hit a creature with a weapon attack, you can expend one superiority die to attempt to knock the target down. You add the superiority die to the attack's damage roll, it then must make a Strength saving throw. On a failed save, you knock the target prone.</p>`,
  "Battlemaster 3",
);

const studentOfWar = feat(
  "student-of-war", "Student of War",
  `<p>At 3rd level, you gain proficiency with one type of artisan's tools of your choice.</p>`,
  "Battlemaster 3",
);

const advancedCombatTactics = feat(
  "advanced-combat-tactics", "Advanced Combat Tactics",
  `<p>Starting at 7th level, you can add your Wisdom modifier (minimum of +1) to your Initiative rolls and to all ability checks made while in combat.</p>
<p>Additionally, whenever you roll a superiority die and the result is 1 or 2, you can treat that roll as a 3.</p>`,
  "Battlemaster 7",
);

const improvedSuperiorCombatant = feat(
  "improved-superior-combatant", "Improved Superior Combatant",
  `<p>At 10th level, your superiority dice turn into d10s. At 18th level, they turn into d12s.</p>`,
  "Battlemaster 10",
);

const relentlessCombatant = feat(
  "relentless-combatant", "Relentless Combatant",
  `<p>Starting at 15th level, you never give up the fight. As a bonus action, you can regain all your expended Superiority Dice. Once you use this feature, you cannot use it again until you finish a long rest.</p>`,
  "Battlemaster 15",
);

const signatureStrike = feat(
  "signature-strike", "Signature Strike",
  `<p>At 18th level, choose one of your battle master maneuvers. Once per turn, when you use that maneuver, you don't expend a superiority die.</p>`,
  "Battlemaster 18",
);

export const battlemaster: SubclassItem = {
  _id: generateId(SUB),
  name: "Battlemaster",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>The Battlemaster, as the name implies, is a master tactician. Able to use complex maneuvers to dominate the battlefield, these fighters make excellent use anywhere in battle, and are even more deadly when paired with the right allies.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "battlemaster",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
      createItemGrant(SUB, 3, [
        { uuid: fUuid(`${F}/superior-combatant`) },
        { uuid: fUuid(`${F}/student-of-war`) },
      ]),
      createItemChoiceRestricted(SUB, 3, maneuverUuids, { count: 3, replacement: true, label: "Maneuvers (level 3)" }),
      createItemChoiceRestricted(SUB, 7, maneuverUuids, { count: 2, replacement: true, label: "Maneuvers (level 7)" }),
      createItemChoiceRestricted(SUB, 10, maneuverUuids, { count: 2, replacement: true, label: "Maneuvers (level 10)" }),
      createItemChoiceRestricted(SUB, 15, maneuverUuids, { count: 2, replacement: true, label: "Maneuvers (level 15)" }),
      createScaleValue(SUB, "superiority-die", "dice", { 3: { number: 1, faces: 8 }, 10: { number: 1, faces: 10 }, 18: { number: 1, faces: 12 } }),
      createScaleValue(SUB, "superiority-dice", "number", { 3: { value: 4 }, 7: { value: 5 }, 15: { value: 6 } }),
      createScaleValue(SUB, "maneuvers-known", "number", { 3: { value: 3 }, 7: { value: 5 }, 10: { value: 7 }, 15: { value: 9 } }),
      createItemGrant(SUB, 7, [
        { uuid: fUuid(`${F}/advanced-combat-tactics`) },
      ]),
      createItemGrant(SUB, 10, [
        { uuid: fUuid(`${F}/improved-superior-combatant`) },
      ]),
      createItemGrant(SUB, 15, [
        { uuid: fUuid(`${F}/relentless-combatant`) },
      ]),
      createItemGrant(SUB, 18, [
        { uuid: fUuid(`${F}/signature-strike`) },
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

export const battlemasterFeatures: FeatureItem[] = [
  superiorCombatant,
  studentOfWar,
  advancedCombatTactics,
  improvedSuperiorCombatant,
  relentlessCombatant,
  signatureStrike,
];
