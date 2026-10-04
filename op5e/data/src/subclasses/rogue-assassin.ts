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
  `<p>When you choose this archetype at 3rd level, you gain proficiency with the disguise kit and the poisoner's kit. The time and cost to craft disguises or poisons for you is halved.</p>`,
);

export const assassinate = feat(
  "feature/rogue/assassin/assassinate", "Assassinate", 3,
  `<p>Starting at 3rd level, you are at your deadliest when you get the drop on your enemies. You have advantage on attack rolls against any creature that hasn't taken a turn in the combat yet.</p><p>In addition, when you have advantage on an attack roll against a creature and make a successful hit with, you can choose to make that hit a critical hit. You can use this ability a number of times equal to your proficiency bonus, regaining all uses at the end of a long rest.</p>`,
  { uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true } },
);

export const cutthroatTactics = feat(
  "feature/rogue/assassin/cutthroat-tactics", "Cutthroat Tactics", 6,
  `<p>Starting at 6th level, you have a number of tools at you disposal to eliminate your targets. The following effects are added to your Devious Strike options.</p><p><strong>Poison (Cost: 2d6).</strong> You add a poison to your strike, the damage type of your Sneak attack damage dice becomes poison, and the target to make a Constitution saving throw. On a failed save, the target has the poisoned condition for 1 minute. At the end of each of its turns, the poisoned target repeats the save, ending the effect on a success.</p><p>To use this option, you must have a poisoner's kit on your person.</p><p><strong>Lock Down (Cost: 1d6).</strong> You strike the target in legs, reducing their movement speed by 15ft until the of their next turn.</p>`,
);

export const opportunist = feat(
  "feature/rogue/assassin/opportunist", "Opportunist", 9,
  `<p>Starting at 9th level, you are able to take full advantage of the battlefield, taking the opportunity for the first strike. When you roll initiative, you can choose to swap initiative rolls with a willing creature that you can see a within 60ft.</p><p>Alternatively, you can attempt to swap initiative rolls with an unwilling creature that you can see within 60ft. You must succeed on a Charisma (Deception) check contested against the creature's Wisdom (Insight) in order to do so.</p>`,
);

export const cloakAndDagger = feat(
  "feature/rogue/assassin/cloak-and-dagger", "Cloak-and-Dagger", 13,
  `<p>Starting at 13th level, you can vanish without a trace, allowing you to sneak up on just about anyone. When you attempt to hide, you can attempt to hide in plain sight. Moving more than half your movement speed while hidden in this way will reveal your position.</p>`,
);

export const deadlyStrike = feat(
  "feature/rogue/assassin/deadly-strike", "Deadly Strike", 17,
  `<p>Starting at 17th level, you become a master of instant death. When you hit a creature with an attack and score a critical hit, it must make a Constitution saving throw (DC 8 + your Dexterity modifier + your proficiency bonus). On a failed save, double the damage of your attack against the creature.</p>`,
  {
    save: { ability: "con", dc: null, scaling: "dex" },
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
    description: { value: `<p>Assassins are rogues who are stealthy killers, working from the shadows, pirates that rely on subterfuge. You become a silent killer who can disappear in a crowd and strike down enemies before they even know what hit them, wielding deadly abilities that slip them in and out of any situation.</p>`, chat: "" },
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
