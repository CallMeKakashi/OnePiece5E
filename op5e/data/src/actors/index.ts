import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { statblockToActor } from "../../helpers/actor.js";
import greatBeasts from "./great-beasts.js";

// Source of truth: extracted/monsters.json (from the vault Monster Manual statblock fences) — rerun `npm run extract` after vault edits.
const file = join(dirname(fileURLToPath(import.meta.url)), "../../../extracted/monsters.json");
const monsters = JSON.parse(readFileSync(file, "utf8")) as { statblock: never; source: never }[];
export default [...monsters.map((m) => statblockToActor(m.statblock, m.source)), ...greatBeasts];
