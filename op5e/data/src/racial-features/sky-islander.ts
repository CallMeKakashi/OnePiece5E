import { generateId } from "../../helpers/id.js";
import type { FeatureItem } from "../../schemas/feature.js";

function rf(
  idPath: string,
  name: string,
  desc: string,
  req: string,
  extra: Partial<FeatureItem["system"]> = {},
  effects: FeatureItem["effects"] = [],
): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "race", subtype: "" },
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
      ...extra,
    },
    effects,
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null, duplicateSource: null,
      coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10",
      createdTime: null, modifiedTime: null, lastModifiedBy: null,
    },
  } as unknown as FeatureItem;
}

// ── Base ──

export const aircraftExpertise = rf(
  "feature/race/sky-islander/aircraft-expertise",
  "Aircraft Expertise",
  `<p>You have proficiency with Dial kits and expertise with Vehicles (Sky).</p>`,
  "Sky Islander",
);

export const cloudWalker = rf(
  "feature/race/sky-islander/cloud-walker",
  "Cloud Walker",
  `<p>You are naturally acclimated to high altitudes where air is thin and winds rough. You can hold your breath for twice as long, and your speed cannot be reduced by strong winds or weather-related effects.</p>`,
  "Sky Islander",
);

export const strongFaith = rf(
  "feature/race/sky-islander/strong-faith",
  "Strong Faith",
  `<p>You have advantage on saving throws against being charmed or frightened.</p>`,
  "Sky Islander",
);

// ── Birkan ──

export const ancientDials = rf(
  "feature/race/sky-islander/birkan/ancient-dials",
  "Ancient Dials",
  `<p>You have a few dials thought long extinct. You learn creations of the Necromancy or Abjuration school at certain levels. You learn a trick at 1st level. In addition, you learn a 1st-level creation at level 3, and a 2nd-level creation at level 5. You can use either of these creations with this trait a number of times equal to your proficiency bonus, regaining all uses when you finish a long rest. You can also use these creations with any creation slots you have.</p>
<p>Your creative ability for these creations is your choice of Intelligence, Wisdom, or Charisma.</p>`,
  "Sky Islander (Birkan)",
  { uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true } },
);

export const birkanProficiencies = rf(
  "feature/race/sky-islander/birkan/bonus-proficiencies",
  "Bonus Proficiencies",
  `<p>You gain proficiency in Athletics and one tool of your choice.</p>`,
  "Sky Islander (Birkan)",
);

// ── Shandian ──

export const battleDials = rf(
  "feature/race/sky-islander/shandian/battle-dials",
  "Battle Dials",
  `<p>You have a few dials thought long extinct. You learn creations of the Evocation or Illusion school at certain levels. You learn a trick at 1st level. In addition, you learn a 1st-level creation at level 3, and a 2nd-level creation at level 5. You can use either of these creations with this trait a number of times equal to your proficiency bonus, regaining all uses when you finish a long rest. You can also use these creations with any creation slots you have.</p>
<p>Your creative ability for these creations is your choice of Intelligence, Wisdom, or Charisma.</p>`,
  "Sky Islander (Shandian)",
  { uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true } },
);

export const shandianProficiencies = rf(
  "feature/race/sky-islander/shandian/bonus-proficiencies",
  "Bonus Proficiencies",
  `<p>You gain proficiency in Acrobatics and one tool of your choice.</p>`,
  "Sky Islander (Shandian)",
);

// ── Skypiean ──

export const artisanDials = rf(
  "feature/race/sky-islander/skypiean/artisan-dials",
  "Artisan Dials",
  `<p>You have a few dials thought long extinct. You learn creations of the Conjuration or Transmutation school at certain levels. You learn a trick at 1st level. In addition, you learn a 1st-level creation at level 3, and a 2nd-level creation at level 5. You can use either of these creations with this trait a number of times equal to your proficiency bonus, regaining all uses when you finish a long rest. You can also use these creations with any creation slots you have.</p>
<p>Your creative ability for these creations is your choice of Intelligence, Wisdom, or Charisma.</p>`,
  "Sky Islander (Skypiean)",
  { uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true } },
);

export const skypieanProficiencies = rf(
  "feature/race/sky-islander/skypiean/bonus-proficiencies",
  "Bonus Proficiencies",
  `<p>You gain proficiency in Engineering and one tool of your choice.</p>`,
  "Sky Islander (Skypiean)",
);

export const skyIslanderFeatures: FeatureItem[] = [
  aircraftExpertise, cloudWalker, strongFaith,
  ancientDials, birkanProficiencies,
  battleDials, shandianProficiencies,
  artisanDials, skypieanProficiencies,
];
