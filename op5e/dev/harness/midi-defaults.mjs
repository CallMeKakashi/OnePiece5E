// Puts Midi-QOL back to its default settings in the TEST world, with one change: critical damage = max base damage + roll the crit dice once.
import { withFoundry } from "./drive.mjs";
const r = await withFoundry(async (page) => {
  await page.evaluate(async () => {
    const doc = game.settings.storage.get("world").getSetting("midi-qol.ConfigSettings");
    if (doc) await doc.delete();               // default config is rebuilt on next load
  });
  await page.reload(); await page.waitForFunction(() => globalThis.game?.ready, null, { timeout: 180000 }); await page.waitForTimeout(6000);
  await page.evaluate(async () => {
    const cs = foundry.utils.deepClone(game.settings.get("midi-qol", "ConfigSettings"));
    cs.criticalDamage = "maxBaseRollCrit"; cs.criticalDamageGM = "maxBaseRollCrit";
    await game.settings.set("midi-qol", "ConfigSettings", cs);
  });
  await page.reload(); await page.waitForFunction(() => globalThis.game?.ready, null, { timeout: 180000 }); await page.waitForTimeout(6000);
  return page.evaluate(() => { const c = MidiQOL.configSettings(); return { criticalDamage: c.criticalDamage, criticalDamageGM: c.criticalDamageGM, autoRollAttack: c.autoRollAttack, autoRollDamage: c.autoRollDamage, autoApplyDamage: c.autoApplyDamage, autoFastForward: c.autoFastForward, autoCheckHit: c.autoCheckHit, autoCheckSaves: c.autoCheckSaves }; });
});
console.log(JSON.stringify(r));
