// Visual walk-through, part 4: what a table uses in play (test world, Automation user):
//  - draw from a roll table out of the OP5e Roll Tables compendium
//  - open a reference journal page that contains a real table
//  - use a weapon from the character sheet and watch Midi-QOL's attack and damage chat cards
//  - use a class feature with an activity (Second Wind) and read its chat card
// Usage: node dev/harness/walkthrough4.mjs
import { writeFileSync } from "node:fs";
import { openTestWorld } from "./ui-lib.mjs";

const OUT = "reports/walkthrough4";
const { browser, page, shot, errors } = await openTestWorld({ out: OUT });
const report = { checks: [] };
const ok = (name, pass, detail = "") => { report.checks.push({ name, pass, detail }); console.log(`${pass ? "PASS" : "FAIL"} ${name} ${detail}`); };
const chat = (n = 6) => page.evaluate((n) => game.messages.contents.slice(-n).map((m) => ({ user: m.author?.name, alias: m.speaker?.alias, text: m.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 260), rolls: m.rolls.map((r) => `${r.formula}=${r.total}`) })), n);

// ---- 1. roll table from the compendium
const tableInfo = await page.evaluate(async () => {
  const pack = game.packs.get("op5e.roll-tables");
  const idx = await pack.getIndex();
  const e = idx.find((x) => /Weather|Lingering|Smile/i.test(x.name)) ?? idx.contents[0];
  const t = await pack.getDocument(e._id);
  t.sheet.render(true);
  return { name: t.name, count: idx.size, formula: t.formula, results: t.results.size };
});
await page.waitForTimeout(2000);
await shot("rolltable-open");
const rollBtn = page.locator(".application [data-action=drawResult]").first();   // the roll table window's "Draw Result" button
const before = await page.evaluate(() => game.messages.size);
if (await rollBtn.count()) await rollBtn.click({ force: true }).catch(() => {});
await page.waitForTimeout(2500);
await shot("rolltable-after-roll");
const after = await page.evaluate(() => game.messages.size);
ok(`roll table "${tableInfo.name}" (${tableInfo.count} tables in the pack, formula ${tableInfo.formula}, ${tableInfo.results} results)`, after > before, `chat messages ${before} -> ${after}`);
await page.evaluate(() => Object.values(ui.windows ?? {}).forEach((w) => w.close?.()));
for (const w of await page.locator(".application .header-control[data-action=close]").all()) await w.click({ force: true }).catch(() => {});

// ---- 2. reference journal page with a real table
const ref = await page.evaluate(async () => {
  const pack = game.packs.get("op5e.reference");
  const docs = await pack.getDocuments();
  let best = null;
  for (const d of docs) for (const p of d.pages) if (/<table/i.test(p.text?.content ?? "") && (!best || /weather/i.test(p.name))) best = { entry: d, page: p };
  if (!best) return { entries: docs.length, tablePage: null };
  best.entry.sheet.render(true, { pageId: best.page.id });
  return { entries: docs.length, pages: docs.reduce((n, d) => n + d.pages.size, 0), tablePage: `${best.entry.name} / ${best.page.name}`, tables: (best.page.text.content.match(/<table/gi) ?? []).length };
});
await page.waitForTimeout(2500);
await shot("reference-journal-table-page");
ok(`reference journal opens (${ref.entries} entries, ${ref.pages} pages) with a real table page`, !!ref.tablePage, JSON.stringify(ref).slice(0, 160));
for (const w of await page.locator(".application .header-control[data-action=close]").all()) await w.click({ force: true }).catch(() => {});

// ---- 3 + 4. use items from the sheet (Midi-QOL chat cards)
await page.evaluate(() => game.actors.getName("Walkthrough Hero").sheet.render(true));
await page.waitForSelector(".application.dnd5e2", { timeout: 20000 });
await page.waitForTimeout(1500);
const featTab = page.locator(".application.dnd5e2 nav [data-tab=features]").first();
if (await featTab.count()) await featTab.click();
await page.waitForTimeout(800);
await shot("sheet-features");
await page.evaluate(async () => { const it = game.actors.getName("Walkthrough Hero").items.getName("Second Wind"); await it.update({ "system.uses.spent": 0 }); });   // earlier runs used the daily uses up
const m0 = await page.evaluate(() => game.messages.size);
// Second Wind: click its use control like a player
const sw = page.locator(".application.dnd5e2 [data-item-id]:has-text('Second Wind') .item-name[data-action=use]").first();
if (await sw.count()) await sw.click().catch(() => {});
await page.waitForTimeout(1500);
await shot("second-wind-use-dialog");
await page.locator("button:has-text('Use Ability'), button:has-text('USE ABILITY')").first().click({ timeout: 6000 }).catch(() => {});   // dnd5e's consumption prompt
await page.waitForTimeout(3500);
await shot("second-wind-used");
const m1 = await page.evaluate(() => game.messages.size);
ok("Second Wind used from the sheet posts a chat card", m1 > m0, `messages ${m0} -> ${m1}`);
report.secondWindChat = await chat(3);

const invTab = page.locator(".application.dnd5e2 nav [data-tab=inventory]").first();
if (await invTab.count()) { await invTab.click(); await page.waitForTimeout(800); }
await shot("sheet-inventory");
const m2 = await page.evaluate(() => game.messages.size);
const axe = page.locator(".application.dnd5e2 [data-item-id]:has-text('Handaxe') .item-name[data-action=use]").first();
if (await axe.count()) await axe.click().catch(() => {});
await page.waitForTimeout(4000);
await shot("handaxe-attack-chat");
// a player opens the chat tab, uses the Handaxe, then presses ATTACK and DAMAGE on the card (Midi-QOL runs the rolls)
await page.locator("#sidebar-tabs [data-tab=chat]").click({ force: true }).catch(() => {});
await page.waitForTimeout(900);
const m4 = await page.evaluate(() => game.messages.size);
const settle = async () => { for (let i = 0; i < 3; i++) { const d = page.locator(".application button:has-text('Normal'):visible").last(); if (await d.count()) { await d.click({ force: true }).catch(() => {}); await page.waitForTimeout(2200); } } };
const card = () => page.locator(".chat-message").filter({ hasText: "Handaxe" }).last();
await page.locator(".application.dnd5e2 [data-item-id]:has-text('Handaxe') .item-name[data-action=use]").first().click().catch(() => {});
await page.waitForTimeout(3000); await settle();
await card().locator("button[data-action=rollAttack]").first().click({ force: true }).catch(() => {});
await page.waitForTimeout(3000); await settle();
await shot("handaxe-attack-rolled");
const afterAtk = await page.evaluate(() => game.messages.size);
// dnd5e/Midi may open a Damage Roll dialog (Critical Hit / Normal): answer it; if none appeared, press the card's Damage button
for (let i = 0; i < 4; i++) { await settle(); await page.waitForTimeout(800); }
let dmgSeen = await page.evaluate((from) => game.messages.contents.slice(from).some((m) => m.rolls.some((r) => /d6/.test(r.formula))), m4);
if (!dmgSeen) { await page.locator(".chat-message button[data-action=rollDamage]").last().click({ force: true }).catch(() => {}); await page.waitForTimeout(4000); for (let i = 0; i < 6; i++) { await settle(); await page.waitForTimeout(1200); } }
await shot("handaxe-damage-rolled");
const afterDmg = await page.evaluate(() => game.messages.size);
const rollsMsgs = await page.evaluate((from) => game.messages.contents.slice(from).map((m) => ({ text: m.content.replace(/<[^>]+>/g, " ").replace(/s+/g, " ").trim().slice(0, 100), rolls: m.rolls.map((r) => r.formula + " = " + r.total + (r.isCritical ? " CRIT" : "")) })), m4);
ok("Handaxe ATTACK button on the chat card rolls a d20", afterAtk > m4 && rollsMsgs.some((m) => m.rolls.some((r) => /d20/.test(r))), JSON.stringify(rollsMsgs).slice(0, 300));
ok("Handaxe damage rolls on the same chat card (1d6 + Strength)", rollsMsgs.some((m) => m.rolls.some((r) => /d6/.test(r))), JSON.stringify(rollsMsgs.map((m) => m.rolls)).slice(0, 200));
report.handaxeRolls = rollsMsgs;
report.errors = errors.slice(0, 8);
writeFileSync(`${OUT}/walkthrough4-result.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ secondWind: report.secondWindChat, handaxe: report.handaxeChat, errors: report.errors }, null, 1).slice(0, 3500));
await browser.close();
