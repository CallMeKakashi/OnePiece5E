// Shared page-side library for end-to-end character tests (classes, races, backgrounds, feats).
//  - serves Compendium.op5e.* UUIDs from the built packs-src JSON (tests what would ship, not Foundry's loaded packs)
//  - runs dnd5e AdvancementManager steps headlessly, auto-picking choices, and notes silent failures
import { readFileSync, readdirSync } from "node:fs";

export const BUILT = Object.fromEntries(
  readdirSync("packs-src").map((p) => [p, Object.fromEntries(readdirSync(`packs-src/${p}`).map((f) => { const d = JSON.parse(readFileSync(`packs-src/${p}/${f}`, "utf8")); return [d._id, d]; }))]),
);

/** Runs in the browser. Defines globalThis.__op5eBuilt / __op5eRun / __op5eSummarize. */
export const pageLib = (built) => {
  if (globalThis.__op5eLib) return;
  globalThis.__op5eLib = true;
  const cache = new Map();
  const find = (uuid) => {
    const m = String(uuid).match(/^Compendium\.op5e\.([a-z-]+)\.(?:Item\.|Actor\.)?([A-Za-z0-9]{16})$/);
    const d = m && built[m[1]]?.[m[2]];
    if (!d) return null;
    if (!cache.has(uuid)) {
      const doc = new (d.type === "npc" || d.type === "vehicle" ? Actor : Item).implementation(foundry.utils.deepClone(d));
      Object.defineProperty(doc, "uuid", { value: uuid });
      cache.set(uuid, doc);
    }
    return cache.get(uuid);
  };
  const of = globalThis.fromUuid, os = globalThis.fromUuidSync;
  globalThis.fromUuid = async (u, o) => find(u) ?? of(u, o);
  globalThis.fromUuidSync = (u, o) => find(u) ?? os(u, o);
  globalThis.__op5eBuilt = (pack) => Object.values(built[pack]).map((d) => find(`Compendium.op5e.${pack}.${d._id}`));
  globalThis.__op5eFind = find;

  /** Applies every step of an AdvancementManager. ctx: { level, sub, note(msg), granted[] } */
  globalThis.__op5eRun = async (mgr, ctx) => {
    const AM = dnd5e.applications.advancement.AdvancementManager, clone = mgr.clone;
    const { level, sub, note, granted } = ctx;
    const chosenSet = (adv) => new Set(Object.values(adv.value?.added ?? {}).flatMap((o) => Object.values(o)));
    const pick = async (flow, adv) => {
      const lvl = flow.level;
      switch (adv.constructor.typeName) {
        case "ItemChoice": {
          const have = chosenSet(adv), count = adv.configuration.choices[lvl]?.count ?? 0, out = {};
          for (const p of adv.configuration.pool) {
            if (Object.keys(out).length >= count) break;
            if (!have.has(p.uuid) && (await fromUuid(p.uuid))) out[p.uuid] = true;
          }
          if (Object.keys(out).length < count) note(`L${lvl} ${adv.title}: only ${Object.keys(out).length}/${count} choices available`);
          return out;
        }
        case "ItemGrant": return Object.fromEntries(adv.configuration.items.map((i) => [i.uuid, true]));
        case "Trait": {
          const chosen = [];
          for (const grp of adv.configuration.choices) {
            const avail = await adv.availableChoices(new Set(chosen));
            const leaves = [];
            const walk = (n) => { for (const [k, v] of Object.entries(n ?? {})) { if (v?.children) walk(v.children); else if (!v?.disabled) leaves.push(k); } };
            const sets = avail?.choices ?? avail; walk(sets?.choices ?? sets);
            const take = leaves.filter((k) => !chosen.includes(k) && !adv.configuration.grants.has?.(k) && ![...adv.configuration.grants].includes(k)).slice(0, grp.count);
            if (take.length < grp.count) note(`L${lvl} ${adv.title}: trait choice ${take.length}/${grp.count} pool=${JSON.stringify(grp.pool)} avail=${avail?.constructor?.name}:${[...(avail?.keys?.() ?? Object.keys(avail ?? {}))].slice(0, 6).join(",")} sets=${sets?.constructor?.name}:${[...(sets?.keys?.() ?? Object.keys(sets ?? {}))].slice(0, 6).join(",")} pool=${[...(grp.pool ?? [])].join("|")}`);
            chosen.push(...take);
          }
          return { chosen: [...adv.configuration.grants, ...chosen] };
        }
        case "AbilityScoreImprovement": {
          const c = adv.configuration, a = {};
          if (c.points > 0) { const pick1 = Object.keys(CONFIG.DND5E.abilities).find((k) => !c.locked.has(k) && !(c.fixed?.[k] > 0)) ?? Object.keys(CONFIG.DND5E.abilities).find((k) => !c.locked.has(k)); if (pick1) a[pick1] = c.points; else note(`L${lvl} ${adv.title}: no ability available for ASI`); }
          else if (!adv.item.parent?.items && !adv.item) a.str = 0;
          // class ASI (points 2, nothing locked) keeps the previous +1 STR/+1 CON behaviour
          if (c.points === 2 && c.cap === 2 && !c.locked.size) { for (const k of Object.keys(a)) delete a[k]; a.str = 1; a.con = 1; }
          return { type: "asi", assignments: a };
        }
        case "Subclass": return sub ? { uuid: sub.uuid } : null;
        case "HitPoints": return { [lvl]: "avg" };
        default: return flow.getAutomaticApplicationValue();
      }
    };

    let guard = 0;
    for (let i = 0; i < mgr.steps.length; i++) {
      if (++guard > 3000) { note("step guard hit"); break; }
      const step = mgr.steps[i];
      try {
        if (step.flow && step.type === "forward") {
          const adv = step.flow.advancement, t = adv.constructor.typeName;
          let d = step.flow.getAutomaticApplicationValue();
          if (d === false) d = await pick(step.flow, adv);
          if (d === null) { /* e.g. no subclass requested */ }
          else if (d === false || d === undefined) note(`L${step.flow.level} ${adv.title} (${t}): nothing to apply`);
          else {
            const before = new Set(clone.items.map((x) => x.id));
            await adv.apply(step.flow.level, d);
            // silent-failure check: every requested grant must have produced an item
            if (t === "ItemGrant" || t === "ItemChoice") {
              const want = Object.entries(d).filter(([k, v]) => v === true && String(k).startsWith("Compendium.")).map(([k]) => k);
              const got = new Set(clone.items.filter((x) => !before.has(x.id)).map((x) => x.flags?.dnd5e?.sourceId));
              for (const u of want) if (!got.has(u)) note(`L${step.flow.level} ${adv.title}: grant did not produce item for ${u}`);
            }
            for (const it of clone.items) if (!before.has(it.id)) {
              granted.push({ level: step.class?.level ?? step.flow.level, name: it.name, type: it.type });
              if (it.hasAdvancement) {
                const cls = clone.items.find((x) => x.type === "class");
                const extra = []; for (let l = 0; l <= level; l++) extra.push(...AM.flowsForLevel(it, l));
                mgr.steps.splice(i + 1, 0, ...extra.map((flow) => ({ type: "forward", flow, synthetic: true, class: { item: cls, level: Math.max(flow.level, 1) } })));
              }
            }
          }
        }
        if (step.class && !step.synthetic) step.class.item.updateSource({ "system.levels": step.class.level });
        clone.reset();
      } catch (e) { note(`step ${i} ${step.flow?.advancement?.title ?? ""} L${step.flow?.level}: ${String(e.message).slice(0, 140)}`); }
    }
    clone.reset();
  };

  /** Outcome checks on a resulting (cloned) character. */
  globalThis.__op5eSummarize = async (clone) => {
    const c = clone.items.find((x) => x.type === "class");
    const out = {
      classLevels: c?.system.levels, hpMax: clone.system.attributes.hp.max,
      saves: Object.entries(clone.system.abilities).filter(([, a]) => a.proficient).map(([k]) => k).join(","),
      skills: Object.entries(clone.system.skills).filter(([, s]) => s.value).length,
      features: clone.items.filter((x) => x.type === "feat").length,
      size: clone.system.traits.size, walk: clone.system.attributes.movement.walk, swim: clone.system.attributes.movement.swim, fly: clone.system.attributes.movement.fly, climb: clone.system.attributes.movement.climb, darkvision: clone.system.attributes.senses.darkvision,
      abilities: Object.fromEntries(Object.entries(clone.system.abilities).map(([k, a]) => [k, a.value])),
      languages: [...(clone.system.traits.languages?.value ?? [])].join(","),
    };
    const bad = [];
    for (const it of clone.items) {
      if (it.type === "class" || it.type === "subclass") continue;
      const src = it.system._source?.uses?.max;
      if (src && !Number.isFinite(Number(it.system.uses.max))) bad.push(`${it.name}: uses.max "${src}" -> ${it.system.uses.max}`);
      for (const a of it.system.activities ?? []) for (const p of a.damage?.parts ?? []) {
        const f = p.formula; if (!f) continue;
        try { const r = new Roll(f, it.getRollData()); await r.evaluate(); if (!Number.isFinite(r.total)) bad.push(`${it.name}: damage "${f}" -> ${r.total}`); }
        catch (e) { bad.push(`${it.name}: damage "${f}" ${String(e.message).slice(0, 60)}`); }
      }
    }
    out.badFormulas = bad;
    return out;
  };
};
