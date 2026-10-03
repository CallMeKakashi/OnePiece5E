// Real level-up test: for every class and every subclass, create a level-1 character and level it 1 -> 20 one level at a time
// through dnd5e's own AdvancementManager.forLevelChange (what Foundry's Level Up button runs), checking at each level that
//  - the advancement completes without a silent failure (note() messages),
//  - class level, proficiency bonus and hit points go up,
//  - every feature the class/subclass table grants at that level is on the actor,
//  - every owned feature's uses.max evaluates (formulas follow the new level) and every activity is present.
// Usage: node dev/harness/levelup.mjs [Class ...]      Writes reports/execution-levelup.json (test world only).
import { writeFileSync } from "node:fs";
import { withFoundry, postToGM } from "./drive.mjs";
import { BUILT, pageLib } from "./advance-lib.mjs";

const only = process.argv.slice(2);
const classes = Object.values(BUILT.classes).filter((c) => !only.length || only.includes(c.name));
const subsByClass = {};
for (const s of Object.values(BUILT.subclasses)) (subsByClass[s.system.classIdentifier] ??= []).push(s);
const plan = classes.flatMap((c) => (subsByClass[c.system.identifier] ?? [null]).map((s) => ({ cls: c.name, clsId: c._id, sub: s?.name ?? null, subId: s?._id ?? null, heavy: process.env.HEAVY === "1" })));

const run = async (p) => {
  const AM = dnd5e.applications.advancement.AdvancementManager;
  const by = (pack, id) => __op5eBuilt(pack).find((d) => d.id === id || d._id === id || d.uuid?.endsWith(id));
  const out = { cls: p.cls, sub: p.sub, levels: [], fails: [] };
  const note = (m) => out.fails.push(m);
  const cls = by("classes", p.clsId), sub = p.subId ? by("subclasses", p.subId) : null;
  let actor = await Actor.create({ name: `[LU] ${p.cls}${p.sub ? ` / ${p.sub}` : ""}`, type: "character", system: { abilities: Object.fromEntries(["str", "dex", "con", "int", "wis", "cha"].map((k) => [k, { value: 14 }])), skills: Object.fromEntries((p.heavy ? ["acr", "ani", "arc", "ath", "dec", "his", "ins", "itm", "inv", "med", "nat", "prc"] : ["slt", "rel", "sur", "ste"]).map((k) => [k, { value: 1 }])) } });   // HEAVY=1: skills already taken by background/role, so class skill pools are mostly used up
  // a real character arrives with background proficiencies; expertise features (Bard level 10) need skills to pick from
  const persist = async (clone) => { const d = clone.toObject(); delete d._id; delete d._stats; d.name = actor.name; const n = await Actor.create(d, { keepId: false }); await actor.delete(); actor = n; };
  try {
    // level 1
    const data = cls.toObject(); data.system.levels = 1;
    let mgr = AM.forNewItem(actor, data, { automaticApplication: true });
    const subLevel = Array.from(cls.system.advancement ?? []).find((a) => a.type === "Subclass")?.level;   // some classes (Savant) choose it at level 1
    await __op5eRun(mgr, { level: 1, sub: subLevel === 1 ? sub : null, note, granted: [] }); mgr.clone.reset(); await persist(mgr.clone);
    // role, devil fruit and Haki are class advancement choices: exactly one role and one devil-fruit choice at level 1
    const roles = actor.items.filter((i) => i.flags?.op5e?.shipRole).length, fruits = actor.items.filter((i) => /devil fruit/i.test(i.name)).length;
    if (roles !== 1) out.fails.push(`L1: ${roles} role feat(s), expected 1`);
    if (fruits !== 1) out.fails.push(`L1: ${fruits} devil-fruit choice item(s), expected 1`);
    let prevHp = actor.system.attributes.hp.max, prevFeats = new Set(actor.items.filter((i) => i.type === "feat").map((i) => i.name));
    for (let lvl = 2; lvl <= 20; lvl++) {
      const c = actor.items.find((i) => i.type === "class");
      mgr = AM.forLevelChange(actor, c.id, 1, { automaticApplication: true });
      await __op5eRun(mgr, { level: lvl, sub, note: (m) => note(`L${lvl}: ${m}`), granted: [] });
      mgr.clone.reset(); await persist(mgr.clone); actor.reset();
      const cc = actor.items.find((i) => i.type === "class"), row = { level: lvl };
      if (cc.system.levels !== lvl) out.fails.push(`L${lvl}: class level is ${cc.system.levels}`);
      if (actor.system.details.level !== lvl) out.fails.push(`L${lvl}: character level is ${actor.system.details.level}`);
      const expectedProf = Math.floor((lvl - 1) / 4) + 2;
      if (actor.system.attributes.prof !== expectedProf) out.fails.push(`L${lvl}: proficiency bonus ${actor.system.attributes.prof}, expected ${expectedProf}`);
      row.hp = actor.system.attributes.hp.max; if (row.hp <= prevHp) out.fails.push(`L${lvl}: hit points did not increase (${prevHp} -> ${row.hp})`); prevHp = row.hp;
      // subclass chosen at its level?
      if (sub && !actor.items.some((i) => i.type === "subclass") && lvl >= (cls.system.advancement ? 3 : 3) + 0) { /* checked after the loop: some classes pick later */ }
      // every class/subclass ItemGrant advancement at this level must be on the actor
      const advs = [...Object.values(cc.system.advancement?.byId ?? {}), ...(actor.items.find((i) => i.type === "subclass")?.system.advancement?.byId ? Object.values(actor.items.find((i) => i.type === "subclass").system.advancement.byId) : [])];
      const have = new Set(actor.items.map((i) => i.name));
      for (const a of advs) {
        if (a.type !== "ItemGrant" || a.level !== lvl) continue;
        for (const it of a.configuration?.items ?? []) {
          if (it.optional) continue;
          const d = await fromUuid(it.uuid); if (d && !have.has(d.name)) out.fails.push(`L${lvl}: ${a.title || "grant"} should grant ${d.name}`);
        }
      }
      // owned features: uses formula follows the level; activities exist
      for (const i of actor.items.filter((i) => i.type === "feat")) {
        const um = i.system._source?.uses?.max;
        if (um && !Number.isFinite(Number(i.system.uses?.max))) out.fails.push(`L${lvl}: ${i.name} uses.max "${um}" -> ${i.system.uses?.max}`);
        if (i.system.activities && i.system.activities.size === 0 && i.system._source?.activities && Object.keys(i.system._source.activities).length) out.fails.push(`L${lvl}: ${i.name} lost its activities`);
      }
      // Haki: one tier chosen at each of levels 8, 10, 12, 14, 16
      const hakiCount = actor.items.filter((i) => /^(color of (armament|observation)|conqueror's haki) (novice|apprentice|journeyman|adept|master)$/i.test(i.name)).length;
      const hakiWant = [8, 10, 12, 14, 16].filter((l) => l <= lvl).length;
      if (hakiCount !== hakiWant) out.fails.push(`L${lvl}: ${hakiCount} Haki tier(s), expected ${hakiWant}`);
      row.features = actor.items.filter((i) => i.type === "feat").length; row.new = [...actor.items.filter((i) => i.type === "feat").map((i) => i.name)].filter((n) => !prevFeats.has(n)); prevFeats = new Set(actor.items.filter((i) => i.type === "feat").map((i) => i.name));
      out.levels.push(row);
    }
    if (sub && !actor.items.some((i) => i.type === "subclass")) out.fails.push("subclass was never granted by level 20");
  } catch (e) { out.fails.push(`crashed: ${String(e.message).slice(0, 200)}`); }
  await actor.delete().catch(() => {});
  return out;
};

const results = [];
try {
  await withFoundry(async (page) => {
    page.setDefaultTimeout(900000);
    await page.evaluate(`(${pageLib.toString()})(${JSON.stringify(BUILT)})`);
    for (const p of plan) {
      const r = await page.evaluate(`(${run.toString()})(${JSON.stringify(p)})`).catch((e) => ({ cls: p.cls, sub: p.sub, levels: [], fails: [`harness: ${String(e.message).slice(0, 160)}`] }));
      results.push(r);
      await postToGM(page, `<p>${r.fails.length ? "❌" : "✅"} <b>Level-up</b> ${r.cls}${r.sub ? ` / ${r.sub}` : ""}: ${r.levels.length + 1} levels${r.fails.length ? ` — ${r.fails.slice(0, 2).join(" | ")}` : " ok"}</p>`);
      console.log(`${r.fails.length ? "FAIL" : "ok  "} ${r.cls}${r.sub ? ` / ${r.sub}` : ""}: ${r.levels.length} levels${r.fails.length ? `, ${r.fails.length} issues: ${r.fails.slice(0, 3).join(" | ")}` : ""}`);
    }
  });
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
writeFileSync("reports/execution-levelup.json", JSON.stringify(results, null, 1));
console.log(`== level-up: ${results.length} class/subclass runs, ${results.filter((r) => r.fails.length).length} with issues`);
