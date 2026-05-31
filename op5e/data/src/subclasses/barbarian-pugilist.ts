import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/barbarian/pugilist";

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
      requirements: `Barbarian (Pugilist) ${level}`,
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

export const fistsOfFury = feat(
  "feature/barbarian/pugilist/fists-of-fury", "Fists of Fury", 3,
  `<p>At 3rd level, the strike of your fists grow more potent, and each punch resounds a challenge to the creature you strike.</p>
<p>You can roll a d6 in place of the normal damage of your unarmed strikes. If you aren't wielding a weapon or a shield, you can roll a d8 instead.</p>
<p>Additionally, when you hit a creature with an unarmed strike while raging, that creature has disadvantage on attack rolls against creatures other than you until the start of your next turn.</p>`,
);

export const roughAndTumble = feat(
  "feature/barbarian/pugilist/rough-and-tumble", "Rough and Tumble", 3,
  `<p>Also at 3rd level, your all out offensive techniques make you a force to be reckoned with. When you use your Reckless Attack feature and successfully hit a creature with an unarmed strike, and the target is no more than one size category larger than you, that creature becomes grappled by you.</p>`,
);

export const interceptingStrike = feat(
  "feature/barbarian/pugilist/intercepting-strike", "Intercepting Strike", 6,
  `<p>At 6th level, your quick reflexes allow you to intercept enemies aiming for your allies.</p>
<p>While raging, when a creature targets an ally within 30 feet with an attack, you can immediately use your reaction to move up to half your speed and make a single unarmed strike against the attacking creature if you're within range. You can take this reaction before the creature rolls to attack.</p>`,
  {
    activation: { type: "reaction", cost: 1, condition: "While raging, ally within 30 ft targeted" },
  },
);

export const audaciousFury = feat(
  "feature/barbarian/pugilist/audacious-fury", "Audacious Fury", 6,
  `<p>Beginning at 6th level, your wild howls while raging bolster you against any and all fear, your allies relieved that you're on their side.</p>
<p>While raging, you exude a 10 ft radius aura. Each creature of your choice (including yourself) within the radius cannot be frightened.</p>`,
);

export const readyToRumble = feat(
  "feature/barbarian/pugilist/ready-to-rumble", "Ready to Rumble", 10,
  `<p>At 10th level, your potent swings allow you to hit your foes hard and fast.</p>
<p>You can roll a d8 in place of the normal damage of your unarmed strikes. If you aren't wielding a weapon or a shield, you can roll a d10 instead.</p>
<p>Once per turn, if you take the Attack action on your turn and have advantage on an attack roll, you can forgo the advantage for that roll to make an additional unarmed strike as part of the same action.</p>`,
);

export const deathDefying = feat(
  "feature/barbarian/pugilist/death-defying", "Death Defying", 14,
  `<p>Beginning at 14th level, you refuse to fall while battle is still at hand.</p>
<p>While you're raging, having 0 Hit Points doesn't knock you unconscious. You still must make death saving throws, and you suffer the normal effects of taking damage while at 0 hit points. However, if you would die due to failing death saving throws, you don't die until your rage ends, and you die then only if you still have 0 hit points.</p>`,
);

export const features: FeatureItem[] = [
  fistsOfFury, roughAndTumble, interceptingStrike, audaciousFury, readyToRumble, deathDefying,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Path of the Pugilist",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Most barbarians seek out the most brutal weapon they can find to wield in battle. Those that follow the path of the pugilist have concluded that their own muscles are the deadliest weapon of all. Perhaps the craziest of all barbarians, these pugilists rush into battle with neither weapon nor armor, their rage more like euphoric laughter than a roaring howl as they revel in the battle ahead.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "pugilist",
    classIdentifier: "barbarian",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(fistsOfFury) }, { uuid: fUuid(roughAndTumble) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(interceptingStrike) }, { uuid: fUuid(audaciousFury) }]),
      createItemGrant(SC_ID, 10, [{ uuid: fUuid(readyToRumble) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(deathDefying) }]),
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
