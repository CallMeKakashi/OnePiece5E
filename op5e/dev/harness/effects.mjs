// Embeds every built item that carries Active Effects on a fresh character and checks that each effect change
// actually alters the derived actor data (so DAE-style "wired" passives really work, not just exist).
import { writeFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
import { BUILT, pageLib } from "./advance-lib.mjs";

const docs = Object.entries(BUILT).flatMap(([pack, m]) => Object.values(m).filter((d) => d.effects?.length).map((d) => ({ pack, d })));

const probe = async ({ pack, d }) => {
  const H = game.op5eHarness, out = { pack, name: d.name, changes: [], pass: true };
  const actor = await H.createActor({ name: "Fx", abilities: { str: 14, dex: 14, con: 14, int: 14, wis: 14, cha: 14 } });
  const read = (key) => {
    const v = foundry.utils.getProperty(actor, key);
    return v instanceof Set ? [...v].sort().join(",") : typeof v === "object" ? JSON.stringify(v) : v;
  };
  const watch = (c) => {
    const extra = { "system.attributes.ac.formula": ["system.attributes.ac.value", "system.attributes.ac.calc"], "system.attributes.hp.bonuses.level": ["system.attributes.hp.max"], "flags.dnd5e.initiativeAdv": ["system.attributes.init.roll.mode"] }[c.key] ?? [];
    return [c.key, ...extra];
  };
  const keys = [...new Set(d.effects.flatMap((e) => e.changes.flatMap(watch)))];
  const before = Object.fromEntries(keys.map((k) => [k, read(k)]));
  const data = foundry.utils.deepClone(d); delete data._id;
  H.clearConsoleErrors();
  let item;
  try { [item] = await actor.createEmbeddedDocuments("Item", [data], { keepId: false }); }
  catch (e) { out.pass = false; out.error = e.message.slice(0, 160); await H.cleanup(); return out; }
  for (const e of d.effects) {
    const live = item.effects.find((x) => x.name === e.name);
    const applied = actor.appliedEffects.some((x) => x.name === e.name);
    for (const c of e.changes) {
      const ks = watch(c), moved = ks.filter((k) => read(k) !== before[k]);
      const ok = applied && moved.length > 0;
      out.changes.push({ effect: e.name, key: c.key, mode: c.mode, value: c.value, applied, disabled: !!live?.disabled, transfer: live?.transfer, before: before[c.key], after: read(c.key), ok });
      if (!ok) out.pass = false;
    }
  }
  out.consoleErrors = H.getConsoleErrors().slice(0, 2).map((s) => s.slice(0, 140));
  await H.cleanup();
  return out;
};

const results = [];
try {
  await withFoundry(async (page) => {
    page.setDefaultTimeout(300000);
    await page.evaluate(`(${pageLib.toString()})(${JSON.stringify(BUILT)})`);
    for (const x of docs) {
      const r = await page.evaluate(`(${probe.toString()})(${JSON.stringify(x)})`).catch((e) => ({ pack: x.pack, name: x.d.name, pass: false, error: e.message.slice(0, 200), changes: [] }));
      results.push(r);
      if (!r.pass) console.log(`FAIL ${r.pack}/${r.name}: ${r.error ?? r.changes.filter((c) => !c.ok).map((c) => `${c.key}(${c.mode}:${c.value}) before=${c.before} after=${c.after} applied=${c.applied}`).join("; ")}`);
    }
  });
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
writeFileSync("reports/execution-effects.json", JSON.stringify(results, null, 1));
console.log(`${results.filter((r) => r.pass).length}/${results.length} items with effects behave`);
