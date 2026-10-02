/**
 * Embed compendium source docs as standalone owned items.
 */
import { randomBytes } from "node:crypto";

import { assignIcons } from "../../data/helpers/icons.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import {
  collectItemGrants,
  findByUuid,
  getSubclassLevel,
  type AnyDoc,
} from "../character-sheet-audit/audit-lib.js";
import type { FeatureItem } from "../../data/schemas/feature.js";
import type { EmbedRegistry } from "./standalone.js";

export type CompendiumDoc = AnyDoc & { _id: string; name?: string; type?: string; img?: string };

export function newOwnedId(): string {
  return randomBytes(8).toString("hex");
}

function guessPack(type: string): string {
  const map: Record<string, string> = {
    race: "races",
    class: "classes",
    subclass: "subclasses",
    background: "backgrounds",
    feat: "class_features",
    weapon: "items",
    equipment: "items",
    loot: "items",
    tool: "items",
    consumable: "items",
  };
  return map[type] ?? "items";
}

function withActivities(doc: CompendiumDoc): CompendiumDoc {
  if (doc.type === "feat" || doc.type === "class" || doc.type === "weapon") {
    return ensureFeatureActivities(doc as FeatureItem) as CompendiumDoc;
  }
  return doc;
}

function withEffectIcons(doc: CompendiumDoc): CompendiumDoc {
  const out = structuredClone(doc);
  const img = String(out.img ?? "icons/svg/item-bag.svg");
  if (Array.isArray(out.effects)) {
    out.effects = out.effects.map((e: Record<string, unknown>) => ({
      ...e,
      img: e.img || img,
    }));
  }
  return out;
}

function registerEmbedded(registry: EmbedRegistry | undefined, source: CompendiumDoc, ownedId: string): void {
  if (!registry) return;
  registry.register(source._id, ownedId);
  registry.register(`Compendium.op5e.${guessPack(source.type ?? "")}.${source._id}`, ownedId);
  const prior = (source._stats as { compendiumSource?: string })?.compendiumSource;
  if (prior) registry.register(prior, ownedId);
}

/** Embed a compendium doc as an actor-owned item (standalone — no compendium refs). */
export function embedOwnedItem(
  source: CompendiumDoc,
  opts: { equipped?: boolean; quantity?: number; registry?: EmbedRegistry } = {},
): CompendiumDoc {
  let doc = structuredClone(source);
  doc = assignIcons([doc as never])[0] as CompendiumDoc;
  doc = withActivities(doc);
  doc = withEffectIcons(doc);

  doc._id = newOwnedId();
  registerEmbedded(opts.registry, source, doc._id);

  if (opts.equipped != null && doc.system && typeof doc.system === "object") {
    (doc.system as Record<string, unknown>).equipped = opts.equipped;
  }
  if (opts.quantity != null && doc.system && typeof doc.system === "object") {
    (doc.system as Record<string, unknown>).quantity = opts.quantity;
  }

  doc._stats = {
    compendiumSource: null,
    duplicateSource: null,
    coreVersion: "13",
    systemId: "dnd5e",
    systemVersion: "5.1.10",
    createdTime: null,
    modifiedTime: null,
    lastModifiedBy: null,
  };

  return doc;
}

export function embedGrants(
  doc: CompendiumDoc | undefined,
  source: "class" | "subclass" | "background" | "role",
  sourceName: string,
  maxLevel: number,
  minLevel = 0,
  registry?: EmbedRegistry,
): CompendiumDoc[] {
  if (!doc) return [];
  const grants = collectItemGrants(doc, source, sourceName, maxLevel, minLevel);
  const out: CompendiumDoc[] = [];
  for (const g of grants) {
    const feat = findByUuid(g.uuid);
    if (!feat) continue;
    const embedded = embedOwnedItem(feat as CompendiumDoc, { registry });
    registry?.register(g.uuid, embedded._id);
    out.push(embedded);
  }
  return out;
}

export { findByUuid, getSubclassLevel };
