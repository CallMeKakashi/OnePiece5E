import { withFoundry } from "./drive.mjs";

await withFoundry(async (page) => {
  const result = await page.evaluate(async () => {
    const parent = game.folders.find((folder) => folder.type === "Actor" && folder.name === "OP5E" && !folder.folder)
      ?? await Folder.create({ name: "OP5E", type: "Actor" });
    const child = game.folders.find((folder) => folder.type === "Actor" && folder.name === "Silenced" && folder.folder?.id === parent.id)
      ?? await Folder.create({ name: "Silenced", type: "Actor", folder: parent.id });
    const actor = game.actors.getName("Cadence");
    if (!actor) throw new Error("Cadence is not present in bb-rehearsal");
    await actor.update({ folder: child.id });
    for (const folder of game.folders.filter((folder) => folder.type === "Actor" && folder.name === "OP5E/Silenced" && folder.id !== child.id)) {
      if (!game.actors.some((candidate) => candidate.folder?.id === folder.id)) await folder.delete();
    }
    return { actor: actor.name, parent: parent.name, child: child.name, parentId: parent.id, childId: child.id, actorFolder: actor.folder?.name };
  });
  console.log(JSON.stringify(result, null, 2));
});
