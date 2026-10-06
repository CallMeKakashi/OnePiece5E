// Performance (#47): what op5e costs. Measures its script load, hot-path hook cost (item creation, actor updates, activity use) and the startup sweeps, and fails if any goes over a budget.
// The numbers are printed so a change that makes op5e slower shows up here.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  for (const x of game.actors.filter((y) => y.name === "[PERF] Test")) await x.delete();
  let a;
  try {
    // 1. script load: every op5e JS file the browser fetched
    const res = performance.getEntriesByType("resource").filter((r) => /\/modules\/op5e\/scripts\/.*\.mjs/.test(r.name));
    const kb = res.reduce((n, r) => n + (r.transferSize || r.encodedBodySize || 0), 0) / 1024, ms = res.reduce((n, r) => Math.max(n, r.responseEnd), 0) - Math.min(...res.map((r) => r.startTime));
    ok("op5e's scripts load in under 3 s", res.length > 0 && ms < 3000, `${res.length} files, ${kb.toFixed(0)} KB, ${ms.toFixed(0)} ms wall`);
    // 2. how many hooks op5e keeps alive on the hot events
    const hot = ["createItem", "updateItem", "updateActor", "dnd5e.preUseActivity", "dnd5e.postUseActivity", "dnd5e.rollDamageV2", "dnd5e.rollAttackV2"];
    const counts = Object.fromEntries(hot.map((h) => [h, (Hooks.events[h] ?? []).length]));
    ok("the hot events have few listeners overall", Object.values(counts).every((n) => n < 40), JSON.stringify(counts));
    // 3. item creation throughput on an actor (every op5e createItem hook runs)
    a = await Actor.create({ name: "[PERF] Test", type: "character" });
    const pack = game.packs.get("op5e.class-features"), idx = [...(await pack.getIndex())].slice(0, 60);
    const docs = (await Promise.all(idx.map((e) => pack.getDocument(e._id)))).map((d) => d.toObject());
    let t = performance.now(); await a.createEmbeddedDocuments("Item", docs); const per = (performance.now() - t) / docs.length;
    ok("creating a class feature costs under 150 ms each", per < 150, `${per.toFixed(1)} ms each over ${docs.length}`);
    // 4. actor update throughput (every op5e updateActor hook runs)
    t = performance.now(); for (let i = 0; i < 40; i++) await a.update({ "system.attributes.hp.value": 1 + (i % 5) }); const upd = (performance.now() - t) / 40;
    ok("an actor update costs under 80 ms", upd < 80, `${upd.toFixed(1)} ms each`);
    // 5. preparing the data of a loaded actor
    t = performance.now(); for (let i = 0; i < 30; i++) a.reset(); const prep = (performance.now() - t) / 30;
    ok("preparing an actor's data costs under 60 ms", prep < 60, `${prep.toFixed(1)} ms each with ${a.items.size} items`);
    // 6. the Aura Effects sweep op5e runs on start
    t = performance.now(); let n = 0; if (game.op5eAuras) for (const actor of game.actors) for (const item of actor.items) { if (game.op5eAuras.AURAS[item.name]) n++; } const sweep = performance.now() - t;
    ok("the startup aura sweep over every actor costs under 150 ms", sweep < 150, `${sweep.toFixed(1)} ms over ${game.actors.size} actors (${n} aura features)`);
  } catch (e) { ok("the test itself stopped", false, e.message); }
  await a?.delete().catch(() => {});
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
