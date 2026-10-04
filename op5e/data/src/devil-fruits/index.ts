import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generateId } from "../../helpers/id.js";
import { mdToHtml } from "../../helpers/markdown.js";
import sourcebookFruits from "./sourcebook-fruits.js";
import fruitTemplates from "./templates.js";

// Reference items only: fruit powers in the vault are prose without dice/DCs, so no activities are invented (see reports/unresolved.json).
const file = join(dirname(fileURLToPath(import.meta.url)), "../../../extracted/entries.json");
const entries = JSON.parse(readFileSync(file, "utf8")) as { name: string; kind: string; meta: Record<string, string>; body: string; source: object }[];

// Original module art; the type icon applies only where the item data states a paramecia/zoan/logia type.
const ICON = (kind?: string | null) => {
  const t = /paramecia|zoan|logia/i.exec(kind ?? "")?.[0].toLowerCase();
  return `modules/op5e/assets/icons/devil-fruit${t ? `-${t}` : ""}.svg`;
};

export default [...entries
  .filter((e) => e.kind === "devil-fruit" && e.meta.type === "devil-fruit")
  .map((e) => ({
    _id: generateId(`devil-fruit/${e.name}`), name: e.name, type: "loot", img: ICON(e.meta.fruit_type),
    system: { description: { value: mdToHtml(e.body), chat: "" }, type: { value: "treasure" }, rarity: e.meta.rarity ?? "", activities: {} },
    effects: [], flags: { op5e: { devilFruit: { type: e.meta.fruit_type, owner: e.meta.owner ?? null, status: e.meta.status ?? null }, automation: "NEEDS_REVIEW", source: e.source } },
  })), ...sourcebookFruits.map((f) => ({ ...f, img: ICON(f.flags.op5e.devilFruit.type) })), ...fruitTemplates];
