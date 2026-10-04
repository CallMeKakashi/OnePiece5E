// Visual walk-through, part 6: a gallery of the new content as a player/GM sees it (test world, Automation user).
// Imports a ship and a monster into the world, opens their sheets, uses a cannon, and opens item sheets for a devil fruit template,
// a ship room, a special weapon and a Boon. Saves a screenshot of each and reports any broken image on the opened sheets.
// Usage: node dev/harness/walkthrough6.mjs
import { writeFileSync } from "node:fs";
import { openTestWorld } from "./ui-lib.mjs";

const OUT = "reports/walkthrough6";
const { browser, page, shot, errors } = await openTestWorld({ out: OUT });
const report = { checks: [], broken: [] };
const ok = (name, pass, detail = "") => { report.checks.push({ name, pass, detail }); console.log(`${pass ? "PASS" : "FAIL"} ${name} ${detail}`); };

// broken images on whatever is open: an <img> that finished loading with zero width
const brokenImages = () => page.evaluate(() => [...document.querySelectorAll(".application img")].filter((i) => i.complete && i.naturalWidth === 0 && i.src && !/data:/.test(i.src)).map((i) => i.getAttribute("src")).slice(0, 10));
const closeAll = async () => { for (const w of await page.locator(".application .header-control[data-action=close]").all()) await w.click({ force: true }).catch(() => {}); await page.waitForTimeout(400); };
const openDoc = async (pack, name, label) => {
  const info = await page.evaluate(async ({ pack, name }) => {
    const p = game.packs.get(`op5e.${pack}`); const idx = await p.getIndex(); const e = idx.find((x) => x.name === name); if (!e) return null;
    const d = await p.getDocument(e._id); d.sheet.render(true); return { type: d.type, img: d.img };
  }, { pack, name });
  await page.waitForTimeout(2200);
  await shot(label);
  const bad = await brokenImages();
  if (bad.length) report.broken.push({ label, bad });
  ok(`${label}: opens with working images`, !!info && bad.length === 0, info ? `${info.type} img=${info.img}${bad.length ? " BROKEN: " + bad.join(",") : ""}` : "not found");
  await closeAll();
};

// ---- ship + cannon
const ship = await page.evaluate(async () => {
  for (const a of game.actors.filter((x) => x.name === "Walkthrough Galleon")) await a.delete();
  const p = game.packs.get("op5e.ships"); const idx = await p.getIndex(); const e = idx.find((x) => /Galleon/.test(x.name)) ?? idx.contents[0];
  const d = (await p.getDocument(e._id)).toObject(); d.name = "Walkthrough Galleon"; delete d._id;
  const a = await Actor.create(d); a.sheet.render(true);
  return { name: a.name, type: a.type, hp: a.system.attributes.hp.max, items: a.items.map((i) => i.name).slice(0, 12), img: a.img };
});
await page.waitForTimeout(2500);
await shot("ship-sheet");
const badShip = await brokenImages(); if (badShip.length) report.broken.push({ label: "ship-sheet", bad: badShip });
ok("ship sheet opens", !!ship.name, JSON.stringify({ ...ship, items: ship.items.length }));
report.ship = ship;
// add a cannon from the ship-weapons pack and fire it from the sheet like a crew member
await closeAll();
const cannon = await page.evaluate(async () => {
  const a = game.actors.getName("Walkthrough Galleon"); const p = game.packs.get("op5e.ship-weapons"); const idx = await p.getIndex();
  const e = idx.find((x) => /12-pounder/.test(x.name)) ?? idx.contents[0]; const d = await p.getDocument(e._id);
  const [it] = await a.createEmbeddedDocuments("Item", [d.toObject()]); a.sheet.render(true);
  return { name: it.name, activities: [...it.system.activities].map((x) => `${x.type}:${x.name}`) };
});
await page.waitForTimeout(2000);
await page.locator("#sidebar-tabs [data-tab=chat]").click({ force: true }).catch(() => {});
const m0 = await page.evaluate(() => game.messages.size);
await page.getByText("Features", { exact: true }).first().click({ force: true }).catch(() => {});
await page.waitForTimeout(900);
await shot("ship-features-tab");
const use = page.locator(".application [data-item-id]:has-text('12-pounder') .item-name, .application [data-item-id]:has-text('pounder') .item-name").first();
const img = page.locator(".application [data-item-id]:has-text('pounder') .item-image, .application [data-item-id]:has-text('pounder') img").first();
if (await img.count()) await img.click({ force: true }).catch(() => {}); else if (await use.count()) await use.click().catch(() => {});
await page.waitForTimeout(2500);
for (let i = 0; i < 3; i++) { const b = page.locator("button:has-text('Use Ability'), button:has-text('Normal')").first(); if (await b.count()) { await b.click({ force: true }).catch(() => {}); await page.waitForTimeout(2000); } }
await shot("ship-cannon-used");
const m1 = await page.evaluate(() => game.messages.size);
ok(`cannon (${cannon.name}: ${cannon.activities.join(", ")}) used from the ship sheet posts a card`, m1 > m0, `messages ${m0} -> ${m1}`);
await closeAll();

// ---- monster, devil fruit template, ship room, special weapon, boon, creation
const monsterOk = await page.evaluate(async () => { const p = game.packs.get("op5e.monsters"); const idx = await p.getIndex(); const e = idx.find((x) => /Great Bat/.test(x.name)) ?? idx.contents[0]; (await p.getDocument(e._id)).sheet.render(true); return e.name; });
await page.waitForTimeout(2300); await shot("monster-" + monsterOk); const bm = await brokenImages(); ok(`monster ${monsterOk} sheet opens`, bm.length === 0, bm.join(",")); await closeAll();
await openDoc("devil-fruits", "Paramecia Devil Fruit (Template)", "devil-fruit-paramecia-template");
await openDoc("devil-fruits", "Mera Mera no Mi", "devil-fruit-mera");
await openDoc("items", "Sick Bay", "ship-room-sick-bay");
await openDoc("items", "Black Blade", "black-blade");
await openDoc("items", "Defiance of the Red World (Wakened)", "defiance-wakened");
await openDoc("feats", "Haki Learning and Affinity", "haki-learning-feat");
await openDoc("creations", "Wall of Ice", "wall-of-ice");

report.errors = errors.slice(0, 8);
writeFileSync(`${OUT}/walkthrough6-result.json`, JSON.stringify(report, null, 2));
console.log("broken images:", JSON.stringify(report.broken), "errors:", JSON.stringify(report.errors));
await browser.close();
