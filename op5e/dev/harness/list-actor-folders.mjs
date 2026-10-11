// Lists the actor folder tree of the active test/bb-rehearsal world with actor counts (read-only).
import { withFoundry } from "./drive.mjs";
const run = () => {
  const tree = (parent, depth) => game.folders.filter((f) => f.type === "Actor" && (f.folder?.id ?? null) === parent)
    .flatMap((f) => [`${"  ".repeat(depth)}${f.name} (${game.actors.filter((a) => a.folder?.id === f.id).length})`, ...tree(f.id, depth + 1)]);
  return [...tree(null, 0), `(no folder) (${game.actors.filter((a) => !a.folder).length})`];
};
await withFoundry(async (page) => console.log((await page.evaluate(`(${run.toString()})()`)).join("\n")));
