import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/barbarian/totem-warrior";

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
      requirements: `Barbarian (Totem Warrior) ${level}`,
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

export const beastSpeech = feat(
  "feature/barbarian/totem-warrior/beast-speech", "Beast Speech", 3,
  `<p>Your attunement to the natural world grants you a kinship with beasts. At 3rd level when you adopt this path, you gain the ability to speak with all beasts, and understand what they say as well.</p>`,
);

export const primalTotem = feat(
  "feature/barbarian/totem-warrior/primal-totem", "Primal Totem", 3,
  `<p>At 3rd level, when you adopt this path, you choose a totem beast to symbolize your strength and spirit, gaining its features.</p>
<ul>
<li><strong>Bear.</strong> While raging, you have resistance to a number of damage types equal to your proficiency bonus, except force and psychic damage. You choose these types when you gain this feature, and each time your proficiency bonus increases.</li>
<li><strong>Elk.</strong> While you're raging and aren't wearing heavy armor, your walking speed increases by 15 feet.</li>
<li><strong>Eagle.</strong> While you're raging and aren't wearing heavy armor, other creatures have disadvantage on opportunity attack rolls against you, and you can use the Dash action as a bonus action on your turn. You can also Dash when you enter your rage.</li>
<li><strong>Tiger.</strong> While you're raging, if you move at least 20 feet in a straight line towards a target that is no more than 1 size larger than you, that target must succeed on a Strength saving throw (DC 8 + your proficiency bonus + your Strength modifier) or be knocked prone. If the target is prone, you can make 1 melee attack against it as a bonus action.</li>
<li><strong>Wolf.</strong> While you're raging, your allies have advantage on melee attack rolls against any creature within 5 feet of you that is hostile to you.</li>
<li><strong>Shark.</strong> While raging, when you make a melee weapon attack using Strength against a creature that is below its hit point maximum, you gain a bonus to the damage roll equal to your rage damage bonus.</li>
</ul>`,
);

export const ancientAspect = feat(
  "feature/barbarian/totem-warrior/ancient-aspect", "Ancient Aspect", 6,
  `<p>At 6th level, you gain another benefit based on the totem animal of your choice. You can choose the same animal you selected at 3rd level or a different one.</p>
<ul>
<li><strong>Bear.</strong> You count as one size larger when determining your carrying capacity and the weight you can push, drag, lift, and for grapple and shove attempts.</li>
<li><strong>Elk.</strong> Whether mounted or on foot, your travel pace is doubled, as is the travel pace of up to ten companions while they're within 60 feet of you and you're not incapacitated.</li>
<li><strong>Eagle.</strong> You can see up to 1 mile away with no difficulty, able to discern even fine details as though looking at something no more than 100 feet away from you. Additionally, dim light doesn't impose disadvantage on your Wisdom (Perception) checks.</li>
<li><strong>Tiger.</strong> You gain proficiency in two skills from the following list: Athletics, Acrobatics, Stealth, and Survival. If you were already proficient in these skills, you can instead gain expertise respectively.</li>
<li><strong>Wolf.</strong> You can track other creatures while traveling at a fast pace, and you can move stealthily while traveling at a normal pace.</li>
<li><strong>Shark.</strong> You gain a swim speed equal to your current walking speed. Additionally, you gain the ability to hold your breath for 1 hour.</li>
</ul>`,
);

export const voraciousVelocity = feat(
  "feature/barbarian/totem-warrior/voracious-velocity", "Voracious Velocity", 10,
  `<p>At 10th level, your beast-like prowess grants you the ability to maneuver past any obstacle. Your speed increases by 10 ft, you gain a climbing speed equal to your movement speed, and you can add 10 feet to your long jump distance and 3 feet to your high jump distance.</p>
<p>Additionally, while raging, you ignore the effects of any and all difficult terrain.</p>`,
);

export const totemAttuned = feat(
  "feature/barbarian/totem-warrior/totem-attuned", "Totem Attuned", 14,
  `<p>At 14th level, you gain another benefit based on a totem animal of your choice. You can choose the same animal you selected previously or a different one.</p>
<ul>
<li><strong>Bear.</strong> While you're raging, any creature within 5 feet of you that's hostile to you has disadvantage on attack rolls against targets other than you or another character with this feature. An enemy is immune to this effect if it can't see or hear you or if it can't be frightened.</li>
<li><strong>Elk.</strong> While raging, you can use a bonus action during your move to pass through the space of a Large or smaller creature. That creature must succeed on a Strength saving throw (DC 8 + your Strength bonus + your proficiency bonus) or be knocked prone and take bludgeoning damage equal to 1d12 + your Strength modifier + your Rage damage.</li>
<li><strong>Eagle.</strong> While raging, you have a flying speed equal to your current walking speed.</li>
<li><strong>Tiger.</strong> While raging, at the end of each of your turns, you can make a stealth check to attempt to hide as a free action. When hiding in this way, you can hide in dim light, behind a creature that is of equal size, essentially anytime you are lightly obscured.</li>
<li><strong>Wolf.</strong> While you're raging, you can use a bonus action on your turn to knock a Large or smaller creature prone when you hit it with a melee weapon attack.</li>
<li><strong>Shark.</strong> While raging, you have advantage on melee attack rolls against any creature that doesn't have all its Hit Points.</li>
</ul>`,
);

export const features: FeatureItem[] = [
  beastSpeech, primalTotem, ancientAspect, voraciousVelocity, totemAttuned,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Path of the Totem Warrior",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>While some barbarian's strength makes them seem like a wild beast, most tend to remain human in spirit. Those who follow the totem warrior's path take inspiration from many beasts in their battles, having spent many years understanding their methods of the hunt, becoming essentially second nature.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "totem-warrior",
    classIdentifier: "barbarian",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(beastSpeech) }, { uuid: fUuid(primalTotem) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(ancientAspect) }]),
      createItemGrant(SC_ID, 10, [{ uuid: fUuid(voraciousVelocity) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(totemAttuned) }]),
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
