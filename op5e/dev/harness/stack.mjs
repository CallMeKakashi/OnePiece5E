// Turns the optional automation modules on/off in the TEST world. Usage: node stack.mjs on|off
import { withFoundry } from "./drive.mjs";
const on = process.argv[2] === "on";
const r = await withFoundry(async (page) => {
  await page.evaluate(async (on) => {
    const cfg = foundry.utils.deepClone(game.settings.get("core", "moduleConfiguration"));
    for (const id of ["chris-premades", "midi-qol"]) if (game.modules.get(id)) cfg[id] = on;
    await game.settings.set("core", "moduleConfiguration", cfg);
  }, on);
  await page.reload(); await page.waitForFunction(() => globalThis.game?.ready, null, { timeout: 180000 }); await page.waitForTimeout(5000);
  return page.evaluate(() => ({ midi: !!game.modules.get("midi-qol")?.active, cpr: !!game.modules.get("chris-premades")?.active, op5e: !!game.modules.get("op5e")?.active }));
});
console.log(JSON.stringify(r));
