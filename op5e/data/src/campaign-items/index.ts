import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generateId } from "../../helpers/id.js";

// Custom weapons and items the DM has handed out in the campaign. Taken from the old campaign world's actor sheets (old-items.json,
// images copied to assets/campaign/); add new ones to that file or as entries below.
const RENAME: Record<string, string> = { "Death Chalace": "Death Chalice", "Rolling Pin - Kura3™": "Rolling Pin: Kura3 (Base)", "Lemonte's black glasses": "Lemonte's Black Glasses", "Green vile (With Ace)": "Green Vial (With Ace)", "Buzz blade": "Buzz Blade" };
const raw = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "old-items.json"), "utf8")) as { name: string; type: string; img: string; system: Record<string, unknown>; effects?: Record<string, unknown>[] }[];

export default raw.map((r) => {
  const name = RENAME[r.name] ?? r.name.replace(/™/g, "").replace(/\s+/g, " ").trim();
  const _id = generateId(`campaign-item/${name}`);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const system = { ...r.system, identifier: slug, container: null, equipped: false, quantity: 1 } as Record<string, unknown>;
  const price = system.price as { value?: number } | undefined;
  if (price) price.value = price.value ?? 0;
  return {
    _id, name, type: r.type, img: r.img, sort: 0, folder: null, flags: { op5e: { campaignItem: true } }, ownership: { default: 0 },
    system,
    effects: (r.effects ?? []).map((e, i) => ({ ...e, name: e.name ?? e.label ?? `${name} effect`, img: e.img ?? e.icon ?? r.img, _id: generateId(`campaign-item/${name}/fx/${i}`) })),
  };
});
