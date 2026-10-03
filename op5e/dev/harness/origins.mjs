// Applies every race and background (separately, on a level-1 Fighter) and checks the result.
// Usage: node dev/harness/origins.mjs [races|backgrounds]
import { writeFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
import { BUILT, pageLib } from "./advance-lib.mjs";

const which = process.argv[2];
const origin = async ({ pack, id }) => {
  const H = game.op5eHarness, AM = dnd5e.applications.advancement.AdvancementManager;
  const issues = [], granted = [], note = (m) => issues.push(m);
  const doc = await fromUuid(`Compendium.op5e.${pack}.${id}`);
  const actor = await H.createActor({ name: doc.name, abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 } });
  // level-1 Fighter first so level-based origin advancement has a character level to apply at
  const fighter = __op5eBuilt("classes").find((c) => c.name === "Fighter").toObject(); fighter.system.levels = 1;
  const m1 = AM.forNewItem(actor, fighter, { automaticApplication: true });
  await __op5eRun(m1, { level: 1, sub: null, note: () => {}, granted: [] });
  const base = await __op5eSummarize(m1.clone);
  // then the origin item on top of the already-advanced clone's data
  const actor2 = await H.createActor({ name: doc.name + " (origin)", abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 } });
  actor2.updateSource({ items: m1.clone.items.map((i) => i.toObject()) });
  actor2.reset();
  const m2 = AM.forNewItem(actor2, doc.toObject(), { automaticApplication: true });
  H.clearConsoleErrors();
  await __op5eRun(m2, { level: 1, sub: null, note, granted });
  if (doc.type === "race") { const ri = m2.clone.items.find((i) => i.type === "race"); m2.clone.updateSource({ "system.details.race": ri.id }); m2.clone.reset(); }
  const sum = await __op5eSummarize(m2.clone);
  const out = { pack, name: doc.name, steps: m2.steps.length, issues, granted: granted.map((g) => g.name), base: { size: base.size, walk: base.walk, abilities: base.abilities, skills: base.skills }, after: sum };
  out.consoleErrors = H.getConsoleErrors().slice(0, 3).map((s) => s.slice(0, 160));
  await H.cleanup();
  return out;
};

const packs = which ? [which] : ["races", "backgrounds"];
const results = [];
try {
  await withFoundry(async (page, { evaluate }) => {
    page.setDefaultTimeout(300000);
    await page.evaluate(`(${pageLib.toString()})(${JSON.stringify(BUILT)})`);
    for (const pack of packs) {
      const docs = await evaluate((p) => __op5eBuilt(p).map((d) => ({ id: d.id, name: d.name })), pack);
      for (const d of docs) {
        if (process.env.ONLY && !process.env.ONLY.split("|").includes(d.name)) continue;
        const r = await page.evaluate(`(${origin.toString()})(${JSON.stringify({ pack, id: d.id })})`).catch((e) => ({ pack, name: d.name, fatal: e.message.slice(0, 300), issues: [] }));
        results.push(r);
        console.log(`${pack}/${r.name}: ${r.fatal ?? `granted ${r.granted.length}, issues ${r.issues.length}, size ${r.after?.size}, walk ${r.after?.walk} swim ${r.after?.swim} fly ${r.after?.fly} climb ${r.after?.climb}, skills ${r.after?.skills}`}`);
      }
    }
  });
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
writeFileSync(`reports/execution-origins${which ? "-" + which : ""}.json`, JSON.stringify(results, null, 1));
