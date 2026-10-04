// Visual walk-through, part 3: level the walk-through character from 8 to 12 with the sheet's own level selector.
//  - level 10: the Haki step must offer Armament Apprentice (chain prerequisite satisfied) and not other branches' Apprentice tiers
//  - level 12: at the Ability Score Improvement step, try to take a feat the character does not qualify for through the real
//    compendium picker (default Cannon Master, which needs cannon proficiency) and watch for the refusal.
// Usage: node dev/harness/walkthrough3.mjs [feat name]
import { writeFileSync } from "node:fs";
import { openTestWorld, driveAdvancement } from "./ui-lib.mjs";

const FEAT = process.argv[2] ?? "Cannon Master";
const OUT = "reports/walkthrough3";
const { browser, page, shot, errors } = await openTestWorld({ out: OUT });
const report = { levels: [], notes: [] };
const level = () => page.evaluate(() => game.actors.getName("Walkthrough Hero").system.details.level);

await page.evaluate(() => game.actors.getName("Walkthrough Hero").sheet.render(true));
await page.waitForSelector(".application.dnd5e2", { timeout: 20000 });
await page.waitForTimeout(1200);
if (!(await page.locator("slide-toggle.mode-slider").first().evaluate((e) => e.checked))) await page.locator("slide-toggle.mode-slider").first().click();   // the mode persists between runs
await page.waitForTimeout(900);

const tab = page.locator(".application.dnd5e2 nav [data-tab=features], .application.sheet nav [data-tab=features]").first();
if (await tab.count()) { await tab.click(); await page.waitForTimeout(800); }
let cur = await level();
const GOAL = Number(process.env.GOAL ?? 14);
while (cur < GOAL) {
  await page.locator(".level-selector:visible").first().selectOption("1");
  await page.waitForTimeout(1500);
  const to = cur + 1;
  const steps = [];
  for (let guard = 0; guard < 30; guard++) {
    const mgr = page.locator(".application.advancement.manager").first();
    if (!(await mgr.count()) || !(await mgr.isVisible().catch(() => false))) break;
    const text = (await mgr.innerText().catch(() => "")).replace(/\s+/g, " ");
    if (to === GOAL && /Ability Score Improvement/i.test(text) && /SELECT FEAT/i.test(text) && !report.asiTried) {
      report.asiTried = true;
      steps.push("ASI step reached");
      await shot("ASI-asi-step");
      await mgr.locator("dnd5e-checkbox").first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(500);
      // a player drags a feat from the compendium onto the step: dnd5e validates it with the same call the picker uses
      const outcome = await page.evaluate(async (featName) => {
        const idx = await game.packs.get("op5e.feats").getIndex();
        const entry = idx.find((e) => e.name === featName);
        if (!entry) return { error: "feat not found: " + featName };
        const target = [...document.querySelectorAll(".application.advancement.manager form, .application.advancement.manager .flow, .application.advancement.manager")].pop();
        const dt = new DataTransfer();
        dt.setData("text/plain", JSON.stringify({ type: "Item", uuid: entry.uuid }));
        for (const type of ["dragenter", "dragover", "drop"]) target.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: dt }));
        await new Promise((r) => setTimeout(r, 1500));
        return { uuid: entry.uuid, requirements: (await fromUuid(entry.uuid))?.system?.requirements };
      }, FEAT);
      steps.push(`dropped ${FEAT}: ${JSON.stringify(outcome)}`);
      await page.waitForTimeout(800);
      const notes = await page.evaluate(() => [...document.querySelectorAll("#notifications li, .notification, ol.notifications li")].map((e) => e.innerText.replace(/s+/g, " ").slice(0, 260)));
      steps.push(`notifications: ${JSON.stringify(notes)}`);
      await shot("ASI-after-dropping-unqualified-feat");
      report.asiNotifications = notes;
      await page.keyboard.press("Escape").catch(() => {});
      await page.waitForTimeout(500);
    }
    const driven = await driveAdvancement(page, shot, { maxSteps: 1, tag: `L${to}`, pick: () => null });
    steps.push(...driven.slice(0, 3).map((s) => s.slice(0, 120)));
  }
  report.levels.push({ to, steps });
  await page.waitForTimeout(1200);
  const now = await level();
  if (now === cur) { report.notes.push(`level stayed at ${cur}`); break; }
  cur = now;
}
await shot("sheet-at-level-12");
report.result = await page.evaluate(() => {
  const a = game.actors.getName("Walkthrough Hero");
  return { level: a.system.details.level, hp: a.system.attributes.hp.max, haki: a.items.filter((i) => /^(color of (armament|observation)|conqueror's haki) /i.test(i.name)).map((i) => i.name), tookUnqualifiedFeat: a.items.some((i) => i.name === "Cannon Master"), feats: a.items.filter((i) => i.type === "feat" && i.system.type?.value === "feat").map((i) => i.name) };
});
report.errors = errors.slice(0, 8);
writeFileSync(`${OUT}/walkthrough3-result.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1).slice(0, 6000));
await browser.close();
