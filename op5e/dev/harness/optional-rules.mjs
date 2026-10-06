// Live test of the optional Suggested Rulings (scripts/optional-rules.mjs): Critical Saving Throws, Siege vs Constructs, Unreasonable Strength.
// Turns each world setting on, exercises it on throw-away data in the test world, and turns every setting back off.
// Midi workflows are simulated by calling the registered Midi hook handlers with a stand-in workflow (a real save cannot be forced to a natural 20/1).
// Usage: node dev/harness/optional-rules.mjs      Writes reports/execution-optional-rules.json (test world only).
import { writeFileSync } from "node:fs";
import { withFoundry, postToGM } from "./drive.mjs";

const run = async () => {
  const out = { results: [] };
  const check = (label, pass, got) => out.results.push({ label, pass: !!pass, got });
  const KEYS = ["optCriticalSaves", "optSiegeConstructs", "optUnreasonableStrength"];
  const set = (k, v) => game.settings.set("op5e", k, v);
  const fire = async (name, ...args) => { for (const h of Hooks.events[name] ?? []) { try { await h.fn(...args); } catch (e) { if (!/modules\/(?!op5e)/.test(String(e.stack))) throw e; } } };   // other modules' handlers choke on this fake workflow; only op5e's own errors count
  const sets = () => ({ saves: new Set(), failedSaves: new Set(), superSavers: new Set(), criticalSaves: new Set(), fumbleSaves: new Set() });

  try {
    for (const k of KEYS) check(`${k} registered, default off`, game.settings.settings.has(`op5e.${k}`) && game.settings.settings.get(`op5e.${k}`).default === false, game.settings.settings.has(`op5e.${k}`));

    // Unreasonable Strength: level 5, Str 18 -> 18 x 15 x 5 = 1350 (imperial)
    const actor = await Actor.create({ name: "[OR]", type: "character", system: { abilities: { str: { value: 18 } } } });
    try {
      await actor.createEmbeddedDocuments("Item", [{ name: "Fighter", type: "class", system: { identifier: "fighter", levels: 5 } }]);
      await set("optUnreasonableStrength", false); actor.reset();
      const before = actor.system.attributes.encumbrance.max;
      await set("optUnreasonableStrength", true); actor.reset();
      const after = actor.system.attributes.encumbrance.max;
      out.encumbrance = { before, after };
      check("capacity before = Str 18 x 15 = 270 (imperial)", game.settings.get("dnd5e", "metricWeightUnits") ? true : before === 270, before);
      check("capacity after = before x level 5 (1350 imperial)", after === before * 5, after);
      await set("optUnreasonableStrength", false); actor.reset();
      check("setting off restores capacity", actor.system.attributes.encumbrance.max === before, actor.system.attributes.encumbrance.max);
    } finally { await actor.delete().catch(() => {}); }

    // Critical Saving Throws, Midi path
    const A = { id: "A" }, B = { id: "B" }, C = { id: "C" };
    const wf = { ...sets(), damageRolls: [new Roll("8d6")] };
    wf.criticalSaves.add(A); wf.fumbleSaves.add(B); wf.failedSaves.add(A); wf.saves.add(B); wf.superSavers.add(B);
    await set("optCriticalSaves", false);
    await fire("midi-qol.postCheckSaves", wf);
    check("off: postCheckSaves changes nothing", !wf.saves.has(A) && wf.failedSaves.has(A) && wf.saves.has(B), null);
    await set("optCriticalSaves", true);
    await fire("midi-qol.postCheckSaves", wf);
    check("natural 20: saves, not failed, takes no damage (super saver)", wf.saves.has(A) && !wf.failedSaves.has(A) && wf.superSavers.has(A), null);
    check("natural 1: fails, no super save", !wf.saves.has(B) && wf.failedSaves.has(B) && !wf.superSavers.has(B), null);
    const di = () => ({ hpDamage: 10, oldHP: 30, newHP: 20, totalDamage: 10, damageDetail: [{ type: "fire", value: 10 }], details: [] });
    const d1 = di();
    await fire("midi-qol.preTargetDamageApplication", B, { workflow: { ...wf, item: null }, ditem: d1 });
    check("natural 1 on a damaging effect adds one extra damage die (d6)", d1.hpDamage >= 11 && d1.hpDamage <= 16 && d1.totalDamage === d1.hpDamage, d1.hpDamage);
    const d2 = di();
    await fire("midi-qol.preTargetDamageApplication", C, { workflow: { ...wf, item: null }, ditem: d2 });
    check("no extra die without a fumble", d2.hpDamage === 10, d2.hpDamage);

    // dnd5e path (Midi inactive): a chat note only
    const midi = !!game.modules.get("midi-qol")?.active;
    const n0 = game.messages.size;
    Hooks.callAll("dnd5e.rollSavingThrow", [{ isCritical: true }], { ability: "dex", subject: game.user.character ?? game.actors.contents[0] });
    await new Promise((r) => setTimeout(r, 800));
    const note = game.messages.size - n0;
    check(midi ? "Midi active: no duplicate chat note" : "Midi inactive: chat note posted", midi ? note === 0 : note === 1, note);
    await new Promise((r) => setTimeout(r, 3000));   // see harness.mjs: never delete a card Midi may still update
    for (const m of game.messages.contents.slice(n0)) await m.delete().catch(() => {});
    await set("optCriticalSaves", false);

    // Siege vs Constructs
    const construct = { actor: { system: { details: { type: { value: "construct" } } } } };
    const humanoid = { actor: { system: { details: { type: { value: "humanoid" } } } } };
    const siegeWf = { ...sets(), damageRolls: [new Roll("2d10")], item: { system: { type: { value: "siege" }, description: { value: "" } } } };
    const textWf = { ...siegeWf, item: { system: { type: { value: "martialR" }, description: { value: "<p>A ship cannon. Siege weapon.</p>" } } } };
    const plainWf = { ...siegeWf, item: { system: { type: { value: "martialR" }, description: { value: "<p>A pistol.</p>" } } } };
    await set("optSiegeConstructs", false);
    let d = di(); await fire("midi-qol.preTargetDamageApplication", construct, { workflow: siegeWf, ditem: d });
    check("off: no extra siege damage", d.hpDamage === 10, d.hpDamage);
    await set("optSiegeConstructs", true);
    d = di(); await fire("midi-qol.preTargetDamageApplication", construct, { workflow: siegeWf, ditem: d });
    check("siege type vs Construct: +1d8", d.hpDamage >= 11 && d.hpDamage <= 18 && d.damageDetail.at(-1).type === "fire", d.hpDamage);
    d = di(); await fire("midi-qol.preTargetDamageApplication", construct, { workflow: textWf, ditem: d });
    check("'Siege weapon' text vs Construct: +1d8", d.hpDamage >= 11 && d.hpDamage <= 18, d.hpDamage);
    d = di(); await fire("midi-qol.preTargetDamageApplication", humanoid, { workflow: siegeWf, ditem: d });
    check("siege vs non-Construct: unchanged", d.hpDamage === 10, d.hpDamage);
    d = di(); await fire("midi-qol.preTargetDamageApplication", construct, { workflow: plainWf, ditem: d });
    check("non-siege weapon vs Construct: unchanged", d.hpDamage === 10, d.hpDamage);
  } catch (e) {
    check("harness ran without throwing", false, String(e.stack ?? e).slice(0, 300));
  } finally {
    for (const k of KEYS) await set(k, false).catch(() => {});
    out.allOff = KEYS.every((k) => game.settings.get("op5e", k) === false);
  }
  return out;
};

let results = { results: [] };
try {
  await withFoundry(async (page) => {
    page.setDefaultTimeout(300000);
    results = await page.evaluate(`(${run.toString()})()`);
    for (const x of results.results) if (!x.pass) console.log(`FAIL ${x.label} -> ${JSON.stringify(x.got)}`);
    const pass = results.results.filter((x) => x.pass).length;
    await postToGM(page, `<p>${pass === results.results.length ? "✅" : "❌"} <b>Optional rulings</b>: ${pass}/${results.results.length} cases pass, settings restored off: ${results.allOff}</p>`);
    console.log(`== optional rulings: ${pass}/${results.results.length} pass; encumbrance ${JSON.stringify(results.encumbrance)}; all settings off: ${results.allOff}`);
  });
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
writeFileSync("reports/execution-optional-rules.json", JSON.stringify(results, null, 1));
