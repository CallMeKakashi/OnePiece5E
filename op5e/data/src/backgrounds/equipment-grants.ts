import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import {
  createItemGrant,
  mergeAdvancements,
  type AdvancementEntry,
  type ItemGrantEntry,
} from "../../helpers/advancement.js";

export interface StartingEquipmentPack {
  beri: number;
  grants: ItemGrantEntry[];
}

function itemGear(slug: string): ItemGrantEntry {
  return { uuid: compendiumUuid("items", generateId(`items/gear/${slug}`)) };
}

function itemTool(slug: string): ItemGrantEntry {
  return { uuid: compendiumUuid("items", generateId(`items/tools/${slug}`)) };
}

function itemMagic(slug: string): ItemGrantEntry {
  return { uuid: compendiumUuid("items", generateId(`items/magic/${slug}`)) };
}

function repeat(entry: ItemGrantEntry, count: number): ItemGrantEntry[] {
  return Array.from({ length: Math.max(0, count) }, () => ({ ...entry }));
}

function equipmentAdvancement(
  parentPath: string,
  pack: StartingEquipmentPack,
): AdvancementEntry[] {
  if (!pack.grants.length) return [];
  return mergeAdvancements(
    createItemGrant(parentPath, 0, pack.grants, "starting-equipment"),
  );
}

const GEAR_BY_PATTERN: [RegExp, ItemGrantEntry][] = [
  [/disguise\s*kit/i, itemTool("disguise-kit")],
  [/forgery\s*kit/i, itemTool("forgery-kit")],
  [/thieves['']?\s*tools/i, itemTool("thieves-tools")],
  [/calligrapher/i, itemTool("calligraphers-supplies")],
  [/cartographer/i, itemTool("cartographers-tools")],
  [/navigator'?s\s*tools/i, itemTool("navigators-tools")],
  [/cook'?s\s*utensils/i, itemTool("cooks-utensils")],
  [/smith'?s\s*tools/i, itemTool("smiths-tools")],
  [/carpenter'?s\s*tools/i, itemTool("carpenters-tools")],
  [/woodcarver/i, itemTool("woodcarvers-tools")],
  [/herbalism\s*kit/i, itemTool("herbalism-kit")],
  [/healer'?s\s*kit/i, itemGear("healers-kit")],
  [/brewer/i, itemTool("brewers-supplies")],
  [/painter/i, itemTool("painters-supplies")],
  [/jeweler/i, itemTool("jewelers-tools")],
  [/glassblow/i, itemTool("glassblowers-tools")],
  [/mason'?s\s*tools/i, itemTool("masons-tools")],
  [/potter/i, itemTool("potters-tools")],
  [/weaver/i, itemTool("weavers-tools")],
  [/cobbler/i, itemTool("cobblers-tools")],
  [/spyglass|telescope/i, itemGear("spyglass")],
  [/lantern/i, itemGear("lantern")],
  [/min(er'?s)?\s*pick|pick,\s*miner/i, itemGear("pick-miners")],
  [/shovel/i, itemGear("shovel")],
  [/tent/i, itemGear("tent-two-person")],
  [/hammer/i, itemGear("hammer")],
  [/rope/i, itemGear("rope-hempen")],
  [/waterskin/i, itemGear("waterskin")],
  [/mess\s*kit/i, itemGear("mess-kit")],
  [/fine clothes|costume|colorful clothing/i, itemGear("clothes-costume")],
  [/common clothes|traveler'?s clothes/i, itemGear("clothes-common")],
  [/sea charts?/i, itemGear("sea-charts-local")],
  [/inkwell|ink\s*pen/i, itemGear("ink-pen")],
  [/blueprints/i, itemGear("book")],
];

/** Ship roles — explicit kits from OP5e role descriptions. */
const ROLE_EQUIPMENT: Record<string, StartingEquipmentPack> = {
  captain: {
    beri: 100_000,
    grants: [itemGear("clothes-common"), itemGear("spyglass")],
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
    grants: [itemGear("clothes-common"), itemGear("blanket")],
  },
  cook: {
    beri: 50_000,
    grants: [itemGear("clothes-common"), itemTool("cooks-utensils")],
  },
  doctor: {
    beri: 50_000,
    grants: [itemGear("clothes-common"), itemTool("herbalism-kit"), itemGear("book")],
  },
  musician: {
    beri: 50_000,
    grants: [itemGear("clothes-costume")],
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
  },
  deckhand: {
    beri: 50_000,
    grants: [itemGear("clothes-common"), itemGear("hammer"), itemGear("spyglass")],
  },
};

/**
 * Parse the Equipment line from a background HTML description.
 */
export function parseBackgroundEquipment(desc: string): StartingEquipmentPack {
  const lineMatch = desc.match(/<strong>Equipment:<\/strong>\s*([^<]+)/i);
  const line = lineMatch?.[1] ?? "";

  const beri = Number((line.match(/([\d,]+)\s*Berri?es/i)?.[1] ?? "0").replace(/,/g, ""));
  const medkits = Number(
    line.match(/Medkits?\s*(?:&times;|×|x)?\s*(\d+)/i)?.[1] ??
      (/\bmedkit\b/i.test(line) && !/Medkits?\s*(?:&times;|×|x)?\s*0/i.test(line) ? 1 : 0),
  );
  const rations = Number(line.match(/Rations?\s*(?:&times;|×|x)?\s*(\d+)/i)?.[1] ?? 0);

  const grants = [
    ...repeat(itemMagic("medkit-common"), medkits),
    ...repeat(itemGear("rations"), rations),
  ];

  const seen = new Set(grants.map((g) => g.uuid));
  for (const [pattern, entry] of GEAR_BY_PATTERN) {
    if (!pattern.test(line)) continue;
    if (seen.has(entry.uuid)) continue;
    seen.add(entry.uuid);
    grants.push(entry);
  }

  return { beri, grants };
}

export function roleStartingEquipment(roleId: string): StartingEquipmentPack | null {
  return ROLE_EQUIPMENT[roleId] ?? null;
}

export function roleEquipmentAdvancement(roleId: string): {
  advancement: AdvancementEntry[];
  startingBeri: number;
} {
  const pack = roleStartingEquipment(roleId);
  if (!pack) return { advancement: [], startingBeri: 0 };
  return {
    advancement: equipmentAdvancement(`role/${roleId}`, pack),
    startingBeri: pack.beri,
  };
}

export function backgroundEquipmentAdvancement(backgroundId: string, desc: string): {
  advancement: AdvancementEntry[];
  startingBeri: number;
} {
  const pack = parseBackgroundEquipment(desc);
  return {
    advancement: equipmentAdvancement(`background/${backgroundId}`, pack),
    startingBeri: pack.beri,
  };
}
