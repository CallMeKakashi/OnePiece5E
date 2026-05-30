import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/rogue/assassin";

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
      requirements: `Rogue (Assassin) ${level}`,
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

export const killersToolkit = feat(
  "feature/rogue/assassin/killers-toolkit", "Killer's Toolkit", 3,
  `<p>When you choose this archetype at 3rd level, you gain proficiency with the disguise kit and the poisoner's kit.</p>`,
);

export const assassinate = feat(
  "feature/rogue/assassin/assassinate", "Assassinate", 3,
  `<p>Starting at 3rd level, you have advantage on attack rolls against any creature that hasn't taken a turn in the combat yet. In addition, a number of times equal to your proficiency bonus per long rest, any hit you score against a creature that is surprised is a critical hit.</p>`,
  { uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true } },
);

export const cutthroatTactics = feat(
  "feature/rogue/assassin/cutthroat-tactics", "Cutthroat Tactics", 6,
  `<p>At 6th level, you gain the following additional Devious Strike options:</p><ul><li><strong>Poison (Cost: 1d6).</strong> The target must succeed on a Constitution saving throw or be poisoned until the end of your next turn.</li><li><strong>Lock Down (Cost: 2d6).</strong> The target must succeed on a Strength saving throw or be restrained until the end of your next turn.</li></ul>`,
);

export const opportunist = feat(
  "feature/rogue/assassin/opportunist", "Opportunist", 9,
  `<p>At 9th level, at the start of combat you can swap your initiative result with that of one willing ally you can see.</p>`,
);

export const cloakAndDagger = feat(
  "feature/rogue/assassin/cloak-and-dagger", "Cloak-and-Dagger", 13,
  `<p>Starting at 13th level, you can use your action to become invisible and hide in plain sight. You remain invisible until you make an attack, cast a spell, or move more than 10 feet.</p>`,
  { activation: { type: "action", cost: 1, condition: "" } },
);

export const deadlyStrike = feat(
  "feature/rogue/assassin/deadly-strike", "Deadly Strike", 17,
  `<p>At 17th level, when you score a critical hit with your Sneak Attack, you double all the damage of the attack (including Sneak Attack dice).</p>`,
  {
    damage: { parts: [["@scale.rogue.sneak-attack", ""]], versatile: "" },
  },
);

export const features: FeatureItem[] = [
  killersToolkit, assassinate, cutthroatTactics, opportunist, cloakAndDagger, deadlyStrike,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Assassin",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>You focus your training on the grim art of death. Those who adhere to this archetype are diverse: hired killers, spies, bounty hunters, and even specially anointed priests trained to exterminate the enemies of their deity.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "assassin",
    classIdentifier: "rogue",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(killersToolkit) }, { uuid: fUuid(assassinate) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(cutthroatTactics) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(opportunist) }]),
      createItemGrant(SC_ID, 13, [{ uuid: fUuid(cloakAndDagger) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(deadlyStrike) }]),
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
