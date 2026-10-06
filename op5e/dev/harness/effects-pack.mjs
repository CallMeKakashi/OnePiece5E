// Premade effects pack (#39): the four entries exist with an activity and an effect; Dodge and Help carry their turn-based special durations; using Half Cover puts the effect on the user.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  for (const x of game.actors.filter((y) => y.name === "[FX] Test")) await x.delete();
  let a;
  try {
    const pack = game.packs.get("op5e.effects"); ok("the effects pack is registered", !!pack);
    const docs = pack ? await pack.getDocuments() : [];
    for (const n of ["Dodge", "Help", "Half Cover", "Three-Quarters Cover"]) {
      const d = docs.find((x) => x.name === n);
      ok(`${n}: has an activity and an effect`, !!d && [...d.system.activities].length === 1 && d.effects.size === 1);
    }
    ok("Dodge ends at the start of the source's next turn", docs.find((x) => x.name === "Dodge")?.effects.contents[0]?.flags.dae?.specialDuration?.includes("turnStartSource"));
    ok("Help ends with the next attack or check", docs.find((x) => x.name === "Help")?.effects.contents[0]?.flags.dae?.specialDuration?.includes("1Attack"));
    a = await Actor.create({ name: "[FX] Test", type: "character" });
    const [item] = await a.createEmbeddedDocuments("Item", [docs.find((x) => x.name === "Half Cover").toObject()]);
    const act = [...item.system.activities][0];
    await Promise.race([act.use({ create: { measuredTemplate: false } }, { configure: false }, {}), wait(15000)]); await wait(2000);
    const fx = a.effects.find((e) => /Half cover/.test(e.name));
    ok("using Half Cover puts the effect on the user", !!fx, `${a.effects.size} effect(s)`);
    ok("the effect adds +2 to AC", !!fx && fx.changes.some((c) => c.key === "system.attributes.ac.bonus" && c.value === "2"));
  } catch (e) { ok("the test itself stopped", false, e.message); }
  await a?.delete().catch(() => {});
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
