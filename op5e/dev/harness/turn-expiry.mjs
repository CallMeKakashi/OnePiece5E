// Turn-based expiry (#42) in a real combat: an effect with the special duration "turnStartSource" ends at the start of its source's next turn, not before.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  for (const x of game.actors.filter((y) => /^\[EXP\]/.test(y.name))) await x.delete();
  for (const c of game.combats.filter((y) => y.getFlag("op5e", "expTest"))) await c.delete();
  let src, tgt, combat;
  try {
    // the pack item that got the special duration from its rule text
    const pack = game.packs.get("op5e.class-features"), idx = await pack.getIndex();
    const e = idx.find((x) => x.name === "Slippery Devil"); const doc = e && await pack.getDocument(e._id);
    const fx = doc && [...doc.effects].find((x) => x.name === "Taunted");
    ok("the Taunted effect carries the special duration", fx?.flags?.dae?.specialDuration?.includes("turnStartSource"), JSON.stringify(fx?.flags?.dae?.specialDuration));

    src = await Actor.create({ name: "[EXP] Source", type: "character" }); tgt = await Actor.create({ name: "[EXP] Target", type: "npc" });
    combat = await Combat.create({ scene: null, active: false, flags: { op5e: { expTest: true } } });
    const [cs, ct] = await combat.createEmbeddedDocuments("Combatant", [{ actorId: src.id, initiative: 20 }, { actorId: tgt.id, initiative: 10 }]);
    await combat.startCombat(); await wait(500);
    ok("combat starts on the source", combat.combatant?.actorId === src.id);
    const [eff] = await tgt.createEmbeddedDocuments("ActiveEffect", [{ name: "[EXP] Taunted", origin: src.uuid, duration: { rounds: 1, startRound: combat.round, startTurn: combat.turn }, flags: { dae: { specialDuration: ["turnStartSource"] } }, changes: [] }]);
    await combat.nextTurn(); await wait(1200);
    ok("it is still there during the target's turn", !!tgt.effects.get(eff.id));
    await combat.nextTurn(); await wait(2500);   // back to the source: start of the source's next turn
    ok("it is gone at the start of the source's next turn", !tgt.effects.get(eff.id), `round ${combat.round} turn ${combat.turn}`);
  } catch (e) { ok("the test itself stopped", false, e.message); }
  await combat?.delete().catch(() => {}); await src?.delete().catch(() => {}); await tgt?.delete().catch(() => {});
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } }, { extraModules: ["dae", "times-up"] });
