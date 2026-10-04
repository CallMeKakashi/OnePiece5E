import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";

const SUB = "subclass/fighter/banneret";
const F = "feature/fighter/banneret";

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

const honorableBeacon = feat(
  "honorable-beacon", "Honorable Beacon",
  `<p>Starting at 3rd level, you gain proficiency in (Charisma) Persuasion and (Charisma) Intimidation skill checks, or expertise if you already have proficiency in each skill respectively.</p>
<p>In addition, when you use your Second Wind feature, you can target a creature within 30 feet of you that can hear you, the target regains the same amount of hit points you rolled.</p>`,
  "Banneret 3",
);

const commanderInChief = feat(
  "commander-in-chief", "Commander in Chief",
  `<p>Also at 3rd level, you can issue commands to your allies to form a coordinated assault. As a bonus action, you can command a friendly creature of your choice within 30 ft of you that can hear you. The target gains one of the following benefits of your choice:</p>
<ul>
<li><strong>Ready, Aim, Fire!</strong> The target adds your Charisma modifier to their next attack roll, until the end of their next turn.</li>
<li><strong>On Your Feet, Soldier!</strong> The target adds your Charisma modifier on their next saving throw, until the start of your next turn.</li>
<li><strong>Duck!</strong> The next attack roll made against the target is reduced by a number equal to your Charisma modifier.</li>
<li><strong>This Way!</strong> The target can use their reaction to move a number of feet equal to 5 * your Charisma modifier with opportunity attacks made at disadvantage.</li>
</ul>
<p>You can use this feature a number of times equal to 1 + your Charisma Modifier, regaining all uses at the end of a short or long rest.</p>`,
  "Banneret 3",
);

const braveAndBold = feat(
  "brave-and-bold", "Brave and Bold",
  `<p>Beginning at 7th level, you gain proficiency with Charisma saving throws. If you were already proficient in Charisma saving throws, you can instead choose Intelligence or Wisdom.</p>
<p>In addition, you add your Charisma modifier to the amount of hit points regained for your Second Wind and Honorable Beacon feature.</p>`,
  "Banneret 7",
);

const empoweredAuthority = feat(
  "empowered-authority", "Empowered Authority",
  `<p>At 10th level, your commands bring out the best in your comrades, showing off their true potential. Your Commander in Chief options improve in the following ways:</p>
<ul>
<li><strong>Ready, Aim, Fire!</strong> The target also adds your Charisma modifier to their damage roll if the attack hits.</li>
<li><strong>On Your Feet, Soldier!</strong> If the target fails their saving throw, they take half damage. If the target succeeds their saving throw, they take no damage.</li>
<li><strong>Duck!</strong> If the attack still hits, the damage is also reduced by your Charisma modifier.</li>
<li><strong>This Way!</strong> The target's movement from their reaction doesn't provoke opportunity attacks.</li>
</ul>`,
  "Banneret 10",
);

const heroicSurge = feat(
  "heroic-surge", "Heroic Surge",
  `<p>Starting at 15th level, when you use your Action Surge feature, you can choose one creature within 60 feet of you that is allied with you. That creature can make one melee or ranged weapon attack with its reaction, provided that it can see or hear you.</p>
<p>In addition, you gain an additional use of your Indomitable feature.</p>`,
  "Banneret 15",
);

const invincibleDominion = feat(
  "invincible-dominion", "Invincible Dominion",
  `<p>At 18th level, your tactics and leader spirit enable you to fight near endlessly. Your abilities from your Commander in Chief feature no longer cost any usages.</p>
<p>In addition, when you use your Heroic Surge feature, you can choose two allies within 60 feet of you, rather than one.</p>`,
  "Banneret 18",
);

export const banneret: SubclassItem = {
  _id: generateId(SUB),
  name: "Banneret",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>Leading the charge, the charismatic Banneret commands their allies in a true coordinated assault. These fighters stand as a beacon for victory on the battlefield, bringing their fallen comrades back into the thick of the fight and encouraging their soldiers to take down any threat that comes there way. Bannerets are typically leader's of their own organizations, typically in militant organizations, ready to lay down their lives for their cause.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "banneret",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
      createItemGrant(SUB, 3, [
        { uuid: fUuid(`${F}/honorable-beacon`) },
        { uuid: fUuid(`${F}/commander-in-chief`) },
      ]),
      createItemGrant(SUB, 7, [
        { uuid: fUuid(`${F}/brave-and-bold`) },
      ]),
      createItemGrant(SUB, 10, [
        { uuid: fUuid(`${F}/empowered-authority`) },
      ]),
      createItemGrant(SUB, 15, [
        { uuid: fUuid(`${F}/heroic-surge`) },
      ]),
      createItemGrant(SUB, 18, [
        { uuid: fUuid(`${F}/invincible-dominion`) },
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

export const banneretFeatures: FeatureItem[] = [
  honorableBeacon,
  commanderInChief,
  braveAndBold,
  empoweredAuthority,
  heroicSurge,
  invincibleDominion,
];
