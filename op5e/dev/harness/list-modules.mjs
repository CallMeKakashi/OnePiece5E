// Lists the active modules of the test/bb-rehearsal world (read-only).
import { withFoundry } from "./drive.mjs";
const run = () => game.modules.filter((m) => m.active).map((m) => `${m.id} ${m.version}`).sort();
await withFoundry(async (page) => console.log((await page.evaluate(`(${run.toString()})()`)).join("\n")));
