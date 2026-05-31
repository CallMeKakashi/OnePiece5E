import type { FeatureItem, FeatureSystem } from "../schemas/feature.js";

/** Stable activity id used by dnd5e 5.1 migration (`staticID("dnd5eactivity")`). */
export const PRIMARY_ACTIVITY_ID = "dnd5eactivity000";

/** Must match `OP5E_FLAMING_DUALITY_ACTIVITY_IDS` in scripts/feature-ids.mjs. */
export const FLAMING_DUALITY_IGNITED_ACTIVITY_ID = "op5efdualityign";
export const FLAMING_DUALITY_GODSPEED_ACTIVITY_ID = "op5efdualitygod";

type ActivityType = "utility" | "heal" | "save" | "damage" | "attack" | "check";

interface LegacyUses {
  value?: number | null;
  max?: string;
  per?: string | null;
  recovery?: string;
  prompt?: boolean;
}

interface ActivitySource {
  name: string;
  type: string;
  effects?: { _id: string; transfer?: boolean; type?: string; flags?: Record<string, unknown> }[];
  system: FeatureSystem & { activities?: Record<string, unknown> };
}

/** Whether this feature should expose a dnd5e 5.1 activity (Use button). */
export function needsActivity(system: FeatureSystem): boolean {
  const activation = system.activation?.type;
  if (activation && activation !== "none") return true;
  if (system.uses?.max) return true;
  if (system.actionType) return true;
  if (system.damage?.parts?.length) return true;
  if (system.save?.ability) return true;
  return false;
}

/** Map legacy actionType to dnd5e activity type (matches base-activity migration). */
export function resolveActivityType(system: FeatureSystem): ActivityType {
  const map: Record<string, ActivityType> = {
    mwak: "attack",
    rwak: "attack",
    msak: "attack",
    rsak: "attack",
    abil: "check",
    save: "save",
    heal: "heal",
  };

  let type: ActivityType = map[system.actionType] ?? "utility";
  if (type === "utility" && system.damage?.parts?.length) type = "damage";
  return type;
}

/** Parse legacy damage/heal parts into dnd5e 5.1 damage-field shape. */
export function transformDamagePart([formula, type]: [string, string]) {
  const data = {
    number: null as number | null,
    denomination: null as number | null,
    bonus: "",
    types: type ? [type] : [] as string[],
    custom: { enabled: false, formula: "" },
    scaling: { mode: "", number: null as number | null, formula: "" },
  };

  const parsed = (formula ?? "").match(/^\s*(\d+)d(\d+)(?:\s*([+|-])\s*(.+))?\s*$/i);
  if (parsed) {
    data.number = Number(parsed[1]);
    data.denomination = Number(parsed[2]);
    if (parsed[4]) data.bonus = parsed[3] === "-" ? `-${parsed[4].trim()}` : parsed[4].trim();
  } else if (formula) {
    data.custom.enabled = true;
    data.custom.formula = formula;
  }

  return data;
}

function transformActivation(source: ActivitySource) {
  const activation = source.system.activation ?? { type: "", cost: null, condition: "" };
  return {
    type: activation.type === "none" ? "" : (activation.type ?? ""),
    value: activation.cost ?? null,
    condition: activation.condition ?? "",
    override: false,
  };
}

function transformConsumption(source: ActivitySource) {
  const targets: Record<string, unknown>[] = [];
  if (source.system.uses?.max) {
    targets.push({
      type: "itemUses",
      target: "",
      value: "1",
      scaling: { mode: "", formula: "" },
    });
  }

  return {
    targets,
    scaling: { allowed: false, max: "" },
    spellSlot: true,
  };
}

function transformDuration(source: ActivitySource) {
  const duration = source.system.duration ?? { value: null, units: "" };
  return {
    concentration: false,
    value: duration.value ?? null,
    units: duration.units || "inst",
    special: "",
    override: false,
  };
}

function transformRange(source: ActivitySource) {
  const range = source.system.range ?? { value: null, long: null, units: "" };
  return {
    value: range.value ?? null,
    units: range.units ?? "",
    special: "",
    override: false,
  };
}

function transformTarget(source: ActivitySource) {
  const target = source.system.target ?? {
    value: null,
    width: null,
    units: "",
    type: "",
  };

  const data = {
    template: {
      count: "",
      contiguous: false,
      type: "",
      size: "",
      width: "",
      height: "",
      units: target.units ?? "ft",
    },
    affects: {
      count: "",
      type: "",
      choice: false,
      special: "",
    },
    prompt: true,
    override: false,
  };

  const areaTypes = new Set([
    "cone",
    "cube",
    "cylinder",
    "line",
    "radius",
    "sphere",
    "square",
    "wall",
  ]);

  if (target.type && areaTypes.has(target.type)) {
    data.template.type = target.type;
    data.template.size = target.value != null ? String(target.value) : "";
    data.template.width = target.width != null ? String(target.width) : "";
  } else {
    data.affects.count = target.value != null ? String(target.value) : "";
    data.affects.type = target.type ?? "";
  }

  return data;
}

function transformEffects(source: ActivitySource) {
  return (source.effects ?? [])
    .filter(
      (effect) =>
        !effect.transfer &&
        effect.type !== "enchantment" &&
        effect.flags?.dnd5e?.type !== "enchantment",
    )
    .map((effect) => ({ _id: effect._id }));
}

function buildBaseActivity(source: ActivitySource, type: ActivityType, id: string) {
  return {
    _id: id,
    type,
    name: source.name,
    sort: 0,
    activation: transformActivation(source),
    consumption: transformConsumption(source),
    description: { chatFlavor: source.system.chatFlavor ?? "" },
    duration: transformDuration(source),
    effects: transformEffects(source),
    range: transformRange(source),
    target: transformTarget(source),
    uses: { spent: 0, max: "", recovery: [] as unknown[] },
  };
}

function buildTypeFields(source: ActivitySource, type: ActivityType) {
  const sys = source.system;

  if (type === "heal") {
    return {
      healing: transformDamagePart(sys.damage?.parts?.[0] ?? ["", ""]),
    };
  }

  if (type === "save") {
    let calculation = sys.save?.scaling ?? "";
    if (calculation === "flat") calculation = "";
    else if (calculation === "spell") calculation = "spellcasting";

    return {
      damage: {
        onSave: "half",
        parts: sys.damage?.parts?.map((part) => transformDamagePart(part)) ?? [],
      },
      save: {
        ability: [sys.save?.ability || "str"],
        dc: {
          calculation,
          formula: sys.save?.dc != null ? String(sys.save.dc) : "",
        },
      },
    };
  }

  if (type === "damage") {
    return {
      damage: {
        critical: { allow: false, bonus: "" },
        parts: sys.damage?.parts?.map((part) => transformDamagePart(part)) ?? [],
      },
    };
  }

  return {
    roll: {
      formula: "",
      name: "",
      prompt: false,
      visible: false,
    },
  };
}

/** Build dnd5e 5.1 `system.activities` from legacy item fields. */
export function buildActivities(source: ActivitySource): Record<string, unknown> {
  const activities: Record<string, unknown> = {};
  const primaryType = resolveActivityType(source.system);
  activities[PRIMARY_ACTIVITY_ID] = {
    ...buildBaseActivity(source, primaryType, PRIMARY_ACTIVITY_ID),
    ...buildTypeFields(source, primaryType),
  };

  const save = source.system.save;
  if (primaryType !== "save" && save?.ability) {
    const saveId = PRIMARY_ACTIVITY_ID.replace("0", "1");
    activities[saveId] = {
      ...buildBaseActivity(source, "save", saveId),
      ...buildTypeFields(source, "save"),
    };
  }

  return activities;
}

function buildFlamingDualityFormActivity(
  source: ActivitySource,
  id: string,
  name: string,
): Record<string, unknown> {
  return {
    ...buildBaseActivity({ ...source, name }, "utility", id),
    ...buildTypeFields(source, "utility"),
    name,
    description: { chatFlavor: "" },
  };
}

/** Two utility activities (Ignited / Godspeed) for Flaming Duality. */
export function buildFlamingDualityActivities(
  source: ActivitySource,
): Record<string, unknown> {
  return {
    [FLAMING_DUALITY_IGNITED_ACTIVITY_ID]: buildFlamingDualityFormActivity(
      source,
      FLAMING_DUALITY_IGNITED_ACTIVITY_ID,
      "Ignited Form",
    ),
    [FLAMING_DUALITY_GODSPEED_ACTIVITY_ID]: buildFlamingDualityFormActivity(
      source,
      FLAMING_DUALITY_GODSPEED_ACTIVITY_ID,
      "Godspeed Form",
    ),
  };
}

/** Attach activities to a feature item when legacy activation/uses imply activatable behavior. */
export function ensureFeatureActivities<T extends FeatureItem>(item: T): T {
  const system = item.system;
  if (!needsActivity(system)) return item;
  if (system.activities && Object.keys(system.activities).length > 0) return item;

  const source: ActivitySource = {
    name: item.name,
    type: item.type,
    effects: item.effects,
    system,
  };

  return {
    ...item,
    system: {
      ...system,
      activities: buildActivities(source),
    },
  };
}

/** Count features that received generated activities (for build reporting). */
export function countActivatableFeatures(items: FeatureItem[]): {
  total: number;
  withActivities: number;
  generated: number;
} {
  let withActivities = 0;
  let generated = 0;

  for (const item of items) {
    const before = item.system.activities && Object.keys(item.system.activities).length > 0;
    const after = ensureFeatureActivities(item);
    const has = after.system.activities && Object.keys(after.system.activities).length > 0;
    if (has) withActivities++;
    if (has && !before) generated++;
  }

  return { total: items.length, withActivities, generated };
}
