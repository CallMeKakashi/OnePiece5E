import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generateId } from "../../helpers/id.js";
import { mdToHtml } from "../../helpers/markdown.js";
import sourcebookFruits from "./sourcebook-fruits.js";

// Reference items only: fruit powers in the vault are prose without dice/DCs, so no activities are invented (see reports/unresolved.json).
const file = join(dirname(fileURLToPath(import.meta.url)), "../../../extracted/entries.json");
const entries = JSON.parse(readFileSync(file, "utf8")) as { name: string; kind: string; meta: Record<string, string>; body: string; source: object }[];

export default [...entries
  .filter((e) => e.kind === "devil-fruit" && e.meta.type === "devil-fruit")
  .map((e) => ({
    _id: generateId(`devil-fruit/${e.name}`), name: e.name, type: "loot", img: "icons/consumables/food/berries-ration-round-red.webp",
    system: { description: { value: mdToHtml(e.body), chat: "" }, type: { value: "treasure" }, rarity: e.meta.rarity ?? "", activities: {} },
    effects: [], flags: { op5e: { devilFruit: { type: e.meta.fruit_type, owner: e.meta.owner ?? null, status: e.meta.status ?? null }, automation: "NEEDS_REVIEW", source: e.source } },
  })), ...sourcebookFruits];
