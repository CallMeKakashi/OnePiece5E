// Premade effects pack (#39): the four entries exist with an activity and an effect; Dodge and Help carry their turn-based special durations; Half Cover's effect adds +2 AC.
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
    // applying an activity effect needs a token on a scene (Midi-QOL and dnd5e both apply to tokens), so the check is on the data: the activity hands out the item's effect with the +2 changes
    const act = [...item.system.activities][0], fx = item.effects.get([...act.effects][0]?._id);
    ok("the Half Cover activity hands out its effect", !!fx, `${[...act.effects].length} activity effect(s)`);
    ok("the effect adds +2 to AC", !!fx && fx.changes.some((c) => c.key === "system.attributes.ac.bonus" && c.value === "2"));
  } catch (e) { ok("the test itself stopped", false, e.message); }
  await a?.delete().catch(() => {});
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
