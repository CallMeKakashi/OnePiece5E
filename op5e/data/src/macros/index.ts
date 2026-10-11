import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generateId } from "../../helpers/id.js";

// GM script macros for moving content between worlds, one macro per import. The scripts live in dev/harness/scripts (also usable pasted by hand);
// the pack just carries them so they can be dragged to the hotbar. Each opens a file picker or reads a compendium, and asks before changing anything.
const SCRIPTS = join(dirname(fileURLToPath(import.meta.url)), "../../../dev/harness/scripts");
const defs = [
  { name: "OP5e: Import Playlists", file: "import-playlists-macro.js", img: "icons/svg/sound.svg" },
  { name: "OP5e: Import Actor Bundle", file: "import-bundle-macro.js", img: "icons/svg/mystery-man.svg" },
  { name: "OP5e: Apply Config Bundle", file: "apply-config-macro.js", img: "icons/svg/cog.svg" },
];
const stats = { coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10" };

export default defs.map((d) => ({
  _id: generateId(`macro/${d.name}`), name: d.name, type: "script", img: d.img, scope: "global", command: readFileSync(join(SCRIPTS, d.file), "utf8").replace(/\r\n/g, "\n"),
  folder: null, sort: 0, flags: {}, ownership: { default: 0 }, _stats: stats,
}));
