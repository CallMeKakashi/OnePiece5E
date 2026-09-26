import { countCompendiumRefs } from "./standalone.js";

export interface ValidateResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

/** Validate workshop actor JSON against FOUNDRY-KB checklist. */
export function validateActor(actor: Record<string, unknown>): ValidateResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  function err(msg: string) {
    errors.push(msg);
  }
  function warn(msg: string) {
    warnings.push(msg);
  }

  if (!actor.name) err("Missing actor.name");
  if (!actor.type) err("Missing actor.type");
  if (!Array.isArray(actor.items)) err("Missing actor.items[]");

  const compendiumRefs = countCompendiumRefs(actor);
  if (compendiumRefs > 0) {
    err(`Standalone export contains ${compendiumRefs} Compendium.op5e reference(s) — must be zero`);
  }

  const items = (actor.items ?? []) as Record<string, unknown>[];
  const types = items.map((i) => i.type);

  if (!types.includes("race")) err("No race item embedded");
  if (!types.includes("class")) err("No class item embedded");
  if (!types.includes("subclass")) warn("No subclass item (required for class-based PCs/NPCs)");
  if (!types.includes("background")) warn("No background item");
  if (!types.some((t) => t === "weapon")) err("No weapons in inventory");
  if (((actor.system as { currency?: { gp?: number } })?.currency?.gp ?? 0) <= 0) {
    warn("No currency (system.currency.gp / Berries)");
  }

  for (const item of items) {
    if (!item._id || String(item._id).length !== 16) err(`Item "${item.name}" missing valid _id`);
    if (!item.img) warn(`Item "${item.name}" missing img`);
    if (item.type === "feat" || item.type === "weapon") {
      const sys = (item.system ?? {}) as Record<string, unknown>;
      const activation = sys.activation as { type?: string } | undefined;
      const uses = sys.uses as { max?: string } | undefined;
      const damage = sys.damage as { parts?: unknown[] } | undefined;
      const activatable =
        activation?.type ||
        uses?.max ||
        sys.actionType ||
        (damage?.parts?.length ?? 0) > 0;
      const acts = sys.activities as Record<string, unknown> | undefined;
      if (activatable && (!acts || !Object.keys(acts).length)) {
        warn(`Activatable item "${item.name}" missing system.activities`);
      }
    }
    for (const eff of (item.effects ?? []) as Record<string, unknown>[]) {
      if (!eff.img) warn(`Effect "${eff.name}" on "${item.name}" missing img`);
    }
  }

  const prof = (actor.system as { attributes?: { prof?: number } })?.attributes?.prof;
  if (prof == null) warn("Missing system.attributes.prof");

  return { ok: errors.length === 0, errors, warnings };
}
