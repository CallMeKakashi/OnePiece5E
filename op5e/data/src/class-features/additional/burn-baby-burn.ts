import type { FeatureItem } from "../../../schemas/feature.js";
import { generateId } from "../../../helpers/id.js";

function feat(
  idPath: string,
  name: string,
  description: string,
  overrides: Partial<FeatureItem["system"]> = {},
): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: overrides.requirements ?? "",
      activation: overrides.activation ?? { type: "", cost: null, condition: "" },
      duration: overrides.duration ?? { value: null, units: "" },
      target: overrides.target ?? { value: null, width: null, units: "", type: "" },
      range: overrides.range ?? { value: null, long: null, units: "" },
      uses: overrides.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: overrides.actionType ?? "",
      damage: overrides.damage ?? { parts: [], versatile: "" },
      save: overrides.save ?? { ability: "", dc: null, scaling: "spell" },
      chatFlavor: overrides.chatFlavor ?? "",
      recharge: overrides.recharge ?? { value: null, charged: false },
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null,
      duplicateSource: null,
      coreVersion: "13",
      systemId: "dnd5e",
      systemVersion: "5.1.10",
      createdTime: null,
      modifiedTime: null,
      lastModifiedBy: null,
    },
  };
}

export const burnBabyBurnFeatures: FeatureItem[] = [
  feat(
    "additional-power/burn-baby-burn",
    "Burn Baby, Burn",
    `<p><em>Prerequisite: The ability to deal fire damage.</em></p>
<p>When you witnessed the red, sparking flower bloom, engulfing everything in its path, fear did not grip your heart. Instead, that sparked adoration, obsession, blazing out of all control. You're an arsonist through and through.</p>`,
    { requirements: "Ability to deal fire damage" },
  ),
  feat(
    "additional-power/burn-baby-burn/fuel-the-fire",
    "Fuel the Fire",
    `<p>Whenever you deal fire damage to a creature or flammable object, you can, once per turn, choose to ignite it. If the target is a creature, they must make a Constitution saving throw, DC = 8 + your Constitution modifier + your proficiency bonus. On a success, they do not catch on fire. On a failure, the target is set ablaze. While the target is on fire, they take 1d6 fire damage at the start of each of their turns. If the target is a creature, they can attempt to put out the fire by stopping, dropping, and rolling. They can expend all their movement on their turn to make a Dexterity (Acrobatics) check against your Fuel the Fire DC, ending the effect on a success.</p>
<p>You can use this ability a number of times equal to 1 + your Constitution modifier, regaining all uses of this ability at the end of a short or long rest. In addition, when you deal fire damage, you ignore resistance to fire damage.</p>`,
    {
      requirements: "Burn Baby, Burn",
      uses: { value: null, max: "1 + @abilities.con.mod", per: "sr", recovery: "", prompt: true },
      save: { ability: "con", dc: null, scaling: "flat" },
    },
  ),
  feat(
    "additional-power/burn-baby-burn/numbed-nerves",
    "Numbed Nerves",
    `<p>Time and time again you've been burned, numbing you to the pain, lighting the hellfire inside you. You gain resistance to fire damage.</p>
<p>In addition, as a reaction to taking fire damage, you can choose to turn the pain from the flames into power. Instead of taking the fire damage, you gain temporary hit points equal to the fire damage from the triggering source, not counting your resistance. You can use this feature a number of times equal to 1 + your Constitution modifier, regaining all uses at the end of a short or long rest.</p>`,
    {
      requirements: "Burn Baby, Burn",
      activation: { type: "reaction", cost: 1, condition: "Taking fire damage" },
      uses: { value: null, max: "1 + @abilities.con.mod", per: "sr", recovery: "", prompt: true },
    },
  ),
  feat(
    "additional-power/burn-baby-burn/hellfire-halitosis",
    "Hellfire Halitosis",
    `<p>Starting at 5th level, you can unleash waves of fire to engulf your enemies. When you take the Attack action on your turn, you can replace one of your attacks with a gout of flames in a 15-foot cone. Each creature in that area must make a Dexterity saving throw against your Fuel the Fire DC. On a failed save, the creature takes 5d6 fire damage, or half as much on a successful save. The damage of this ability increases to 8d6 at 11th level, and 11d6 at 17th level.</p>
<p>You can use this ability a number of times equal to your proficiency bonus, regaining all uses at the end of a long rest.</p>`,
    {
      requirements: "Burn Baby, Burn 5",
      activation: { type: "action", cost: 1, condition: "Replaces one attack" },
      target: { value: 15, width: null, units: "ft", type: "cone" },
      uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
      actionType: "save",
      damage: { parts: [["5d6", "fire"]], versatile: "" },
      save: { ability: "dex", dc: null, scaling: "flat" },
    },
  ),
  feat(
    "additional-power/burn-baby-burn/pain-is-power",
    "Pain is Power",
    `<p>Also at 5th level, you can light yourself on fire as bonus action, empowering yourself for 1 minute. While you are burning, you take 2d6 fire damage at the end of each of your turns, and gain the following benefits:</p>
<ul>
<li>All your attacks deal an additional 2d6 fire damage.</li>
<li>Any damage that you take that is not fire damage, you reduce by a number equal to your Constitution modifier per instance of damage.</li>
</ul>`,
    {
      requirements: "Burn Baby, Burn 5",
      activation: { type: "bonus", cost: 1, condition: "" },
      duration: { value: 1, units: "minute" },
      target: { value: null, width: null, units: "", type: "self" },
    },
  ),
  feat(
    "additional-power/burn-baby-burn/fire-fiend",
    "Fire Fiend",
    `<p>At 10th level, your flames burn away at the weak parts of your enemies. When you hit a creature that is currently ignited by your Fuel the Fire feature, you gain a 1d6 bonus to your attack rolls against that burning target.</p>
<p>In addition, you can expend a charge of Hellfire Halitosis to conjure a bout of flames to hunt down your enemies. You use the Conjure Elemental Creation, summoning a Conjured Elemental of the Fire type, using your Constitution modifier as the creativity modifier.</p>`,
    { requirements: "Burn Baby, Burn 10" },
  ),
  feat(
    "additional-power/burn-baby-burn/fuel-the-rampage",
    "Fuel the Rampage",
    `<p>At 15th level, your crimson, unstoppable rampage is all consuming. When your hit points are at or below half your hit point maximum, you enter a rampage. This rampage lasts for 1 minute, until your hit points reach 0, or until your hit points rise above half your hit point maximum. While you are in the rampage, you gain the following benefits:</p>
<ul>
<li>When you roll fire damage, you can reroll the result once per turn.</li>
<li>You can use Fuel the Fire without expending a use, once per turn.</li>
<li>When you use your Hellfire Halitosis feature, the range increases to a 30ft cone.</li>
<li>When you use Pain's Power feature, increase the fire damage dealt and taken by 1d6, and the damage you reduce is instead reduced by double your Constitution modifier.</li>
<li>You can make an attack against a creature that is not currently on fire, as a bonus action.</li>
</ul>`,
    { requirements: "Burn Baby, Burn 15" },
  ),
  feat(
    "additional-power/burn-baby-burn/release-the-beast",
    "Release The Beast",
    `<p>At 20th level, you can burn away the last vestiges of your weaknesses, for one last moment of triumph. Once a long rest when you drop to zero hit points, you can enter Beast Mode for 1 minute. You immediately regain a number of hit points equal to half your hit point maximum and gain the following benefits for the duration of Beast Mode:</p>
<ul>
<li>You gain 66 temporary hit points.</li>
<li>You exude a 20ft radius aura of fear. Each creature of your choice within this aura and aware of it must succeed on a Wisdom saving throw against your Fuel the Fire DC, or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to this effect for the next 24 hours.</li>
<li>Once on each of your turns, when you attack with a weapon attack using the Attack action, you can make one additional attack as part of the same action.</li>
<li>When you hit a creature under the effects of your Fuel the Fire feature, your attacks deal an additional 10 fire damage against it.</li>
<li>When you deal fire damage against a creature that is immune to fire damage, you can treat the immunity as resistance instead.</li>
<li>You can use your Numbed Nerves feature without expending any of its uses.</li>
<li>You can use the Vengeful Flames creation at will at first level.</li>
</ul>`,
    {
      requirements: "Burn Baby, Burn 20",
      uses: { value: null, max: "1", per: "lr", recovery: "", prompt: true },
    },
  ),
];
