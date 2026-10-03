// Enables the full automation stack in the test world and reports what actually loaded.
import { withFoundry } from "./drive.mjs";
const STACK = ["lib-wrapper", "socketlib", "times-up", "dae", "midi-qol", "chris-premades", "op5e"];
const r = await withFoundry(async (page) => {
  await page.evaluate(async (stack) => {
    const cfg = foundry.utils.deepClone(game.settings.get("core", "moduleConfiguration"));
    for (const id of stack) if (game.modules.get(id)) cfg[id] = true;
    await game.settings.set("core", "moduleConfiguration", cfg);
  }, STACK);
  await page.reload(); await page.waitForTimeout(2000);
  if (await page.locator("select[name=userid]").count()) { await page.selectOption("select[name=userid]", { label: "Automation" }); await page.click("button[name=join]"); }
  await page.waitForFunction(() => globalThis.game?.ready, null, { timeout: 180000 });
  await page.waitForTimeout(8000);
  return page.evaluate((stack) => ({
    system: game.system.version,
    modules: Object.fromEntries(stack.map((id) => [id, game.modules.get(id) ? `${game.modules.get(id).version} ${game.modules.get(id).active ? "ACTIVE" : "inactive"}` : "not installed"])),
    midi: !!game.modules.get("midi-qol")?.active && typeof globalThis.MidiQOL !== "undefined",
    cpr: !!globalThis.chrisPremades,
    packs: game.packs.filter((p) => p.collection.startsWith("op5e.")).map((p) => `${p.metadata.name}:${p.index.size}`),
    toolIds: ["dial", "appraiser", "fishing"].map((k) => [k, !!CONFIG.DND5E.tools[k]]),
    errors: (window.__errs ?? []).slice(0, 5),
  }), STACK);
});
console.log(JSON.stringify(r, null, 1));
