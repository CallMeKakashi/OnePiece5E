import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import {
  createItemChoiceRestricted,
  createItemGrant,
  mergeAdvancements,
  type AdvancementEntry,
  type ItemGrantEntry,
} from "../../helpers/advancement.js";

export interface StartingEquipmentPack {
  beri: number;
  grants: ItemGrantEntry[];
}

export function itemGear(slug: string, quantity = 1): ItemGrantEntry {
  return {
    uuid: compendiumUuid("items", generateId(`items/gear/${slug}`)),
    ...(quantity > 1 ? { quantity } : {}),
  };
}

export function itemTool(slug: string, quantity = 1): ItemGrantEntry {
  return {
    uuid: compendiumUuid("items", generateId(`items/tools/${slug}`)),
    ...(quantity > 1 ? { quantity } : {}),
  };
}

export function itemMagic(slug: string, quantity = 1): ItemGrantEntry {
  return {
    uuid: compendiumUuid("items", generateId(`items/magic/${slug}`)),
    ...(quantity > 1 ? { quantity } : {}),
  };
}

export function itemWeapon(slug: string, quantity = 1): ItemGrantEntry {
  return {
    uuid: compendiumUuid("items", generateId(`items/weapons/${slug}`)),
    ...(quantity > 1 ? { quantity } : {}),
  };
}

export function itemArmor(slug: string, quantity = 1): ItemGrantEntry {
  return {
    uuid: compendiumUuid("items", generateId(`items/armor/${slug}`)),
    ...(quantity > 1 ? { quantity } : {}),
  };
}

export function repeat(entry: ItemGrantEntry, count: number): ItemGrantEntry[] {
  if (count <= 0) return [];
  const qty = entry.quantity ?? 1;
  return [{ ...entry, quantity: qty * count }];
}

/** UUID → stack size for starting equipment (Foundry ItemGrant dedupes by UUID). */
export function grantQuantitiesMap(grants: ItemGrantEntry[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const entry of grants) {
    const qty = entry.quantity ?? 1;
    if (qty <= 1) continue;
    map[entry.uuid] = (map[entry.uuid] ?? 0) + qty;
  }
  return map;
}

function equipmentAdvancement(
  parentPath: string,
  pack: StartingEquipmentPack,
  level = 0,
): AdvancementEntry[] {
  if (!pack.grants.length) return [];
  return mergeAdvancements(
    createItemGrant(parentPath, level, pack.grants, "starting-equipment"),
  );
}

export { equipmentAdvancement };

const TIMES = String.raw`(?:&times;|×|\*|x)`;

/**
 * Match a counted item phrase such as "3 Small Medkits", "Rations ×5", or "15 Rations".
 */
function parseCountedTerm(line: string, singular: string, plural?: string): number {
  const pl = plural ?? `${singular}s`;
  const patterns = [
    new RegExp(String.raw`(\d+)\s+(?:small\s+)?${pl}\b`, "i"),
    new RegExp(String.raw`(\d+)\s+(?:small\s+)?${singular}\b`, "i"),
    new RegExp(String.raw`(?:small\s+)?${pl}\s*${TIMES}\s*(\d+)`, "i"),
    new RegExp(String.raw`(?:small\s+)?${singular}\s*${TIMES}\s*(\d+)`, "i"),
    new RegExp(String.raw`\b(?:small\s+)?${pl}\s+x\s*(\d+)`, "i"),
    new RegExp(String.raw`\b(?:small\s+)?${singular}\s+x\s*(\d+)`, "i"),
  ];
  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) return Number(match[1]);
  }
  if (new RegExp(String.raw`\b(?:small\s+)?${pl}\b`, "i").test(line)) return 1;
  if (new RegExp(String.raw`\b(?:small\s+)?${singular}\b`, "i").test(line)) return 1;
  return 0;
}

interface GearPattern {
  pattern: RegExp;
  entry: ItemGrantEntry | ((line: string) => ItemGrantEntry[]);
}

const GEAR_BY_PATTERN: GearPattern[] = [
  { pattern: /disguise\s*kit/i, entry: itemTool("disguise-kit") },
  { pattern: /forgery\s*kit/i, entry: itemTool("forgery-kit") },
  { pattern: /thieves['']?\s*tools/i, entry: itemTool("thieves-tools") },
  { pattern: /calligrapher/i, entry: itemTool("calligraphers-supplies") },
  { pattern: /cartographer/i, entry: itemTool("cartographers-tools") },
  { pattern: /navigator'?s\s*tools/i, entry: itemTool("navigators-tools") },
  { pattern: /cook'?s\s*utensils/i, entry: itemTool("cooks-utensils") },
  { pattern: /smith'?s\s*tools/i, entry: itemTool("smiths-tools") },
  { pattern: /carpenter'?s\s*tools/i, entry: itemTool("carpenters-tools") },
  { pattern: /woodcarver/i, entry: itemTool("woodcarvers-tools") },
  { pattern: /herbalism\s*kit/i, entry: itemTool("herbalism-kit") },
  { pattern: /healer'?s\s*kit/i, entry: itemGear("healers-kit") },
  { pattern: /brewer/i, entry: itemTool("brewers-supplies") },
  { pattern: /painter/i, entry: itemTool("painters-supplies") },
  { pattern: /jeweler/i, entry: itemTool("jewelers-tools") },
  { pattern: /glassblow/i, entry: itemTool("glassblowers-tools") },
  { pattern: /mason'?s\s*tools/i, entry: itemTool("masons-tools") },
  { pattern: /potter/i, entry: itemTool("potters-tools") },
  { pattern: /weaver/i, entry: itemTool("weavers-tools") },
  { pattern: /cobbler/i, entry: itemTool("cobblers-tools") },
  { pattern: /gaming\s*set/i, entry: itemTool("playing-card-set") },
  { pattern: /spyglass|telescope/i, entry: itemGear("spyglass") },
  { pattern: /lantern/i, entry: itemGear("lantern") },
  { pattern: /bullseye\s*lantern/i, entry: itemGear("lantern") },
  { pattern: /min(er'?s)?\s*pick|pick,\s*miner|pickaxe/i, entry: itemGear("pick-miners") },
  { pattern: /shovel/i, entry: itemGear("shovel") },
  { pattern: /tent/i, entry: itemGear("tent-two-person") },
  { pattern: /hammer/i, entry: itemGear("hammer") },
  { pattern: /hempen\s*rope|rope,\s*hempen/i, entry: itemGear("rope-hempen") },
  { pattern: /\brope\b/i, entry: itemGear("rope-hempen") },
  { pattern: /waterskin/i, entry: itemGear("waterskin") },
  { pattern: /mess\s*kit/i, entry: itemGear("mess-kit") },
  { pattern: /fine clothes|costume|colorful clothing/i, entry: itemGear("clothes-costume") },
  { pattern: /common clothes|traveler'?s clothes/i, entry: itemGear("clothes-common") },
  { pattern: /sea charts?/i, entry: itemGear("sea-charts-local") },
  { pattern: /inkwell|ink\s*pen/i, entry: itemGear("ink-pen") },
  { pattern: /blueprints/i, entry: itemGear("book") },
  { pattern: /recipe\s*book|catalog\s*of\s*various\s*recipes/i, entry: itemGear("recipe-book") },
  { pattern: /log\s*book|notebook|binder\s*full|devil\s*fruit\s*encyclopedia|encyclopedia|prayer\s*book|leatherbound\s*journal|scroll\s*of\s*pedigree/i, entry: itemGear("book") },
  { pattern: /boxing\s*gloves/i, entry: itemGear("boxing-gloves") },
  { pattern: /trophy/i, entry: itemGear("trophy") },
  { pattern: /memento|lucky\s*charm|trinket|charm/i, entry: itemGear("memento") },
  { pattern: /magnifying\s*glass/i, entry: itemGear("magnifying-glass") },
  { pattern: /fishing\s*tackle/i, entry: itemGear("fishing-tackle") },
  { pattern: /\bnet\b/i, entry: itemWeapon("net") },
  { pattern: /whetstone/i, entry: itemGear("whetstone") },
  { pattern: /iron\s*pot|\bpot,\s*iron\b/i, entry: itemGear("pot-iron") },
  { pattern: /flask\s*of\s*strong\s*alcohol|flask\s*or\s*tankard/i, entry: itemGear("flask-tankard") },
  { pattern: /skinning\s*knife|\bdagger\b/i, entry: itemWeapon("dagger") },
  { pattern: /handaxe|\baxe\b/i, entry: itemWeapon("handaxe") },
  { pattern: /leather\s*armor|navy\s*uniform/i, entry: itemArmor("navy-uniform") },
  { pattern: /leather\s*vest|fancy\s*leather\s*vest/i, entry: itemGear("leather-vest") },
  { pattern: /leather\s*boots|leather\s*shoes/i, entry: itemGear("leather-boots") },
  { pattern: /vestments/i, entry: itemGear("vestments") },
  { pattern: /stethoscope/i, entry: itemGear("stethoscope") },
  { pattern: /pirate\s*flag|jolly\s*roger/i, entry: itemGear("pirate-flag") },
  { pattern: /warm\s*coat|\bblanket\b/i, entry: itemGear("blanket") },
  { pattern: /wooden\s*trinket/i, entry: itemGear("wooden-trinket") },
  {
    pattern: /empty\s*glass\s*bottles?/i,
    entry: (line) => repeat(itemGear("bottle-glass"), parseCountedTerm(line, "empty glass bottle", "empty glass bottles") || 5),
  },
  {
    pattern: /incense/i,
    entry: (line) => repeat(itemGear("incense"), parseCountedTerm(line, "stick of incense", "sticks of incense") || parseCountedTerm(line, "incense") || 5),
  },
  {
    pattern: /bandages?/i,
    entry: (line) => repeat(itemGear("bandages"), parseCountedTerm(line, "bandage", "bandages")),
  },
];

/** Ship roles — explicit kits from OP5e role descriptions. */
const ROLE_EQUIPMENT: Record<string, StartingEquipmentPack & {
  choices?: Array<{ label: string; uuids: string[]; itemType?: string }>;
}> = {
  captain: {
    beri: 100_000,
    grants: [itemGear("clothes-common"), itemGear("pirate-flag"), itemGear("spyglass")],
  },
  navigator: {
    beri: 50_000,
    grants: [
      itemGear("clothes-common"),
      itemTool("cartographers-tools"),
      itemTool("navigators-tools"),
      ...repeat(itemGear("sea-charts-local"), 5),
      itemGear("ink"),
      itemGear("ink-pen"),
    ],
  },
  helmsman: {
    beri: 100_000,
    grants: [itemGear("clothes-common"), itemGear("blanket"), itemGear("memento")],
  },
  cook: {
    beri: 50_000,
    grants: [
      itemGear("clothes-common"),
      itemTool("cooks-utensils"),
      ...repeat(itemWeapon("dagger"), 3),
    ],
  },
  doctor: {
    beri: 50_000,
    grants: [
      itemGear("clothes-common"),
      itemTool("herbalism-kit"),
      itemTool("alchemists-supplies"),
      itemGear("stethoscope"),
      itemGear("book"),
    ],
  },
  musician: {
    beri: 50_000,
    grants: [itemGear("clothes-costume")],
    choices: [{
      label: "Instrument",
      itemType: "tool",
      uuids: [
        itemTool("flute").uuid,
        itemTool("guitar").uuid,
        itemTool("drum").uuid,
        itemTool("viol").uuid,
        itemTool("shamisen").uuid,
        itemTool("trumpet").uuid,
      ],
    }],
  },
  scholar: {
    beri: 100_000,
    grants: [
      itemGear("clothes-common"),
      itemGear("book"),
      itemGear("ink"),
      itemGear("ink-pen"),
      itemTool("disguise-kit"),
      itemTool("forgery-kit"),
    ],
  },
  shipwright: {
    beri: 50_000,
    grants: [itemGear("clothes-common"), itemGear("book"), itemTool("carpenters-tools")],
  },
  "master-at-arms": {
    beri: 100_000,
    grants: [itemGear("clothes-common")],
    choices: [{
      label: "Starting Weapon",
      itemType: "weapon",
      uuids: [
        itemWeapon("longsword").uuid,
        itemWeapon("cutlass").uuid,
        itemWeapon("katana").uuid,
        itemWeapon("greatsword").uuid,
        itemWeapon("quarterstaff").uuid,
      ],
    }],
  },
  deckhand: {
    beri: 50_000,
    grants: [itemGear("clothes-common"), itemGear("hammer"), itemGear("spyglass")],
  },
};

function resolveGearPattern(entry: GearPattern["entry"], line: string): ItemGrantEntry[] {
  if (typeof entry === "function") return entry(line);
  return [entry];
}

function addGrants(grants: ItemGrantEntry[], entries: ItemGrantEntry[], seen: Set<string>): void {
  for (const entry of entries) {
    const key = `${entry.uuid}:${entry.quantity ?? 1}`;
    if (seen.has(key)) continue;
    seen.add(key);
    grants.push(entry);
  }
}

/**
 * Parse the Equipment line from a background HTML description.
 */
export function parseBackgroundEquipment(desc: string): StartingEquipmentPack {
  const lineMatch = desc.match(/<strong>Equipment:<\/strong>\s*([^<]+)/i);
  const line = lineMatch?.[1] ?? "";

  const beri = Number((line.match(/([\d,]+)\s*Berri?es/i)?.[1] ?? "0").replace(/,/g, ""));
  const medkits = parseCountedTerm(line, "medkit", "medkits");
  const rations = parseCountedTerm(line, "ration", "rations");

  const grants: ItemGrantEntry[] = [
    ...repeat(itemMagic("medkit-common"), medkits),
    ...repeat(itemGear("rations"), rations),
  ];

  const seen = new Set(grants.map((g) => `${g.uuid}:${g.quantity ?? 1}`));
  for (const { pattern, entry } of GEAR_BY_PATTERN) {
    if (!pattern.test(line)) continue;
    addGrants(grants, resolveGearPattern(entry, line), seen);
  }

  return { beri, grants };
}

export function roleStartingEquipment(roleId: string): StartingEquipmentPack | null {
  const pack = ROLE_EQUIPMENT[roleId];
  if (!pack) return null;
  return { beri: pack.beri, grants: pack.grants };
}

function roleChoiceAdvancements(roleId: string, choices: NonNullable<typeof ROLE_EQUIPMENT[string]["choices"]>): AdvancementEntry[] {
  return choices.map((choice) =>
    createItemChoiceRestricted(`role/${roleId}`, 0, choice.uuids, {
      count: 1,
      label: choice.label,
      itemType: choice.itemType ?? "loot",
      restrictionType: choice.itemType ?? "loot",
    }),
  );
}

export function roleEquipmentAdvancement(roleId: string): {
  advancement: AdvancementEntry[];
  startingBeri: number;
  grantQuantities: Record<string, number>;
} {
  const pack = ROLE_EQUIPMENT[roleId];
  if (!pack) return { advancement: [], startingBeri: 0, grantQuantities: {} };
  return {
    advancement: mergeAdvancements(
      ...equipmentAdvancement(`role/${roleId}`, pack),
      ...roleChoiceAdvancements(roleId, pack.choices ?? []),
    ),
    startingBeri: pack.beri,
    grantQuantities: grantQuantitiesMap(pack.grants),
  };
}

export function backgroundEquipmentAdvancement(backgroundId: string, desc: string): {
  advancement: AdvancementEntry[];
  startingBeri: number;
  grantQuantities: Record<string, number>;
} {
  const pack = parseBackgroundEquipment(desc);
  return {
    advancement: equipmentAdvancement(`background/${backgroundId}`, pack),
    startingBeri: pack.beri,
    grantQuantities: grantQuantitiesMap(pack.grants),
  };
}
