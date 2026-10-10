// Files an actor into a nested actor folder: node dev/harness/ensure-npc-folder.mjs "<Actor name>" "<Parent>/<Child>[/<Grandchild>]"
// Creates the folders if missing (real nesting, never a literal slash name) and removes empty literal slash-named folders.
import { withFoundry } from "./drive.mjs";
const [actorName, path] = process.argv.slice(2);
if (!actorName || !path) throw new Error('usage: node dev/harness/ensure-npc-folder.mjs "<Actor name>" "<Parent>/<Child>"');
const run = async (actorName, parts) => {
  const actor = game.actors.getName(actorName);
  if (!actor) return { error: `${actorName} is not present in this world` };
  let parent = null;
  for (const name of parts) {
    const found = game.folders.find((f) => f.type === "Actor" && f.name === name && (f.folder?.id ?? null) === (parent?.id ?? null));
    parent = found ?? await Folder.create({ name, type: "Actor", folder: parent?.id ?? null });
  }
  await actor.update({ folder: parent.id });
  for (const f of game.folders.filter((x) => x.type === "Actor" && x.name === parts.join("/"))) if (!game.actors.some((a) => a.folder?.id === f.id)) await f.delete();
  return { actor: actor.name, folder: parts.join("/") };
};
await withFoundry(async (page) => { console.log(JSON.stringify(await page.evaluate(`(${run.toString()})(${JSON.stringify(actorName)}, ${JSON.stringify(path.split("/"))})`), null, 1)); });
