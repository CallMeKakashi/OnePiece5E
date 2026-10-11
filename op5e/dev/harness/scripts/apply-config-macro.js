// Foundry SCRIPT MACRO: applies an op5e config bundle (dev/harness/export-config-bundle.mjs) to the CURRENT world: enabled modules, then their world settings.
// Run as GM in blood-and-brine. Step 1 enables the modules and asks you to reload; run the macro again after the reload to apply the settings.
// Overwrites the listed settings only; modules that are not installed and settings that are not registered are skipped and reported.
(async () => {
  if (!game.user.isGM) return ui.notifications.error("GM only");
  const file = await new Promise((res) => { const i = Object.assign(document.createElement("input"), { type: "file", accept: ".json" }); i.onchange = () => res(i.files[0]); i.click(); });
  if (!file) return;
  const b = JSON.parse(await file.text());
  if (b.version !== 1) return ui.notifications.error("Not an op5e config bundle");
  const wantOn = Object.keys(b.moduleConfiguration).filter((k) => b.moduleConfiguration[k] && game.modules.has(k));
  const missing = Object.keys(b.moduleConfiguration).filter((k) => b.moduleConfiguration[k] && !game.modules.has(k));
  const pending = wantOn.filter((k) => !game.modules.get(k).active);
  if (pending.length) {
    const ok = await foundry.applications.api.DialogV2.confirm({ window: { title: "Step 1: enable modules" }, content: `<p>Enables ${pending.length} modules in <b>${game.world.id}</b> (from ${b.source}), then reloads.</p>${missing.length ? `<p>Not installed, skipped: ${missing.join(", ")}</p>` : ""}<p>Run this macro again after the reload to apply the settings.</p>` });
    if (!ok) return;
    await game.settings.set("core", "moduleConfiguration", Object.fromEntries(Object.entries(b.moduleConfiguration).filter(([k]) => game.modules.has(k))));
    return foundry.utils.debounce(() => location.reload(), 500)();
  }
  const ok = await foundry.applications.api.DialogV2.confirm({ window: { title: "Step 2: apply settings" }, content: `<p>Overwrites ${b.settings.length} module settings in <b>${game.world.id}</b> with the values from ${b.source}.</p>` });
  if (!ok) return;
  const log = { set: 0, skipped: [], failed: [] };
  for (const { ns, key, value } of b.settings) {
    if (!game.settings.settings.has(`${ns}.${key}`)) { log.skipped.push(`${ns}.${key}`); continue; }
    try { await game.settings.set(ns, key, value); log.set++; } catch (e) { log.failed.push(`${ns}.${key}: ${e.message}`); }
  }
  console.log("op5e config import", log);
  ui.notifications.info(`Set ${log.set}, skipped ${log.skipped.length}, failed ${log.failed.length} (details in console). Reload the page.`);
})();
