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

export const eightImpactsFistFeatures: FeatureItem[] = [
  feat(
    "additional-power/eight-impacts-fist",
    "Eight Impacts Fist",
    `<p>Eight Impacts Fist is an unarmed martial art originating from the Kano kingdom where the user's unarmed strikes become concussive shockwaves. The users can manipulate these shockwaves to shatter even the hardest of armor.</p>`,
    { requirements: "" },
  ),
  feat(
    "additional-power/eight-impacts-fist/first-impacts",
    "First Impacts",
    `<p>When you first gain this additional power, you begin transforming the force of your fists into deadly vibrations. When you make an unarmed strike, you can choose to instead deal thunder damage. When you do this, your attack has the Siege property, dealing double damage to objects and structures and ignoring an object's damage threshold.</p>`,
    { requirements: "Eight Impacts Fist" },
  ),
  feat(
    "additional-power/eight-impacts-fist/thunderstruck",
    "Thunderstruck",
    `<p>At 5th level, your thunderous blows improve. When you make an unarmed strike, you can choose to imbue it with thunder. You make the unarmed strike with advantage and it deals an additional 1d8 thunder damage. You can only use this ability a number of times equal to your proficiency bonus, regaining uses on a short or long rest.</p>`,
    {
      requirements: "Eight Impacts Fist 5",
      uses: { value: null, max: "@prof", per: "sr", recovery: "", prompt: true },
      damage: { parts: [["1d8", "thunder"]], versatile: "" },
    },
  ),
  feat(
    "additional-power/eight-impacts-fist/thunderous-blows",
    "Thunderous Blows",
    `<p>At 10th level, you can unleash a flurry of thunderous blows. This feature replaces Thunderstruck. At the start of your turn, you can choose to imbue all your unarmed strikes with thunderous energy until the end of your turn. Your attacks with unarmed strikes are rolled with advantage, ignore half and three-quarters cover that is not haki imbued (shields included), and those attacks deal each an extra 1d8 thunder damage.</p>
<p>You can use this feature a number of times equal to your proficiency bonus, regaining all uses on a long rest.</p>`,
    {
      requirements: "Eight Impacts Fist 10",
      uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
      damage: { parts: [["1d8", "thunder"]], versatile: "" },
    },
  ),
  feat(
    "additional-power/eight-impacts-fist/deep-impact",
    "Deep Impact",
    `<p>At 15th level, the range of your shockwaves increases. Once per turn, when you use your First Impacts feature, you can give an unarmed strike a damage spread of 5ft. The damage spread DC equals 8 + your Strength or Dexterity modifier + your proficiency bonus. You are unaffected by this damage spread.</p>`,
    { requirements: "Eight Impacts Fist 15" },
  ),
  feat(
    "additional-power/eight-impacts-fist/eighth-impact",
    "Eighth Impact",
    `<p>At 20th level, you have mastered the eight impacts style. Your critical hit range with unarmed strikes when you use your First Impact feature increases by 1. Additionally, your Thunderous Blows uses now come back on a short or long rest.</p>`,
    { requirements: "Eight Impacts Fist 20" },
  ),
];
