// Reads core.moduleConfiguration from the test/bb-rehearsal world (read-only) and writes a Foundry script macro that applies it to another world.
// Usage: node dev/harness/export-module-config.mjs [out.js]
import { writeFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
const out = process.argv[2] ?? "../Foundry/actors-json/apply-module-config-macro.js";
await withFoundry(async (page) => {
  const { world, cfg } = await page.evaluate(() => ({ world: game.world.id, cfg: game.settings.get("core", "moduleConfiguration") }));
  const on = Object.keys(cfg).filter((k) => cfg[k]).sort();
  writeFileSync(out, `// Foundry SCRIPT MACRO: sets this world's module configuration to match "${world}" (${on.length} enabled). Run as GM, then reload.
// Modules not installed here are listed and skipped; nothing is installed or removed.
(async () => {
  if (!game.user.isGM) return ui.notifications.error("GM only");
  const want = ${JSON.stringify(cfg, null, 1)};
  const missing = Object.keys(want).filter((k) => want[k] && !game.modules.has(k));
  const cfg = Object.fromEntries(Object.entries(want).filter(([k]) => game.modules.has(k)));
  const ok = await foundry.applications.api.DialogV2.confirm({ window: { title: "Apply module configuration" }, content: \`<p>Enables \${Object.values(cfg).filter(Boolean).length} modules in <b>\${game.world.id}</b> (copied from ${world}).</p>\${missing.length ? \`<p>Not installed, skipped: \${missing.join(", ")}</p>\` : ""}<p>The page reloads afterwards.</p>\` });
  if (!ok) return;
  await game.settings.set("core", "moduleConfiguration", cfg);
  foundry.utils.debounce(() => location.reload(), 500)();
})();
`, "utf8");
  console.log(`Wrote ${out} (${on.length} enabled of ${Object.keys(cfg).length} configured)`);
});
