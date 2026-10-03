import { withFoundry } from "./drive.mjs";
import { BUILT, pageLib } from "./advance-lib.mjs";
const r = await withFoundry(async (page, { logs }) => { console.log("canvas.ready", await page.evaluate(() => [canvas?.ready, !!canvas?.scene, canvas?.app?.renderer?.type])); await page.evaluate(`(${pageLib.toString()})(${JSON.stringify(BUILT)})`);
  const out = await page.evaluate(async () => {
    const cs = foundry.utils.deepClone(game.settings.get("midi-qol", "ConfigSettings")); Object.assign(cs, { autoRollAttack: true, autoRollDamage: "always", autoApplyDamage: "yes", autoCheckHit: "all", autoCheckSaves: "all", autoFastForward: "all", gmAutoAttack: true, gmAutoDamage: "always", autoTarget: "none" }); await game.settings.set("midi-qol", "ConfigSettings", cs);
    const H = game.op5eHarness, src = __op5eBuilt("items").find((i) => i.name === "Warhammer");
    const a = await H.createActor({ name: "A", abilities: { str: 16 }, hp: 50 }), t = await H.createActor({ name: "T", hp: 100 });
    const tok = await H.createToken(t); H.targetToken(tok); await H.createToken(a, { x: 1200, y: 1000 });
    const it = await H.giveItem(a, src.toObject()); await H.equipItem(it);
    const before = game.messages.size, hp0 = H.getHP(t).value; H.clearConsoleErrors();
    let err; const notes = []; for (const k of ["warn", "error", "info"]) { const o = ui.notifications[k].bind(ui.notifications); ui.notifications[k] = (m, ...r) => { notes.push(k + ": " + m); return o(m, ...r); }; }
    let wfInfo; try { const act = H.findActivity(it, "attack"); const wf = await MidiQOL.completeActivityUse(act, { midiOptions: { autoRollAttack: true, autoRollDamage: "always", autoFastForward: "all" } }, { configure: false }, { create: true }); wfInfo = { attack: wf?.attackRoll?.total, damage: wf?.damageRoll?.total ?? wf?.damageRolls?.map((r) => r.total), hit: wf?.hitTargets?.size, state: wf?.currentAction ?? wf?.currentState, keys: wf ? Object.keys(wf).slice(0, 8) : null }; } catch (e) { err = e.message + " | " + (e.stack || "").slice(0, 300); }
    await new Promise((r) => setTimeout(r, 4000));
    const msgs = game.messages.contents.slice(before).map((m) => ({ flavor: m.flavor?.slice(0, 40), rolls: m.rolls.map((x) => x.constructor.name + ":" + x.formula + "=" + x.total), flags: Object.keys(m.flags ?? {}) }));
    return { err, notes, wfInfo, hp: [hp0, H.getHP(t).value], msgs, targets: game.user.targets.size, midi: !!globalThis.MidiQOL, errs: H.getConsoleErrors().slice(0, 3).map((e) => e.slice(0, 200)) };
  });
  return { out, logs: logs.filter((l) => /midi/i.test(l)).slice(0, 3) }; }, { headless: process.env.HEADED ? false : true });
console.log(JSON.stringify(r, null, 1));
