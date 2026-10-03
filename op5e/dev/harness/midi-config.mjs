// Sets Midi-QOL's workflow options for automated testing in the TEST world only. Usage: node midi-config.mjs [on|off]
import { withFoundry } from "./drive.mjs";
const on = (process.argv[2] ?? "on") === "on";
const r = await withFoundry(async (page) => {
  await page.evaluate(async (on) => {
    const cs = foundry.utils.deepClone(game.settings.get("midi-qol", "ConfigSettings"));
    const patch = { autoRollAttack: true, autoRollDamage: "always", autoApplyDamage: "yes", autoCheckHit: "all", autoCheckSaves: "all", autoFastForward: "all", gmAutoAttack: true, gmAutoDamage: "always", allowActorUseMacro: true, allowUseMacro: true, waitForDamageApplication: true, autoCompleteWorkflow: true };
    if (on) { await game.settings.set("midi-qol", "ConfigSettings", { ...cs, ...patch, op5eBackup: Object.fromEntries(Object.keys(patch).map((k) => [k, cs[k]])) }); }
    else if (cs.op5eBackup) { const { op5eBackup, ...rest } = cs; await game.settings.set("midi-qol", "ConfigSettings", { ...rest, ...op5eBackup }); }
  }, on);
  await page.reload(); await page.waitForFunction(() => globalThis.game?.ready, null, { timeout: 120000 }); await page.waitForTimeout(6000);
  return page.evaluate(() => { const c = game.settings.get("midi-qol", "ConfigSettings"); return { autoRollAttack: c.autoRollAttack, autoRollDamage: c.autoRollDamage, autoApplyDamage: c.autoApplyDamage, live: MidiQOL.configSettings().autoRollAttack }; });
});
console.log(JSON.stringify(r));
