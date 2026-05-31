import { itemGear, itemTool, itemWeapon } from "../backgrounds/equipment-grants.js";

/** dnd5e Trait advancement keys — artisan's tools (PHB set). */
export const ARTISAN_TOOL_TRAITS = [
  "tool:alchemist", "tool:brewer", "tool:calligrapher", "tool:carpenter",
  "tool:cartographer", "tool:cobbler", "tool:cook", "tool:glassblower",
  "tool:jeweler", "tool:leatherworker", "tool:mason", "tool:painter",
  "tool:potter", "tool:smith", "tool:tinker", "tool:weaver", "tool:woodcarver",
] as const;

/** dnd5e Trait advancement keys — musical instruments. */
export const MUSICAL_INSTRUMENT_TRAITS = [
  "tool:bagpipes", "tool:drum", "tool:dulcimer", "tool:flute",
  "tool:lute", "tool:lyre", "tool:horn", "tool:panflute",
  "tool:shawm", "tool:viol",
] as const;

/** dnd5e 5.x Trait advancement wildcards (see official monk/bard class data). */
export const ARTISAN_TOOL_TRAIT_POOL = ["tool:art:*"] as const;
export const MUSICAL_INSTRUMENT_TRAIT_POOL = ["tool:music:*"] as const;
export const ARTISAN_OR_MUSICAL_TOOL_TRAIT_POOL = [
  ...ARTISAN_TOOL_TRAIT_POOL,
  ...MUSICAL_INSTRUMENT_TRAIT_POOL,
] as const;

const SIMPLE_WEAPON_SLUGS = [
  "club", "dagger", "greatclub", "handaxe", "javelin", "light-hammer",
  "mace", "quarterstaff", "sickle", "spear", "crossbow-light", "dart", "shortbow", "sling",
  "flintlock", "musket",
] as const;

export const SIMPLE_WEAPON_UUIDS = SIMPLE_WEAPON_SLUGS.map((slug) => itemWeapon(slug).uuid);

const MARTIAL_MELEE_SLUGS = [
  "longsword", "cutlass", "katana", "greatsword", "greataxe", "mace", "quarterstaff", "shortsword",
  "rapier", "scimitar", "warhammer", "battleaxe",
] as const;

export const MARTIAL_MELEE_UUIDS = MARTIAL_MELEE_SLUGS.map((slug) => itemWeapon(slug).uuid);

const RANGED_WEAPON_SLUGS = [
  "shortbow", "longbow", "crossbow-light", "crossbow-hand", "crossbow-heavy",
  "sling", "dart", "flintlock", "musket", "rifle", "pistol", "revolver", "shotgun",
] as const;

export const RANGED_WEAPON_UUIDS = RANGED_WEAPON_SLUGS.map((slug) => itemWeapon(slug).uuid);

export const ADVENTURING_PACK_UUIDS = [
  itemGear("dungeoneers-pack").uuid,
  itemGear("explorers-pack").uuid,
] as const;

export const SCHOLAR_OR_EXPLORER_PACK_UUIDS = [
  itemGear("scholars-pack").uuid,
  itemGear("explorers-pack").uuid,
] as const;

export const DIPLOMAT_OR_EXPLORER_PACK_UUIDS = [
  itemGear("diplomats-pack").uuid,
  itemGear("explorers-pack").uuid,
] as const;

export const ROGUE_PACK_UUIDS = [
  itemGear("burglars-pack").uuid,
  itemGear("dungeoneers-pack").uuid,
  itemGear("explorers-pack").uuid,
] as const;

export const MUSICAL_INSTRUMENT_UUIDS = [
  "flute", "lute", "lyre", "horn", "drum", "viol", "guitar", "shamisen", "trumpet",
  "bagpipes", "dulcimer", "tambourine",
].map((slug) => itemTool(slug).uuid);

export const ARTISAN_TOOL_UUIDS = ARTISAN_TOOL_TRAITS.map((trait) => {
  const slugMap: Record<string, string> = {
    "tool:alchemist": "alchemists-supplies",
    "tool:brewer": "brewers-supplies",
    "tool:calligrapher": "calligraphers-supplies",
    "tool:carpenter": "carpenters-tools",
    "tool:cartographer": "cartographers-tools",
    "tool:cobbler": "cobblers-tools",
    "tool:cook": "cooks-utensils",
    "tool:glassblower": "glassblowers-tools",
    "tool:jeweler": "jewelers-tools",
    "tool:leatherworker": "leatherworkers-tools",
    "tool:mason": "masons-tools",
    "tool:painter": "painters-supplies",
    "tool:potter": "potters-tools",
    "tool:smith": "smiths-tools",
    "tool:tinker": "tinkers-tools",
    "tool:weaver": "weavers-tools",
    "tool:woodcarver": "woodcarvers-tools",
  };
  return itemTool(slugMap[trait] ?? trait.replace("tool:", "")).uuid;
});
