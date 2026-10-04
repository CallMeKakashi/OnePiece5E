import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/rogue/ringmaster";

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
      requirements: `Rogue (Ringmaster) ${level}`,
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

export const grandShowman = feat(
  "feature/rogue/ringmaster/grand-showman", "Grand Showman", 3,
  `<p>Starting at 3rd Level, you gain proficiency in Charisma (Performance) checks and a musical instrument of your choice. If you were already proficient in Perfomance and a musical instrument, you instead gain expertise. In addition, you learn two tricks from the Bard Creation List, using your Charisma modifier as the creative ability score, and a musical instrument as your creative apparatus.</p>`,
);

export const openingAct = feat(
  "feature/rogue/ringmaster/opening-act", "Opening Act", 3,
  `<p>When you choose this archetype at 3rd Level, you can set the stage, encouraging your allies to put their best foot forwards and take the spotlight.</p><p>As a bonus action, you can forgo your ability to sneak attack for your turn, to highlight an allied creature that can hear you for success, within a 60ft range. When that allied creature sucessfully hits with an attack, they can add your sneak attack damage to their damage roll, along with your choice of one of the following effects:</p><ul><li>The allied creature's critical hit range is 19-20 for that attack.</li><li>The allied creature's target has their next attack roll, ability check, or saving throw is reduced by 1d6.</li><li>If you and the allied creature are within 30ft of each other, you can choose to swap places with them.</li></ul><p>A creature benefits from this until they make a successful hit, or until the end of their next turn, losing the benefits afterwards.</p>`,
);

export const circusTricks = feat(
  "feature/rogue/ringmaster/circus-tricks", "Circus Tricks", 6,
  `<p>Starting at 6th level, through flashy charisma and maybe a bit of luck, you can outwit your opponents at any turn. The following effects are added to your Devious Strike options.</p><p><strong>Acrobatics (Cost: 2d6).</strong> After making the attack, your jump distance is tripled until the end of your turn.</p><p><strong>Juggling (Cost: 2d6).</strong> You quickly juggle various items in your hands to take rapidly take action. You take the Use an Object action, or to use an item that normally requires an action (such as a Small Medkit), as part of the attack.</p><p>In addition, the creature you've chosen for your Opening Act ability also can apply any Devious Strikes options you know, following the same rules.</p>`,
);

export const masterDirector = feat(
  "feature/rogue/ringmaster/master-director", "Master Director", 9,
  `<p>Starting at 9th level, your abilities to direct people in combat improve, both in and out of combat. You gain the following abilities:</p><ul><li>As a reaction to a creature, that can hear you and is within 60ft of you, being hit by an attack, you can halve the damage of the attack against them.</li><li>As a reaction to a creature, that can hear you and is within 60ft of you, failing a saving throw, you can make them reroll the saving throw at advantage.</li><li>As a reaction to a creature, that can hear you and is within 60ft of you, failing an ability check, you can add your Charisma modifier to the result.</li></ul><p>You can use this feature a number of times equal to your proficiency bonus, regaining all uses on a short or long rest.</p>`,
  {
    activation: { type: "reaction", cost: 1, condition: "A creature that can hear you within 60ft is hit by an attack, fails a saving throw, or fails an ability check" },
    uses: { value: null, max: "@prof", per: "sr", recovery: "", prompt: true },
  },
);

export const denouement = feat(
  "feature/rogue/ringmaster/denouement", "Denouement", 13,
  `<p>By 13th level, your closing act is just as potent as your opening act. Whenever you, or the allied creature under the effect of your Opening Act feature reduces a creature to 0 hit points, or lands a critical hit, you can cause on of the following effects to occur:</p><ul><li>The creature that made the attack gains a number of temporary hit points equal to your level.</li><li>The creature's next attack deals additional damage equal to your level.</li><li>The creature can move 30ft in a direction of their choice without provoking opportunity attacks.</li></ul><p>You can use this feature a number of times equal to your proficiency bonus, regaining all uses on a short or long rest.</p>`,
  { uses: { value: null, max: "@prof", per: "sr", recovery: "", prompt: true } },
);

export const seriousSpectacle = feat(
  "feature/rogue/ringmaster/serious-spectacle", "Serious Spectacle", 17,
  `<p>At 17th level, you and your allies really know how to make a killing. When you use your Opening Act feature, you can target two allied creatures instead of one.</p>`,
);

export const features: FeatureItem[] = [
  grandShowman, openingAct, circusTricks, masterDirector, denouement, seriousSpectacle,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Ringmaster",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>When putting on a truly grand performance, one must be able to manage all the acts and moving parts</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "ringmaster",
    classIdentifier: "rogue",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(grandShowman) }, { uuid: fUuid(openingAct) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(circusTricks) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(masterDirector) }]),
      createItemGrant(SC_ID, 13, [{ uuid: fUuid(denouement) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(seriousSpectacle) }]),
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
