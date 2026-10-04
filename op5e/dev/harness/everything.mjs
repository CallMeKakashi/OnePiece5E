// Adds EVERY built compendium document to a suitable actor and uses it. The only test that counts.
//  - class/subclass features -> a persisted level-20 actor of the owning class (so @scale/@class values resolve)
//  - racial features         -> a persisted actor of the race
//  - feats, items, loot      -> a level-20 Fighter
//  - creations (spells)      -> a level-20 Medic (full caster, so slots exist)
//  - ship weapons            -> a Galleon
// Usage: node dev/harness/everything.mjs [pack ...]      -> reports/execution-everything.json
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { withFoundry, postToGM } from "./drive.mjs";
import { BUILT, pageLib } from "./advance-lib.mjs";

const only = process.argv.slice(2);
const PACKS = ["class-features", "racial-features", "feats", "items", "creations", "backgrounds", "devil-fruits", "ship-weapons"].filter((p) => !only.length || only.includes(p));
const OUT = process.env.SWEEP_OUT ?? "reports/execution-everything.json";
const results = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};

// ---- page-side -------------------------------------------------------------------------------------------------
const pageSetup = () => {
  Hooks.on("renderApplicationV2", (app, el) => { if (/RollConfigurationDialog/.test(app.constructor.name)) { let tries = 0; const t = setInterval(() => { const b = el.querySelector("button[type=submit], button[data-action=roll]"); if (b) b.click(); if (b || ++tries > 40) clearInterval(t); }, 150); } });
  const H = game.op5eHarness, AM = dnd5e.applications.advancement.AdvancementManager;
  const cache = new Map();
  const persist = async (clone, name) => {
    const data = clone.toObject(); delete data._stats; delete data._id;
    data.name = `[T] ${name}`; data.flags = { ...(data.flags ?? {}), op5e: { ...(data.flags?.op5e ?? {}), harnessTest: true, shard: game.user.id } };
    return Actor.create(data, { keepId: false });
  };
  globalThis.__actorFor = async (kind, a, b) => {
    const key = [kind, a, b ?? ""].join("|");
    if (cache.has(key)) return cache.get(key);
    let actor;
    if (kind === "class") {
      const cls = __op5eBuilt("classes").find((c) => c.name === a);
      const sub = b ? __op5eBuilt("subclasses").find((s) => s.system.classIdentifier === cls.system.identifier && (s.name === b || s.name.toLowerCase().includes(b.toLowerCase()))) : null;
      const temp = await H.createActor({ name: `${a}${sub ? "+" + sub.name : ""}`, abilities: { str: 16, dex: 16, con: 16, int: 16, wis: 16, cha: 16 } });
      const data = cls.toObject(); data.system.levels = 20;
      const mgr = AM.forNewItem(temp, data, { automaticApplication: true });
      await __op5eRun(mgr, { level: 20, sub, note: () => {}, granted: [] });
      mgr.clone.reset();
      actor = await persist(mgr.clone, `${a}${sub ? " " + sub.name : ""} L20`);
      await temp.delete();
    } else if (kind === "race") {
      const base = await __actorFor("class", "Fighter");
      const race = __op5eBuilt("races").find((r) => r.name === a);
      const temp = await H.createActor({ name: `${a}` });
      temp.updateSource({ items: base.items.map((i) => i.toObject()) }); temp.reset();
      const mgr = AM.forNewItem(temp, race.toObject(), { automaticApplication: true });
      await __op5eRun(mgr, { level: 1, sub: null, note: () => {}, granted: [] });
      const ri = mgr.clone.items.find((i) => i.type === "race"); mgr.clone.updateSource({ "system.details.race": ri.id }); mgr.clone.reset();
      actor = await persist(mgr.clone, `${a}`); await temp.delete();
    } else if (kind === "ship") {
      const s = __op5eBuilt("ships").find((x) => x.name === "Galleon");
      actor = await Actor.create({ ...s.toObject(), name: "[T] Galleon", flags: { op5e: { harnessTest: true, shard: game.user.id } } }, { keepId: false });
    }
    cache.set(key, actor); return actor;
  };
  globalThis.__notes = [];
  for (const k of ["warn", "error", "info"]) { const o = ui.notifications[k].bind(ui.notifications); ui.notifications[k] = (m, ...r) => { __notes.push(String(m)); return o(m, ...r); }; }
  globalThis.__tick = () => new Promise((r) => setTimeout(r, 0));
  globalThis.__useItem = async ({ pack, id, ctx }) => {
    const src = await fromUuid(`Compendium.op5e.${pack}.${id}`);
    const out = { id, name: src.name, type: src.type, ctx: ctx.label, activities: [], fails: [], warns: [] };
    let actor;
    try { actor = await __actorFor(...ctx.actor); } catch (e) { out.fails.push(`actor setup: ${String(e.message).slice(0, 140)}`); return out; }
    // a freshly built actor has 0 current spell slots: fill them like after a long rest
    const slots = Object.fromEntries(Object.entries(actor.system.spells ?? {}).filter(([, v]) => v?.max).map(([k, v]) => [k, { value: v.max }]));
    if (Object.keys(slots).length) await actor.update({ "system.spells": slots });
    const target = await H.createActor({ name: "Tgt", hp: 500 });
    try { const tok = await H.createToken(target); H.targetToken(tok); } catch { /* no canvas target is fine */ }
    const hpBefore = actor.system.attributes?.hp?.value;
    H.clearConsoleErrors();
    let item;
    try {
      const data = src.toObject(); delete data._id;
      [item] = await actor.createEmbeddedDocuments("Item", [data], { keepId: false });
    } catch (e) { out.fails.push(`add to actor: ${String(e.message).slice(0, 160)}`); await target.delete(); return out; }
    if (["weapon", "equipment"].includes(item.type) && "equipped" in item.system) await item.update({ "system.equipped": true });
    // activities that spend another feature's uses (Zoan forms spend Devil Fruit Uses) need that feature on the actor
    for (const a of item.system.activities ?? []) for (const t of a.consumption?.targets ?? []) {
      if (t.type !== "itemUses" || !t.target || actor.items.some((i) => i.system.identifier === t.target)) continue;
      const dep = ["feats", "class-features"].flatMap((pk) => __op5eBuilt(pk)).find((d) => (d.system.identifier || d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")) === t.target);
      if (dep) await actor.createEmbeddedDocuments("Item", [dep.toObject()], { keepId: false });
    }
    const acts = [...(item.system.activities ?? [])];
    // derived-data checks
    const um = item.system._source?.uses?.max;
    if (um && !Number.isFinite(Number(item.system.uses?.max))) out.fails.push(`uses.max "${um}" -> ${item.system.uses?.max}`);
    if (!item.system.description?.value && !["loot"].includes(item.type)) out.warns.push("empty description");
    for (const a of acts) {
      const r = { type: a.type, name: a.name };
      if (item.system.uses?.spent) await item.update({ "system.uses.spent": 0 });   // each activity gets a fresh use
      if (actor.system.spells) await actor.update({ "system.spells": Object.fromEntries(Object.entries(actor.system.spells).filter(([, v]) => v?.max).map(([k, v]) => [k, { value: v.max }])) });   // each option is its own cast
      const fxCount = () => actor.effects.size + (game.user.targets.first()?.actor?.effects.size ?? 0) + actor.items.reduce((n, i) => n + i.effects.size * 0, 0);
      const fx0 = fxCount();
      const msgs = __mine().length, qty = item.system.quantity, spent = item.system.uses?.spent;
      try {
        if (a.type === "summon") {
          // placing a token needs a canvas: verify every profile resolves and that the activity's bonuses evaluate on the summoned actor
          if (!a.profiles?.length) throw new Error("no summon profiles");
          for (const p of a.profiles) {
            const doc = await fromUuid(p.uuid);
            if (!doc) throw new Error(`profile "${p.name}" does not resolve (${p.uuid})`);
            if (doc.name !== p.name) throw new Error(`profile "${p.name}" points at "${doc.name}"`);
            const [sa] = await Actor.create([{ ...doc.toObject(), _id: undefined }], { keepId: false });
            try {
              const ch = await a.getChanges(sa, p, {});
              const hp = (ch.actorChanges ?? ch.actorUpdates ?? ch)["system.attributes.hp.max"] ?? sa.system.attributes.hp.max;
              if (!Number.isFinite(Number(hp)) && hp !== undefined) throw new Error(`profile "${p.name}": hp bonus did not evaluate`);
              if (!sa.items.some((i) => i.system.activities?.size)) r.warns = [...(r.warns ?? []), `${p.name}: no usable actions`];
            } finally { await sa.delete().catch(() => {}); }
          }
          r.message = true; r.summon = a.profiles.length;
          out.activities.push(r);
          continue;
        }
        await Promise.race([H.executeActivity(item, a.id), new Promise((_, j) => setTimeout(() => j(new Error("TIMEOUT")), 10000))]);
        await new Promise((res) => setTimeout(res, 150));
        r.message = __mine().length > msgs;
        const last = __mine().at(-1);
        const rolls = r.message ? last.rolls : [];
        r.rolls = rolls.map((x) => `${x.formula}=${x.total}`).slice(0, 3);
        if (!r.message) r.problem = `no chat message / not usable${__notes.length ? " (" + __notes.slice(-2).join("; ").slice(0, 120) + ")" : ""}`;
        for (const x of rolls) if (!Number.isFinite(x.total)) r.problem = `roll not finite: ${x.formula}`;
        // damage-bearing activities must roll damage
        if (["attack", "damage", "save", "heal"].includes(a.type)) {
          const parts = (a.damage?.parts ?? a.healing ? [a.healing] : []);
          const hasDmg = (a.damage?.parts?.length ?? 0) > 0 || (a.healing?.number || a.healing?.custom?.enabled);
          if (hasDmg) {
            try {
              const dr = await a.rollDamage({}, { configure: false }, {});
              const t = dr?.[0]?.total; if (!(t >= 0) || !Number.isFinite(t)) r.problem = `damage roll failed (${t})`; else r.damage = t;
            } catch (e) { r.problem = `damage roll error: ${String(e.message).slice(0, 80)}`; }
          }
        }
        // consumption: items that spend uses or quantity should show it
        const itemAfter = actor.items.get(item.id);
        r.consumed = !itemAfter || itemAfter.system.quantity !== qty || itemAfter.system.uses?.spent !== spent;
        // every effect an activity references must exist on the item and actually take hold when applied (as the chat card button does)
        for (const ref of a.effects ?? []) {
          const eff = item.effects.get(ref._id ?? ref.id);
          if (!eff) { r.problem = r.problem ?? `activity references missing effect ${ref._id ?? ref.id}`; continue; }
          const holder = a.target?.affects?.type === "self" || !game.user.targets.first() ? actor : game.user.targets.first().actor;
          const [applied] = await holder.createEmbeddedDocuments("ActiveEffect", [{ ...eff.toObject(), transfer: false, disabled: false }]);
          const live = holder.appliedEffects.some((x) => x.id === applied.id);
          const statusOk = !eff.statuses.size || [...eff.statuses].every((st) => holder.statuses.has(st));
          if (!live || !statusOk) r.problem = r.problem ?? `effect "${eff.name}" did not take hold (live=${live}, statuses=${statusOk})`;
          await applied.delete().catch(() => {});
        }
      } catch (e) { r.problem = String(e.message).slice(0, 140); }
      if (r.problem) r.uses = JSON.stringify({ item: item.system.uses?.toObject?.() ?? item.system.uses, act: a.uses?.toObject?.() ?? null, src: item.system._source.uses, consumption: a.consumption?.targets?.map((t) => t.toObject?.() ?? t) });
      if (r.problem) out.fails.push(`${a.type} "${a.name}": ${r.problem}`);
      out.activities.push(r);
      Object.values(ui.windows).forEach((w) => w.close({ force: true }));
    }
    const errs = H.getConsoleErrors().filter((e) => !/postNot|setting .hidden./.test(e)); if (errs.length) out.warns.push(`console: ${errs[0].slice(0, 120)}`);
    out.hp = hpBefore !== undefined ? [hpBefore, actor.system.attributes.hp.value] : null;
    await actor.items.get(item.id)?.delete().catch(() => {});
    await target.delete().catch(() => {});
    await game.messages.documentClass.deleteDocuments(__mine().filter((m) => !m.flags?.op5eTestLog).map((m) => m.id)).catch(() => {});
    return out;
  };
  // parallel shards share the world: each one only sees and removes its own actors and chat messages
  globalThis.__mine = () => game.messages.contents.filter((m) => m.author?.id === game.user.id);
  globalThis.__cleanActors = async () => { cache.clear(); for (const a of game.actors.filter((x) => x.getFlag("op5e", "shard") === game.user.id)) await a.delete().catch(() => {}); };
};

// ---- node-side: decide which actor each document needs -----------------------------------------------------------
const classNames = [...new Set(Object.values(BUILT.classes).map((c) => c.name))];
const racesNames = Object.values(BUILT.races).map((r) => r.name);
const ctxFor = (pack, d) => {
  if (pack === "class-features") {
    const req = d.system.requirements ?? "";
    const m = req.match(/^([A-Za-z ]+?)(?: \(([^)]+)\))?(?: (\d+))?$/);
    if (m && classNames.includes(m[1].trim())) return { label: req || m[1], actor: ["class", m[1].trim(), m[2] ?? null] };
    if (m && racesNames.includes(m[1].trim())) return { label: req, actor: ["race", m[1].trim()] };
    // "Battlemaster 3": a subclass name, so the actor needs that subclass (its scale values feed the feature's uses)
    const sc = m && Object.values(BUILT.subclasses).find((x) => x.name === m[1].trim());
    const owner = sc && Object.values(BUILT.classes).find((c) => c.system.identifier === sc.system.classIdentifier);
    if (owner) return { label: req, actor: ["class", owner.name, sc.name] };
    return { label: `generic (${req || "no requirement"})`, actor: ["class", "Fighter", null] };
  }
  if (pack === "racial-features") {
    const req = d.system.requirements ?? ""; const race = racesNames.find((r) => req.startsWith(r) || req.toLowerCase().startsWith(r.toLowerCase().replace(/s$/, "")));
    return { label: req, actor: race ? ["race", race] : ["class", "Fighter", null] };
  }
  if (pack === "creations") return { label: "Medic L20", actor: ["class", "Medic", null] };
  if (pack === "ship-weapons") return { label: "Galleon", actor: ["ship", "Galleon"] };
  return { label: "Fighter L20", actor: ["class", "Fighter", null] };
};

try {
  await withFoundry(async (page) => {
    page.setDefaultTimeout(600000);
    await page.evaluate(`(${pageLib.toString()})(${JSON.stringify(BUILT)})`);
    await page.evaluate(`(${pageSetup.toString()})()`);
    for (const pack of PACKS) {
      const docs = Object.values(BUILT[pack] ?? {}).filter((d) => !process.env.ONLY || process.env.ONLY.split("|").includes(d.name))
        .filter((_, i) => { const [k, n] = (process.env.SLICE ?? "0/1").split("/").map(Number); return i % n === k; });   // SLICE=k/n: every n-th doc, so shards split one big pack
      results[pack] = [];
      // group by actor so each leveled actor is built once
      const groups = new Map();
      for (const d of docs) { const c = ctxFor(pack, d); const k = JSON.stringify(c.actor); (groups.get(k) ?? groups.set(k, []).get(k)).push({ d, c }); }
      let n = 0; const total = docs.length;
      for (const [, list] of groups) {
        for (const { d, c } of list) {
          const r = await Promise.race([page.evaluate(`__useItem(${JSON.stringify({ pack, id: d._id, ctx: c })})`), new Promise((res) => setTimeout(() => res({ id: d._id, name: d.name, ctx: c.label, fails: ["HANG: no result after 120 s"], warns: [], activities: [] }), 120000))]).catch((e) => ({ id: d._id, name: d.name, fails: [`harness: ${e.message.slice(0, 140)}`], warns: [], activities: [] }));
          r.pack = pack; results[pack].push(r); n++;
          if (n % 10 === 0 || n === total) console.log(`PROGRESS ${pack} ${n}/${total} fails ${results[pack].filter((x) => x.fails.length).length}`);
          if (r.fails.length) console.log(`FAIL ${pack}/${r.name} [${r.ctx}]: ${r.fails.join(" | ")}`.slice(0, 260));
        }
        await page.evaluate("__cleanActors()").catch(() => {});
      }
      console.log(`== ${pack}: ${results[pack].length} docs, ${results[pack].filter((r) => r.fails.length).length} fail, ${results[pack].filter((r) => r.warns?.length).length} warn`);
      writeFileSync(OUT, JSON.stringify(results, null, 1));
      await postToGM(page, `<p>${results[pack].some((r) => r.fails.length) ? "❌" : "✅"} <b>Sweep</b> ${pack}: ${results[pack].length} documents, ${results[pack].filter((r) => r.fails.length).length} failed, ${results[pack].filter((r) => r.warns?.length).length} warnings</p>`);
    }
  });
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
writeFileSync(OUT, JSON.stringify(results, null, 1));
