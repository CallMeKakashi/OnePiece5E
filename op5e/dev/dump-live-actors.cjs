// Reads the TEST world's actors (with their embedded items) from a copy of its LevelDB: node dev/dump-live-actors.cjs <copy-dir> <out.json>
const { ClassicLevel } = require("classic-level"), fs = require("fs");
(async () => {
  const db = new ClassicLevel(process.argv[2], { valueEncoding: "json" });
  const actors = new Map(), items = new Map();
  for await (const [k, v] of db.iterator()) {
    if (k.startsWith("!actors!")) actors.set(v._id, v);
    else if (k.startsWith("!actors.items!")) { const [aid] = k.slice("!actors.items!".length).split("."); (items.get(aid) ?? items.set(aid, []).get(aid)).push(v); }
  }
  const out = [...actors.values()].map((a) => ({ ...a, items: items.get(a._id) ?? [] }));
  fs.writeFileSync(process.argv[3], JSON.stringify(out));
  console.log(out.length, "actors;", out.filter((a) => /OPC/.test(a.name)).map((a) => `${a.name}: ${a.items.length} items`).join(" | "));
})();
