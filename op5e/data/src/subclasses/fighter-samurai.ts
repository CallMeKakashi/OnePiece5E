import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, createTrait, mergeAdvancements } from "../../helpers/advancement.js";

const SUB = "subclass/fighter/samurai";
const F = "feature/fighter/samurai";

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

const fightingStances = feat(
  "fighting-stances", "Fighting Stances",
  `<h4>Bonus Proficiency</h4>
<p>When you choose this archetype at 3rd level, you gain proficiency in one of the following skills of your choice: History, Insight, Performance, or Persuasion.</p>
<h4>Fighting Stance</h4>
<p>Starting at 3rd level, you learn a fighting stance, enhancing your combat abilities. As a bonus action on your turn, you adjust your posture and the way you hold your weapons, allowing you to anticipate your foe or strike true.</p>
<ul>
<li><strong>Earth.</strong> A defensive stance used to deflect blows. Holding your weapon low, you wait for your opponent to strike and leave an opening. Until the start of your next turn, your AC increases by 2. As a reaction, you can increase this bonus to 4. You may do this after the roll, but before your DM tells you whether the attack hits or misses.</li>
<li><strong>Fire.</strong> This offensive posture raises the weapon high above the head, leaving the body exposed, but readying a powerful strike. You gain advantage on weapon attack rolls until the end of your turn.</li>
<li><strong>Water.</strong> Traditionally the most basic, this middle-level stance is a balance between offense and defense and focuses on using your opponent's power against itself. Until the start of your next turn, when you are targeted by a melee weapon attack, you can use your reaction to make an attack against the creature.</li>
<li><strong>Wind.</strong> By maneuvering your weapon sideways, you can move more quickly and parry blows more effectively. Your movement speed increases by 15 feet until the end of your turn. Additionally, you do not provoke opportunity attacks as part of this movement.</li>
</ul>
<p>Whenever you adopt a stance on your turn, you gain 5 temporary hit points. This increases to 10 and 15 temporary hit points at 10th and at 15th level.</p>
<p>You can choose another one of these stances to learn at 7th, 10th, and 15th level. You can use this feature a number of times equal to 1 + your Wisdom modifier (minimum of 1), and you regain all expended uses of it when you finish a short or long rest.</p>`,
  "Samurai 3",
);

const elegantCourtier = feat(
  "elegant-courtier", "Elegant Courtier",
  `<p>Starting at 7th level, your discipline and attention to detail allow you to excel in social situations. Whenever you make a Charisma (Persuasion) check, you gain a bonus to the check equal to your Wisdom modifier (minimum of 1).</p>
<p>Your self-control also causes you to gain proficiency in Wisdom saving throws. If you already have this proficiency, you instead gain proficiency in Intelligence or Charisma saving throws (your choice).</p>`,
  "Samurai 7",
);

const tirelessSpirit = feat(
  "tireless-spirit", "Tireless Spirit",
  `<p>Starting at 10th level, when you roll initiative and have no uses of Second Wind remaining, you regain one use. Additionally, whenever you use Second Wind, you gain a bonus to the hit points restored equal to your Wisdom Modifier (minimum of 1).</p>`,
  "Samurai 10",
);

const stanceImprovements = feat(
  "stance-improvements", "Stance Improvements",
  `<p>Starting at 15th level, you learn how to combine stances, break out of them or simply use them more effectively.</p>
<ul>
<li><strong>Earth.</strong> While in Earth Stance and subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you can use your reaction to angle your weapon so you take no damage on a success and only half damage on a failed saving throw.</li>
<li><strong>Fire.</strong> While in Fire stance, you can forgo the advantage on one of the attacks and make an extra weapon attack against that target instead, as part of the same action. You can do so no more than once per turn.</li>
<li><strong>Water.</strong> When you make an attack as a reaction while in Water stance, you can make an additional attack with a melee weapon yourself as part of that reaction against that creature.</li>
<li><strong>Wind.</strong> While in Wind Stance, you can take to the sky in short bursts. You have a flying speed equal to your current walking speed. You fall if you end your turn in the air and nothing else is holding you aloft.</li>
</ul>
<p>Additionally, while in a stance, you can suddenly change your posture again to surprise your foe. On your turn, you can expend another use of Fighting Stance to swap stances, no action required. When it's another creature's turn, this also uses your reaction. When you do so, you gain the temporary hit points as normal.</p>`,
  "Samurai 15",
);

const undyingDevotion = feat(
  "undying-devotion", "Undying Devotion",
  `<p>At 18th level, your devotion to your cause prevents you from dying outright, giving you the chance to continue fighting. When you're reduced to 0 hit points but not killed outright, you can choose to fall to 1 hit point instead. You can do this a number of times equal to your Constitution Modifier, or expend a use of your Fighting Stance. You regain all uses at the end of a long rest.</p>`,
  "Samurai 18",
);

export const samurai: SubclassItem = {
  _id: generateId(SUB),
  name: "Samurai",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>The Samurai can encompass any swordsman, but particularly the mythical samurai of Wano country. Becoming a disciplined master of the blade, able to adopt fighting stances that render them a difficult opponent to battle, allowing you can overcome the odds and strike down enemies.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "samurai",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
      createTrait(SUB, 3, { mode: "default", grants: [], choices: [{ count: 1, pool: ["skills:his","skills:ins","skills:prf","skills:per"] }] }, "bonus-proficiency"),
      createItemGrant(SUB, 3, [
        { uuid: fUuid(`${F}/fighting-stances`) },
      ]),
      createItemGrant(SUB, 7, [
        { uuid: fUuid(`${F}/elegant-courtier`) },
      ]),
      createItemGrant(SUB, 10, [
        { uuid: fUuid(`${F}/tireless-spirit`) },
      ]),
      createItemGrant(SUB, 15, [
        { uuid: fUuid(`${F}/stance-improvements`) },
      ]),
      createItemGrant(SUB, 18, [
        { uuid: fUuid(`${F}/undying-devotion`) },
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

export const samuraiFeatures: FeatureItem[] = [
  fightingStances,
  elegantCourtier,
  tirelessSpirit,
  stanceImprovements,
  undyingDevotion,
];
