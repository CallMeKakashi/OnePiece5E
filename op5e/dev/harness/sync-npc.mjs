// Re-applies a rebuilt standalone actor JSON onto the actor of the same name in the world, IN PLACE: system data and items are replaced,
// the actor's portrait, token art, folder and permissions (anything the DM changed by hand in Foundry) are left alone. Usage: node dev/harness/sync-npc.mjs <json>
import { readFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
const data = JSON.parse(readFileSync(process.argv[2], "utf8"));
const run = async (data) => {
  const a = game.actors.getName(data.name); if (!a) return `no actor named ${data.name}: import it first`;
  await a.update({ system: data.system });
  await a.deleteEmbeddedDocuments("Item", a.items.map((i) => i.id));
  await a.createEmbeddedDocuments("Item", data.items, { keepId: true });
  await new Promise((r) => setTimeout(r, 1200));
  const s = a.system;
  return JSON.stringify({ name: a.name, img: a.img, token: a.prototypeToken.texture.src, folder: a.folder?.name, ac: s.attributes.ac.value, hp: s.attributes.hp.max, dc: s.attributes.spell.dc, items: a.items.size }, null, 1);
};
await withFoundry(async (page) => { console.log(await page.evaluate(`(${run.toString()})(${JSON.stringify(data)})`)); });
