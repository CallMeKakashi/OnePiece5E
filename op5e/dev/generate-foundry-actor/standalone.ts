/**
 * Standalone workshop export — no Compendium.op5e references in output.
 */
import { randomBytes } from "node:crypto";

import type { CompendiumDoc } from "./compendium-resolver.js";

export class EmbedRegistry {
  private readonly map = new Map<string, string>();

  /** Map compendium UUID or source `_id` → owned item `_id`. */
  register(sourceKey: string, ownedId: string): void {
    this.map.set(sourceKey, ownedId);
  }

  ownedId(key: string): string | undefined {
    const direct = this.map.get(key);
    if (direct) return direct;
    const tail = key.split(".").pop();
    return tail ? this.map.get(tail) : undefined;
  }
}

const QUANTITY_TYPES = new Set(["weapon", "equipment", "loot", "tool", "consumable"]);

/** Merge duplicate items by (type, name); sum quantities for gear/weapons. */
export function dedupeItems(items: CompendiumDoc[]): CompendiumDoc[] {
  const out: CompendiumDoc[] = [];
  const index = new Map<string, number>();

  for (const item of items) {
    const key = `${item.type ?? ""}\0${item.name ?? ""}`;
    const at = index.get(key);
    if (at != null && QUANTITY_TYPES.has(String(item.type))) {
      const prev = out[at];
      const sys = prev.system as Record<string, unknown>;
      const add = item.system as Record<string, unknown>;
      sys.quantity = Number(sys.quantity ?? 1) + Number(add.quantity ?? 1);
      continue;
    }
    index.set(key, out.length);
    out.push(item);
  }
  return out;
}

export function newActorId(): string {
  return randomBytes(8).toString("hex");
}

function actorItemUuid(actorId: string, ownedId: string): string {
  return `Actor.${actorId}.Item.${ownedId}`;
}

function sanitizeOwnedItem(item: Record<string, unknown>): void {
  if (item._stats && typeof item._stats === "object") {
    (item._stats as Record<string, unknown>).compendiumSource = null;
  }
  const flags = item.flags as Record<string, unknown> | undefined;
  if (!flags?.dnd5e || typeof flags.dnd5e !== "object") return;
  const dnd5e = { ...(flags.dnd5e as Record<string, unknown>) };
  delete dnd5e.sourceId;
  if (Object.keys(dnd5e).length === 0) delete flags.dnd5e;
  else flags.dnd5e = dnd5e;
}

function rewriteUuid(value: string, actorId: string, registry: EmbedRegistry): string | null {
  const ownedId = registry.ownedId(value);
  return ownedId ? actorItemUuid(actorId, ownedId) : null;
}

function deepSanitize(value: unknown, actorId: string, registry: EmbedRegistry, key?: string): unknown {
  if (typeof value === "string") {
    if (key === "uuid" || value.includes("Compendium.op5e")) {
      return rewriteUuid(value, actorId, registry) ?? (key === "uuid" ? undefined : value);
    }
    return value;
  }

  if (Array.isArray(value)) {
    const next: unknown[] = [];
    for (const el of value) {
      const rewritten = deepSanitize(el, actorId, registry);
      if (rewritten === undefined) continue;
      if (Array.isArray(rewritten)) next.push(...rewritten);
      else next.push(rewritten);
    }
    return next;
  }

  if (!value || typeof value !== "object") return value;

  const obj = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    let key = k;
    if (k.includes("Compendium.op5e")) {
      const ownedId = registry.ownedId(k);
      if (ownedId) key = actorItemUuid(actorId, ownedId);
      else continue;
    }
    const rewritten = deepSanitize(v, actorId, registry, key);
    if (rewritten !== undefined) out[key] = rewritten;
  }
  return out;
}

/** Produce importable workshop JSON with no compendium pack dependencies. */
export function makeStandalone(
  actor: Record<string, unknown>,
  registry: EmbedRegistry,
): Record<string, unknown> {
  const actorId = String(actor._id ?? "") || newActorId();
  const out = deepSanitize(structuredClone(actor), actorId, registry) as Record<string, unknown>;
  out._id = actorId;

  for (const item of (out.items as Record<string, unknown>[]) ?? []) {
    sanitizeOwnedItem(item);
  }

  if (out._stats && typeof out._stats === "object") {
    (out._stats as Record<string, unknown>).compendiumSource = null;
  }

  return out;
}

/** Count Compendium.op5e occurrences in serialized JSON (validation helper). */
export function countCompendiumRefs(value: unknown): number {
  const raw = JSON.stringify(value);
  const matches = raw.match(/Compendium\.op5e/g);
  return matches?.length ?? 0;
}
