// Levels every op5e class (optionally with each subclass) 1..N through dnd5e's own AdvancementManager steps,
// then checks what the character ends up with.
// Usage: node dev/harness/classes.mjs [--subclasses] [--level=20] [ClassName ...]
import { writeFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
import { BUILT, pageLib } from "./advance-lib.mjs";

const args = process.argv.slice(2);
const withSubs = args.includes("--subclasses");
const level = Number(args.find((a) => a.startsWith("--level="))?.split("=")[1] ?? 20);
const only = args.filter((a) => !a.startsWith("--"));

const levelUp = async ({ classId, subclassId, level }) => {
  const H = game.op5eHarness, AM = dnd5e.applications.advancement.AdvancementManager;
  const issues = [], granted = [], note = (m) => issues.push(m);
  const cls = await fromUuid(`Compendium.op5e.classes.${classId}`);
  const sub = subclassId ? __op5eBuilt("subclasses").find((s) => s.id === subclassId) : null;
  const actor = await H.createActor({ name: `${cls.name}${sub ? "+" + sub.name : ""}`, abilities: { str: 15, dex: 14, con: 14, int: 12, wis: 12, cha: 10 } });
  const data = cls.toObject(); data.system.levels = level;
  const mgr = AM.forNewItem(actor, data, { automaticApplication: true });
  H.clearConsoleErrors();
  await __op5eRun(mgr, { level, sub, note, granted });
  const out = { class: cls.name, subclass: sub?.name ?? null, level, issues, granted: granted.length, grantedList: granted, ...(await __op5eSummarize(mgr.clone)) };
  out.consoleErrors = H.getConsoleErrors().slice(0, 3).map((s) => s.slice(0, 160));
  await H.cleanup();
  return out;
};

const results = [];
try {
  await withFoundry(async (page, { evaluate }) => {
    page.setDefaultTimeout(300000);
    await page.evaluate(`(${pageLib.toString()})(${JSON.stringify(BUILT)})`);
    const classes = await evaluate(() => __op5eBuilt("classes").map((d) => ({ id: d.id, name: d.name })));
    for (const c of classes.filter((c) => !only.length || only.includes(c.name))) {
      const run = async (subclassId) => {
        const r = await page.evaluate(`(${levelUp.toString()})(${JSON.stringify({ classId: c.id, subclassId, level })})`).catch((e) => ({ class: c.name, fatal: e.message.slice(0, 300), issues: [], badFormulas: [] }));
        results.push(r);
        console.log(`${r.class}${r.subclass ? " / " + r.subclass : ""}: ${r.fatal ?? `levels ${r.classLevels}, hp ${r.hpMax}, features ${r.features}, saves ${r.saves}, skills ${r.skills}, issues ${r.issues.length}, badFormulas ${r.badFormulas.length}`}`);
      };
      await run(null);
      if (withSubs) {
        const ids = await evaluate(async (cid) => { const cls = await fromUuid(`Compendium.op5e.classes.${cid}`); return __op5eBuilt("subclasses").filter((s) => s.system.classIdentifier === cls.system.identifier).map((s) => s.id); }, c.id);
        for (const sid of ids) await run(sid);
      }
    }
  });
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
writeFileSync(`reports/execution-classes${withSubs ? "-subclasses" : ""}.json`, JSON.stringify(results, null, 1));
