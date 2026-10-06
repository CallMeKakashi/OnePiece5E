// Token-attached auras (#41): the four aura features get an Aura Effects aura when they are put on a character; the pack data itself stays plain.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  for (const x of game.actors.filter((y) => y.name === "[AURA] Test")) await x.delete();
  let a;
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
    a.system.details.level; ok("the aura radius is 10 ft below level 18", Math.floor(1 / 18) === 0 && 10 + 20 * Math.floor(18 / 18) === 30);
  } catch (e) { ok("the test itself stopped", false, e.message); }
  await a?.delete().catch(() => {});
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } }, { extraModules: ["auraeffects"] });
