// Levels every op5e class (optionally with each subclass) 1..N through dnd5e's own AdvancementManager steps,
// auto-picking choices, then checks what the character actually ends up with.
// Usage: node dev/harness/classes.mjs [--subclasses] [--level=20] [ClassName ...]
import { writeFileSync } from "node:fs";
import { readFileSync, readdirSync } from "node:fs";
import { withFoundry } from "./drive.mjs";

// Test what would ship: serve Compendium.op5e.* UUIDs from the built packs-src JSON instead of Foundry's (old) loaded packs.
const BUILT = Object.fromEntries(readdirSync("packs-src").map((p) => [p, Object.fromEntries(readdirSync(`packs-src/${p}`).map((f) => { const d = JSON.parse(readFileSync(`packs-src/${p}/${f}`, "utf8")); return [d._id, d]; }))]));
const installShim = (built) => {
  if (globalThis.__op5eShim) return; globalThis.__op5eShim = true;
  const cache = new Map();
  const find = (uuid) => { const m = String(uuid).match(/^Compendium.op5e.([a-z-]+).(?:Item.|Actor.)?([A-Za-z0-9]{16})$/); const d = m && built[m[1]]?.[m[2]]; if (!d) return null; if (!cache.has(uuid)) { const doc = new (d.type === "npc" || d.type === "vehicle" ? Actor : Item).implementation(foundry.utils.deepClone(d)); Object.defineProperty(doc, "uuid", { value: uuid }); cache.set(uuid, doc); } return cache.get(uuid); };
  const of = globalThis.fromUuid, os = globalThis.fromUuidSync;
  globalThis.fromUuid = async (u, o) => find(u) ?? of(u, o);
  globalThis.fromUuidSync = (u, o) => find(u) ?? os(u, o);
  globalThis.__op5eBuilt = (pack) => Object.values(built[pack]).map((d) => find(`Compendium.op5e.${pack}.${d._id}`));
};

const args = process.argv.slice(2);
const withSubs = args.includes("--subclasses");
const level = Number(args.find((a) => a.startsWith("--level="))?.split("=")[1] ?? 20);
const only = args.filter((a) => !a.startsWith("--"));

const levelUp = async ({ classId, subclassId, level }) => {
  void 0;
  const AM = dnd5e.applications.advancement.AdvancementManager;
  const H = game.op5eHarness;
  const issues = [], granted = [], note = (m) => issues.push(m);
  const cls = await fromUuid(`Compendium.op5e.classes.${classId}`);
  const actor = await H.createActor({ name: `${cls.name}${subclassId ? "+sub" : ""}`, abilities: { str: 15, dex: 14, con: 14, int: 12, wis: 12, cha: 10 } });
  const data = cls.toObject(); data.system.levels = level;
  const mgr = AM.forNewItem(actor, data, { automaticApplication: true });
  const clone = mgr.clone;
  const subs = __op5eBuilt("subclasses").filter((s) => s.system.classIdentifier === cls.system.identifier);
  const sub = subclassId ? subs.find((s) => s.id === subclassId) : null;
  H.clearConsoleErrors();

  const chosenSet = (adv) => new Set(Object.values(adv.value?.added ?? {}).flatMap((o) => Object.values(o)));
  const pick = async (flow, adv) => {
    const lvl = flow.level;
    switch (adv.constructor.typeName) {
      case "ItemChoice": {
        const have = chosenSet(adv); const count = adv.configuration.choices[lvl]?.count ?? 0; const out = {};
        for (const p of adv.configuration.pool) { if (Object.keys(out).length >= count) break; if (!have.has(p.uuid) && (await fromUuid(p.uuid))) out[p.uuid] = true; }
        if (Object.keys(out).length < count) note(`L${lvl} ${adv.title}: only ${Object.keys(out).length}/${count} choices available`);
        return out;
      }
      case "ItemGrant": return Object.fromEntries(adv.configuration.items.map((i) => [i.uuid, true]));
      case "Trait": {
        const chosen = [];
        for (const grp of adv.configuration.choices) {
          const avail = await adv.availableChoices(new Set([...chosen, ...adv.configuration.grants]));
          const leaves = []; const walk = (n) => { for (const [k, v] of Object.entries(n ?? {})) { if (v?.children) walk(v.children); else if (!v?.disabled) leaves.push(k); } };
          const sets = avail?.choices ?? avail; walk(sets?.choices ?? sets);
          const take = leaves.filter((k) => !chosen.includes(k)).slice(0, grp.count);
          if (take.length < grp.count) note(`L${lvl} ${adv.title}: trait choice ${take.length}/${grp.count}`);
          chosen.push(...take);
        }
        return { chosen: [...adv.configuration.grants, ...chosen] };
      }
      case "AbilityScoreImprovement": return { type: "asi", assignments: { str: 1, con: 1 } };
      case "Subclass": return sub ? { uuid: sub.uuid } : null;
      case "HitPoints": return { [lvl]: "avg" };
      default: return flow.getAutomaticApplicationValue();
    }
  };

  let guard = 0;
  for (let i = 0; i < mgr.steps.length; i++) {
    if (++guard > 2000) { note("step guard hit"); break; }
    const step = mgr.steps[i];
    try {
      if (step.flow && step.type === "forward") {
        const adv = step.flow.advancement; const t = adv.constructor.typeName;
        let d = step.flow.getAutomaticApplicationValue();
        if (d === false) d = await pick(step.flow, adv);
        if (d === null) { if (t === "Subclass") { /* no subclass requested */ } }
        else if (d === false || d === undefined) note(`L${step.flow.level} ${adv.title} (${t}): nothing to apply`);
        else {
          const before = new Set(clone.items.map((x) => x.id));
          await adv.apply(step.flow.level, d);
          for (const it of clone.items) if (!before.has(it.id)) {
            granted.push({ level: step.class?.level ?? step.flow.level, name: it.name, type: it.type });
            // granted items can carry their own advancement (subclasses, powers): run their flows up to this class level
            if (it.hasAdvancement) {
              const upTo = clone.items.find((x) => x.type === "class")?.system.levels ?? level;
              const extra = []; for (let l = 0; l <= level; l++) extra.push(...AM.flowsForLevel(it, l));
              mgr.steps.splice(i + 1, 0, ...extra.map((flow) => ({ type: "forward", flow, synthetic: true, class: { item: clone.items.find((x) => x.type === "class"), level: Math.max(flow.level, 1) } })));
            }
          }
        }
      }
      if (step.class && !step.synthetic) { step.class.item.updateSource({ "system.levels": step.class.level }); }
      clone.reset();
    } catch (e) { note(`step ${i} ${step.flow?.advancement?.title ?? ""} L${step.flow?.level}: ${String(e.message).slice(0, 140)}`); }
  }
  clone.reset();

  // Outcome checks on the resulting character
  const out = { class: cls.name, subclass: sub?.name ?? null, level, issues, granted: granted.length, grantedList: granted };
  const c = clone.items.find((x) => x.type === "class"); out.classLevels = c?.system.levels;
  out.hpMax = clone.system.attributes.hp.max; out.hitDice = c?.system.hd?.max;
  out.saves = Object.entries(clone.system.abilities).filter(([, a]) => a.proficient).map(([k]) => k).join(",");
  out.skills = Object.entries(clone.system.skills).filter(([, s]) => s.value).length;
  out.features = clone.items.filter((x) => x.type === "feat").length;
  out.scale = c ? Object.keys(c.scaleValues ?? {}).length : 0;
  const bad = [];
  for (const it of clone.items) {
    if (it.type === "class" || it.type === "subclass") continue;
    const um = it.system.uses?.max;
    if (um !== undefined && it.system._source?.uses?.max && !Number.isFinite(Number(it.system.uses.max))) bad.push(`${it.name}: uses.max "${it.system._source.uses.max}" -> ${um}`);
    for (const a of it.system.activities ?? []) {
      for (const p of a.damage?.parts ?? []) {
        const f = p.formula; if (!f) continue;
        try { const r = new Roll(f, it.getRollData()); if (/@/.test(r.formula) && !/@/.test(f)) bad.push(`${it.name}: ${f}`); await r.evaluate(); if (!Number.isFinite(r.total)) bad.push(`${it.name}: damage "${f}" -> ${r.total}`); }
        catch (e) { bad.push(`${it.name}: damage "${f}" ${String(e.message).slice(0, 60)}`); }
      }
    }
  }
  out.badFormulas = bad;
  out.consoleErrors = H.getConsoleErrors().slice(0, 3).map((s) => s.slice(0, 160));
  await H.cleanup();
  return out;
};

const results = [];
try {
  await withFoundry(async (page, { evaluate }) => {
    page.setDefaultTimeout(300000);
    await page.evaluate(`(${installShim.toString()})(${JSON.stringify(BUILT)})`);
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
