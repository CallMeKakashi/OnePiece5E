// Visual walk-through, part 5: a caster uses a summon creation on a real scene.
// Setup (script): a Medic from the wizard API, the Animate Dead creation on the sheet, a scene with the Medic's token.
// Then as a player: open the sheet, use Animate Dead, answer the dialogs (cast level, which undead), place the summon on the canvas.
// Usage: node dev/harness/walkthrough5.mjs
import { writeFileSync } from "node:fs";
import { openTestWorld } from "./ui-lib.mjs";

const OUT = "reports/walkthrough5";
const { browser, page, shot, errors } = await openTestWorld({ out: OUT });
const report = { checks: [], steps: [] };
const ok = (name, pass, detail = "") => { report.checks.push({ name, pass, detail }); console.log(`${pass ? "PASS" : "FAIL"} ${name} ${detail}`); };

// ---- setup
const setup = await page.evaluate(async () => {
  for (const a of game.actors.filter((x) => x.name === "Walkthrough Medic")) await a.delete();
  for (const s of game.scenes.filter((x) => x.name === "Walkthrough Scene")) await s.delete();
  const API = game.op5eCharacterCreator;
  const idx = async (p, f = ["type"]) => (await game.packs.get(`op5e.${p}`).getIndex({ fields: f }));
  const cls = (await idx("classes")).find((e) => e.name === "Medic");
  const species = (await idx("races")).find((e) => e.type === "race"), bg = (await idx("backgrounds")).find((e) => e.type === "background");
  const sub = (await idx("subclasses", ["system.classIdentifier"])).find((e) => e.system?.classIdentifier === "medic");
  const draft = { actorKind: "pc", data: { name: "Walkthrough Medic", speciesId: species._id, backgroundId: bg._id, classId: cls._id, level: 5, subclassId: sub._id, abilities: { str: 8, dex: 14, con: 14, int: 10, wis: 15, cha: 12 }, abilityMethod: "array", hpMode: "avg", dream: "To heal the sea" } };
  const notes = [];
  const actor = await API.createFromDraft(draft, { auto: true, notes, noSheet: true });
  const ad = await game.packs.get("op5e.creations").getDocuments();
  const doc = ad.find((d) => d.name === "Animate Dead");
  const [item] = await actor.createEmbeddedDocuments("Item", [doc.toObject()]);
  const scene = await Scene.create({ name: "Walkthrough Scene", width: 2400, height: 1600, grid: { size: 100 }, padding: 0, background: { src: null }, tokenVision: false, fog: { exploration: false } });
  const td = await actor.getTokenDocument({ x: 600, y: 600 });
  await scene.createEmbeddedDocuments("Token", [td.toObject()]);
  await scene.activate();
  return { actor: actor.name, level: actor.system.details.level, item: item.name, itemLevel: item.system.level, activities: [...item.system.activities].map((a) => `${a.type}:${a.name}`), tokens: scene.tokens.size, notes };
});
report.setup = setup;
console.log("setup:", JSON.stringify(setup));
await page.waitForFunction(() => canvas?.ready && canvas.scene?.name === "Walkthrough Scene", null, { timeout: 60000 }).catch(() => {});
await page.waitForTimeout(2500);
await shot("scene-with-medic-token");

// ---- open the sheet and cast
await page.evaluate(() => game.actors.getName("Walkthrough Medic").sheet.render(true));
await page.waitForSelector(".application.dnd5e2", { timeout: 20000 });
await page.waitForTimeout(1500);
const spellsTab = page.locator(".application.dnd5e2 nav [data-tab=spells]").first();
if (await spellsTab.count()) { await spellsTab.click(); await page.waitForTimeout(900); }
await shot("sheet-spells-tab");
const tokensBefore = await page.evaluate(() => canvas.scene.tokens.size);
const actorsBefore = await page.evaluate(() => game.actors.size);
await page.locator(".application.dnd5e2 [data-item-id]:has-text('Animate Dead') .item-name[data-action=use]").first().click().catch((e) => report.steps.push("use click failed: " + e.message.slice(0, 80)));
await page.waitForTimeout(2000);

// the cast dialog: level, consume a slot, place summons, profile (Hulking by default): press Cast Spell
await shot("cast-dialog");
await page.locator("button:has-text('Cast Spell')").first().click({ force: true }).catch((e) => report.steps.push("cast click failed: " + e.message.slice(0, 80)));
await page.waitForTimeout(2500);
await shot("after-cast-placement-state");
// casting posts a chat card with a SUMMON button: pressing it starts the placement (the profile was chosen in the cast dialog)
await page.locator("#sidebar-tabs [data-tab=chat]").click({ force: true }).catch(() => {});
await page.waitForTimeout(800);
const sumBtn = page.locator(".chat-message button:has-text('Summon')").last();
report.steps.push("Summon button on the chat card: " + (await sumBtn.count()));
await sumBtn.click({ force: true }).catch((e) => report.steps.push("summon click failed: " + e.message.slice(0, 80)));
await page.waitForTimeout(2500);
await shot("after-summon-button");
// the profile prompt: pick the Skeletal undead, then SUMMON
const prof = page.locator(".application select").filter({ has: page.locator("option:has-text('Skeletal')") }).first();
if (await prof.count()) await prof.selectOption({ label: "Skeletal Animated Undead" }).catch(() => {});
await page.locator(".application button:has-text('Summon')").last().click({ force: true }).catch((e) => report.steps.push("profile summon click failed: " + e.message.slice(0, 80)));
await page.waitForTimeout(2500);
await shot("after-profile-chosen");
report.steps.push("placement preview: " + (await page.evaluate(() => !!(canvas.tokens?.preview?.children?.length))));
await page.mouse.move(230, 420); await page.waitForTimeout(600); await page.mouse.move(250, 450); await page.waitForTimeout(600);   // clear of the Spotlight overlay in the middle
await shot("placement-preview-over-scene");
await page.mouse.click(250, 450); await page.waitForTimeout(3000);
await page.waitForTimeout(2500);
await shot("after-summon");
const after = await page.evaluate(() => ({ tokens: canvas.scene.tokens.size, actors: game.actors.size, summoned: canvas.scene.tokens.contents.filter((t) => t.actor?.flags?.dnd5e?.summon).map((t) => ({ name: t.name, hp: t.actor.system.attributes.hp.max, ac: t.actor.system.attributes.ac.value, items: t.actor.items.size })), slots: game.actors.getName("Walkthrough Medic").system.spells }));
report.after = after;
ok("Animate Dead placed a summoned token on the scene", after.tokens > tokensBefore && after.summoned.length > 0, JSON.stringify(after.summoned).slice(0, 240));
report.errors = errors.slice(0, 8);
writeFileSync(`${OUT}/walkthrough5-result.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ steps: report.steps, after: report.after, errors: report.errors }, null, 1).slice(0, 4500));
await browser.close();
