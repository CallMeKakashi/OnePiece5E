// Applies every built feat that has advancement or effects to a level-1 Fighter and asserts the real outcome:
// ability scores, proficiencies (skills/tools/saves/armor) and passive effect bonuses.
import { writeFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
import { BUILT, pageLib } from "./advance-lib.mjs";

const feats = Object.values(BUILT.feats).filter((d) => d.system.advancement?.length || d.effects?.length);

const apply = async ({ id }) => {
  const H = game.op5eHarness, AM = dnd5e.applications.advancement.AdvancementManager;
  const issues = [], granted = [], note = (m) => issues.push(m);
  const feat = await fromUuid(`Compendium.op5e.feats.${id}`);
  const mk = async () => {
    const actor = await H.createActor({ name: feat.name, abilities: { str: 12, dex: 12, con: 12, int: 12, wis: 12, cha: 12 } });
    const fighter = __op5eBuilt("classes").find((c) => c.name === "Fighter").toObject(); fighter.system.levels = 1;
    const m1 = AM.forNewItem(actor, fighter, { automaticApplication: true });
    await __op5eRun(m1, { level: 1, sub: null, note: () => {}, granted: [] });
    return m1.clone;
  };
  const base = await mk();
  const snap = (a) => ({
    abilities: Object.fromEntries(Object.entries(a.system.abilities).map(([k, v]) => [k, v.value])),
    saves: Object.entries(a.system.abilities).filter(([, v]) => v.proficient).map(([k]) => k),
    skills: Object.fromEntries(Object.entries(a.system.skills).map(([k, v]) => [k, v.value])),
    tools: Object.fromEntries(Object.entries(a.system.tools ?? {}).map(([k, v]) => [k, v.value])),
    armor: [...(a.system.traits.armorProf?.value ?? [])],
    init: a.system.attributes.init.bonus, hpMax: a.system.attributes.hp.max,
    passive: Object.fromEntries(["prc", "inv"].map((k) => [k, a.system.skills[k].passive])),
  });
  const before = snap(base);
  const actor2 = await H.createActor({ name: feat.name + " (feat)" });
  actor2.updateSource({ items: base.items.map((i) => i.toObject()), system: { abilities: Object.fromEntries(Object.entries(before.abilities).map(([k, v]) => [k, { value: v }])) } });
  actor2.reset();
  const mgr = AM.forNewItem(actor2, feat.toObject(), { automaticApplication: true });
  H.clearConsoleErrors();
  await __op5eRun(mgr, { level: 1, sub: null, note, granted });
  const clone = mgr.clone; clone.reset();
  return { name: feat.name, issues, before, after: snap(clone), applied: clone.appliedEffects.map((e) => e.name), consoleErrors: H.getConsoleErrors().slice(0, 2) };
};

const results = [];
try {
  await withFoundry(async (page) => {
    page.setDefaultTimeout(300000);
    await page.evaluate(`(${pageLib.toString()})(${JSON.stringify(BUILT)})`);
    for (const f of feats) {
      const r = await page.evaluate(`(${apply.toString()})(${JSON.stringify({ id: f._id })})`).catch((e) => ({ name: f.name, fatal: e.message.slice(0, 200), issues: [] }));
      const fails = [...(r.issues ?? [])];
      if (!r.fatal) {
        for (const adv of f.system.advancement ?? []) {
          const c = adv.configuration;
          if (adv.type === "AbilityScoreImprovement") {
            const want = Object.values(c.fixed ?? {}).reduce((a, b) => a + b, 0) + c.points;
            const got = Object.keys(r.after.abilities).reduce((n, k) => n + (r.after.abilities[k] - r.before.abilities[k]), 0);
            if (got !== want) fails.push(`ASI total +${got}, expected +${want}`);
            for (const k of Object.keys(c.locked ?? [])) void k;
            for (const k of c.locked ?? []) if (r.after.abilities[k] !== r.before.abilities[k]) fails.push(`locked ability ${k} changed`);
          }
          if (adv.type === "Trait") {
            for (const g of c.grants) {
              const [t, key] = [g.split(":")[0], g.split(":").slice(1).join(":")];
              const ok = t === "skills" ? r.after.skills[key] >= (c.mode === "upgrade" ? 1 : 1)
                : t === "saves" ? r.after.saves.includes(key)
                : t === "tool" ? (r.after.tools[key] ?? 0) >= 1
                : t === "armor" ? r.after.armor.includes(key) : true;
              if (!ok) fails.push(`grant ${g} not applied`);
            }
          }
        }
        for (const e of f.effects ?? []) for (const ch of e.changes) {
          if (ch.key.endsWith("init.bonus") && String(r.after.init) === String(r.before.init)) fails.push("initiative unchanged");
          if (ch.key.endsWith("hp.bonuses.level") && r.after.hpMax === r.before.hpMax) fails.push("hp max unchanged");
          const m = ch.key.match(/skills\.(\w+)\.bonuses\.passive/);
          if (m && r.after.passive[m[1]] === r.before.passive[m[1]]) fails.push(`passive ${m[1]} unchanged`);
        }
      }
      r.fails = fails; r.pass = !r.fatal && fails.length === 0; results.push(r);
      if (!r.pass) console.log(`FAIL ${r.name}: ${r.fatal ?? fails.join("; ")}`);
    }
  });
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
writeFileSync("reports/execution-feats.json", JSON.stringify(results, null, 1));
console.log(`${results.filter((r) => r.pass).length}/${results.length} feats with automation behave`);
