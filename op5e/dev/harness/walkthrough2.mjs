// Visual walk-through, part 2: open the character the first walk-through built, look at its sheet, then level it up with
// Foundry's own level selector (the same control a player uses) from 3 to a target level, clicking through every advancement dialog.
// Usage: node dev/harness/walkthrough2.mjs [targetLevel]   (default 8: Haki at 8, an ASI/feat step at 4)
import { writeFileSync } from "node:fs";
import { openTestWorld, driveAdvancement } from "./ui-lib.mjs";

const TARGET = Number(process.argv[2] ?? 8);
const OUT = "reports/walkthrough2";
const { browser, page, shot, errors } = await openTestWorld({ out: OUT });
const report = { steps: [], levels: [] };

await page.locator("#sidebar-tabs [data-tab=actors]").click();
await page.waitForTimeout(800);
// open the character from the sidebar like a user
await page.locator("#actors .directory-item:has-text('Walkthrough Hero') .entry-name, #actors .directory-item:has-text('Walkthrough Hero') a").first().click();
await page.waitForSelector(".application.sheet.actor, .application.dnd5e2", { timeout: 20000 });
await page.waitForTimeout(1500);
await shot("sheet-open");

// the sheet starts in play mode: flip the Edit-mode slider (what a player does to level up) so the class level becomes a dropdown
if (!(await page.locator("slide-toggle.mode-slider").first().evaluate((e) => e.checked))) await page.locator("slide-toggle.mode-slider").first().click();   // the mode persists between runs
await page.waitForTimeout(1000);
// features tab: Role, Devil Fruit template, class features
const tab = page.locator(".application.dnd5e2 nav [data-tab=features], .application.sheet nav [data-tab=features]").first();
if (await tab.count()) { await tab.click(); await page.waitForTimeout(800); await shot("sheet-features-tab"); }
report.features = await page.evaluate(() => game.actors.getName("Walkthrough Hero").items.filter((i) => i.type === "feat").map((i) => i.name));

let cur = await page.evaluate(() => game.actors.getName("Walkthrough Hero").system.details.level);
while (cur < TARGET) {
  const sel = page.locator(".level-selector").first();
  if (!(await sel.count())) { report.steps.push("no .level-selector on the sheet (is the Details/Features tab open?)"); break; }
  const opts = await sel.locator("option").evaluateAll((os) => os.map((o) => `${o.value}:${o.textContent.trim()}`));
  report.steps.push(`level selector options at level ${cur}: ${opts.join(" | ")}`);
  await shot(`levelup-from-${cur}-selector`);
  await sel.selectOption("1");   // +1 level, exactly what a player does
  await page.waitForTimeout(1500);
  const steps = await driveAdvancement(page, shot, {
    tag: `L${cur + 1}`,
    pick: (head) => (/Haki/i.test(head) ? null : null),
  });
  report.levels.push({ to: cur + 1, steps });
  await page.waitForTimeout(1200);
  const now = await page.evaluate(() => game.actors.getName("Walkthrough Hero").system.details.level);
  if (now === cur) { report.steps.push(`level stayed at ${cur}: the level-up did not complete`); break; }
  cur = now;
}
await shot("sheet-after-levelup");
report.result = await page.evaluate(() => {
  const a = game.actors.getName("Walkthrough Hero");
  return { level: a.system.details.level, hp: a.system.attributes.hp.max, prof: a.system.attributes.prof, abilities: Object.fromEntries(Object.entries(a.system.abilities).map(([k, v]) => [k, v.value])), haki: a.items.filter((i) => /^(color of (armament|observation)|conqueror's haki) /i.test(i.name)).map((i) => i.name), feats: a.items.filter((i) => i.type === "feat").map((i) => i.name) };
});
report.errors = errors.slice(0, 8);
writeFileSync(`${OUT}/walkthrough2-result.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ steps: report.steps, levels: report.levels.map((l) => ({ to: l.to, steps: l.steps.map((s) => s.slice(0, 90)) })), result: report.result, errors: report.errors }, null, 1).slice(0, 7000));
await browser.close();
