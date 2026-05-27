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
  `<p>At 3rd level, when you use your Second Wind feature, you can choose one creature within 60 feet of you that is allied with you. That creature regains hit points equal to half the amount you rolled on the Second Wind die + your Charisma modifier (minimum of 1 hit point).</p>`,
  "Banneret 3",
);

const commanderInChief = feat(
  "commander-in-chief", "Commander in Chief",
  `<p>Starting at 3rd level, you learn to direct your allies using your commanding presence. You gain four command options, each usable as a bonus action:</p>
<ul>
<li><strong>Rally.</strong> Choose a friendly creature within 30 feet. It gains temporary hit points equal to 1d8 + your Charisma modifier.</li>
<li><strong>Direct.</strong> Choose a friendly creature within 30 feet. It can use its reaction to move up to half its speed without provoking opportunity attacks.</li>
<li><strong>Bolster.</strong> Choose a friendly creature within 30 feet. It gains advantage on the next ability check it makes before the start of your next turn.</li>
<li><strong>Charge.</strong> Choose a friendly creature within 30 feet. It gains advantage on the next attack roll it makes before the start of your next turn.</li>
</ul>
<p>You can use this feature a number of times equal to your Charisma modifier (minimum of once). You regain all expended uses when you finish a long rest.</p>`,
  "Banneret 3",
);

const braveAndBold = feat(
  "brave-and-bold", "Brave and Bold",
  `<p>Starting at 7th level, you and friendly creatures within 10 feet of you can't be frightened while you are conscious. Additionally, you gain proficiency in one of the following skills of your choice: Animal Handling, Insight, Intimidation, or Persuasion.</p>`,
  "Banneret 7",
);

const empoweredAuthority = feat(
  "empowered-authority", "Empowered Authority",
  `<p>At 10th level, your Commander in Chief commands improve:</p>
<ul>
<li><strong>Improved Rally.</strong> The temporary hit points increase to 2d8 + your Charisma modifier.</li>
<li><strong>Improved Direct.</strong> The creature can move up to its full speed instead of half.</li>
<li><strong>Improved Bolster.</strong> The creature also gains advantage on the next saving throw it makes before the start of your next turn.</li>
<li><strong>Improved Charge.</strong> If the attack hits, it deals extra damage equal to your Charisma modifier.</li>
</ul>`,
  "Banneret 10",
);

const heroicSurge = feat(
  "heroic-surge", "Heroic Surge",
  `<p>Starting at 15th level, when you use Action Surge, you can choose one creature within 60 feet of you that is allied with you. That creature can use its reaction to make one melee or ranged weapon attack.</p>`,
  "Banneret 15",
);

const invincibleDominion = feat(
  "invincible-dominion", "Invincible Dominion",
  `<p>At 18th level, your presence on the battlefield is absolutely dominating. When you use your Indomitable feature, you can choose an allied creature within 60 feet. If that creature can see or hear you, it can also reroll its failed saving throw with advantage and must use the new roll.</p>
<p>Additionally, your Commander in Chief uses are now regained on a short or long rest.</p>`,
  "Banneret 18",
);

export const banneret: SubclassItem = {
  _id: generateId(SUB),
  name: "Banneret",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>A Banneret is a knight who inspires greatness in others by committing brave deeds in battle. The mere presence of one in a hamlet is enough to cause some combatants to rally to the Banneret's cause, and the Banneret's leadership makes everyone a more capable warrior.</p>",
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
