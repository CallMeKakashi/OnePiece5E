// Canvas shake and impact burst (#44): the shake animates the board, a big damage roll triggers it, a small one does not, and a player can switch it off.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const anims = () => document.getElementById("board")?.getAnimations().length ?? 0;
  try {
    ok("the API is registered", !!game.op5eFx?.bigHit && game.op5eFx.hitScale(100).strength === 40);
    ok("the settings exist", game.settings.get("op5e", "bigHitFx") === true && game.settings.get("op5e", "bigHitThreshold") === 25 && game.settings.get("op5e", "bigHitShake") === true);
    game.op5eFx.shakeLocal(20, 600); await wait(100);
    ok("shaking animates the board", anims() > 0, `${anims()} animation(s)`);
    await wait(900);
    Hooks.callAll("dnd5e.rollDamageV2", [{ total: 8, isCritical: false }]); await wait(150);
    ok("a small hit does not shake", anims() === 0);
    Hooks.callAll("dnd5e.rollDamageV2", [{ total: 40, isCritical: false }]); await wait(150);
    ok("a big hit shakes", anims() > 0);
    await wait(1200);
    await game.settings.set("op5e", "bigHitShake", false);
    game.op5eFx.shakeLocal(30, 500); await wait(150);
    ok("a player can switch the shake off", anims() === 0);
    await game.settings.set("op5e", "bigHitShake", true);
    const seq = !!game.modules.get("sequencer")?.active && Sequencer.Database.entryExists("jb2a.explosion.01.orange");
    if (seq) { let err = null; await game.op5eFx.bigHit({ total: 40, token: null }).catch((e) => { err = e; }); ok("the burst path runs without errors (no token: skipped)", !err, err?.message ?? ""); }
    else ok("Sequencer or the JB2A explosion is missing, burst skipped", true, "skipped");
  } catch (e) { ok("the test itself stopped", false, e.message); }
  await game.settings.set("op5e", "bigHitShake", true).catch(() => {});
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
