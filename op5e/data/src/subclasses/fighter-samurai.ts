import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";

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
  `<p>Starting at 3rd level, as a bonus action you can enter one of four fighting stances. Each stance lasts until you use a bonus action to switch stances, become incapacitated, or choose to end it (no action required). When you enter a stance, you gain temporary hit points equal to your fighter level.</p>
<ul>
<li><strong>Earth Stance.</strong> You are rooted and immovable. You have advantage on saving throws against being knocked prone or moved against your will, and your melee weapon attacks deal an additional 1d4 damage.</li>
<li><strong>Fire Stance.</strong> Your attacks burn with intensity. When you hit a creature with a weapon attack, the target takes an additional 1d6 fire damage.</li>
<li><strong>Water Stance.</strong> You flow like water around your opponents. Your movement doesn't provoke opportunity attacks, and when a creature misses you with a melee attack, you can use your reaction to move 5 feet without provoking opportunity attacks.</li>
<li><strong>Wind Stance.</strong> You move with the speed of the wind. Your walking speed increases by 10 feet, and you can take the Dash or Disengage action as a bonus action.</li>
</ul>`,
  "Samurai 3",
);

const elegantCourtier = feat(
  "elegant-courtier", "Elegant Courtier",
  `<p>Starting at 7th level, your discipline and precision allow you to excel in social situations. You gain proficiency in one of the following skills of your choice: History, Insight, Performance, or Persuasion.</p>
<p>Additionally, your Wisdom modifier is added to any Charisma check you make (minimum bonus of +1).</p>`,
  "Samurai 7",
);

const tirelessSpirit = feat(
  "tireless-spirit", "Tireless Spirit",
  `<p>Starting at 10th level, when you roll initiative and have no temporary hit points, you gain temporary hit points equal to your Wisdom modifier + your fighter level (minimum of 1).</p>`,
  "Samurai 10",
);

const stanceImprovements = feat(
  "stance-improvements", "Stance Improvements",
  `<p>At 15th level, your fighting stances reach their perfected forms:</p>
<ul>
<li><strong>Improved Earth Stance.</strong> Your melee attacks deal an additional 1d8 damage instead of 1d4, and you gain resistance to bludgeoning, piercing, and slashing damage while in this stance.</li>
<li><strong>Improved Fire Stance.</strong> The additional fire damage increases to 2d6, and creatures you hit must succeed on a Constitution saving throw (DC = 8 + your proficiency bonus + your Strength or Dexterity modifier) or become ignited for 1 minute.</li>
<li><strong>Improved Water Stance.</strong> You gain a swim speed equal to your walking speed, and when a creature misses you with a melee attack, you can make a melee weapon attack as a reaction.</li>
<li><strong>Improved Wind Stance.</strong> Your walking speed increases by 20 feet instead of 10, and you can make one additional attack when you take the Attack action.</li>
</ul>`,
  "Samurai 15",
);

const undyingDevotion = feat(
  "undying-devotion", "Undying Devotion",
  `<p>At 18th level, your fighting spirit can delay death itself. If you take damage that reduces you to 0 hit points, you can use your reaction to delay falling unconscious, and you can immediately take an extra turn, interrupting the current turn. While you have 0 hit points during that extra turn, taking damage causes death saving throw failures as normal, and three death saving throw failures can still kill you. When the extra turn ends, you fall unconscious if you still have 0 hit points.</p>
<p>Once you use this feature, you can't use it again until you finish a long rest.</p>`,
  "Samurai 18",
);

export const samurai: SubclassItem = {
  _id: generateId(SUB),
  name: "Samurai",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>The Samurai is a fighter who draws on an implacable fighting spirit to overcome enemies. A Samurai's resolve is nearly unbreakable, and the enemies in a Samurai's path have two choices: yield or die fighting.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "samurai",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
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
