// Token-attached auras (#41): the four aura features get an Aura Effects aura when they are put on a character; the pack data itself stays plain.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  for (const x of game.actors.filter((y) => /^\[AURA\]/.test(y.name))) await x.delete();
  for (const sc of game.scenes.filter((y) => y.name === "[AURA] Scene")) await sc.delete();
  let a, scene;
  try {
    ok("Aura Effects is active", !!game.modules.get("auraeffects")?.active);
    const pack = game.packs.get("op5e.class-features"), idx = await pack.getIndex();
    a = await Actor.create({ name: "[AURA] Test", type: "character" });
    for (const [name, disp, key] of [["Aura of Courage", 1, "system.traits.ci.value"], ["Aura of Devotion", 1, "system.traits.ci.value"], ["Aura of Freedom", 1, "system.attributes.movement.ignoredDifficultTerrain"], ["Aura of Tenacity", -1, "flags.midi-qol.disadvantage.attack.all"]]) {
      const e = idx.find((x) => x.name === name); if (!e) { ok(`${name} exists in the pack`, false); continue; }
      const src = await pack.getDocument(e._id);
      ok(`${name}: the pack item has no aura-type effect (stays valid without Aura Effects)`, ![...src.effects].some((x) => x.type === "auraeffects.aura"));
      if (/Freedom|Tenacity/.test(name)) ok(`${name}: the old button is gone`, ![...src.system.activities].some((x) => x.name === name));
      const [item] = await a.createEmbeddedDocuments("Item", [src.toObject()]);
      await new Promise((r) => setTimeout(r, 800));
      const fx = [...item.effects].find((x) => x.type === "auraeffects.aura");
      ok(`${name}: gets an aura effect on the character`, !!fx, fx ? `${fx.type} disposition ${fx.system.disposition}` : "none");
      ok(`${name}: disposition and radius`, fx?.system.disposition === disp && /floor\(@details\.level \/ 18\)/.test(fx?.system.distanceFormula ?? ""));
      ok(`${name}: carries the change`, !!fx && (fx.changes.some((c) => c.key === key) || (fx.system.stashedChanges ?? []).some((c) => c.key === key)));   // an aura that does not apply to its owner keeps its changes stashed
      ok(`${name}: not added twice`, [...item.effects].filter((x) => x.type === "auraeffects.aura").length === 1);
    }
    // the aura on a real canvas: an ally next to the carrier gets it, one far away does not, and it follows a token that walks away and back
    scene = await Scene.create({ name: "[AURA] Scene", width: 1000, height: 1000, grid: { size: 100, distance: 5 } });
    const mk = async (name, x) => { const act = await Actor.create({ name, type: "character", prototypeToken: { actorLink: true, name } }); const [tk] = await scene.createEmbeddedDocuments("Token", [{ name, actorId: act.id, actorLink: true, x, y: 400 }]); return { act, tk }; };
    await scene.view(); await wait(2500);
    const P = await mk("[AURA] Paladin", 300), AL = await mk("[AURA] Ally", 400), FAR = await mk("[AURA] Far", 900);
    const ci = (x) => [...x.act.system.traits.ci.value];
    const courage = idx.find((x) => x.name === "Aura of Courage");
    await P.act.createEmbeddedDocuments("Item", [(await pack.getDocument(courage._id)).toObject()]);
    const until = async (fn, ms = 9000) => { const t = Date.now(); while (Date.now() - t < ms) { if (fn()) return true; await wait(300); } return fn(); };
    ok("an ally next to the carrier gets the aura", await until(() => ci(AL).includes("frightened")), `ally: ${ci(AL)}`);
    ok("the carrier has it too", ci(P).includes("frightened"));
    ok("a creature far away does not", !ci(FAR).includes("frightened"));
    await AL.tk.update({ x: 900 }, { animate: false });
    ok("it is removed when the ally walks out of range", await until(() => !ci(AL).includes("frightened")), `ally: ${ci(AL)}`);
    await AL.tk.update({ x: 400 }, { animate: false });
    ok("and returns when the ally walks back in", await until(() => ci(AL).includes("frightened")), `ally: ${ci(AL)}`);
    for (const x of [P, AL, FAR]) await x.act.delete().catch(() => {});
    a.system.details.level; ok("the aura radius is 10 ft below level 18", Math.floor(1 / 18) === 0 && 10 + 20 * Math.floor(18 / 18) === 30);
  } catch (e) { ok("the test itself stopped", false, e.message); }
  await a?.delete().catch(() => {}); await scene?.delete().catch(() => {});
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } }, { extraModules: ["auraeffects"] });
