// Multi-player test: one GM session and two player sessions (a Player and a Trusted Player) in the TEST world at the same time.
// Creates the users "Test Player 1" (Player) and "Test Player 2" (Trusted), no passwords, and scratch documents; removes them afterwards.
// Usage: node dev/harness/multiplayer.mjs
import { chromium } from "playwright-core";
import { foundryStatus } from "./drive.mjs";

const BASE = process.env.FOUNDRY_URL ?? "http://localhost:30000";
const st = await foundryStatus();
if (st?.world !== "test") throw new Error(`refusing: active world is "${st?.world}", not "test"`);

const browser = await chromium.launch({ channel: "msedge", headless: true });
const open = async (user) => {
  const page = await (await browser.newContext({ viewport: { width: 1400, height: 900 } })).newPage();
  await page.goto(`${BASE}/join`);
  await page.selectOption("select[name=userid]", { label: user });
  await page.click("button[name=join]");
  await page.waitForFunction(() => globalThis.game?.ready, null, { timeout: 120000 });
  await page.evaluate(() => { for (const w of Object.values(ui.windows)) w.close({ force: true }); });
  return page;
};
const out = [];
const ok = (n, p, d = "") => { out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`); console.log(out.at(-1)); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let gm, p1, p2;
try {
  gm = await open("Automation");
  // users, only in this test world
  const ids = await gm.evaluate(async () => {
    const want = [["Test Player 1", CONST.USER_ROLES.PLAYER], ["Test Player 2", CONST.USER_ROLES.TRUSTED]];
    for (const [name, role] of want) if (!game.users.getName(name)) await User.create({ name, role });
    return Object.fromEntries(want.map(([n]) => [n, game.users.getName(n).id]));
  });
  p1 = await open("Test Player 1");
  p2 = await open("Test Player 2");
  ok("GM and both players are connected at once", (await gm.evaluate(() => game.users.filter((u) => u.active).length)) >= 3);

  // scratch documents made by the GM
  const setup = await gm.evaluate(async ({ ids }) => {
    const tag = { flags: { op5e: { harnessTest: true, mp: true } } };
    const hero = await Actor.create({ name: "[MP] Hero", type: "character", ownership: { default: 0, [ids["Test Player 1"]]: 3 }, ...tag });
    const secret = await Actor.create({ name: "[MP] Secret", type: "character", ownership: { default: 0 }, ...tag });
    const docs = await game.packs.get("op5e.items").getDocuments();
    const sw = docs.find((d) => d.name === "Longsword") ?? docs.find((d) => d.type === "weapon");
    await hero.createEmbeddedDocuments("Item", [sw.toObject()]);
    return { hero: hero.id, secret: secret.id };
  }, { ids });
  await wait(1500);

  // A. visibility and permissions
  ok("Player sees the character they own", await p1.evaluate((id) => !!game.actors.get(id)?.testUserPermission(game.user, "OWNER"), setup.hero));
  ok("Player cannot see a GM-only character", await p1.evaluate((id) => !game.actors.get(id)?.testUserPermission(game.user, "LIMITED"), setup.secret));
  ok("The other player (not the owner) cannot open that character", await p2.evaluate((id) => !game.actors.get(id)?.testUserPermission(game.user, "OBSERVER"), setup.hero));

  // B. whispers
  await gm.evaluate(async () => {
    await ChatMessage.create({ content: "gm-whisper-xyz", whisper: [game.user.id], flags: { op5e: { harnessTest: true } } });
    await ChatMessage.create({ content: "public-note-xyz", flags: { op5e: { harnessTest: true } } });
  });
  await wait(1500);
  // Foundry core delivers every message to every client and hides whispers from non-recipients (message.visible), so check visibility and the chat screen
  ok("Player cannot see a GM whisper", await p1.evaluate(() => !game.messages.some((m) => /gm-whisper-xyz/.test(m.content) && m.visible) && !document.body.innerText.includes("gm-whisper-xyz")));
  ok("Player receives a public message", await p1.evaluate(() => game.messages.some((m) => /public-note-xyz/.test(m.content) && m.visible)));

  // C. world edits
  const sceneTry = await p1.evaluate(async () => { try { await Scene.create({ name: "[MP] illegal" }); return "created"; } catch { return "refused"; } });
  ok("Player cannot create a scene", sceneTry === "refused", sceneTry);
  const settingTry = await p1.evaluate(async () => { try { await game.settings.set("op5e", "berriesWeightless", true); return "set"; } catch { return "refused"; } });
  ok("Player cannot change a world setting", settingTry === "refused", settingTry);

  // D. compendium
  ok("Player can read the OP5e compendium", await p1.evaluate(async () => (await game.packs.get("op5e.feats").getIndex()).size > 100));
  ok("Player can read the Shop Catalogues journal", await p1.evaluate(async () => {
    const p = game.packs.get("op5e.reference");
    const e = (await p.getIndex()).find((x) => x.name === "Shop Catalogues");
    return !!e && !!(await p.getDocument(e._id));
  }));

  // E. shared combat: the owner rolls initiative, the GM sees it
  const combatIds = await gm.evaluate(async ({ hero }) => {
    const c = await Combat.create({ active: false });
    const [cb] = await c.createEmbeddedDocuments("Combatant", [{ actorId: hero }]);
    return { combat: c.id, cb: cb.id };
  }, { hero: setup.hero });
  await wait(1200);
  await p1.evaluate(async ({ combat, cb }) => { await game.combats.get(combat).rollInitiative([cb]); }, combatIds).catch(() => {});
  await wait(1500);
  ok("Player rolls initiative for their own character; the GM sees it", await gm.evaluate(({ combat, cb }) => game.combats.get(combat).combatants.get(cb).initiative !== null, combatIds));

  // F. a player uses their own weapon: the card reaches the GM
  const n0 = await gm.evaluate(() => game.messages.size);
  const used = await p1.evaluate(async (id) => {
    const it = game.actors.get(id).items.find((i) => i.type === "weapon");
    try { await [...it.system.activities][0].use({}, { configure: false }, {}); return "used"; } catch (e) { return "error " + e.message.slice(0, 80); }
  }, setup.hero);
  await wait(3000);
  const n1 = await gm.evaluate(() => game.messages.size);
  ok("Player uses their weapon; a chat card reaches the GM", used === "used" && n1 > n0, `${used}; ${n0} -> ${n1}`);

  // G. effects across clients
  await gm.evaluate(async (id) => {
    await game.actors.get(id).createEmbeddedDocuments("ActiveEffect", [{ name: "[MP] Test Effect", img: "icons/svg/aura.svg", changes: [{ key: "system.bonuses.mwak.damage", mode: 2, value: "+2" }] }]);
  }, setup.hero);
  await wait(1500);
  ok("An effect the GM adds shows up on the player's client", await p1.evaluate((id) => {
    const a = game.actors.get(id);
    return a.effects.some((e) => e.name === "[MP] Test Effect") && /\+2/.test(a.system.bonuses.mwak.damage);
  }, setup.hero));

  // H. Create OPC is available to players
  for (const [label, page] of [["Player", p1], ["Trusted Player", p2]]) {
    const can = await page.evaluate(() => game.user.can("ACTOR_CREATE"));
    const api = await page.evaluate(() => typeof game.op5eCharacterCreator?.createFromDraft === "function");
    ok(`${label}: Create OPC is available`, api, `can create actors in this world: ${can}`);
  }
} finally {
  if (gm) {
    await gm.evaluate(async () => {
      for (const a of game.actors.filter((x) => x.getFlag("op5e", "mp"))) await a.delete().catch(() => {});
      for (const c of [...game.combats]) await c.delete().catch(() => {});
      await new Promise((r) => setTimeout(r, 2500));   // never delete a chat card while Midi may still update it
      for (const m of game.messages.filter((x) => x.getFlag("op5e", "harnessTest") || /xyz|\[MP\]/.test(x.content))) await m.delete().catch(() => {});
    }).catch(() => {});
  }
  await browser.close();
}
const f = out.filter((l) => l.startsWith("FAIL")).length;
console.log(`MULTIPLAYER: ${out.length - f} pass, ${f} fail`);
process.exit(f ? 1 : 0);
