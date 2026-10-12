import type { FoundryItem } from "../../schemas/common.js";
import { generateId } from "../../helpers/id.js";
import { ensureItemActivities } from "../../helpers/activities.js";
import { tricks } from "./tricks.js";
import { level1 } from "./level-1.js";
import { level3 } from "./level-3.js";

// Lunarian Flame Investure (Chapter 1): Fire Bolt always, Elemental Armor (fire only) from level 3, Fireball from level 5.
// "You cannot use the same creation again until you finish a long rest." The race grants these versions instead of the generic creations so that they
// are always prepared, spend no creation slot, and Elemental Armor and Fireball are limited to once per long rest by their own item uses.
type Doc = FoundryItem & { system: Record<string, any>; flags?: Record<string, any> };
const find = (list: FoundryItem[], name: string): Doc => {
  const item = list.find((i) => i.name === name);
  if (!item) throw new Error(`Lunarian creation source not found: ${name}`);
  return item as Doc;
};

function variant(src: Doc, slug: string, limited: boolean): Doc {
  const c = structuredClone(src) as Doc;
  c._id = generateId(`creation/lunarian/${slug}`);
  c.name = `${src.name} (Flame Investure)`;
  c.system.preparation = { mode: "always", prepared: true };
  c.system.description = { ...c.system.description, value: `<p><em>Lunarian Flame Investure: no creation slot is spent${limited ? " and it cannot be used again until you finish a long rest" : ""}.</em></p>${c.system.description?.value ?? ""}` };
  if (limited) c.system.uses = { value: null, max: "1", per: "lr", recovery: "", prompt: true };
  const gen = ensureItemActivities(c) as Doc;
  for (const a of Object.values(gen.system.activities ?? {}) as any[]) {
    a.consumption = { targets: limited ? [{ type: "itemUses", target: "", value: "1", scaling: { mode: "", formula: "" } }] : [], scaling: { allowed: false, max: "" }, spellSlot: false };
  }
  return gen;
}

/** Order matters: Fire Bolt, Elemental Armor, Fireball (the race grants them by these ids). */
export const lunarianCreations: FoundryItem[] = [
  variant(find(tricks, "Fire Bolt"), "fire-bolt", false),
  variant(find(level1, "Elemental Armor"), "elemental-armor", true),
  variant(find(level3, "Fireball"), "fireball", true),
];
