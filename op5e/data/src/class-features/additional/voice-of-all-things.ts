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

export const voiceOfAllThingsFeatures: FeatureItem[] = [
  feat(
    "additional-power/voice-of-all-things",
    "Voice of All Things",
    `<p><em>Prerequisites: Special</em></p>
<p>The voice of all things is a mysterious ability that only a few individuals ever have the opportunity to unlock. The voice of all things is an ability that centers around understanding the world around you, the thoughts, desires, and goals of beasts, people, and even notable objects, all of these things speak out to those who have the gift.</p>
<p>This is not to be confused with being able to speak the language of beasts and such, as there is no audible speech. Only an unintelligible noise that is imperceptible to nearly all. The same goes for written text, only being able to sense its significance, though it is believed that through training, a person can hope to reach true understanding. Few can awaken this ability, and even among the Three-Eyed Tribe, who allegedly possess the ability innately, must train to use it.</p>`,
    { requirements: "Special" },
  ),
  feat(
    "additional-power/voice-of-all-things/universal-language",
    "Universal Language",
    `<p>Starting at 1st level, you begin to hear the whispers. You have the innate ability to hear the "voice" of animals and inanimate objects, instinctually understanding the meaning behind the sounds and gestures of animals, or any imagery or written language upon an object, including poneglyphs. You gain no additional benefits to communicate back with beasts and objects through this feature, nor any ability to coerce them to communicate with you.</p>`,
    { requirements: "Voice of All Things 1" },
  ),
  feat(
    "additional-power/voice-of-all-things/guidance-of-the-world",
    "Guidance of the World",
    `<p>Also at 5th level, you can ask the DM one question relegated to a specific object, place, or creature that you are trying to find. The DM then gives you one truthful answer that guides you in the direction of the thing you are looking for. You are not made aware of any dangers waiting on the path, nor does the answer you receive take into account any changes that might occur as a result of an action taken by another player or NPC.</p>
<p>Once you use this feature, you cannot do so again until 7 days have passed since you last used it. At 10th level, your training with the voice allows you to use this feature once per long rest. At 15th level, once per short rest. At 20th level, you may use it as many times as you wish.</p>`,
    {
      requirements: "Voice of All Things 5",
      activation: { type: "action", cost: 1, condition: "" },
    },
  ),
  feat(
    "additional-power/voice-of-all-things/silent-speech",
    "Silent Speech",
    `<p>Beginning at 10th level, you begin to speak the voice of all things, allowing you to breach any barrier such as species, physical barriers, and even consciousness.</p>
<p>You can speak telepathically to any creature within 60 feet of you. Your telepathic utterances are understood by any creature. Your communication doesn't give the creature the ability to respond to you telepathically. This feature fails if you are incapacitated.</p>
<p>At 15th level, your speech reaches farther than ever. Your range of this ability increases to 120ft, and you can now use this feature even when you are incapacitated.</p>
<p>At 20th level, your range with this ability becomes 1 mile.</p>`,
    {
      requirements: "Voice of All Things 10",
      range: { value: 60, long: null, units: "ft" },
    },
  ),
];
