// Visual walk-through of the real UI as the Gamemaster user (test world only): the Create OPC wizard clicked step by step,
// then dnd5e's own advancement dialogs. Saves a screenshot at every step to reports/walkthrough/ and a log of what was on screen.
// Usage: node dev/harness/walkthrough.mjs [Class] [level]   (default Fighter 3)
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.FOUNDRY_URL ?? "http://localhost:30000";
const CLS = process.argv[2] ?? "Fighter", LEVEL = process.argv[3] ?? "3";
const OUT = "reports/walkthrough"; mkdirSync(OUT, { recursive: true });
const st = await (await fetch(`${BASE}/api/status`)).json();
if (st.world !== "test") throw new Error(`refusing: active world is "${st.world}", not "test"`);

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await (await browser.newContext({ viewport: { width: 1600, height: 1000 } })).newPage();
const errors = []; page.on("pageerror", (e) => errors.push(String(e).slice(0, 200))); page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 200)));
let n = 0; const log = [];
const shot = async (label) => { const f = `${OUT}/${String(++n).padStart(2, "0")}-${label.replace(/[^a-z0-9]+/gi, "-")}.png`; await page.screenshot({ path: f }); log.push(`${f}`); return f; };

await page.goto(`${BASE}/join`);
await page.selectOption("select[name=userid]", { label: process.env.WALK_USER ?? "Automation" }, { timeout: 15000 });   // "Gamemaster" is the owner's own session when they are logged in: do not take it over
await page.click("button[name=join]");
await page.waitForFunction(() => globalThis.game?.ready, null, { timeout: 120000 });
await page.waitForTimeout(3000);
// startup dialogs from other modules: read them (they are part of what a player sees), then dismiss like a user would
for (let i = 0; i < 6; i++) {
  const dlg = page.locator("dialog.application[open]").first();
  if (!(await dlg.count())) break;
  const text = (await dlg.innerText().catch(() => "")).replace(/\s+/g, " ").slice(0, 300);
  log.push(`startup dialog: ${text}`);
  await shot(`startup-dialog-${i + 1}`);
  const pref = dlg.locator("button:has-text('I understand'), button:has-text('OK'), button:has-text('Close'), button:has-text('Yes')").first();
  const btn = (await pref.count()) ? pref : dlg.locator("footer button, button").last();
  await btn.click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(600);
}
log.push(`world=${await page.evaluate(() => game.world.id)} user=${await page.evaluate(() => game.user.name)}`);
await page.evaluate(async () => { for (const a of game.actors.filter((x) => x.name === "Walkthrough Hero")) await a.delete(); });   // this script's own scratch character

// sidebar: Actors tab with the Create OPC button
// a real user clicks the Actors tab (the sidebar starts collapsed to a strip: the tab click expands it)
await page.locator("#sidebar-tabs [data-tab=actors]").click();
await page.waitForTimeout(800);
if (!(await page.locator(".op5e-cc-launch").first().isVisible())) { await page.locator("#sidebar-tabs [data-tab=actors]").click(); await page.waitForTimeout(800); }
await page.waitForSelector(".op5e-cc-launch", { state: "visible", timeout: 15000 });
await shot("actors-sidebar-create-opc-button");
const hasBtn = await page.locator(".op5e-cc-launch").count();
log.push(`Create OPC button present: ${hasBtn}`);

await page.locator(".op5e-cc-launch").first().click();
await page.waitForSelector("[data-action=next], [data-action=finish]", { timeout: 20000 });
await page.waitForTimeout(800);
const win = () => page.locator(".op5e-cc, [id*=OP5eCharacterCreator], .application:has([data-action=next])").first();
const next = async () => { await page.locator("[data-action=next]").first().click(); await page.waitForTimeout(700); };

// 1 name
// the wizard resumes an unfinished draft: use Reset & Restart (then confirm) to begin from step 1
if (await page.locator("[data-action=reset]").count()) {
  await page.locator("[data-action=reset]").first().click();
  await page.waitForTimeout(600);
  const clicked = await page.evaluate(() => { const b = [...document.querySelectorAll("button")].find((x) => x.textContent.trim() === "Yes" && x.offsetParent !== null); b?.click(); return !!b; });
  log.push(`reset confirmed: ${clicked}`);
  await page.waitForTimeout(1200);
}
await page.selectOption("select[name=actorKind]", "pc").catch(() => {});
await page.waitForTimeout(1200);
await shot("wizard-0-after-choosing-pc");
await page.fill("input[name=name]", "Walkthrough Hero");
await shot("wizard-1-name"); await next();
// 2 images
await shot("wizard-2-images"); await next();
// 3 species
const speciesLabel = process.env.SPECIES ?? "Human";
await page.locator(`label:has(input[name=speciesId]):has-text("${speciesLabel}")`).first().click().catch(async () => { await page.locator("label:has(input[name=speciesId])").first().click(); });
await shot("wizard-3-species"); await next();
// 4 background
const bgOpts = await page.locator("select[name=backgroundId] option").allTextContents();
await page.selectOption("select[name=backgroundId]", { index: Math.min(2, bgOpts.length - 1) });
await shot("wizard-4-background"); await next();
// 5 dream
const dreamBtn = page.locator("[data-action=useDream]").first();
if (await dreamBtn.count()) await dreamBtn.click(); else await page.fill("textarea[name=dream]", "To find the end of the sea");
await shot("wizard-5-dream"); await next();
// 6 class
await page.selectOption("select[name=classId]", { label: CLS });
await page.waitForTimeout(600);
await page.fill("input[name=level]", LEVEL).catch(async () => { await page.locator("input[type=number][name*=evel]").first().fill(LEVEL); });
await page.locator("input[type=number][name*=evel]").first().dispatchEvent("change");
await page.waitForTimeout(600);
const subSel = page.locator("select[name=subclassId]");
if (await subSel.count() && await subSel.isEnabled().catch(() => false)) await subSel.selectOption({ index: 1 });
const feat = page.locator("select[name=freeFeatId]");
if (await feat.count()) await feat.selectOption({ label: /Alert/ }).catch(async () => { await feat.selectOption({ index: 1 }); });
await shot("wizard-6-class-level-subclass-free-feat"); await next();
// 7 abilities
const useArray = page.locator("[data-action=useArray]").first();
if (await useArray.count()) await useArray.click();
await page.waitForTimeout(500);
await shot("wizard-7-abilities"); await next();
// 8 finish
await shot("wizard-8-finish-summary");
await page.locator("[data-action=finish]").first().click();
await page.waitForTimeout(4000);
await shot("after-finish-first-advancement-dialog");

// ---- stage 2: drive dnd5e's own advancement dialogs one step at a time like a player ----
const steps = [];
let stuck = 0, lastText = "";
for (let k = 0; k < 90; k++) {
  const mgr = page.locator(".application.advancement.manager, .advancement-manager, [class*='advancement'][class*='manager']").first();
  if (!(await mgr.count()) || !(await mgr.isVisible().catch(() => false))) { steps.push("advancement manager closed"); break; }
  const text = (await mgr.innerText().catch(() => "")).replace(/\s+/g, " ").trim();
  const head = text.slice(0, 160);
  if (text === lastText) stuck++; else stuck = 0; lastText = text;
  steps.push(head);
  await shot(`adv-${String(k + 1).padStart(2, "0")}-${head.replace(/[^a-z0-9]+/gi, "-").slice(0, 40)}`);
  if (stuck >= 3) { steps.push("STUCK: same step 3 times"); break; }
  // what the step wants (the dialog says "Chosen: 0 of 1", "Select 2 more ...", "Choose 2 from ...", "N Points Remaining")
  const ch = text.match(/Cho[a-z ]*?n:\s*(\d+)\s*of\s*(\d+)/i);
  const need = ch ? Number(ch[2]) - Number(ch[1]) : Number((text.match(/(?:Select|Choo\s?e|Choose)\s+(\d+)/i) ?? [])[1] ?? 0);
  const pts = Number((text.match(/(\d+)\s+Points?\s+Remaining/i) ?? [])[1] ?? 0);
  const isFruit = /Devil Fruit/i.test(head);
  if (pts > 0) { const plus = mgr.locator("button[data-action=increase], button:has-text('+')"); for (let p = 0, used = 0; p < (await plus.count()) && used < pts; p++) { const bt = plus.nth(p); if (await bt.isEnabled().catch(() => false)) { await bt.click().catch(() => {}); used++; } } }
  else if (need > 0) {
    const rows = mgr.locator("li, label, .item, [data-item-id], .choice");
    if (isFruit) { await mgr.locator("li:has-text('Paramecia'), label:has-text('Paramecia')").first().locator("dnd5e-checkbox, input[type=checkbox], input[type=radio]").first().click({ force: true }).catch(() => {}); }
    else { const boxes = mgr.locator("dnd5e-checkbox:not([checked]):not([disabled]), input[type=checkbox]:not(:checked):not(:disabled), input[type=radio]:not(:checked):not(:disabled)"); const n = await boxes.count(); for (let c = 0; c < Math.min(n, need); c++) await boxes.nth(c).click({ force: true }).catch(() => {}); }
  }
  const avg = mgr.getByText(/Take Average/i).or(mgr.locator("[data-action=takeAverage], [data-action=average]")).first();
  if (await avg.count()) { await avg.click().catch(() => {}); steps.push("  (took average hit points)"); }
  await page.waitForTimeout(500);
  if (need > 0) { const st = await mgr.locator("dnd5e-checkbox, input[type=checkbox], input[type=radio]").evaluateAll((els) => els.map((e) => `${e.tagName}:${e.checked ?? e.hasAttribute("checked")}`)).catch(() => []); steps.push(`  (ticks after clicking: ${st.join(" ")}) text now: ${(await mgr.innerText().catch(() => "")).replace(/\s+/g, " ").match(/Cho[a-z ]*?n:\s*\d+\s*of\s*\d+/i)?.[0] ?? "-"}`); await shot(`adv-${String(k + 1).padStart(2, "0")}-after-selecting`); }
  const go = mgr.locator("button[data-action=next], button[data-action=complete], button[data-action=finish]").first();
  if (!(await go.count())) { steps.push("no next/complete button"); break; }
  await go.click({ timeout: 8000 }).catch((e) => steps.push("click failed: " + String(e.message).slice(0, 80)));
  await page.waitForTimeout(900);
}
await page.waitForTimeout(1500);
await shot("final-character-sheet");
const result = await page.evaluate(() => {
  const a = game.actors.getName("Walkthrough Hero");
  return a && { name: a.name, level: a.system.details.level, classes: a.items.filter((i) => i.type === "class").map((i) => i.name + " " + i.system.levels), subclass: a.items.filter((i) => i.type === "subclass").map((i) => i.name), race: a.items.find((i) => i.type === "race")?.name, background: a.items.find((i) => i.type === "background")?.name, hp: a.system.attributes.hp.max, abilities: Object.fromEntries(Object.entries(a.system.abilities).map(([k, v]) => [k, v.value])), roleFeats: a.items.filter((i) => i.flags?.op5e?.shipRole).map((i) => i.name), fruitChoice: a.items.filter((i) => /devil fruit/i.test(i.name)).map((i) => i.name), feats: a.items.filter((i) => i.type === "feat" && i.system.type?.value === "feat").map((i) => i.name), itemCount: a.items.size, bio: String(a.system.details.biography.value).replace(/<[^>]+>/g, " ").replace(/s+/g, " ").slice(0, 200) };
});
writeFileSync(`${OUT}/walkthrough-result.json`, JSON.stringify({ log, steps, result, errors }, null, 2));
console.log(JSON.stringify({ steps, result, errors: errors.slice(0, 5) }, null, 1).slice(0, 5000));
await browser.close();
