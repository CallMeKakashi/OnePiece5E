// Send world items/actors to a compendium folder named after this world, and import a folder back (GM only; never writes op5e packs).
// game.op5eSendToWorldPack(docs) ; game.op5eImportFromWorldPack(worldName)
import { MODULE_ID } from "./constants.mjs";

const PACK_LABEL = "OP5e World Items";
const getPack = async (type) => game.packs.find((p) => !p.locked && p.metadata.packageType === "world" && p.metadata.label === `${PACK_LABEL} (${type})`)
  ?? CompendiumCollection.createCompendium({ label: `${PACK_LABEL} (${type})`, type, name: `op5e-world-${type.toLowerCase()}`, packageType: "world" });

export async function sendToWorldPack(docs) {
  const out = { created: 0, updated: 0 };
  for (const type of new Set(docs.map((d) => d.documentName))) {
    const pack = await getPack(type);
    const folder = pack.folders.find((f) => f.name === game.world.id) ?? (await Folder.create({ name: game.world.id, type }, { pack: pack.collection }));
    const index = await pack.getIndex({ fields: [`flags.${MODULE_ID}.worldOrigin`] });
    for (const d of docs.filter((x) => x.documentName === type)) {
      const data = d.toObject(); const origin = `${game.world.id}.${d.id}`;
      data.folder = folder.id; data.flags = { ...data.flags, [MODULE_ID]: { ...data.flags?.[MODULE_ID], worldOrigin: origin } };
      const hit = index.find((e) => e.flags?.[MODULE_ID]?.worldOrigin === origin);
      if (hit) { await pack.documentClass.updateDocuments([{ ...data, _id: hit._id }], { pack: pack.collection }); out.updated++; }
      else { await pack.documentClass.createDocuments([data], { pack: pack.collection, keepId: false }); out.created++; }
    }
  }
  ui.notifications.info(`Sent to the world compendium: ${out.created} new, ${out.updated} updated.`);
  return out;
}

export async function importFromWorldPack(worldName) {
  let n = 0;
  for (const pack of game.packs.filter((p) => p.metadata.packageType === "world" && p.metadata.label.startsWith(PACK_LABEL))) {
    const folder = pack.folders.find((f) => f.name === worldName); if (!folder) continue;
    const docs = (await pack.getDocuments()).filter((d) => d.folder?.id === folder.id);
    const DocClass = pack.documentClass;
    await DocClass.createDocuments(docs.map((d) => { const o = d.toObject(); delete o._id; delete o.folder; return o; })); n += docs.length;
  }
  ui.notifications.info(`Imported ${n} documents from "${worldName}".`);
  return n;
}

export function registerWorldPackSync() {
  game.op5eSendToWorldPack = (docs) => game.user.isGM ? sendToWorldPack([docs].flat()) : Promise.reject(new Error("GM only"));
  game.op5eImportFromWorldPack = (w) => game.user.isGM ? importFromWorldPack(w) : Promise.reject(new Error("GM only"));
}
