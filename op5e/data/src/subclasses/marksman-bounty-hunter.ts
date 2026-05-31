import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/marksman/bounty-hunter";

function feat(idPath: string, name: string, level: number, description: string, extra: any = {}): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: `Marksman (Bounty Hunter) ${level}`,
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
      ...extra,
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem;
}

export const bountyHunterCreations = feat(
  "feature/marksman/bounty-hunter/bounty-hunter-creations", "Bounty Hunter Creations", 3,
  `<p>Starting at 3rd level, you gain the following bonus creations at specific marksman levels. They count as marksman creations for you, but don't count towards the number of marksman creations you can prepare.</p>
<ul>
<li><strong>3rd:</strong> Alacrity, Zephyr Strike</li>
<li><strong>5th:</strong> Blur, Branding Smite</li>
<li><strong>9th:</strong> Blinding Smite, Staggering Smite</li>
<li><strong>13th:</strong> Hold Monster, Stoneskin</li>
<li><strong>17th:</strong> Blade Barrier, Steel Wind Strike</li>
</ul>`,
);

export const additionalFightingStyle = feat(
  "feature/marksman/bounty-hunter/additional-fighting-style", "Additional Fighting Style", 3,
  `<p>At 3rd level, you choose an additional fighting style, either Dueling or Two Weapon Fighting. At 11th level, you gain the other fighting style you didn't choose at 3rd level. If you already have both styles, you can choose another option from the Marksman Styles section.</p>`,
);

export const huntsmensTactics = feat(
  "feature/marksman/bounty-hunter/huntsmens-tactics", "Huntsmen's Tactics", 3,
  `<p>Additionally, at 3rd level, you adopt a unique style of hunting down your prey. You gain one of the following features of your choice. At 11th level, you can choose to gain an additional feature from the list below.</p>
<ul>
<li><strong>Persistent Strike.</strong> Your undying tenacity in a fight enables you to take down any enemy. When you hit a creature with a weapon attack, the creature takes an extra 1d8 damage if it's below its hit point maximum. You can deal this extra damage only once per turn.</li>
<li><strong>Big Game Hunting.</strong> When a Large or larger creature within 5 feet of you hits or misses you with an attack, you can use your reaction to attack that creature immediately after its attack.</li>
<li><strong>Cluster Clasher.</strong> Once on each of your turns when you make a weapon attack, you can make another attack with the same weapon against a different creature that is within 5 feet of the original target and within range of your weapon.</li>
</ul>`,
);

export const defensiveChampion = feat(
  "feature/marksman/bounty-hunter/defensive-champion", "Defensive Champion", 7,
  `<p>At 7th level, you excel at defending yourself from danger when hunting down various games. You gain the ability to choose one of the defensive techniques listed below. At 15th level, you can choose an additional defensive technique.</p>
<ul>
<li><strong>Multiattack Defense.</strong> When a creature hits you with an attack, you gain a +4 bonus to AC against all subsequent attacks made by that creature for the rest of the turn.</li>
<li><strong>Uncanny Dodge.</strong> When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you.</li>
<li><strong>Evasion.</strong> When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed, and only half damage if you fail.</li>
</ul>`,
);

export const masterAtArms = feat(
  "feature/marksman/bounty-hunter/master-at-arms", "Master-at-Arms", 15,
  `<p>At 15th level, you become a master at fighting with weapons, striking hard and fast. When you use your Extra Attack feature, you can attack three times instead of twice when you take the attack action on your turn.</p>`,
);

export const features: FeatureItem[] = [
  bountyHunterCreations, additionalFightingStyle, huntsmensTactics, defensiveChampion, masterAtArms,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Bounty Hunter",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Bounty hunters are marksmen who thrive in the thick of the fight rather than in the backlines. Equally skilled with ranged and melee weapons, they weave seamlessly between them in a neverending dance of steel and bullets.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "bounty-hunter",
    classIdentifier: "marksman",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(bountyHunterCreations) }, { uuid: fUuid(additionalFightingStyle) }, { uuid: fUuid(huntsmensTactics) }]),
      createItemGrant(SC_ID, 7, [{ uuid: fUuid(defensiveChampion) }]),
      createItemGrant(SC_ID, 11, [], "level-11-improvements"),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(masterAtArms) }]),
    ) as any,
    spellcasting: { progression: "none", ability: "" },
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as SubclassItem;
