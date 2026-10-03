import { withFoundry } from "./drive.mjs";
const r = await withFoundry((p) => p.evaluate(() => game.packs.filter((x) => x.metadata.packageName === "dnd5e" && x.documentName === "Item").map((x) => `${x.collection}:${x.index.size}`)));
console.log(JSON.stringify(r));
